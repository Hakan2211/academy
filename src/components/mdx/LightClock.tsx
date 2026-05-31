import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const T0 = 1500 // ms per tick (one round trip) for the stationary clock
const Y_TOP = 46
const Y_BOT = 150
const LX = 90 // stationary clock x
const RX0 = 210 // moving clock travel range
const RX1 = 366
const LIGHT = '#fdcb6e'

// triangle wave 0→1→0 over one cycle
function tri(cycles: number) {
  const f = ((cycles % 1) + 1) % 1
  return f < 0.5 ? f * 2 : 2 - f * 2
}

// A "light clock" ticks once each time a photon bounces between two mirrors. Set
// the clock moving and its photon must travel a longer, diagonal path to make the
// same bounce — so each tick takes longer. A moving clock genuinely runs slow.
// This isn't an illusion: it's what keeping c constant forces time itself to do.
export function LightClock() {
  const [beta, setBeta] = useState(0.6) // v/c
  const betaRef = useRef(beta)
  const lPhoton = useRef<SVGCircleElement>(null)
  const rPhoton = useRef<SVGCircleElement>(null)
  const rTop = useRef<SVGLineElement>(null)
  const rBot = useRef<SVGLineElement>(null)
  const rPath = useRef<SVGLineElement>(null)
  const lCount = useRef<SVGTextElement>(null)
  const rCount = useRef<SVGTextElement>(null)

  useEffect(() => { betaRef.current = beta }, [beta])

  useEffect(() => {
    let raf = 0
    let start = 0
    const loop = (now: number) => {
      if (!start) start = now
      const t = now - start
      const b = betaRef.current
      const gamma = 1 / Math.sqrt(1 - b * b)
      const TR = gamma * T0

      // stationary clock
      const ly = Y_TOP + (Y_BOT - Y_TOP) * tri(t / T0)
      lPhoton.current?.setAttribute('cy', ly.toFixed(1))

      // moving clock: drifts right and wraps; photon rides the mirrors
      const rx = RX0 + ((t * b * 0.12) % (RX1 - RX0))
      const ry = Y_TOP + (Y_BOT - Y_TOP) * tri(t / TR)
      rTop.current?.setAttribute('x1', (rx - 18).toFixed(1))
      rTop.current?.setAttribute('x2', (rx + 18).toFixed(1))
      rBot.current?.setAttribute('x1', (rx - 18).toFixed(1))
      rBot.current?.setAttribute('x2', (rx + 18).toFixed(1))
      rPath.current?.setAttribute('x1', rx.toFixed(1))
      rPath.current?.setAttribute('y1', String(Y_TOP))
      rPath.current?.setAttribute('x2', rx.toFixed(1))
      rPath.current?.setAttribute('y2', String(Y_BOT))
      rPhoton.current?.setAttribute('cx', rx.toFixed(1))
      rPhoton.current?.setAttribute('cy', ry.toFixed(1))

      if (lCount.current) lCount.current.textContent = String(Math.floor(t / T0))
      if (rCount.current) rCount.current.textContent = String(Math.floor(t / TR))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const gamma = 1 / Math.sqrt(1 - beta * beta)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 400 196" className="w-full">
        {/* stationary clock */}
        <text x={LX} y="28" fill="var(--color-muted)" fontSize="11" textAnchor="middle">at rest</text>
        <line x1={LX - 18} y1={Y_TOP} x2={LX + 18} y2={Y_TOP} stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
        <line x1={LX - 18} y1={Y_BOT} x2={LX + 18} y2={Y_BOT} stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
        <line x1={LX} y1={Y_TOP} x2={LX} y2={Y_BOT} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 3" />
        <circle ref={lPhoton} cx={LX} cy={Y_TOP} r="5" fill={LIGHT} />
        <text x={LX} y="176" fill="var(--color-muted)" fontSize="11" textAnchor="middle">
          ticks: <tspan ref={lCount} fill="var(--color-ink)" fontWeight="700">0</tspan>
        </text>

        {/* moving clock */}
        <text x={(RX0 + RX1) / 2} y="28" fill="var(--color-muted)" fontSize="11" textAnchor="middle">moving at v →</text>
        <line ref={rPath} x1={RX0} y1={Y_TOP} x2={RX0} y2={Y_BOT} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 3" />
        <line ref={rTop} x1={RX0 - 18} y1={Y_TOP} x2={RX0 + 18} y2={Y_TOP} stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
        <line ref={rBot} x1={RX0 - 18} y1={Y_BOT} x2={RX0 + 18} y2={Y_BOT} stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
        <circle ref={rPhoton} cx={RX0} cy={Y_TOP} r="5" fill={LIGHT} />
        <text x={(RX0 + RX1) / 2} y="176" fill="var(--color-muted)" fontSize="11" textAnchor="middle">
          ticks: <tspan ref={rCount} fill="var(--color-ink)" fontWeight="700">0</tspan>
        </text>
      </svg>

      <div className="px-4 pt-2">
        <SceneSlider label="Speed of moving clock" value={beta} min={0} max={0.95} step={0.05} unit="c" onChange={setBeta} />
        <p className="mt-2 pb-4 text-center text-xs text-muted">
          γ = {gamma.toFixed(2)} — the moving clock ticks {gamma.toFixed(2)}× slower. At everyday speeds γ ≈ 1 and the effect is invisible; near c it becomes enormous.
        </p>
      </div>
    </div>
  )
}
