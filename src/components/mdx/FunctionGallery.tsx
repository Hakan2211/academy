import { useState } from 'react'
import { makeScale, fnPath } from '#/lib/math'

// A gallery of the function families. Each has its own signature shape — line,
// parabola, twist, hyperbola, explosion, wave, circle. Toggle through them.
// Used in the-gallery-of-functions deep-dive.
const FNS = [
  { key: 'linear', label: 'Linear', eq: 'y = x', f: (x: number) => x, note: 'straight line — constant rate of change.' },
  { key: 'quad', label: 'Quadratic', eq: 'y = x²', f: (x: number) => x * x, note: 'parabola — a single turning point.' },
  { key: 'cubic', label: 'Cubic', eq: 'y = x³', f: (x: number) => x * x * x, note: 'an S-shaped twist — up to two turns.' },
  { key: 'recip', label: 'Reciprocal', eq: 'y = 1/x', f: (x: number) => 1 / x, note: 'hyperbola — two branches, asymptotes at the axes.' },
  { key: 'exp', label: 'Exponential', eq: 'y = 2ˣ', f: (x: number) => Math.pow(2, x), note: 'explosive growth; never touches zero.' },
  { key: 'sine', label: 'Sine', eq: 'y = sin x', f: (x: number) => 3 * Math.sin(x), note: 'endless wave — periodic, repeats forever.' },
]

export function FunctionGallery() {
  const [i, setI] = useState(0)
  const fn = FNS[i]
  const W = 300
  const H = 260
  const px = makeScale(-6, 6, 12, W - 8)
  const py = makeScale(-6, 6, H - 10, 10)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {FNS.map((f, k) => (
          <button key={f.key} onClick={() => setI(k)} className={`rounded-lg border px-2.5 py-1 text-xs transition ${k === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-xs">
        {[-4, -2, 2, 4].map((g) => (
          <g key={g}>
            <line x1={px(g)} y1={py(-6)} x2={px(g)} y2={py(6)} stroke="var(--color-border)" strokeWidth="0.5" opacity="0.3" />
            <line x1={px(-6)} y1={py(g)} x2={px(6)} y2={py(g)} stroke="var(--color-border)" strokeWidth="0.5" opacity="0.3" />
          </g>
        ))}
        <line x1={px(-6)} y1={py(0)} x2={px(6)} y2={py(0)} stroke="var(--color-muted)" strokeWidth="1.2" />
        <line x1={px(0)} y1={py(-6)} x2={px(0)} y2={py(6)} stroke="var(--color-muted)" strokeWidth="1.2" />
        <path d={fnPath(fn.f, -6, 6, px, py, 240, 50)} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
      </svg>

      <p className="mt-2 text-center">
        <span className="font-mono text-lg font-bold text-accent">{fn.eq}</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">{fn.note}</p>
    </div>
  )
}
