import { useState } from 'react'
import { cn } from '#/lib/cn'

// Addition is the first real "computation" we build from gates. A 1-bit FULL
// ADDER takes two bits plus a carry-in and produces a sum bit and a carry-out,
// using just two XOR, two AND and one OR gate. Chain four of them and the carry
// "ripples" left — exactly how a computer adds numbers. Flip between the two views.

type Mode = 'ripple' | 'fulladder'
const ON = '#2ECC71'
const OFF = 'var(--color-border)'

function BitBtn({ v, onClick }: { v: number; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'h-8 w-8 rounded-lg border-2 font-mono text-sm font-bold transition-colors',
        v ? 'border-accent bg-accent/15 text-accent' : 'border-border bg-surface-2 text-muted',
        onClick ? 'cursor-pointer' : 'cursor-default',
      )}
    >
      {v}
    </button>
  )
}

export function BinaryAdder() {
  const [mode, setMode] = useState<Mode>('ripple')
  const [a, setA] = useState<Array<number>>([1, 0, 1, 1]) // MSB..LSB
  const [b, setB] = useState<Array<number>>([0, 1, 1, 0])

  // Ripple-carry: process LSB->MSB.
  const carries: Array<number> = [0]
  const sum: Array<number> = []
  for (let i = 3; i >= 0; i--) {
    const cin = carries[carries.length - 1]
    const s = a[i] ^ b[i] ^ cin
    const cout = (a[i] & b[i]) | (a[i] & cin) | (b[i] & cin)
    sum[i] = s
    carries.push(cout)
  }
  const finalCarry = carries[carries.length - 1]
  const aVal = parseInt(a.join(''), 2)
  const bVal = parseInt(b.join(''), 2)

  // Single full adder (uses the LSB inputs + a toggleable carry-in).
  const [cin, setCin] = useState(0)
  const fa0 = a[3], fb0 = b[3]
  const s1 = fa0 ^ fb0
  const faSum = s1 ^ cin
  const faCout = (fa0 & fb0) | (s1 & cin)
  const col = (v: number) => (v ? ON : OFF)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex justify-center gap-2">
        {(['ripple', 'fulladder'] as Array<Mode>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {m === 'ripple' ? '4-bit adder' : '1-bit full adder'}
          </button>
        ))}
      </div>

      {mode === 'ripple' ? (
        <div className="mt-4">
          <div className="mx-auto w-fit font-mono">
            <div className="flex items-center gap-1 text-warn">
              <span className="w-6 text-right text-xs">c</span>
              {carries.slice(0, 4).reverse().map((c, i) => (
                <span key={i} className="flex h-8 w-8 items-center justify-center text-sm">{c}</span>
              ))}
              <span className="w-8" />
            </div>
            <div className="flex items-center gap-1">
              <span className="w-6 text-right text-xs text-muted">A</span>
              {a.map((v, i) => <BitBtn key={i} v={v} onClick={() => setA(a.map((x, j) => (j === i ? x ^ 1 : x)))} />)}
            </div>
            <div className="flex items-center gap-1 border-b border-border pb-1">
              <span className="w-6 text-right text-xs text-muted">+B</span>
              {b.map((v, i) => <BitBtn key={i} v={v} onClick={() => setB(b.map((x, j) => (j === i ? x ^ 1 : x)))} />)}
            </div>
            <div className="flex items-center gap-1 pt-1 text-accent">
              <span className="w-6 text-right text-xs text-muted">=</span>
              <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold', finalCarry ? 'text-warn' : 'text-muted')}>{finalCarry}</span>
              {sum.map((v, i) => <span key={i} className="flex h-8 w-8 items-center justify-center text-sm font-bold">{v}</span>)}
            </div>
          </div>
          <p className="mt-3 text-center text-sm text-muted">
            {aVal} + {bVal} = <span className="font-mono font-bold text-ink">{aVal + bVal}</span>. The orange <span className="text-warn">carry</span> ripples from right to left, just like adding by hand.
          </p>
        </div>
      ) : (
        <div className="mt-2">
          <svg viewBox="0 0 360 190" className="w-full">
            <path d="M30,40 H95" fill="none" stroke={col(fa0)} strokeWidth="3" />
            <path d="M30,70 H95" fill="none" stroke={col(fb0)} strokeWidth="3" />
            <line x1="151" y1="55" x2="200" y2="40" stroke={col(s1)} strokeWidth="3" />
            <path d="M30,150 H180 V70 H200" fill="none" stroke={col(cin)} strokeWidth="3" />
            <line x1="256" y1="50" x2="335" y2="50" stroke={col(faSum)} strokeWidth="3" />
            <line x1="256" y1="120" x2="335" y2="120" stroke={col(faCout)} strokeWidth="3" />
            {[['XOR', 95, 38], ['XOR', 200, 33], ['AND', 200, 100]].map(([l, x, y], i) => (
              <g key={i}>
                <rect x={x as number} y={y as number} width="56" height="34" rx="8" fill="var(--color-surface-2)" stroke="var(--color-accent-2)" strokeWidth="2" />
                <text x={(x as number) + 28} y={(y as number) + 22} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-accent-2)">{l}</text>
              </g>
            ))}
            <g onClick={() => setA(a.map((x, j) => (j === 3 ? x ^ 1 : x)))} style={{ cursor: 'pointer' }}>
              <circle cx="20" cy="40" r="10" fill={fa0 ? ON : 'var(--color-surface-2)'} stroke="var(--color-border)" strokeWidth="2" />
              <text x="20" y="44" textAnchor="middle" fontSize="10" fill={fa0 ? '#0a0f1f' : 'var(--color-muted)'}>{fa0}</text>
            </g>
            <g onClick={() => setB(b.map((x, j) => (j === 3 ? x ^ 1 : x)))} style={{ cursor: 'pointer' }}>
              <circle cx="20" cy="70" r="10" fill={fb0 ? ON : 'var(--color-surface-2)'} stroke="var(--color-border)" strokeWidth="2" />
              <text x="20" y="74" textAnchor="middle" fontSize="10" fill={fb0 ? '#0a0f1f' : 'var(--color-muted)'}>{fb0}</text>
            </g>
            <g onClick={() => setCin(cin ? 0 : 1)} style={{ cursor: 'pointer' }}>
              <circle cx="20" cy="150" r="10" fill={cin ? ON : 'var(--color-surface-2)'} stroke="var(--color-border)" strokeWidth="2" />
              <text x="20" y="154" textAnchor="middle" fontSize="10" fill={cin ? '#0a0f1f' : 'var(--color-muted)'}>{cin}</text>
            </g>
            <text x="345" y="44" textAnchor="end" fontSize="9" fill="var(--color-muted)">Sum {faSum}</text>
            <text x="345" y="135" textAnchor="end" fontSize="9" fill="var(--color-muted)">Carry {faCout}</text>
          </svg>
          <p className="text-center text-xs text-muted">
            Inputs A, B and carry-in (left) → Sum and Carry-out (right). This single block, repeated, builds any adder.
          </p>
        </div>
      )}
    </div>
  )
}
