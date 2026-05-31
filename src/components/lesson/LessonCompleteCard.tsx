import { useEffect } from 'react'
import { motion } from 'motion/react'
import type { CompleteResult } from './context'
import { XPBar } from '#/components/ui/XPBar'
import { StreakFlame } from '#/components/ui/StreakFlame'
import { Badge } from '#/components/ui/Badge'
import { Button } from '#/components/ui/Button'
import { Icon } from '#/components/ui/Icon'

export function LessonCompleteCard({
  result,
  onExit,
}: {
  result: CompleteResult
  onExit?: () => void
}) {
  useEffect(() => {
    let cancelled = false
    // Loaded lazily on the client so it never runs during SSR.
    void import('canvas-confetti').then(({ default: confetti }) => {
      if (cancelled) return
      confetti({
        particleCount: 130,
        spread: 75,
        origin: { y: 0.3 },
        colors: ['#4F8CFF', '#00d2d3', '#2ecc71', '#ffb020'],
      })
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className="rounded-2xl border border-border bg-surface p-8 text-center"
    >
      <div className="mb-2 text-5xl">ðŸŽ‰</div>
      <h2 className="text-2xl font-bold">Lesson complete!</h2>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 14 }}
        className="my-4 text-4xl font-extrabold text-accent-2"
      >
        +{result.xpAwarded} XP
      </motion.div>

      <div className="mx-auto max-w-sm">
        <XPBar totalXP={result.totalXP} />
      </div>

      {result.leveledUp && (
        <motion.p
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 font-semibold text-accent"
        >
          <Icon name="Sparkles" size={16} /> Level up! You reached level{' '}
          {result.level}
        </motion.p>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <StreakFlame count={result.currentStreak} />
        {result.newBadges.map((b) => (
          <Badge key={b} badge={b} />
        ))}
      </div>

      {onExit && (
        <div className="mt-7">
          <Button onClick={onExit}>
            Back to Path <Icon name="ArrowRight" size={16} />
          </Button>
        </div>
      )}
    </motion.div>
  )
}
