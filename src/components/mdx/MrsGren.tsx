import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The seven processes shared by every living thing (the classic "MRS GREN"
// mnemonic). A clickable ring: pick a process to read what it means and see an
// example. The letters spell the mnemonic so it sticks.
type Process = {
  letter: string
  label: string
  icon: string
  color: string
  desc: string
  example: string
}

const PROCESSES: Array<Process> = [
  { letter: 'M', label: 'Movement', icon: 'Move', color: '#4F8CFF', desc: 'Changing position or moving a part of the body.', example: 'A cat pounces; a sunflower turns to face the sun.' },
  { letter: 'R', label: 'Respiration', icon: 'Flame', color: '#FF8A4C', desc: 'Releasing energy from food inside every cell.', example: 'Your cells burn glucose to power everything you do.' },
  { letter: 'S', label: 'Sensitivity', icon: 'Eye', color: '#00CEC9', desc: 'Detecting and responding to changes in the surroundings.', example: 'Your pupil shrinks in bright light.' },
  { letter: 'G', label: 'Growth', icon: 'Sprout', color: '#2ECC71', desc: 'Getting bigger and more complex over time.', example: 'A seed becomes a towering tree.' },
  { letter: 'R', label: 'Reproduction', icon: 'Copy', color: '#FD79A8', desc: 'Making more of the same kind of organism.', example: 'A bird lays eggs; a bacterium splits in two.' },
  { letter: 'E', label: 'Excretion', icon: 'Droplets', color: '#A29BFE', desc: 'Removing the waste products of living.', example: 'Your kidneys filter waste into urine.' },
  { letter: 'N', label: 'Nutrition', icon: 'Apple', color: '#FDCB6E', desc: 'Taking in the materials and energy needed to live.', example: 'A plant makes food from light; you eat lunch.' },
]

export function MrsGren() {
  const [sel, setSel] = useState(0)
  const p = PROCESSES[sel]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="relative mx-auto aspect-square w-full max-w-[360px]">
        {/* connecting ring */}
        <div className="absolute inset-[14%] rounded-full border border-dashed border-border" />

        {/* centre detail */}
        <div className="absolute left-1/2 top-1/2 flex w-[44%] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center">
          <div
            className="grid h-12 w-12 place-items-center rounded-full"
            style={{ background: `${p.color}22`, color: p.color }}
          >
            <Icon name={p.icon} size={24} />
          </div>
          <p className="text-base font-bold text-ink">{p.label}</p>
          <p className="text-xs leading-snug text-muted">{p.desc}</p>
        </div>

        {/* the seven nodes */}
        {PROCESSES.map((proc, i) => {
          const angle = (-90 + i * (360 / PROCESSES.length)) * (Math.PI / 180)
          const x = 50 + 42 * Math.cos(angle)
          const y = 50 + 42 * Math.sin(angle)
          const active = i === sel
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSel(i)}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-label={proc.label}
            >
              <span
                className={cn(
                  'grid h-11 w-11 place-items-center rounded-full border-2 font-bold transition-colors',
                  active ? 'text-white' : 'bg-surface-2 text-muted',
                )}
                style={{
                  borderColor: proc.color,
                  background: active ? proc.color : undefined,
                }}
              >
                {proc.letter}
              </span>
            </button>
          )
        })}
      </div>

      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-center text-sm text-muted">
        <span className="font-semibold text-ink">Example: </span>
        {p.example}
      </p>
      <p className="mt-2 text-center text-xs text-muted">
        Spelling it out: <span className="font-mono tracking-widest text-ink">MRS GREN</span>
      </p>
    </div>
  )
}
