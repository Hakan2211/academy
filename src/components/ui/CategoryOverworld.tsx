import { useEffect, useMemo, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { CosmosCanvas } from '#/components/hub/CosmosCanvas'
import type { HubIsland } from '#/components/hub/CosmosCanvas'
import { OrbStation } from './OrbStation'
import type { OrbState } from './OrbStation'
import { Icon } from './Icon'

export type OverworldUnit = {
  slug: string
  name: string
  icon?: string
  accentColor?: string
  done: number
  total: number
}

type Pt = { x: number; y: number; scale: number }

// Per-category planet/orb art (the §3.3 station planets) → used as the orb face.
// Keyed by unit slug so it's order-independent; a missing slug falls back to a
// procedural orb. (The §7a medal coins are separate — they live the reward role
// on `/badges`, not here.)
const ORB_IMAGE: Record<string, string> = {
  'scientific-working': '/orbs/physics/scientific-working.png',
  energy: '/orbs/physics/energy.png',
  'forces-and-motion': '/orbs/physics/forces-and-motion.png',
  oscillations: '/orbs/physics/oscillations.png',
  'light-and-optics': '/orbs/physics/light-and-optics.png',
  electricity: '/orbs/physics/electricity.png',
  magnetism: '/orbs/physics/magnetism.png',
  matter: '/orbs/physics/matter.png',
  'atoms-and-quantum': '/orbs/physics/atoms-and-quantum.png',
  relativity: '/orbs/physics/relativity.png',
  astronomy: '/orbs/physics/astronomy.png',
  frontiers: '/orbs/physics/frontiers.png',
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// Hand-tuned receding meander for the 12-category Physics path (mockup 1A):
// foreground worlds are large/low, the path winds with shrinking amplitude as it
// climbs into the distance, settling on the summit (Frontiers) at top-centre.
// x/y are % of the stage; scale shrinks with distance (atmospheric perspective).
const PHYSICS_LAYOUT: Array<Pt> = [
  { x: 15, y: 89, scale: 1.28 },
  { x: 37, y: 84, scale: 1.16 },
  { x: 60, y: 80, scale: 1.06 },
  { x: 80, y: 71, scale: 0.96 },
  { x: 67, y: 62, scale: 0.88 },
  { x: 45, y: 57, scale: 0.8 },
  { x: 25, y: 51, scale: 0.73 },
  { x: 39, y: 42, scale: 0.67 },
  { x: 60, y: 37, scale: 0.62 },
  { x: 47, y: 30, scale: 0.58 },
  { x: 56, y: 23, scale: 0.55 },
  { x: 49, y: 13, scale: 0.64 }, // summit
]

const ORB_BASE = 120 // must match OrbStation BASE (orb px diameter at scale 1)

// Fallback for any subject whose category count differs from physics' 12.
function genLayout(n: number): Array<Pt> {
  const out: Array<Pt> = []
  for (let i = 0; i < n; i++) {
    const t = n > 1 ? i / (n - 1) : 0
    const amp = 30 * (1 - t)
    out.push({
      x: 50 + amp * Math.sin(i * 1.7 + 0.6),
      y: 88 - t * 75,
      scale: 1.3 - t * 0.76,
    })
  }
  return out
}

// Strict gating mirrors lesson gating: a world unlocks only once the previous is
// 100% complete. The first incomplete unlocked world is the "current" target.
function computeStates(units: Array<OverworldUnit>): Array<OrbState> {
  const states: Array<OrbState> = []
  let unlocked = true
  let assignedCurrent = false
  for (const u of units) {
    const complete = u.total > 0 && u.done === u.total
    let s: OrbState
    if (complete) s = 'complete'
    else if (unlocked) {
      s = assignedCurrent ? 'available' : 'current'
      assignedCurrent = true
    } else s = 'locked'
    unlocked = complete
    states.push(s)
  }
  return states
}

// Catmull-Rom → cubic-Bézier control points per segment i (pts[i] → pts[i+1]).
function controlPoints(pts: Array<{ x: number; y: number }>) {
  const segs: Array<{ c1x: number; c1y: number; c2x: number; c2y: number }> = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    segs.push({
      c1x: p1.x + (p2.x - p0.x) / 6,
      c1y: p1.y + (p2.y - p0.y) / 6,
      c2x: p2.x - (p3.x - p1.x) / 6,
      c2y: p2.y - (p3.y - p1.y) / 6,
    })
  }
  return segs
}

function bezierPoint(
  p1: { x: number; y: number },
  c: { c1x: number; c1y: number; c2x: number; c2y: number },
  p2: { x: number; y: number },
  u: number,
) {
  const m = 1 - u
  const a = m * m * m
  const b = 3 * m * m * u
  const cc = 3 * m * u * u
  const d = u * u * u
  return {
    x: a * p1.x + b * c.c1x + cc * c.c2x + d * p2.x,
    y: a * p1.y + b * c.c1y + cc * c.c2y + d * p2.y,
  }
}

export function CategoryOverworld({
  subjectSlug,
  subjectName,
  subjectColor,
  units,
}: {
  subjectSlug: string
  subjectName: string
  subjectColor: string
  units: Array<OverworldUnit>
}) {
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const orbRefs = useRef<Array<HTMLDivElement | null>>([])

  const n = units.length
  const states = useMemo(() => computeStates(units), [units])

  const layout = useMemo<Array<Pt>>(
    () => (n === PHYSICS_LAYOUT.length ? PHYSICS_LAYOUT : genLayout(n)),
    [n],
  )
  const scales = layout.map((p) => p.scale)
  const sMax = Math.max(...scales, 1)
  const sMin = Math.min(...scales, 0.5)
  const depthOf = (s: number) => (sMax === sMin ? 1 : (s - sMin) / (sMax - sMin))

  const totals = useMemo(() => {
    const done = units.reduce((a, u) => a + u.done, 0)
    const total = units.reduce((a, u) => a + u.total, 0)
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 }
  }, [units])

  // How far the lit "completed" trail reaches: up to the current world, else the
  // last completed one (whole subject finished).
  const currentIdx = states.indexOf('current')
  let lastComplete = -1
  states.forEach((s, i) => {
    if (s === 'complete') lastComplete = i
  })
  const fillUpTo = currentIdx >= 0 ? currentIdx : lastComplete

  // Sample ≤8 accents along the path to tint the WebGL nebula (CosmosCanvas cap).
  const islands = useMemo<Array<HubIsland>>(() => {
    const max = 8
    const step = n > max ? n / max : 1
    const out: Array<HubIsland> = []
    for (let k = 0; k < Math.min(n, max); k++) {
      const i = Math.floor(k * step)
      out.push({
        x: layout[i].x,
        y: layout[i].y,
        accent: units[i].accentColor ?? subjectColor,
      })
    }
    return out
  }, [n, layout, units, subjectColor])

  // Per-orb bloom spec for the canvas (lit coins radiate accent light).
  const orbGlow = useMemo(
    () =>
      units.map((u, i) => {
        const s = states[i]
        return {
          x: layout[i].x,
          y: layout[i].y,
          scale: layout[i].scale,
          rgb: hexToRgb(u.accentColor ?? subjectColor),
          intensity:
            s === 'current' ? 0.55 : s === 'complete' ? 0.4 : s === 'available' ? 0.3 : 0,
          current: s === 'current',
        }
      }),
    [units, states, layout, subjectColor],
  )

  // Pointer parallax: feed the smoothed pointer to the nebula (uMouse) and drift
  // each orb by its depth so the world reads as 2.5D.
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2
    }
    const tick = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      mouseRef.current.x = cx
      mouseRef.current.y = cy
      orbRefs.current.forEach((el, i) => {
        if (!el) return
        const f = 6 + depthOf(layout[i].scale) * 26
        el.style.transform = `translate(${cx * f}px, ${cy * f}px)`
      })
      raf = requestAnimationFrame(tick)
    }
    wrap.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      wrap.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout])

  // The luminous path — drawn in pixel space (undistorted) on a 2D canvas, like
  // the hub's energy bridges: a dim/cold full trail, a bright golden "completed"
  // prefix with flowing dashes + travelling pulses (additive bloom).
  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !wrap || !ctx || n < 2) return
    const reduceM = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let w = 0
    let h = 0
    let pts: Array<{ x: number; y: number }> = []
    let segs: ReturnType<typeof controlPoints> = []
    const resize = () => {
      const r = wrap.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      pts = layout.map((p) => ({ x: (p.x / 100) * w, y: (p.y / 100) * h }))
      segs = controlPoints(pts)
    }
    resize()

    const tracePath = (from: number, to: number) => {
      ctx.beginPath()
      ctx.moveTo(pts[from].x, pts[from].y)
      for (let i = from; i < to; i++) {
        const c = segs[i]
        ctx.bezierCurveTo(c.c1x, c.c1y, c.c2x, c.c2y, pts[i + 1].x, pts[i + 1].y)
      }
    }

    let raf = 0
    const draw = () => {
      const t = performance.now() / 1000
      ctx.clearRect(0, 0, w, h)

      // orb bloom — lit coins radiate accent light into the nebula (additive)
      ctx.globalCompositeOperation = 'lighter'
      for (const o of orbGlow) {
        if (o.intensity <= 0) continue
        const ox = (o.x / 100) * w
        const oy = (o.y / 100) * h
        const pulse = o.current && !reduceM ? 0.85 + 0.22 * Math.sin(t * 2.3) : 1
        const rad = (ORB_BASE * o.scale * 0.85 + 26) * pulse
        const [r, g, b] = o.rgb
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, rad)
        grad.addColorStop(0, `rgba(${r},${g},${b},${o.intensity * pulse})`)
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${o.intensity * 0.32 * pulse})`)
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(ox, oy, rad, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'

      // full trail — dim, cold (the road ahead)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      tracePath(0, n - 1)
      ctx.strokeStyle = 'rgba(150,165,210,0.10)'
      ctx.lineWidth = 7
      ctx.stroke()
      tracePath(0, n - 1)
      ctx.strokeStyle = 'rgba(165,180,225,0.24)'
      ctx.lineWidth = 2.5
      ctx.stroke()

      // completed prefix — bright golden trail of light (additive bloom)
      if (fillUpTo >= 1) {
        ctx.globalCompositeOperation = 'lighter'
        tracePath(0, fillUpTo)
        ctx.strokeStyle = 'rgba(255,210,140,0.12)'
        ctx.lineWidth = 16
        ctx.stroke()
        tracePath(0, fillUpTo)
        ctx.strokeStyle = 'rgba(255,228,180,0.3)'
        ctx.lineWidth = 7
        ctx.stroke()
        tracePath(0, fillUpTo)
        ctx.strokeStyle = 'rgba(255,245,225,0.85)'
        ctx.lineWidth = 3
        ctx.stroke()
        tracePath(0, fillUpTo)
        ctx.strokeStyle = 'rgba(255,255,255,0.95)'
        ctx.lineWidth = 1.4
        ctx.stroke()

        // flowing energy dashes along the completed trail
        if (!reduceM) {
          ctx.setLineDash([5, 18])
          ctx.lineDashOffset = -((t * 60) % 23)
          tracePath(0, fillUpTo)
          ctx.strokeStyle = 'rgba(255,250,235,0.95)'
          ctx.lineWidth = 2.4
          ctx.stroke()
          ctx.setLineDash([])
        }

        // travelling pulses (segment-parametrised so they ride the spline)
        const span = fillUpTo
        const pulseUs = reduceM ? [0.5] : [(t * 0.18) % 1, (t * 0.18 + 0.5) % 1]
        for (const pu of pulseUs) {
          const s = pu * span
          const seg = Math.min(span - 1, Math.floor(s))
          const local = s - seg
          const p = bezierPoint(pts[seg], segs[seg], pts[seg + 1], local)
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 12)
          g.addColorStop(0, 'rgba(255,250,235,0.98)')
          g.addColorStop(1, 'rgba(255,210,140,0)')
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(p.x, p.y, 12, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalCompositeOperation = 'source-over'
      }

      if (!reduceM) raf = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [layout, n, fillUpTo, orbGlow])

  return (
    // Narrow screens: keep the stage at a usable min width and pan horizontally
    // rather than letting the fixed-position orbs overlap (portrait redesign TBD).
    <div
      className="w-full overflow-x-auto overflow-y-hidden"
      style={{ height: 'calc(100vh - 52px)', minHeight: 620, background: '#070a16' }}
    >
      <div
        ref={wrapRef}
        className="relative h-full w-full overflow-hidden"
        style={{ minWidth: 920, background: '#070a16' }}
      >
      {/* layer 1 — animated WebGL nebula, tinted by the category accents */}
      <CosmosCanvas mouseRef={mouseRef} reduce={Boolean(reduce)} islands={islands} />
      {/* depth vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(125% 90% at 50% 42%, transparent 58%, rgba(7,10,22,0.6) 100%)',
        }}
      />
      {/* layer 2 — the luminous winding path */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />

      {/* arrival flash — fades out the hub's "dive into the island" bloom */}
      {!reduce && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-40"
          style={{
            background: `radial-gradient(circle at 50% 48%, ${subjectColor}, #050710 70%)`,
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      )}

      {/* chrome — back link + subject progress (glass) */}
      <div className="absolute left-4 top-4 z-30 flex flex-col items-start gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-sm font-medium text-ink backdrop-blur-md transition-colors hover:border-white/25 hover:bg-black/50"
        >
          <Icon name="ArrowLeft" size={15} /> All subjects
        </Link>
        <div className="rounded-2xl border border-white/10 bg-black/35 px-3.5 py-2 backdrop-blur-md">
          <p className="text-base font-bold" style={{ color: subjectColor }}>
            {subjectName}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{ width: `${totals.pct}%`, background: subjectColor }}
              />
            </div>
            <span className="text-xs text-muted">
              {totals.done}/{totals.total} · {n} worlds
            </span>
          </div>
        </div>
      </div>

      {/* layer 3 — the interactive orb worlds */}
      {units.map((u, i) => {
        const p = layout[i]
        const depth = depthOf(p.scale)
        return (
          <div
            key={u.slug}
            className="absolute"
            style={{ left: `${p.x}%`, top: `${p.y}%`, zIndex: 10 + Math.round(depth * 40) }}
          >
            {/* parallax wrapper (transform set per-frame) */}
            <div
              ref={(el) => {
                orbRefs.current[i] = el
              }}
              className="will-change-transform"
            >
              {/* static centring — kept off the parallax/motion transforms */}
              <div className="-translate-x-1/2 -translate-y-1/2">
                <OrbStation
                  subjectSlug={subjectSlug}
                  unitSlug={u.slug}
                  name={u.name}
                  icon={u.icon}
                  image={ORB_IMAGE[u.slug]}
                  accent={u.accentColor ?? subjectColor}
                  state={states[i]}
                  done={u.done}
                  total={u.total}
                  order={i + 1}
                  scale={p.scale}
                  depth={depth}
                  isSummit={i === n - 1}
                  reduce={Boolean(reduce)}
                  index={i}
                  captionAbove={p.y > 78}
                  lockHint={
                    i > 0 ? `Finish ${units[i - 1].name} to unlock` : undefined
                  }
                />
              </div>
            </div>
          </div>
        )
      })}
      </div>
    </div>
  )
}
