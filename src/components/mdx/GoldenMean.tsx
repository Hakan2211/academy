import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { cn } from '#/lib/cn'

// Aristotle's doctrine of the mean. A trait runs from DEFICIENCY (a vice)
// through the VIRTUE (the mean) to EXCESS (a vice). The user slides to find
// the virtuous middle. Self-contained and reusable across worlds.

type Trait = {
  id: string
  domain: string
  deficiency: string
  virtue: string
  excess: string
  deficiencyNote: string
  excessNote: string
  virtueNote: string
}

const TRAITS: Array<Trait> = [
  {
    id: 'courage',
    domain: 'Facing danger',
    deficiency: 'Cowardice',
    virtue: 'Courage',
    excess: 'Recklessness',
    deficiencyNote: 'Avoids all risk; paralysed by fear even when action is called for.',
    virtueNote: 'Feels and acknowledges fear, yet acts appropriately in the face of it.',
    excessNote: 'Charges in blindly; ignores genuine danger; mistakes foolhardiness for strength.',
  },
  {
    id: 'generosity',
    domain: 'Giving wealth',
    deficiency: 'Stinginess',
    virtue: 'Generosity',
    excess: 'Extravagance',
    deficiencyNote: 'Hoards resources; gives nothing, even when giving is clearly right.',
    virtueNote: 'Gives the right amount, to the right people, at the right time.',
    excessNote: 'Squanders resources indiscriminately; generosity disconnected from judgement.',
  },
  {
    id: 'ambition',
    domain: 'Seeking honour',
    deficiency: 'Apathy',
    virtue: 'Proper ambition',
    excess: 'Vainglory',
    deficiencyNote: 'Wants no recognition even when it is deserved; lack of self-respect.',
    virtueNote: 'Desires appropriate honour in proportion to genuine achievement.',
    excessNote: 'Craves fame beyond what one deserves; status-obsessed and vain.',
  },
  {
    id: 'temperance',
    domain: 'Bodily pleasures',
    deficiency: 'Insensibility',
    virtue: 'Temperance',
    excess: 'Self-indulgence',
    deficiencyNote: 'Unnaturally indifferent to all pleasure; this is rare and odd in humans.',
    virtueNote: 'Enjoys appropriate pleasures moderately, without being mastered by appetite.',
    excessNote: 'Pursues bodily pleasure compulsively; ruled by appetite rather than reason.',
  },
  {
    id: 'pride',
    domain: 'Self-assessment',
    deficiency: 'Pusillanimity',
    virtue: 'Greatness of soul',
    excess: 'Vanity',
    deficiencyNote: 'Undervalues oneself; fails to claim what is rightfully one\'s due.',
    virtueNote: 'Has an accurate, high regard for oneself matched to actual worth.',
    excessNote: 'Claims more than one is actually worth; arrogant and deluded.',
  },
]

/** Map slider value (0–100) to a zone label and position description. */
function getZone(val: number): 'deficiency' | 'virtue' | 'excess' {
  if (val < 35) return 'deficiency'
  if (val > 65) return 'excess'
  return 'virtue'
}

function zoneColor(zone: 'deficiency' | 'virtue' | 'excess'): string {
  if (zone === 'virtue') return 'text-success'
  if (zone === 'deficiency') return 'text-warn'
  return '#f97316' // orange for excess
}

function zoneBg(zone: 'deficiency' | 'virtue' | 'excess'): string {
  if (zone === 'virtue') return 'border-success/40 bg-success/10'
  if (zone === 'deficiency') return 'border-warn/40 bg-warn/10'
  return 'border-orange-400/40 bg-orange-400/10'
}

export function GoldenMean() {
  const [traitId, setTraitId] = useState<string>('courage')
  const [sliderVal, setSliderVal] = useState<number>(50)

  function chooseTrait(id: string) {
    setTraitId(id)
    setSliderVal(50)
  }

  const trait = TRAITS.find((t) => t.id === traitId)!
  const zone = getZone(sliderVal)

  const label =
    zone === 'deficiency' ? trait.deficiency : zone === 'excess' ? trait.excess : trait.virtue
  const note =
    zone === 'deficiency'
      ? trait.deficiencyNote
      : zone === 'excess'
        ? trait.excessNote
        : trait.virtueNote
  const color = zoneColor(zone)
  const bg = zoneBg(zone)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Trait selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {TRAITS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => chooseTrait(t.id)}
            className={cn(
              'rounded-lg border px-3 py-1 text-sm transition-colors',
              traitId === t.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {t.virtue}
          </button>
        ))}
      </div>

      <p className="mb-3 text-xs text-muted">Domain: {trait.domain}</p>

      {/* The spectrum diagram */}
      <div className="mb-4 grid grid-cols-3 gap-1 text-center text-xs">
        <div className="rounded-lg border border-warn/40 bg-warn/10 px-2 py-2">
          <div className="font-semibold text-warn">DEFICIENCY</div>
          <div className="mt-0.5 text-muted">{trait.deficiency}</div>
        </div>
        <div className="rounded-lg border border-success/40 bg-success/10 px-2 py-2">
          <div className="font-semibold text-success">VIRTUE (the mean)</div>
          <div className="mt-0.5 text-muted">{trait.virtue}</div>
        </div>
        <div className="rounded-lg border border-orange-400/40 bg-orange-400/10 px-2 py-2">
          <div className="font-semibold text-orange-400">EXCESS</div>
          <div className="mt-0.5 text-muted">{trait.excess}</div>
        </div>
      </div>

      {/* Slider */}
      <div className="mb-4">
        <SceneSlider
          label="Where does this person fall?"
          value={sliderVal}
          min={0}
          max={100}
          step={1}
          unit="%"
          onChange={setSliderVal}
        />
        {/* Track overlay: colour gradient left→right */}
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: '100%',
              background: 'linear-gradient(to right, #f59e0b, #22c55e, #f97316)',
            }}
          />
        </div>
      </div>

      {/* Current verdict */}
      <div className={cn('rounded-xl border p-3 text-sm', bg)}>
        <div className="mb-1 font-semibold" style={{ color }}>
          {label}
        </div>
        <p className="text-muted">{note}</p>
        {zone === 'virtue' && (
          <p className="mt-2 text-xs text-muted">
            Aristotle's goal: <em>eudaimonia</em> — a flourishing life built by habitually choosing
            the virtuous mean across all domains of action.
          </p>
        )}
      </div>
    </div>
  )
}
