import { useState } from 'react'
import { addFrac, subFrac, lcm } from '#/lib/math'

// Add or subtract two fractions. The bars are re-sliced to a common denominator
// so the pieces are the same size and can finally be combined. Reused in
// adding-and-subtracting-fractions.
export function FractionAdd() {
  const [a, setA] = useState({ n: 1, d: 2 })
  const [b, setB] = useState({ n: 1, d: 3 })
  const [op, setOp] = useState<'+' | '−'>('+')
  const L = lcm(a.d, b.d)
  const an = (a.n * L) / a.d
  const bn = (b.n * L) / b.d
  const result = op === '+' ? addFrac(a, b) : subFrac(a, b)

  const Bar = ({ n, d, color }: { n: number; d: number; color: string }) => (
    <div className="flex overflow-hidden rounded-md border border-border">
      {Array.from({ length: d }, (_, i) => (
        <div key={i} className={`h-8 flex-1 border-r border-surface ${i < n ? color : 'bg-surface-2'} ${i === d - 1 ? 'border-r-0' : ''}`} />
      ))}
    </div>
  )
  const Ctrl = ({ f, set }: { f: { n: number; d: number }; set: (v: { n: number; d: number }) => void }) => (
    <div className="flex gap-3 px-1 text-xs">
      <label className="flex flex-1 items-center gap-2"><span className="text-muted">num</span><input type="range" min={1} max={f.d} value={f.n} onChange={(e) => set({ ...f, n: Number(e.target.value) })} className="flex-1 accent-accent" /></label>
      <label className="flex flex-1 items-center gap-2"><span className="text-muted">den</span><input type="range" min={2} max={8} value={f.d} onChange={(e) => { const d = Number(e.target.value); set({ n: Math.min(f.n, d), d }) }} className="flex-1 accent-accent" /></label>
    </div>
  )

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex justify-center gap-2">
        {(['+', '−'] as const).map((o) => (
          <button key={o} onClick={() => setOp(o)} className={`h-8 w-10 rounded-lg border font-mono text-lg transition ${o === op ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>{o}</button>
        ))}
      </div>

      <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1">
        <span className="font-mono text-accent">{a.n}/{a.d}</span>
        <Bar n={a.n} d={a.d} color="bg-accent" />
        <span className="text-center font-mono text-muted">{op}</span>
        <Ctrl f={a} set={setA} />
        <span className="font-mono text-accent-2">{b.n}/{b.d}</span>
        <Bar n={b.n} d={b.d} color="bg-accent-2" />
        <span />
        <Ctrl f={b} set={setB} />
      </div>

      <div className="mt-4 rounded-xl bg-surface-2 p-3 text-center">
        <div className="font-mono text-sm text-muted">
          {a.n}/{a.d} {op} {b.n}/{b.d} = {an}/{L} {op} {bn}/{L} = {op === '+' ? an + bn : an - bn}/{L}
        </div>
        <div className="mt-1 font-mono text-2xl font-bold text-success">
          = {result.n}/{result.d}
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        Same denominator first — you can only add pieces that are the same size.
      </p>
    </div>
  )
}
