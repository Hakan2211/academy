import { motion, useReducedMotion } from 'motion/react'
import { SpaceBackdrop } from './SpaceBackdrop'
import { StationNode } from './StationNode'
import type { StationState } from './StationNode'

export type OverworldUnit = {
  slug: string
  name: string
  icon?: string
  accentColor?: string
  done: number
  total: number
}

// Hand-authored horizontal offset (viewBox %) per physics category — tuned so
// the trail meanders left/right organically in curriculum order. Vertical
// position is derived from order (index) so it can't drift out of sequence.
// Unknown slugs (e.g. a future subject) fall back to a simple alternation.
const STATION_X: Record<string, number> = {
  'scientific-working': 30,
  energy: 64,
  'forces-and-motion': 38,
  oscillations: 72,
  'light-and-optics': 44,
  electricity: 26,
  magnetism: 58,
  matter: 74,
  'atoms-and-quantum': 40,
  relativity: 24,
  astronomy: 56,
  frontiers: 50,
}

const TOP = 96 // px to first station centre
const SPACING = 150 // px between station centres
const BOTTOM_PAD = 150

function computeStates(units: Array<OverworldUnit>): Array<StationState> {
  const states: Array<StationState> = []
  let unlocked = true
  let assignedCurrent = false
  for (const u of units) {
    const complete = u.total > 0 && u.done === u.total
    let s: StationState
    if (complete) s = 'complete'
    else if (unlocked) {
      s = assignedCurrent ? 'available' : 'current'
      assignedCurrent = true
    } else s = 'locked'
    unlocked = complete // next unlocks only once this one is finished
    states.push(s)
  }
  return states
}

// Smooth Catmull-Rom spline through the points, emitted as cubic Bézier
// segments. segs[i] connects point i → i+1, so a completed prefix is just the
// first k segments (and overlays the muted full path exactly).
function splineSegments(pts: Array<{ x: number; y: number }>): Array<string> {
  const segs: Array<string> = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    segs.push(` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`)
  }
  return segs
}

export function Overworld({
  subjectSlug,
  subjectColor,
  units,
}: {
  subjectSlug: string
  subjectColor: string
  units: Array<OverworldUnit>
}) {
  const reduce = useReducedMotion()
  const n = units.length
  const states = computeStates(units)

  const xOf = (slug: string, i: number) =>
    STATION_X[slug] ?? (i % 2 === 0 ? 34 : 66)
  const yOf = (i: number) => TOP + i * SPACING
  const totalH = TOP + Math.max(0, n - 1) * SPACING + BOTTOM_PAD

  const pts = units.map((u, i) => ({ x: xOf(u.slug, i), y: yOf(i) }))
  const segs = splineSegments(pts)
  const fullD = n > 0 ? `M ${pts[0].x} ${pts[0].y}` + segs.join('') : ''

  // Fill the path up to the current station (or the last complete one if the
  // whole subject is finished).
  const currentIdx = states.indexOf('current')
  let lastComplete = -1
  states.forEach((s, i) => {
    if (s === 'complete') lastComplete = i
  })
  const fillUpTo = currentIdx >= 0 ? currentIdx : lastComplete
  const prefixD =
    fillUpTo >= 1 ? `M ${pts[0].x} ${pts[0].y}` + segs.slice(0, fillUpTo).join('') : ''

  return (
    <div className="relative" style={{ height: totalH }}>
      <SpaceBackdrop />

      {/* connecting trail behind the stations */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 100 ${totalH}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d={fullD}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={3}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {prefixD && (
          <path
            d={prefixD}
            fill="none"
            stroke={subjectColor}
            strokeWidth={4}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>

      {units.map((u, i) => (
        <div
          key={u.slug}
          className="absolute"
          style={{ left: `${xOf(u.slug, i)}%`, top: yOf(i) }}
        >
          <div className="-translate-x-1/2 -translate-y-1/2">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduce ? 0 : i * 0.05,
                duration: 0.35,
                ease: 'easeOut',
              }}
            >
              <StationNode
                subjectSlug={subjectSlug}
                unitSlug={u.slug}
                name={u.name}
                icon={u.icon}
                accent={u.accentColor ?? subjectColor}
                state={states[i]}
                done={u.done}
                total={u.total}
                isSummit={i === n - 1}
                lockHint={
                  i > 0 ? `Finish ${units[i - 1].name} to unlock` : undefined
                }
              />
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  )
}
