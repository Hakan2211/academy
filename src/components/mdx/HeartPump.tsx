import { useEffect, useRef } from 'react'

// The heart as a double pump. The right side (blue) sends deoxygenated blood to
// the lungs; the left side (red) sends oxygen-rich blood to the body. The whole
// muscle beats, and blood flows around the two loops.
const PULM = 'M 132 95 C 132 40, 150 22, 168 22 C 188 22, 196 50, 196 95'
const SYS = 'M 204 150 C 204 215, 180 232, 160 232 C 138 232, 116 212, 116 150'

export function HeartPump() {
  const heartRef = useRef<SVGGElement | null>(null)
  const pulmRef = useRef<SVGPathElement | null>(null)
  const sysRef = useRef<SVGPathElement | null>(null)
  const pulmDots = useRef<Array<SVGCircleElement | null>>([])
  const sysDots = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    const pulm = pulmRef.current
    const sys = sysRef.current
    if (!pulm || !sys) return
    const lp = pulm.getTotalLength()
    const ls = sys.getTotalLength()
    let raf = 0
    const loop = (now: number) => {
      const t = now / 1000
      // beat: contract sharply, relax slowly
      const beat = 1 + 0.05 * Math.max(0, Math.sin(t * 3.2)) ** 3
      heartRef.current?.setAttribute('transform', `translate(160 130) scale(${beat.toFixed(3)}) translate(-160 -130)`)

      pulmDots.current.forEach((d, i) => {
        const f = ((t * 0.16 + i / 4) % 1)
        const p = pulm.getPointAtLength(f * lp)
        d?.setAttribute('cx', p.x.toFixed(1))
        d?.setAttribute('cy', p.y.toFixed(1))
        d?.setAttribute('fill', f < 0.5 ? '#4F8CFF' : '#E74C3C') // turns red at the lungs
      })
      sysDots.current.forEach((d, i) => {
        const f = ((t * 0.16 + i / 4) % 1)
        const p = sys.getPointAtLength(f * ls)
        d?.setAttribute('cx', p.x.toFixed(1))
        d?.setAttribute('cy', p.y.toFixed(1))
        d?.setAttribute('fill', f < 0.5 ? '#E74C3C' : '#4F8CFF') // gives up oxygen at the body
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 320 250" className="mx-auto block h-[240px]">
        <text x={160} y={14} textAnchor="middle" className="fill-muted text-[10px]">to / from the LUNGS</text>
        <text x={160} y={246} textAnchor="middle" className="fill-muted text-[10px]">to / from the BODY</text>

        {/* blood routes */}
        <path ref={pulmRef} d={PULM} fill="none" stroke="#334155" strokeWidth={9} strokeLinecap="round" />
        <path ref={sysRef} d={SYS} fill="none" stroke="#334155" strokeWidth={9} strokeLinecap="round" />

        {/* heart (beats) */}
        <g ref={heartRef}>
          {/* right side (deoxygenated, blue) */}
          <rect x={118} y={70} width={42} height={46} rx={8} fill="#2d6cb8" />
          <rect x={118} y={120} width={42} height={56} rx={8} fill="#2d6cb8" />
          <text x={139} y={96} textAnchor="middle" className="fill-white text-[9px] font-semibold">RA</text>
          <text x={139} y={150} textAnchor="middle" className="fill-white text-[9px] font-semibold">RV</text>
          {/* left side (oxygenated, red) */}
          <rect x={162} y={70} width={42} height={46} rx={8} fill="#c0392b" />
          <rect x={162} y={120} width={42} height={56} rx={8} fill="#c0392b" />
          <text x={183} y={96} textAnchor="middle" className="fill-white text-[9px] font-semibold">LA</text>
          <text x={183} y={150} textAnchor="middle" className="fill-white text-[9px] font-semibold">LV</text>
          <line x1={161} y1={70} x2={161} y2={176} stroke="#0e1c2e" strokeWidth={2} />
        </g>

        {/* flowing blood */}
        {[0, 1, 2, 3].map((i) => (
          <circle key={`p${i}`} ref={(el) => { pulmDots.current[i] = el }} r={4} fill="#4F8CFF" />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <circle key={`s${i}`} ref={(el) => { sysDots.current[i] = el }} r={4} fill="#E74C3C" />
        ))}
      </svg>

      <p className="mt-1 text-center text-sm text-muted">
        <span className="text-[#4F8CFF]">Blue</span> = deoxygenated blood heading to the lungs; <span className="text-[#E74C3C]">red</span> = oxygen-rich blood heading to the body. Two loops, one muscle.
      </p>
    </div>
  )
}
