import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'

// Big-O describes how an algorithm's work GROWS as the input n grows. The shape
// of the curve is what matters at scale: O(1) and O(log n) barely move, O(n) is
// a straight line, O(n log n) bends gently, O(n²) and O(2ⁿ) explode. Slide n and
// read the operation counts — the gap between "fast" and "slow" becomes
// astronomical. Reusable: plug it into any efficiency lesson.

type Cls = { key: string; label: string; color: string; f: (n: number) => number }

const CLASSES: Array<Cls> = [
  { key: 'const', label: 'O(1)', color: '#2ECC71', f: () => 1 },
  { key: 'log', label: 'O(log n)', color: '#4dd0e1', f: (n) => Math.log2(Math.max(1, n)) },
  { key: 'lin', label: 'O(n)', color: 'var(--color-accent-2)', f: (n) => n },
  { key: 'nlogn', label: 'O(n log n)', color: 'var(--color-accent)', f: (n) => n * Math.log2(Math.max(1, n)) },
  { key: 'quad', label: 'O(n²)', color: '#f4a261', f: (n) => n * n },
  { key: 'exp', label: 'O(2ⁿ)', color: '#e76f51', f: (n) => Math.pow(2, n) },
]

const W = 360, H = 220, PADL = 36, PADB = 26, PADT = 12, PADR = 10
const PX0 = PADL, PX1 = W - PADR, PY0 = H - PADB, PY1 = PADT
const NMAX = 40
// fixed plotting ceiling so the divergence reads clearly (log-scaled vertical)
const VMAX = NMAX * NMAX // O(n²) at n=40 fills the chart; exp clips above it

function fmt(v: number): string {
  if (v < 1000) return v % 1 === 0 ? String(v) : v.toFixed(1)
  if (v < 1e6) return (v / 1e3).toFixed(1) + 'K'
  if (v < 1e9) return (v / 1e6).toFixed(1) + 'M'
  if (v < 1e12) return (v / 1e9).toFixed(1) + 'B'
  return v.toExponential(1)
}

// map a value onto the y-axis with a log scale so all curves are visible
function ymap(v: number): number {
  const t = Math.log10(Math.max(1, v) + 1) / Math.log10(VMAX + 1)
  return PY0 - Math.min(1, t) * (PY0 - PY1)
}
function xmap(n: number): number {
  return PX0 + (n / NMAX) * (PX1 - PX0)
}

export function BigOChart() {
  const [n, setN] = useState(16)
  const [sel, setSel] = useState<string | null>('quad')

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap justify-center gap-2">
        {CLASSES.map((c) => (
          <button key={c.key} type="button"
            onClick={() => setSel((s) => (s === c.key ? null : c.key))}
            className={cn('rounded-full border px-3 py-1 font-mono text-xs transition-colors',
              sel === c.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}>
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ background: c.color }} />
            {c.label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full">
        {/* axes */}
        <line x1={PX0} y1={PY0} x2={PX1} y2={PY0} stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1={PX0} y1={PY0} x2={PX0} y2={PY1} stroke="var(--color-border)" strokeWidth="1.5" />
        <text x={(PX0 + PX1) / 2} y={H - 4} textAnchor="middle" fontSize="9" fill="var(--color-muted)">input size n →</text>
        <text x={10} y={(PY0 + PY1) / 2} textAnchor="middle" fontSize="9" fill="var(--color-muted)" transform={`rotate(-90 10 ${(PY0 + PY1) / 2})`}>operations (log) →</text>

        {/* curves */}
        {CLASSES.map((c) => {
          const dim = sel !== null && sel !== c.key
          let d = ''
          for (let i = 0; i <= NMAX; i++) {
            const x = xmap(i)
            const y = ymap(c.f(i))
            d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)} `
          }
          return (
            <g key={c.key} opacity={dim ? 0.18 : 1}>
              <path d={d.trim()} fill="none" stroke={c.color} strokeWidth={sel === c.key ? 3 : 2} />
            </g>
          )
        })}

        {/* n marker */}
        <line x1={xmap(n)} y1={PY0} x2={xmap(n)} y2={PY1} stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="3 3" />
        {CLASSES.map((c) => {
          if (sel !== null && sel !== c.key) return null
          return <circle key={c.key} cx={xmap(n)} cy={ymap(c.f(n))} r="3" fill={c.color} />
        })}
        <text x={xmap(n)} y={PY1 + 2} textAnchor="middle" fontSize="9" fill="var(--color-accent)">n = {n}</text>
      </svg>

      <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {CLASSES.map((c) => {
          const v = c.f(n)
          return (
            <button key={c.key} type="button"
              onClick={() => setSel((s) => (s === c.key ? null : c.key))}
              className={cn('flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-left transition-colors',
                sel === c.key ? 'border-accent bg-accent/10' : 'border-border bg-surface-2 hover:border-accent/50')}>
              <span className="font-mono text-xs" style={{ color: c.color }}>{c.label}</span>
              <span className="font-mono text-xs font-bold text-ink">{fmt(v)}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-4">
        <SceneSlider label="input size n" value={n} min={1} max={NMAX} step={1} unit="" onChange={setN} />
      </div>

      <p className="mt-2 text-center text-xs text-muted">
        At <span className="font-mono text-ink">n = {n}</span>, O(2ⁿ) needs <span className="font-mono text-warn">{fmt(CLASSES[5].f(n))}</span> operations while O(log n) needs about <span className="font-mono text-success">{fmt(CLASSES[1].f(n))}</span>. Same n — wildly different cost.
      </p>
    </div>
  )
}
