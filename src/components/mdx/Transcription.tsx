import { useEffect, useRef } from 'react'

// Transcription: an enzyme (RNA polymerase) reads one DNA strand and builds a
// matching messenger-RNA copy — pairing A→U, T→A, C→G, G→C. The mRNA then
// carries the gene's message out of the nucleus.
const TEMPLATE = ['T', 'A', 'C', 'G', 'A', 'T', 'G', 'C']
const RNA: Record<string, string> = { T: 'A', A: 'U', C: 'G', G: 'C' }
const XS = TEMPLATE.map((_, i) => 44 + i * 38)
const RCOLOR: Record<string, string> = { A: '#FDCB6E', U: '#4F8CFF', G: '#2ECC71', C: '#A29BFE' }

export function Transcription() {
  const polyRef = useRef<SVGGElement | null>(null)
  const rnaRefs = useRef<Array<SVGGElement | null>>([])

  useEffect(() => {
    let raf = 0
    const loop = (now: number) => {
      const t = (now / 4200) % 1
      const px = 30 + t * 320
      polyRef.current?.setAttribute('transform', `translate(${px.toFixed(1)} 96)`)
      XS.forEach((x, i) => {
        rnaRefs.current[i]?.setAttribute('opacity', px > x ? '1' : '0')
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 188" className="w-full">
        {/* DNA template strand */}
        <line x1={30} y1={70} x2={344} y2={70} stroke="#94a3b8" strokeWidth={4} strokeLinecap="round" />
        {TEMPLATE.map((b, i) => (
          <text key={i} x={XS[i]} y={62} textAnchor="middle" className="fill-muted text-[11px] font-mono">{b}</text>
        ))}
        <text x={30} y={48} className="fill-muted text-[9px]">DNA template</text>

        {/* growing mRNA */}
        <line x1={30} y1={150} x2={344} y2={150} stroke="#16361f" strokeWidth={2} strokeDasharray="2 4" />
        {TEMPLATE.map((b, i) => (
          <g key={i} ref={(el) => { rnaRefs.current[i] = el }} opacity={0}>
            <circle cx={XS[i]} cy={150} r={11} fill={RCOLOR[RNA[b]]} />
            <text x={XS[i]} y={154} textAnchor="middle" className="fill-white text-[10px] font-bold">{RNA[b]}</text>
          </g>
        ))}
        <text x={30} y={178} className="fill-[#7CFC9A] text-[9px]">mRNA copy</text>

        {/* RNA polymerase */}
        <g ref={polyRef} transform="translate(30 96)">
          <ellipse rx={26} ry={30} fill="#A29BFE" opacity={0.92} />
          <text y={4} textAnchor="middle" className="fill-white text-[8px] font-semibold">RNA pol</text>
        </g>
      </svg>

      <p className="mt-2 text-center text-sm text-muted">
        The enzyme reads the DNA and builds an mRNA copy — but RNA uses <span className="font-semibold text-ink">U</span> wherever DNA would use T.
      </p>
    </div>
  )
}
