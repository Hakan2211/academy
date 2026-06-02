import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Howard Gardner's eight intelligences as a grid of tiles. Click one to learn
// what it is, who exemplifies it, and how you might recognise it in everyday
// life. The point: "smart" comes in many flavours, most of them invisible to a
// standard IQ test.
type Intel = {
  name: string
  icon: string
  color: string
  desc: string
  example: string
  exemplar: string
}

const INTELLIGENCES: Array<Intel> = [
  {
    name: 'Linguistic',
    icon: 'BookText',
    color: '#3498DB',
    desc: 'Sensitivity to words, their sounds, meanings and rhythms — the gift of language.',
    example: 'Writing a poem that lands exactly the right word, learning a new language quickly, telling a story that grips a room.',
    exemplar: 'poets, journalists, lawyers',
  },
  {
    name: 'Logical-mathematical',
    icon: 'Sigma',
    color: '#9B59B6',
    desc: 'Skill with logic, numbers, patterns and abstract reasoning — the ability prized by traditional IQ tests.',
    example: 'Spotting the hidden structure in a problem, proving a theorem, debugging code by reasoning about what must be true.',
    exemplar: 'scientists, mathematicians, engineers',
  },
  {
    name: 'Spatial',
    icon: 'Box',
    color: '#E67E22',
    desc: 'The ability to picture and manipulate objects and space in the mind’s eye.',
    example: 'Rotating a shape mentally, finding your way through a strange city, sketching a building before it exists.',
    exemplar: 'architects, pilots, sculptors',
  },
  {
    name: 'Musical',
    icon: 'Music',
    color: '#E84393',
    desc: 'Sensitivity to pitch, rhythm, tone and melody — hearing and making structured sound.',
    example: 'Picking out a wrong note instantly, keeping perfect time, composing a tune that stays in your head.',
    exemplar: 'composers, conductors, musicians',
  },
  {
    name: 'Bodily-kinesthetic',
    icon: 'Activity',
    color: '#27AE60',
    desc: 'Fine control of the body and movement — thinking through physical skill.',
    example: 'A gymnast nailing a routine, a surgeon’s steady hands, a dancer feeling the music in their limbs.',
    exemplar: 'athletes, dancers, surgeons',
  },
  {
    name: 'Interpersonal',
    icon: 'Users',
    color: '#F7B731',
    desc: 'Understanding other people — reading moods, motives and what makes them tick.',
    example: 'Sensing a friend is upset before they say so, calming a tense meeting, knowing just how to persuade someone.',
    exemplar: 'teachers, therapists, leaders',
  },
  {
    name: 'Intrapersonal',
    icon: 'Compass',
    color: '#00CEC9',
    desc: 'Understanding yourself — your feelings, values, strengths and limits.',
    example: 'Knowing why a decision unsettles you, setting goals that truly fit you, regulating your own emotions.',
    exemplar: 'philosophers, writers, the self-aware',
  },
  {
    name: 'Naturalistic',
    icon: 'Leaf',
    color: '#16A085',
    desc: 'Recognising, classifying and understanding the living world and natural patterns.',
    example: 'Identifying birds by their call, sorting plants into families, reading the weather from the sky.',
    exemplar: 'biologists, farmers, naturalists',
  },
]

export function MultipleIntelligences() {
  const [sel, setSel] = useState(0)
  const a = INTELLIGENCES[sel]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid grid-cols-4 gap-2">
        {INTELLIGENCES.map((it, i) => (
          <button
            key={it.name}
            type="button"
            onClick={() => setSel(i)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-xl border-2 p-2 text-center transition-all',
              sel === i ? 'bg-surface-2' : 'border-transparent bg-surface-2/40 hover:bg-surface-2',
            )}
            style={{ borderColor: sel === i ? it.color : 'transparent' }}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${it.color}22`, color: it.color }}>
              <Icon name={it.icon} size={16} />
            </span>
            <span className={cn('text-[10px] leading-tight', sel === i ? 'font-semibold text-ink' : 'text-muted')}>{it.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-border bg-surface-2 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${a.color}22`, color: a.color }}>
            <Icon name={a.icon} size={18} />
          </span>
          <span className="font-semibold text-ink">{a.name} intelligence</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink/90">{a.desc}</p>
        <p className="mt-2 text-sm leading-snug text-muted">
          <span className="font-semibold text-ink">Looks like:</span> {a.example}
        </p>
        <p className="mt-2 text-xs text-muted">
          <span className="font-semibold" style={{ color: a.color }}>Often strong in:</span> {a.exemplar}
        </p>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        A standard IQ test mostly measures the first two. Gardner argued the other six matter just as much.
      </p>
    </div>
  )
}
