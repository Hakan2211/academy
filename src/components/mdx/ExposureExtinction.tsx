import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// Exposure therapy and the extinction of fear. Stay with the feared thing and
// do NOTHING to escape: anxiety rises, peaks, then — because the dreaded
// catastrophe never comes — falls on its own. That fall within a session is
// HABITUATION. Repeat across sessions and two things change: each session's
// PEAK is lower and the fall is FASTER. Drag the "exposures completed" slider
// and watch the family of curves shrink toward calm. This is the engine inside
// flooding and graded exposure alike.
const W = 380
const H = 220
const PAD_L = 34
const PAD_R = 14
const PAD_T = 16
const PAD_B = 30
const PLOT_W = W - PAD_L - PAD_R
const PLOT_H = H - PAD_T - PAD_B
const T_MAX = 30 // minutes in a single exposure session

const xOf = (t: number) => PAD_L + (t / T_MAX) * PLOT_W
const yOf = (a: number) => PAD_T + (1 - a / 100) * PLOT_H

// Anxiety over time within one session for a given exposure number (0-based):
// rises quickly to a peak, then decays. Higher exposure number -> lower peak,
// faster rise to peak (habituates sooner) and faster decay.
function anxietyAt(t: number, exposure: number): number {
  const peak = 92 * Math.pow(0.78, exposure) // peak shrinks each session
  const riseK = 0.9 + exposure * 0.25 // sharper rise
  const decayK = (0.11 + exposure * 0.05) // faster fall
  const rise = 1 - Math.exp(-riseK * t)
  const decay = Math.exp(-decayK * Math.max(0, t - 5))
  return peak * rise * decay
}

function curvePath(exposure: number): string {
  let d = ''
  for (let i = 0; i <= 60; i++) {
    const t = (i / 60) * T_MAX
    const a = anxietyAt(t, exposure)
    d += `${i === 0 ? 'M' : 'L'}${xOf(t).toFixed(1)},${yOf(a).toFixed(1)} `
  }
  return d.trim()
}

export function ExposureExtinction() {
  const [exposures, setExposures] = useState(2) // sessions completed so far (1-based count shown)

  const peakNow = Math.round(92 * Math.pow(0.78, exposures - 1))

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* axes */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke="var(--color-border)" strokeWidth="1.5" />
        {[0, 50, 100].map((a) => (
          <g key={a}>
            <line x1={PAD_L} y1={yOf(a)} x2={W - PAD_R} y2={yOf(a)} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 4" />
            <text x={PAD_L - 5} y={yOf(a) + 3} textAnchor="end" fontSize="9" fill="var(--color-muted)">{a}</text>
          </g>
        ))}
        <text x={12} y={H / 2} textAnchor="middle" fontSize="9" fill="var(--color-muted)" transform={`rotate(-90 12 ${H / 2})`}>
          Anxiety
        </text>
        <text x={(PAD_L + W - PAD_R) / 2} y={H - 6} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
          Time staying with the fear (min) →
        </text>

        {/* faded earlier sessions */}
        {Array.from({ length: Math.max(0, exposures - 1) }).map((_, i) => (
          <path key={i} d={curvePath(i)} fill="none" stroke="var(--color-muted)" strokeWidth="1.5" opacity={0.25} />
        ))}
        {/* current session, highlighted */}
        <path d={curvePath(exposures - 1)} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>

      <div className="px-1">
        <SceneSlider label="Exposures completed" value={exposures} min={1} max={6} step={1} unit="" onChange={(v) => setExposures(Math.round(v))} />
      </div>

      <p className="mt-2 px-1 text-sm leading-relaxed text-muted">
        On exposure <span className="font-semibold text-ink">#{exposures}</span> the fear peaks at only{' '}
        <span className="font-mono font-semibold text-accent">~{peakNow}</span>/100 — and settles faster than before. The dreaded
        catastrophe never arrives, so the brain re-learns that the thing is safe. Each <span className="text-muted">faded curve</span> is
        an earlier session: the peaks march down toward calm as fear <span className="text-ink">extinguishes</span>.
      </p>
    </div>
  )
}
