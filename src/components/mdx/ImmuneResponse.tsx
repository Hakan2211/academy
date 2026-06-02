import { useEffect, useRef } from 'react'

// The immune response in action: antibodies (Y-shaped) tag the pathogens, and a
// phagocyte (white blood cell) hunts them down and engulfs them one by one.
const P = [
  { x: 80, y: 56 },
  { x: 244, y: 64 },
  { x: 110, y: 140 },
  { x: 252, y: 138 },
]

export function ImmuneResponse() {
  const whiteRef = useRef<SVGGElement | null>(null)
  const pathRefs = useRef<Array<SVGGElement | null>>([])

  useEffect(() => {
    let raf = 0
    let cx = 160
    let cy = 100
    let target = 0
    const loop = () => {
      const t = P[target]
      cx += (t.x - cx) * 0.04
      cy += (t.y - cy) * 0.04
      whiteRef.current?.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)})`)
      if (Math.hypot(t.x - cx, t.y - cy) < 13) {
        pathRefs.current[target]?.setAttribute('opacity', '0')
        target = (target + 1) % P.length
        if (target === 0) pathRefs.current.forEach((el) => el?.setAttribute('opacity', '1'))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 320 184" className="w-full">
        {/* pathogens with antibodies attached */}
        {P.map((p, i) => (
          <g key={i} ref={(el) => { pathRefs.current[i] = el }} transform={`translate(${p.x} ${p.y})`}>
            <circle r={12} fill="#E74C3C" />
            {/* antibodies (Y shapes) tagging it */}
            {[-1, 1].map((d) => (
              <g key={d} transform={`translate(${d * 14} -2) scale(${d} 1)`} stroke="#FDCB6E" strokeWidth={2} fill="none">
                <line x1={0} y1={0} x2={6} y2={0} />
                <line x1={6} y1={0} x2={11} y2={-4} />
                <line x1={6} y1={0} x2={11} y2={4} />
              </g>
            ))}
          </g>
        ))}

        {/* phagocyte (white blood cell) */}
        <g ref={whiteRef} transform="translate(160 100)">
          <circle r={26} fill="#ECF0F1" opacity={0.9} />
          <circle r={26} fill="none" stroke="#bdc3c7" strokeWidth={2} />
          <circle cx={-6} cy={-4} r={8} fill="#9b59b6" opacity={0.6} />
          <circle cx={8} cy={6} r={6} fill="#9b59b6" opacity={0.6} />
        </g>
      </svg>

      <p className="mt-1 text-center text-sm text-muted">
        <span className="text-[#FDCB6E]">Antibodies</span> tag the <span className="text-[#E74C3C]">pathogens</span>, marking them for the <span className="text-ink">phagocyte</span> to engulf and destroy.
      </p>
    </div>
  )
}
