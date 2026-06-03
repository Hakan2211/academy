import { useState } from 'react'
import { cn } from '#/lib/cn'

// The Presocratics asked: "What is everything ultimately made of?"
// Five thinkers, each with their arche, their reasoning, and their
// eerie modern resonance. The Heraclitus–Parmenides clash (change vs
// permanence) is foregrounded as philosophy's first great debate.

type Thinker = {
  id: string
  name: string
  dates: string
  arche: string
  symbol: string
  claim: string
  reasoning: string
  modern: string
  side?: 'flux' | 'permanence'
}

const THINKERS: Array<Thinker> = [
  {
    id: 'thales',
    name: 'Thales',
    dates: 'c. 624–546 BCE',
    arche: 'Water',
    symbol: '💧',
    claim: '"All things are water."',
    reasoning:
      'Water is everywhere — in clouds, in animals, in blood, in earth. It takes every form (liquid, vapour, ice). Thales looked for one natural substance that could underlie everything, replacing myth with reason for the first time.',
    modern:
      'Wrong about water, but right about the project. Looking for one fundamental substance (one "arche") is exactly what physicists still do. Thales is considered the first philosopher precisely because he asked a natural question and gave a natural answer.',
  },
  {
    id: 'anaximenes',
    name: 'Anaximenes',
    dates: 'c. 586–526 BCE',
    arche: 'Air',
    symbol: '🌬',
    claim: '"All things are air, thickened or thinned."',
    reasoning:
      'When air condenses it becomes water, then earth; when it rarifies it becomes fire. A single process — compression and rarefaction — explains every substance. Anaximenes improved on Thales by adding a mechanism, not just a substance.',
    modern:
      'The idea of one thing transforming via a continuous physical process maps onto field theory and state-changes in modern physics. The move from "what is it?" to "how does it change?" was a methodological leap.',
  },
  {
    id: 'heraclitus',
    name: 'Heraclitus',
    dates: 'c. 535–475 BCE',
    arche: 'Fire / Flux',
    symbol: '🔥',
    claim: '"Everything flows. You cannot step in the same river twice."',
    reasoning:
      'Reality is not a stable substance but a process of constant, structured change. Fire — always consuming, always transforming — is the best symbol. Opposites are unified: day/night, hot/cold, life/death are aspects of one dynamic whole governed by the Logos (rational principle of change).',
    modern:
      'Physics agrees: even a "solid" rock is atoms in constant motion. Energy, not stuff, is the modern arche. Heraclitus also foreshadowed Hegel\'s dialectic and process philosophy.',
    side: 'flux',
  },
  {
    id: 'parmenides',
    name: 'Parmenides',
    dates: 'c. 515–450 BCE',
    arche: 'Changeless Being',
    symbol: '⬛',
    claim: '"What is, is. What is not, cannot be. Change is impossible."',
    reasoning:
      'To say something changes is to say it "becomes what it was not" — but non-being cannot be thought or spoken of. Therefore change, plurality, and motion are logical illusions. True reality (Being) is one, eternal, and motionless. Our senses deceive us; reason alone reveals the truth.',
    modern:
      'Wild as this sounds, it deeply influenced Plato\'s Forms (eternal, unchanging templates behind the changing world). In physics, the block-universe interpretation of relativity — where all times exist equally — echoes Parmenides: change may be a feature of perspective, not of ultimate reality.',
    side: 'permanence',
  },
  {
    id: 'democritus',
    name: 'Democritus',
    dates: 'c. 460–370 BCE',
    arche: 'Atoms & Void',
    symbol: '⚛',
    claim: '"Nothing exists but atoms and the void."',
    reasoning:
      'Matter cannot be divided forever — eventually you reach the smallest, indivisible unit: the atom (Greek: atomos, "uncuttable"). Atoms differ in shape, size, and arrangement. Everything we see is atoms combining and separating in empty space. Qualities like colour and taste are "by convention"; atoms and void are "in reality."',
    modern:
      'This is the eeriest anticipation in all of ancient philosophy. Democritus had no instruments and no experiments — yet atomic theory, developed in the 19th century, vindicated him almost exactly. Even the language of "atoms" is his.',
  },
]

const CLASH_SUMMARY =
  'The deepest divide in the Presocratic world: Heraclitus said change is fundamental — everything flows. Parmenides said change is a logical impossibility — true being is eternal and still. This clash set the agenda for every philosopher who followed. Plato tried to reconcile them: the sensory world changes (Heraclitus right about appearances), but the Forms are eternal (Parmenides right about true reality).'

export function PresocraticsLab() {
  const [active, setActive] = useState<string>('thales')
  const [clashOpen, setClashOpen] = useState(false)

  const thinker = THINKERS.find((t) => t.id === active)!

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      {/* thinker selector */}
      <div className="flex flex-wrap gap-1.5 border-b border-border bg-surface-2 p-3">
        {THINKERS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={cn(
              'rounded-xl border px-3 py-1.5 text-sm transition-colors',
              active === t.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <span className="mr-1">{t.symbol}</span>
            {t.name}
          </button>
        ))}
      </div>

      {/* thinker detail */}
      <div className="p-4">
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-2 text-2xl">
            {thinker.symbol}
          </div>
          <div>
            <h3 className="font-semibold text-ink">{thinker.name}</h3>
            <p className="text-xs text-muted">{thinker.dates}</p>
            <p className="text-sm font-medium text-accent">Arche: {thinker.arche}</p>
          </div>
        </div>

        {/* claim */}
        <div className="mb-3 rounded-xl border border-accent-2/40 bg-accent-2/8 p-3 text-sm italic text-ink">
          {thinker.claim}
        </div>

        {/* reasoning */}
        <div className="mb-3 rounded-xl border border-border bg-surface-2 p-3 text-sm text-muted">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink">Reasoning</p>
          <p>{thinker.reasoning}</p>
        </div>

        {/* modern resonance */}
        <div className="rounded-xl border border-border bg-surface-2 p-3 text-sm text-muted">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">
            What they got eerily right
          </p>
          <p>{thinker.modern}</p>
        </div>

        {/* clash highlight for Heraclitus or Parmenides */}
        {thinker.side && (
          <div
            className={cn(
              'mt-3 rounded-xl border px-3 py-2 text-xs',
              thinker.side === 'flux'
                ? 'border-orange-400/40 bg-orange-400/10 text-orange-400'
                : 'border-accent-2/40 bg-accent-2/10 text-accent-2',
            )}
          >
            {thinker.side === 'flux'
              ? '🔥 Team Flux — opposes Parmenides on the nature of change'
              : '⬛ Team Permanence — opposes Heraclitus on the nature of change'}
          </div>
        )}
      </div>

      {/* Heraclitus vs Parmenides clash */}
      <div className="border-t border-border">
        <button
          type="button"
          onClick={() => setClashOpen((o) => !o)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-ink hover:bg-surface-2"
        >
          <span>The Great Clash: Change vs Permanence</span>
          <span className="text-accent">{clashOpen ? '▲' : '▼'}</span>
        </button>
        {clashOpen && (
          <div className="grid grid-cols-1 gap-2 px-4 pb-4 sm:grid-cols-2">
            <div className="rounded-xl border border-orange-400/40 bg-orange-400/10 p-3 text-sm">
              <p className="mb-1 font-semibold text-orange-400">🔥 Heraclitus</p>
              <p className="text-muted">Everything flows. Reality is constant, structured change. The river changes every instant — and so does everything else.</p>
            </div>
            <div className="rounded-xl border border-accent-2/40 bg-accent-2/10 p-3 text-sm">
              <p className="mb-1 font-semibold text-accent-2">⬛ Parmenides</p>
              <p className="text-muted">Change is impossible. Being is one, eternal, motionless. Motion and plurality are logical illusions fed by unreliable senses.</p>
            </div>
            <div className="col-span-full rounded-xl border border-border bg-surface-2 p-3 text-sm text-muted">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink">Why it matters</p>
              <p>{CLASH_SUMMARY}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
