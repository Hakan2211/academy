import { motion } from 'motion/react'

/** Animated SVG sine wave (path-length draw) illustrating displacement over time. */
export function SineWave() {
  const W = 600
  const H = 160
  const mid = H / 2
  const amp = 52
  const cycles = 2

  let d = ''
  for (let x = 0; x <= W; x += 4) {
    const y = mid - amp * Math.sin((x / W) * cycles * Math.PI * 2)
    d += `${x === 0 ? 'M' : 'L'}${x},${y.toFixed(1)} `
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line
          x1="0"
          y1={mid}
          x2={W}
          y2={mid}
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <motion.path
          d={d.trim()}
          fill="none"
          stroke="var(--color-accent-2)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2.4,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
            repeatDelay: 0.5,
          }}
        />
      </svg>
      <p className="mt-2 text-center text-xs text-muted">
        Displacement vs. time — one full cycle takes the period T
      </p>
    </div>
  )
}
