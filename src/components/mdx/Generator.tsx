import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const RED = '#e17055'
const BLUE = '#0984e3'
const CX = 95
const CY = 120
const R = 46
const GX0 = 210
const GX1 = 360
const GMID = 120

// Spin a coil between magnet poles and you turn motion into electricity. As the
// loop rotates, the field through it rises and falls, so the induced voltage
// swings smoothly positive then negative — alternating current (AC). Spin it
// faster and the output cycles quicker *and* climbs higher. This is how almost
// all the world's electricity is generated.
export function Generator() {
  const [speed, setSpeed] = useState(3)
  const speedRef = useRef(speed)
  const ampRef = useRef(0)
  const loopRef = useRef<SVGGElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)

  const ampPx = 12 + speed * 9 // peak EMF grows with rotation speed
  useEffect(() => { speedRef.current = speed }, [speed])
  useEffect(() => { ampRef.current = ampPx }, [ampPx])

  useEffect(() => {
    let raf = 0
    let last = 0
    let theta = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      const omega = 0.0009 * speedRef.current
      theta += omega * dt
      const deg = (theta * 180) / Math.PI
      loopRef.current?.setAttribute('transform', `rotate(${deg.toFixed(1)} ${CX} ${CY})`)
      // marker sweeps across two cycles of the trace
      const span = Math.PI * 4
      const mp = theta % span
      const x = GX0 + (mp / span) * (GX1 - GX0)
      const y = GMID - ampRef.current * Math.sin(mp)
      if (dotRef.current) {
        dotRef.current.setAttribute('cx', x.toFixed(1))
        dotRef.current.setAttribute('cy', y.toFixed(1))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // static AC trace (two cycles) at current amplitude
  const span = Math.PI * 4
  const tracePts: Array<string> = []
  for (let x = GX0; x <= GX1; x += 4) {
    const ph = ((x - GX0) / (GX1 - GX0)) * span
    tracePts.push(`${x === GX0 ? 'M' : 'L'} ${x} ${(GMID - ampPx * Math.sin(ph)).toFixed(1)}`)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 380 240" className="w-full">
        {/* poles + field */}
        <rect x="18" y="56" width="26" height="128" fill={RED} />
        <rect x="146" y="56" width="26" height="128" fill={BLUE} />
        <text x="31" y="125" fill="#fff" fontSize="14" fontWeight="700" textAnchor="middle">N</text>
        <text x="159" y="125" fill="#fff" fontSize="14" fontWeight="700" textAnchor="middle">S</text>
        {[84, 120, 156].map((y) => (
          <line key={y} x1="48" y1={y} x2="144" y2={y} stroke="var(--color-muted)" strokeWidth="1" opacity="0.4" strokeDasharray="3 4" />
        ))}

        {/* rotating loop */}
        <g ref={loopRef}>
          <line x1={CX - R} y1={CY} x2={CX + R} y2={CY} stroke="var(--color-ink)" strokeWidth="2.5" />
          <circle cx={CX - R} cy={CY} r="7" fill={RED} />
          <circle cx={CX + R} cy={CY} r="7" fill={BLUE} />
        </g>
        <circle cx={CX} cy={CY} r="3" fill="var(--color-muted)" />

        {/* AC output graph */}
        <line x1={GX0} y1={GMID} x2={GX1} y2={GMID} stroke="var(--color-border)" strokeWidth="1" />
        <line x1={GX0} y1="56" x2={GX0} y2="184" stroke="var(--color-border)" strokeWidth="1" />
        <path d={tracePts.join(' ')} fill="none" stroke="var(--color-accent-2)" strokeWidth="2" />
        <circle ref={dotRef} cx={GX0} cy={GMID} r="5" fill={RED} />
        <text x={GX0 + 6} y="68" fill="var(--color-muted)" fontSize="11">voltage</text>
        <text x={GX1} y={GMID + 16} fill="var(--color-muted)" fontSize="10" textAnchor="end">time →</text>
      </svg>

      <div className="px-4 pb-4">
        <SceneSlider label="Rotation speed" value={speed} min={1} max={5} step={0.5} unit="×" onChange={setSpeed} />
        <p className="mt-2 text-center text-xs text-muted">
          One rotation = one full AC cycle. Faster spinning means higher frequency and a bigger peak voltage.
        </p>
      </div>
    </div>
  )
}
