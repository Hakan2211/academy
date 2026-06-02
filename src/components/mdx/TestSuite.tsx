import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A tiny test suite for a price calculator: applyDiscount(price, percentOff).
// Each test pins down one expected behaviour, including the tricky EDGE CASES
// (zero, full discount, rounding). Hit "Run tests" to check them. Then
// "Introduce a bug" swaps in a broken version — and the tests instantly turn
// red, exactly as they would in real automated testing. Tests catch regressions
// the moment they appear, so you never ship the same mistake twice.

type Case = { price: number; off: number; expected: number; note: string }

const CASES: Array<Case> = [
  { price: 100, off: 20, expected: 80, note: 'a normal discount' },
  { price: 50, off: 0, expected: 50, note: 'edge case: no discount' },
  { price: 80, off: 100, expected: 0, note: 'edge case: fully free' },
  { price: 19.99, off: 10, expected: 17.99, note: 'edge case: rounding' },
  { price: 0, off: 50, expected: 0, note: 'edge case: free item' },
]

// Correct version, then a subtly broken one (forgets the 100 in the percentage,
// so the discount is far too small — a classic off-by-a-factor regression).
function good(price: number, off: number): number {
  return Math.round((price - price * (off / 100)) * 100) / 100
}
function buggy(price: number, off: number): number {
  return Math.round((price - price * off) * 100) / 100
}

type Result = { actual: number; pass: boolean }

export function TestSuite() {
  const [bug, setBug] = useState(false)
  const [results, setResults] = useState<Array<Result> | null>(null)

  const run = () => {
    const fn = bug ? buggy : good
    setResults(CASES.map((c) => {
      const actual = fn(c.price, c.off)
      return { actual, pass: actual === c.expected }
    }))
  }

  const passed = results ? results.filter((r) => r.pass).length : 0

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="rounded-xl border border-border bg-surface-2 p-3 font-mono text-xs leading-relaxed text-ink/90">
        <div className="text-muted">{'// function under test'}</div>
        <div>
          <span className="text-accent">function</span> applyDiscount(price, off) &#123;
        </div>
        <div className="pl-4">
          <span className="text-accent-2">return</span> round(price - price *{' '}
          {bug ? <span className="text-warn">off</span> : <span>(off / 100)</span>}
          {');'}
        </div>
        <div>&#125;</div>
        {bug && <div className="mt-1 text-warn">{'// ⚠ a bug was introduced on this line'}</div>}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={run}
          className="rounded-lg border border-accent bg-accent/15 px-3 py-1.5 text-sm font-semibold text-accent hover:bg-accent/25"
        >
          ▶ Run tests
        </button>
        <button
          type="button"
          onClick={() => { setBug((b) => !b); setResults(null) }}
          className={cn(
            'rounded-lg border px-3 py-1.5 text-sm transition-colors',
            bug ? 'border-warn bg-warn/15 text-warn' : 'border-border text-muted hover:text-ink',
          )}
        >
          {bug ? 'Restore correct code' : 'Introduce a bug'}
        </button>
        {results && (
          <span className={cn('ml-auto text-sm font-semibold', passed === CASES.length ? 'text-success' : 'text-warn')}>
            {passed}/{CASES.length} passing
          </span>
        )}
      </div>

      <div className="mt-3 space-y-1.5">
        {CASES.map((c, i) => {
          const r = results?.[i]
          return (
            <div
              key={i}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors',
                !r ? 'border-border bg-surface-2/40' : r.pass ? 'border-success/40 bg-success/10' : 'border-warn/50 bg-warn/10',
              )}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                {!r ? (
                  <span className="h-2 w-2 rounded-full bg-border" />
                ) : r.pass ? (
                  <Icon name="Check" size={16} className="text-success" />
                ) : (
                  <Icon name="X" size={16} className="text-warn" />
                )}
              </span>
              <code className="text-xs text-ink/90">
                applyDiscount({c.price}, {c.off}) → {c.expected}
              </code>
              <span className="ml-auto text-xs text-muted">
                {r && !r.pass ? <span className="text-warn">got {r.actual}</span> : c.note}
              </span>
            </div>
          )
        })}
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Write the tests once and they run forever. The instant a change breaks an expected behaviour — a{' '}
        <span className="text-ink">regression</span> — the suite turns red before users ever see it.
      </p>
    </div>
  )
}
