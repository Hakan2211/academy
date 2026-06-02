import { useState } from 'react'
import { cn } from '#/lib/cn'

// The journey of a meal. Click each organ to see its job in turning food into
// absorbable fuel.
type Organ = { id: string; label: string; fn: string }

const ORGANS: Array<Organ> = [
  { id: 'mouth', label: 'Mouth', fn: 'Teeth chew food into smaller pieces; saliva adds the enzyme amylase, which starts breaking down starch.' },
  { id: 'oesophagus', label: 'Oesophagus', fn: 'A muscular tube that squeezes food down to the stomach by waves of contraction (peristalsis).' },
  { id: 'stomach', label: 'Stomach', fn: 'Churns food and adds acid (killing microbes) and protease enzymes that begin digesting protein.' },
  { id: 'liver', label: 'Liver', fn: 'Makes bile, which emulsifies fat into tiny droplets so enzymes can digest it faster.' },
  { id: 'pancreas', label: 'Pancreas', fn: 'Releases enzymes for all three food groups (carbohydrase, protease, lipase) into the small intestine.' },
  { id: 'small', label: 'Small intestine', fn: 'Digestion is completed here, and the soluble nutrients are absorbed into the blood through millions of villi.' },
  { id: 'large', label: 'Large intestine', fn: 'Absorbs water from the leftover material, forming faeces that are stored and then egested.' },
]

export function DigestiveSystem() {
  const [sel, setSel] = useState('stomach')
  const organ = ORGANS.find((o) => o.id === sel)!
  const lit = (id: string, base: string) => (sel === id ? '#FACC15' : base)
  const sw = (id: string, base: number) => (sel === id ? base + 1.5 : base)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="grid grid-cols-[150px_1fr] gap-3">
        <svg viewBox="0 0 150 280" className="w-full">
          {/* mouth */}
          <g onClick={() => setSel('mouth')} className="cursor-pointer">
            <ellipse cx={70} cy={20} rx={16} ry={9} fill="#E17055" stroke={lit('mouth', '#0e1c2e')} strokeWidth={sw('mouth', 1.5)} />
          </g>
          {/* oesophagus */}
          <g onClick={() => setSel('oesophagus')} className="cursor-pointer">
            <rect x={64} y={28} width={12} height={56} rx={6} fill="#fab1a0" stroke={lit('oesophagus', '#0e1c2e')} strokeWidth={sw('oesophagus', 1.5)} />
          </g>
          {/* stomach */}
          <g onClick={() => setSel('stomach')} className="cursor-pointer">
            <path d="M 70 84 q 34 2 30 36 q -2 30 -34 30 q -22 -2 -18 -26 q 4 -16 -4 -22 q 8 -2 12 -18 z" fill="#d35400" stroke={lit('stomach', '#0e1c2e')} strokeWidth={sw('stomach', 1.5)} />
          </g>
          {/* liver */}
          <g onClick={() => setSel('liver')} className="cursor-pointer">
            <path d="M 96 96 q 36 -10 40 14 q -20 12 -42 6 z" fill="#7b241c" stroke={lit('liver', '#0e1c2e')} strokeWidth={sw('liver', 1.5)} />
          </g>
          {/* pancreas */}
          <g onClick={() => setSel('pancreas')} className="cursor-pointer">
            <path d="M 92 150 q 30 6 44 -2 q -2 12 -16 12 q -20 0 -28 -10 z" fill="#e0a96d" stroke={lit('pancreas', '#0e1c2e')} strokeWidth={sw('pancreas', 1.5)} />
          </g>
          {/* large intestine frame */}
          <g onClick={() => setSel('large')} className="cursor-pointer">
            <path d="M 40 168 L 40 124 L 110 124 L 110 240 L 70 240" fill="none" stroke={lit('large', '#a3cb38')} strokeWidth={sw('large', 9)} strokeLinecap="round" strokeLinejoin="round" />
          </g>
          {/* small intestine coil */}
          <g onClick={() => setSel('small')} className="cursor-pointer">
            <path d="M 58 168 q 30 -6 30 12 q 0 14 -26 12 q -22 -2 -22 12 q 0 14 26 12 q 28 -2 28 12 q 0 14 -28 12" fill="none" stroke={lit('small', '#fdcb6e')} strokeWidth={sw('small', 6)} strokeLinecap="round" />
          </g>
        </svg>

        <div className="flex flex-col">
          <div className="mb-2 flex flex-wrap gap-1">
            {ORGANS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setSel(o.id)}
                className={cn('rounded-full border px-2 py-0.5 text-[11px] transition-colors', sel === o.id ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div className="rounded-lg bg-surface-2 px-3 py-2">
            <p className="text-sm font-semibold text-ink">{organ.label}</p>
            <p className="mt-0.5 text-sm text-muted">{organ.fn}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
