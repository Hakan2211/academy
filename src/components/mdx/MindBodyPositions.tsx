import { useState } from 'react'
import { cn } from '#/lib/cn'

// A map of the four main positions on the mind-body problem. Pick one and see
// its one-line claim, what it says the mind IS, and a key strength + problem.

type Position = {
  id: string
  label: string
  thinkers: string
  claim: string
  mindIs: string
  strength: string
  problem: string
}

const POSITIONS: Array<Position> = [
  {
    id: 'dualism',
    label: 'Substance Dualism',
    thinkers: 'Descartes',
    claim: 'Mind and body are two fundamentally different substances.',
    mindIs: 'An immaterial, non-physical substance — the soul or thinking thing (res cogitans) — distinct from the physical brain.',
    strength: 'Explains why mental life seems so different from matter: thoughts have no mass or location; feelings don\'t appear on an MRI.',
    problem: 'If mind and body are truly separate substances, how do they interact? How does an immaterial thought move a physical arm? This is the "interaction problem."',
  },
  {
    id: 'physicalism',
    label: 'Physicalism (Identity Theory)',
    thinkers: 'Place, Smart',
    claim: 'Mental states just ARE brain states — mind and brain are identical.',
    mindIs: 'Identical to physical brain processes. Pain is C-fibre firing; believing something is a particular neural pattern. There is no extra mental substance.',
    strength: 'Parsimonious and consistent with neuroscience — every mental change corresponds to a physical change, which we can increasingly measure.',
    problem: 'Seems to leave out the subjective feel of experience. Even if pain = C-fibres firing, that description doesn\'t capture what it\'s LIKE to be in pain.',
  },
  {
    id: 'behaviorism',
    label: 'Behaviorism',
    thinkers: 'Ryle, Watson',
    claim: 'Mental states are nothing but dispositions to behave in certain ways.',
    mindIs: 'Not an inner entity at all, but a cluster of behavioral dispositions. To be in pain is to be disposed to wince, cry out, seek relief, etc.',
    strength: 'Avoids the interaction problem and focuses on what is publicly observable — behavior — rather than hidden inner entities.',
    problem: 'Seems obviously incomplete. A perfect actor can fake the behavior of pain without being in pain. And you can be in pain without showing it. Inner states seem to matter beyond behavior.',
  },
  {
    id: 'functionalism',
    label: 'Functionalism',
    thinkers: 'Putnam, Fodor',
    claim: 'Mental states are defined by their causal role — their function — not their physical substrate.',
    mindIs: 'Whatever plays the right causal role: taking in inputs, producing outputs, interacting with other mental states. The mind is to the brain as software is to hardware.',
    strength: 'Allows for multiple realizability: a mind could in principle be implemented in neurons, silicon, or anything that plays the right functional role.',
    problem: 'The "absent qualia" objection: a system could play all the right causal roles — process pain signals functionally — without any inner experience at all. Is that really a mind?',
  },
]

export function MindBodyPositions() {
  const [selected, setSelected] = useState<string | null>(null)

  const pos = POSITIONS.find((p) => p.id === selected) ?? null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">Select a position to explore its core claim and key tension:</p>

      <div className="grid grid-cols-2 gap-2">
        {POSITIONS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelected(p.id)}
            className={cn(
              'rounded-xl border px-3 py-2 text-left text-sm transition-colors',
              selected === p.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <div className="font-semibold">{p.label}</div>
            <div className="text-xs opacity-75">{p.thinkers}</div>
          </button>
        ))}
      </div>

      {pos && (
        <div className="mt-4 space-y-3 rounded-xl border border-border bg-surface-2 p-4 text-sm">
          <div>
            <span className="font-semibold text-ink">Claim: </span>
            <span className="text-muted">{pos.claim}</span>
          </div>
          <div>
            <span className="font-semibold text-ink">The mind is: </span>
            <span className="text-muted">{pos.mindIs}</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 rounded-lg border border-border bg-surface p-3">
              <div className="mb-1 text-xs font-semibold text-success">Strength</div>
              <div className="text-xs text-muted">{pos.strength}</div>
            </div>
            <div className="flex-1 rounded-lg border border-border bg-surface p-3">
              <div className="mb-1 text-xs font-semibold text-warn">Problem</div>
              <div className="text-xs text-muted">{pos.problem}</div>
            </div>
          </div>
        </div>
      )}

      {!selected && (
        <p className="mt-4 text-center text-xs text-muted">Choose a position above to see its claim, what it says the mind is, and its key tension.</p>
      )}
    </div>
  )
}
