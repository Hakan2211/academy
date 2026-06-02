import { useState } from 'react'

// The same categorical data as a bar chart and a pie chart. Bars compare sizes;
// pies show shares of a whole. Used in displaying-data.
const DATA = [
  { label: 'Bus', value: 12, color: '#4F8CFF' },
  { label: 'Walk', value: 8, color: '#00D2D3' },
  { label: 'Car', value: 6, color: '#FFB020' },
  { label: 'Bike', value: 4, color: '#2ECC71' },
]
const TOTAL = DATA.reduce((s, d) => s + d.value, 0)

export function BarPieChart() {
  const [view, setView] = useState<'bar' | 'pie'>('bar')
  const max = Math.max(...DATA.map((d) => d.value))

  // pie slices
  let acc = 0
  const slices = DATA.map((d) => {
    const start = (acc / TOTAL) * 2 * Math.PI
    acc += d.value
    const end = (acc / TOTAL) * 2 * Math.PI
    const large = end - start > Math.PI ? 1 : 0
    const r = 70
    const cx = 100
    const cy = 90
    const x1 = cx + r * Math.cos(start - Math.PI / 2)
    const y1 = cy + r * Math.sin(start - Math.PI / 2)
    const x2 = cx + r * Math.cos(end - Math.PI / 2)
    const y2 = cy + r * Math.sin(end - Math.PI / 2)
    return { d, path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z` }
  })

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex justify-center gap-2">
        <button onClick={() => setView('bar')} className={`rounded-lg border px-3 py-1 text-xs transition ${view === 'bar' ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>Bar chart</button>
        <button onClick={() => setView('pie')} className={`rounded-lg border px-3 py-1 text-xs transition ${view === 'pie' ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>Pie chart</button>
      </div>

      {view === 'bar' ? (
        <div className="flex h-40 items-end justify-center gap-4 px-4">
          {DATA.map((d) => (
            <div key={d.label} className="flex flex-1 flex-col items-center">
              <span className="mb-1 font-mono text-xs text-ink">{d.value}</span>
              <div className="w-full rounded-t" style={{ height: `${(d.value / max) * 120}px`, background: d.color }} />
              <span className="mt-1 text-[10px] text-muted">{d.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-4">
          <svg viewBox="0 0 200 180" className="w-44">
            {slices.map((s) => (
              <path key={s.d.label} d={s.path} fill={s.d.color} fillOpacity="0.85" stroke="var(--color-surface)" strokeWidth="1.5" />
            ))}
          </svg>
          <div className="space-y-1 text-xs">
            {DATA.map((d) => (
              <div key={d.label} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm" style={{ background: d.color }} />
                <span className="text-muted">{d.label} — {Math.round((d.value / TOTAL) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-2 text-center text-xs text-muted">
        Bar charts compare <strong>amounts</strong>; pie charts show <strong>proportions</strong> of a whole (each slice's angle = its share of 360°).
      </p>
    </div>
  )
}
