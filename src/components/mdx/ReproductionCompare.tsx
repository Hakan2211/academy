import { useState } from 'react'
import { cn } from '#/lib/cn'

// Two ways to make the next generation. Asexual: one parent, identical clones,
// fast. Sexual: two parents, varied offspring, slower. Toggle to compare.
type Mode = 'asexual' | 'sexual'

export function ReproductionCompare() {
  const [mode, setMode] = useState<Mode>('asexual')
  const asex = mode === 'asexual'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex gap-2">
        {(['asexual', 'sexual'] as Array<Mode>).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} className={cn('rounded-full border px-3 py-1 text-sm capitalize transition-colors', mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}>
            {m}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 320 130" className="w-full">
        {asex ? (
          <>
            <circle cx={60} cy={65} r={20} fill="#2ECC71" />
            <text x={60} y={100} textAnchor="middle" className="fill-muted text-[9px]">1 parent</text>
            {[180, 230, 280].map((x, i) => (
              <g key={i}>
                <line x1={84} y1={65} x2={x - 16} y2={i === 0 ? 40 : i === 1 ? 65 : 90} stroke="#64748b" strokeWidth={1.5} />
                <circle cx={x} cy={i === 0 ? 40 : i === 1 ? 65 : 90} r={14} fill="#2ECC71" />
              </g>
            ))}
            <text x={230} y={120} textAnchor="middle" className="fill-muted text-[9px]">identical clones</text>
          </>
        ) : (
          <>
            <circle cx={40} cy={45} r={18} fill="#4F8CFF" />
            <circle cx={40} cy={90} r={18} fill="#E74C3C" />
            <text x={40} y={120} textAnchor="middle" className="fill-muted text-[9px]">2 parents</text>
            {[['#7d6bd0', 40], ['#c0508a', 65], ['#6aa2d0', 90]].map(([c, y], i) => (
              <g key={i}>
                <line x1={150} y1={67} x2={236} y2={y as number} stroke="#64748b" strokeWidth={1} />
                <circle cx={252} cy={y as number} r={13} fill={c as string} />
              </g>
            ))}
            <circle cx={150} cy={67} r={10} fill="#A29BFE" />
            <text x={252} y={120} textAnchor="middle" className="fill-muted text-[9px]">varied offspring</text>
          </>
        )}
      </svg>

      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg border border-success/40 bg-success/10 px-3 py-2">
          <p className="text-xs font-semibold text-success">Advantages</p>
          <p className="text-muted">{asex ? 'Fast, needs only one parent, no mate required — good in a stable environment.' : 'Offspring vary, so the population can adapt to change and disease.'}</p>
        </div>
        <div className="rounded-lg border border-warn/40 bg-warn/10 px-3 py-2">
          <p className="text-xs font-semibold text-warn">Drawbacks</p>
          <p className="text-muted">{asex ? 'No variation — if conditions change or a disease strikes, all the identical clones are vulnerable.' : 'Slower, needs two parents, and costs time and energy to find a mate.'}</p>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        {asex ? 'Used by bacteria, many plants (runners, bulbs), and some animals.' : 'Used by most animals and plants — gametes from two parents combine.'}
      </p>
    </div>
  )
}
