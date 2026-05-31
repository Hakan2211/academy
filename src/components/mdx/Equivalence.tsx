import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

type Mode = 'gravity' | 'rocket'

const BX0 = 116
const BX1 = 284
const BTOP = 34
const BFLOOR = 176
const PER = 1700 // ball drop period
const PER2 = 2400 // light crossing period

// Einstein's "happiest thought": stand in a windowless box and you cannot tell
// whether it's sitting on a planet's surface or accelerating through deep space.
// A dropped ball falls the same way; a beam of light bends the same way. Gravity
// and acceleration are locally identical — the founding idea of general relativity.
export function Equivalence() {
  const [mode, setMode] = useState<Mode>('gravity')
  const ballRef = useRef<SVGCircleElement>(null)
  const lightRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    let raf = 0
    let start = 0
    const loop = (now: number) => {
      if (!start) start = now
      const t = now - start
      const p = (t % PER) / PER
      const by = BTOP + 24 + (BFLOOR - (BTOP + 24)) * (p * p) // accelerating fall
      ballRef.current?.setAttribute('cy', by.toFixed(1))
      const q = (t % PER2) / PER2
      const lx = BX0 + q * (BX1 - BX0)
      const ly = 70 + 0.0019 * (lx - BX0) * (lx - BX0) // light curves downward
      lightRef.current?.setAttribute('cx', lx.toFixed(1))
      lightRef.current?.setAttribute('cy', ly.toFixed(1))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // faint light path
  let lpath = ''
  for (let i = 0; i <= 20; i++) {
    const lx = BX0 + (i / 20) * (BX1 - BX0)
    const ly = 70 + 0.0019 * (lx - BX0) * (lx - BX0)
    lpath += `${i === 0 ? 'M' : 'L'}${lx.toFixed(1)},${ly.toFixed(1)} `
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {([['gravity', 'On Earth (gravity)'], ['rocket', 'Accelerating rocket']] as Array<[Mode, string]>).map(
          ([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setMode(k)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                mode === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
              )}
            >
              {label}
            </button>
          ),
        )}
      </div>

      <svg viewBox="0 0 400 210" className="w-full">
        {/* the sealed box */}
        <rect x={BX0} y={BTOP} width={BX1 - BX0} height={BFLOOR - BTOP} rx="6" fill="var(--color-surface-2)" stroke="var(--color-ink)" strokeWidth="2" />
        <line x1={BX0} y1={BFLOOR} x2={BX1} y2={BFLOOR} stroke="var(--color-ink)" strokeWidth="3" />

        {/* light path + photon */}
        <path d={lpath.trim()} fill="none" stroke="#fdcb6e" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
        <circle ref={lightRef} cx={BX0} cy="70" r="4" fill="#fdcb6e" />
        {/* falling ball */}
        <circle ref={ballRef} cx={(BX0 + BX1) / 2} cy={BTOP + 24} r="9" fill="var(--color-accent)" />

        {mode === 'gravity' ? (
          <>
            {/* planet ground + gravity arrow */}
            <rect x="20" y="188" width="360" height="14" fill="var(--color-border)" opacity="0.5" />
            <text x="64" y="120" fill="var(--color-muted)" fontSize="12" textAnchor="middle">g ↓</text>
            <line x1="64" y1="80" x2="64" y2="150" stroke="var(--color-muted)" strokeWidth="2" />
            <path d="M 64 150 l -5 -8 l 10 0 z" fill="var(--color-muted)" />
            <text x="340" y="120" fill="var(--color-muted)" fontSize="12" textAnchor="middle">g ↓</text>
            <line x1="340" y1="80" x2="340" y2="150" stroke="var(--color-muted)" strokeWidth="2" />
            <path d="M 340 150 l -5 -8 l 10 0 z" fill="var(--color-muted)" />
          </>
        ) : (
          <>
            {/* rocket thrust + acceleration arrow */}
            <text x="64" y="96" fill="var(--color-muted)" fontSize="12" textAnchor="middle">a ↑</text>
            <line x1="64" y1="150" x2="64" y2="80" stroke="var(--color-muted)" strokeWidth="2" />
            <path d="M 64 80 l -5 8 l 10 0 z" fill="var(--color-muted)" />
            <path d={`M ${BX0 + 20} ${BFLOOR} l 12 26 l 12 -26 z`} fill="#e17055" opacity="0.8" />
            <path d={`M ${BX1 - 44} ${BFLOOR} l 12 26 l 12 -26 z`} fill="#e17055" opacity="0.8" />
          </>
        )}
      </svg>

      <p className="px-4 pb-4 pt-1 text-center text-xs text-muted">
        The ball falls and the light bends in exactly the same way in both boxes. No experiment inside the sealed box can tell gravity from acceleration — they are equivalent.
      </p>
    </div>
  )
}
