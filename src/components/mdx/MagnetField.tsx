import { useMemo, useState } from 'react'
import { cn } from '#/lib/cn'

const RED = '#e17055'
const BLUE = '#0984e3'
const MY = 130 // magnets' vertical centre

type Pole = { x: number; y: number; q: number }

// Left magnet is fixed with its N pole facing the gap. Toggle the right magnet's
// facing pole: an S pole pulls the field lines across the gap (attract); an N
// pole shoves them apart (repel). Every little compass needle points along the
// local field — exactly what iron filings reveal around a real magnet.
export function MagnetField() {
  const [attract, setAttract] = useState(true)

  const poles = useMemo<Array<Pole>>(() => {
    // left magnet: S (−) at left end, N (+) facing the gap
    const left: Array<Pole> = [
      { x: 55, y: MY, q: -1 },
      { x: 125, y: MY, q: 1 },
    ]
    // right magnet: facing pole is S when attracting, N when repelling
    const right: Array<Pole> = attract
      ? [{ x: 255, y: MY, q: -1 }, { x: 325, y: MY, q: 1 }]
      : [{ x: 255, y: MY, q: 1 }, { x: 325, y: MY, q: -1 }]
    return [...left, ...right]
  }, [attract])

  const needles = useMemo(() => {
    const out: Array<{ x: number; y: number; a: number }> = []
    const insideMagnet = (x: number, y: number) =>
      (y > 112 && y < 148 && ((x > 48 && x < 132) || (x > 248 && x < 332)))
    for (const gx of [40, 75, 110, 145, 180, 215, 250, 285, 320]) {
      for (const gy of [48, 86, 124, 162, 200]) {
        if (insideMagnet(gx, gy)) continue
        let bx = 0
        let by = 0
        for (const p of poles) {
          const dx = gx - p.x
          const dy = gy - p.y
          const r = Math.max(14, Math.hypot(dx, dy))
          const f = p.q / (r * r * r)
          bx += f * dx
          by += f * dy
        }
        out.push({ x: gx, y: gy, a: Math.atan2(by, bx) })
      }
    }
    return out
  }, [poles])

  const rightLeftColor = attract ? BLUE : RED
  const rightRightColor = attract ? RED : BLUE

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {([['attract (S faces gap)', true], ['repel (N faces gap)', false]] as Array<[string, boolean]>).map(
          ([label, val]) => (
            <button
              key={label}
              type="button"
              onClick={() => setAttract(val)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                attract === val ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
              )}
            >
              {label}
            </button>
          ),
        )}
      </div>

      <svg viewBox="0 0 360 248" className="w-full">
        {/* compass needles tracing the field */}
        {needles.map((n, i) => {
          const tx = n.x + 9 * Math.cos(n.a)
          const ty = n.y + 9 * Math.sin(n.a)
          const bx = n.x - 9 * Math.cos(n.a)
          const by = n.y - 9 * Math.sin(n.a)
          return (
            <g key={i}>
              <line x1={n.x} y1={n.y} x2={bx} y2={by} stroke="var(--color-muted)" strokeWidth="2" opacity="0.5" />
              <line x1={n.x} y1={n.y} x2={tx} y2={ty} stroke={RED} strokeWidth="2" />
              <circle cx={n.x} cy={n.y} r="1.6" fill="var(--color-ink)" />
            </g>
          )
        })}

        {/* left magnet: S | N */}
        <rect x="50" y="116" width="40" height="28" fill={BLUE} />
        <rect x="90" y="116" width="40" height="28" fill={RED} />
        <text x="70" y="135" fill="#fff" fontSize="15" fontWeight="700" textAnchor="middle">S</text>
        <text x="110" y="135" fill="#fff" fontSize="15" fontWeight="700" textAnchor="middle">N</text>

        {/* right magnet */}
        <rect x="250" y="116" width="40" height="28" fill={rightLeftColor} />
        <rect x="290" y="116" width="40" height="28" fill={rightRightColor} />
        <text x="270" y="135" fill="#fff" fontSize="15" fontWeight="700" textAnchor="middle">{attract ? 'S' : 'N'}</text>
        <text x="310" y="135" fill="#fff" fontSize="15" fontWeight="700" textAnchor="middle">{attract ? 'N' : 'S'}</text>

        <text x="190" y="232" fill="var(--color-ink)" fontSize="14" fontWeight="600" textAnchor="middle">
          {attract ? 'Opposite poles → attract' : 'Like poles → repel'}
        </text>
      </svg>

      <p className="px-4 pb-4 pt-1 text-center text-sm text-muted">
        Each needle aligns with the magnetic field. Field lines run N → S outside a magnet, and crowd where the field is strong.
      </p>
    </div>
  )
}
