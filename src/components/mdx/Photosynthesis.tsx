import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// Photosynthesis turns light, water, and carbon dioxide into glucose and oxygen.
// Drag the light intensity: more light speeds the reaction (faster O₂ bubbles) —
// until something else becomes the limiting factor.
const NB = 6

export function Photosynthesis() {
  const [light, setLight] = useState(60)
  const lightRef = useRef(60)
  const bubbleRefs = useRef<Array<SVGCircleElement | null>>([])

  lightRef.current = light

  useEffect(() => {
    const ys = Array.from({ length: NB }, (_, i) => 150 - i * 20)
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      const speed = (lightRef.current / 100) * 0.09
      for (let i = 0; i < NB; i++) {
        ys[i] -= speed * dt
        if (ys[i] < 24) ys[i] = 150
        const el = bubbleRefs.current[i]
        if (el) {
          el.setAttribute('cy', ys[i].toFixed(1))
          el.setAttribute('opacity', lightRef.current < 4 ? '0' : '0.85')
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 176" className="w-full">
        {/* sun + rays */}
        <circle cx={40} cy={36} r={16} fill="#FDCB6E" opacity={0.4 + (light / 100) * 0.6} />
        {[0, 45, 90, 135].map((a) => {
          const r = (a * Math.PI) / 180
          return <line key={a} x1={40 + Math.cos(r) * 20} y1={36 + Math.sin(r) * 20} x2={40 + Math.cos(r) * 28} y2={36 + Math.sin(r) * 28} stroke="#FDCB6E" strokeWidth={2} opacity={0.4 + (light / 100) * 0.6} />
        })}

        {/* chloroplast */}
        <ellipse cx={180} cy={100} rx={62} ry={40} fill="#1f8b3a" stroke="#7CFC9A" strokeWidth={2.5} />
        {[-22, -8, 6, 20].map((ox) => (
          <ellipse key={ox} cx={180 + ox} cy={100} rx={5} ry={16} fill="#0e5021" />
        ))}
        <text x={180} y={156} textAnchor="middle" className="fill-muted text-[10px]">chloroplast</text>

        {/* inputs */}
        <g stroke="#94a3b8" strokeWidth={2} fill="none">
          <line x1={70} y1={120} x2={120} y2={108} />
          <line x1={180} y1={166} x2={180} y2={144} />
        </g>
        <text x={66} y={134} textAnchor="middle" className="fill-muted text-[9px]">CO₂</text>
        <text x={180} y={176} textAnchor="middle" className="fill-muted text-[9px]">water</text>

        {/* outputs */}
        <text x={300} y={84} textAnchor="middle" className="fill-[#FDCB6E] text-[10px] font-semibold">glucose</text>
        <text x={300} y={150} textAnchor="middle" className="fill-[#7CFC9A] text-[10px] font-semibold">oxygen</text>

        {/* O2 bubbles rising on the right */}
        {Array.from({ length: NB }).map((_, i) => (
          <circle key={i} ref={(el) => { bubbleRefs.current[i] = el }} cx={262 + (i % 2) * 14} cy={150} r={4} fill="#7CFC9A" opacity={0.85} />
        ))}
      </svg>

      <p className="mb-1 text-center text-xs font-mono text-muted">
        carbon dioxide + water → <span className="text-[#FDCB6E]">glucose</span> + <span className="text-[#7CFC9A]">oxygen</span>
      </p>
      <p className="mb-2 text-center text-sm text-muted">
        {light < 4
          ? 'In the dark, photosynthesis stops — no light, no reaction.'
          : light < 85
            ? 'More light → a faster rate (watch the oxygen bubbles speed up).'
            : 'Lots of light — now CO₂ or temperature may become the limiting factor.'}
      </p>

      <SceneSlider label="Light intensity" value={light} min={0} max={100} step={1} unit="%" onChange={setLight} />
    </div>
  )
}
