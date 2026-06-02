import { useMemo, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/psych'

// A 24-hour body clock. Three internal rhythms ride around the dial: core body
// TEMPERATURE (lowest ~4am, peaks early evening), MELATONIN (the "darkness
// hormone", rising at night), and ALERTNESS (tracking temperature). A shift
// slider models jet lag / night-shift work: your external schedule jumps, but
// the internal clock lags behind, so the curves fall out of step with the new
// "day" — that mismatch is what jet lag feels like.
const W = 360
const H = 300
const CX = W / 2
const CY = 150
const R_OUTER = 118
const R_INNER = 54

// Hour (0-24) -> angle, with midnight at the top, going clockwise like a clock.
function hourAngle(hour: number): number {
  return (hour / 24) * Math.PI * 2 - Math.PI / 2
}

function polar(hour: number, radius: number): { x: number; y: number } {
  const a = hourAngle(hour)
  return { x: CX + Math.cos(a) * radius, y: CY + Math.sin(a) * radius }
}

// Curve value in [0,1] for each rhythm at a given internal-clock hour.
function tempAt(h: number): number {
  // Trough ~4am, peak ~5pm. Cosine shifted so min is at hour 4.
  return 0.5 - 0.5 * Math.cos(((h - 4) / 24) * Math.PI * 2)
}
function melatoninAt(h: number): number {
  // High through the night (~9pm-7am), low in the day.
  return clamp(0.5 + 0.5 * Math.cos(((h - 3) / 24) * Math.PI * 2), 0, 1)
}
function alertnessAt(h: number): number {
  // Tracks temperature but a touch sharper; with an afternoon-dip flavour.
  const base = 0.5 - 0.5 * Math.cos(((h - 4.5) / 24) * Math.PI * 2)
  return clamp(base, 0, 1)
}

const RHYTHMS = [
  { key: 'temp', label: 'Body temperature', color: '#FF7675', fn: tempAt },
  { key: 'melatonin', label: 'Melatonin', color: '#6C5CE7', fn: melatoninAt },
  { key: 'alert', label: 'Alertness', color: '#00D2D3', fn: alertnessAt },
] as const

// Build a ring path for a rhythm. The radius oscillates between R_INNER and
// R_OUTER by the curve value, sampled around all 24 hours. `shift` rotates the
// internal clock relative to the dial (positive = clock lags the new schedule).
function ringPath(fn: (h: number) => number, shift: number): string {
  const steps = 96
  let d = ''
  for (let s = 0; s <= steps; s++) {
    const clockHour = (s / steps) * 24
    const v = fn(((clockHour - shift) % 24 + 24) % 24)
    const r = R_INNER + v * (R_OUTER - R_INNER)
    const p = polar(clockHour, r)
    d += `${s === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)} `
  }
  return d + 'Z'
}

export function CircadianClock() {
  const [shift, setShift] = useState(0)

  const paths = useMemo(
    () => RHYTHMS.map((r) => ({ ...r, d: ringPath(r.fn, shift) })),
    [shift],
  )

  const lagged = Math.abs(shift) > 0.4

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Day/night backdrop ring: dark arc over the night, light over the day. */}
        <circle cx={CX} cy={CY} r={R_OUTER + 6} fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
        {/* Hour ticks + key labels */}
        {Array.from({ length: 24 }).map((_, h) => {
          const a = polar(h, R_OUTER + 6)
          const b = polar(h, R_OUTER + (h % 6 === 0 ? -2 : 1))
          return (
            <line
              key={h}
              x1={a.x.toFixed(1)}
              y1={a.y.toFixed(1)}
              x2={b.x.toFixed(1)}
              y2={b.y.toFixed(1)}
              stroke="var(--color-border)"
              strokeWidth={h % 6 === 0 ? 2 : 1}
            />
          )
        })}
        {[
          { h: 0, t: '12am' },
          { h: 6, t: '6am' },
          { h: 12, t: '12pm' },
          { h: 18, t: '6pm' },
        ].map(({ h, t }) => {
          const p = polar(h, R_OUTER + 20)
          return (
            <text key={t} x={p.x.toFixed(1)} y={(p.y + 3).toFixed(1)} textAnchor="middle" fontSize="10" fill="var(--color-muted)">
              {t}
            </text>
          )
        })}

        {/* The three rhythm rings */}
        {paths.map((p) => (
          <path key={p.key} d={p.d} fill="none" stroke={p.color} strokeWidth={2.5} opacity={0.9} />
        ))}

        {/* "Now" marker at 8am on the external schedule. */}
        {(() => {
          const p = polar(8, R_OUTER + 6)
          return (
            <g>
              <line x1={CX} y1={CY} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke="var(--color-ink)" strokeWidth={2} strokeDasharray="3 3" />
              <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={4} fill="var(--color-ink)" />
            </g>
          )
        })()}
        <text x={CX} y={CY - 4} textAnchor="middle" fontSize="11" fill="var(--color-muted)">
          your day
        </text>
        <text x={CX} y={CY + 12} textAnchor="middle" fontSize="11" fill="var(--color-ink)" fontWeight="bold">
          ↑ 8am
        </text>
      </svg>

      <div className="mt-1 flex flex-wrap justify-center gap-3 text-xs">
        {RHYTHMS.map((r) => (
          <span key={r.key} className="flex items-center gap-1.5 text-muted">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
            {r.label}
          </span>
        ))}
      </div>

      <div className="mt-3">
        <SceneSlider
          label="Schedule shift (jet lag / night shift)"
          value={shift}
          min={-12}
          max={12}
          step={1}
          unit="h"
          onChange={setShift}
        />
      </div>

      <p className="mt-2 text-sm leading-relaxed text-muted">
        {lagged ? (
          <>
            Your <span className="font-medium text-ink">external clock</span> jumped {Math.abs(Math.round(shift))} hours, but your{' '}
            <span className="font-medium text-ink">internal clock lags behind</span> — so at 8am your body still expects melatonin
            high and temperature low. That mismatch <em>is</em> jet lag; it takes about a day per time zone to re-sync.
          </>
        ) : (
          <>
            Aligned. At 8am melatonin is fading, body temperature is climbing, and alertness is rising — your internal clock and
            your schedule agree. Slide to simulate flying across time zones or working nights.
          </>
        )}
      </p>
    </div>
  )
}
