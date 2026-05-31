import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

type Part = { x: number; y: number; dx: number; dy: number }

const N = 22
const minX = 22
const maxX = 244
const minY = 26
const maxY = 204

// Temperature is the average kinetic energy of jiggling particles. Crank the
// slider and every particle speeds up (and the box warms blue→red); drop it
// toward zero and they nearly freeze in place.
export function ThermalJiggle() {
  const [temp, setTemp] = useState(40) // arbitrary "degrees"
  const tempRef = useRef(temp)
  const partsRef = useRef<Array<Part>>([])
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    tempRef.current = temp
  }, [temp])

  useEffect(() => {
    // seed particles once
    const parts: Array<Part> = []
    for (let i = 0; i < N; i++) {
      const angle = (i / N) * Math.PI * 2 + Math.random()
      const speed = 0.05 + Math.random() * 0.03
      parts.push({
        x: minX + Math.random() * (maxX - minX),
        y: minY + Math.random() * (maxY - minY),
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
      })
    }
    partsRef.current = parts

    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      const scale = Math.sqrt(Math.max(0, tempRef.current) / 40)
      const t = Math.min(1, tempRef.current / 100)
      const r = Math.round(116 + (255 - 116) * t)
      const g = Math.round(185 + (107 - 185) * t)
      const b = Math.round(255 + (107 - 255) * t)
      const fill = `rgb(${r},${g},${b})`

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]
        p.x += p.dx * scale * dt
        p.y += p.dy * scale * dt
        if (p.x < minX) { p.x = minX; p.dx = -p.dx }
        else if (p.x > maxX) { p.x = maxX; p.dx = -p.dx }
        if (p.y < minY) { p.y = minY; p.dy = -p.dy }
        else if (p.y > maxY) { p.y = maxY; p.dy = -p.dy }
        const el = dotRefs.current[i]
        if (el) {
          el.setAttribute('cx', p.x.toFixed(1))
          el.setAttribute('cy', p.y.toFixed(1))
          el.setAttribute('fill', fill)
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const keFrac = Math.min(1, temp / 100)
  const barBase = 210
  const barH = 190 * keFrac

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 240" className="w-full">
        {/* container box */}
        <rect x="14" y="18" width="240" height="194" rx="8" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2" />
        {Array.from({ length: N }).map((_, i) => (
          <circle
            key={i}
            ref={(el) => { dotRefs.current[i] = el }}
            cx={minX}
            cy={minY}
            r="6"
            fill="#74b9ff"
          />
        ))}

        {/* average-KE bar */}
        <line x1="284" y1={barBase} x2="344" y2={barBase} stroke="var(--color-border)" strokeWidth="2" />
        <rect x="296" y={barBase - barH} width="36" height={barH} rx="3" fill="#fdcb6e" />
        <text x="314" y="34" fill="var(--color-muted)" fontSize="11" textAnchor="middle">
          avg KE
        </text>
      </svg>

      <div className="px-4 pb-4">
        <SceneSlider label="Temperature" value={temp} min={0} max={100} step={1} unit="°" onChange={setTemp} />
        <p className="mt-2 text-center text-xs text-muted">
          Hotter = faster jiggling. Temperature measures the average kinetic energy of the particles.
        </p>
      </div>
    </div>
  )
}
