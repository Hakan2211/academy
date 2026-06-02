import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The method of loci — the "memory palace". To remember a list in order, walk a
// familiar route and leave a vivid mental image of each item at a fixed spot.
// To recall, take the walk again and collect them. This is the technique memory
// champions use to memorise shuffled decks. Step through the route below: at
// each location, see the absurd image that pins the item there. Why it works:
// it converts a dull list (weak to encode) into spatial + visual + bizarre
// imagery — exactly the cues memory loves.
type Stop = { place: string; item: string; image: string; icon: string }

const ROUTE: Array<Stop> = [
  { place: 'Front door', item: 'milk', icon: 'DoorOpen', image: 'A flood of milk gushes out the moment you open the front door, soaking your shoes.' },
  { place: 'Hallway', item: 'eggs', icon: 'Footprints', image: 'A dozen eggs are laid like landmines down the hallway — you tiptoe to avoid the crunch.' },
  { place: 'Kitchen', item: 'bread', icon: 'CookingPot', image: 'A giant loaf of bread is wedged in the kitchen doorway, blocking your path like a doughy log.' },
  { place: 'Living room', item: 'bananas', icon: 'Sofa', image: 'The sofa has grown a bunch of huge bananas where the cushions should be; they squelch as you sit.' },
  { place: 'Staircase', item: 'coffee', icon: 'Coffee', image: 'A waterfall of hot coffee cascades down the stairs, steaming and smelling of espresso.' },
  { place: 'Bedroom', item: 'honey', icon: 'Bed', image: 'Your bed is drowning in sticky golden honey, and a bear is happily licking the pillow.' },
]

export function Mnemonics() {
  const [i, setI] = useState(0)
  const [revealItems, setRevealItems] = useState(false)
  const stop = ROUTE[i]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      {/* the route as a row of stops */}
      <div className="flex items-center justify-between gap-1">
        {ROUTE.map((s, k) => (
          <div key={s.place} className="flex flex-1 flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => setI(k)}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border transition-colors',
                k === i ? 'border-accent bg-accent/15 text-accent' : k < i ? 'border-accent/40 text-accent/70' : 'border-border text-muted',
              )}
            >
              <Icon name={s.icon} size={18} />
            </button>
            <span className={cn('text-center text-[9px] leading-tight', k === i ? 'text-ink' : 'text-muted')}>{s.place}</span>
          </div>
        ))}
      </div>

      {/* connecting walk line */}
      <svg viewBox="0 0 360 12" className="-mt-1 mb-1 w-full">
        <line x1="20" y1="6" x2="340" y2="6" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="3 4" />
      </svg>

      <div className="rounded-xl bg-surface-2 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-[#0a0f1f]">
            <Icon name={stop.icon} size={16} />
          </span>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Stop {i + 1}: {stop.place}</p>
            <p className="font-mono text-lg font-bold text-accent">{stop.item}</p>
          </div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{stop.image}</p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setI((v) => Math.max(0, v - 1))}
          disabled={i === 0}
          className="rounded-full border border-border px-4 py-1.5 text-sm text-muted enabled:hover:text-ink disabled:opacity-40"
        >
          Back
        </button>
        <span className="text-xs text-muted">{i + 1} of {ROUTE.length}</span>
        <button
          type="button"
          onClick={() => setI((v) => Math.min(ROUTE.length - 1, v + 1))}
          disabled={i === ROUTE.length - 1}
          className="rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm text-accent disabled:opacity-40"
        >
          Walk on
        </button>
      </div>

      {/* the test: recall the whole list */}
      <div className="mt-3 rounded-xl border border-border p-3">
        <button
          type="button"
          onClick={() => setRevealItems((r) => !r)}
          className="flex w-full items-center justify-between text-sm font-medium text-ink"
        >
          <span>Now recall the list by re-walking the route</span>
          <Icon name={revealItems ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-muted" />
        </button>
        {revealItems && (
          <ol className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
            {ROUTE.map((s) => (
              <li key={s.place} className="text-muted">
                <span className="text-muted/60">{s.place}: </span>
                <span className="font-medium text-ink">{s.item}</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        You did not memorise a list — you took a <span className="font-medium text-ink">walk</span>. By hanging each item on a familiar
        place as a vivid, absurd image, you give memory three cues at once: <span className="text-ink">location</span>,{' '}
        <span className="text-ink">imagery</span>, and <span className="text-ink">surprise</span>. Re-walk the route and the items come
        back in order. This is the method of loci that every memory champion relies on.
      </p>
    </div>
  )
}
