import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

const PY_TOP = 30
const PY_BASE = 196
const LX0 = 70
const LX1 = 300
const ELEC_X = 220

const LEVELS = [1, 2, 3, 4]
const energy = (n: number) => -13.6 / (n * n)
const yFor = (n: number) => PY_TOP + (PY_BASE - PY_TOP) * ((0 - energy(n)) / 13.6)
const LY: Record<number, number> = { 1: yFor(1), 2: yFor(2), 3: yFor(3), 4: yFor(4) }

// Visible-light wavelength → approximate RGB. Returns '' outside 380–750 nm.
function nmToColor(nm: number): string {
  if (nm < 380 || nm > 750) return ''
  let r = 0
  let g = 0
  let b = 0
  if (nm < 440) { r = -(nm - 440) / 60; b = 1 }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1 }
  else if (nm < 510) { g = 1; b = -(nm - 510) / 20 }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1 }
  else if (nm < 645) { r = 1; g = -(nm - 645) / 65 }
  else { r = 1 }
  let f = 1
  if (nm < 420) f = 0.3 + (0.7 * (nm - 380)) / 40
  else if (nm > 700) f = 0.3 + (0.7 * (750 - nm)) / 50
  const ch = (c: number) => Math.round(255 * Math.pow(Math.max(0, c) * f, 0.8))
  return `rgb(${ch(r)},${ch(g)},${ch(b)})`
}

type Photon = { active: boolean; x: number; y: number; vx: number; color: string; life: number }

// Electrons in an atom can only sit on fixed energy "rungs" — never in between.
// Drop to a lower rung and the atom spits out a photon of an exact colour; the
// bigger the drop, the bluer the light. Those precise colours are the fingerprint
// every element leaves in its spectrum. Click a level to send the electron there.
export function EnergyLevels() {
  const [curN, setCurN] = useState(3)
  const [info, setInfo] = useState('Click a level to make the electron jump.')
  const [lines, setLines] = useState<Array<{ nm: number; color: string }>>([])
  const targetYRef = useRef(LY[3])
  const elecYRef = useRef(LY[3])
  const elecRef = useRef<SVGCircleElement>(null)
  const photonRef = useRef<SVGCircleElement>(null)
  const photon = useRef<Photon>({ active: false, x: 0, y: 0, vx: 0, color: '', life: 0 })

  useEffect(() => {
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      elecYRef.current += (targetYRef.current - elecYRef.current) * 0.16
      elecRef.current?.setAttribute('cy', elecYRef.current.toFixed(1))
      const p = photon.current
      if (p.active) {
        p.x += p.vx * dt
        p.life -= dt
        if (p.life <= 0 || p.x < 60 || p.x > 400) p.active = false
      }
      const pel = photonRef.current
      if (pel) {
        pel.setAttribute('opacity', p.active ? '1' : '0')
        pel.setAttribute('cx', p.x.toFixed(1))
        pel.setAttribute('cy', p.y.toFixed(1))
        pel.setAttribute('fill', p.color || '#8e8ea8')
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const select = (t: number) => {
    const prev = curN
    if (t === prev) return
    const hi = Math.max(prev, t)
    const lo = Math.min(prev, t)
    const dE = 13.6 * (1 / (lo * lo) - 1 / (hi * hi))
    const nm = 1240 / dE
    const col = nmToColor(nm)
    const emit = t < prev
    setCurN(t)
    targetYRef.current = LY[t]
    const midY = (LY[prev] + LY[t]) / 2
    photon.current = {
      active: true,
      x: emit ? ELEC_X + 16 : 392,
      y: midY,
      vx: emit ? 0.16 : -0.16,
      color: col,
      life: 1500,
    }
    setInfo(
      `n=${prev} → n=${t}: ${emit ? 'emits' : 'absorbs'} a ${Math.round(nm)} nm photon${col ? '' : ' (invisible — UV/IR)'}`,
    )
    if (emit && col) setLines((l) => [...l.slice(-5), { nm, color: col }])
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {LEVELS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => select(n)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              curN === n ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            n = {n}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 400 244" className="w-full">
        {LEVELS.map((n) => (
          <g key={n}>
            <line x1={LX0} y1={LY[n]} x2={LX1} y2={LY[n]} stroke="var(--color-border)" strokeWidth="1.5" />
            <text x={LX1 + 6} y={LY[n] + 4} fill="var(--color-muted)" fontSize="10">
              n={n} · {energy(n).toFixed(2)} eV
            </text>
          </g>
        ))}
        {/* nucleus marker */}
        <circle cx={ELEC_X} cy={PY_BASE + 6} r="4" fill="#e17055" />
        {/* photon */}
        <circle ref={photonRef} cx="0" cy="0" r="5" fill="#8e8ea8" opacity="0" />
        {/* electron */}
        <circle ref={elecRef} cx={ELEC_X} cy={LY[3]} r="7" fill="#0984e3" />

        {/* emission-spectrum strip */}
        <rect x={LX0} y="220" width={LX1 - LX0} height="16" rx="2" fill="#1a1a2e" />
        <text x={LX1 + 6} y="232" fill="var(--color-muted)" fontSize="9">spectrum</text>
        {lines.map((ln, i) => {
          const x = LX0 + ((700 - ln.nm) / (700 - 400)) * (LX1 - LX0)
          const cx = Math.max(LX0, Math.min(LX1, x))
          return <line key={i} x1={cx} y1="220" x2={cx} y2="236" stroke={ln.color} strokeWidth="2.5" />
        })}
      </svg>

      <p className="px-4 pb-4 pt-1 text-center text-sm text-muted">{info}</p>
    </div>
  )
}
