import { useState } from 'react'
import { cn } from '#/lib/cn'

// SQL is DECLARATIVE: you describe WHAT data you want, not how to fetch it. Build
// a query by picking columns (SELECT), a condition (WHERE) and a sort (ORDER BY),
// and watch the result set update live. The engine figures out the "how"; you
// just state the question. Notice the generated SQL above the answer.

type Movie = {
  title: string
  year: number
  genre: string
  rating: number
}

const MOVIES: Array<Movie> = [
  { title: 'Stellar Drift', year: 2019, genre: 'Sci-Fi', rating: 8.4 },
  { title: 'The Quiet Coast', year: 2021, genre: 'Drama', rating: 7.9 },
  { title: 'Neon Circuit', year: 2023, genre: 'Sci-Fi', rating: 7.1 },
  { title: 'Last Harvest', year: 2018, genre: 'Drama', rating: 8.8 },
  { title: 'Midnight Lab', year: 2022, genre: 'Sci-Fi', rating: 6.5 },
  { title: 'River of Glass', year: 2020, genre: 'Drama', rating: 7.4 },
]

type Col = 'title' | 'year' | 'genre' | 'rating'
const COLS: Array<Col> = ['title', 'year', 'genre', 'rating']

type Where = 'none' | 'scifi' | 'good' | 'recent'
const WHERES: Array<{ key: Where; clause: string }> = [
  { key: 'none', clause: '' },
  { key: 'scifi', clause: "genre = 'Sci-Fi'" },
  { key: 'good', clause: 'rating >= 8.0' },
  { key: 'recent', clause: 'year >= 2021' },
]

function keep(m: Movie, w: Where): boolean {
  if (w === 'scifi') return m.genre === 'Sci-Fi'
  if (w === 'good') return m.rating >= 8.0
  if (w === 'recent') return m.year >= 2021
  return true
}

export function SqlQuery() {
  const [cols, setCols] = useState<Array<Col>>(['title', 'year', 'rating'])
  const [where, setWhere] = useState<Where>('scifi')
  const [orderDesc, setOrderDesc] = useState(true)

  const selected = COLS.filter((c) => cols.includes(c))
  const selectList = selected.length ? selected.join(', ') : '*'
  const clause = WHERES.find((w) => w.key === where)?.clause ?? ''

  const rows = MOVIES.filter((m) => keep(m, where)).sort((a, b) =>
    orderDesc ? b.rating - a.rating : a.rating - b.rating,
  )

  const toggleCol = (c: Col) =>
    setCols((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="space-y-2 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-16 text-xs text-muted">SELECT</span>
          {COLS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleCol(c)}
              className={cn(
                'rounded-full border px-2.5 py-0.5 font-mono text-xs transition-colors',
                cols.includes(c) ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-16 text-xs text-muted">WHERE</span>
          {WHERES.map((w) => (
            <button
              key={w.key}
              type="button"
              onClick={() => setWhere(w.key)}
              className={cn(
                'rounded-full border px-2.5 py-0.5 font-mono text-xs transition-colors',
                where === w.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
              )}
            >
              {w.clause || '(all)'}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-16 text-xs text-muted">ORDER BY</span>
          <button
            type="button"
            onClick={() => setOrderDesc((d) => !d)}
            className="rounded-full border border-accent bg-accent/15 px-2.5 py-0.5 font-mono text-xs text-accent"
          >
            rating {orderDesc ? 'DESC' : 'ASC'}
          </button>
        </div>
      </div>

      <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-surface-2 p-3 font-mono text-xs leading-relaxed text-ink">
        <span className="text-accent">SELECT</span> {selectList}
        {'\n'}
        <span className="text-accent">FROM</span> movies
        {clause && (
          <>
            {'\n'}
            <span className="text-accent">WHERE</span> {clause}
          </>
        )}
        {'\n'}
        <span className="text-accent">ORDER BY</span> rating {orderDesc ? 'DESC' : 'ASC'}
        <span className="text-muted">;</span>
      </pre>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[360px] text-left text-sm">
          <thead>
            <tr className="text-xs text-muted">
              {selected.map((c) => (
                <th key={c} className="px-2 py-1.5 font-mono font-normal text-accent-2">
                  {c}
                </th>
              ))}
              {selected.length === 0 && <th className="px-2 py-1.5 font-normal">(pick a column)</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.title} className="border-t border-border">
                {selected.map((c) => (
                  <td key={c} className="px-2 py-1.5 text-ink">
                    {c === 'rating' ? m.rating.toFixed(1) : m[c]}
                  </td>
                ))}
                {selected.length === 0 && <td className="px-2 py-1.5 text-muted">—</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        You described <span className="text-ink">what</span> you wanted — columns, a condition, an order — and the engine returned{' '}
        <span className="font-mono text-ink">{rows.length}</span> rows. That declarative style is the heart of SQL.
      </p>
    </div>
  )
}
