import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Brain-imaging methods compared. Each tool trades off WHAT it measures
// (structure vs activity), how finely it pins location (spatial resolution),
// and how fast it tracks change (temporal resolution). Click a tile; the chart
// plots where it sits on the time-vs-space map. No single tool wins — they're
// complementary.
type Method = {
  id: string
  label: string
  icon: string
  measures: string
  // resolution on a 0..1 scale (1 = best)
  spatial: number
  temporal: number
  detail: string
  invasive: string
}

const METHODS: Array<Method> = [
  {
    id: 'eeg',
    label: 'EEG',
    icon: 'Activity',
    measures: 'electrical activity (brain waves)',
    spatial: 0.2,
    temporal: 0.97,
    detail: 'Electrodes on the scalp read the summed firing of neurons in real time. Brilliant for timing — it catches changes in milliseconds — but poor at saying exactly where in the brain they came from.',
    invasive: 'Non-invasive · cheap · portable',
  },
  {
    id: 'fmri',
    label: 'fMRI',
    icon: 'Brain',
    measures: 'activity via blood-oxygen flow',
    spatial: 0.85,
    temporal: 0.35,
    detail: 'Tracks where blood (and oxygen) rushes as regions work — the BOLD signal. Excellent spatial detail (millimetres), but blood flow lags neural firing by seconds, so its timing is sluggish.',
    invasive: 'Non-invasive · expensive · big magnet',
  },
  {
    id: 'pet',
    label: 'PET',
    icon: 'Radiation',
    measures: 'metabolism via a radioactive tracer',
    spatial: 0.6,
    temporal: 0.2,
    detail: 'A short-lived radioactive tracer is injected; the scanner maps where it’s consumed (e.g. glucose use or a specific neurotransmitter’s receptors). Unique for chemistry, but slow and mildly invasive.',
    invasive: 'Mildly invasive (tracer) · slow',
  },
  {
    id: 'mri',
    label: 'MRI',
    icon: 'ScanLine',
    measures: 'fine anatomy (structure)',
    spatial: 0.95,
    temporal: 0.05,
    detail: 'A still, ultra-detailed photograph of brain structure using magnetic fields — no radiation. Shows anatomy and damage beautifully, but says nothing about activity over time.',
    invasive: 'Non-invasive · structural',
  },
  {
    id: 'ct',
    label: 'CT',
    icon: 'CircleDot',
    measures: 'coarse anatomy via X-rays',
    spatial: 0.55,
    temporal: 0.05,
    detail: 'Stacked X-ray slices build a 3-D structural image. Fast and widely available — good for spotting bleeds or tumours in an emergency — but lower detail than MRI and it uses radiation.',
    invasive: 'X-ray dose · fast · common',
  },
]

const PW = 300
const PH = 150
const PAD = 28
const px = (v: number) => PAD + v * (PW - 2 * PAD)
const py = (v: number) => PH - PAD - v * (PH - 2 * PAD)

export function BrainImaging() {
  const [sel, setSel] = useState('fmri')
  const m = METHODS.find((x) => x.id === sel)!

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-3 sm:grid-cols-5">
        {METHODS.map((meth) => (
          <button
            key={meth.id}
            type="button"
            onClick={() => setSel(meth.id)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-xl border px-2 py-2 text-center transition-colors',
              sel === meth.id ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={meth.icon} size={18} />
            <span className="text-sm font-semibold">{meth.label}</span>
          </button>
        ))}
      </div>

      {/* time vs space map */}
      <div className="mt-3">
        <p className="mb-1 text-xs text-muted">Where each tool sits: spatial detail (→) vs speed (↑)</p>
        <svg viewBox={`0 0 ${PW} ${PH}`} className="w-full">
          {/* axes */}
          <line x1={PAD} y1={PH - PAD} x2={PW - 12} y2={PH - PAD} stroke="var(--color-border)" strokeWidth={1} />
          <line x1={PAD} y1={PH - PAD} x2={PAD} y2={12} stroke="var(--color-border)" strokeWidth={1} />
          <text x={PW - 12} y={PH - PAD + 14} textAnchor="end" fontSize="9" fill="var(--color-muted)">finer spatial detail →</text>
          <text x={PAD - 6} y={16} textAnchor="start" fontSize="9" fill="var(--color-muted)">faster ↑</text>
          {METHODS.map((meth) => {
            const active = meth.id === sel
            return (
              <g key={meth.id} onClick={() => setSel(meth.id)} className="cursor-pointer">
                <circle cx={px(meth.spatial)} cy={py(meth.temporal)} r={active ? 7 : 5} fill={active ? '#FF6B9D' : 'var(--color-surface-2)'} stroke={active ? '#FF6B9D' : 'var(--color-border)'} strokeWidth={1.5} />
                <text x={px(meth.spatial)} y={py(meth.temporal) - 10} textAnchor="middle" fontSize="9" fill={active ? '#FF6B9D' : 'var(--color-muted)'} fontWeight={active ? 700 : 400}>{meth.label}</text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="mt-2 rounded-lg bg-surface-2 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: '#FF6B9D22', color: '#FF6B9D' }}>
            <Icon name={m.icon} size={16} />
          </span>
          <span className="text-sm font-semibold text-ink">{m.label}</span>
          <span className="text-xs text-accent-2">measures {m.measures}</span>
        </div>
        <p className="mt-1.5 text-sm text-muted">{m.detail}</p>
        <p className="mt-1 text-[11px] text-muted">{m.invasive}</p>
      </div>

      <p className="mt-2 text-xs text-muted">
        The deep trade-off: tools that see <span className="text-ink">where</span> with precision (MRI, fMRI) are slow; the tool that sees <span className="text-ink">when</span> with precision (EEG) is fuzzy about location. Researchers often combine them to get both.
      </p>
    </div>
  )
}
