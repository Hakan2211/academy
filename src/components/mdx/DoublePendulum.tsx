import { useEffect, useRef, useState } from 'react'

const PIV = { x: 180, y: 78 }
const L = 70 // rod length (px)
const G = 9.8
const DT = 0.0025
const SUB = 10
const TRAIL = 70

// derivative of [th1, th2, w1, w2] for equal masses, equal lengths (=1 in these units)
function deriv(s: Array<number>) {
  const [th1, th2, w1, w2] = s
  const d = th1 - th2
  const den = 2 - Math.cos(2 * th1 - 2 * th2) // 2m1+m2 - m2cos(2Δ) with m1=m2=1
  const a1 =
    (-G * 3 * Math.sin(th1) - G * Math.sin(th1 - 2 * th2) - 2 * Math.sin(d) * (w2 * w2 + w1 * w1 * Math.cos(d))) / den
  const a2 =
    (2 * Math.sin(d) * (w1 * w1 * 2 + G * 2 * Math.cos(th1) + w2 * w2 * Math.cos(d))) / den
  return [w1, w2, a1, a2]
}

function rk4(s: Array<number>, dt: number) {
  const k1 = deriv(s)
  const s2 = s.map((v, i) => v + (dt / 2) * k1[i])
  const k2 = deriv(s2)
  const s3 = s.map((v, i) => v + (dt / 2) * k2[i])
  const k3 = deriv(s3)
  const s4 = s.map((v, i) => v + dt * k3[i])
  const k4 = deriv(s4)
  return s.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]))
}

type Refs = {
  rod1: SVGLineElement | null
  rod2: SVGLineElement | null
  bob1: SVGCircleElement | null
  bob2: SVGCircleElement | null
  trail: SVGPathElement | null
}

// The double pendulum is the poster child of *chaos*. These two start almost identically
// — one is nudged by a thousandth of a degree. For a moment they move as one… then they
// diverge completely. The laws are perfectly deterministic, yet the tiniest difference in
// the start explodes. That sensitivity is why we can't forecast weather weeks ahead.
export function DoublePendulum() {
  const [resetKey, setResetKey] = useState(0)
  const a = useRef<Refs>({ rod1: null, rod2: null, bob1: null, bob2: null, trail: null })
  const b = useRef<Refs>({ rod1: null, rod2: null, bob1: null, bob2: null, trail: null })

  useEffect(() => {
    let sA = [2.45, 2.45, 0, 0]
    let sB = [2.45, 2.45 + 0.012, 0, 0] // a hair's-breadth different
    const trailA: Array<[number, number]> = []
    const trailB: Array<[number, number]> = []

    const place = (s: Array<number>, refs: Refs, trail: Array<[number, number]>) => {
      const x1 = PIV.x + L * Math.sin(s[0])
      const y1 = PIV.y + L * Math.cos(s[0])
      const x2 = x1 + L * Math.sin(s[1])
      const y2 = y1 + L * Math.cos(s[1])
      refs.rod1?.setAttribute('x2', x1.toFixed(1))
      refs.rod1?.setAttribute('y2', y1.toFixed(1))
      refs.rod2?.setAttribute('x1', x1.toFixed(1))
      refs.rod2?.setAttribute('y1', y1.toFixed(1))
      refs.rod2?.setAttribute('x2', x2.toFixed(1))
      refs.rod2?.setAttribute('y2', y2.toFixed(1))
      refs.bob1?.setAttribute('cx', x1.toFixed(1))
      refs.bob1?.setAttribute('cy', y1.toFixed(1))
      refs.bob2?.setAttribute('cx', x2.toFixed(1))
      refs.bob2?.setAttribute('cy', y2.toFixed(1))
      trail.push([x2, y2])
      if (trail.length > TRAIL) trail.shift()
      refs.trail?.setAttribute('d', trail.map((p, i) => `${i ? 'L' : 'M'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' '))
    }

    let raf = 0
    const loop = () => {
      for (let i = 0; i < SUB; i++) {
        sA = rk4(sA, DT)
        sB = rk4(sB, DT)
      }
      place(sA, a.current, trailA)
      place(sB, b.current, trailB)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [resetKey])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 250" className="w-full">
        <circle cx={PIV.x} cy={PIV.y} r="4" fill="var(--color-muted)" />
        {/* pendulum B (the perturbed twin) drawn first, behind */}
        <path ref={(el) => { b.current.trail = el }} fill="none" stroke="#e84393" strokeWidth="1.5" opacity="0.35" />
        <line ref={(el) => { b.current.rod1 = el }} x1={PIV.x} y1={PIV.y} stroke="#e84393" strokeWidth="2" opacity="0.8" />
        <line ref={(el) => { b.current.rod2 = el }} stroke="#e84393" strokeWidth="2" opacity="0.8" />
        <circle ref={(el) => { b.current.bob1 = el }} r="7" fill="#e84393" />
        <circle ref={(el) => { b.current.bob2 = el }} r="9" fill="#e84393" />

        {/* pendulum A */}
        <path ref={(el) => { a.current.trail = el }} fill="none" stroke="#6c5ce7" strokeWidth="1.5" opacity="0.4" />
        <line ref={(el) => { a.current.rod1 = el }} x1={PIV.x} y1={PIV.y} stroke="#a29bfe" strokeWidth="2" />
        <line ref={(el) => { a.current.rod2 = el }} stroke="#a29bfe" strokeWidth="2" />
        <circle ref={(el) => { a.current.bob1 = el }} r="7" fill="#6c5ce7" />
        <circle ref={(el) => { a.current.bob2 = el }} r="9" fill="#6c5ce7" />
      </svg>

      <div className="flex items-center justify-between gap-3 px-4 pb-4 pt-1">
        <p className="text-sm text-muted">
          Two pendulums, released <span className="text-ink">0.012 rad apart</span>. Watch how long they agree.
        </p>
        <button
          type="button"
          onClick={() => setResetKey((k) => k + 1)}
          className="shrink-0 rounded-full border border-border px-4 py-1 text-sm text-muted transition-colors hover:text-ink"
        >
          ↺ Reset
        </button>
      </div>
    </div>
  )
}
