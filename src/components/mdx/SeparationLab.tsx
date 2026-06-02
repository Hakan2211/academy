import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// Four classic ways to pull a mixture apart, each exploiting a different
// property: particle size (filtration), boiling point (evaporation,
// distillation), or how strongly things stick to a surface (chromatography).
type Mode = 'filtration' | 'evaporation' | 'distillation' | 'chromatography'

const MODES: Array<{ key: Mode; label: string }> = [
  { key: 'filtration', label: 'Filtration' },
  { key: 'evaporation', label: 'Evaporation' },
  { key: 'distillation', label: 'Distillation' },
  { key: 'chromatography', label: 'Chromatography' },
]

const CAPTION: Record<Mode, string> = {
  filtration: 'Filtration separates an insoluble solid from a liquid. The liquid slips through the filter paper; the bigger solid grains are trapped.',
  evaporation: 'Evaporation recovers a dissolved solid. Heat drives the water off as vapour, leaving the salt crystals behind.',
  distillation: 'Distillation separates liquids by boiling point. The liquid boils, the vapour rises, then cools and condenses back to a pure liquid.',
  chromatography: 'Chromatography separates dissolved dyes. Each pigment is carried up the paper at its own speed, so a mixed ink fans into bands.',
}

export function SeparationLab() {
  const [mode, setMode] = useState<Mode>('filtration')
  const dotsRef = useRef<SVGGElement | null>(null)
  const reset = useRef(0)

  useEffect(() => {
    reset.current++
    let raf = 0
    let p = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      p += dt * 0.0004
      if (p > 1) p = 0
      const g = dotsRef.current
      if (g) {
        // redraw the moving particles for the active mode
        let inner = ''
        if (mode === 'filtration') {
          // liquid drops fall through funnel into beaker; solids stay on filter
          for (let i = 0; i < 8; i++) {
            const ph = (p + i / 8) % 1
            const x = 160 + Math.sin(i * 2.1) * 10
            const y = 70 + ph * 70
            inner += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="#5DADE2" opacity="${(1 - ph).toFixed(2)}"/>`
          }
          // trapped solids
          for (let i = 0; i < 6; i++) {
            inner += `<circle cx="${(142 + i * 7).toFixed(1)}" cy="${(64 - (i % 2) * 4).toFixed(1)}" r="3" fill="#C9A66B"/>`
          }
        } else if (mode === 'evaporation') {
          // vapour rises, salt grains grow at the bottom
          for (let i = 0; i < 7; i++) {
            const ph = (p + i / 7) % 1
            const x = 150 + Math.sin(i * 1.7 + ph * 6) * 16
            const y = 110 - ph * 80
            inner += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#5DADE2" opacity="${(1 - ph).toFixed(2)}"/>`
          }
          for (let i = 0; i < 7; i++) {
            inner += `<rect x="${(132 + i * 8).toFixed(1)}" y="${(118 - (i % 3) * 3).toFixed(1)}" width="5" height="5" fill="#F1C40F"/>`
          }
        } else if (mode === 'distillation') {
          // vapour travels up-left flask, across, condenses down the right tube
          for (let i = 0; i < 6; i++) {
            const ph = (p + i / 6) % 1
            let x: number
            let y: number
            if (ph < 0.4) {
              x = 90
              y = 110 - (ph / 0.4) * 60
            } else if (ph < 0.6) {
              x = 90 + ((ph - 0.4) / 0.2) * 130
              y = 50
            } else {
              x = 220
              y = 50 + ((ph - 0.6) / 0.4) * 70
            }
            const col = ph < 0.55 ? '#E74C3C' : '#5DADE2'
            inner += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="${col}"/>`
          }
        } else {
          // chromatography: 3 pigments climb at different speeds
          const cols = ['#E74C3C', '#2ECC71', '#5DADE2']
          const speeds = [0.55, 0.8, 1]
          cols.forEach((c, i) => {
            const front = Math.min(1, p * speeds[i] * 1.4)
            const y = 124 - front * 90
            inner += `<rect x="${(120 + i * 24).toFixed(1)}" y="${y.toFixed(1)}" width="16" height="9" rx="3" fill="${c}" opacity="0.9"/>`
          })
        }
        g.innerHTML = inner
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [mode])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMode(m.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              mode === m.key
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 300 150" className="w-full">
        {/* static apparatus per mode */}
        {mode === 'filtration' && (
          <>
            <path d="M 130 40 L 190 40 L 165 78 L 155 78 Z" fill="none" stroke="var(--color-muted)" strokeWidth={2} />
            <path d="M 132 44 L 188 44 L 166 72 L 154 72 Z" fill="#5DADE2" opacity={0.25} />
            <rect x={138} y={100} width={44} height={42} rx={4} fill="none" stroke="var(--color-muted)" strokeWidth={2} />
            <rect x={140} y={120} width={40} height={20} fill="#5DADE2" opacity={0.3} />
          </>
        )}
        {mode === 'evaporation' && (
          <>
            <path d="M 120 110 Q 150 138 180 110" fill="#5DADE2" opacity={0.25} stroke="var(--color-muted)" strokeWidth={2} />
            <path d="M 135 138 L 165 138" stroke="#E67E22" strokeWidth={3} />
            <path d="M 142 146 q 4 -6 0 -10 M 150 148 q 5 -7 0 -12 M 158 146 q 4 -6 0 -10" stroke="#E67E22" strokeWidth={1.5} fill="none" opacity={0.7} />
          </>
        )}
        {mode === 'distillation' && (
          <>
            <circle cx={90} cy={118} r={22} fill="#E74C3C" opacity={0.18} stroke="var(--color-muted)" strokeWidth={2} />
            <line x1={90} y1={96} x2={90} y2={50} stroke="var(--color-muted)" strokeWidth={2} />
            <line x1={90} y1={50} x2={220} y2={50} stroke="var(--color-muted)" strokeWidth={2} />
            <line x1={220} y1={50} x2={220} y2={120} stroke="var(--color-muted)" strokeWidth={2} />
            <rect x={206} y={130} width={28} height={16} rx={3} fill="#5DADE2" opacity={0.3} stroke="var(--color-muted)" strokeWidth={1.5} />
            <path d="M 82 140 q 4 -6 0 -10 M 90 142 q 5 -7 0 -12 M 98 140 q 4 -6 0 -10" stroke="#E67E22" strokeWidth={1.5} fill="none" opacity={0.7} />
          </>
        )}
        {mode === 'chromatography' && (
          <>
            <rect x={110} y={28} width={70} height={110} rx={3} fill="var(--color-surface-2)" stroke="var(--color-border)" />
            <line x1={110} y1={124} x2={180} y2={124} stroke="var(--color-muted)" strokeWidth={1} strokeDasharray="3 3" />
            <text x={186} y={127} className="fill-muted text-[9px]">start</text>
          </>
        )}
        <g ref={dotsRef} />
      </svg>

      <p className="mt-2 min-h-[3rem] text-center text-sm text-muted">{CAPTION[mode]}</p>
    </div>
  )
}
