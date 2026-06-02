import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// Plants do move — they just do it slowly, by growing. A shoot bends toward
// light (phototropism) because the hormone auxin builds up on the shaded side,
// making those cells grow longer. Move the light and watch the shoot follow.
export function PlantTropism() {
  const [light, setLight] = useState(80)
  const targetRef = useRef(0)
  const shootRef = useRef<SVGPathElement | null>(null)
  const leafRef = useRef<SVGGElement | null>(null)

  // bend target from light position (0 left … 100 right → −1 … +1)
  targetRef.current = (light - 50) / 50

  useEffect(() => {
    let raf = 0
    let cur = 0
    const loop = () => {
      cur += (targetRef.current - cur) * 0.06
      const tipX = 140 + cur * 64
      shootRef.current?.setAttribute('d', `M 140 172 Q ${(140 + cur * 30).toFixed(1)} 116 ${tipX.toFixed(1)} 58`)
      leafRef.current?.setAttribute('transform', `translate(${tipX.toFixed(1)} 58)`)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const sunX = 30 + (light / 100) * 220

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 280 200" className="mx-auto block h-[190px]">
        {/* sun */}
        <text x={sunX} y={28} textAnchor="middle" className="text-[22px]">☀️</text>
        {[0, 1, 2].map((i) => (
          <line key={i} x1={sunX - 16 + i * 16} y1={36} x2={sunX - 28 + i * 16} y2={70} stroke="#FDCB6E" strokeWidth={1.5} opacity={0.5} />
        ))}

        {/* pot */}
        <path d="M 118 172 L 162 172 L 156 196 L 124 196 Z" fill="#7b5a3a" />
        {/* shoot */}
        <path ref={shootRef} d="M 140 172 Q 140 116 140 58" fill="none" stroke="#3a6b2e" strokeWidth={7} strokeLinecap="round" />
        <g ref={leafRef} transform="translate(140 58)">
          <ellipse cx={-14} cy={-2} rx={16} ry={7} fill="#2e9b4a" transform="rotate(-25 -14 -2)" />
          <ellipse cx={14} cy={2} rx={16} ry={7} fill="#2e9b4a" transform="rotate(25 14 2)" />
        </g>
      </svg>

      <p className="mb-2 text-center text-sm text-muted">
        The shoot grows <span className="text-ink">toward the light</span> — auxin gathers on the shaded side, lengthening those cells so the stem curves over.
      </p>
      <SceneSlider label="Light position" value={light} min={0} max={100} step={1} unit="" onChange={setLight} />
      <p className="mt-2 text-center text-xs text-muted">Roots do the opposite — they grow <span className="text-ink">down</span>, toward gravity (gravitropism).</p>
    </div>
  )
}
