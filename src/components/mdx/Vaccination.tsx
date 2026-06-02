import { useState } from 'react'
import { cn } from '#/lib/cn'

// Why a vaccine works. The first exposure (the vaccine) triggers a slow, small
// antibody response — and leaves memory cells. A later exposure to the real
// pathogen triggers a fast, huge response, so you never get ill.
const X0 = 40
const X1 = 308
const Y0 = 18
const Y1 = 128
const dayX = (d: number) => X0 + (d / 60) * (X1 - X0)
const lvlY = (l: number) => Y1 - l * (Y1 - Y0)

const sq = (x: number) => x * x
// primary: exposure at day 5, slow/small. secondary: exposure at day 35, fast/big.
const primary = (d: number) => (d < 5 ? 0 : Math.exp(-sq((d - 14) / 8)) * 0.35)
const withMemory = (d: number) => primary(d) + (d < 35 ? 0 : Math.exp(-sq((d - 40) / 5)) * 0.95)
const noVaccine = (d: number) => (d < 35 ? 0 : Math.exp(-sq((d - 44) / 8)) * 0.35)

function curve(fn: (d: number) => number) {
  const p: Array<string> = []
  for (let d = 0; d <= 60; d += 1) p.push(`${dayX(d).toFixed(1)},${lvlY(fn(d)).toFixed(1)}`)
  return p.join(' ')
}

export function Vaccination() {
  const [vacc, setVacc] = useState(true)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex gap-2">
        {[true, false].map((v) => (
          <button key={String(v)} type="button" onClick={() => setVacc(v)} className={cn('rounded-full border px-3 py-1 text-sm transition-colors', vacc === v ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}>
            {v ? 'Vaccinated' : 'Not vaccinated'}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 320 150" className="w-full">
        <line x1={X0} y1={Y0} x2={X0} y2={Y1} stroke="var(--color-border)" strokeWidth={1} />
        <line x1={X0} y1={Y1} x2={X1} y2={Y1} stroke="var(--color-border)" strokeWidth={1} />
        <text x={6} y={76} transform="rotate(-90 10 76)" className="fill-muted text-[9px]">antibodies</text>

        {/* exposure markers */}
        {vacc && <line x1={dayX(5)} y1={Y0} x2={dayX(5)} y2={Y1} stroke="#2ECC71" strokeWidth={1} strokeDasharray="2 3" />}
        {vacc && <text x={dayX(5)} y={14} textAnchor="middle" className="fill-[#2ECC71] text-[8px]">vaccine</text>}
        <line x1={dayX(35)} y1={Y0} x2={dayX(35)} y2={Y1} stroke="#E74C3C" strokeWidth={1} strokeDasharray="2 3" />
        <text x={dayX(35)} y={14} textAnchor="middle" className="fill-[#E74C3C] text-[8px]">real pathogen</text>

        {/* curve */}
        <polyline points={curve(vacc ? withMemory : noVaccine)} fill="none" stroke="#0984E3" strokeWidth={2.5} />
        <text x={X1} y={146} textAnchor="end" className="fill-muted text-[8px]">time →</text>
      </svg>

      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        {vacc
          ? 'The vaccine gives a small primary response — but it leaves MEMORY cells. When the real pathogen arrives, the secondary response is fast and huge, destroying it before you feel ill.'
          : 'With no vaccine, the first meeting with the pathogen gives only a slow, small response — so the pathogen has time to make you ill before the antibodies build up.'}
      </p>
    </div>
  )
}
