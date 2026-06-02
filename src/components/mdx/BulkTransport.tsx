import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// Bulk transport: moving cargo too big for any protein by wrapping it in a piece
// of membrane. Exocytosis ships a vesicle OUT and fuses it with the membrane;
// endocytosis engulfs material IN. Toggle the mode and watch the loop.
type Mode = 'exocytosis' | 'endocytosis'
const MEM_Y = 104
const CX = 180

export function BulkTransport() {
  const [mode, setMode] = useState<Mode>('exocytosis')
  const modeRef = useRef(mode)
  const vesRef = useRef<SVGGElement | null>(null)
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    let raf = 0
    let p = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      p += dt * 0.00035
      if (p >= 1) p = 0

      const exo = modeRef.current === 'exocytosis'
      let vesY = MEM_Y
      let vesOp = 0
      const setDot = (k: number, x: number, y: number, op: number) => {
        const el = dotRefs.current[k]
        if (el) {
          el.setAttribute('cx', x.toFixed(1))
          el.setAttribute('cy', y.toFixed(1))
          el.setAttribute('opacity', op.toFixed(2))
        }
      }

      if (exo) {
        if (p < 0.55) {
          vesY = 176 - (p / 0.55) * (176 - MEM_Y - 6)
          vesOp = 1
          for (let k = 0; k < 3; k++) setDot(k, 0, 0, 0)
        } else {
          const q = (p - 0.55) / 0.45
          vesOp = 1 - q
          vesY = MEM_Y - 4
          for (let k = 0; k < 3; k++) setDot(k, CX + (k - 1) * 26 * q, MEM_Y - 10 - q * 52, 1 - q)
        }
      } else {
        if (p < 0.45) {
          const q = p / 0.45
          vesOp = 0
          for (let k = 0; k < 3; k++) setDot(k, CX + (k - 1) * 26 * (1 - q), (44 + q * (MEM_Y - 54)), 1)
        } else {
          const q = (p - 0.45) / 0.55
          vesOp = 1
          vesY = MEM_Y + 4 + q * (176 - MEM_Y - 10)
          for (let k = 0; k < 3; k++) setDot(k, 0, 0, 0)
        }
      }
      vesRef.current?.setAttribute('transform', `translate(${CX} ${vesY.toFixed(1)})`)
      vesRef.current?.setAttribute('opacity', vesOp.toFixed(2))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex gap-2">
        {(['exocytosis', 'endocytosis'] as Array<Mode>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 210" className="w-full">
        <text x={180} y={20} textAnchor="middle" className="fill-muted text-[10px]">outside the cell</text>

        {/* membrane bilayer */}
        <rect x={6} y={MEM_Y - 8} width={348} height={16} fill="#243a18" />
        {Array.from({ length: 19 }).map((_, i) => (
          <g key={i}>
            <circle cx={16 + i * 18} cy={MEM_Y - 6} r={4} fill="#FDCB6E" />
            <circle cx={16 + i * 18} cy={MEM_Y + 6} r={4} fill="#FDCB6E" />
          </g>
        ))}

        {/* free cargo dots */}
        {[0, 1, 2].map((k) => (
          <circle key={k} ref={(el) => { dotRefs.current[k] = el }} cx={CX} cy={40} r={5} fill="#FF7A66" opacity={0} />
        ))}

        {/* vesicle */}
        <g ref={vesRef} transform={`translate(${CX} 176)`} opacity={0}>
          <circle r={20} fill="none" stroke="#4FD1C5" strokeWidth={3} />
          <circle cx={-7} cy={-3} r={4} fill="#FF7A66" />
          <circle cx={6} cy={2} r={4} fill="#FF7A66" />
          <circle cx={-1} cy={8} r={4} fill="#FF7A66" />
        </g>

        <text x={180} y={202} textAnchor="middle" className="fill-muted text-[10px]">inside the cell</text>
      </svg>

      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-center text-sm text-muted">
        {mode === 'exocytosis'
          ? 'Exocytosis: a vesicle carries cargo to the membrane, fuses with it, and releases the contents OUTSIDE — how cells secrete hormones and enzymes.'
          : 'Endocytosis: the membrane wraps around outside material and pinches off a vesicle INSIDE — how cells take in large particles, even whole bacteria.'}
      </p>
    </div>
  )
}
