import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const BARRIER = 90
const SCREEN = 430
const MID = 120
const RINGS = 7
const RMAX = 380

// Young's double slit. Two slits turn one wave into two overlapping sources; on
// the screen they interfere into bright and dark bands — proof that light is a
// wave. Wavefronts animate (rAF); the fringe pattern recomputes from the slit
// separation and wavelength you choose.
export function DoubleSlit() {
  const [sep, setSep] = useState(48)
  const [wl, setWl] = useState(38)
  const sepRef = useRef(sep)
  const wlRef = useRef(wl)
  const ringRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => { sepRef.current = sep }, [sep])
  useEffect(() => { wlRef.current = wl }, [wl])

  useEffect(() => {
    let raf = 0
    let last = 0
    let phase = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      phase = (phase + dt * 0.05) % RMAX
      const s = sepRef.current
      const w = wlRef.current
      const ys = [MID - s / 2, MID + s / 2]
      for (let src = 0; src < 2; src++) {
        for (let i = 0; i < RINGS; i++) {
          const el = ringRefs.current[src * RINGS + i]
          if (!el) continue
          el.setAttribute('cx', String(BARRIER))
          el.setAttribute('cy', String(ys[src]))
          el.setAttribute('r', String((phase + i * w) % RMAX))
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const s0 = MID - sep / 2
  const s1 = MID + sep / 2
  const cells = []
  for (let y = 24; y <= 216; y += 6) {
    const d1 = Math.hypot(SCREEN - BARRIER, y - s0)
    const d2 = Math.hypot(SCREEN - BARRIER, y - s1)
    const intensity = Math.cos((Math.PI * (d2 - d1)) / wl) ** 2
    cells.push({ y, intensity })
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 460 240" className="w-full">
        <defs>
          <clipPath id="rightOfBarrier">
            <rect x={BARRIER} y="0" width={460 - BARRIER} height="240" />
          </clipPath>
        </defs>

        {/* expanding wavefronts from each slit */}
        <g clipPath="url(#rightOfBarrier)">
          {Array.from({ length: RINGS * 2 }).map((_, i) => (
            <circle
              key={i}
              ref={(el) => { ringRefs.current[i] = el }}
              cx={BARRIER}
              cy={MID}
              r="0"
              fill="none"
              stroke="var(--color-accent-2)"
              strokeWidth="1.5"
              opacity="0.35"
            />
          ))}
        </g>

        {/* barrier with two slits */}
        <rect x={BARRIER - 4} y="16" width="8" height={s0 - 6 - 16} fill="var(--color-ink)" />
        <rect x={BARRIER - 4} y={s0 + 6} width="8" height={s1 - 6 - (s0 + 6)} fill="var(--color-ink)" />
        <rect x={BARRIER - 4} y={s1 + 6} width="8" height={224 - (s1 + 6)} fill="var(--color-ink)" />
        <circle cx={BARRIER} cy={s0} r="3" fill="#fdcb6e" />
        <circle cx={BARRIER} cy={s1} r="3" fill="#fdcb6e" />

        {/* screen + fringe pattern */}
        {cells.map((c) => (
          <rect key={c.y} x={SCREEN + 2} y={c.y - 3} width="18" height="6" fill="var(--color-accent-2)" opacity={c.intensity} />
        ))}
        <line x1={SCREEN} y1="16" x2={SCREEN} y2="224" stroke="var(--color-border)" strokeWidth="2" />
        <text x={SCREEN + 11} y="234" fill="var(--color-muted)" fontSize="10" textAnchor="middle">screen</text>
      </svg>

      <div className="grid gap-4 px-4 pt-2 sm:grid-cols-2">
        <SceneSlider label="Slit separation" value={sep} min={24} max={80} step={2} unit="" onChange={setSep} />
        <SceneSlider label="Wavelength" value={wl} min={26} max={56} step={2} unit="" onChange={setWl} />
      </div>
      <p className="px-4 pb-4 pt-3 text-center text-xs text-muted">
        Bright bands where the two waves arrive in step, dark where they cancel. Closer slits or longer waves spread the fringes wider.
      </p>
    </div>
  )
}
