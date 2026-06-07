import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { authTables } from '@convex-dev/auth/server'

// Content catalog (static structure) + authenticated user state + progress/gamification.
// Lesson *content* lives in MDX files (src/content/lessons); the `lessons` table
// only stores metadata and a `contentSlug` pointer into that MDX.
export default defineSchema({
  // Convex Auth tables (authSessions/authAccounts/authVerificationCodes/...).
  // We override `users` below to carry our gamification fields.
  ...authTables,

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
    .index('by_contentSlug', ['contentSlug'])
    // Full-text lesson search for the Discover page. Filter fields let us scope
    // to published lessons (always) and to one subject (when a chip is active).
    .searchIndex('search_title', {
      searchField: 'title',
      filterFields: ['isPublished', 'subjectId'],
    }),

  // The authenticated user. The signed-in identity (getAuthUserId) IS this row.
  // Overrides Convex Auth's default `users` table to also carry gamification.
  users: defineTable({
    // Auth profile fields (populated from the provider via createOrUpdateUser).
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),

    // Legacy anonymous identity. Now only used to claim a device's pre-auth
    // progress into the account on first sign-in (users.claimAnonymousProgress).
    deviceId: v.optional(v.string()),
    createdAt: v.number(),

    // Gamification denormalized onto the user row (single-doc reads).
    totalXP: v.number(),
    level: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastActivityDate: v.optional(v.string()), // "YYYY-MM-DD" in the user's local tz
    badges: v.array(v.string()), // badge keys, e.g. ["first-lesson","unit-oscillations"]

    // Billing (lifetime unlock — one-time Stripe payment, no subscription).
    // Granted by the Stripe webhook (http.ts -> billing.grantLifetime); absent
    // means free tier. premiumSince is set once and never overwritten.
    isPremium: v.optional(v.boolean()),
    premiumSince: v.optional(v.number()),
    stripeCustomerId: v.optional(v.string()),
  })
    .index('email', ['email']) // account linking + createOrUpdateUser lookup
    .index('by_device', ['deviceId']) // one-time anonymous-progress claim
    .index('by_xp', ['totalXP']), // leaderboard ranking (read .order('desc'))

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

  // BANDWIDTH-CRITICAL denormalization: one small doc per user holding the
  // completed-lesson id set. Every screen that colours progress (overworld,
  // trail, Discover, Dashboard, Practice, Profile) reads THIS one doc instead
  // of collecting the user's whole userProgress range — and, crucially, it only
  // changes on lesson COMPLETION, so per-step writes (recordStepCompletion)
  // no longer invalidate those subscriptions. userProgress stays the source of
  // truth (step cursors, timestamps, XP idempotency); this is a projection.
  progressSummary: defineTable({
    userId: v.id('users'),
    completedLessonIds: v.array(v.string()), // Id<'lessons'> as strings
    completedCount: v.number(),
    hasAnyProgress: v.boolean(), // any lesson ever started (resume-point state)
  }).index('by_user', ['userId']),

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
