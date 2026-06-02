import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Piaget's four stages of cognitive development. Each has an age range, the new
// ability it unlocks, and the signature limitation that defines it (and the
// classic task that reveals that limit). Click a stage to explore it.
const STAGES = [
  {
    name: 'Sensorimotor',
    age: 'Birth – 2 yrs',
    icon: 'Baby',
    ability: 'The infant knows the world through senses and actions — looking, grasping, mouthing, banging.',
    win: 'Object permanence: late in this stage the child grasps that things still exist when out of sight.',
    limit: 'At first, out of sight is out of mind. Hide a toy and the young infant acts as if it simply vanished.',
    color: '#FDCB6E',
  },
  {
    name: 'Preoperational',
    age: '2 – 7 yrs',
    icon: 'Sparkles',
    ability: 'Symbolic thought blooms: language explodes, and the child pretends, draws and imagines.',
    win: 'Rich make-believe play and a rapidly growing vocabulary of words and mental symbols.',
    limit: 'No conservation (more-looking means more), and egocentrism — assuming everyone sees what they see.',
    color: '#E17055',
  },
  {
    name: 'Concrete operational',
    age: '7 – 11 yrs',
    icon: 'Calculator',
    ability: 'Logical reasoning arrives — but only about concrete, here-and-now objects and events.',
    win: 'Conservation is mastered, along with reversibility and simple arithmetic and classification.',
    limit: 'Abstract and hypothetical "what if" reasoning is still shaky; thinking needs something tangible.',
    color: '#74B9FF',
  },
  {
    name: 'Formal operational',
    age: '12 yrs +',
    icon: 'BrainCircuit',
    ability: 'Abstract, hypothetical and systematic reasoning come online — adult-style logic.',
    win: 'Can reason about possibilities, ideals, ethics and "what if the world were different".',
    limit: 'Even adults do not always reason formally; we lapse into intuition under pressure or fatigue.',
    color: '#A29BFE',
  },
] as const

export function PiagetStages() {
  const [i, setI] = useState(0)
  const s = STAGES[i]

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STAGES.map((st, k) => (
          <button
            key={st.name}
            type="button"
            onClick={() => setI(k)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-xl border px-2 py-2 transition-colors',
              k === i ? 'border-accent bg-accent/15' : 'border-border hover:border-accent/40',
            )}
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: `${st.color}22`, color: st.color }}
            >
              <Icon name={st.icon} size={18} />
            </span>
            <span className={cn('text-center text-xs font-semibold leading-tight', k === i ? 'text-accent' : 'text-ink')}>
              {st.name}
            </span>
            <span className="text-[10px] text-muted">{st.age}</span>
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-surface-2 p-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${s.color}22`, color: s.color }}>
            <Icon name={s.icon} size={16} />
          </span>
          <p className="text-sm font-semibold text-ink">
            {s.name} <span className="font-normal text-muted">· {s.age}</span>
          </p>
        </div>
        <p className="mt-2 text-sm leading-snug text-muted">{s.ability}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <p className="rounded-lg bg-surface p-2 text-sm leading-snug" style={{ color: 'var(--color-success)' }}>
            <span className="font-semibold">New ability: </span>
            {s.win}
          </p>
          <p className="rounded-lg bg-surface p-2 text-sm leading-snug" style={{ color: '#E74C3C' }}>
            <span className="font-semibold">Still can't: </span>
            {s.limit}
          </p>
        </div>
      </div>
    </div>
  )
}
