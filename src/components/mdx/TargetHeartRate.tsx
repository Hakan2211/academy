import { useState } from 'react'
import { maxHeartRate, hrZone, clamp } from '#/lib/health'

// Age slider → max HR (220 − age) → moderate & vigorous zones.
// A second slider for current BPM places a colour-coded zone marker.

type ZoneInfo = {
  label: string
  color: string
  desc: string
}

function getZoneInfo(pct: number): ZoneInfo {
  if (pct < 0.5) return { label: 'Rest / Very light', color: '#3498DB', desc: 'Below 50% — minimal demand on the heart. Good for warm-up and cool-down.' }
  if (pct < 0.7) return { label: 'Moderate', color: '#2ECC71', desc: '50–70% of max HR — the "conversation zone": you can talk but feel your heart working. Builds aerobic base.' }
  if (pct < 0.85) return { label: 'Vigorous', color: '#E67E22', desc: '70–85% of max HR — harder effort, shorter sentences. Builds cardiovascular fitness more efficiently.' }
  return { label: 'Near maximum', color: '#E74C3C', desc: 'Above 85% — very intense, only sustainable for short bursts. Not appropriate for general exercise sessions.' }
}

export function TargetHeartRate() {
  const [age, setAge] = useState(30)
  const [intensityPct, setIntensityPct] = useState(0.65)

  const mhr = maxHeartRate(age)
  const [modLo, modHi] = hrZone(age, 0.5, 0.7)
  const [vigLo, vigHi] = hrZone(age, 0.7, 0.85)
  const currentBpm = Math.round(mhr * intensityPct)
  const zone = getZoneInfo(intensityPct)

  // Bar chart geometry
  const barMax = mhr
  const modWidth = clamp(((modHi - modLo) / barMax) * 100, 0, 100)
  const modLeft = clamp((modLo / barMax) * 100, 0, 100)
  const vigWidth = clamp(((vigHi - vigLo) / barMax) * 100, 0, 100)
  const vigLeft = clamp((vigLo / barMax) * 100, 0, 100)
  const markerLeft = clamp((currentBpm / barMax) * 100, 0, 100)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Age slider */}
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs text-muted">
          <span>Your age</span>
          <span className="font-mono font-semibold text-ink">{age} years</span>
        </div>
        <input
          type="range"
          className="accent-accent w-full"
          min={10}
          max={80}
          step={1}
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />
        <div className="mt-0.5 flex justify-between text-xs text-muted">
          <span>10</span>
          <span>80</span>
        </div>
      </div>

      {/* Max HR display */}
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-4 py-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-ink">{mhr}</div>
          <div className="text-xs text-muted">Max HR (bpm)</div>
        </div>
        <div className="text-xs text-muted leading-snug">
          Estimated using <span className="font-semibold text-ink">220 − age</span>:{' '}
          220 − {age} = <span className="font-semibold text-ink">{mhr} bpm</span>.
          Actual max varies by individual — this is a population-level estimate.
        </div>
      </div>

      {/* Zone bands */}
      <div className="mb-2 text-xs font-semibold text-muted uppercase tracking-wide">Target zones</div>
      <div className="mb-1 flex gap-2 text-xs">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-4 rounded-sm" style={{ backgroundColor: '#2ECC71' }} />
          Moderate: {modLo}–{modHi} bpm
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-4 rounded-sm" style={{ backgroundColor: '#E67E22' }} />
          Vigorous: {vigLo}–{vigHi} bpm
        </span>
      </div>

      {/* Visual bar */}
      <div className="relative mb-5 h-7 w-full rounded-lg bg-surface-2 border border-border overflow-hidden">
        {/* Moderate zone */}
        <div
          className="absolute top-0 h-full rounded-sm opacity-50"
          style={{
            left: `${modLeft}%`,
            width: `${modWidth}%`,
            backgroundColor: '#2ECC71',
          }}
        />
        {/* Vigorous zone */}
        <div
          className="absolute top-0 h-full rounded-sm opacity-50"
          style={{
            left: `${vigLeft}%`,
            width: `${vigWidth}%`,
            backgroundColor: '#E67E22',
          }}
        />
        {/* Marker */}
        <div
          className="absolute top-0.5 h-6 w-1 rounded-full transition-all duration-150"
          style={{ left: `calc(${markerLeft}% - 2px)`, backgroundColor: zone.color }}
        />
      </div>

      {/* Intensity slider */}
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs text-muted">
          <span>Current effort (% of max HR)</span>
          <span className="font-mono font-semibold text-ink">{Math.round(intensityPct * 100)}% — {currentBpm} bpm</span>
        </div>
        <input
          type="range"
          className="accent-accent w-full"
          min={0}
          max={100}
          step={1}
          value={Math.round(intensityPct * 100)}
          onChange={(e) => setIntensityPct(Number(e.target.value) / 100)}
        />
        <div className="mt-0.5 flex justify-between text-xs text-muted">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Zone label */}
      <div
        className="rounded-xl border p-3 text-sm transition-colors"
        style={{ borderColor: zone.color + '66', backgroundColor: zone.color + '11' }}
      >
        <p className="font-semibold" style={{ color: zone.color }}>{zone.label}</p>
        <p className="mt-1 text-xs text-muted">{zone.desc}</p>
      </div>
    </div>
  )
}
