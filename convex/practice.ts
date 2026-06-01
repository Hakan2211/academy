import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

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

// The user's review schedule (one entry per practiced item). Returns [] for an
// unknown device so the client can treat every unlocked item as "new/due".
export const getReviewStates = query({
  args: { deviceId: v.string() },
  returns: v.array(
    v.object({
      itemId: v.string(),
      dueDate: v.string(),
      reps: v.number(),
      ease: v.number(),
      intervalDays: v.number(),
    }),
  ),
  handler: async (ctx, { deviceId }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_device', (q) => q.eq('deviceId', deviceId))
      .unique()
    if (!user) return []
    const rows = await ctx.db
      .query('reviewState')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
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
// date (or null if the device has no user row yet).
export const gradeItem = mutation({
  args: {
    deviceId: v.string(),
    itemId: v.string(),
    correct: v.boolean(),
    localDate: v.string(),
  },
  returns: v.union(v.null(), v.object({ dueDate: v.string(), intervalDays: v.number() })),
  handler: async (ctx, { deviceId, itemId, correct, localDate }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_device', (q) => q.eq('deviceId', deviceId))
      .unique()
    if (!user) return null

    const existing = await ctx.db
      .query('reviewState')
      .withIndex('by_user_item', (q) =>
        q.eq('userId', user._id).eq('itemId', itemId),
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
      await ctx.db.insert('reviewState', { userId: user._id, itemId, ...patch })
    }
    return { dueDate, intervalDays }
  },
})
