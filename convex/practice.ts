import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'
import { viewerIsPremium } from './entitlements'

// Practice = spaced retrieval review. Item *content* is static (the generated
// bank in src/content/practice); this module only owns the per-user schedule
// (reviewState) with a small SM-2-lite scheduler.

// Add N days to a "YYYY-MM-DD" string. Pure (no Date.now) — constructs from the
// explicit parts so it stays deterministic.
function addDays(ymd: string, days: number): string {
  const [y, m, d] = ymd.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + days)
  return dt.toISOString().slice(0, 10)
}

// The user's review schedule (one entry per practiced item). Returns [] when
// signed out so the client can treat every unlocked item as "new/due".
export const getReviewStates = query({
  args: {},
  returns: v.array(
    v.object({
      itemId: v.string(),
      dueDate: v.string(),
      reps: v.number(),
      ease: v.number(),
      intervalDays: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []
    // Practice is a premium feature — free users get the same graceful empty
    // contract as signed-out visitors (the route shows the upgrade gate).
    if (!(await viewerIsPremium(ctx))) return []
    const rows = await ctx.db
      .query('reviewState')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()
    return rows.map((r) => ({
      itemId: r.itemId,
      dueDate: r.dueDate,
      reps: r.reps,
      ease: r.ease,
      intervalDays: r.intervalDays,
    }))
  },
})

// Grade one review and reschedule it (SM-2-lite). `correct` from the learner's
// first answer; `localDate` is the client's "YYYY-MM-DD". Returns the next due
// date (or null if signed out).
export const gradeItem = mutation({
  args: {
    itemId: v.string(),
    correct: v.boolean(),
    localDate: v.string(),
  },
  returns: v.union(v.null(), v.object({ dueDate: v.string(), intervalDays: v.number() })),
  handler: async (ctx, { itemId, correct, localDate }) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null
    // Premium-only (mirrors getReviewStates): no schedule writes on free tier.
    if (!(await viewerIsPremium(ctx))) return null

    const existing = await ctx.db
      .query('reviewState')
      .withIndex('by_user_item', (q) =>
        q.eq('userId', userId).eq('itemId', itemId),
      )
      .unique()

    let ease = existing?.ease ?? 2.5
    let reps = existing?.reps ?? 0
    let lapses = existing?.lapses ?? 0
    let intervalDays: number

    if (correct) {
      reps += 1
      ease = Math.min(2.8, ease + 0.05)
      intervalDays =
        reps === 1 ? 1 : reps === 2 ? 3 : Math.round((existing?.intervalDays ?? 1) * ease)
    } else {
      reps = 0
      lapses += 1
      ease = Math.max(1.3, ease - 0.2)
      intervalDays = 0 // resurfaces today
    }

    const dueDate = addDays(localDate, intervalDays)
    const patch = {
      ease,
      intervalDays,
      dueDate,
      reps,
      lapses,
      lastReviewed: localDate,
    }

    if (existing) {
      await ctx.db.patch(existing._id, patch)
    } else {
      await ctx.db.insert('reviewState', { userId, itemId, ...patch })
    }
    return { dueDate, intervalDays }
  },
})
