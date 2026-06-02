import { useState } from 'react'

// Volume of the curved/pointed solids: cone ⅓πr²h, sphere 4⁄3πr³, pyramid ⅓b²h.
// The recurring ⅓ links a cone to its enclosing cylinder. Used in
// volume-of-pyramids-cones-spheres and why-the-formulas-work.
const SOLIDS = [
  { key: 'cone', label: 'Cone', formula: '⅓ π r² h' },
  { key: 'sphere', label: 'Sphere', formula: '4⁄3 π r³' },
  { key: 'pyramid', label: 'Pyramid', formula: '⅓ b² h' },
]

export function VolumeSolids() {
  const [i, setI] = useState(0)
  const [r, setR] = useState(3)
  const [h, setH] = useState(5)
  const key = SOLIDS[i].key

  const vol = key === 'cone' ? (Math.PI * r * r * h) / 3 : key === 'sphere' ? (4 / 3) * Math.PI * r * r * r : (r * r * h) / 3

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex justify-center gap-2">
        {SOLIDS.map((s, k) => (
          <button key={s.key} onClick={() => setI(k)} className={`rounded-lg border px-3 py-1 text-xs transition ${k === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            {s.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 200 140" className="mx-auto w-full max-w-[200px]">
        <g stroke="var(--color-accent)" strokeWidth="1.6" fill="var(--color-accent)" fillOpacity="0.15">
          {key === 'cone' && (
            <>
              <polygon points="100,25 60,110 140,110" />
              <ellipse cx="100" cy="110" rx="40" ry="12" />
            </>
          )}
          {key === 'sphere' && (
            <>
              <circle cx="100" cy="70" r="48" />
              <ellipse cx="100" cy="70" rx="48" ry="15" fill="none" strokeDasharray="3 3" />
            </>
          )}
          {key === 'pyramid' && (
            <>
              <polygon points="100,25 55,105 145,105" />
              <polygon points="55,105 145,105 120,118 80,118" fillOpacity="0.25" />
            </>
          )}
        </g>
      </svg>

      <div className="space-y-1.5 px-1 text-sm">
        <label className="flex items-center justify-between gap-3">
          <span className="text-muted">{key === 'pyramid' ? 'base side b' : 'radius r'}</span>
          <input type="range" min={1} max={6} value={r} onChange={(e) => setR(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-6 text-right font-mono text-ink">{r}</span>
        </label>
        {key !== 'sphere' && (
          <label className="flex items-center justify-between gap-3">
            <span className="text-muted">height h</span>
            <input type="range" min={1} max={8} value={h} onChange={(e) => setH(Number(e.target.value))} className="w-1/2 accent-accent" />
            <span className="w-6 text-right font-mono text-ink">{h}</span>
          </label>
        )}
      </div>

      <p className="mt-2 text-center font-mono text-sm">
        V = {SOLIDS[i].formula} = <span className="font-bold text-success">{+vol.toFixed(1)}</span> cubic units
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        {key === 'cone' ? 'A cone is exactly ⅓ of its enclosing cylinder.' : key === 'sphere' ? 'A sphere is ⅔ of its enclosing cylinder — Archimedes’ favourite result.' : 'A pyramid is ⅓ of its enclosing prism.'}
      </p>
    </div>
  )
}
