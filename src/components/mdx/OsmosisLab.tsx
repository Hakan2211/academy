import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { cn } from '#/lib/cn'

// Osmosis: water crosses a membrane toward the saltier side. Drag the outside
// solute concentration and watch a cell swell, sit steady, or shrivel — and see
// why animal and plant cells react so differently.
type Cell = 'animal' | 'plant'
const INTERNAL = 50 // the cell's own solute level
const BASE = 56
const CX = 180
const CY = 112

export function OsmosisLab() {
  const [type, setType] = useState<Cell>('animal')
  const [ext, setExt] = useState(50) // external solute
  const cellRef = useRef<SVGGElement | null>(null)
  const targetRef = useRef(1)

  // tonicity: ext < internal → water IN (swell); ext > internal → water OUT
  const diff = INTERNAL - ext // >0 swell, <0 shrink
  targetRef.current = Math.max(0.55, Math.min(1.4, 1 + (diff / 100) * 0.8))

  useEffect(() => {
    let raf = 0
    let cur = 1
    const loop = () => {
      cur += (targetRef.current - cur) * 0.08
      cellRef.current?.setAttribute(
        'transform',
        `translate(${CX} ${CY}) scale(${cur.toFixed(3)}) translate(${-CX} ${-CY})`,
      )
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const tonic =
    Math.abs(diff) < 6 ? 'isotonic' : diff > 0 ? 'hypotonic' : 'hypertonic'
  const waterIn = diff > 6
  const waterOut = diff < -6

  const stateLabel =
    type === 'animal'
      ? tonic === 'hypotonic'
        ? 'Water floods in → the cell swells and may BURST (lysis).'
        : tonic === 'hypertonic'
          ? 'Water leaves → the cell shrivels (crenation).'
          : 'Balanced — no net water movement. The cell is normal.'
      : tonic === 'hypotonic'
        ? 'Water enters → the vacuole presses on the wall: firm and TURGID.'
        : tonic === 'hypertonic'
          ? 'Water leaves → the membrane pulls off the wall: PLASMOLYSED.'
          : 'Balanced — the cell is flaccid (neither firm nor shrunken).'

  // outside solute dots (more = saltier)
  const dots = Math.round((ext / 100) * 40)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex gap-2">
        {(['animal', 'plant'] as Array<Cell>).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              type === t ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {t} cell
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 224" className="w-full">
        {/* solution */}
        <rect x={10} y={10} width={340} height={204} rx={10} fill="#0d2233" />
        {Array.from({ length: dots }).map((_, i) => {
          const a = (i * 137.5) % 360
          const r = 40 + (i % 7) * 12
          const x = CX + Math.cos((a * Math.PI) / 180) * (r + 60)
          const y = CY + Math.sin((a * Math.PI) / 180) * (r + 36)
          return <circle key={i} cx={x} cy={y} r={2.4} fill="#7fb4e0" opacity={0.8} />
        })}

        {/* the cell */}
        <g ref={cellRef}>
          {type === 'plant' && (
            <rect x={CX - BASE - 8} y={CY - BASE - 4} width={(BASE + 8) * 2} height={(BASE + 4) * 2} rx={10} fill="none" stroke="#3a8f4a" strokeWidth={6} />
          )}
          <circle
            cx={CX}
            cy={CY}
            r={BASE}
            fill={type === 'plant' ? '#1e5fb433' : '#10243a'}
            stroke={type === 'plant' ? '#2ECC71' : '#4FD1C5'}
            strokeWidth={3}
          />
          {type === 'animal' && <circle cx={CX - 18} cy={CY - 12} r={16} fill="#5b3fb0" />}
        </g>

        {/* water-flow arrows */}
        {(waterIn || waterOut) &&
          [0, 90, 180, 270].map((a) => {
            const rad = (a * Math.PI) / 180
            const outer = 96
            const inner = 70
            const r1 = waterIn ? outer : inner
            const r2 = waterIn ? inner : outer
            const x1 = CX + Math.cos(rad) * r1
            const y1 = CY + Math.sin(rad) * r1
            const x2 = CX + Math.cos(rad) * r2
            const y2 = CY + Math.sin(rad) * r2
            return (
              <g key={a} stroke="#4F8CFF" strokeWidth={2.5}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} />
                <circle cx={x2} cy={y2} r={3} fill="#4F8CFF" stroke="none" />
              </g>
            )
          })}

        <text x={180} y={206} textAnchor="middle" className="fill-muted text-[10px]">
          {tonic} solution (outside solute: {ext}%)
        </text>
      </svg>

      <p className="my-2 min-h-[2.5rem] text-center text-sm text-muted">{stateLabel}</p>

      <SceneSlider label="Solute outside the cell" value={ext} min={0} max={100} step={1} unit="%" onChange={setExt} />
    </div>
  )
}
