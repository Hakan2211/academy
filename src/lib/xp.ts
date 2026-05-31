// Client-side mirror of the XP/level curve in convex/gamification.ts, kept tiny
// so the UI can render instantly. Convex remains the source of truth.

export function levelForXp(totalXP: number): number {
  return Math.floor(totalXP / 100) + 1
}

export function xpToNextLevel(totalXP: number): {
  level: number
  into: number
  needed: number
} {
  return { level: levelForXp(totalXP), into: totalXP % 100, needed: 100 }
}
