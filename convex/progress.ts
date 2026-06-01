import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import type { Doc } from './_generated/dataModel'
import type { MutationCtx } from './_generated/server'
import { levelForXp, streakTransition } from './gamification'

async function requireUser(
  ctx: MutationCtx,
  deviceId: string,
): Promise<Doc<'users'>> {
  const user = await ctx.db
    .query('users')
    .withIndex('by_device', (q) => q.eq('deviceId', deviceId))
    .unique()
  if (!user) throw new Error(`No user for device ${deviceId}`)
  return user
}

export const getProgressForUser = query({
  args: { deviceId: v.string() },
  handler: async (ctx, { deviceId }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_device', (q) => q.eq('deviceId', deviceId))
      .unique()
    if (!user) return []
    return await ctx.db
      .query('userProgress')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect()
  },
})

// Gamification snapshot for the persistent stat bar (level/XP/streak/badges).
// Returns null for an unknown device so the UI can show a "Lv.1 · 0 XP" target
// instead of hiding. The data already lives denormalized on the user row.
export const getUserStats = query({
  args: { deviceId: v.string() },
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
  handler: async (ctx, { deviceId }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_device', (q) => q.eq('deviceId', deviceId))
      .unique()
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
    deviceId: v.string(),
    lessonId: v.id('lessons'),
    stepIndex: v.number(),
    totalSteps: v.number(),
  },
  handler: async (ctx, { deviceId, lessonId, stepIndex, totalSteps }) => {
    const user = await requireUser(ctx, deviceId)
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
    deviceId: v.string(),
    lessonId: v.id('lessons'),
    localDate: v.string(), // "YYYY-MM-DD" from the client's local clock
  },
  handler: async (ctx, { deviceId, lessonId, localDate }): Promise<CompleteLessonResult> => {
    const user = await requireUser(ctx, deviceId)
    const lesson = await ctx.db.get(lessonId)
    if (!lesson) throw new Error('Lesson not found')

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
    // lesson in this lesson's unit is now complete. Reads-after-writes are
    // visible within the mutation, but we add this lesson explicitly to be safe.
    const unit = await ctx.db.get(lesson.unitId)
    if (unit) {
      const unitLessons = (
        await ctx.db
          .query('lessons')
          .withIndex('by_unit', (q) => q.eq('unitId', lesson.unitId))
          .collect()
      ).filter((l) => l.isPublished)
      const myProgress = await ctx.db
        .query('userProgress')
        .withIndex('by_user', (q) => q.eq('userId', user._id))
        .collect()
      const completedIds = new Set(
        myProgress.filter((p) => p.completed).map((p) => p.lessonId),
      )
      completedIds.add(lessonId)
      if (
        unitLessons.length > 0 &&
        unitLessons.every((l) => completedIds.has(l._id))
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
