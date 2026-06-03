import { useEffect, useRef } from 'react'

// The circular-flow model: the economy as two loops between households and
// firms. MONEY (green) flows one way — households spend in goods markets, firms
// pay wages/rent in resource markets; GOODS & RESOURCES (accent) flow the other
// way. Every dollar someone spends is a dollar someone else earns.
const CX = 180
const CY = 148
const OUTER = { rx: 142, ry: 92 } // money loop
const INNER = { rx: 104, ry: 58 } // goods/resource loop
const NDOTS = 7

function ellipse(rx: number, ry: number, theta: number) {
  return { x: CX + rx * Math.cos(theta), y: CY + ry * Math.sin(theta) }
}

export function CircularFlow() {
  const moneyRefs = useRef<Array<SVGCircleElement | null>>([])
  const goodsRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let phase = 0
    let last = 0
    const place = () => {
      for (let i = 0; i < NDOTS; i++) {
        const base = (i / NDOTS) * Math.PI * 2
        const m = ellipse(OUTER.rx, OUTER.ry, base + phase) // money: clockwise
        const g = ellipse(INNER.rx, INNER.ry, base - phase) // goods: counter
        const me = moneyRefs.current[i]
        const ge = goodsRefs.current[i]
        if (me) { me.setAttribute('cx', m.x.toFixed(1)); me.setAttribute('cy', m.y.toFixed(1)) }
        if (ge) { ge.setAttribute('cx', g.x.toFixed(1)); ge.setAttribute('cy', g.y.toFixed(1)) }
      }
    }
    place()
    if (reduce) return
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      phase += dt * 0.0006
      place()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 296" className="w-full">
        {/* market labels (top = goods, bottom = resources) */}
        <text x={CX} y={26} textAnchor="middle" fontSize="11" fill="var(--color-muted)">Goods &amp; services market</text>
        <text x={CX} y={284} textAnchor="middle" fontSize="11" fill="var(--color-muted)">Resource &amp; labour market</text>

        {/* loop tracks */}
        <ellipse cx={CX} cy={CY} rx={OUTER.rx} ry={OUTER.ry} fill="none" stroke="var(--color-success)" strokeWidth="1.5" opacity="0.35" />
        <ellipse cx={CX} cy={CY} rx={INNER.rx} ry={INNER.ry} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.35" />

        {/* flowing dots */}
        {Array.from({ length: NDOTS }).map((_, i) => (
          <circle key={`m${i}`} ref={(el) => { moneyRefs.current[i] = el }} r="4" fill="var(--color-success)" />
        ))}
        {Array.from({ length: NDOTS }).map((_, i) => (
          <circle key={`g${i}`} ref={(el) => { goodsRefs.current[i] = el }} r="4" fill="var(--color-accent)" />
        ))}

        {/* households + firms sit over the loop vertices */}
        <g>
          <rect x={6} y={CY - 30} width="92" height="60" rx="10" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2" />
          <text x={52} y={CY - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-ink)">Households</text>
          <text x={52} y={CY + 12} textAnchor="middle" fontSize="9" fill="var(--color-muted)">buy goods, sell labour</text>
        </g>
        <g>
          <rect x={262} y={CY - 30} width="92" height="60" rx="10" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2" />
          <text x={308} y={CY - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-ink)">Firms</text>
          <text x={308} y={CY + 12} textAnchor="middle" fontSize="9" fill="var(--color-muted)">sell goods, pay wages</text>
        </g>
      </svg>

      <div className="flex items-center justify-center gap-4 px-4 pb-4">
        <span className="inline-flex items-center gap-1 text-xs text-muted"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: 'var(--color-success)' }} /> money ($)</span>
        <span className="inline-flex items-center gap-1 text-xs text-muted"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: 'var(--color-accent)' }} /> goods &amp; resources</span>
      </div>
    </div>
  )
}
