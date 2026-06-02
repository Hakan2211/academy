import { useState } from 'react'

// Completing the square, geometrically. x² + bx is an x-square plus an x-by-b
// strip; split the strip in two and wrap it round the square to ALMOST make a
// bigger square of side (x + b/2) — short by a (b/2)² corner. Used in
// completing-the-square.
export function CompleteSquare() {
  const [b, setB] = useState(6)
  const half = b / 2
  const corner = half * half
  // fixed display proportions: x portion vs b/2 portion
  const xs = 90
  const hs = 44
  const S = xs + hs

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex justify-center">
        <svg viewBox={`0 0 ${S + 30} ${S + 24}`} className="max-w-[220px]" style={{ width: S + 30 }}>
          {/* x² */}
          <rect x={14} y={10} width={xs} height={xs} fill="var(--color-accent)" fillOpacity="0.22" stroke="var(--color-accent)" />
          <text x={14 + xs / 2} y={10 + xs / 2 + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-accent)">x²</text>
          {/* right strip (b/2)·x */}
          <rect x={14 + xs} y={10} width={hs} height={xs} fill="var(--color-accent-2)" fillOpacity="0.22" stroke="var(--color-accent-2)" />
          <text x={14 + xs + hs / 2} y={10 + xs / 2} textAnchor="middle" fontSize="9" fill="var(--color-accent-2)">{half}x</text>
          {/* bottom strip */}
          <rect x={14} y={10 + xs} width={xs} height={hs} fill="var(--color-accent-2)" fillOpacity="0.22" stroke="var(--color-accent-2)" />
          <text x={14 + xs / 2} y={10 + xs + hs / 2 + 3} textAnchor="middle" fontSize="9" fill="var(--color-accent-2)">{half}x</text>
          {/* missing corner */}
          <rect x={14 + xs} y={10 + xs} width={hs} height={hs} fill="none" stroke="var(--color-muted)" strokeDasharray="3 3" />
          <text x={14 + xs + hs / 2} y={10 + xs + hs / 2 + 3} textAnchor="middle" fontSize="9" fill="var(--color-muted)">{corner}</text>
          <text x={14 + S / 2} y={S + 22} textAnchor="middle" fontSize="9" fill="var(--color-muted)">side = x + {half}</text>
        </svg>
      </div>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">b</span>
          <input type="range" min={2} max={10} step={2} value={b} onChange={(e) => setB(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{b}</span>
        </label>
      </div>

      <p className="mt-2 text-center font-mono text-sm">
        x² + {b}x = (x + {half})² − {corner}
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        Half the x-coefficient ({half}) becomes the side added; its square ({corner}) is the corner you must subtract back.
      </p>
    </div>
  )
}
