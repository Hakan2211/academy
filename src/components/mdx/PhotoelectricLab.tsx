import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const N = 12
const START = 48
const PLATE = 300
const F0 = 4 // threshold frequency (arbitrary units, ×10¹⁴ Hz)

// frequency → colour (red at low f, violet at high f)
const STOPS = ['#e74c3c', '#e67e22', '#f1c40f', '#27ae60', '#0984e3', '#4F8CFF']
function hex(c: string) {
  return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]
}
function freqColor(f: number) {
  const t = Math.max(0, Math.min(1, (f - 1) / 8))
  const x = t * (STOPS.length - 1)
  const i = Math.min(STOPS.length - 2, Math.floor(x))
  const fr = x - i
  const a = hex(STOPS[i])
  const b = hex(STOPS[i + 1])
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * fr)},${Math.round(a[1] + (b[1] - a[1]) * fr)},${Math.round(a[2] + (b[2] - a[2]) * fr)})`
}

type Electron = { x: number; y: number; vx: number; vy: number; active: boolean }

// Einstein's photoelectric effect: light is a stream of photons, each carrying
// energy E = hf. Below a threshold frequency no electron is ever knocked out, no
// matter how bright the light — because a single weak photon just can't do it.
// Above it, brighter light ejects MORE electrons; higher frequency makes each one
// FASTER. This is the experiment that forced physics to call light a particle.
export function PhotoelectricLab() {
  const [freq, setFreq] = useState(6)
  const [intensity, setIntensity] = useState(60)
  const freqRef = useRef(freq)
  const intRef = useRef(intensity)
  const photonRefs = useRef<Array<SVGCircleElement | null>>([])
  const elecRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => { freqRef.current = freq }, [freq])
  useEffect(() => { intRef.current = intensity }, [intensity])

  useEffect(() => {
    const px = Array.from({ length: N }, (_, i) => START + (i / N) * (PLATE - START))
    const ys = Array.from({ length: N }, (_, i) => 48 + i * (132 / (N - 1)))
    const elec: Array<Electron> = Array.from({ length: N }, () => ({ x: 0, y: 0, vx: 0, vy: 0, active: false }))
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      const f = freqRef.current
      const activeCount = Math.round((intRef.current / 100) * N)
      const color = freqColor(f)
      const ke = Math.max(0, f - F0)
      const speed = 0.06 + 0.05 * ke

      for (let i = 0; i < N; i++) {
        const pel = photonRefs.current[i]
        const on = i < activeCount
        if (pel) {
          pel.setAttribute('opacity', on ? '0.95' : '0')
          pel.setAttribute('fill', color)
          pel.setAttribute('cx', px[i].toFixed(1))
          pel.setAttribute('cy', ys[i].toFixed(1))
        }
        if (on) {
          px[i] += 0.22 * dt
          if (px[i] >= PLATE) {
            px[i] = START
            if (f >= F0 && !elec[i].active) {
              elec[i] = { x: PLATE, y: ys[i], vx: -speed, vy: (i % 2 === 0 ? -1 : 1) * speed * 0.4, active: true }
            }
          }
        }

        const e = elec[i]
        const eel = elecRefs.current[i]
        if (e.active) {
          e.x += e.vx * dt
          e.y += e.vy * dt
          if (e.x < 0 || e.y < -10 || e.y > 230) e.active = false
        }
        if (eel) {
          eel.setAttribute('opacity', e.active ? '1' : '0')
          eel.setAttribute('cx', e.x.toFixed(1))
          eel.setAttribute('cy', e.y.toFixed(1))
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const below = freq < F0
  const barH = 70 * (freq / 9)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 380 220" className="w-full">
        {/* lamp */}
        <rect x="14" y="92" width="26" height="36" rx="5" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
        <text x="27" y="146" fill="var(--color-muted)" fontSize="10" textAnchor="middle">light</text>

        {/* metal plate */}
        <rect x={PLATE} y="40" width="12" height="140" rx="2" fill="#b2bec3" />
        <text x={PLATE + 6} y="196" fill="var(--color-muted)" fontSize="10" textAnchor="middle">metal</text>

        {/* photons */}
        {Array.from({ length: N }).map((_, i) => (
          <circle key={`p${i}`} ref={(el) => { photonRefs.current[i] = el }} cx={START} cy={48} r="4" fill="#fff" opacity="0" />
        ))}
        {/* ejected electrons */}
        {Array.from({ length: N }).map((_, i) => (
          <circle key={`e${i}`} ref={(el) => { elecRefs.current[i] = el }} cx="0" cy="0" r="4.5" fill="#0984e3" opacity="0" />
        ))}

        {/* photon-energy gauge */}
        <text x="356" y="40" fill="var(--color-muted)" fontSize="9" textAnchor="middle">E = hf</text>
        <line x1="356" y1="120" x2="356" y2="50" stroke="var(--color-border)" strokeWidth="1" />
        <rect x="350" y={120 - barH} width="12" height={barH} rx="2" fill={freqColor(freq)} />
        {/* threshold marker */}
        <line x1="344" y1={120 - 70 * (F0 / 9)} x2="368" y2={120 - 70 * (F0 / 9)} stroke="var(--color-ink)" strokeWidth="1.5" strokeDasharray="3 2" />
        <text x="356" y="134" fill="var(--color-muted)" fontSize="8" textAnchor="middle">f₀</text>

        {below && (
          <text x="170" y="115" fill="#e17055" fontSize="13" fontWeight="700" textAnchor="middle">
            below threshold — no electrons
          </text>
        )}
      </svg>

      <div className="grid gap-4 px-4 pt-2 sm:grid-cols-2">
        <SceneSlider label="Frequency (colour)" value={freq} min={1} max={9} step={1} unit="" onChange={setFreq} />
        <SceneSlider label="Intensity (brightness)" value={intensity} min={0} max={100} step={5} unit="%" onChange={setIntensity} />
      </div>
      <p className="px-4 pb-4 pt-3 text-center text-xs text-muted">
        Brightness sets how many photons arrive — and so how many electrons fly off. Frequency sets each photon's energy — and so how fast each electron leaves. Below f₀, brightness does nothing.
      </p>
    </div>
  )
}
