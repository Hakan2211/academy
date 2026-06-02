import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// From one cell to a baby. Step through the stages of development, from the
// single-celled zygote to birth.
const STAGES = [
  { emoji: '⚪', title: 'Zygote — day 0', caption: 'A single fertilised cell with a full set of 46 chromosomes. It carries every instruction needed to build a whole person.' },
  { emoji: '⚫', title: 'Cleavage — days 1–4', caption: 'The zygote divides by mitosis again and again — 2, 4, 8, 16 cells — forming a solid ball of identical cells, all still unspecialised.' },
  { emoji: '🔵', title: 'Blastocyst — week 1', caption: 'The ball hollows out and implants into the thick uterus lining, where it can get nutrients from the mother.' },
  { emoji: '🌱', title: 'Embryo — weeks 3–8', caption: 'Cells now differentiate into specialised types. The heart starts beating and the brain, spine, and limb buds form.' },
  { emoji: '👶', title: 'Fetus — weeks 9–38', caption: 'Recognisably human. The organs mature and the fetus mostly grows, nourished through the placenta and umbilical cord.' },
  { emoji: '🍼', title: 'Birth — ~week 40', caption: 'The muscular uterus contracts, the cervix opens, and the baby is born — ready to take its first breath.' },
]

export function Development() {
  const [i, setI] = useState(0)
  const s = STAGES[i]
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-col items-center gap-2 py-3">
        <div className="text-6xl leading-none">{s.emoji}</div>
        <p className="text-center text-base font-bold text-ink">{s.title}</p>
        <p className="min-h-[4.5rem] max-w-md text-center text-sm text-muted">{s.caption}</p>
      </div>
      <div className="mb-3 flex items-center justify-center gap-1">
        {STAGES.map((st, k) => (
          <div key={k} className="flex items-center">
            <span className={cn('grid h-7 w-7 place-items-center rounded-full text-sm transition-colors', k <= i ? 'bg-accent/20' : 'bg-surface-2 opacity-50')}>{st.emoji}</span>
            {k < STAGES.length - 1 && <span className={cn('h-0.5 w-3', k < i ? 'bg-accent' : 'bg-border')} />}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm text-muted enabled:hover:text-ink disabled:opacity-30">
          <Icon name="ChevronLeft" size={14} /> Back
        </button>
        <span className="text-xs text-muted">{i + 1} of {STAGES.length}</span>
        <button type="button" onClick={() => setI((v) => Math.min(STAGES.length - 1, v + 1))} disabled={i === STAGES.length - 1} className="flex items-center gap-1 rounded-full border border-accent bg-accent/15 px-3 py-1 text-sm text-accent enabled:hover:bg-accent/25 disabled:opacity-30">
          Next <Icon name="ChevronRight" size={14} />
        </button>
      </div>
    </div>
  )
}
