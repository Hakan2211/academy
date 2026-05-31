import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const X0 = 20
const X1 = 460
const MID = 110
const PX_PER_M = 60 // screen pixels per metre of wavelength

// A live travelling transverse wave. Drag amplitude, wavelength, and frequency
// and watch the shape — and the speed v = fλ — respond. The wave itself is
// rAF-driven (path mutated each frame); the markers and readout come from state.
// Reused across Waves & Wavelength, Frequency & Period, and Wave Speed.
export function WaveLab() {
  const [amplitude, setAmplitude] = useState(34) // px
  const [wavelength, setWavelength] = useState(3) // m
  const [frequency, setFrequency] = useState(1) // Hz

  const ampRef = useRef(amplitude)
  const wlRef = useRef(wavelength)
  const freqRef = useRef(frequency)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => { ampRef.current = amplitude }, [amplitude])
  useEffect(() => { wlRef.current = wavelength }, [wavelength])
  useEffect(() => { freqRef.current = frequency }, [frequency])

  useEffect(() => {
    let raf = 0
    let start = 0
    const loop = (now: number) => {
      if (!start) start = now
      const t = (now - start) / 1000
      const A = ampRef.current
      const k = (2 * Math.PI) / (wlRef.current * PX_PER_M)
      const w = 2 * Math.PI * freqRef.current
      let d = ''
      for (let x = X0; x <= X1; x += 4) {
        const y = MID - A * Math.sin(k * (x - X0) - w * t)
        d += `${x === X0 ? 'M' : 'L'}${x},${y.toFixed(1)} `
      }
      pathRef.current?.setAttribute('d', d.trim())
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const lambdaPx = wavelength * PX_PER_M
  const speed = frequency * wavelength
  const period = 1 / frequency

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 480 230" className="w-full">
        {/* rest axis */}
        <line x1={X0} y1={MID} x2={X1} y2={MID} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 4" />

        {/* wavelength marker */}
        <line x1={40} y1={48} x2={40 + lambdaPx} y2={48} stroke="#00d2d3" strokeWidth="2" />
        <line x1={40} y1={44} x2={40} y2={52} stroke="#00d2d3" strokeWidth="2" />
        <line x1={40 + lambdaPx} y1={44} x2={40 + lambdaPx} y2={52} stroke="#00d2d3" strokeWidth="2" />
        <text x={40 + lambdaPx / 2} y={40} fill="#00d2d3" fontSize="13" textAnchor="middle">
          wavelength λ
        </text>

        {/* amplitude marker */}
        <line x1={28} y1={MID} x2={28} y2={MID - amplitude} stroke="#fdcb6e" strokeWidth="2" />
        <text x={34} y={MID - amplitude / 2 + 4} fill="#fdcb6e" fontSize="13">
          A
        </text>

        {/* the wave */}
        <path ref={pathRef} d="" fill="none" stroke="var(--color-accent-2)" strokeWidth="3" strokeLinecap="round" />

        <text x={X1} y={MID + 60} fill="var(--color-muted)" fontSize="11" textAnchor="end">
          wave travels →
        </text>
      </svg>

      <div className="grid gap-4 px-4 pt-2 sm:grid-cols-3">
        <SceneSlider label="Amplitude" value={amplitude} min={10} max={50} step={1} unit="px" onChange={setAmplitude} />
        <SceneSlider label="Wavelength" value={wavelength} min={1} max={5} step={0.5} unit="m" onChange={setWavelength} />
        <SceneSlider label="Frequency" value={frequency} min={0.5} max={3} step={0.5} unit="Hz" onChange={setFrequency} />
      </div>
      <p className="px-4 pb-4 pt-3 text-center text-sm">
        <span className="font-mono">v = f × λ = {frequency} × {wavelength} = </span>
        <span className="font-semibold text-accent-2">{speed.toFixed(1)} m/s</span>
        <span className="text-muted">  ·  period T = {period.toFixed(2)} s</span>
      </p>
    </div>
  )
}
