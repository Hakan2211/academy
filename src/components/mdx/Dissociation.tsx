import { useState } from 'react'
import { cn } from '#/lib/cn'

// "Strong" and "weak" describe how fully an acid splits into ions in water — NOT
// how concentrated it is. A strong acid ionises almost completely; a weak acid
// only partially, leaving most molecules intact.
function rnd(i: number, s: number) {
  const x = Math.sin(i * 9.17 + s * 3.3) * 9999
  return x - Math.floor(x)
}

export function Dissociation() {
  const [strong, setStrong] = useState(true)
  const N = 12
  const ionised = strong ? N : 2 // strong: ~all split; weak: ~few split

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setStrong(true)}
          className={cn('flex-1 rounded-full border px-3 py-1 text-sm transition-colors', strong ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}
        >
          Strong acid (HCl)
        </button>
        <button
          type="button"
          onClick={() => setStrong(false)}
          className={cn('flex-1 rounded-full border px-3 py-1 text-sm transition-colors', !strong ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}
        >
          Weak acid (CH₃COOH)
        </button>
      </div>

      <svg viewBox="0 0 300 150" className="w-full">
        <rect x={1} y={1} width={298} height={148} rx={12} fill="var(--color-surface-2)" stroke="var(--color-border)" />
        {Array.from({ length: N }).map((_, i) => {
          const x = 30 + (i % 4) * 68 + rnd(i, 1) * 16
          const y = 26 + ((i / 4) | 0) * 40 + rnd(i, 2) * 12
          if (i < ionised) {
            // split into H+ and A-
            return (
              <g key={i}>
                <circle cx={x - 8} cy={y} r={7} fill="#E74C3C" />
                <text x={x - 8} y={y + 3} textAnchor="middle" className="fill-white text-[7px] font-bold">H⁺</text>
                <circle cx={x + 10} cy={y} r={9} fill="#5DADE2" />
                <text x={x + 10} y={y + 3} textAnchor="middle" className="fill-white text-[7px] font-bold">A⁻</text>
              </g>
            )
          }
          // intact molecule HA
          return (
            <g key={i}>
              <rect x={x - 12} y={y - 9} width={26} height={18} rx={6} fill="#95A5A6" />
              <text x={x + 1} y={y + 3} textAnchor="middle" className="fill-white text-[8px] font-bold">HA</text>
            </g>
          )
        })}
      </svg>

      <p className="mt-2 min-h-[2.5rem] text-center text-sm text-muted">
        {strong
          ? 'A strong acid ionises almost completely — nearly every molecule splits into H⁺ and A⁻, so [H⁺] is high and the pH is low.'
          : 'A weak acid only partly ionises — most molecules stay intact (HA), so it releases far fewer H⁺ ions at the same concentration.'}
      </p>
    </div>
  )
}
