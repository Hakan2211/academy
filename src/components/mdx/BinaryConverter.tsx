import { useState } from 'react'
import { BIT_VALUES, byteToBits } from '#/lib/cs'
import { cn } from '#/lib/cn'

// The workhorse for understanding binary numbers. Each of the 8 columns has a
// place value (128, 64, 32, ... 1). Flip bits on to add their place value; the
// decimal total is just the sum of the lit columns. You can also step the
// number up and down and watch the bits change.

export function BinaryConverter() {
  const [value, setValue] = useState(76)
  const bits = byteToBits(value)

  const toggle = (i: number) => {
    const place = BIT_VALUES[i]
    setValue((v) => (bits[i] ? v - place : v + place))
  }

  const litTerms = BIT_VALUES.filter((_, i) => bits[i])

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex justify-center gap-1.5">
        {bits.map((b, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className={cn(
              'flex w-9 flex-col items-center gap-1 rounded-lg border-2 py-2 transition-colors',
              b ? 'border-accent bg-accent/15' : 'border-border bg-surface-2',
            )}
          >
            <span className={cn('font-mono text-xl font-bold', b ? 'text-accent' : 'text-muted')}>{b}</span>
            <span className="text-[9px] font-mono text-muted">{BIT_VALUES[i]}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 text-center">
        <div className="font-mono text-sm text-muted">
          {litTerms.length ? litTerms.join(' + ') : '0'} =
        </div>
        <div className="font-mono text-3xl font-bold text-ink">{value}</div>
        <div className="mt-1 font-mono text-xs text-accent-2">
          binary {byteToBits(value).join('')} · hex {value.toString(16).toUpperCase().padStart(2, '0')}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setValue((v) => Math.max(0, v - 1))}
          className="rounded-lg border border-border px-4 py-1.5 font-mono text-muted hover:text-ink"
        >
          − 1
        </button>
        <button
          type="button"
          onClick={() => setValue(0)}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-ink"
        >
          clear
        </button>
        <button
          type="button"
          onClick={() => setValue((v) => Math.min(255, v + 1))}
          className="rounded-lg border border-border px-4 py-1.5 font-mono text-muted hover:text-ink"
        >
          + 1
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-muted">
        8 bits = 1 <span className="text-ink">byte</span>, holding any value from 0 to 255 (that's 2⁸ = 256 patterns).
      </p>
    </div>
  )
}
