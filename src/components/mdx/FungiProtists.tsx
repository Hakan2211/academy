import { useState } from 'react'
import { cn } from '#/lib/cn'

// The "other" microbes beyond bacteria and viruses: fungi and protists. Toggle
// to compare what they are and the roles they play.
type Group = 'fungi' | 'protists'

const INFO: Record<Group, { emoji: string; label: string; what: string; examples: string; role: string }> = {
  fungi: {
    emoji: '🍄',
    label: 'Fungi',
    what: 'Eukaryotes with cell walls (of chitin, not cellulose) that feed by absorbing nutrients from their surroundings. Range from single-celled yeasts to vast underground networks.',
    examples: 'mushrooms, moulds, yeasts',
    role: 'Mostly decomposers — they recycle dead material, returning nutrients to the soil. Some cause disease (athlete’s foot); others give us bread, beer, and penicillin.',
  },
  protists: {
    emoji: '🦠',
    label: 'Protists',
    what: 'A catch-all kingdom of mostly single-celled eukaryotes that don’t fit the plant, animal, or fungus groups. Some photosynthesise, some hunt, some do both.',
    examples: 'amoebas, algae, plankton, Plasmodium (malaria)',
    role: 'Algae and plankton produce much of Earth’s oxygen and feed ocean food chains. A few are deadly parasites — Plasmodium causes malaria.',
  },
}

export function FungiProtists() {
  const [g, setG] = useState<Group>('fungi')
  const d = INFO[g]
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex gap-2">
        {(['fungi', 'protists'] as Array<Group>).map((x) => (
          <button key={x} type="button" onClick={() => setG(x)} className={cn('rounded-full border px-3 py-1 text-sm capitalize transition-colors', g === x ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}>
            {INFO[x].emoji} {INFO[x].label}
          </button>
        ))}
      </div>
      <div className="flex items-start gap-3">
        <div className="text-5xl">{d.emoji}</div>
        <div className="flex-1 text-sm">
          <p className="text-muted"><span className="font-semibold text-ink">{d.label}: </span>{d.what}</p>
          <p className="mt-2 text-muted"><span className="font-semibold text-ink">Examples: </span>{d.examples}</p>
          <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-muted"><span className="font-semibold text-accent-2">Role: </span>{d.role}</p>
        </div>
      </div>
    </div>
  )
}
