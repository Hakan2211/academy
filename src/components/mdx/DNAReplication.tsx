import { useEffect, useRef } from 'react'

// DNA copies itself by unzipping. The two strands separate at a fork, and free
// nucleotides pair up against each exposed strand (A–T, G–C). The result is two
// identical helices, each keeping one old strand — "semi-conservative".
const FORK = { x: 168, y: 100 }
const DOCKS = [
  { x: 230, y: 74, base: 'T', color: '#4F8CFF' },
  { x: 230, y: 126, base: 'A', color: '#FDCB6E' },
  { x: 286, y: 60, base: 'C', color: '#A29BFE' },
  { x: 286, y: 140, base: 'G', color: '#2ECC71' },
]

export function DNAReplication() {
  const nucRefs = useRef<Array<SVGGElement | null>>([])

  useEffect(() => {
    let raf = 0
    const loop = (now: number) => {
      DOCKS.forEach((d, i) => {
        // each nucleotide drifts from the centre pool to its docking site, loops
        const t = ((now / 1000) * 0.5 + i * 0.25) % 1
        const startX = 180
        const startY = 100
        const x = startX + (d.x - startX) * t
        const y = startY + (d.y - startY) * t
        nucRefs.current[i]?.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
        nucRefs.current[i]?.setAttribute('opacity', (t < 0.1 ? t * 10 : t > 0.92 ? (1 - t) * 12 : 1).toFixed(2))
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 200" className="w-full">
        {/* parent double helix (left of fork) */}
        <line x1={20} y1={92} x2={FORK.x} y2={92} stroke="#cbd5e1" strokeWidth={4} strokeLinecap="round" />
        <line x1={20} y1={108} x2={FORK.x} y2={108} stroke="#94a3b8" strokeWidth={4} strokeLinecap="round" />
        {[40, 70, 100, 130, 160].map((x) => (
          <line key={x} x1={x} y1={92} x2={x} y2={108} stroke="#64748b" strokeWidth={2} />
        ))}
        <text x={70} y={130} textAnchor="middle" className="fill-muted text-[9px]">original DNA</text>

        {/* separated template strands (the Y fork) */}
        <line x1={FORK.x} y1={92} x2={340} y2={48} stroke="#cbd5e1" strokeWidth={4} strokeLinecap="round" />
        <line x1={FORK.x} y1={108} x2={340} y2={152} stroke="#94a3b8" strokeWidth={4} strokeLinecap="round" />

        {/* already-built new bases near the fork */}
        {[[200, 66], [200, 134]].map(([x, y], i) => (
          <line key={i} x1={x} y1={y} x2={x} y2={y < 100 ? y + 18 : y - 18} stroke="#7CFC9A" strokeWidth={2.5} />
        ))}

        {/* incoming free nucleotides */}
        {DOCKS.map((d, i) => (
          <g key={i} ref={(el) => { nucRefs.current[i] = el }} transform="translate(180 100)">
            <circle r={9} fill={d.color} />
            <text y={3} textAnchor="middle" className="fill-white text-[9px] font-bold">{d.base}</text>
          </g>
        ))}

        <text x={300} y={36} textAnchor="middle" className="fill-muted text-[9px]">new strand 1</text>
        <text x={300} y={176} textAnchor="middle" className="fill-muted text-[9px]">new strand 2</text>
      </svg>

      <p className="mt-2 text-center text-sm text-muted">
        Free nucleotides pair against each exposed strand (A–T, G–C). Each new helix keeps one old strand —
        <span className="font-semibold text-ink"> semi-conservative</span> replication.
      </p>
    </div>
  )
}
