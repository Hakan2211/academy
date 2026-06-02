import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// A protein's job depends on its precise 3-D shape, and that shape is held by
// weak bonds. Heat it (or change the pH) and the bonds break: the chain unfolds
// and the protein stops working — it's "denatured". Drag the temperature.
const N = 11
const FOLDED: Array<[number, number]> = [
  [180, 60], [205, 52], [222, 72], [214, 98], [190, 108], [166, 100],
  [158, 76], [176, 62], [198, 78], [186, 92], [172, 84],
]
const UNFOLDED: Array<[number, number]> = Array.from({ length: N }, (_, i) => [40 + i * 28, 84])

export function ProteinFold() {
  const [temp, setTemp] = useState(37)
  const targetRef = useRef(0)
  const lineRef = useRef<SVGPolylineElement | null>(null)
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  // progress 0 (folded) → 1 (unfolded); denatures past ~55°C
  targetRef.current = Math.max(0, Math.min(1, (temp - 45) / 30))

  useEffect(() => {
    let raf = 0
    let cur = 0
    const loop = () => {
      cur += (targetRef.current - cur) * 0.08
      const pts: Array<string> = []
      for (let i = 0; i < N; i++) {
        const x = FOLDED[i][0] + (UNFOLDED[i][0] - FOLDED[i][0]) * cur
        const y = FOLDED[i][1] + (UNFOLDED[i][1] - FOLDED[i][1]) * cur
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
        const el = dotRefs.current[i]
        if (el) {
          el.setAttribute('cx', x.toFixed(1))
          el.setAttribute('cy', y.toFixed(1))
        }
      }
      lineRef.current?.setAttribute('points', pts.join(' '))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const denatured = temp >= 60
  const warming = temp >= 50 && temp < 60

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 150" className="w-full">
        <polyline ref={lineRef} points="" fill="none" stroke={denatured ? '#E74C3C' : '#A29BFE'} strokeWidth={2.5} />
        {Array.from({ length: N }).map((_, i) => (
          <circle
            key={i}
            ref={(el) => { dotRefs.current[i] = el }}
            cx={FOLDED[i][0]}
            cy={FOLDED[i][1]}
            r={7}
            fill={denatured ? '#E74C3C' : '#A29BFE'}
          />
        ))}
        <text x={180} y={142} textAnchor="middle" className="fill-muted text-[10px]">
          {denatured ? 'active site destroyed' : 'folded into a working shape (with its active site)'}
        </text>
      </svg>

      <p className="my-2 text-center text-sm font-semibold" style={{ color: denatured ? '#E74C3C' : warming ? '#FDCB6E' : '#2ECC71' }}>
        {denatured ? 'DENATURED — the shape is lost and the protein no longer works.' : warming ? 'Heating up — the bonds holding the shape are starting to break…' : 'Folded and functional.'}
      </p>

      <SceneSlider label="Temperature" value={temp} min={20} max={90} step={1} unit="°C" onChange={setTemp} />
    </div>
  )
}
