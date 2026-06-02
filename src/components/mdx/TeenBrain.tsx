import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/psych'

// The maturation-gap model of adolescent risk-taking. The limbic / reward
// system matures EARLY (peaking in the teens), while the prefrontal cortex —
// the brakes, planning and impulse control — keeps maturing into the mid-20s.
// The GAP between an eager accelerator and weak brakes is widest in adolescence,
// which helps explain teen risk-taking. Slide age to watch the curves and gap.
const W = 360
const H = 200
const PAD = 34
const AGE_MIN = 8
const AGE_MAX = 30

// Reward system: rises fast, peaks ~15, stays high. (0..1)
function reward(age: number): number {
  return clamp(1 / (1 + Math.exp(-(age - 12) / 1.6)) - 0.06 * Math.max(0, age - 16), 0, 1)
}
// Prefrontal control: slow, steady climb maturing ~25. (0..1)
function control(age: number): number {
  return clamp((age - AGE_MIN) / (25 - AGE_MIN), 0, 1)
}

const xOf = (age: number) => PAD + ((age - AGE_MIN) / (AGE_MAX - AGE_MIN)) * (W - 2 * PAD)
const yOf = (v: number) => H - PAD - v * (H - 2 * PAD)

function curve(fn: (a: number) => number): string {
  const N = 80
  return Array.from({ length: N + 1 }, (_, i) => {
    const age = AGE_MIN + ((AGE_MAX - AGE_MIN) * i) / N
    return `${i ? 'L' : 'M'}${xOf(age).toFixed(1)} ${yOf(fn(age)).toFixed(1)}`
  }).join(' ')
}

const REWARD_CURVE = curve(reward)
const CONTROL_CURVE = curve(control)

export function TeenBrain() {
  const [age, setAge] = useState(15)
  const r = reward(age)
  const c = control(age)
  const gap = r - c

  const msg =
    gap > 0.35
      ? 'Wide gap: a fully-revved reward system with brakes still under construction — peak risk-taking.'
      : gap > 0.12
        ? 'Closing gap: control is catching up, but the pull toward reward still often wins.'
        : 'Balanced: the prefrontal "brakes" have matured enough to match the reward drive.'

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1={PAD} y1={H - PAD} x2={PAD} y2={PAD} stroke="var(--color-border)" strokeWidth="1.5" />
        <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--color-muted)">
          Age →
        </text>
        <text x={12} y={H / 2} textAnchor="middle" fontSize="10" fill="var(--color-muted)" transform={`rotate(-90 12 ${H / 2})`}>
          Maturity →
        </text>

        {/* the gap shading at the current age */}
        <line x1={xOf(age)} y1={yOf(r)} x2={xOf(age)} y2={yOf(c)} stroke="var(--color-accent)" strokeWidth="6" opacity="0.25" strokeLinecap="round" />

        <path d={REWARD_CURVE} fill="none" stroke="#E74C3C" strokeWidth="2.5" />
        <path d={CONTROL_CURVE} fill="none" stroke="#3498DB" strokeWidth="2.5" />

        <circle cx={xOf(age)} cy={yOf(r)} r="5" fill="#E74C3C" />
        <circle cx={xOf(age)} cy={yOf(c)} r="5" fill="#3498DB" />

        <text x={W - PAD} y={yOf(reward(AGE_MAX)) - 6} textAnchor="end" fontSize="9" fill="#E74C3C">
          reward / limbic
        </text>
        <text x={W - PAD} y={yOf(control(AGE_MAX)) + 14} textAnchor="end" fontSize="9" fill="#3498DB">
          control / prefrontal
        </text>
      </svg>

      <div className="px-1 pt-1">
        <SceneSlider label="Age" value={age} min={AGE_MIN} max={AGE_MAX} step={1} unit="yrs" onChange={(v) => setAge(Math.round(v))} />
        <p className="mt-2 text-center text-sm font-medium text-ink">{msg}</p>
        <p className="mt-1 text-center text-xs text-muted">
          Accelerator–brake gap: <span className="font-mono text-accent">{(gap * 100).toFixed(0)}%</span>
        </p>
      </div>
    </div>
  )
}
