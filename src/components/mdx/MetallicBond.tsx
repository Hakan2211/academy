import { useEffect, useRef, useState } from 'react'

// Metallic bonding: metal atoms pool their valence electrons into a shared
// "sea" that flows around fixed positive ions. The free electrons explain why
// metals conduct electricity and why they bend instead of shatter.
export function MetallicBond() {
  const [current, setCurrent] = useState(false)
  const eRef = useRef<SVGGElement | null>(null)
  const electrons = useRef(
    Array.from({ length: 22 }, (_, i) => ({
      x: 30 + (i % 11) * 26 + ((i / 11) | 0) * 13,
      y: 50 + ((i / 11) | 0) * 50 + (i % 2) * 14,
      vx: (Math.sin(i * 3.1) * 0.5),
      vy: Math.cos(i * 1.7) * 0.5,
    })),
  )

  useEffect(() => {
    let raf = 0
    const loop = () => {
      const g = eRef.current
      if (g) {
        let inner = ''
        for (const e of electrons.current) {
          // random-ish drift; current adds a rightward bias
          e.x += e.vx + (current ? 1.6 : 0)
          e.y += e.vy
          if (e.x > 300) e.x = 12
          if (e.x < 8) e.x = 296
          if (e.y > 150) e.y = 40
          if (e.y < 36) e.y = 148
          inner += `<circle cx="${e.x.toFixed(1)}" cy="${e.y.toFixed(1)}" r="3.5" fill="#F1C40F" opacity="0.9"/>`
        }
        g.innerHTML = inner
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [current])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 312 175" className="w-full">
        <rect x={1} y={1} width={310} height={173} rx={12} fill="var(--color-surface-2)" stroke="var(--color-border)" />
        {/* lattice of fixed positive ions */}
        {Array.from({ length: 3 }).map((_, r) =>
          Array.from({ length: 5 }).map((_, c) => (
            <g key={`${r}-${c}`}>
              <circle cx={45 + c * 56} cy={50 + r * 42} r={15} fill="#E08A50" />
              <text x={45 + c * 56} y={54 + r * 42} textAnchor="middle" className="fill-white text-[10px] font-bold">+</text>
            </g>
          )),
        )}
        {/* the electron sea */}
        <g ref={eRef} />
      </svg>

      <p className="my-2 text-center text-sm text-muted">
        Fixed <span className="text-[#E08A50] font-semibold">positive ions</span> sit in a lattice; a sea of{' '}
        <span className="font-semibold text-[#F1C40F]">free electrons</span> drifts between them.
        {current ? ' A voltage pushes the whole sea one way — that flow is an electric current.' : ''}
      </p>

      <button
        type="button"
        onClick={() => setCurrent((c) => !c)}
        className="w-full rounded-lg border border-accent bg-accent/10 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
      >
        {current ? 'Switch off the voltage' : 'Apply a voltage (drive a current)'}
      </button>
    </div>
  )
}
