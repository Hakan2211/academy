import { useEffect, useRef, useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A Skinner box. The rat presses a lever; YOU choose what follows. Reinforcement
// (give a treat / remove a shock) makes pressing MORE likely, so the response
// rate climbs; punishment (give a shock / take away the treat) makes it LESS
// likely, so the rate falls. A live rate meter and a cumulative count rise/fall
// over presses. The meter animates via rAF; press bookkeeping is React state.

type Consequence = 'posReinf' | 'negReinf' | 'posPun' | 'negPun'

const OPTIONS: Array<{ key: Consequence; label: string; icon: string; delta: number; blurb: string }> = [
  { key: 'posReinf', label: 'Give treat', icon: 'Cookie', delta: +0.16, blurb: 'Positive reinforcement: a pleasant treat is ADDED. Pressing pays off, so the rate climbs.' },
  { key: 'negReinf', label: 'Stop shock', icon: 'ShieldCheck', delta: +0.16, blurb: 'Negative reinforcement: an unpleasant shock is REMOVED. Relief rewards pressing, so the rate climbs.' },
  { key: 'posPun', label: 'Give shock', icon: 'Zap', delta: -0.2, blurb: 'Positive punishment: an unpleasant shock is ADDED. Pressing hurts, so the rate falls.' },
  { key: 'negPun', label: 'Take treat', icon: 'Ban', delta: -0.2, blurb: 'Negative punishment: a pleasant treat is REMOVED. Pressing costs, so the rate falls.' },
]

export function OperantBox() {
  const [consequence, setConsequence] = useState<Consequence>('posReinf')
  const [rate, setRate] = useState(0.4) // probability the rat presses, 0..1
  const [presses, setPresses] = useState(0)

  // visible meter animates toward `rate`
  const target = useRef(rate)
  const fillRef = useRef<SVGRectElement>(null)
  const pctRef = useRef<SVGTextElement>(null)
  const leverRef = useRef<SVGGElement>(null)

  useEffect(() => { target.current = rate }, [rate])

  useEffect(() => {
    let shown = rate
    let raf = 0
    const loop = () => {
      shown += (target.current - shown) * 0.1
      const w = 200 * shown
      if (fillRef.current) fillRef.current.setAttribute('width', w.toFixed(1))
      if (pctRef.current) pctRef.current.textContent = `${Math.round(shown * 100)}%`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const current = OPTIONS.find((o) => o.key === consequence)!

  const press = () => {
    setPresses((p) => p + 1)
    setRate((r) => Math.max(0.02, Math.min(1, r + current.delta * (current.delta > 0 ? 1 - r : r + 0.2))))
    // tiny lever wiggle
    const g = leverRef.current
    if (g) {
      g.setAttribute('transform', 'translate(150 96) rotate(14)')
      window.setTimeout(() => g.setAttribute('transform', 'translate(150 96) rotate(0)'), 120)
    }
  }

  const reset = () => {
    setRate(0.4)
    setPresses(0)
    target.current = 0.4
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 300 200" className="w-full max-w-[360px]">
        {/* box */}
        <rect x="16" y="20" width="268" height="160" rx="10" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2" />
        {/* floor grid (shock plate) */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={26 + i * 21} y1={162} x2={26 + i * 21} y2={176} stroke="var(--color-border)" strokeWidth="1" opacity="0.6" />
        ))}

        {/* rat */}
        <g transform="translate(60 120)">
          <ellipse cx="22" cy="34" rx="34" ry="18" fill="#9b8579" />
          <circle cx="52" cy="24" r="12" fill="#9b8579" />
          <circle cx="48" cy="16" r="5" fill="#8a766b" />
          <circle cx="56" cy="22" r="1.8" fill="#1a1a1a" />
          <path d="M-10 34 Q-34 30 -40 44" fill="none" stroke="#9b8579" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* lever */}
        <g ref={leverRef} transform="translate(150 96) rotate(0)">
          <rect x="0" y="-4" width="46" height="8" rx="3" fill="var(--color-accent)" />
          <circle cx="0" cy="0" r="4" fill="var(--color-muted)" />
        </g>

        {/* food chute */}
        <rect x="244" y="120" width="26" height="40" rx="3" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />
      </svg>

      {/* rate meter */}
      <div className="px-4">
        <div className="mb-1 flex items-center justify-between text-xs text-muted">
          <span>response rate (likelihood of pressing)</span>
          <span>{presses} presses</span>
        </div>
        <svg viewBox="0 0 240 30" className="w-full">
          <rect x="2" y="6" width="200" height="18" rx="6" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1" />
          <rect ref={fillRef} x="2" y="6" width="80" height="18" rx="6" fill="var(--color-accent)" />
          <text ref={pctRef} x="214" y="20" fill="var(--color-ink)" fontSize="13" fontWeight="700">40%</text>
        </svg>
      </div>

      {/* consequence chooser */}
      <div className="grid grid-cols-2 gap-2 px-4 pt-3 sm:grid-cols-4">
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => setConsequence(o.key)}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-full border px-2 py-1.5 text-xs transition-colors',
              consequence === o.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={o.icon} size={14} /> {o.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 px-4 pt-3">
        <button
          type="button"
          onClick={press}
          className="flex-1 rounded-full border border-accent bg-accent/15 px-4 py-2 text-sm font-medium text-accent"
        >
          Lever press → {current.label.toLowerCase()}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-border px-3 py-2 text-sm text-muted hover:text-ink"
        >
          Reset
        </button>
      </div>

      <p className="px-4 pb-4 pt-3 text-sm leading-snug text-muted">{current.blurb}</p>
    </div>
  )
}
