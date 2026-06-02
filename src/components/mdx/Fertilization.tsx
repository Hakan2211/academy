import { useEffect, useRef } from 'react'

// Fertilisation: many sperm race toward the egg, but only one gets in. Its 23
// chromosomes join the egg's 23 to make a single cell — the zygote — with the
// full set of 46.
const SPERM = [{ y: 60 }, { y: 80 }, { y: 95 }, { y: 110 }, { y: 125 }, { y: 75 }]
const EGG = { x: 248, y: 92, r: 40 }

export function Fertilization() {
  const spermRefs = useRef<Array<SVGGElement | null>>([])
  const flashRef = useRef<SVGCircleElement | null>(null)
  const zygoteRef = useRef<SVGTextElement | null>(null)

  useEffect(() => {
    let raf = 0
    const loop = (now: number) => {
      const cyc = (now / 4000) % 1
      SPERM.forEach((s, i) => {
        const lead = i === 0
        const speed = lead ? 1 : 0.82 - i * 0.04
        let prog = Math.min(1, (cyc / 0.7) * speed)
        // the winner docks; others stop at the membrane after fertilisation
        if (cyc > 0.7 && !lead) prog = Math.min(prog, 0.82)
        const startX = 30
        const targetX = lead ? EGG.x - EGG.r + 6 : EGG.x - EGG.r - 4
        const x = startX + (targetX - startX) * prog
        const wob = Math.sin(now / 120 + i) * 5 * (1 - prog)
        const op = cyc > 0.85 && !lead ? Math.max(0, 1 - (cyc - 0.85) / 0.15) : 1
        spermRefs.current[i]?.setAttribute('transform', `translate(${x.toFixed(1)} ${(s.y + wob).toFixed(1)})`)
        spermRefs.current[i]?.setAttribute('opacity', op.toFixed(2))
      })
      // fertilisation flash + zygote label
      const f = cyc > 0.7 && cyc < 0.82 ? Math.sin(((cyc - 0.7) / 0.12) * Math.PI) : 0
      flashRef.current?.setAttribute('opacity', f.toFixed(2))
      zygoteRef.current?.setAttribute('opacity', cyc > 0.82 ? '1' : '0')
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 320 184" className="w-full">
        {/* egg */}
        <circle cx={EGG.x} cy={EGG.y} r={EGG.r + 6} fill="none" stroke="#fab1a0" strokeWidth={2} strokeDasharray="3 3" />
        <circle cx={EGG.x} cy={EGG.y} r={EGG.r} fill="#FDE2C8" />
        <circle cx={EGG.x} cy={EGG.y} r={14} fill="#FD79A8" />
        <circle ref={flashRef} cx={EGG.x} cy={EGG.y} r={EGG.r + 6} fill="#fff" opacity={0} />
        <text x={EGG.x} y={EGG.y + EGG.r + 22} textAnchor="middle" className="fill-muted text-[9px]">egg (23 chromosomes)</text>

        {/* sperm */}
        {SPERM.map((s, i) => (
          <g key={i} ref={(el) => { spermRefs.current[i] = el }} transform={`translate(30 ${s.y})`}>
            <circle r={5} fill="#4FD1C5" />
            <line x1={-4} y1={0} x2={-14} y2={0} stroke="#4FD1C5" strokeWidth={2} />
          </g>
        ))}
        <text x={50} y={172} textAnchor="middle" className="fill-muted text-[9px]">sperm (23 each)</text>

        <text ref={zygoteRef} x={EGG.x} y={EGG.y + 4} textAnchor="middle" className="fill-white text-[10px] font-bold" opacity={0}>46</text>
      </svg>

      <p className="mt-1 text-center text-sm text-muted">
        Only one sperm fuses with the egg. Their nuclei join — 23 + 23 = <span className="font-semibold text-ink">46 chromosomes</span> — forming the first cell of a new individual, the <span className="text-ink">zygote</span>.
      </p>
    </div>
  )
}
