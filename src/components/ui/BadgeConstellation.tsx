import { useEffect, useMemo, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { CosmosCanvas } from '#/components/hub/CosmosCanvas'
import type { HubIsland } from '#/components/hub/CosmosCanvas'
import { BADGES, badgeMeta } from '#/lib/badges'
import { Icon } from './Icon'

// The badge "trophy room" (design.md §8 step 5, mockup `2.5`): a constellation
// of medal coins on the cosmos, joined by faint lines. Earned = lit + glowing;
// locked = desaturated + lock. Same lit-illustration stack as the overworld
// (CosmosCanvas nebula + DOM coins) one level over. We drop the mockup's left
// nav rail — our IA uses the top HUD, not a sidebar.

type Pt = { x: number; y: number }

// Hand-laid 14-badge constellation (4/5/4/1 rows; frontiers anchors the base).
const HAND14: Array<Pt> = [
  { x: 24, y: 23 }, { x: 43, y: 21 }, { x: 63, y: 23 }, { x: 81, y: 25 },
  { x: 15, y: 42 }, { x: 34, y: 44 }, { x: 54, y: 40 }, { x: 73, y: 43 }, { x: 90, y: 42 },
  { x: 26, y: 61 }, { x: 45, y: 63 }, { x: 64, y: 60 }, { x: 83, y: 62 },
  { x: 54, y: 80 },
]

function layoutFor(n: number): Array<Pt> {
  if (n === HAND14.length) return HAND14
  const out: Array<Pt> = []
  const perRow = 4
  const rows = Math.ceil(n / perRow)
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / perRow)
    const inRow = Math.min(perRow, n - row * perRow)
    const col = i % perRow
    const y = rows > 1 ? 20 + (row * 62) / (rows - 1) : 50
    const x = 14 + ((col + 0.5) * 72) / inRow
    out.push({ x, y })
  }
  return out
}

// Connect each node to its ~2 nearest neighbours (x weighted for the wide stage)
// → an organic, lightly-linked web rather than a full mesh.
function nearestEdges(pts: Array<Pt>): Array<[number, number]> {
  const set = new Set<string>()
  const edges: Array<[number, number]> = []
  const dist = (a: Pt, b: Pt) => {
    const dx = (a.x - b.x) * 1.6
    const dy = a.y - b.y
    return dx * dx + dy * dy
  }
  for (let i = 0; i < pts.length; i++) {
    const order = pts
      .map((p, j) => ({ j, d: dist(pts[i], p) }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
    for (const o of order) {
      const key = i < o.j ? `${i}-${o.j}` : `${o.j}-${i}`
      if (!set.has(key)) {
        set.add(key)
        edges.push([Math.min(i, o.j), Math.max(i, o.j)])
      }
    }
  }
  return edges
}

export function BadgeConstellation({
  earned,
}: {
  earned: ReadonlySet<string>
}) {
  const reduce = useReducedMotion()
  const mouseRef = useRef({ x: 0, y: 0 })
  const keys = useMemo(() => Object.keys(BADGES), [])
  const n = keys.length
  const earnedCount = keys.filter((k) => earned.has(k)).length

  const positions = useMemo(() => layoutFor(n), [n])
  const edges = useMemo(() => nearestEdges(positions), [positions])

  // Tint the nebula with a few accents (earned badges first).
  const islands = useMemo<Array<HubIsland>>(() => {
    const ordered = keys
      .map((k, i) => ({ k, i }))
      .sort((a, b) => Number(earned.has(b.k)) - Number(earned.has(a.k)))
      .slice(0, 8)
    return ordered.map(({ k, i }) => ({
      x: positions[i].x,
      y: positions[i].y,
      accent: badgeMeta(k).color,
    }))
  }, [keys, positions, earned])

  // Pointer parallax for the nebula only (coins stay on their lines).
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const tick = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      mouseRef.current.x = cx
      mouseRef.current.y = cy
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 'calc(100vh - 52px)', minHeight: 640, background: '#070a16' }}
    >
      {/* layer 1 — animated nebula tinted by badge accents */}
      <CosmosCanvas mouseRef={mouseRef} reduce={Boolean(reduce)} islands={islands} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(125% 90% at 50% 42%, transparent 56%, rgba(7,10,22,0.62) 100%)',
        }}
      />

      {/* layer 2 — constellation lines (viewBox %, distortion-tolerant connectors) */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {edges.map(([a, b]) => {
          const lit = earned.has(keys[a]) && earned.has(keys[b])
          return (
            <line
              key={`${a}-${b}`}
              x1={positions[a].x}
              y1={positions[a].y}
              x2={positions[b].x}
              y2={positions[b].y}
              stroke={lit ? 'rgba(120,170,255,0.4)' : 'rgba(150,165,210,0.14)'}
              strokeWidth={lit ? 1.4 : 1}
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </svg>

      {/* header (top-left) */}
      <div className="absolute left-5 top-4 z-20 max-w-[60%]">
        <h1 className="text-2xl font-extrabold uppercase tracking-[0.16em] sm:text-3xl">
          Badge Collection
        </h1>
        <p className="mt-0.5 text-sm font-bold tracking-wide">
          <span className="text-accent">{earnedCount}</span>
          <span className="text-muted"> of {n} earned</span>
        </p>
        <p className="mt-1 hidden text-sm text-muted sm:block">
          Every badge is a milestone in your science journey.
        </p>
      </div>

      {/* legend (bottom-right) */}
      <div className="absolute bottom-4 right-5 z-20 flex items-center gap-4 rounded-2xl border border-white/10 bg-black/35 px-4 py-2 text-xs font-semibold uppercase tracking-wide backdrop-blur-md">
        <span className="flex items-center gap-1.5 text-ink">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" style={{ boxShadow: '0 0 8px var(--color-accent)' }} />
          Earned
        </span>
        <span className="flex items-center gap-1.5 text-muted">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          Locked
        </span>
      </div>

      {/* layer 3 — the badge coins */}
      {keys.map((k, i) => (
        <div
          key={k}
          className="absolute z-10"
          style={{ left: `${positions[i].x}%`, top: `${positions[i].y}%` }}
        >
          <div className="-translate-x-1/2 -translate-y-1/2">
            <ConstellationBadge
              badgeKey={k}
              earned={earned.has(k)}
              reduce={Boolean(reduce)}
              index={i}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function ConstellationBadge({
  badgeKey,
  earned,
  reduce,
  index,
}: {
  badgeKey: string
  earned: boolean
  reduce: boolean
  index: number
}) {
  const meta = badgeMeta(badgeKey)
  const unitSlug = badgeKey.startsWith('unit-')
    ? badgeKey.slice('unit-'.length)
    : null
  const img = unitSlug ? `/badges/physics/${unitSlug}.png` : null
  const D = 76
  const RING = D + 16

  const coin = img ? (
    <img
      src={img}
      alt=""
      draggable={false}
      className="h-full w-full select-none"
      style={{
        filter: earned
          ? `drop-shadow(0 0 14px ${meta.color}) drop-shadow(0 6px 14px rgba(0,0,0,0.5))`
          : 'grayscale(0.85) brightness(0.55)',
      }}
    />
  ) : (
    <div
      className="grid h-full w-full place-items-center rounded-full border-2"
      style={{
        color: earned ? meta.color : 'rgba(150,165,200,0.6)',
        borderColor: earned ? meta.color : 'rgba(120,135,170,0.35)',
        background: earned ? `${meta.color}1f` : 'rgba(20,26,43,0.7)',
        boxShadow: earned
          ? `0 0 0 4px ${meta.color}22, 0 0 26px -6px ${meta.color}`
          : undefined,
        filter: earned ? undefined : 'grayscale(0.4)',
      }}
    >
      <Icon name={meta.icon} size={32} />
    </div>
  )

  return (
    <div
      className="group relative grid cursor-default place-items-center"
      style={{ width: RING, height: RING }}
      title={`${meta.label} — ${earned ? 'earned' : 'locked'}`}
    >
      {/* bloom halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full blur-2xl"
        style={{
          width: RING * 1.5,
          height: RING * 1.5,
          background: meta.color,
          opacity: earned ? 0.3 : 0.05,
          mixBlendMode: 'screen',
        }}
      />
      {/* thin outer ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          width: RING,
          height: RING,
          border: `1px solid ${earned ? `${meta.color}66` : 'rgba(120,135,170,0.18)'}`,
        }}
      />

      {/* the coin */}
      <motion.div
        className="relative"
        style={{ width: D, height: D }}
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={
          reduce
            ? undefined
            : {
                duration: 5 + (index % 4) * 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.2,
              }
        }
        whileHover={{ scale: 1.08 }}
      >
        {coin}
        {!earned && (
          <span
            className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full text-muted"
            style={{ background: 'rgba(15,20,34,0.95)', border: '2px solid #070a16' }}
          >
            <Icon name="Lock" size={12} />
          </span>
        )}
      </motion.div>

      {/* label */}
      <span
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-[10px] font-bold uppercase tracking-wider"
        style={{
          top: RING + 2,
          color: earned ? 'var(--color-ink)' : 'var(--color-muted)',
          textShadow: '0 2px 8px rgba(0,0,0,0.9)',
        }}
      >
        {meta.label}
      </span>
    </div>
  )
}
