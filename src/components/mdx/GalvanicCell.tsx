import { useEffect, useRef } from 'react'

// A galvanic (voltaic) cell turns a spontaneous redox reaction into electricity.
// Oxidation at the anode releases electrons that flow through the wire to the
// cathode (reduction). A salt bridge keeps both halves electrically neutral.
const WIRE = [
  { x: 75, y: 46 },
  { x: 75, y: 16 },
  { x: 225, y: 16 },
  { x: 225, y: 46 },
]

function pointAt(s: number) {
  // s in 0..1 along the 3-segment wire
  const segs = [
    [WIRE[0], WIRE[1]],
    [WIRE[1], WIRE[2]],
    [WIRE[2], WIRE[3]],
  ]
  const lens = segs.map(([a, b]) => Math.hypot(b.x - a.x, b.y - a.y))
  const total = lens.reduce((p, c) => p + c, 0)
  let d = s * total
  for (let i = 0; i < segs.length; i++) {
    if (d <= lens[i]) {
      const t = d / lens[i]
      const [a, b] = segs[i]
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
    }
    d -= lens[i]
  }
  return WIRE[3]
}

export function GalvanicCell() {
  const eRef = useRef<SVGGElement | null>(null)

  useEffect(() => {
    let raf = 0
    let p = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      p += dt * 0.0004
      if (p > 1) p = 0
      const g = eRef.current
      if (g) {
        let inner = ''
        for (let k = 0; k < 4; k++) {
          const pt = pointAt((p + k / 4) % 1)
          inner += `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="3.5" fill="#F1C40F"/>`
        }
        g.innerHTML = inner
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 300 160" className="w-full">
        {/* wire + voltmeter */}
        <polyline points={WIRE.map((w) => `${w.x},${w.y}`).join(' ')} fill="none" stroke="var(--color-muted)" strokeWidth={2} />
        <circle cx={150} cy={16} r={11} fill="var(--color-surface-2)" stroke="var(--color-muted)" strokeWidth={1.5} />
        <text x={150} y={20} textAnchor="middle" className="fill-ink text-[9px] font-bold">V</text>
        <text x={150} y={40} textAnchor="middle" className="fill-accent text-[10px] font-semibold">1.10 V</text>
        <g ref={eRef} />
        <text x={150} y={8} textAnchor="middle" className="fill-muted text-[8px]">e⁻ flow →</text>

        {/* left half-cell: Zn anode */}
        <path d="M 45 60 L 110 60 L 104 140 L 51 140 Z" fill="#5DADE2" opacity={0.14} stroke="var(--color-muted)" strokeWidth={1.5} />
        <rect x={71} y={46} width={8} height={80} fill="#7F8C8D" />
        <text x={77} y={150} textAnchor="middle" className="fill-muted text-[9px]">Zn anode (−)</text>
        <text x={77} y={100} textAnchor="middle" className="fill-[#E74C3C] text-[8px]">oxidation</text>

        {/* right half-cell: Cu cathode */}
        <path d="M 190 60 L 255 60 L 249 140 L 196 140 Z" fill="#5DADE2" opacity={0.14} stroke="var(--color-muted)" strokeWidth={1.5} />
        <rect x={221} y={46} width={8} height={80} fill="#E08A50" />
        <text x={223} y={150} textAnchor="middle" className="fill-muted text-[9px]">Cu cathode (+)</text>
        <text x={223} y={100} textAnchor="middle" className="fill-[#2ECC71] text-[8px]">reduction</text>

        {/* salt bridge */}
        <path d="M 90 70 Q 150 95 210 70" fill="none" stroke="#9B59B6" strokeWidth={6} opacity={0.5} />
        <text x={150} y={108} textAnchor="middle" className="fill-[#9B59B6] text-[8px]">salt bridge</text>
      </svg>

      <p className="mt-2 text-center text-sm text-muted">
        Electrons flow from the <span className="text-[#E74C3C]">zinc anode</span> (oxidation) through the wire to the{' '}
        <span className="text-[#E08A50]">copper cathode</span> (reduction) — that current is electricity. The salt bridge keeps the solutions neutral so it keeps flowing.
      </p>
    </div>
  )
}
