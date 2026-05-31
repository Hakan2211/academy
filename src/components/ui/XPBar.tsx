import { motion } from 'motion/react'
import { xpToNextLevel } from '#/lib/xp'

export function XPBar({ totalXP }: { totalXP: number }) {
  const { level, into, needed } = xpToNextLevel(totalXP)
  const pct = Math.min(100, (into / needed) * 100)
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-xs text-muted">
        <span>Level {level}</span>
        <span>
          {into} / {needed} XP
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full border border-border bg-surface-2">
        <motion.div
          className="h-full rounded-full"
          style={{
            background:
              'linear-gradient(to right, var(--color-accent), var(--color-accent-2))',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
