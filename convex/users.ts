import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Called once on app load. Idempotent: returns the existing user for a device,
// or creates a fresh anonymous one.
export const getOrCreateByDevice = mutation({
  args: { deviceId: v.string() },
  handler: async (ctx, { deviceId }) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_device', (q) => q.eq('deviceId', deviceId))
      .unique()
    if (existing) return existing._id

    return await ctx.db.insert('users', {
      deviceId,
      createdAt: Date.now(),
      totalXP: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      badges: [],
    })
  },
})

export const getUser = query({
  args: { deviceId: v.string() },
  handler: async (ctx, { deviceId }) => {
    return await ctx.db
      .query('users')
      .withIndex('by_device', (q) => q.eq('deviceId', deviceId))
      .unique()
  },
})
