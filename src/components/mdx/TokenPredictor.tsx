import { useState } from 'react'
import { cn } from '#/lib/cn'

// At heart, a large language model does one thing astonishingly well: given the
// text so far, predict the NEXT token (roughly, the next word-piece). It outputs
// a probability for every possible next token; we pick one, append it, and repeat.
// "Temperature" controls how boldly we stray from the most likely choice. Trained
// on a vast slice of human text, this simple loop produces fluent, useful writing.

type Cand = { word: string; logit: number }

// A tiny hand-authored "model": for each running phrase ending, plausible next
// tokens with rough scores. Falls back to a generic set when nothing matches.
const TABLE: Array<{ match: string; cands: Array<Cand> }> = [
  { match: 'The cat sat on the', cands: [{ word: 'mat', logit: 3.1 }, { word: 'sofa', logit: 1.8 }, { word: 'roof', logit: 1.1 }, { word: 'floor', logit: 0.9 }] },
  { match: 'the mat', cands: [{ word: 'and', logit: 2.4 }, { word: ',', logit: 1.6 }, { word: 'beside', logit: 0.8 }, { word: 'while', logit: 0.6 }] },
  { match: 'Once upon a', cands: [{ word: 'time', logit: 4.0 }, { word: 'midnight', logit: 1.2 }, { word: 'star', logit: 0.5 }, { word: 'hill', logit: 0.4 }] },
  { match: 'upon a time', cands: [{ word: 'there', logit: 2.8 }, { word: ',', logit: 1.9 }, { word: 'a', logit: 1.0 }, { word: 'in', logit: 0.7 }] },
  { match: 'To be or not to', cands: [{ word: 'be', logit: 4.2 }, { word: 'have', logit: 0.6 }, { word: 'do', logit: 0.5 }, { word: 'try', logit: 0.3 }] },
  { match: 'Water boils at 100 degrees', cands: [{ word: 'Celsius', logit: 3.4 }, { word: 'centigrade', logit: 1.3 }, { word: 'at', logit: 0.7 }, { word: 'in', logit: 0.6 }] },
]
const GENERIC: Array<Cand> = [{ word: 'and', logit: 1.8 }, { word: 'the', logit: 1.5 }, { word: 'a', logit: 1.2 }, { word: 'to', logit: 1.0 }, { word: '.', logit: 0.9 }]

const PRESETS = ['The cat sat on the', 'Once upon a', 'To be or not to', 'Water boils at 100 degrees']

function softmax(cands: Array<Cand>, temp: number): Array<number> {
  const t = Math.max(0.1, temp)
  const exps = cands.map((c) => Math.exp(c.logit / t))
  const sum = exps.reduce<number>((s, e) => s + e, 0)
  return exps.map((e) => e / sum)
}

function lookup(text: string): Array<Cand> {
  const lower = text.toLowerCase().trimEnd()
  let best: Array<Cand> | null = null
  let bestLen = 0
  for (const row of TABLE) {
    const m = row.match.toLowerCase()
    if (lower.endsWith(m) && m.length > bestLen) { best = row.cands; bestLen = m.length }
  }
  return best ?? GENERIC
}

export function TokenPredictor() {
  const [text, setText] = useState(PRESETS[0])
  const [temp, setTemp] = useState(0.7)

  const cands = lookup(text)
  const probs = softmax(cands, temp)
  const max = Math.max(...probs)

  const append = (word: string) => {
    const sep = word === ',' || word === '.' ? '' : ' '
    setText(text + sep + word)
  }
  const sample = () => {
    let r = Math.random()
    for (let i = 0; i < cands.length; i++) {
      r -= probs[i]
      if (r <= 0) { append(cands[i].word); return }
    }
    append(cands[cands.length - 1].word)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setText(p)}
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs transition-colors',
              text === p ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {p}…
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface-2 p-3 text-sm leading-relaxed">
        <span className="text-ink">{text}</span>
        <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-accent align-middle" />
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="text-xs text-muted">Predicted next token — click a bar to append:</div>
        {cands.map((c, i) => (
          <button
            key={c.word + i}
            type="button"
            onClick={() => append(c.word)}
            className="flex w-full items-center gap-2 text-left"
          >
            <span className="w-16 shrink-0 font-mono text-sm text-ink">"{c.word}"</span>
            <span className="relative h-5 flex-1 overflow-hidden rounded bg-surface-2">
              <span
                className={cn('absolute inset-y-0 left-0 rounded', probs[i] === max ? 'bg-accent' : 'bg-accent/40')}
                style={{ width: `${Math.max(2, probs[i] * 100)}%` }}
              />
            </span>
            <span className="w-12 shrink-0 text-right font-mono text-xs text-muted">{(probs[i] * 100).toFixed(0)}%</span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-2 text-sm text-muted">
          <span className="shrink-0">temperature</span>
          <input type="range" min={0.1} max={1.5} step={0.05} value={temp} onChange={(e) => setTemp(Number(e.target.value))} className="flex-1 accent-accent" />
          <span className="w-9 text-right font-mono text-ink">{temp.toFixed(2)}</span>
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={sample} className="rounded-full border border-accent-2 bg-accent-2/10 px-3 py-1 text-sm font-semibold text-accent-2">Sample</button>
          <button type="button" onClick={() => setText(PRESETS.find((p) => text.startsWith(p)) ?? PRESETS[0])} className="rounded-full border border-border px-3 py-1 text-sm text-muted hover:text-ink">Reset</button>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Low temperature → always the safe, top word. High temperature → flatter odds, more surprising (and riskier) choices.
      </p>
    </div>
  )
}
