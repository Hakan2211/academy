import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The prototype effect. The mind doesn't store a category as a checklist of
// rules; it stores a "best example" — a prototype — and judges membership by
// resemblance. A robin matches the bird prototype almost perfectly, so we say
// "yes, bird" instantly. A penguin or an ostrich is a real bird but a poor
// match, so the yes comes slower and feels effortful. A bat fools the
// resemblance test entirely. Click each creature: the verdict and a simulated
// reaction time reveal that typicality, not logic, drives the snap judgement.
// Used in concepts-and-categories.

type Item = {
  name: string
  icon: string
  isBird: boolean
  typicality: number // 0..1, how well it matches the "bird" prototype
  rt: number // simulated reaction time in ms
  note: string
}

const ITEMS: Array<Item> = [
  { name: 'Robin', icon: 'Bird', isBird: true, typicality: 0.98, rt: 480, note: 'The textbook bird — small, sings, flies, builds a nest. Your prototype almost exactly.' },
  { name: 'Sparrow', icon: 'Bird', isBird: true, typicality: 0.94, rt: 510, note: 'Another central member. Resembles the prototype closely, so the verdict is near-instant.' },
  { name: 'Eagle', icon: 'Bird', isBird: true, typicality: 0.78, rt: 610, note: 'A bird, clearly — but bigger and fiercer than the prototype, so judged a touch slower.' },
  { name: 'Penguin', icon: 'Bird', isBird: true, typicality: 0.4, rt: 850, note: "Truly a bird, yet it can't fly and swims instead. A poor match — notice the hesitation." },
  { name: 'Ostrich', icon: 'Bird', isBird: true, typicality: 0.38, rt: 880, note: 'A flightless, two-metre runner. A genuine bird that the prototype barely recognises.' },
  { name: 'Bat', icon: 'Rat', isBird: false, typicality: 0.55, rt: 920, note: "It flies and has wings — high surface resemblance — so 'bird' tempts you. But it's a mammal." },
]

const MAX_RT = 1000

export function ConceptPrototype() {
  const [picked, setPicked] = useState<number | null>(null)
  const cur = picked === null ? null : ITEMS[picked]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Quick — is each of these a <span className="font-semibold text-ink">bird</span>? Tap one and watch how
        fast your gut answers.
      </p>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {ITEMS.map((it, i) => (
          <button
            key={it.name}
            type="button"
            onClick={() => setPicked(i)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-xl border p-2 transition-colors',
              picked === i
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={it.icon} size={22} />
            <span className="text-xs font-semibold">{it.name}</span>
          </button>
        ))}
      </div>

      {cur && (
        <div className="mt-4 rounded-xl bg-surface-2 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">Is a {cur.name.toLowerCase()} a bird?</span>
            <span
              className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', cur.isBird && 'bg-success/20 text-success')}
              style={!cur.isBird ? { background: '#E67E2222', color: '#E67E22' } : undefined}
            >
              {cur.isBird ? 'YES — it is a bird' : 'NO — it is a mammal'}
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Match to your "bird" prototype</span>
              <span className="font-mono text-ink">{Math.round(cur.typicality * 100)}%</span>
            </div>
            <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-border/50">
              <div
                className="h-full rounded-full"
                style={{ width: `${cur.typicality * 100}%`, background: 'var(--color-accent)' }}
              />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>How long your gut took to decide</span>
              <span className="font-mono text-ink">{cur.rt} ms</span>
            </div>
            <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-border/50">
              <div
                className="h-full rounded-full"
                style={{ width: `${(cur.rt / MAX_RT) * 100}%`, background: 'var(--color-accent-2)' }}
              />
            </div>
          </div>

          <p className="mt-3 text-sm leading-snug text-muted">{cur.note}</p>
        </div>
      )}

      {!cur && (
        <p className="mt-4 text-center text-sm text-muted">Pick a creature above to reveal the verdict and its speed.</p>
      )}

      <div className="mt-3 rounded-xl border border-border bg-surface-2 p-3 text-sm text-muted">
        Logically, a penguin and a robin are equally "bird". But your mind judges by{' '}
        <span className="text-ink">resemblance to a prototype</span>, so typical members win — they're rated
        more "birdy" and judged faster. That gap is the <span className="text-accent">prototype effect</span>.
      </div>
    </div>
  )
}
