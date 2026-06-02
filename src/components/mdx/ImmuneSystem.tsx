import { useState } from 'react'
import { cn } from '#/lib/cn'

// The body's layered defences against pathogens. Click each to see how it works —
// from the barriers that keep microbes out, to the white blood cells that hunt
// down the ones that get in.
type Defence = { id: string; label: string; line: string; fn: string }

const DEFENCES: Array<Defence> = [
  { id: 'skin', label: 'Skin', line: '1st line · barrier', fn: 'A tough physical wall that keeps most microbes out. Cuts are dangerous because they breach it.' },
  { id: 'mucus', label: 'Mucus & cilia', line: '1st line · barrier', fn: 'Sticky mucus in your airways traps microbes; tiny hairs (cilia) sweep them back up to be swallowed.' },
  { id: 'acid', label: 'Stomach acid', line: '1st line · barrier', fn: 'Strong acid in the stomach destroys most microbes you swallow in food and mucus.' },
  { id: 'phagocyte', label: 'Phagocytes', line: '2nd line · non-specific', fn: 'White blood cells that engulf and digest ANY invader (phagocytosis). Fast, but not tailored to a specific pathogen.' },
  { id: 'lymphocyte', label: 'Lymphocytes', line: '3rd line · specific', fn: 'White blood cells that recognise a SPECIFIC pathogen and make antibodies against it — and leave memory cells behind for next time.' },
]

export function ImmuneSystem() {
  const [sel, setSel] = useState('phagocyte')
  const d = DEFENCES.find((x) => x.id === sel)!
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-col gap-1.5">
        {DEFENCES.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setSel(x.id)}
            className={cn('flex items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors', sel === x.id ? 'border-accent bg-accent/10' : 'border-border hover:bg-surface-2')}
          >
            <span className="text-sm font-medium text-ink">{x.label}</span>
            <span className="text-[10px] text-muted">{x.line}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        <span className="font-semibold text-ink">{d.label}: </span>{d.fn}
      </p>
      <p className="mt-2 text-center text-xs text-muted">
        Three layers: barriers keep microbes <span className="text-ink">out</span>; phagocytes eat <span className="text-ink">any</span> that get in; lymphocytes mount a <span className="text-ink">targeted</span> attack and remember.
      </p>
    </div>
  )
}
