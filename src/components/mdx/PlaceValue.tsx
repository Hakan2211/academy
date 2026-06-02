import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'

// Place-value chart. Build a number digit by digit and watch its value and
// expanded form update. The ×10 / ÷10 buttons shift every digit one column —
// the heart of why multiplying by ten "adds a zero". Reused in number-sense
// (place value + mental arithmetic).
const COLS = [
  { label: 'Thousands', value: 1000 },
  { label: 'Hundreds', value: 100 },
  { label: 'Tens', value: 10 },
  { label: 'Ones', value: 1 },
  { label: 'Tenths', value: 0.1 },
  { label: 'Hundredths', value: 0.01 },
]

export function PlaceValue() {
  // digits index-aligned with COLS
  const [digits, setDigits] = useState<Array<number>>([3, 2, 0, 4, 5, 0])

  const total = digits.reduce((s, d, i) => s + d * COLS[i].value, 0)
  const bump = (i: number, dir: number) =>
    setDigits((ds) => ds.map((d, j) => (j === i ? (d + dir + 10) % 10 : d)))

  const shift = (dir: 'left' | 'right') =>
    setDigits((ds) => {
      if (dir === 'left') return [...ds.slice(1), 0] // ×10
      return [0, ...ds.slice(0, -1)] // ÷10
    })

  const parts = digits
    .map((d, i) => ({ d, i }))
    .filter((p) => p.d !== 0)
    .map((p) => +(p.d * COLS[p.i].value).toFixed(2))

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex justify-center gap-1 sm:gap-2">
        {COLS.map((c, i) => (
          <div key={c.label} className="flex flex-col items-center">
            {i === 4 && <div className="self-stretch" />}
            <button
              onClick={() => bump(i, 1)}
              className="text-muted transition hover:text-accent"
              aria-label={`increase ${c.label}`}
            >
              <Icon name="ChevronUp" size={18} />
            </button>
            <div
              className={`flex h-12 w-9 items-center justify-center rounded-lg border text-2xl font-bold sm:w-11 ${
                i < 4
                  ? 'border-accent/40 bg-accent/10 text-ink'
                  : 'border-accent-2/40 bg-accent-2/10 text-ink'
              }`}
            >
              {digits[i]}
            </div>
            <button
              onClick={() => bump(i, -1)}
              className="text-muted transition hover:text-accent"
              aria-label={`decrease ${c.label}`}
            >
              <Icon name="ChevronDown" size={18} />
            </button>
            <span className="mt-1 max-w-[3rem] text-center text-[9px] leading-tight text-muted">
              {c.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 text-center">
        <div className="font-mono text-3xl font-bold text-accent">
          {total.toLocaleString('en-US', { maximumFractionDigits: 2 })}
        </div>
        <div className="mt-1 text-sm text-muted">
          {parts.length ? parts.join(' + ') : '0'}
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-2">
        <button
          onClick={() => shift('right')}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition hover:border-accent hover:text-accent"
        >
          ÷ 10
        </button>
        <button
          onClick={() => shift('left')}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition hover:border-accent hover:text-accent"
        >
          × 10
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        Multiplying by 10 shifts every digit one place to the left — the digits move, not the decimal point.
      </p>
    </div>
  )
}
