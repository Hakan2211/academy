import { useEffect, useRef } from 'react'

// Translocation: phloem carries the sugar made in the leaves (the source) to
// wherever it's needed (the sinks) — roots, fruits, growing tips. Unlike xylem,
// it can flow both ways.
export function PhloemTransport() {
  const sugarRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    let raf = 0
    const loop = (now: number) => {
      const t = now / 1000
      sugarRefs.current.forEach((el, i) => {
        const f = ((t * 0.25 + i / 5) % 1)
        // from leaf (source, top) down to roots (sink, bottom)
        const y = 50 + f * 130
        el?.setAttribute('cy', y.toFixed(1))
        el?.setAttribute('opacity', f > 0.92 ? ((1 - f) * 12).toFixed(2) : f < 0.08 ? (f * 12).toFixed(2) : '1')
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 280 210" className="mx-auto block h-[200px]">
        {/* leaf = source */}
        <ellipse cx={150} cy={42} rx={40} ry={18} fill="#2e9b4a" />
        <text x={150} y={20} textAnchor="middle" className="fill-[#FDCB6E] text-[10px] font-semibold">SOURCE — leaf makes sugar ☀️</text>

        {/* stem with two channels */}
        <rect x={120} y={50} width={16} height={140} rx={4} fill="#3a6b2e" />
        <rect x={144} y={50} width={16} height={140} rx={4} fill="#3a6b2e" />
        <line x1={128} y1={56} x2={128} y2={186} stroke="#1e4d6b" strokeWidth={3} strokeDasharray="2 4" />
        <text x={108} y={130} textAnchor="end" className="fill-[#4F8CFF] text-[8px]" transform="rotate(-90 108 130)">xylem (water up)</text>
        <text x={176} y={130} className="fill-[#FDCB6E] text-[8px]" transform="rotate(90 176 130)">phloem (sugar)</text>

        {/* sink */}
        <ellipse cx={150} cy={196} rx={44} ry={14} fill="#7b5a3a" />
        <text x={150} y={208} textAnchor="middle" className="fill-[#FDCB6E] text-[10px] font-semibold">SINK — roots store/use it</text>

        {/* moving sugar in phloem (x=152) */}
        {Array.from({ length: 5 }).map((_, i) => (
          <circle key={i} ref={(el) => { sugarRefs.current[i] = el }} cx={152} cy={50} r={4} fill="#FDCB6E" />
        ))}
      </svg>

      <p className="mt-1 text-center text-sm text-muted">
        Sugar made in the leaves is carried by the <span className="text-[#FDCB6E]">phloem</span> to roots, fruits, and growing tips. (The <span className="text-[#4F8CFF]">xylem</span> beside it carries water the other way — upward.)
      </p>
    </div>
  )
}
