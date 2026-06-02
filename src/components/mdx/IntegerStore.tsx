import { useState } from 'react'
import { byteToBits } from '#/lib/cs'
import { cn } from '#/lib/cn'

// How do you store a negative number with only 0s and 1s? The trick is two's
// complement: the leftmost bit's place value is made NEGATIVE (−128). Then the
// same 8 bits represent either 0…255 (unsigned) or −128…127 (signed), depending
// only on how you agree to read them.

type Mode = 'unsigned' | 'signed'

export function IntegerStore() {
  const [raw, setRaw] = useState(210)
  const [mode, setMode] = useState<Mode>('unsigned')
  const bits = byteToBits(raw)

  const places = [mode === 'signed' ? -128 : 128, 64, 32, 16, 8, 4, 2, 1]
  const value = bits.reduce<number>((acc, b, i) => acc + b * places[i], 0)
  const range = mode === 'signed' ? '−128 to +127' : '0 to 255'

  const toggle = (i: number) => {
    const bit = 1 << (7 - i)
    setRaw((v) => v ^ bit)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex justify-center gap-2">
        {(['unsigned', 'signed'] as Array<Mode>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {m === 'signed' ? "signed (two's complement)" : 'unsigned'}
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
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
            <span className={cn('text-[9px] font-mono', i === 0 && mode === 'signed' ? 'text-warn' : 'text-muted')}>{places[i]}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 text-center">
        <div className="text-xs text-muted">Read as {mode}</div>
        <div className="font-mono text-3xl font-bold text-ink">{value}</div>
        <div className="mt-1 text-xs text-muted">Same 8 bits, range <span className="font-mono text-accent-2">{range}</span></div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        In <span className="text-ink">signed</span> mode the top bit is the sign: 1 there means the value is negative, because its place value is −128.
      </p>
    </div>
  )
}
