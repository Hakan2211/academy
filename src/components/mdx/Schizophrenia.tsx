import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// An explorer of schizophrenia's two symptom families. POSITIVE symptoms are
// experiences ADDED to normal functioning (hallucinations, delusions,
// disorganised thought); NEGATIVE symptoms are things TAKEN AWAY (flat affect,
// avolition, withdrawal). "Positive/negative" means added/subtracted, not
// good/bad. Toggle the family, click a symptom for a plain-language account —
// and note clearly that schizophrenia is NOT "split personality".
type Family = 'positive' | 'negative'

const SYMPTOMS: Record<Family, Array<{ name: string; icon: string; body: string }>> = {
  positive: [
    {
      name: 'Hallucinations',
      icon: 'Ear',
      body: 'Vivid perceptions with no external source — most often hearing voices. To the person they are as real as any other sound.',
    },
    {
      name: 'Delusions',
      icon: 'Sparkles',
      body: 'Firmly held beliefs that don’t match reality and resist evidence — e.g. of being watched, controlled, or having a special mission.',
    },
    {
      name: 'Disorganised thought',
      icon: 'Shuffle',
      body: 'Thinking and speech jump between unrelated ideas, making conversation hard to follow. It reflects a real disturbance in thought, not carelessness.',
    },
  ],
  negative: [
    {
      name: 'Flat affect',
      icon: 'Meh',
      body: 'A marked reduction in the outward expression of emotion — a still face, a flat voice — even when feelings may still be present inside.',
    },
    {
      name: 'Avolition',
      icon: 'BatteryLow',
      body: 'A deep loss of drive to start or finish goal-directed activity. Everyday tasks like washing or cooking can feel impossible to begin.',
    },
    {
      name: 'Withdrawal',
      icon: 'UserMinus',
      body: 'Pulling away from social contact and pleasure (anhedonia). The world flattens and connection becomes hard to reach.',
    },
  ],
}

export function Schizophrenia() {
  const [family, setFamily] = useState<Family>('positive')
  const [sel, setSel] = useState(0)
  const list = SYMPTOMS[family]
  const s = list[sel]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {(['positive', 'negative'] as Array<Family>).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => {
              setFamily(f)
              setSel(0)
            }}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              family === f ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {f === 'positive' ? 'Positive (added)' : 'Negative (taken away)'}
          </button>
        ))}
      </div>

      <p className="mb-2 text-xs text-muted">
        {family === 'positive'
          ? '“Positive” means experiences added on top of normal functioning — not “good”.'
          : '“Negative” means normal functions reduced or lost — not “bad behaviour”.'}
      </p>

      <div className="grid grid-cols-3 gap-2">
        {list.map((sym, i) => (
          <button
            key={sym.name}
            type="button"
            onClick={() => setSel(i)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-xl border p-2.5 text-center transition-colors',
              i === sel ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={sym.icon} size={20} />
            <span className="text-[11px] font-medium leading-tight">{sym.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 p-3">
        <p className="text-sm font-semibold text-ink">{s.name}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
      </div>

      <div className="mt-3 rounded-xl border border-warn/40 bg-warn/10 p-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Icon name="TriangleAlert" size={16} />
          A common myth
        </div>
        <p className="mt-1 text-sm leading-relaxed text-ink/90">
          Schizophrenia is <span className="font-semibold">not</span> a “split” or “multiple” personality. It is a disorder of perception and thought. Most people with schizophrenia are far more likely to be victims of violence than perpetrators of it.
        </p>
      </div>
    </div>
  )
}
