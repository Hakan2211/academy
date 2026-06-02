import { useState } from 'react'

// Sieve of Eratosthenes on 1–100. Cross out the multiples of each prime in turn;
// because every composite below 100 has a factor ≤ √100 = 10, once you've sieved
// 2, 3, 5 and 7, every number still standing is prime. Reused in the deep-dive.
const NUMS = Array.from({ length: 100 }, (_, i) => i + 1)
const SIEVE_PRIMES = [2, 3, 5, 7]

export function PrimeSieve() {
  const [crossed, setCrossed] = useState<Set<number>>(() => new Set([1]))
  const [used, setUsed] = useState<Set<number>>(() => new Set())

  const crossMultiples = (p: number) => {
    setCrossed((prev) => {
      const next = new Set(prev)
      for (let k = 2 * p; k <= 100; k += p) next.add(k)
      return next
    })
    setUsed((prev) => new Set(prev).add(p))
  }
  const reset = () => {
    setCrossed(new Set([1]))
    setUsed(new Set())
  }

  const primesLeft = NUMS.filter((n) => n > 1 && !crossed.has(n))

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mx-auto grid max-w-md grid-cols-10 gap-[3px]">
        {NUMS.map((n) => {
          const isCrossed = crossed.has(n)
          return (
            <div
              key={n}
              className={`flex aspect-square items-center justify-center rounded text-[10px] font-semibold sm:text-xs ${
                n === 1
                  ? 'bg-surface-2 text-muted'
                  : isCrossed
                    ? 'bg-surface-2 text-muted line-through opacity-50'
                    : 'bg-accent/20 text-accent ring-1 ring-accent/40'
              }`}
            >
              {n}
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {SIEVE_PRIMES.map((p) => (
          <button
            key={p}
            onClick={() => crossMultiples(p)}
            disabled={used.has(p)}
            className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted transition enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-40"
          >
            Cross multiples of {p}
          </button>
        ))}
        <button onClick={reset} className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted transition hover:border-accent">
          Reset
        </button>
      </div>

      <p className="mt-3 text-center text-sm text-muted">
        {used.size === 0 ? (
          'Cross out 1 (not prime), then sieve the multiples of 2, 3, 5, 7.'
        ) : (
          <>
            <span className="font-semibold text-accent">{primesLeft.length}</span> numbers still standing
            {used.size >= SIEVE_PRIMES.length && (
              <span className="text-success"> — and every one of them is prime.</span>
            )}
          </>
        )}
      </p>
    </div>
  )
}
