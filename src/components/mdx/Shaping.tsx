import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { rng } from '#/lib/psych'

// Shaping by successive approximation. We want the rat to press a lever at the
// far right of its cage, but it never goes there on its own. So we reinforce
// whatever is CLOSEST to the goal right now — first just facing right, then a
// step right, then a paw on the lever — raising the bar each time. Each round
// the learner offers a spread of attempts; you reinforce the best one, and the
// whole behaviour distribution shifts toward the target.
//
// The learner's "ability" position creeps right each time you reinforce. Attempt
// scatter is deterministic per round (seeded RNG) so SSR and client match.

const TRACK_X0 = 30
const TRACK_X1 = 420
const TRACK_Y = 70
const GOAL = 1 // target position = far right (1.0)

const MILESTONES = [
  'turns toward the lever',
  'takes a step toward it',
  'approaches the lever',
  'rears up beside it',
  'touches the lever',
  'presses the lever!',
]

const posX = (p: number) => TRACK_X0 + p * (TRACK_X1 - TRACK_X0)

export function Shaping() {
  const [center, setCenter] = useState(0.08) // current behaviour center, 0..1
  const [round, setRound] = useState(0)
  const [reinforced, setReinforced] = useState<number | null>(null)
  const [msg, setMsg] = useState('Three attempts are scattered around the rat\'s current behaviour. Reinforce the one closest to the goal to raise the bar.')

  // three deterministic attempts spread around the current center
  const next = rng(round * 1000 + 17)
  const attempts = [0, 1, 2].map((i) => {
    const spread = (next() - 0.5) * 0.26
    return Math.max(0, Math.min(1, center + spread + (i - 1) * 0.05))
  })
  const bestIdx = attempts.indexOf(Math.max(...attempts))

  const milestone = MILESTONES[Math.min(MILESTONES.length - 1, Math.floor(center * (MILESTONES.length - 1) + 0.001))]
  const done = center >= 0.97

  const reinforce = (i: number) => {
    if (done) return
    setReinforced(i)
    const chosen = attempts[i]
    if (i === bestIdx && chosen > center) {
      // reinforcing the closest approximation drags the behaviour toward it
      const moved = center + (chosen - center) * 0.9
      setCenter(Math.min(1, moved + 0.02))
      setMsg('Good call — you reinforced the closest approximation. The rat\'s behaviour shifts toward the goal. Raise the bar again.')
    } else if (chosen <= center) {
      setMsg('That attempt was no closer than before. Reinforcing it just holds the rat where it is — pick the one nearest the lever.')
    } else {
      setMsg('That wasn\'t the closest attempt. Shaping is fastest when you reinforce the best approximation each round.')
    }
    setRound((r) => r + 1)
    window.setTimeout(() => setReinforced(null), 600)
  }

  const reset = () => {
    setCenter(0.08)
    setRound(0)
    setReinforced(null)
    setMsg('Reset. Reinforce the attempt closest to the goal to begin shaping.')
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 450 120" className="w-full">
        {/* cage floor */}
        <line x1={TRACK_X0} y1={TRACK_Y + 20} x2={TRACK_X1} y2={TRACK_Y + 20} stroke="var(--color-border)" strokeWidth="2" />

        {/* goal lever at far right */}
        <g transform={`translate(${posX(GOAL)} ${TRACK_Y})`}>
          <rect x="-2" y="-4" width="22" height="8" rx="3" fill="var(--color-success)" />
          <text x="2" y="-12" fill="var(--color-success)" fontSize="9" textAnchor="middle" fontWeight="600">goal</text>
        </g>

        {/* current behaviour center marker */}
        <line x1={posX(center)} y1={TRACK_Y - 18} x2={posX(center)} y2={TRACK_Y + 22} stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />

        {/* three attempts */}
        {attempts.map((a, i) => (
          <g key={`${round}-${i}`} transform={`translate(${posX(a)} ${TRACK_Y})`}>
            <circle
              r={reinforced === i ? 13 : 9}
              fill={reinforced === i ? 'var(--color-success)' : i === bestIdx ? 'var(--color-accent)' : 'var(--color-surface-2)'}
              stroke="var(--color-border)"
              strokeWidth="1.5"
              opacity={reinforced !== null && reinforced !== i ? 0.4 : 1}
            />
            <circle cx="3" cy="-2" r="1.4" fill="var(--color-ink)" />
          </g>
        ))}

        {/* progress bar */}
        <rect x={TRACK_X0} y={TRACK_Y + 36} width={TRACK_X1 - TRACK_X0} height="6" rx="3" fill="var(--color-surface-2)" />
        <rect x={TRACK_X0} y={TRACK_Y + 36} width={(TRACK_X1 - TRACK_X0) * center} height="6" rx="3" fill="var(--color-accent)" />
      </svg>

      <p className="px-4 text-center text-sm">
        <span className="text-muted">The rat currently </span>
        <span className="font-semibold text-ink">{milestone}</span>
        <span className="text-muted"> · {Math.round(center * 100)}% to goal</span>
      </p>

      {/* reinforce buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 px-4 pt-3">
        {attempts.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => reinforce(i)}
            disabled={done}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-ink hover:bg-surface-2 disabled:opacity-40"
          >
            <Icon name="Cookie" size={14} /> Reinforce attempt {i + 1}
          </button>
        ))}
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-border px-3 py-1.5 text-sm text-muted hover:text-ink"
        >
          Reset
        </button>
      </div>

      <p className="px-4 pb-4 pt-3 text-sm leading-snug text-muted">
        {done ? 'The rat now presses the lever reliably — a behaviour it would essentially never have performed by chance, built up step by tiny step. That is shaping.' : msg}
      </p>
    </div>
  )
}
