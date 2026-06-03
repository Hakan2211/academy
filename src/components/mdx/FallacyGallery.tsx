import { useState } from 'react'
import { cn } from '#/lib/cn'

// A browsable gallery of 8 common fallacies. Clicking a chip reveals
// its name, plain-language definition, and a vivid concrete example.

type Fallacy = {
  id: string
  name: string
  short: string
  definition: string
  example: string
}

const FALLACIES: Array<Fallacy> = [
  {
    id: 'ad-hominem',
    name: 'Ad Hominem',
    short: 'Attack the person',
    definition:
      'Attacking the character, circumstances, or motives of the person making an argument instead of addressing the argument itself.',
    example:
      '"You can\'t trust her climate research — she drives a diesel car." Whether or not she drives a diesel is irrelevant to whether her data and methodology are sound.',
  },
  {
    id: 'straw-man',
    name: 'Straw Man',
    short: 'Misrepresent the view',
    definition:
      'Replacing someone\'s actual position with a weaker, easier-to-attack version — then defeating that invented version instead.',
    example:
      '"She wants stricter gun regulations." "So you want to ban all guns and leave citizens defenceless? That\'s absurd!" The exaggerated version was never the claim.',
  },
  {
    id: 'false-dilemma',
    name: 'False Dilemma',
    short: 'Only two options',
    definition:
      'Presenting a choice as if only two options exist when in reality there are more — forcing an unnecessary either/or.',
    example:
      '"You\'re either with us or against us." In practice, neutral parties, partial agreement, and conditional support are all real possibilities the dilemma rules out.',
  },
  {
    id: 'slippery-slope',
    name: 'Slippery Slope',
    short: 'Chain of doom',
    definition:
      'Claiming that one step will inevitably lead to extreme consequences through a chain of events, without showing why each link must follow.',
    example:
      '"If we allow same-day voting, voter fraud will explode, elections will be stolen, and democracy will collapse." Each step requires evidence — asserting the chain isn\'t enough.',
  },
  {
    id: 'appeal-to-authority',
    name: 'Appeal to Authority',
    short: 'Expert says so',
    definition:
      'Using someone\'s status or title as a substitute for evidence — especially when the authority is outside their area of expertise or the claim is contested.',
    example:
      '"A Nobel Prize winner in Physics says vaccines cause autism." A physics credential doesn\'t transfer to medical immunology; the evidence, not the title, settles the question.',
  },
  {
    id: 'begging-question',
    name: 'Begging the Question',
    short: 'Circular reasoning',
    definition:
      'Assuming in a premise the very conclusion you\'re trying to prove — the argument only works if you already believe it.',
    example:
      '"The Bible must be true because it says so in the Bible." The conclusion (the Bible is true) is buried inside the premise (what the Bible says is true).',
  },
  {
    id: 'hasty-gen',
    name: 'Hasty Generalisation',
    short: 'Too few examples',
    definition:
      'Drawing a broad general conclusion from a sample that is too small, unrepresentative, or cherry-picked.',
    example:
      '"I met two rude people from that city — everyone there must be unfriendly." Two encounters can\'t establish what a whole city\'s residents are like.',
  },
  {
    id: 'red-herring',
    name: 'Red Herring',
    short: 'Change the subject',
    definition:
      'Introducing an irrelevant point to divert attention away from the actual issue being debated.',
    example:
      '"Why should we worry about government spending when there are people dying of hunger right now?" Hunger is real, but it doesn\'t address whether the spending policy is wise.',
  },
]

export function FallacyGallery() {
  const [selected, setSelected] = useState<string | null>(FALLACIES[0].id)

  const active = FALLACIES.find((f) => f.id === selected) ?? null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Select a fallacy to see its definition and a real-world example.
      </p>

      {/* Chip grid */}
      <div className="flex flex-wrap gap-2">
        {FALLACIES.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setSelected(f.id)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
              selected === f.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Detail card */}
      {active && (
        <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4 text-sm">
          <div className="mb-1 flex items-baseline gap-2">
            <span className="text-base font-bold text-ink">{active.name}</span>
            <span className="text-xs text-muted">{active.short}</span>
          </div>
          <p className="leading-relaxed text-muted">{active.definition}</p>
          <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 p-3 text-xs leading-relaxed text-ink">
            <span className="font-semibold text-accent">Example: </span>
            {active.example}
          </div>
        </div>
      )}
    </div>
  )
}
