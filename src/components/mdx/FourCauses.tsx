import { useState } from 'react'
import { cn } from '#/lib/cn'

// Aristotle's four causes: every "why?" about a thing can be answered in four ways.
// The user picks an object and sees each cause explained for that object.

type Cause = {
  id: 'material' | 'formal' | 'efficient' | 'final'
  greek: string
  name: string
  question: string
  color: string
  borderColor: string
  bgColor: string
}

const CAUSES: Array<Cause> = [
  {
    id: 'material',
    greek: 'hyle',
    name: 'Material Cause',
    question: 'What is it made of?',
    color: 'text-amber-500',
    borderColor: 'border-amber-400/50',
    bgColor: 'bg-amber-400/10',
  },
  {
    id: 'formal',
    greek: 'morphe',
    name: 'Formal Cause',
    question: 'What is its form / design?',
    color: 'text-accent',
    borderColor: 'border-accent/50',
    bgColor: 'bg-accent/10',
  },
  {
    id: 'efficient',
    greek: 'arche tes kineseos',
    name: 'Efficient Cause',
    question: 'What brought it into being?',
    color: 'text-accent-2',
    borderColor: 'border-accent-2/50',
    bgColor: 'bg-accent-2/10',
  },
  {
    id: 'final',
    greek: 'telos',
    name: 'Final Cause',
    question: 'What is its purpose / telos?',
    color: 'text-success',
    borderColor: 'border-success/50',
    bgColor: 'bg-success/10',
  },
]

type ObjectEntry = {
  id: string
  label: string
  symbol: string
  causes: Record<'material' | 'formal' | 'efficient' | 'final', string>
  aristotleNote: string
}

const OBJECTS: Array<ObjectEntry> = [
  {
    id: 'table',
    label: 'Wooden Table',
    symbol: '🪵',
    causes: {
      material: 'Oak wood, iron nails, perhaps glue — the physical stuff it is made from. Change the material (e.g. stone) and you have a different kind of thing.',
      formal: 'A flat horizontal surface supported by four legs at a standard height — the structural pattern that makes it a table rather than a pile of wood.',
      efficient: 'The carpenter who cut, joined, and shaped the wood — the agent whose activity brought the table from potential into actual existence.',
      final: 'To provide a stable surface for eating, working, or writing — the purpose for which it was designed, and which explains why it has the form it does.',
    },
    aristotleNote:
      'The final cause is Aristotle\'s most original contribution. For him, "why does a table have four legs?" is not fully answered by pointing to physics — you must say: because four legs serve the purpose of a stable surface. Teleology (purpose) is baked into nature itself.',
  },
  {
    id: 'statue',
    label: 'Bronze Statue',
    symbol: '🗿',
    causes: {
      material: 'Bronze — a mixture of copper and tin. The molten metal that the sculptor pours into the mould. Strip away the bronze and the statue ceases to exist.',
      formal: "The shape of a particular person (say, Hermes) — the figure's proportions, gesture, and features that make this lump of bronze a statue of a god rather than just metal.",
      efficient: 'The sculptor — Polykleitos, say — who conceived and executed the work. In nature, Aristotle says the efficient cause is what initiates movement or change.',
      final: 'To honour the god, to commemorate a victory, to beautify a temple — the intended end that determined what form the bronze should take.',
    },
    aristotleNote:
      'Aristotle used the statue as his canonical example. Notice: the material cause resists the formal cause (bronze is hard to mould), and the efficient cause (the sculptor) must understand the final cause to do the work well. All four are needed for a complete explanation.',
  },
  {
    id: 'eye',
    label: 'The Eye (natural)',
    symbol: '👁',
    causes: {
      material: 'Aqueous humor, vitreous humor, the lens, retinal cells, optic nerve fibres — the biological tissue that constitutes the organ.',
      formal: 'The structural organisation of a lens that focuses light onto a photosensitive retina connected to the brain — what makes this arrangement an eye, not just a blob of tissue.',
      efficient: 'In biological reproduction, the parents — the process by which genetic information is passed and a new eye develops from an embryo. Nature is the efficient cause in living things.',
      final: 'Seeing — this is the telos of the eye. Aristotle says nature makes nothing in vain. The eye is what it is because of what it does. This is why teleology is indispensable in biology.',
    },
    aristotleNote:
      'Aristotle\'s four causes were most revolutionary in biology. Modern biologists resist teleological language — but functional explanations ("the heart is for pumping blood") are ubiquitous. Aristotle simply made explicit what biology cannot avoid.',
  },
  {
    id: 'house',
    label: 'A House',
    symbol: '🏛',
    causes: {
      material: 'Bricks, timber, mortar, tiles — the physical substances. Build from different materials (stone vs wood) and you get a structurally different kind of house.',
      formal: 'Walls, a roof, a door — the plan or blueprint. The architect\'s design is the formal cause: it specifies what arrangement of materials constitutes "a house" vs a pile of rubble.',
      efficient: 'The builders — the workers and architect whose activity transformed raw materials into the finished structure according to the plan.',
      final: 'Shelter — protection of people and goods from weather. This telos explains why houses have roofs (not open tops) and why walls are solid (not decorative lattices).',
    },
    aristotleNote:
      'Aristotle points out that the form exists first in the mind of the builder (as a concept) before it exists in matter. This is the seed of an idea that runs through all of Western philosophy: does form (structure, pattern) precede matter?',
  },
]

export function FourCauses() {
  const [objectId, setObjectId] = useState<string>('table')
  const [activeCause, setActiveCause] = useState<'material' | 'formal' | 'efficient' | 'final'>('material')

  const obj = OBJECTS.find((o) => o.id === objectId)!
  const cause = CAUSES.find((c) => c.id === activeCause)!

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      {/* object selector */}
      <div className="flex flex-wrap gap-1.5 border-b border-border bg-surface-2 p-3">
        <p className="w-full text-xs text-muted">Choose an object to analyse:</p>
        {OBJECTS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setObjectId(o.id)}
            className={cn(
              'rounded-xl border px-3 py-1.5 text-sm transition-colors',
              objectId === o.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {o.symbol} {o.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* four cause tabs */}
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CAUSES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCause(c.id)}
              className={cn(
                'rounded-xl border px-3 py-2 text-center text-sm transition-colors',
                activeCause === c.id
                  ? cn(c.borderColor, c.bgColor, c.color, 'font-semibold')
                  : 'border-border text-muted hover:text-ink',
              )}
            >
              <div className="font-semibold">{c.name}</div>
              <div className="mt-0.5 text-xs opacity-80">{c.question}</div>
            </button>
          ))}
        </div>

        {/* cause explanation */}
        <div className={cn('mb-3 rounded-xl border p-4', cause.borderColor, cause.bgColor)}>
          <div className="mb-2 flex items-center gap-2">
            <span className={cn('text-sm font-semibold', cause.color)}>{cause.name}</span>
            <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-xs text-muted italic">
              {cause.greek}
            </span>
          </div>
          <p className="text-sm text-ink">{obj.causes[activeCause]}</p>
        </div>

        {/* four-cause overview minimap */}
        <div className="mb-3 grid grid-cols-4 gap-1 text-center text-xs">
          {CAUSES.map((c) => (
            <div
              key={c.id}
              className={cn(
                'rounded-lg border px-1 py-1.5 transition-opacity',
                c.borderColor,
                c.bgColor,
                activeCause === c.id ? 'opacity-100' : 'opacity-40',
              )}
            >
              <div className={cn('font-semibold leading-tight', c.color)}>{c.name.split(' ')[0]}</div>
              <div className="mt-0.5 text-muted leading-tight">{c.question.split(' ').slice(0, 3).join(' ')}…</div>
            </div>
          ))}
        </div>

        {/* Aristotle's note */}
        <div className="rounded-xl border border-border bg-surface-2 p-3 text-sm text-muted">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink">Aristotle's insight</p>
          <p>{obj.aristotleNote}</p>
        </div>
      </div>
    </div>
  )
}
