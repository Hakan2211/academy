import { internalMutation, mutation, query } from './_generated/server'
import { v } from 'convex/values'
import type { Doc, Id } from './_generated/dataModel'
import type { MutationCtx, QueryCtx } from './_generated/server'
import { getAuthUserId } from '@convex-dev/auth/server'
import { levelForXp, streakTransition } from './gamification'
import { assertLessonPlayable } from './entitlements'

// Resolve the signed-in user row, or throw. Identity comes from the auth token
// (ctx.auth), not a client-supplied id.
async function requireUser(ctx: MutationCtx): Promise<Doc<'users'>> {
  const userId = await getAuthUserId(ctx)
  if (!userId) throw new Error('Not authenticated')
  const user = await ctx.db.get(userId)
  if (!user) throw new Error('Authenticated user row missing')
  return user
}

// ── progressSummary maintenance ──────────────────────────────────────────────
// The summary is a tiny projection of userProgress (see schema.ts) that keeps
// read bandwidth flat: subscribed UI reads ONE doc, and per-step writes don't
// touch it (only completions do).

// Build summary fields from the source-of-truth userProgress rows.
async function computeSummary(ctx: QueryCtx | MutationCtx, userId: Id<'users'>) {
  const rows = await ctx.db
    .query('userProgress')
    .withIndex('by_user', (q) => q.eq('userId', userId))
    .collect()
  const completedLessonIds = rows
    .filter((p) => p.completed)
    .map((p) => p.lessonId as string)
  return {
    completedLessonIds,
    completedCount: completedLessonIds.length,
    hasAnyProgress: rows.length > 0,
  }
}

// Get the user's summary doc, creating it from userProgress on first touch
// (one-time migration cost for accounts that predate the summary table).
export async function ensureSummary(
  ctx: MutationCtx,
  userId: Id<'users'>,
): Promise<Doc<'progressSummary'>> {
  const existing = await ctx.db
    .query('progressSummary')
    .withIndex('by_user', (q) => q.eq('userId', userId))
    .unique()
  if (existing) return existing
  const id = await ctx.db.insert('progressSummary', {
    userId,
    ...(await computeSummary(ctx, userId)),
  })
  return (await ctx.db.get(id))!
}

// Rebuild from scratch — used after bulk merges (claimAnonymousProgress).
export async function rebuildSummary(ctx: MutationCtx, userId: Id<'users'>) {
  const fields = await computeSummary(ctx, userId)
  const existing = await ctx.db
    .query('progressSummary')
    .withIndex('by_user', (q) => q.eq('userId', userId))
    .unique()
  if (existing) await ctx.db.patch(existing._id, fields)
  else await ctx.db.insert('progressSummary', { userId, ...fields })
}

// One-time migration: build a summary for every existing user.
// Run with: npx convex run progress:backfillSummaries
export const backfillSummaries = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect()
    let built = 0
    for (const user of users) {
      await rebuildSummary(ctx, user._id)
      built++
    }
    return built
  },
})

// ── lean per-user reads (replaces the old getProgressForUser full scan) ─────

// The completed-lesson id set, as strings. One small doc read; only changes
// when a lesson is COMPLETED (not per step). Falls back to computing from
// userProgress for accounts whose summary hasn't been built yet.
export const getCompletedLessons = query({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []
    const summary = await ctx.db
      .query('progressSummary')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .unique()
    if (summary) return summary.completedLessonIds
    return (await computeSummary(ctx, userId)).completedLessonIds
  },
})

// The step cursor for ONE lesson (the player's resume point). A point read via
// by_user_lesson, so per-step writes only re-run THIS query — never the
// set-of-everything subscriptions on other screens.
export const getLessonProgress = query({
  args: { contentSlug: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      currentStep: v.number(),
      totalSteps: v.number(),
      completed: v.boolean(),
    }),
  ),
  handler: async (ctx, { contentSlug }) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null
    const lesson = await ctx.db
      .query('lessons')
      .withIndex('by_contentSlug', (q) => q.eq('contentSlug', contentSlug))
      .unique()
    if (!lesson) return null
    const progress = await ctx.db
      .query('userProgress')
      .withIndex('by_user_lesson', (q) =>
        q.eq('userId', userId).eq('lessonId', lesson._id),
      )
      .unique()
    if (!progress) return null
    return {
      currentStep: progress.currentStep,
      totalSteps: progress.totalSteps,
      completed: progress.completed,
    }
  },
})

// Gamification snapshot for the persistent stat bar (level/XP/streak/badges).
// Returns null when signed out so the UI can show a "Lv.1 · 0 XP" target
// instead of hiding. The data already lives denormalized on the user row.
export const getUserStats = query({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      totalXP: v.number(),
      level: v.number(),
      currentStreak: v.number(),
      longestStreak: v.number(),
      lastActivityDate: v.union(v.string(), v.null()),
      badges: v.array(v.string()),
    }),
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null
    const user = await ctx.db.get(userId)
    if (!user) return null
    return {
      totalXP: user.totalXP,
      level: user.level,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      lastActivityDate: user.lastActivityDate ?? null,
      badges: user.badges,
    }
  },
})

// Advance the saved cursor. Monotonic (never moves backwards), awards no XP.
export const recordStepCompletion = mutation({
  args: {
    lessonId: v.id('lessons'),
    stepIndex: v.number(),
    totalSteps: v.number(),
  },
  handler: async (ctx, { lessonId, stepIndex, totalSteps }) => {
    const user = await requireUser(ctx)
    // Premium enforcement: free users can't accrue progress on premium lessons
    // (the UI hides them, but this is the integrity boundary).
    const lesson = await ctx.db.get(lessonId)
    if (!lesson) throw new Error('Lesson not found')
    await assertLessonPlayable(ctx, lesson)
    const existing = await ctx.db
      .query('userProgress')
      .withIndex('by_user_lesson', (q) =>
        q.eq('userId', user._id).eq('lessonId', lessonId),
      )
      .unique()

    const nextStep = Math.max(existing?.currentStep ?? 0, stepIndex + 1)
    if (existing) {
      await ctx.db.patch(existing._id, { currentStep: nextStep, totalSteps })
    } else {
      await ctx.db.insert('userProgress', {
        userId: user._id,
        lessonId,
        currentStep: nextStep,
        totalSteps,
        completed: false,
        xpEarned: 0,
        startedAt: Date.now(),
      })
      // First time touching this lesson: flag "has started something" on the
      // summary (write only when the flag actually flips, so steady-state step
      // writes never touch the summary doc).
      const summary = await ensureSummary(ctx, user._id)
      if (!summary.hasAnyProgress) {
        await ctx.db.patch(summary._id, { hasAnyProgress: true })
      }
    }
    return null
  },
})

export type CompleteLessonResult = {
  xpAwarded: number
  totalXP: number
  level: number
  leveledUp: boolean
  currentStreak: number
  longestStreak: number
  newBadges: Array<string>
}

// Finalize a lesson: award XP once (idempotent), update streak/level/badges,
// and return the deltas so the client can animate the reward screen.
export const completeLesson = mutation({
  args: {
    lessonId: v.id('lessons'),
    localDate: v.string(), // "YYYY-MM-DD" from the client's local clock
  },
  handler: async (ctx, { lessonId, localDate }): Promise<CompleteLessonResult> => {
    const user = await requireUser(ctx)
    const lesson = await ctx.db.get(lessonId)
    if (!lesson) throw new Error('Lesson not found')
    // Premium enforcement before any award path — XP/streaks/badges integrity.
    await assertLessonPlayable(ctx, lesson)

    const progress = await ctx.db
      .query('userProgress')
      .withIndex('by_user_lesson', (q) =>
        q.eq('userId', user._id).eq('lessonId', lessonId),
      )
      .unique()

    // Idempotent: already completed -> no double award.
    if (progress?.completed) {
      return {
        xpAwarded: 0,
        totalXP: user.totalXP,
        level: user.level,
        leveledUp: false,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        newBadges: [],
      }
    }

    const xpAwarded = lesson.xpReward
    if (progress) {
      await ctx.db.patch(progress._id, {
        completed: true,
        completedAt: Date.now(),
        xpEarned: xpAwarded,
        currentStep: progress.totalSteps,
      })
    } else {
      await ctx.db.insert('userProgress', {
        userId: user._id,
        lessonId,
        currentStep: 0,
        totalSteps: 0,
        completed: true,
        xpEarned: xpAwarded,
        startedAt: Date.now(),
        completedAt: Date.now(),
      })
    }

    // XP + level
    const oldLevel = user.level
    const totalXP = user.totalXP + xpAwarded
    const level = levelForXp(totalXP)
    const leveledUp = level > oldLevel

    // Streak
    const transition = streakTransition(user.lastActivityDate, localDate)
    let currentStreak = user.currentStreak
    if (transition === 'inc') currentStreak = user.currentStreak + 1
    else if (transition === 'start' || transition === 'reset') currentStreak = 1
    const longestStreak = Math.max(user.longestStreak, currentStreak)

    // Progress summary: append this lesson to the completed set (the one write
    // that fans out to the subscribed progress-colour queries).
    const summary = await ensureSummary(ctx, user._id)
    const completedIds = new Set(summary.completedLessonIds)
    completedIds.add(lessonId as string)
    await ctx.db.patch(summary._id, {
      completedLessonIds: [...completedIds],
      completedCount: completedIds.size,
      hasAnyProgress: true,
    })

    // Badges
    const badges = [...user.badges]
    const newBadges: Array<string> = []
    const award = (key: string) => {
      if (!badges.includes(key)) {
        badges.push(key)
        newBadges.push(key)
      }
    }
    award('first-lesson')

    // Per-category badge (`unit-<unitSlug>`): awarded when every published
    // lesson in this lesson's unit is now complete. The completed set comes
    // from the summary doc (updated above) — NOT a full userProgress scan.
    const unit = await ctx.db.get(lesson.unitId)
    if (unit) {
      const unitLessons = (
        await ctx.db
          .query('lessons')
          .withIndex('by_unit', (q) => q.eq('unitId', lesson.unitId))
          .collect()
      ).filter((l) => l.isPublished)
      if (
        unitLessons.length > 0 &&
        unitLessons.every((l) => completedIds.has(l._id as string))
      ) {
        award(`unit-${unit.slug}`)
      }
    }

    await ctx.db.patch(user._id, {
      totalXP,
      level,
      currentStreak,
      longestStreak,
      lastActivityDate: localDate,
      badges,
    })

    return {
      xpAwarded,
      totalXP,
      level,
      leveledUp,
      currentStreak,
      longestStreak,
      newBadges,
    }
  },
})
