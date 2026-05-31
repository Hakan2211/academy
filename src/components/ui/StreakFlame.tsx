import { motion } from 'motion/react'
import { Icon } from './Icon'

export function StreakFlame({ count }: { count: number }) {
  return (
    <motion.div
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1.5"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 12 }}
    >
      <span className="text-warn">
        <Icon name="Flame" size={18} />
      </span>
      <span className="font-semibold">{count}</span>
      <span className="text-sm text-muted">day{count === 1 ? '' : 's'}</span>
    </motion.div>
  )
}
