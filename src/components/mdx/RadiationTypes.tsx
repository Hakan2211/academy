import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

type Mode = 'alpha' | 'beta' | 'gamma'

const START = 54
const N = 7

const META: Record<Mode, { color: string; label: string; stopX: number; speed: number; stopName: string }> = {
  alpha: { color: '#e17055', label: 'α  helium nucleus · charge +2', stopX: 150, speed: 0.08, stopName: 'a sheet of paper' },
  beta: { color: '#0984e3', label: 'β  electron · charge −1', stopX: 250, speed: 0.17, stopName: 'a few mm of aluminium' },
  gamma: { color: '#6c5ce7', label: 'γ  photon · no charge', stopX: 344, speed: 0.27, stopName: 'thick lead (and even then only weakened)' },
}

// The three radiations a nucleus throws out, ranked by how far they punch through
// matter. Alpha is big and slow — paper stops it. Beta slips through paper but
// not aluminium. Gamma is pure energy and needs dense lead to soak it up.
export function RadiationTypes() {
  const [mode, setMode] = useState<Mode>('alpha')
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    const m = META[mode]
    const xs: Array<number> = []
    for (let i = 0; i < N; i++) xs.push(START + (i / N) * (m.stopX - START))
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      for (let i = 0; i < N; i++) {
        xs[i] += m.speed * dt
        if (xs[i] >= m.stopX) xs[i] = START
        const el = dotRefs.current[i]
        if (el) {
          el.setAttribute('cx', xs[i].toFixed(1))
          el.setAttribute('opacity', xs[i] > m.stopX - 14 ? '0.25' : '0.95')
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [mode])

  const m = META[mode]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {(['alpha', 'beta', 'gamma'] as Array<Mode>).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setMode(k)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              mode === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {k === 'alpha' ? 'α alpha' : k === 'beta' ? 'β beta' : 'γ gamma'}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 400 200" className="w-full">
        {/* source */}
        <rect x="20" y="98" width="32" height="44" rx="5" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
        <text x="36" y="160" fill="var(--color-muted)" fontSize="11" textAnchor="middle">source</text>

        {/* barriers */}
        <rect x="148" y="66" width="4" height="108" fill="#d8c8a0" />
        <text x="150" y="186" fill="var(--color-muted)" fontSize="10" textAnchor="middle">paper</text>
        <rect x="245" y="62" width="9" height="116" fill="#b2bec3" />
        <text x="250" y="186" fill="var(--color-muted)" fontSize="10" textAnchor="middle">aluminium</text>
        <rect x="335" y="58" width="15" height="124" fill="#636e72" />
        <text x="343" y="186" fill="var(--color-muted)" fontSize="10" textAnchor="middle">lead</text>

        {/* radiation particles */}
        {Array.from({ length: N }).map((_, i) => (
          <circle
            key={i}
            ref={(el) => { dotRefs.current[i] = el }}
            cx={START}
            cy={120 + (i - (N - 1) / 2) * 5}
            r="4.5"
            fill={m.color}
          />
        ))}
      </svg>

      <p className="px-4 pb-1 pt-1 text-center text-sm font-semibold" style={{ color: m.color }}>
        {m.label}
      </p>
      <p className="px-4 pb-4 text-center text-xs text-muted">
        {mode === 'alpha'
          ? 'Alpha is the heaviest and least penetrating — stopped by '
          : mode === 'beta'
            ? 'Beta punches through paper but is stopped by '
            : 'Gamma is the most penetrating — it needs '}
        {m.stopName}.
      </p>
    </div>
  )
}
