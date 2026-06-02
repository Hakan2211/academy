import { useState } from 'react'
import { toSuperscript } from '#/lib/math'

// The three index laws, shown as counting copies of the base. Multiplying powers
// pools the copies (add); dividing cancels them (subtract); a power of a power
// repeats them (multiply). Used in laws-of-indices.
const LAWS = [
  { key: 'mul', label: 'aᵐ × aⁿ', rule: 'add the indices' },
  { key: 'div', label: 'aᵐ ÷ aⁿ', rule: 'subtract the indices' },
  { key: 'pow', label: '(aᵐ)ⁿ', rule: 'multiply the indices' },
]

export function IndexLaws() {
  const [law, setLaw] = useState(0)
  const [m, setM] = useState(3)
  const [n, setN] = useState(2)
  const a = 2

  let resultExp = 0
  let expr = ''
  if (law === 0) {
    resultExp = m + n
    expr = `${a}${toSuperscript(m)} × ${a}${toSuperscript(n)} = ${a}${toSuperscript(`${m}+${n}`)} = ${a}${toSuperscript(resultExp)}`
  } else if (law === 1) {
    resultExp = m - n
    expr = `${a}${toSuperscript(m)} ÷ ${a}${toSuperscript(n)} = ${a}${toSuperscript(`${m}−${n}`)} = ${a}${toSuperscript(resultExp)}`
  } else {
    resultExp = m * n
    expr = `(${a}${toSuperscript(m)})${toSuperscript(n)} = ${a}${toSuperscript(`${m}×${n}`)} = ${a}${toSuperscript(resultExp)}`
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {LAWS.map((l, i) => (
          <button key={l.key} onClick={() => setLaw(i)} className={`rounded-lg border px-3 py-1 font-mono text-sm transition ${i === law ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            {l.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-surface-2 py-5 text-center">
        <div className="font-mono text-2xl font-bold text-ink">{expr}</div>
        <div className="mt-1 text-sm text-accent">{LAWS[law].rule}</div>
        <div className="mt-2 font-mono text-xs text-muted">
          check: {Math.pow(a, m)} {law === 0 ? '×' : law === 1 ? '÷' : 'then ^'} {law === 2 ? n : Math.pow(a, n)} = {Math.pow(a, resultExp)}
        </div>
      </div>

      <div className="mt-3 space-y-2 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">m</span>
          <input type="range" min={1} max={5} value={m} onChange={(e) => setM(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{m}</span>
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">n</span>
          <input type="range" min={1} max={law === 1 ? m : 5} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{n}</span>
        </label>
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        It all comes from counting: {a}{toSuperscript(m)} is {m} copies of {a} multiplied together.
      </p>
    </div>
  )
}
