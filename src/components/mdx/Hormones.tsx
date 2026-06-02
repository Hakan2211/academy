import { useState } from 'react'
import { cn } from '#/lib/cn'

// The endocrine system: glands that release hormones into the blood to control
// the body more slowly and widely than nerves. Click a gland.
type Gland = { id: string; label: string; x: number; y: number; hormone: string; fn: string }

const GLANDS: Array<Gland> = [
  { id: 'pituitary', label: 'Pituitary', x: 60, y: 24, hormone: 'growth & control hormones', fn: 'The "master gland" — it releases hormones that switch the other glands on and off, plus growth hormone.' },
  { id: 'thyroid', label: 'Thyroid', x: 60, y: 56, hormone: 'thyroxine', fn: 'Sets your metabolic rate — how fast your cells release energy.' },
  { id: 'adrenal', label: 'Adrenal', x: 60, y: 96, hormone: 'adrenaline', fn: 'The "fight or flight" hormone — raises heart rate and breathing to prepare for action.' },
  { id: 'pancreas', label: 'Pancreas', x: 60, y: 116, hormone: 'insulin & glucagon', fn: 'Controls blood glucose — insulin lowers it, glucagon raises it.' },
  { id: 'gonads', label: 'Ovaries / Testes', x: 60, y: 150, hormone: 'oestrogen / testosterone', fn: 'Drive sexual development and reproduction.' },
]

export function Hormones() {
  const [sel, setSel] = useState('pancreas')
  const g = GLANDS.find((x) => x.id === sel)!

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="grid grid-cols-[120px_1fr] gap-3">
        <svg viewBox="0 0 120 180" className="w-full">
          {/* simple body outline */}
          <path d="M 60 8 a 12 12 0 1 0 0.1 0 M 60 28 q -22 6 -22 34 l 4 50 q 0 30 8 56 M 60 28 q 22 6 22 34 l -4 50 q 0 30 -8 56 M 42 168 l 36 0" fill="none" stroke="#334155" strokeWidth={2} />
          {GLANDS.map((gl) => (
            <g key={gl.id} onClick={() => setSel(gl.id)} className="cursor-pointer">
              <circle cx={gl.x} cy={gl.y} r={6} fill={sel === gl.id ? '#FACC15' : '#0984E3'} stroke="#fff" strokeWidth={1} />
            </g>
          ))}
        </svg>

        <div className="flex flex-col">
          <div className="mb-2 flex flex-wrap gap-1">
            {GLANDS.map((gl) => (
              <button key={gl.id} type="button" onClick={() => setSel(gl.id)} className={cn('rounded-full border px-2 py-0.5 text-[11px] transition-colors', sel === gl.id ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}>
                {gl.label}
              </button>
            ))}
          </div>
          <div className="rounded-lg bg-surface-2 px-3 py-2">
            <p className="text-sm font-semibold text-ink">{g.label}</p>
            <p className="text-xs text-accent-2">releases {g.hormone}</p>
            <p className="mt-1 text-sm text-muted">{g.fn}</p>
          </div>
        </div>
      </div>

      <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-xs text-muted">
        <span className="font-semibold text-ink">Nerves vs hormones:</span> nerve signals are electrical, fast, and short-lived, aimed at one target. Hormones are chemical, slower, longer-lasting, and travel everywhere in the blood.
      </p>
    </div>
  )
}
