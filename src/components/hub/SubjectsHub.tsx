import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Modular "lit illustration" hub (design.md §2/§4): an animated WebGL nebula
// backdrop (CosmosCanvas) + one transparent island PNG per subject, composed in
// code so the world is expandable (add a subject = one PNG + one LAYOUT row).
// Three parallax tiers give depth; a 2D canvas layer renders the glowing energy
// BRIDGES + foreground motes; each island gets a masked energy shimmer. The DOM
// carries the dynamic state (emblem icon, name, locked/coming-soon).
export type HubSubject = {
  _id: string
  slug: string
  name: string
  isPublished: boolean
}

type Tier = 'far' | 'mid' | 'near'
type IslandCfg = {
  slug: string
  accent: string
  emblem: string
  x: number
  y: number
  scale: number
  tier: Tier
}

// Hand-placed TIGHT cluster (x/y = % of stage), mirroring the 1.5B mockup:
// Physics is the big front-centre hero; chemistry crowns the top; biology/math
// flank it; computer-science + psychology anchor the lower corners. Kept close
// together and large so the worlds read as one connected archipelago.
const LAYOUT: Array<IslandCfg> = [
  { slug: 'chemistry', accent: '#FDCB6E', emblem: 'Hexagon', x: 50, y: 23, scale: 1.0, tier: 'far' },
  { slug: 'biology', accent: '#2ecc71', emblem: 'Dna', x: 28, y: 33, scale: 0.98, tier: 'far' },
  { slug: 'math', accent: '#74B9FF', emblem: 'Sigma', x: 72, y: 33, scale: 0.98, tier: 'far' },
  { slug: 'computer-science', accent: '#00d2d3', emblem: 'CodeXml', x: 26, y: 67, scale: 1.12, tier: 'mid' },
  { slug: 'psychology', accent: '#E84393', emblem: 'Brain', x: 74, y: 67, scale: 1.12, tier: 'mid' },
  { slug: 'physics', accent: '#4F8CFF', emblem: 'Atom', x: 50, y: 63, scale: 1.32, tier: 'near' },
]

// Glowing energy spans between adjacent islands (slug pairs). Physics is the
// hub; the rim islands also wire to their neighbours so the cluster reads as a
// single lit network. Drawn center-to-center — the islands occlude the ends, so
// only the span between two silhouettes shows (reads as edge-to-edge docks).
const BRIDGES: Array<[string, string]> = [
  ['physics', 'chemistry'],
  ['physics', 'computer-science'],
  ['physics', 'psychology'],
  ['chemistry', 'biology'],
  ['chemistry', 'math'],
  ['biology', 'computer-science'],
  ['math', 'psychology'],
]

const TIER_PARALLAX: Record<Tier, number> = { far: 10, mid: 22, near: 38 }

export function SubjectsHub({ subjects }: { subjects: Array<HubSubject> }) {
  const reduce = useReducedMotion()
  const navigate = useNavigate()
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tierRefs = {
    far: useRef<HTMLDivElement>(null),
    mid: useRef<HTMLDivElement>(null),
    near: useRef<HTMLDivElement>(null),
  }

  // "Dive into the island" transition: clicking a live island blooms its accent
  // out from its position to a white-out, then navigates to the category world.
  const [dive, setDive] = useState<{
    slug: string
    accent: string
    x: number
    y: number
  } | null>(null)
  const startDive = (cfg: IslandCfg) => {
    if (dive) return
    setDive({ slug: cfg.slug, accent: cfg.accent, x: cfg.x, y: cfg.y })
  }

  const bySlug = new Map(subjects.map((s) => [s.slug, s]))

  // Pointer parallax — backdrop drifts least, near islands most.
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
    const set = (el: HTMLElement | null, f: number) => {
      if (el) el.style.transform = `translate(${cx * -f}px, ${cy * -f}px)`
    }
    const tick = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      set(tierRefs.far.current, TIER_PARALLAX.far)
      set(tierRefs.mid.current, TIER_PARALLAX.mid)
      set(tierRefs.near.current, TIER_PARALLAX.near)
      raf = requestAnimationFrame(tick)
    }
    wrap.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      wrap.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Atmosphere: additive (screen-blend) bloom — nebula glows, drifting star
  // particles, and the glowing energy bridges with flowing light + pulses.
  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !wrap || !ctx) return
    const reduceM = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let w = 0
    let h = 0
    const resize = () => {
      const r = wrap.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    // Quadratic-bezier point (bridges arc with a gentle downward sag).
    const quad = (
      ax: number, ay: number, cx: number, cy: number, bx: number, by: number, u: number,
    ) => {
      const m = 1 - u
      return {
        x: m * m * ax + 2 * m * u * cx + u * u * bx,
        y: m * m * ay + 2 * m * u * cy + u * u * by,
      }
    }

    const drawBridge = (
      ax: number, ay: number, bx: number, by: number, phase: number, t: number,
    ) => {
      const mx = (ax + bx) / 2
      const my = (ay + by) / 2
      const dist = Math.hypot(bx - ax, by - ay)
      const sag = Math.min(34, dist * 0.1)
      const cx = mx
      const cy = my + sag
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      const path = () => {
        ctx.beginPath()
        ctx.moveTo(ax, ay)
        ctx.quadraticCurveTo(cx, cy, bx, by)
      }
      // halo → core (additive build-up = bloom)
      path(); ctx.strokeStyle = 'rgba(120,200,255,0.14)'; ctx.lineWidth = 22; ctx.stroke()
      path(); ctx.strokeStyle = 'rgba(165,225,255,0.22)'; ctx.lineWidth = 10; ctx.stroke()
      path(); ctx.strokeStyle = 'rgba(210,240,255,0.5)'; ctx.lineWidth = 5; ctx.stroke()
      path(); ctx.strokeStyle = 'rgba(235,251,255,0.95)'; ctx.lineWidth = 2.4; ctx.stroke()
      // flowing energy
      if (!reduceM) {
        ctx.setLineDash([6, 16])
        ctx.lineDashOffset = -((t * 55 + phase * 30) % 22)
        path(); ctx.strokeStyle = 'rgba(225,252,255,1)'; ctx.lineWidth = 3; ctx.stroke()
        ctx.setLineDash([])
      }
      // travelling pulses
      const pulses = reduceM ? [0.5] : [(t * 0.13 + phase) % 1, (t * 0.13 + phase + 0.5) % 1]
      for (const u of pulses) {
        const p = quad(ax, ay, cx, cy, bx, by, u)
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 13)
        g.addColorStop(0, 'rgba(240,253,255,0.98)')
        g.addColorStop(1, 'rgba(120,200,255,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(p.x, p.y, 13, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    let raf = 0
    const draw = () => {
      const t = performance.now() / 1000
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      // bridges — dock each end near the island's edge so the whole glowing
      // span sits in the visible gap between two islands (not buried under them).
      BRIDGES.forEach(([sa, sb], i) => {
        const a = LAYOUT.find((c) => c.slug === sa)
        const b = LAYOUT.find((c) => c.slug === sb)
        if (!a || !b) return
        const ax = (a.x / 100) * w
        const ay = (a.y / 100) * h
        const bx = (b.x / 100) * w
        const by = (b.y / 100) * h
        const ar = ((a.scale * 19) / 2 / 100) * w * 0.68
        const br = ((b.scale * 19) / 2 / 100) * w * 0.68
        const dx = bx - ax
        const dy = by - ay
        const len = Math.hypot(dx, dy) || 1
        const ux = dx / len
        const uy = dy / len
        drawBridge(ax + ux * ar, ay + uy * ar, bx - ux * br, by - uy * br, i * 0.27, t)
      })

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      if (!reduceM) raf = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const tiers: Array<Tier> = ['far', 'mid', 'near']

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden"
      style={{ height: 'calc(100vh - 64px)', minHeight: 600 }}
    >
      {/* the shared universe (CosmosBackdrop) shows through; this layer adds the
          glowing energy bridges + foreground motes over it */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />

      {/* title */}
      <div className="pointer-events-none absolute inset-x-0 top-5 z-10 flex flex-col items-center gap-1">
        <div className="rounded-full border border-white/10 bg-black/30 px-4 py-1.5 text-sm font-semibold tracking-wide text-ink backdrop-blur-md">
          Choose your science
        </div>
      </div>

      {/* island tiers (far → near) */}
      {tiers.map((tier) => (
        <div
          key={tier}
          ref={tierRefs[tier]}
          className="absolute inset-0 will-change-transform"
        >
          {LAYOUT.filter((c) => c.tier === tier).map((cfg, i) => {
            const subject = bySlug.get(cfg.slug)
            if (!subject) return null
            return (
              <Island
                key={cfg.slug}
                cfg={cfg}
                subject={subject}
                reduce={Boolean(reduce)}
                index={i}
                onDive={reduce ? undefined : () => startDive(cfg)}
              />
            )
          })}
        </div>
      ))}

      {/* dive transition — accent bloom expands from the island, whites out,
          then navigates into the category world */}
      {dive && (
        <div className="pointer-events-none fixed inset-0 z-50">
          <div className="absolute" style={{ left: `${dive.x}%`, top: `${dive.y}%` }}>
            <motion.div
              className="rounded-full"
              style={{
                width: '42vmax',
                height: '42vmax',
                x: '-50%',
                y: '-50%',
                background: `radial-gradient(circle, #ffffff 0%, ${dive.accent} 36%, ${dive.accent}00 70%)`,
                mixBlendMode: 'screen',
              }}
              initial={{ scale: 0.06, opacity: 0.65 }}
              animate={{ scale: 7, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.42, 0, 1, 1] }}
              onAnimationComplete={() =>
                navigate({
                  to: '/subjects/$subjectSlug',
                  params: { subjectSlug: dive.slug },
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}

function Island({
  cfg,
  subject,
  reduce,
  index,
  onDive,
}: {
  cfg: IslandCfg
  subject: HubSubject
  reduce: boolean
  index: number
  onDive?: () => void
}) {
  const live = subject.isPublished
  const widthPct = cfg.scale * 19
  const badge = Math.round(40 * cfg.scale)
  const hero = cfg.tier === 'near'
  const cls = 'absolute block -translate-x-1/2 -translate-y-1/2'
  const style = { left: `${cfg.x}%`, top: `${cfg.y}%`, width: `${widthPct}%` } as const

  // Clip overlays to the island silhouette via the PNG's own alpha channel.
  const maskUrl = `url(/islands/${cfg.slug}.png?v=3)`
  const maskStyle = {
    WebkitMaskImage: maskUrl,
    maskImage: maskUrl,
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
  } as const

  const inner = (
    <div className="group relative">
      <div className="relative transition-transform duration-300 ease-out group-hover:scale-[1.06]">
        {/* accent bloom — pulses softly for the available (live) island */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-[6%] rounded-full blur-3xl"
          style={{ background: cfg.accent, mixBlendMode: 'screen' }}
          animate={
            reduce
              ? { opacity: live ? 0.42 : 0.14 }
              : live
                ? { opacity: [0.3, 0.52, 0.3] }
                : { opacity: 0.14 }
          }
          transition={
            reduce || !live
              ? undefined
              : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
          }
        />

        {/* float-bob wrapper — art + masked energy FX move as one so the
            shimmer stays locked to the island silhouette */}
        <motion.div
          className="relative"
          animate={reduce ? undefined : { y: [0, -12, 0] }}
          transition={
            reduce
              ? undefined
              : {
                  duration: 5 + index * 0.7 + (hero ? 0.5 : 0),
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
        >
          <img
            src={`/islands/${cfg.slug}.png?v=3`}
            alt=""
            draggable={false}
            decoding="async"
            className={cn(
              'relative block w-full select-none',
              !live && 'opacity-80 grayscale-[0.4]',
            )}
            style={{
              filter: live ? `drop-shadow(0 14px 34px ${cfg.accent}cc)` : undefined,
            }}
          />

          {/* energy shimmer — a bright accent streak sweeps the silhouette */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              ...maskStyle,
              mixBlendMode: 'screen',
              opacity: live ? 0.9 : 0.4,
              backgroundImage: `linear-gradient(115deg, transparent 44%, ${cfg.accent} 49%, rgba(255,255,255,0.9) 50%, ${cfg.accent} 51%, transparent 56%)`,
              backgroundSize: '260% 100%',
            }}
            animate={reduce ? undefined : { backgroundPosition: ['175% 0%', '-75% 0%'] }}
            transition={
              reduce
                ? undefined
                : {
                    duration: 2.8,
                    repeat: Infinity,
                    repeatDelay: 2.6,
                    ease: 'easeInOut',
                    delay: index * 0.7,
                  }
            }
          />

          {/* breathing accent core — the island pulses with energy (live only) */}
          {live && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ ...maskStyle, mixBlendMode: 'screen', background: cfg.accent }}
              animate={reduce ? { opacity: 0.12 } : { opacity: [0.05, 0.18, 0.05] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }
              }
            />
          )}
        </motion.div>

        {!live && (
          <span className="absolute right-[12%] top-[10%] grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-black/55 text-muted backdrop-blur-sm">
            <Icon name="Lock" size={15} />
          </span>
        )}

        {/* emblem + label overlay (centred on the island, name below the emblem) */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[42%] flex flex-col items-center gap-1.5"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}
        >
          {/* glass emblem badge */}
          <div className="relative grid place-items-center">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full blur-md"
              style={{ background: cfg.accent, opacity: live ? 0.55 : 0.2 }}
            />
            <div
              className="relative grid place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md"
              style={{
                width: badge,
                height: badge,
                boxShadow: live
                  ? `0 0 18px ${cfg.accent}aa, inset 0 0 12px ${cfg.accent}55`
                  : 'inset 0 0 10px rgba(255,255,255,0.08)',
              }}
            >
              <Icon
                name={cfg.emblem}
                size={Math.round(badge * 0.5)}
                style={{
                  color: '#fff',
                  filter: live ? `drop-shadow(0 0 6px ${cfg.accent})` : undefined,
                }}
              />
            </div>
          </div>

          <p
            className={cn(
              'whitespace-nowrap font-extrabold tracking-wide',
              hero ? 'text-2xl' : 'text-lg',
              live ? 'text-ink' : 'text-muted',
            )}
          >
            {subject.name}
          </p>
          <p
            className={cn('text-xs font-semibold', !live && 'text-muted')}
            style={{ color: live ? cfg.accent : undefined }}
          >
            {live ? 'Enter →' : 'Coming soon'}
          </p>
        </div>
      </div>
    </div>
  )

  if (live) {
    return (
      <Link
        to="/subjects/$subjectSlug"
        params={{ subjectSlug: subject.slug }}
        className={cn(cls, 'cursor-pointer')}
        style={style}
        onClick={(e) => {
          // Play the dive transition, then navigate ourselves. Modified clicks
          // (new tab) and reduced-motion (no onDive) keep the plain Link nav.
          if (onDive && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
            e.preventDefault()
            onDive()
          }
        }}
      >
        {inner}
      </Link>
    )
  }
  return (
    <div className={cn(cls, 'cursor-not-allowed')} style={style} title="Coming soon">
      {inner}
    </div>
  )
}
