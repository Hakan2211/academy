import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

// Content catalog (static structure) + anonymous user state + progress/gamification.
// Lesson *content* lives in MDX files (src/content/lessons); the `lessons` table
// only stores metadata and a `contentSlug` pointer into that MDX.
export default defineSchema({
  subjects: defineTable({
    slug: v.string(), // "physics"
    name: v.string(), // "Physics"
    description: v.string(),
    color: v.string(), // accent hex for cards / path
    icon: v.string(), // lucide-react icon key, e.g. "Atom"
    order: v.number(),
    isPublished: v.boolean(), // Phase 1: only physics is true
  }).index('by_slug', ['slug']),

  units: defineTable({
    subjectId: v.id('subjects'),
    slug: v.string(),
    name: v.string(), // "Oscillations & Waves"
    order: v.number(),
    // Category-card presentation (all optional for backward-compat). A unit IS
    // a navigable "category" with its own table of contents.
    description: v.optional(v.string()), // 1-line blurb on the category card
    icon: v.optional(v.string()), // lucide-react key, e.g. "Move"
    accentColor: v.optional(v.string()), // per-category accent hex
    levelRange: v.optional(v.string()), // display, e.g. "Beginner → Advanced"
  }).index('by_subject', ['subjectId', 'order']),

  // Metadata only — content is the MDX addressed by contentSlug.
  lessons: defineTable({
    subjectId: v.id('subjects'),
    unitId: v.id('units'),
    contentSlug: v.string(), // "physics/simple-harmonic-motion" -> resolves MDX module
    title: v.string(),
    summary: v.string(),
    order: v.number(),
    estimatedMinutes: v.number(),
    xpReward: v.number(),
    isPublished: v.boolean(),
    // Curriculum metadata (optional for backward-compat). UI defaults a missing
    // level to "beginner" and a missing format to "core".
    level: v.optional(
      v.union(
        v.literal('beginner'),
        v.literal('intermediate'),
        v.literal('advanced'),
      ),
    ),
    format: v.optional(v.union(v.literal('core'), v.literal('deepdive'))),
  })
    .index('by_subject', ['subjectId', 'order'])
    .index('by_unit', ['unitId', 'order'])
    .index('by_contentSlug', ['contentSlug']),

  // Anonymous, device-keyed identity. `authId` is reserved for a future
  // Better Auth migration (look up by authId, else deviceId, then backfill).
  users: defineTable({
    deviceId: v.string(), // crypto.randomUUID stored in localStorage
    authId: v.optional(v.string()), // FUTURE: real account subject id
    displayName: v.optional(v.string()),
    createdAt: v.number(),

    // Gamification denormalized onto the user row (single-doc reads).
    totalXP: v.number(),
    level: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastActivityDate: v.optional(v.string()), // "YYYY-MM-DD" in the user's local tz
    badges: v.array(v.string()), // badge keys, e.g. ["first-lesson","unit-oscillations"]
  })
    .index('by_device', ['deviceId'])
    .index('by_auth', ['authId']),

  userProgress: defineTable({
    userId: v.id('users'),
    lessonId: v.id('lessons'),
    currentStep: v.number(), // 0-based index into the lesson's steps
    totalSteps: v.number(),
    completed: v.boolean(),
    xpEarned: v.number(), // XP already granted for THIS lesson (idempotency)
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index('by_user', ['userId'])
    .index('by_user_lesson', ['userId', 'lessonId']),

  // Spaced-retrieval schedule for the Practice route. One row per (user, item),
  // where itemId is a practice-bank id (= a lesson's contentSlug for now). The
  // item *content* is static (src/content/practice/bank.generated.ts); only the
  // per-user schedule lives here. SM-2-lite: ease/interval/dueDate.
  reviewState: defineTable({
    userId: v.id('users'),
    itemId: v.string(),
    ease: v.number(), // SM-2 ease factor (starts 2.5, floor 1.3)
    intervalDays: v.number(),
    dueDate: v.string(), // "YYYY-MM-DD" (local)
    reps: v.number(), // consecutive correct reps
    lapses: v.number(),
    lastReviewed: v.optional(v.string()),
  })
    .index('by_user', ['userId'])
    .index('by_user_item', ['userId', 'itemId']),
})
