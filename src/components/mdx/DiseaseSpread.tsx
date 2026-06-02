import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { SceneSlider } from '#/components/three/SceneSlider'

// A simple epidemic. One infected person spreads a disease to neighbours; the
// infected recover (and become immune). Vaccinate enough people and the spread
// is blocked — herd immunity.
const COLS = 10
const ROWS = 6
const N = COLS * ROWS
type S = 'S' | 'I' | 'R' | 'V'
type Cell = { s: S; d: number }

const COLOR: Record<S, string> = { S: '#475569', I: '#E74C3C', R: '#2ECC71', V: '#4F8CFF' }

function neighbours(i: number): Array<number> {
  const r = Math.floor(i / COLS)
  const c = i % COLS
  const out: Array<number> = []
  if (r > 0) out.push(i - COLS)
  if (r < ROWS - 1) out.push(i + COLS)
  if (c > 0) out.push(i - 1)
  if (c < COLS - 1) out.push(i + 1)
  return out
}

function init(vaccPct: number): Array<Cell> {
  const g: Array<Cell> = Array.from({ length: N }, () => ({ s: Math.random() * 100 < vaccPct ? 'V' : 'S', d: 0 }))
  // patient zero: a susceptible near the middle
  const start = Math.floor(N / 2) + 2
  g[start] = { s: 'I', d: 0 }
  return g
}

export function DiseaseSpread() {
  const [vacc, setVacc] = useState(0)
  const [grid, setGrid] = useState<Array<Cell>>(() => init(0))
  const [day, setDay] = useState(0)

  const reset = (v: number) => {
    setGrid(init(v))
    setDay(0)
  }

  const next = () => {
    const out = grid.map((c) => ({ ...c }))
    grid.forEach((c, i) => {
      if (c.s === 'I') {
        if (c.d >= 2) out[i].s = 'R'
        else out[i].d = c.d + 1
      }
    })
    grid.forEach((c, i) => {
      if (c.s === 'S' && neighbours(i).some((j) => grid[j].s === 'I') && Math.random() < 0.5) {
        out[i] = { s: 'I', d: 0 }
      }
    })
    setGrid(out)
    setDay((d) => d + 1)
  }

  const count = (s: S) => grid.filter((c) => c.s === s).length
  const infected = count('I')
  const everInfected = count('I') + count('R')

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {grid.map((c, i) => (
          <span key={i} className="aspect-square rounded-sm transition-colors" style={{ background: COLOR[c.s] }} />
        ))}
      </div>

      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px]">
        {(['S', 'I', 'R', 'V'] as Array<S>).map((s) => (
          <span key={s} className="flex items-center gap-1 text-muted">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: COLOR[s] }} />
            {s === 'S' ? 'healthy' : s === 'I' ? 'infected' : s === 'R' ? 'recovered' : 'vaccinated'}: {count(s)}
          </span>
        ))}
      </div>

      <p className="my-2 text-center text-sm text-muted">
        {day === 0 ? `Day 0 — one infected person. ${vacc}% vaccinated.` : infected === 0 ? `Day ${day}: outbreak over — ${everInfected} people were infected in total.` : `Day ${day}: ${infected} currently infected and spreading.`}
        {vacc >= 60 && day > 0 && infected === 0 && everInfected < N * 0.3 && ' Herd immunity stopped it early!'}
      </p>

      <div className="mb-3 flex justify-center gap-2">
        <button type="button" onClick={next} disabled={infected === 0} className="flex items-center gap-1.5 rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm text-accent enabled:hover:bg-accent/25 disabled:opacity-40">
          <Icon name="FastForward" size={14} /> Next day
        </button>
        <button type="button" onClick={() => reset(vacc)} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted hover:text-ink">
          <Icon name="RotateCcw" size={14} /> Reset
        </button>
      </div>

      <SceneSlider label="Vaccinated before outbreak" value={vacc} min={0} max={85} step={5} unit="%" onChange={(v) => { setVacc(v); reset(v) }} />
    </div>
  )
}
