import { useEffect, useRef, useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Interactive Pavlov. Ring the bell, present food, or — the key move — pair them
// (bell then food). Over paired trials the bell alone comes to trigger
// salivation: the association transfers from the food (UCS) to the bell (CS).
// An acquisition curve tracks the bell's growing power; an extinction phase lets
// you ring the bell with NO food and watch the response fade. The dog's drool
// meter animates via rAF; trial bookkeeping is plain React state.

// graph geometry
const GX0 = 250
const GX1 = 440
const GY_TOP = 30
const GY_BASE = 168
const GH = GY_BASE - GY_TOP
const MAX_TRIALS = 14

type Phase = 'acquisition' | 'extinction'

export function ClassicalConditioning() {
  // strength of the bell -> salivation association, 0..1
  const [csStrength, setCsStrength] = useState(0)
  const [trials, setTrials] = useState<Array<number>>([]) // bell-alone response per trial
  const [phase, setPhase] = useState<Phase>('acquisition')
  const [last, setLast] = useState<string>('Present food, ring the bell, or pair them to begin.')

  // current visible salivation 0..1, animated toward a target
  const droolTarget = useRef(0)
  const droolRef = useRef<SVGRectElement>(null)
  const droolPctRef = useRef<SVGTextElement>(null)
  const dropRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    let shown = 0
    let raf = 0
    const loop = () => {
      shown += (droolTarget.current - shown) * 0.12
      const h = 60 * shown
      if (droolRef.current) {
        droolRef.current.setAttribute('height', h.toFixed(1))
        droolRef.current.setAttribute('y', (150 - h).toFixed(1))
      }
      if (droolPctRef.current) {
        droolPctRef.current.textContent = `${Math.round(shown * 100)}%`
      }
      // animated falling drops near the dog's mouth
      for (let i = 0; i < dropRefs.current.length; i++) {
        const el = dropRefs.current[i]
        if (!el) continue
        const speed = 0.6 + i * 0.25
        const base = 96 + i * 6
        const span = 40
        const t = (performance.now() * 0.001 * speed + i * 0.6) % 1
        el.setAttribute('cy', (base + t * span).toFixed(1))
        el.setAttribute('opacity', (shown * (1 - t)).toFixed(2))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const pulse = (target: number, message: string) => {
    droolTarget.current = target
    setLast(message)
  }

  const ringBell = () => {
    // bell alone elicits salivation proportional to learned strength
    pulse(
      csStrength,
      csStrength < 0.05
        ? 'You ring the bell. The dog cocks an ear — but does not drool. The bell is still a neutral stimulus.'
        : `You ring the bell alone. The dog salivates at ${Math.round(csStrength * 100)}% — a conditioned response, with no food in sight.`,
    )
    // record this bell-alone probe on the curve
    setTrials((t) => (t.length >= MAX_TRIALS ? t : [...t, csStrength]))
    if (phase === 'extinction') {
      // bell without food weakens the association
      setCsStrength((s) => Math.max(0, s - 0.18))
    }
  }

  const presentFood = () => {
    pulse(1, 'You present the food (the UCS). The dog salivates fully — an unconditioned, reflexive response that needs no learning.')
  }

  const pairBoth = () => {
    if (phase === 'extinction') {
      setLast('In extinction you withhold the food. Switch back to the acquisition phase to pair the bell with food again.')
      return
    }
    // pairing strengthens the bell -> response link (negatively accelerated)
    const next = Math.min(1, csStrength + (1 - csStrength) * 0.34 + 0.04)
    setCsStrength(next)
    pulse(1, `Bell, then food. The dog drools at the food — and the bell soaks up a little of that power. Bell strength is now ${Math.round(next * 100)}%.`)
    setTrials((t) => (t.length >= MAX_TRIALS ? t : [...t, next]))
  }

  const reset = () => {
    setCsStrength(0)
    setTrials([])
    setPhase('acquisition')
    droolTarget.current = 0
    setLast('Reset. Present food, ring the bell, or pair them to begin.')
  }

  // build the acquisition/extinction curve from recorded trials
  let curve = ''
  trials.forEach((v, i) => {
    const x = GX0 + (i / (MAX_TRIALS - 1)) * (GX1 - GX0)
    const y = GY_BASE - GH * v
    curve += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)} `
  })

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 460 210" className="w-full">
        {/* ---- left: the dog + bell + drool meter ---- */}
        <text x="18" y="22" fill="var(--color-muted)" fontSize="11">Pavlov's dog</text>

        {/* bell */}
        <g transform="translate(40 40)">
          <path d="M0 28 Q0 4 14 4 Q28 4 28 28 L32 34 L-4 34 Z" fill="#F7B731" stroke="#b8860b" strokeWidth="1.2" />
          <circle cx="14" cy="40" r="4" fill="#b8860b" />
        </g>

        {/* simple dog silhouette */}
        <g transform="translate(20 70)">
          <ellipse cx="70" cy="48" rx="48" ry="22" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
          <circle cx="118" cy="30" r="20" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
          <path d="M104 14 L100 -2 L116 10 Z" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
          <circle cx="124" cy="26" r="2.4" fill="var(--color-ink)" />
          <ellipse cx="135" cy="34" rx="4" ry="3" fill="var(--color-ink)" />
        </g>

        {/* falling drool drops */}
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            ref={(el) => { dropRefs.current[i] = el }}
            cx={150 + i * 7}
            cy={100}
            r="3"
            fill="#3498DB"
            opacity="0"
          />
        ))}

        {/* salivation meter */}
        <text x="208" y="86" fill="var(--color-muted)" fontSize="9" textAnchor="middle">saliva</text>
        <rect x="198" y="90" width="20" height="60" rx="4" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1" />
        <rect ref={droolRef} x="198" y="150" width="20" height="0" rx="4" fill="#3498DB" />
        <text ref={droolPctRef} x="208" y="166" fill="var(--color-ink)" fontSize="9" textAnchor="middle" fontWeight="600">0%</text>

        {/* ---- right: acquisition / extinction curve ---- */}
        <line x1={GX0} y1={GY_TOP} x2={GX0} y2={GY_BASE} stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1={GX0} y1={GY_BASE} x2={GX1 + 6} y2={GY_BASE} stroke="var(--color-border)" strokeWidth="1.5" />
        <text x={GX0 - 4} y={GY_TOP + 4} fill="var(--color-muted)" fontSize="8" textAnchor="end">strong</text>
        <text x={GX0 - 4} y={GY_BASE} fill="var(--color-muted)" fontSize="8" textAnchor="end">none</text>
        <text x={(GX0 + GX1) / 2} y={GY_BASE + 16} fill="var(--color-muted)" fontSize="9" textAnchor="middle">conditioned response over trials</text>
        {curve && <path d={curve.trim()} fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="round" />}
        {trials.map((v, i) => {
          const x = GX0 + (i / (MAX_TRIALS - 1)) * (GX1 - GX0)
          const y = GY_BASE - GH * v
          return <circle key={i} cx={x} cy={y} r="2.6" fill="var(--color-accent)" />
        })}
      </svg>

      {/* phase toggle */}
      <div className="flex flex-wrap gap-2 px-4 pt-1">
        {(['acquisition', 'extinction'] as Array<Phase>).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPhase(p)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              phase === p ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* controls */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
        <button
          type="button"
          onClick={ringBell}
          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-ink hover:bg-surface-2"
        >
          <Icon name="Bell" size={15} /> Ring bell (CS)
        </button>
        <button
          type="button"
          onClick={presentFood}
          disabled={phase === 'extinction'}
          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-ink hover:bg-surface-2 disabled:opacity-40"
        >
          <Icon name="Beef" size={15} /> Present food (UCS)
        </button>
        <button
          type="button"
          onClick={pairBoth}
          disabled={phase === 'extinction'}
          className="flex items-center gap-1.5 rounded-full border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-accent disabled:opacity-40"
        >
          <Icon name="Link" size={15} /> Pair bell + food
        </button>
        <button
          type="button"
          onClick={reset}
          className="ml-auto rounded-full border border-border px-3 py-1.5 text-sm text-muted hover:text-ink"
        >
          Reset
        </button>
      </div>

      <p className="px-4 pb-4 pt-3 text-sm leading-snug text-muted">{last}</p>
    </div>
  )
}
