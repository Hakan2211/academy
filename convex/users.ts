import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'
import { levelForXp } from './gamification'
import { rebuildSummary } from './progress'

// The signed-in user row (or null when signed out). Powers the HUD/chrome.
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null
    return await ctx.db.get(userId)
  },
})

// How many learners the public leaderboard shows.
const LEADERBOARD_SIZE = 50

// Public ranking by lifetime XP. Returns only non-sensitive fields (no email)
// for the top accounts, plus the viewer's own rank so the page can pin a "you"
// row when they fall outside the visible top N. Legacy anonymous device rows
// (no email and no name) are excluded — only real accounts compete.
export const getLeaderboard = query({
  args: {},
  returns: v.object({
    entries: v.array(
      v.object({
        rank: v.number(),
        userId: v.string(),
        name: v.union(v.string(), v.null()),
        image: v.union(v.string(), v.null()),
        level: v.number(),
        totalXP: v.number(),
        currentStreak: v.number(),
        isViewer: v.boolean(),
      }),
    ),
    viewerRank: v.union(v.number(), v.null()), // exact rank within the scanned set
    viewerInTop: v.boolean(),
  }),
  handler: async (ctx) => {
    const viewerId = await getAuthUserId(ctx)

    // Highest XP first. Pull a buffer past the display size so filtering out
    // anonymous rows never starves the board, and the viewer's exact rank is
    // still resolvable a little way past the cut.
    const rows = await ctx.db
      .query('users')
      .withIndex('by_xp')
      .order('desc')
      .take(LEADERBOARD_SIZE * 4)

    const accounts = rows.filter((u) => !!u.email || !!u.name)
    const viewerIdx = viewerId
      ? accounts.findIndex((u) => u._id === viewerId)
      : -1

    const entries = accounts.slice(0, LEADERBOARD_SIZE).map((u, i) => ({
      rank: i + 1,
      userId: u._id,
      name: u.name ?? null,
      image: u.image ?? null,
      level: u.level,
      totalXP: u.totalXP,
      currentStreak: u.currentStreak,
      isViewer: viewerId !== null && u._id === viewerId,
    }))

    return {
      entries,
      viewerRank: viewerIdx >= 0 ? viewerIdx + 1 : null,
      viewerInTop: viewerIdx >= 0 && viewerIdx < LEADERBOARD_SIZE,
    }
  },
})

// Update the signed-in learner's display name (Profile / Settings). Identity
// comes from the auth token, never the client — a user can only edit their own
// row. Trimmed and length-bounded to keep the leaderboard tidy.
export const updateProfile = mutation({
  args: { name: v.string() },
  returns: v.null(),
  handler: async (ctx, { name }) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    const trimmed = name.trim()
    if (trimmed.length === 0) throw new Error('Name cannot be empty.')
    if (trimmed.length > 40) {
      throw new Error('Name must be 40 characters or fewer.')
    }

    await ctx.db.patch(userId, { name: trimmed })
    return null
  },
})

// One-time merge of a device's pre-auth (anonymous) progress into the signed-in
// account. The client calls this right after first sign-in with the legacy
// localStorage deviceId. Idempotent / safe to repeat: it only ever claims a
// *different*, not-yet-an-account anonymous row, then deletes it.
export const claimAnonymousProgress = mutation({
  args: { deviceId: v.string() },
  returns: v.object({ claimed: v.boolean() }),
  handler: async (ctx, { deviceId }) => {
    const authedId = await getAuthUserId(ctx)
    if (!authedId) throw new Error('Not authenticated')

    const anon = await ctx.db
      .query('users')
      .withIndex('by_device', (q) => q.eq('deviceId', deviceId))
      .unique()

    // Nothing to claim: no such row, it's already this account, or it's itself a
    // real account (has an email) rather than a pure anonymous device row.
    if (!anon || anon._id === authedId || anon.email) {
      return { claimed: false }
    }

    const authed = await ctx.db.get(authedId)
    if (!authed) throw new Error('Authenticated user row missing')

    // Re-point lesson progress, dropping any the account already has.
    const anonProgress = await ctx.db
      .query('userProgress')
      .withIndex('by_user', (q) => q.eq('userId', anon._id))
      .collect()
    for (const p of anonProgress) {
      const dupe = await ctx.db
        .query('userProgress')
        .withIndex('by_user_lesson', (q) =>
          q.eq('userId', authedId).eq('lessonId', p.lessonId),
        )
        .unique()
      if (dupe) await ctx.db.delete(p._id)
      else await ctx.db.patch(p._id, { userId: authedId })
    }

    // Re-point review schedule, dropping items the account already tracks.
    const anonReviews = await ctx.db
      .query('reviewState')
      .withIndex('by_user', (q) => q.eq('userId', anon._id))
      .collect()
    for (const r of anonReviews) {
      const dupe = await ctx.db
        .query('reviewState')
        .withIndex('by_user_item', (q) =>
          q.eq('userId', authedId).eq('itemId', r.itemId),
        )
        .unique()
      if (dupe) await ctx.db.delete(r._id)
      else await ctx.db.patch(r._id, { userId: authedId })
    }

    // Merge gamification: take the better of each, union badges, keep the later
    // activity date. Correct for any real anon→account upgrade.
    const totalXP = Math.max(authed.totalXP, anon.totalXP)
    const dates = [authed.lastActivityDate, anon.lastActivityDate]
      .filter((d): d is string => !!d)
      .sort()
    await ctx.db.patch(authedId, {
      totalXP,
      level: levelForXp(totalXP),
      currentStreak: Math.max(authed.currentStreak, anon.currentStreak),
      longestStreak: Math.max(authed.longestStreak, anon.longestStreak),
      badges: Array.from(new Set([...authed.badges, ...anon.badges])),
      ...(dates.length ? { lastActivityDate: dates[dates.length - 1] } : {}),
    })

    // The bulk merge above changed completed lessons wholesale — rebuild the
    // denormalized progress summary so the lean reads stay correct.
    await rebuildSummary(ctx, authedId)

    // The anonymous row is now empty — remove it.
    await ctx.db.delete(anon._id)
    return { claimed: true }
  },
})
