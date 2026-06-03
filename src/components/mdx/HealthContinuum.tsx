import { useState } from 'react'

// Health isn't a switch (sick / not sick) — it's a continuum you slide along all
// the time. Drag the marker to see how the same person moves between serious
// illness, a neutral middle, and peak wellness.
// Owner: what-is-health (W1).

type Band = {
  max: number
  label: string
  blurb: string
  color: string
}

// 0..100 scale, low = illness, high = peak wellness.
const BANDS: Array<Band> = [
  { max: 20, label: 'Serious illness', blurb: 'Disease or injury dominates daily life; treatment is the focus.', color: '#E74C3C' },
  { max: 40, label: 'Below par', blurb: 'Run-down, frequent symptoms, low energy — coping but not thriving.', color: '#E67E22' },
  { max: 60, label: 'Neutral', blurb: 'No obvious disease, but not really flourishing either. "Fine."', color: '#F1C40F' },
  { max: 80, label: 'Good health', blurb: 'Energetic, resilient, sleeping and moving well, rarely ill.', color: '#9BDE3C' },
  { max: 101, label: 'Peak wellness', blurb: 'Thriving across body and mind — strong, calm, connected, purposeful.', color: '#2ECC71' },
]

function bandFor(v: number): Band {
  return BANDS.find((b) => v < b.max) ?? BANDS[BANDS.length - 1]
}

export function HealthContinuum() {
  const [v, setV] = useState(55)
  const band = bandFor(v)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold text-muted">
        <span>← Illness</span>
        <span>Wellness →</span>
      </div>

      {/* the spectrum bar */}
      <div className="relative h-5 w-full overflow-hidden rounded-full">
        <div
          className="h-full w-full"
          style={{
            background:
              'linear-gradient(90deg,#E74C3C 0%,#E67E22 25%,#F1C40F 50%,#9BDE3C 75%,#2ECC71 100%)',
          }}
        />
        {/* marker */}
        <div
          className="absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white shadow"
          style={{ left: `${v}%`, background: band.color }}
        />
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        className="mt-3 w-full accent-accent"
        aria-label="Health continuum position"
      />

      <div className="mt-3 rounded-xl border border-border bg-surface-2 p-3">
        <div className="text-sm font-semibold" style={{ color: band.color }}>
          {band.label}
        </div>
        <p className="mt-1 text-sm text-muted">{band.blurb}</p>
      </div>

      <p className="mt-3 text-xs text-muted">
        Notice there's no single line between "ill" and "well." Most people sit somewhere in the
        middle and drift up or down with sleep, stress, food, and life. Health is something you
        <span className="text-ink"> tend toward</span>, not a box you're permanently in.
      </p>
    </div>
  )
}
