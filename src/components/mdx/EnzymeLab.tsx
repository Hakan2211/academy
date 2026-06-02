import { useEffect, useRef } from 'react'

// Lock and key. An enzyme has a specially shaped pocket — the active site — that
// only one substrate fits. The substrate binds, the reaction happens, the
// products leave, and the enzyme is unchanged, ready to do it again.
export function EnzymeLab() {
  const subRef = useRef<SVGGElement | null>(null)
  const prodARef = useRef<SVGGElement | null>(null)
  const prodBRef = useRef<SVGGElement | null>(null)
  const flashRef = useRef<SVGCircleElement | null>(null)
  const labelRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    let raf = 0
    let p = 0
    let last = 0
    const dock = { x: 180, y: 86 }
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      p += dt * 0.00028
      if (p >= 1) p = 0

      let subOp = 0
      let prodOp = 0
      let sx = 40
      let sy = 60
      let flash = 0
      let label = ''
      let aOff = 0

      if (p < 0.35) {
        const q = p / 0.35
        sx = 40 + (dock.x - 40) * q
        sy = 60 + (dock.y - 60) * q
        subOp = 1
        label = 'A substrate drifts toward the enzyme’s active site…'
      } else if (p < 0.46) {
        sx = dock.x
        sy = dock.y
        subOp = 1
        flash = Math.sin(((p - 0.35) / 0.11) * Math.PI)
        label = 'It fits! The enzyme catalyses the reaction.'
      } else if (p < 0.82) {
        const q = (p - 0.46) / 0.36
        prodOp = 1
        aOff = q * 90
        label = 'The products are released — they no longer fit, so they leave.'
      } else {
        label = 'The enzyme is unchanged and ready for the next substrate.'
      }

      subRef.current?.setAttribute('transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)})`)
      subRef.current?.setAttribute('opacity', subOp.toFixed(2))
      prodARef.current?.setAttribute('transform', `translate(${(dock.x + aOff).toFixed(1)} ${(dock.y - aOff * 0.4).toFixed(1)})`)
      prodARef.current?.setAttribute('opacity', prodOp.toFixed(2))
      prodBRef.current?.setAttribute('transform', `translate(${(dock.x + aOff).toFixed(1)} ${(dock.y + aOff * 0.4).toFixed(1)})`)
      prodBRef.current?.setAttribute('opacity', prodOp.toFixed(2))
      flashRef.current?.setAttribute('opacity', flash.toFixed(2))
      flashRef.current?.setAttribute('r', (10 + flash * 18).toFixed(1))
      if (labelRef.current) labelRef.current.textContent = label
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 180" className="w-full">
        {/* enzyme with a V-notch active site */}
        <path
          d="M 120 150 L 120 100 Q 120 70 160 70 L 172 70 L 180 92 L 188 70 L 200 70 Q 240 70 240 100 L 240 150 Z"
          fill="#A29BFE"
          opacity={0.95}
        />
        <text x={180} y={140} textAnchor="middle" className="fill-white text-[10px] font-semibold">enzyme</text>

        <circle ref={flashRef} cx={180} cy={88} r={10} fill="#2ECC71" opacity={0} />

        {/* substrate (fits the notch) */}
        <g ref={subRef} transform="translate(40 60)" opacity={0}>
          <path d="M -16 -14 L 16 -14 L 16 -2 L 8 12 L -8 12 L -16 -2 Z" fill="#FDCB6E" stroke="#b8860b" strokeWidth={1.5} />
        </g>

        {/* two products after the split */}
        <g ref={prodARef} opacity={0}>
          <rect x={-12} y={-10} width={24} height={16} rx={4} fill="#FF7A66" />
        </g>
        <g ref={prodBRef} opacity={0}>
          <circle r={10} fill="#4FD1C5" />
        </g>
      </svg>

      <p ref={labelRef} className="mt-1 min-h-[2.5rem] text-center text-sm text-muted">
        A substrate drifts toward the enzyme’s active site…
      </p>
    </div>
  )
}
