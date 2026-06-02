import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// The cell's internal scaffolding. Three filament types give a cell its shape
// and act as roads — a motor protein hauls a vesicle along a microtubule
// (animated). Pick a filament to learn its job.
type Fil = 'microfilament' | 'intermediate' | 'microtubule'

const INFO: Record<Fil, { label: string; color: string; job: string }> = {
  microfilament: { label: 'Microfilaments', color: '#FD79A8', job: 'Thin actin threads — they let cells crawl, change shape, and pinch in two when they divide.' },
  intermediate: { label: 'Intermediate filaments', color: '#FDCB6E', job: 'Tough rope-like fibres that bear mechanical stress and hold the cell’s shape.' },
  microtubule: { label: 'Microtubules', color: '#4FD1C5', job: 'Hollow tubes that act as highways — motor proteins haul cargo along them and pull chromosomes apart in division.' },
}

export function Cytoskeleton() {
  const [sel, setSel] = useState<Fil>('microtubule')
  const cargoRef = useRef<SVGGElement | null>(null)

  useEffect(() => {
    let raf = 0
    let last = 0
    let t = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      t += dt * 0.00012
      const u = (Math.sin(t * Math.PI * 2 - Math.PI / 2) + 1) / 2 // 0..1 ease
      const x = 50 + u * 270
      const g = cargoRef.current
      if (g) g.setAttribute('transform', `translate(${x.toFixed(1)} 150)`)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const lit = (f: Fil) => (sel === f ? INFO[f].color : undefined)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 380 220" className="w-full">
        <rect x={8} y={8} width={364} height={204} rx={16} fill="#0e1c2e" />

        {/* microfilaments — thin web, top */}
        {[40, 70, 100].map((y, i) => (
          <path
            key={`mf${i}`}
            d={`M 30 ${y} q 90 ${i % 2 ? -18 : 18} 170 0 q 90 ${i % 2 ? 18 : -18} 150 0`}
            fill="none"
            stroke={lit('microfilament') ?? '#FD79A8'}
            strokeOpacity={sel === 'microfilament' ? 1 : 0.45}
            strokeWidth={sel === 'microfilament' ? 2.4 : 1.4}
          />
        ))}

        {/* intermediate filaments — rope-like, diagonal */}
        {[0, 1, 2].map((i) => (
          <path
            key={`if${i}`}
            d={`M ${40 + i * 110} 200 L ${90 + i * 110} 30`}
            fill="none"
            stroke={lit('intermediate') ?? '#FDCB6E'}
            strokeOpacity={sel === 'intermediate' ? 1 : 0.4}
            strokeWidth={sel === 'intermediate' ? 4 : 2.4}
            strokeDasharray="2 3"
          />
        ))}

        {/* microtubule — the highway */}
        <line x1={40} y1={160} x2={340} y2={160} stroke={lit('microtubule') ?? '#4FD1C5'} strokeOpacity={sel === 'microtubule' ? 1 : 0.55} strokeWidth={sel === 'microtubule' ? 8 : 6} strokeLinecap="round" />
        <line x1={40} y1={160} x2={340} y2={160} stroke="#0e1c2e" strokeWidth={1.5} strokeDasharray="3 6" />

        {/* motor protein + vesicle cargo */}
        <g ref={cargoRef} transform="translate(50 150)">
          <line x1={-4} y1={10} x2={-7} y2={2} stroke="#fff" strokeWidth={2} />
          <line x1={4} y1={10} x2={7} y2={2} stroke="#fff" strokeWidth={2} />
          <circle cx={0} cy={-10} r={13} fill="#2ECC71" stroke="#7CFC9A" strokeWidth={2} />
        </g>
        <text x={190} y={184} textAnchor="middle" className="fill-muted text-[9px]">
          motor protein hauls a vesicle along the microtubule
        </text>
      </svg>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(Object.keys(INFO) as Array<Fil>).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setSel(f)}
            className={cn(
              'rounded-full border px-2.5 py-0.5 text-xs transition-colors',
              sel === f ? 'text-white' : 'border-border text-muted hover:text-ink',
            )}
            style={{ borderColor: INFO[f].color, background: sel === f ? INFO[f].color : undefined }}
          >
            {INFO[f].label}
          </button>
        ))}
      </div>

      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        <span className="font-semibold" style={{ color: INFO[sel].color }}>
          {INFO[sel].label}:{' '}
        </span>
        {INFO[sel].job}
      </p>
    </div>
  )
}
