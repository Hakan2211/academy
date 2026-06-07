import { getAuthUserId } from '@convex-dev/auth/server'
import type { Doc } from './_generated/dataModel'
import type { MutationCtx, QueryCtx } from './_generated/server'

// ── The freemium rule (single source of truth) ──────────────────────────────
// The FIRST world (unit.order === 1, per subject) of every subject is free;
// everything else requires the $199 lifetime unlock (users.isPremium).
//
// Enforcement boundary (accepted v1 limitation): lesson MDX is client-bundled
// via import.meta.glob, so content bytes can't be withheld server-side. What we
// DO enforce server-side is everything that matters for integrity — progress,
// XP, streaks, badges, leaderboard, and practice writes all refuse premium
// content for free users. The UI mirrors this rule via the `requiresPremium`
// annotations on catalog queries; it must never re-derive it from unit.order.

export function isUnitFree(unit: { order: number }): boolean {
  return unit.order === 1
}

export function unitRequiresPremium(unit: { order: number }): boolean {
  return !isUnitFree(unit)
}

export function isPremiumUser(
  user: { isPremium?: boolean } | null | undefined,
): boolean {
  return user?.isPremium === true
}

// Whether the signed-in viewer has the lifetime unlock. Signed-out -> false.
export async function viewerIsPremium(
  ctx: QueryCtx | MutationCtx,
): Promise<boolean> {
  const userId = await getAuthUserId(ctx)
  if (!userId) return false
  return isPremiumUser(await ctx.db.get(userId))
}

// Server-side write guard: progress/XP mutations call this so a free user
// can't earn XP/streaks/badges from premium lessons (e.g. via direct calls).
export async function assertLessonPlayable(
  ctx: MutationCtx,
  lesson: Doc<'lessons'>,
): Promise<void> {
  const unit = await ctx.db.get(lesson.unitId)
  if (!unit) throw new Error('Unit not found')
  if (unitRequiresPremium(unit) && !(await viewerIsPremium(ctx))) {
    throw new Error('Premium required')
  }
}
