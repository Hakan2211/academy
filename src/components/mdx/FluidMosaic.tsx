import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// The cell membrane as a "fluid mosaic": a double layer of phospholipids
// (gently drifting) studded with proteins. Click a component to learn its job.
type Part = 'phospholipid' | 'channel' | 'carrier' | 'cholesterol'

const INFO: Record<Part, { label: string; job: string }> = {
  phospholipid: { label: 'Phospholipid bilayer', job: 'Two layers of fat molecules — water-loving heads facing out, water-hating tails inward. It’s self-sealing and only lets small, oily molecules pass freely.' },
  channel: { label: 'Channel protein', job: 'A water-filled pore that lets specific ions or water molecules slip through — too big or charged for the oily core.' },
  carrier: { label: 'Carrier protein', job: 'Grabs a specific molecule, changes shape, and ferries it across — used in facilitated diffusion and active transport.' },
  cholesterol: { label: 'Cholesterol', job: 'Wedged between the tails, it keeps the membrane at just the right fluidity — not too stiff, not too runny.' },
}

const HEADS = Array.from({ length: 18 }, (_, i) => 22 + i * 20)
const TOP_Y = 74
const BOT_Y = 150

export function FluidMosaic() {
  const [sel, setSel] = useState<Part>('phospholipid')
  const topRefs = useRef<Array<SVGGElement | null>>([])
  const botRefs = useRef<Array<SVGGElement | null>>([])

  useEffect(() => {
    let raf = 0
    const loop = (now: number) => {
      const t = now / 1000
      HEADS.forEach((_, i) => {
        const dy = Math.sin(t * 1.6 + i * 0.7) * 3
        const dx = Math.cos(t * 1.1 + i * 0.5) * 1.5
        topRefs.current[i]?.setAttribute('transform', `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`)
        botRefs.current[i]?.setAttribute('transform', `translate(${(-dx).toFixed(2)} ${(-dy).toFixed(2)})`)
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const hi = (p: Part) => sel === p

  const Lipid = ({ x, y, down }: { x: number; y: number; down: boolean }) => (
    <g>
      <circle cx={x} cy={y} r={6} fill={hi('phospholipid') ? '#FACC15' : '#FDCB6E'} />
      <line x1={x - 2.5} y1={down ? y + 6 : y - 6} x2={x - 2.5} y2={down ? y + 28 : y - 28} stroke="#b58a3a" strokeWidth={2} />
      <line x1={x + 2.5} y1={down ? y + 6 : y - 6} x2={x + 2.5} y2={down ? y + 28 : y - 28} stroke="#b58a3a" strokeWidth={2} />
    </g>
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 380 224" className="w-full">
        <text x={190} y={16} textAnchor="middle" className="fill-muted text-[10px]">
          outside the cell
        </text>

        {/* phospholipids */}
        {HEADS.map((x, i) => (
          <g key={`t${i}`} ref={(el) => { topRefs.current[i] = el }}>
            <Lipid x={x} y={TOP_Y} down />
          </g>
        ))}
        {HEADS.map((x, i) => (
          <g key={`b${i}`} ref={(el) => { botRefs.current[i] = el }}>
            <Lipid x={x} y={BOT_Y} down={false} />
          </g>
        ))}

        {/* channel protein at x~120 */}
        <g onClick={() => setSel('channel')} className="cursor-pointer">
          <rect x={110} y={62} width={9} height={100} rx={4} fill={hi('channel') ? '#FACC15' : '#4FD1C5'} />
          <rect x={127} y={62} width={9} height={100} rx={4} fill={hi('channel') ? '#FACC15' : '#4FD1C5'} />
        </g>

        {/* carrier protein at x~250 */}
        <g onClick={() => setSel('carrier')} className="cursor-pointer">
          <path d="M 240 60 q -14 52 0 104 l 26 0 q 14 -52 0 -104 z" fill={hi('carrier') ? '#FACC15' : '#A29BFE'} opacity={0.92} />
          <rect x={249} y={100} width={8} height={24} rx={3} fill="#0e1c2e" />
        </g>

        {/* cholesterol tucked in tails */}
        <g onClick={() => setSel('cholesterol')} className="cursor-pointer">
          {[180, 320].map((x, i) => (
            <ellipse key={i} cx={x} cy={112} rx={5} ry={12} fill={hi('cholesterol') ? '#FACC15' : '#FD79A8'} />
          ))}
        </g>

        <text x={190} y={216} textAnchor="middle" className="fill-muted text-[10px]">
          inside the cell
        </text>
      </svg>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {(Object.keys(INFO) as Array<Part>).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setSel(p)}
            className={cn(
              'rounded-full border px-2.5 py-0.5 text-xs transition-colors',
              hi(p) ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {INFO[p].label}
          </button>
        ))}
      </div>

      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        <span className="font-semibold text-ink">{INFO[sel].label}: </span>
        {INFO[sel].job}
      </p>
    </div>
  )
}
