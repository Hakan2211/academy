import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// Collision theory: particles must collide with enough energy (above the
// activation energy) AND in the right orientation to react. Raise the
// temperature and the particles move faster, so more collisions succeed.
export function CollisionTheory() {
  const [temp, setTemp] = useState(40)
  const gRef = useRef<SVGGElement | null>(null)
  const tempRef = useRef(temp)
  tempRef.current = temp

  const particles = useRef(
    Array.from({ length: 7 }, (_, i) => ({
      x: 30 + (i * 41) % 260,
      y: 25 + (i * 53) % 110,
      vx: Math.sin(i * 2.3),
      vy: Math.cos(i * 1.9),
    })),
  )
  const flash = useRef<{ x: number; y: number; life: number } | null>(null)

  useEffect(() => {
    let raf = 0
    let cool = 0
    const loop = () => {
      const speed = 0.5 + tempRef.current / 40 // temperature → speed
      const ps = particles.current
      for (const p of ps) {
        p.x += p.vx * speed
        p.y += p.vy * speed
        if (p.x < 12 || p.x > 288) p.vx *= -1
        if (p.y < 12 || p.y > 138) p.vy *= -1
        p.x = Math.max(12, Math.min(288, p.x))
        p.y = Math.max(12, Math.min(138, p.y))
      }
      // check a collision → success if fast enough (temperature high)
      cool--
      if (cool <= 0) {
        for (let i = 0; i < ps.length; i++) {
          for (let j = i + 1; j < ps.length; j++) {
            const dx = ps[i].x - ps[j].x
            const dy = ps[i].y - ps[j].y
            if (dx * dx + dy * dy < 360) {
              if (tempRef.current > 35 && Math.random() < tempRef.current / 120) {
                flash.current = { x: (ps[i].x + ps[j].x) / 2, y: (ps[i].y + ps[j].y) / 2, life: 18 }
                cool = 25
              }
            }
          }
        }
      }
      const g = gRef.current
      if (g) {
        let inner = ''
        for (const p of ps) inner += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="8" fill="#9B59B6"/>`
        if (flash.current && flash.current.life > 0) {
          const f = flash.current
          inner += `<circle cx="${f.x.toFixed(1)}" cy="${f.y.toFixed(1)}" r="${(24 - f.life).toFixed(1)}" fill="#2ECC71" opacity="${(f.life / 18).toFixed(2)}"/>`
          f.life--
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
      <svg viewBox="0 0 300 150" className="w-full">
        <rect x={1} y={1} width={298} height={148} rx={12} fill="var(--color-surface-2)" stroke="var(--color-border)" />
        <g ref={gRef} />
      </svg>

      <p className="my-2 text-center text-sm text-muted">
        {temp < 35
          ? 'At low temperature, collisions are too gentle — most just bounce off without reacting.'
          : 'Higher temperature → faster particles → more collisions clear the activation energy and react (green flashes).'}
      </p>

      <SceneSlider label="Temperature" value={temp} min={10} max={90} step={1} unit="°C" onChange={(v) => setTemp(Math.round(v))} />
    </div>
  )
}
