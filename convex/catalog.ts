import { query } from './_generated/server'
import { v } from 'convex/values'
import type { Id } from './_generated/dataModel'
import { getAuthUserId } from '@convex-dev/auth/server'

export const listSubjects = query({
  args: {},
  handler: async (ctx) => {
    const subjects = await ctx.db.query('subjects').collect()
    return subjects.sort((a, b) => a.order - b.order)
  },
})

// Subject + its published lessons (ordered). Per-user progress is fetched
// separately (progress.getProgressForUser) so this query stays cacheable and
// SSR-prefetchable without a device id.
export const getSubjectPath = query({
  args: { subjectSlug: v.string() },
  handler: async (ctx, { subjectSlug }) => {
    const subject = await ctx.db
      .query('subjects')
      .withIndex('by_slug', (q) => q.eq('slug', subjectSlug))
      .unique()
    if (!subject) return null

    const units = (
      await ctx.db
        .query('units')
        .withIndex('by_subject', (q) => q.eq('subjectId', subject._id))
        .collect()
    ).sort((a, b) => a.order - b.order)

    const lessons = (
      await ctx.db
        .query('lessons')
        .withIndex('by_subject', (q) => q.eq('subjectId', subject._id))
        .collect()
    )
      .filter((l) => l.isPublished)
      .sort((a, b) => a.order - b.order)

    return { subject, units, lessons }
  },
})

// Subject + its categories (units) for the category grid. Each unit carries a
// published `lessonCount` (the progress denominator) and the published
// `lessonIds` so the client can count completed lessons from per-device
// progress without this query needing a device id.
export const getSubjectOverview = query({
  args: { subjectSlug: v.string() },
  handler: async (ctx, { subjectSlug }) => {
    const subject = await ctx.db
      .query('subjects')
      .withIndex('by_slug', (q) => q.eq('slug', subjectSlug))
      .unique()
    if (!subject) return null

    const units = (
      await ctx.db
        .query('units')
        .withIndex('by_subject', (q) => q.eq('subjectId', subject._id))
        .collect()
    ).sort((a, b) => a.order - b.order)

    const unitsWithCounts = await Promise.all(
      units.map(async (unit) => {
        const published = (
          await ctx.db
            .query('lessons')
            .withIndex('by_unit', (q) => q.eq('unitId', unit._id))
            .collect()
        ).filter((l) => l.isPublished)
        return {
          ...unit,
          lessonCount: published.length,
          lessonIds: published.map((l) => l._id),
        }
      }),
    )

    return { subject, units: unitsWithCounts }
  },
})

// One category's full table of contents: every lesson in the unit (published
// roadmap included), ordered. Unpublished rows render as "coming soon" nodes.
export const getCategoryPath = query({
  args: { subjectSlug: v.string(), unitSlug: v.string() },
  handler: async (ctx, { subjectSlug, unitSlug }) => {
    const subject = await ctx.db
      .query('subjects')
      .withIndex('by_slug', (q) => q.eq('slug', subjectSlug))
      .unique()
    if (!subject) return null

    const units = (
      await ctx.db
        .query('units')
        .withIndex('by_subject', (q) => q.eq('subjectId', subject._id))
        .collect()
    ).sort((a, b) => a.order - b.order)
    const idx = units.findIndex((u) => u.slug === unitSlug)
    if (idx < 0) return null
    const unit = units[idx]
    const next = units[idx + 1] ?? null // next category by curriculum order

    const lessons = (
      await ctx.db
        .query('lessons')
        .withIndex('by_unit', (q) => q.eq('unitId', unit._id))
        .collect()
    ).sort((a, b) => a.order - b.order)

    // Flat next-unit fields (a nested nullable object would be dropped by the
    // client-visible return-type inference — see getResumePoint).
    return {
      subject,
      unit,
      lessons,
      nextUnitSlug: next ? next.slug : null,
      nextUnitName: next ? next.name : null,
    }
  },
})

// The "resume point" for a subject's journey: the first incomplete published
// lesson, scanned by unit order then lesson order. Powers the home Continue card
// and (later) the overworld's "current" marker. Works without a user row yet
// (treats an unknown device as zero progress -> a fresh "start" target).
type ResumeLesson = {
  contentSlug: string
  title: string
  unitSlug: string
  unitName: string
  accentColor: string
  lessonNumber: number // 1-based position among published lessons in the unit
  unitLessonCount: number
}

export const getResumePoint = query({
  args: { subjectSlug: v.string() },
  // NOTE: the resume-lesson fields are kept FLAT (top-level), not grouped under a
  // nested `lesson` object. A `v.object` nested inside a union-typed field gets
  // dropped by Convex's return-type inference (the branch collapses to `never` on
  // the client), so flat primitive-or-null fields are the reliable shape here.
  // They are all non-null together for 'start'/'continue' and all null for 'done'.
  returns: v.union(
    v.null(),
    v.object({
      state: v.union(
        v.literal('start'),
        v.literal('continue'),
        v.literal('done'),
      ),
      contentSlug: v.union(v.string(), v.null()),
      title: v.union(v.string(), v.null()),
      unitSlug: v.union(v.string(), v.null()),
      unitName: v.union(v.string(), v.null()),
      accentColor: v.union(v.string(), v.null()),
      lessonNumber: v.union(v.number(), v.null()),
      unitLessonCount: v.union(v.number(), v.null()),
    }),
  ),
  handler: async (ctx, { subjectSlug }) => {
    const subject = await ctx.db
      .query('subjects')
      .withIndex('by_slug', (q) => q.eq('slug', subjectSlug))
      .unique()
    if (!subject) return null

    const units = (
      await ctx.db
        .query('units')
        .withIndex('by_subject', (q) => q.eq('subjectId', subject._id))
        .collect()
    ).sort((a, b) => a.order - b.order)

    // Completed lesson ids + whether the signed-in user has touched anything.
    const userId = await getAuthUserId(ctx)
    const completed = new Set<string>()
    let anyProgress = false
    if (userId) {
      const progress = await ctx.db
        .query('userProgress')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .collect()
      anyProgress = progress.length > 0
      for (const p of progress) if (p.completed) completed.add(p.lessonId)
    }

    let resume: ResumeLesson | null = null
    let hasAnyPublished = false
    let incompleteExists = false
    for (const unit of units) {
      const published = (
        await ctx.db
          .query('lessons')
          .withIndex('by_unit', (q) => q.eq('unitId', unit._id))
          .collect()
      )
        .filter((l) => l.isPublished)
        .sort((a, b) => a.order - b.order)

      for (let i = 0; i < published.length; i++) {
        const l = published[i]
        hasAnyPublished = true
        if (!completed.has(l._id)) {
          incompleteExists = true
          if (!resume) {
            resume = {
              contentSlug: l.contentSlug,
              title: l.title,
              unitSlug: unit.slug,
              unitName: unit.name,
              accentColor: unit.accentColor ?? subject.color,
              lessonNumber: i + 1,
              unitLessonCount: published.length,
            }
          }
        }
      }
    }

    if (!hasAnyPublished) return null
    const state: 'start' | 'continue' | 'done' = !incompleteExists
      ? 'done'
      : anyProgress
        ? 'continue'
        : 'start'
    // `resume` is non-null for 'start'/'continue' (there's an incomplete lesson)
    // and null for 'done'; flatten it so the fields travel without a nested
    // object (a nested object inside a union-typed field is dropped by Convex's
    // return-type inference on the client).
    return {
      state,
      contentSlug: resume ? resume.contentSlug : null,
      title: resume ? resume.title : null,
      unitSlug: resume ? resume.unitSlug : null,
      unitName: resume ? resume.unitName : null,
      accentColor: resume ? resume.accentColor : null,
      lessonNumber: resume ? resume.lessonNumber : null,
      unitLessonCount: resume ? resume.unitLessonCount : null,
    }
  },
})

// The whole published catalog for the Discover browser: every subject with its
// ordered units (card fields + published lessonCount + lessonIds so the client
// can colour progress from getProgressForUser). Lightweight — unit metadata
// only, no lesson titles (those come from searchLessons on demand).
export const getCatalog = query({
  args: {},
  handler: async (ctx) => {
    const subjects = (await ctx.db.query('subjects').collect()).sort(
      (a, b) => a.order - b.order,
    )

    return await Promise.all(
      subjects.map(async (subject) => {
        const units = (
          await ctx.db
            .query('units')
            .withIndex('by_subject', (q) => q.eq('subjectId', subject._id))
            .collect()
        ).sort((a, b) => a.order - b.order)

        const unitsWithCounts = await Promise.all(
          units.map(async (unit) => {
            const published = (
              await ctx.db
                .query('lessons')
                .withIndex('by_unit', (q) => q.eq('unitId', unit._id))
                .collect()
            ).filter((l) => l.isPublished)
            return {
              slug: unit.slug,
              name: unit.name,
              icon: unit.icon ?? null,
              accentColor: unit.accentColor ?? null,
              description: unit.description ?? null,
              levelRange: unit.levelRange ?? null,
              lessonCount: published.length,
              lessonIds: published.map((l) => l._id),
            }
          }),
        )

        const lessonTotal = unitsWithCounts.reduce(
          (sum, u) => sum + u.lessonCount,
          0,
        )

        return {
          slug: subject.slug,
          name: subject.name,
          description: subject.description,
          color: subject.color,
          icon: subject.icon,
          order: subject.order,
          isPublished: subject.isPublished,
          unitCount: unitsWithCounts.length,
          lessonTotal,
          units: unitsWithCounts,
        }
      }),
    )
  },
})

// Full-text search over published lesson titles (Discover search box). Joins
// each hit back to its unit + subject so the result card can show a breadcrumb,
// its category accent, and link straight into the lesson player. Empty term →
// no results; optional subjectSlug scopes the search to one subject.
export const searchLessons = query({
  args: { term: v.string(), subjectSlug: v.optional(v.string()) },
  handler: async (ctx, { term, subjectSlug }) => {
    const q = term.trim()
    if (q.length === 0) return []

    let subjectId: Id<'subjects'> | undefined
    if (subjectSlug) {
      const subject = await ctx.db
        .query('subjects')
        .withIndex('by_slug', (x) => x.eq('slug', subjectSlug))
        .unique()
      if (!subject) return []
      subjectId = subject._id
    }

    const matches = await ctx.db
      .query('lessons')
      .withSearchIndex('search_title', (s) =>
        subjectId
          ? s.search('title', q).eq('isPublished', true).eq('subjectId', subjectId)
          : s.search('title', q).eq('isPublished', true),
      )
      .take(24)

    return await Promise.all(
      matches.map(async (l) => {
        const unit = await ctx.db.get(l.unitId)
        const subject = await ctx.db.get(l.subjectId)
        return {
          lessonId: l._id,
          contentSlug: l.contentSlug,
          title: l.title,
          summary: l.summary,
          estimatedMinutes: l.estimatedMinutes,
          level: l.level ?? 'beginner',
          subjectSlug: subject?.slug ?? '',
          subjectName: subject?.name ?? '',
          unitSlug: unit?.slug ?? '',
          unitName: unit?.name ?? '',
          accentColor: unit?.accentColor ?? subject?.color ?? '#4F8CFF',
        }
      }),
    )
  },
})

export const getLessonMeta = query({
  args: { contentSlug: v.string() },
  handler: async (ctx, { contentSlug }) => {
    const lesson = await ctx.db
      .query('lessons')
      .withIndex('by_contentSlug', (q) => q.eq('contentSlug', contentSlug))
      .unique()
    if (!lesson) return null
    // Join the unit + subject so the lesson player can glow in its category's
    // accent (the unit accent, falling back to the subject colour) and so exit
    // can return to the lesson's own category trail (the unit slug).
    const unit = await ctx.db.get(lesson.unitId)
    const subject = await ctx.db.get(lesson.subjectId)
    return {
      ...lesson,
      unitAccentColor: unit?.accentColor ?? null,
      subjectColor: subject?.color ?? null,
      unitSlug: unit?.slug ?? null,
    }
  },
})
