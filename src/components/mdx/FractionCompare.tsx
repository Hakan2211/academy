import { useState } from 'react'
import { lcm } from '#/lib/math'

// Compare two fractions. Two equal-width bars make the bigger one obvious; the
// common denominator makes it provable. Reused in comparing-and-ordering.
function Bar({ n, d, color }: { n: number; d: number; color: string }) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-border">
      {Array.from({ length: d }, (_, i) => (
        <div key={i} className={`h-10 flex-1 border-r border-surface ${i < n ? color : 'bg-surface-2'} ${i === d - 1 ? 'border-r-0' : ''}`} />
      ))}
    </div>
  )
}

export function FractionCompare() {
  const [a, setA] = useState({ n: 2, d: 3 })
  const [b, setB] = useState({ n: 3, d: 5 })
  const L = lcm(a.d, b.d)
  const an = (a.n * L) / a.d
  const bn = (b.n * L) / b.d
  const cmp = an === bn ? '=' : an > bn ? '>' : '<'

  const Ctrl = ({ f, set, color }: { f: { n: number; d: number }; set: (v: { n: number; d: number }) => void; color: string }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className={`font-mono text-lg font-bold ${color}`}>{f.n}/{f.d}</span>
        <div className="flex-1"><Bar n={Math.min(f.n, f.d)} d={f.d} color={color === 'text-accent' ? 'bg-accent' : 'bg-accent-2'} /></div>
      </div>
      <div className="flex gap-4 px-1 text-xs">
        <label className="flex flex-1 items-center gap-2">
          <span className="text-muted">num</span>
          <input type="range" min={0} max={f.d} value={f.n} onChange={(e) => set({ ...f, n: Number(e.target.value) })} className="flex-1 accent-accent" />
        </label>
        <label className="flex flex-1 items-center gap-2">
          <span className="text-muted">den</span>
          <input type="range" min={2} max={10} value={f.d} onChange={(e) => { const d = Number(e.target.value); set({ n: Math.min(f.n, d), d }) }} className="flex-1 accent-accent" />
        </label>
      </div>
    </div>
  )

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="space-y-4">
        <Ctrl f={a} set={setA} color="text-accent" />
        <Ctrl f={b} set={setB} color="text-accent-2" />
      </div>

      <div className="mt-4 text-center">
        <div className="font-mono text-xl">
          <span className="text-accent">{a.n}/{a.d}</span>
          <span className="mx-3 font-bold text-ink">{cmp}</span>
          <span className="text-accent-2">{b.n}/{b.d}</span>
        </div>
        <p className="mt-2 text-sm text-muted">
          Common denominator {L}: &nbsp;
          <span className="font-mono text-accent">{an}/{L}</span> vs <span className="font-mono text-accent-2">{bn}/{L}</span> — now just compare the numerators.
        </p>
      </div>
    </div>
  )
}
