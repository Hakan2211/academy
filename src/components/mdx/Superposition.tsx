import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const X0 = 20
const X1 = 460
const MID_TOP = 66
const MID_BOT = 182
const A = 18
const K = (2 * Math.PI) / 110

// Two waves sharing space simply add — point by point. Line their crests up
// (phase 0) and they reinforce; offset by half a wavelength (phase 180°) and
// they cancel. Detune wave 2 slightly and the sum swells and fades: beats.
export function Superposition() {
  const [phase, setPhase] = useState(0) // degrees
  const [ratio, setRatio] = useState(1) // wave-2 frequency multiple

  const phaseRef = useRef(phase)
  const ratioRef = useRef(ratio)
  const aRef = useRef<SVGPathElement>(null)
  const bRef = useRef<SVGPathElement>(null)
  const sumRef = useRef<SVGPathElement>(null)

  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { ratioRef.current = ratio }, [ratio])

  useEffect(() => {
    let raf = 0
    let start = 0
    const w = 2 * Math.PI * 0.5
    const loop = (now: number) => {
      if (!start) start = now
      const t = (now - start) / 1000
      const phi = (phaseRef.current * Math.PI) / 180
      const r = ratioRef.current
      let da = ''
      let db = ''
      let ds = ''
      for (let x = X0; x <= X1; x += 4) {
        const ya = A * Math.sin(K * (x - X0) - w * t)
        const yb = A * Math.sin(K * r * (x - X0) - w * r * t + phi)
        da += `${x === X0 ? 'M' : 'L'}${x},${(MID_TOP - ya).toFixed(1)} `
        db += `${x === X0 ? 'M' : 'L'}${x},${(MID_TOP - yb).toFixed(1)} `
        ds += `${x === X0 ? 'M' : 'L'}${x},${(MID_BOT - (ya + yb)).toFixed(1)} `
      }
      aRef.current?.setAttribute('d', da.trim())
      bRef.current?.setAttribute('d', db.trim())
      sumRef.current?.setAttribute('d', ds.trim())
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const beats = Math.abs(ratio - 1) > 0.01
  const message = beats
    ? 'Beats — slightly different frequencies make the sum swell and fade.'
    : phase >= 150 && phase <= 210
      ? 'Destructive — crest meets trough, the waves cancel out.'
      : phase <= 30 || phase >= 330
        ? 'Constructive — crests align, the sum is twice as tall.'
        : 'Partly in step — the sum is somewhere in between.'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 480 240" className="w-full">
        <text x={X0} y="22" fill="var(--color-muted)" fontSize="11">wave 1 + wave 2</text>
        <line x1={X0} y1={MID_TOP} x2={X1} y2={MID_TOP} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 4" />
        <path ref={aRef} d="" fill="none" stroke="#74b9ff" strokeWidth="2" />
        <path ref={bRef} d="" fill="none" stroke="#fdcb6e" strokeWidth="2" />

        <text x={X0} y="124" fill="var(--color-muted)" fontSize="11">their sum</text>
        <line x1={X0} y1={MID_BOT} x2={X1} y2={MID_BOT} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 4" />
        <path ref={sumRef} d="" fill="none" stroke="var(--color-accent-2)" strokeWidth="3" strokeLinecap="round" />
      </svg>

      <div className="grid gap-4 px-4 pt-2 sm:grid-cols-2">
        <SceneSlider label="Phase shift (wave 2)" value={phase} min={0} max={360} step={15} unit="°" onChange={setPhase} />
        <SceneSlider label="Frequency (wave 2)" value={ratio} min={0.8} max={1.2} step={0.05} unit="×" onChange={setRatio} />
      </div>
      <p className="px-4 pb-4 pt-3 text-center text-sm text-muted">{message}</p>
    </div>
  )
}
