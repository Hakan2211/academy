import { useState } from 'react'

// The metric staircase. Each step is a power of ten, so converting length is
// just multiplying or dividing by 10, 100, 1000. Enter a value in any unit and
// read it in all of them. Used in units-and-conversions.
const UNITS = [
  { u: 'mm', m: 0.001 },
  { u: 'cm', m: 0.01 },
  { u: 'm', m: 1 },
  { u: 'km', m: 1000 },
]

export function UnitConverter() {
  const [val, setVal] = useState(250)
  const [ui, setUi] = useState(0)
  const metres = val * UNITS[ui].m

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex justify-center gap-2">
        {UNITS.map((u, i) => (
          <button key={u.u} onClick={() => setUi(i)} className={`rounded-lg border px-3 py-1 text-sm transition ${i === ui ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            {u.u}
          </button>
        ))}
      </div>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">value in {UNITS[ui].u}</span>
          <input type="range" min={1} max={1000} value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-12 text-right font-mono text-ink">{val}</span>
        </label>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 text-center">
        {UNITS.map((u, i) => {
          const v = metres / u.m
          return (
            <div key={u.u} className={`rounded-lg border p-2 ${i === ui ? 'border-accent bg-accent/10' : 'border-border'}`}>
              <div className="font-mono text-sm font-bold text-ink">{(+v.toFixed(4)).toLocaleString('en-US')}</div>
              <div className="text-[11px] text-muted">{u.u}</div>
            </div>
          )
        })}
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        mm → cm → m → km: each step is ×/÷ 10, 100, 1000. For <strong>areas</strong> square the factor (1 m² = 10 000 cm²); for <strong>volumes</strong> cube it (1 m³ = 1 000 000 cm³).
      </p>
    </div>
  )
}
