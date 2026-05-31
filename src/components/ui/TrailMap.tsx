import { motion, useReducedMotion } from 'motion/react'
import { TrailNode } from './TrailNode'
import { cn } from '#/lib/cn'
import type { LessonLevel, LessonNodeData } from './LessonNode'

// Winding "journey" trail: lessons alternate left/right of a centre line, joined
// by a smooth Bézier path drawn behind the nodes. The path up to the current
// node is filled in the unit accent (a progress ribbon); the rest is muted.
const ROW = 116 // vertical px between node centres
const AMP = 16 // horizontal amplitude, in viewBox % units (left=34, right=66)
const LEFT_X = 50 - AMP
const RIGHT_X = 50 + AMP

const LEVEL_STYLES: Record<LessonLevel, string> = {
  beginner: 'border-success/40 bg-success/10 text-success',
  intermediate: 'border-warn/40 bg-warn/10 text-warn',
  advanced: 'border-danger/40 bg-danger/10 text-danger',
}

export function TrailMap({
  lessons,
  accent,
}: {
  lessons: Array<LessonNodeData>
  accent: string
}) {
  const reduce = useReducedMotion()
  const n = lessons.length
  const totalH = n * ROW
  const xOf = (i: number) => (i % 2 === 0 ? LEFT_X : RIGHT_X)
  const yOf = (i: number) => i * ROW + ROW / 2

  // Cubic segment into node i, control points pulled to the vertical midpoint
  // so the trail reads as a smooth S between alternating sides.
  const seg = (i: number) => {
    const x0 = xOf(i - 1)
    const y0 = yOf(i - 1)
    const x1 = xOf(i)
    const y1 = yOf(i)
    const cy = (y0 + y1) / 2
    return ` C ${x0} ${cy}, ${x1} ${cy}, ${x1} ${y1}`
  }

  let full = `M ${xOf(0)} ${yOf(0)}`
  for (let i = 1; i < n; i++) full += seg(i)

  // Progress fill reaches the current node (or the last complete node if the
  // whole category is done).
  const currentIdx = lessons.findIndex((l) => l.state === 'current')
  let lastComplete = -1
  lessons.forEach((l, i) => {
    if (l.state === 'complete') lastComplete = i
  })
  const fillUpTo = currentIdx >= 0 ? currentIdx : lastComplete
  let prefix = ''
  if (fillUpTo >= 1) {
    prefix = `M ${xOf(0)} ${yOf(0)}`
    for (let i = 1; i <= fillUpTo; i++) prefix += seg(i)
  }

  return (
    <div className="relative mx-auto w-full max-w-xl" style={{ height: totalH }}>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 100 ${totalH}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d={full}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={3}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {prefix && (
          <path
            d={prefix}
            fill="none"
            stroke={accent}
            strokeWidth={4}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>

      {lessons.map((l, i) => {
        const left = i % 2 === 0
        return (
          <div key={l.contentSlug}>
            {/* node, centred on its trail point */}
            <div className="absolute" style={{ left: `${xOf(i)}%`, top: yOf(i) }}>
              <div className="-translate-x-1/2 -translate-y-1/2">
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reduce ? 0 : i * 0.04,
                    duration: 0.3,
                    ease: 'easeOut',
                  }}
                >
                  <TrailNode
                    state={l.state}
                    format={l.format}
                    contentSlug={l.contentSlug}
                    accent={accent}
                  />
                </motion.div>
              </div>
            </div>

            {/* label on the outward side, clear of the curve */}
            <div
              className={cn(
                'absolute flex flex-col',
                left ? 'items-end text-right' : 'items-start text-left',
              )}
              style={{
                top: yOf(i),
                transform: 'translateY(-50%)',
                width: `calc(${LEFT_X}% - 46px)`,
                ...(left ? { left: 8 } : { right: 8 }),
              }}
            >
              <TrailLabel data={l} accent={accent} side={left ? 'left' : 'right'} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TrailLabel({
  data,
  accent,
  side,
}: {
  data: LessonNodeData
  accent: string
  side: 'left' | 'right'
}) {
  const isDeep = data.format === 'deepdive'
  const muted = data.state === 'locked' || data.state === 'soon'
  return (
    <div className={cn('max-w-full', muted && 'opacity-70')}>
      <p
        className={cn(
          'text-sm font-semibold leading-snug',
          muted ? 'text-muted' : 'text-ink',
        )}
      >
        {data.title}
      </p>
      <div
        className={cn(
          'mt-1 flex flex-wrap items-center gap-1.5',
          side === 'left' ? 'justify-end' : 'justify-start',
        )}
      >
        {isDeep && (
          <span
            className="rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            style={{ color: accent, background: `${accent}22` }}
          >
            Capstone
          </span>
        )}
        {data.level && !isDeep && (
          <span
            className={cn(
              'rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
              LEVEL_STYLES[data.level],
            )}
          >
            {data.level}
          </span>
        )}
        <span className="text-xs text-muted">
          {data.state === 'soon'
            ? 'Coming soon'
            : `${data.minutes} min · ${data.xp} XP`}
        </span>
      </div>
    </div>
  )
}
