import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/psych'

// Csikszentmihalyi's flow model. Plot challenge (y) against skill (x). When the
// two roughly match and both are high, you enter the diagonal FLOW CHANNEL. Too
// much challenge for your skill = anxiety; too much skill for the challenge =
// boredom. Drag both sliders and the dot finds its state. The flagship World 17
// interactive.
const W = 320
const H = 320
const PAD = 40
const PLOT = W - 2 * PAD // square plot region

// map a 0..10 value to svg x; skill grows rightward
const xOf = (skill: number) => PAD + (skill / 10) * PLOT
// challenge grows upward, so invert
const yOf = (chal: number) => PAD + (1 - chal / 10) * PLOT

type State = {
  label: string
  detail: string
  color: string
}

// Classify the (challenge, skill) point into a flow-model state.
function classify(challenge: number, skill: number): State {
  const diff = challenge - skill // + means over-challenged
  const both = (challenge + skill) / 2 // overall intensity
  if (both < 3) {
    return {
      label: 'Apathy',
      detail: 'Low challenge and low skill — nothing is at stake, so nothing engages you. The deadest zone of all.',
      color: 'var(--color-muted)',
    }
  }
  if (diff > 2.2) {
    return {
      label: 'Anxiety',
      detail: 'The challenge far outruns your skill. You feel overwhelmed and threatened — either build skill or shrink the challenge.',
      color: '#E74C3C',
    }
  }
  if (diff < -2.2) {
    return {
      label: 'Boredom',
      detail: 'Your skill far outruns the challenge. It is too easy to hold your attention — raise the difficulty to re-engage.',
      color: '#3498DB',
    }
  }
  return {
    label: 'Flow',
    detail: 'Challenge and skill are matched and both are high. You are fully absorbed, time disappears, and the task feels effortless yet stretching.',
    color: 'var(--color-success)',
  }
}

export function FlowChannel() {
  const [challenge, setChallenge] = useState(7)
  const [skill, setSkill] = useState(6.5)
  const state = classify(challenge, skill)

  const cx = xOf(clamp(skill, 0, 10))
  const cy = yOf(clamp(challenge, 0, 10))

  // The flow channel is a diagonal band where challenge ≈ skill (and both high).
  // Draw it as a polygon stripe around the y = x diagonal.
  const band = 2.2
  const channel = [
    `${xOf(0)},${yOf(Math.min(10, 0 + band))}`,
    `${xOf(10 - band)},${yOf(10)}`,
    `${xOf(10)},${yOf(10)}`,
    `${xOf(10)},${yOf(Math.max(0, 10 - band))}`,
    `${xOf(band)},${yOf(0)}`,
    `${xOf(0)},${yOf(0)}`,
  ].join(' ')

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block w-full max-w-[340px]">
        {/* anxiety zone tint (top-left) and boredom tint (bottom-right) */}
        <rect x={PAD} y={PAD} width={PLOT} height={PLOT} fill="var(--color-surface-2)" />
        {/* flow channel stripe */}
        <polygon points={channel} fill="var(--color-success)" opacity="0.16" />
        {/* zone labels */}
        <text x={PAD + 8} y={PAD + 18} fontSize="11" fontWeight="bold" fill="#E74C3C" opacity="0.8">
          Anxiety
        </text>
        <text x={W - PAD - 8} y={H - PAD - 8} textAnchor="end" fontSize="11" fontWeight="bold" fill="#3498DB" opacity="0.8">
          Boredom
        </text>
        <text
          x={(PAD + (W - PAD)) / 2}
          y={(PAD + (H - PAD)) / 2}
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill="var(--color-success)"
          transform={`rotate(-45 ${(PAD + (W - PAD)) / 2} ${(PAD + (H - PAD)) / 2})`}
        >
          FLOW
        </text>

        {/* axes */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="var(--color-border)" strokeWidth="1.5" />
        <text x={(PAD + (W - PAD)) / 2} y={H - 10} textAnchor="middle" fontSize="11" fill="var(--color-muted)">
          Skill →
        </text>
        <text x={16} y={(PAD + (H - PAD)) / 2} textAnchor="middle" fontSize="11" fill="var(--color-muted)" transform={`rotate(-90 16 ${(PAD + (H - PAD)) / 2})`}>
          Challenge →
        </text>

        {/* the you-are-here dot */}
        <line x1={cx} y1={H - PAD} x2={cx} y2={cy} stroke={state.color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
        <line x1={PAD} y1={cy} x2={cx} y2={cy} stroke={state.color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
        <circle cx={cx} cy={cy} r="8" fill={state.color} stroke="var(--color-surface)" strokeWidth="2" />
      </svg>

      <div className="space-y-2 px-1 pt-1">
        <SceneSlider label="Challenge" value={challenge} min={0} max={10} step={0.1} unit="" onChange={setChallenge} />
        <SceneSlider label="Skill" value={skill} min={0} max={10} step={0.1} unit="" onChange={setSkill} />
      </div>

      <div className="mt-2 rounded-xl bg-surface-2 p-3">
        <p className="text-base font-semibold" style={{ color: state.color }}>
          {state.label}
        </p>
        <p className="mt-1 text-sm leading-snug text-muted">{state.detail}</p>
      </div>
    </div>
  )
}
