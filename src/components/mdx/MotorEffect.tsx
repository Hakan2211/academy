import { useEffect, useRef, useState } from 'react'

const RED = '#e17055'
const BLUE = '#0984e3'
const WX = 180 // wire x
const TOP = 60
const BOT = 184

// A current-carrying wire sitting in a magnetic field feels a push — the motor
// effect. The force is perpendicular to both the current and the field
// (Fleming's left-hand rule): thumb = force, first finger = field, second
// finger = current. Reverse either the current or the field and the wire is
// shoved the opposite way; reverse both and it's unchanged.
export function MotorEffect() {
  const [currentOut, setCurrentOut] = useState(true) // out of page
  const [fieldRight, setFieldRight] = useState(true)
  const outRef = useRef(currentOut)
  const fieldRef = useRef(fieldRight)
  const wireRef = useRef<SVGGElement>(null)
  const arrowRef = useRef<SVGGElement>(null)
  const yRef = useRef((TOP + BOT) / 2)

  useEffect(() => { outRef.current = currentOut }, [currentOut])
  useEffect(() => { fieldRef.current = fieldRight }, [fieldRight])

  useEffect(() => {
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      // +1 = force up (screen −y), −1 = down
      const fdir = (outRef.current ? 1 : -1) * (fieldRef.current ? 1 : -1)
      yRef.current -= fdir * 0.05 * dt
      if (yRef.current < TOP) yRef.current = BOT
      else if (yRef.current > BOT) yRef.current = TOP
      wireRef.current?.setAttribute('transform', `translate(0 ${(yRef.current - (TOP + BOT) / 2).toFixed(1)})`)
      // the force arrow rides along with the wire
      arrowRef.current?.setAttribute(
        'transform',
        `translate(0 ${(yRef.current - (TOP + BOT) / 2).toFixed(1)})`,
      )
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const fdir = (currentOut ? 1 : -1) * (fieldRight ? 1 : -1)
  const midY = (TOP + BOT) / 2

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        <button
          type="button"
          onClick={() => setCurrentOut((c) => !c)}
          className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:text-ink"
        >
          reverse current
        </button>
        <button
          type="button"
          onClick={() => setFieldRight((f) => !f)}
          className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:text-ink"
        >
          reverse field
        </button>
      </div>

      <svg viewBox="0 0 360 244" className="w-full">
        {/* magnet poles */}
        <rect x="20" y={TOP} width="44" height={BOT - TOP} fill={fieldRight ? RED : BLUE} />
        <rect x="296" y={TOP} width="44" height={BOT - TOP} fill={fieldRight ? BLUE : RED} />
        <text x="42" y={midY} fill="#fff" fontSize="18" fontWeight="700" textAnchor="middle">{fieldRight ? 'N' : 'S'}</text>
        <text x="318" y={midY} fill="#fff" fontSize="18" fontWeight="700" textAnchor="middle">{fieldRight ? 'S' : 'N'}</text>

        {/* field arrows (N → S) */}
        {[TOP + 26, midY, BOT - 26].map((y) => (
          <g key={y} stroke="var(--color-muted)" strokeWidth="1.5" opacity="0.6">
            <line x1="70" y1={y} x2="290" y2={y} />
            <path
              d={fieldRight ? `M 282 ${y - 5} L 290 ${y} L 282 ${y + 5}` : `M 78 ${y - 5} L 70 ${y} L 78 ${y + 5}`}
              fill="none"
            />
          </g>
        ))}

        {/* the wire (end-on) + its force arrow, translated together by rAF */}
        <g ref={arrowRef}>
          <g stroke={RED} strokeWidth="3" fill="none">
            <line x1={WX} y1={midY} x2={WX} y2={midY - fdir * 34} />
            <path d={`M ${WX - 6} ${midY - fdir * 26} L ${WX} ${midY - fdir * 34} L ${WX + 6} ${midY - fdir * 26}`} />
          </g>
          <text x={WX + 14} y={midY - fdir * 24} fill={RED} fontSize="13" fontWeight="600">F</text>
        </g>
        <g ref={wireRef}>
          <circle cx={WX} cy={midY} r="13" fill="#b08968" stroke="var(--color-ink)" strokeWidth="2" />
          {currentOut ? (
            <circle cx={WX} cy={midY} r="3.5" fill="var(--color-ink)" />
          ) : (
            <g stroke="var(--color-ink)" strokeWidth="2.5">
              <line x1={WX - 6} y1={midY - 6} x2={WX + 6} y2={midY + 6} />
              <line x1={WX - 6} y1={midY + 6} x2={WX + 6} y2={midY - 6} />
            </g>
          )}
        </g>
      </svg>

      <p className="px-4 pb-4 pt-1 text-center text-sm text-muted">
        Current ({currentOut ? 'out of page ⊙' : 'into page ⊗'}) across a field feels a force {fdir > 0 ? 'upward' : 'downward'} — the spin behind every electric motor.
      </p>
    </div>
  )
}
