import { useMemo, useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { BADGES, badgeMeta } from '#/lib/badges'
import { Icon } from './Icon'

// The badge "trophy room" (design.md §8 step 5, mockup `2.5`): a constellation
// of medal coins on the cosmos, joined by faint lines. Earned = lit + glowing;
// locked = desaturated + lock. Same lit-illustration stack as the overworld
// (CosmosCanvas nebula + DOM coins) one level over. We drop the mockup's left
// nav rail — our IA uses the top HUD, not a sidebar. Tapping a coin reveals how
// to earn it; a back pill returns wherever you came from.

type Pt = { x: number; y: number }

// Hand-laid 13-badge constellation (4/5/4): one onboarding badge + 12 category
// badges. Slight y-jitter keeps it organic rather than gridded.
const HAND13: Array<Pt> = [
  { x: 22, y: 23 }, { x: 41, y: 21 }, { x: 60, y: 22 }, { x: 79, y: 24 },
  { x: 13, y: 43 }, { x: 32, y: 45 }, { x: 50, y: 41 }, { x: 68, y: 44 }, { x: 87, y: 43 },
  { x: 24, y: 64 }, { x: 43, y: 66 }, { x: 62, y: 63 }, { x: 81, y: 65 },
]

// Hand-laid 14-badge fallback (4/5/4/1; a base anchor) kept in case a badge is
// re-added later.
const HAND14: Array<Pt> = [
  { x: 24, y: 23 }, { x: 43, y: 21 }, { x: 63, y: 23 }, { x: 81, y: 25 },
  { x: 15, y: 42 }, { x: 34, y: 44 }, { x: 54, y: 40 }, { x: 73, y: 43 }, { x: 90, y: 42 },
  { x: 26, y: 61 }, { x: 45, y: 63 }, { x: 64, y: 60 }, { x: 83, y: 62 },
  { x: 54, y: 80 },
]

function layoutFor(n: number): Array<Pt> {
  if (n === HAND13.length) return HAND13
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
  const router = useRouter()
  const keys = useMemo(() => Object.keys(BADGES), [])
  const n = keys.length
  const earnedCount = keys.filter((k) => earned.has(k)).length
  const isEmpty = earnedCount === 0
  const [selected, setSelected] = useState<string | null>(null)

  const positions = useMemo(() => layoutFor(n), [n])
  const edges = useMemo(() => nearestEdges(positions), [positions])

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.history.back()
    } else {
      void router.navigate({ to: '/' })
    }
  }

  return (
    // Narrow screens: keep a usable min width and pan horizontally rather than
    // letting the fixed-position coins overlap (portrait redesign TBD).
    <div
      className="w-full overflow-x-auto overflow-y-hidden"
      style={{ height: 'calc(100vh - 64px)', minHeight: 640 }}
    >
      <div
        className="relative h-full w-full overflow-hidden"
        style={{ minWidth: 900 }}
      >
      {/* the shared universe (CosmosBackdrop) shows through; depth vignette over it */}
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

      {/* header + back (top-left) */}
      <div className="absolute left-5 top-4 z-20 max-w-[64%]">
        <button
          type="button"
          onClick={goBack}
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-black/40 px-3 py-1.5 text-sm font-semibold text-ink backdrop-blur-md transition-colors hover:bg-black/60"
        >
          <Icon name="ArrowLeft" size={15} /> Back
        </button>
        <h1 className="text-2xl font-extrabold uppercase tracking-[0.16em] sm:text-3xl">
          Badge Collection
        </h1>
        <p className="mt-0.5 text-sm font-bold tracking-wide">
          <span className="text-accent">{earnedCount}</span>
          <span className="text-muted"> of {n} earned</span>
        </p>
        {isEmpty ? (
          <div className="mt-2">
            <p className="text-sm text-muted">
              Complete lessons to start lighting up your constellation.
            </p>
            <Link
              to="/"
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110"
              style={{
                background:
                  'linear-gradient(105deg, #4F8CFF, color-mix(in srgb, #4F8CFF 48%, white))',
                boxShadow: '0 12px 30px -12px #4F8CFF',
              }}
            >
              Start learning <Icon name="ArrowRight" size={15} />
            </Link>
          </div>
        ) : (
          <p className="mt-1 hidden text-sm text-muted sm:block">
            Every badge is a milestone in your science journey.
          </p>
        )}
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
              selected={selected === k}
              onSelect={() => setSelected((s) => (s === k ? null : k))}
            />
          </div>
        </div>
      ))}

      {/* detail card (bottom-center) — how to earn the selected badge */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2">
        <AnimatePresence>
          {selected && (
            <BadgeDetail
              key={selected}
              badgeKey={selected}
              earned={earned.has(selected)}
              reduce={Boolean(reduce)}
              onClose={() => setSelected(null)}
            />
          )}
        </AnimatePresence>
      </div>
      </div>
    </div>
  )
}

function BadgeDetail({
  badgeKey,
  earned,
  reduce,
  onClose,
}: {
  badgeKey: string
  earned: boolean
  reduce: boolean
  onClose: () => void
}) {
  const meta = badgeMeta(badgeKey)
  const unitSlug = badgeKey.startsWith('unit-')
    ? badgeKey.slice('unit-'.length)
    : null
  const img = unitSlug ? `/badges/physics/${unitSlug}.png` : null

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="pointer-events-auto flex w-[min(90vw,440px)] items-center gap-3.5 rounded-2xl border bg-black/55 px-4 py-3 backdrop-blur-xl"
      style={{
        borderColor: `${meta.color}55`,
        boxShadow: `0 0 34px -10px ${meta.color}, inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
    >
      <div className="grid h-14 w-14 shrink-0 place-items-center">
        {img ? (
          <img
            src={img}
            alt=""
            draggable={false}
            decoding="async"
            className="h-full w-full select-none"
            style={{
              filter: earned
                ? `drop-shadow(0 0 12px ${meta.color})`
                : 'grayscale(0.7) brightness(0.7)',
            }}
          />
        ) : (
          <div
            className="grid h-12 w-12 place-items-center rounded-full border-2"
            style={{
              color: earned ? meta.color : 'rgba(150,165,200,0.7)',
              borderColor: earned ? meta.color : 'rgba(120,135,170,0.4)',
              background: earned ? `${meta.color}1f` : 'rgba(20,26,43,0.7)',
            }}
          >
            <Icon name={meta.icon} size={22} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold uppercase tracking-wide text-ink">
            {meta.label}
          </p>
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            style={
              earned
                ? {
                    color: meta.color,
                    background: `${meta.color}1f`,
                    border: `1px solid ${meta.color}66`,
                  }
                : {
                    color: 'var(--color-muted)',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }
            }
          >
            {earned ? 'Earned' : 'Locked'}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted">{meta.hint}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-ink"
      >
        <Icon name="X" size={16} />
      </button>
    </motion.div>
  )
}

function ConstellationBadge({
  badgeKey,
  earned,
  reduce,
  index,
  selected,
  onSelect,
}: {
  badgeKey: string
  earned: boolean
  reduce: boolean
  index: number
  selected: boolean
  onSelect: () => void
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
      loading="lazy"
      decoding="async"
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
    <button
      type="button"
      onClick={onSelect}
      className="group relative grid cursor-pointer place-items-center"
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
      {/* thin outer ring (brightens when selected) */}
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full transition-all"
        style={{
          width: RING,
          height: RING,
          border: `${selected ? 2 : 1}px solid ${
            selected
              ? meta.color
              : earned
                ? `${meta.color}66`
                : 'rgba(120,135,170,0.18)'
          }`,
          boxShadow: selected ? `0 0 22px -4px ${meta.color}` : undefined,
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
    </button>
  )
}
