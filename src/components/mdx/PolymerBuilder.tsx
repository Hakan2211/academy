import { useState } from 'react'

// Polymers are giant molecules built by linking many small repeating units
// (monomers). In addition polymerisation, the C=C double bond of a monomer like
// ethene opens up and joins to the next — building a long chain. Add monomers.
export function PolymerBuilder() {
  const [n, setN] = useState(4)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* monomer */}
      <p className="mb-1 text-center text-xs text-muted">monomer: ethene (C₂H₄)</p>
      <svg viewBox="0 0 120 40" className="mx-auto block h-10">
        <circle cx={45} cy={20} r={12} fill="#34404F" />
        <circle cx={75} cy={20} r={12} fill="#34404F" />
        <line x1={57} y1={16} x2={63} y2={16} stroke="var(--color-ink)" strokeWidth={2} />
        <line x1={57} y1={24} x2={63} y2={24} stroke="var(--color-ink)" strokeWidth={2} />
        <text x={45} y={24} textAnchor="middle" className="fill-white text-[9px] font-bold">C</text>
        <text x={75} y={24} textAnchor="middle" className="fill-white text-[9px] font-bold">C</text>
      </svg>

      <p className="my-1 text-center text-accent">↓ polymerise</p>

      {/* polymer chain */}
      <svg viewBox="0 0 320 70" className="w-full">
        {Array.from({ length: n }).map((_, i) => {
          const x = 30 + i * (260 / n)
          const w = 260 / n
          return (
            <g key={i}>
              {/* link to previous */}
              {i > 0 && <line x1={x - w + 26} y1={35} x2={x + 2} y2={35} stroke="var(--color-ink)" strokeWidth={2} />}
              <circle cx={x + 8} cy={35} r={9} fill="#34404F" />
              <circle cx={x + 24} cy={35} r={9} fill="#34404F" />
              <line x1={x + 14} y1={35} x2={x + 18} y2={35} stroke="var(--color-ink)" strokeWidth={2} />
            </g>
          )
        })}
        {/* brackets */}
        <text x={14} y={40} className="fill-muted text-[16px]">[</text>
        <text x={296} y={40} className="fill-muted text-[16px]">]</text>
        <text x={304} y={48} className="fill-muted text-[10px]">ₙ</text>
      </svg>

      <p className="my-2 text-center text-sm text-muted">
        {n} units linked — and a real chain has <span className="text-ink">thousands</span>. Many ethene monomers become{' '}
        <span className="text-ink">poly(ethene)</span> — the plastic in bags and bottles.
      </p>

      <label className="flex flex-col gap-1 text-sm">
        <span className="flex items-center justify-between text-muted">
          <span>Monomers linked</span>
          <span className="font-mono text-ink">{n}</span>
        </span>
        <input type="range" min={1} max={8} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} className="accent-accent" />
      </label>
    </div>
  )
}
