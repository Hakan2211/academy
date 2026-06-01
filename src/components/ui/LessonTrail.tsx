import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useReducedMotion } from 'motion/react'
import { LessonOrb } from './LessonOrb'
import { CategoryCompleteCard } from './CategoryCompleteCard'
import { Icon } from './Icon'
import { cn } from '#/lib/cn'
import type { LessonLevel, LessonNodeData } from './LessonNode'

// The category trail — the screen you land on after picking a world on the
// overworld (design.md §8 step 5, mockup `Category Trail`). It re-skins the old
// boxed `TrailMap` into the same full-bleed lit-illustration stack as the
// overworld, one level down: a WebGL nebula (accent-tinted) fixed behind a
// SCROLLING winding path of glowing lesson orbs + glass label cards. The path
// is drawn in pixel space on a 2D canvas (the hub/overworld glow technique):
// a dim/cold full trail, a bright accent "completed" prefix with flowing dashes
// + travelling pulses, plus a soft accent bloom behind every lit orb.

const HEADER_H = 176 // top space reserved for the hero header card
const ROW = 154 // vertical px between orb centres
const CAP_PAD = 44 // extra breathing room around a deep-dive capstone
const BOTTOM = 140
const LEFT_X = 33 // node x (% of stage) — alternating sides
const RIGHT_X = 67
const CENTER_X = 50 // capstones sit centred (mockup)
const ORB_BASE = 80 // must match LessonOrb CORE (px at the bloom radius math)

const LEVEL_STYLES: Record<LessonLevel, string> = {
  beginner: 'border-success/40 bg-success/10 text-success',
  intermediate: 'border-warn/40 bg-warn/10 text-warn',
  advanced: 'border-danger/40 bg-danger/10 text-danger',
}

type Pt = { x: number; y: number; cap: boolean }

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
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

export function LessonTrail({
  subjectSlug,
  subjectName,
  unitSlug,
  unitName,
  unitDescription,
  unitIcon,
  unitLevelRange,
  accent,
  lessons,
  done,
  total,
  complete,
  nextUnitSlug,
  nextUnitName,
}: {
  subjectSlug: string
  subjectName: string
  unitSlug: string
  unitName: string
  unitDescription?: string
  unitIcon?: string
  unitLevelRange?: string
  accent: string
  lessons: Array<LessonNodeData>
  done: number
  total: number
  complete: boolean
  nextUnitSlug?: string | null
  nextUnitName?: string | null
}) {
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const n = lessons.length

  // Narrow / portrait screens (< ~680px): the side-label layout gets unusably
  // tight, so stack the trail into a single centred column with labels BELOW
  // each node. Initial false = SSR/wide; the effect adjusts on the client.
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 680px)')
    const apply = () => setNarrow(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  const rowH = narrow ? 200 : ROW

  // Layout: wide = alternate left/right of centre (deep-dives centred); narrow =
  // a straight centred column. y grows downward (the trail scrolls).
  const layout = useMemo<Array<Pt>>(() => {
    const out: Array<Pt> = []
    let y = HEADER_H + rowH / 2
    lessons.forEach((l, i) => {
      const cap = l.format === 'deepdive'
      if (cap && i > 0) y += CAP_PAD
      out.push({
        x: narrow ? CENTER_X : cap ? CENTER_X : i % 2 === 0 ? LEFT_X : RIGHT_X,
        y,
        cap,
      })
      y += rowH + (cap ? CAP_PAD : 0)
    })
    return out
  }, [lessons, narrow, rowH])

  const contentH =
    (layout.length ? layout[layout.length - 1].y : HEADER_H) + rowH / 2 + BOTTOM

  // How far the lit "completed" trail reaches: up to the current lesson, else
  // the last completed one (whole category finished).
  const currentIdx = lessons.findIndex((l) => l.state === 'current')
  let lastComplete = -1
  lessons.forEach((l, i) => {
    if (l.state === 'complete') lastComplete = i
  })
  const fillUpTo = currentIdx >= 0 ? currentIdx : lastComplete

  const [ar, ag, ab] = useMemo(() => hexToRgb(accent), [accent])

  // The luminous winding path — pixel-space 2D canvas sized to the full
  // (scrolling) trail height, aligned with the DOM orbs.
  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !wrap || !ctx || n < 1) return
    const reduceM = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let w = 0
    let h = 0
    let pts: Array<{ x: number; y: number }> = []
    let segs: ReturnType<typeof controlPoints> = []
    const resize = () => {
      const r = wrap.getBoundingClientRect()
      w = r.width
      h = contentH
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      pts = layout.map((p) => ({ x: (p.x / 100) * w, y: p.y }))
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

      // accent bloom behind each lit orb (additive) — coins radiate into space
      ctx.globalCompositeOperation = 'lighter'
      lessons.forEach((l, i) => {
        const playable = l.state !== 'locked' && l.state !== 'soon'
        if (!playable) return
        const o = pts[i]
        const cap = layout[i].cap
        const isCurrent = l.state === 'current'
        const intensity = isCurrent ? 0.5 : l.state === 'complete' ? 0.36 : 0.26
        const pulse = isCurrent && !reduceM ? 0.85 + 0.22 * Math.sin(t * 2.3) : 1
        const rad = ((cap ? ORB_BASE * 1.5 : ORB_BASE) * 0.92 + 22) * pulse
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, rad)
        grad.addColorStop(0, `rgba(${ar},${ag},${ab},${intensity * pulse})`)
        grad.addColorStop(0.5, `rgba(${ar},${ag},${ab},${intensity * 0.3 * pulse})`)
        grad.addColorStop(1, `rgba(${ar},${ag},${ab},0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(o.x, o.y, rad, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalCompositeOperation = 'source-over'

      if (n >= 2) {
        // full trail — dim, cold (the road ahead)
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        tracePath(0, n - 1)
        ctx.strokeStyle = 'rgba(150,165,210,0.10)'
        ctx.lineWidth = 8
        ctx.stroke()
        tracePath(0, n - 1)
        ctx.strokeStyle = 'rgba(165,180,225,0.22)'
        ctx.lineWidth = 2.5
        ctx.stroke()

        // completed prefix — bright accent ribbon of light (additive bloom)
        if (fillUpTo >= 1) {
          ctx.globalCompositeOperation = 'lighter'
          tracePath(0, fillUpTo)
          ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.16)`
          ctx.lineWidth = 17
          ctx.stroke()
          tracePath(0, fillUpTo)
          ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.4)`
          ctx.lineWidth = 7
          ctx.stroke()
          tracePath(0, fillUpTo)
          ctx.strokeStyle = `rgba(${Math.min(255, ar + 90)},${Math.min(255, ag + 90)},${Math.min(255, ab + 90)},0.9)`
          ctx.lineWidth = 3
          ctx.stroke()
          tracePath(0, fillUpTo)
          ctx.strokeStyle = 'rgba(255,255,255,0.92)'
          ctx.lineWidth = 1.3
          ctx.stroke()

          // flowing energy dashes along the completed trail
          if (!reduceM) {
            ctx.setLineDash([5, 18])
            ctx.lineDashOffset = -((t * 60) % 23)
            tracePath(0, fillUpTo)
            ctx.strokeStyle = 'rgba(255,250,240,0.95)'
            ctx.lineWidth = 2.3
            ctx.stroke()
            ctx.setLineDash([])
          }

          // travelling pulses riding the spline
          const span = fillUpTo
          const pulseUs = reduceM ? [0.5] : [(t * 0.18) % 1, (t * 0.18 + 0.5) % 1]
          for (const pu of pulseUs) {
            const s = pu * span
            const seg = Math.min(span - 1, Math.floor(s))
            const local = s - seg
            const p = bezierPoint(pts[seg], segs[seg], pts[seg + 1], local)
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 12)
            g.addColorStop(0, 'rgba(255,252,245,0.98)')
            g.addColorStop(1, `rgba(${ar},${ag},${ab},0)`)
            ctx.fillStyle = g
            ctx.beginPath()
            ctx.arc(p.x, p.y, 12, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.globalCompositeOperation = 'source-over'
        }
      }

      if (!reduceM) raf = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [layout, n, fillUpTo, contentH, lessons, ar, ag, ab])

  return (
    <div className="relative w-full">
      {/* the shared universe (CosmosBackdrop) is fixed behind everything and
          stays put while the trail scrolls — a window into space */}

      {/* persistent back pill (always reachable while scrolling) */}
      <Link
        to="/subjects/$subjectSlug"
        params={{ subjectSlug }}
        className="fixed left-4 top-[64px] z-30 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-sm font-medium text-ink backdrop-blur-md transition-colors hover:border-white/25 hover:bg-black/55"
      >
        <Icon name="ArrowLeft" size={15} /> {subjectName}
      </Link>

      {/* layer 2 + 3 — the scrolling trail (path canvas + orbs + labels) */}
      <div ref={wrapRef} className="relative z-10" style={{ height: contentH }}>
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />

        {/* hero header card (or the completion celebration once finished) */}
        {complete ? (
          <div
            className="absolute left-1/2 z-20 w-[min(92vw,30rem)] -translate-x-1/2"
            style={{ top: 24 }}
          >
            <CategoryCompleteCard
              subjectSlug={subjectSlug}
              unitSlug={unitSlug}
              unitName={unitName}
              done={done}
              total={total}
              accent={accent}
              nextUnitSlug={nextUnitSlug}
              nextUnitName={nextUnitName}
            />
          </div>
        ) : (
          <div
            className="absolute left-1/2 z-20 flex w-[min(92vw,34rem)] -translate-x-1/2 flex-col items-center gap-3 rounded-3xl border border-white/10 bg-black/35 px-6 py-4 text-center backdrop-blur-xl"
            style={{ top: 28, boxShadow: `0 18px 60px -28px ${accent}` }}
          >
            <div className="flex items-center gap-3">
              <span
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
                style={{
                  color: accent,
                  background: `${accent}1f`,
                  border: `1px solid ${accent}55`,
                  boxShadow: `inset 0 0 16px ${accent}33`,
                }}
              >
                <Icon name={unitIcon ?? 'Folder'} size={26} />
              </span>
              <div className="text-left">
                <h1
                  className="text-2xl font-extrabold leading-tight tracking-wide"
                  style={{ color: accent }}
                >
                  {unitName}
                </h1>
                {unitDescription && (
                  <p className="text-sm text-muted">{unitDescription}</p>
                )}
              </div>
            </div>
            <div className="flex w-full items-center gap-2.5">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${total > 0 ? Math.round((done / total) * 100) : 0}%`,
                    background: accent,
                    boxShadow: `0 0 10px ${accent}`,
                  }}
                />
              </div>
              <span className="shrink-0 text-xs text-muted">
                {done}/{total} lessons
                {unitLevelRange ? ` · ${unitLevelRange}` : ''}
              </span>
            </div>
          </div>
        )}

        {/* the lesson orbs + glass labels */}
        {lessons.map((l, i) => {
          const p = layout[i]
          const left = p.x < 50
          const cap = p.cap
          const orderLabelHint =
            l.state === 'locked'
              ? i > 0
                ? `Finish "${lessons[i - 1].title}" to unlock`
                : 'Locked'
              : undefined
          return (
            <div key={l.contentSlug}>
              {/* orb, centred on its path point */}
              <div
                className="absolute"
                style={{ left: `${p.x}%`, top: p.y, zIndex: cap ? 16 : 14 }}
              >
                <div className="-translate-x-1/2 -translate-y-1/2">
                  <LessonOrb
                    state={l.state}
                    format={l.format}
                    contentSlug={l.contentSlug}
                    accent={accent}
                    index={i}
                    reduce={Boolean(reduce)}
                    lockHint={orderLabelHint}
                  />
                </div>
              </div>

              {/* glass label — outward side (wide) or centred below (narrow) */}
              <div
                className="absolute z-[15] flex flex-col"
                style={
                  narrow
                    ? {
                        top: p.y + (cap ? 82 : 58),
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 'min(86vw, 380px)',
                        alignItems: 'center',
                        textAlign: 'center',
                      }
                    : {
                        top: p.y,
                        transform: 'translateY(-50%)',
                        width: cap
                          ? 'calc(50% - 96px)'
                          : `calc(${LEFT_X}% - 78px)`,
                        ...(left || cap
                          ? { left: 16, alignItems: 'flex-end', textAlign: 'right' }
                          : { right: 16, alignItems: 'flex-start', textAlign: 'left' }),
                      }
                }
              >
                <TrailLabel
                  data={l}
                  accent={accent}
                  order={i + 1}
                  side={narrow ? 'center' : left || cap ? 'left' : 'right'}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TrailLabel({
  data,
  accent,
  order,
  side,
}: {
  data: LessonNodeData
  accent: string
  order: number
  side: 'left' | 'right' | 'center'
}) {
  const isDeep = data.format === 'deepdive'
  const muted = data.state === 'locked' || data.state === 'soon'
  const interactive = !muted

  const inner = (
    <div
      className={cn(
        'inline-block max-w-full rounded-2xl border px-3.5 py-2.5 backdrop-blur-md transition-colors',
        muted ? 'border-white/8 bg-black/25' : 'border-white/12 bg-black/40',
      )}
      style={
        data.state === 'current'
          ? { borderColor: `${accent}66`, boxShadow: `0 0 0 1px ${accent}33` }
          : undefined
      }
    >
      <p
        className={cn(
          'text-[15px] font-bold leading-snug',
          muted ? 'text-muted' : 'text-ink',
        )}
      >
        <span style={{ color: muted ? 'var(--color-muted)' : accent }}>
          {String(order).padStart(2, '0')}.
        </span>{' '}
        {data.title}
        {data.state === 'locked' && (
          <Icon
            name="Lock"
            size={13}
            className="ml-1.5 inline-block align-[-1px] text-muted"
          />
        )}
      </p>
      {data.summary && (
        <p className="mt-0.5 line-clamp-1 text-[13px] text-muted">
          {data.summary}
        </p>
      )}
      <div
        className={cn(
          'mt-1.5 flex flex-wrap items-center gap-1.5',
          side === 'center'
            ? 'justify-center'
            : side === 'left'
              ? 'justify-end'
              : 'justify-start',
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
            : muted
              ? 'Locked'
              : `${data.minutes} min · ${data.xp} XP`}
        </span>
      </div>
    </div>
  )

  if (!interactive) return inner
  return (
    <Link
      to="/learn/$"
      params={{ _splat: data.contentSlug }}
      className="block max-w-full hover:brightness-110"
    >
      {inner}
    </Link>
  )
}
