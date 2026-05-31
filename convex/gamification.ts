// Pure gamification helpers — no Convex/DB access, so they're trivially testable
// and safe to share with a future mobile client.

/** Level curve: a new level every 100 XP, starting at level 1. */
export function levelForXp(totalXP: number): number {
  return Math.floor(totalXP / 100) + 1
}

/** XP progress within the current level, for the XP bar. */
export function xpToNextLevel(totalXP: number): {
  level: number
  into: number
  needed: number
} {
  const level = levelForXp(totalXP)
  const into = totalXP % 100
  return { level, into, needed: 100 }
}

/** Whole-day difference between two "YYYY-MM-DD" date strings (toDate - fromDate). */
export function dayDiff(fromDate: string, toDate: string): number {
  const a = Date.parse(`${fromDate}T00:00:00Z`)
  const b = Date.parse(`${toDate}T00:00:00Z`)
  return Math.round((b - a) / 86_400_000)
}

export type StreakTransition = 'start' | 'same' | 'inc' | 'reset'

/** Decide how today's activity affects the streak given the last active date. */
export function streakTransition(
  lastDate: string | undefined,
  today: string,
): StreakTransition {
  if (!lastDate) return 'start'
  const diff = dayDiff(lastDate, today)
  if (diff <= 0) return 'same' // same day (or clock skew) — no change
  if (diff === 1) return 'inc' // consecutive day — extend
  return 'reset' // gap — start over
}
