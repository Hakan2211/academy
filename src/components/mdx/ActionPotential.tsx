import { useEffect, useRef } from 'react'

// A nerve impulse is a wave of electrical change called an action potential. The
// membrane voltage spikes from its resting −70 mV up past +40 and back. Watch a
// marker trace the spike and name each phase.
const X0 = 40
const X1 = 300
const yFor = (mv: number) => 150 - (mv + 90) * 0.9 // −90→150, +40→33

function apMv(x: number): number {
  // piecewise action potential across x
  if (x < 110) return -70
  if (x < 142) return -70 + ((x - 110) / 32) * 110 // depolarise to +40
  if (x < 178) return 40 - ((x - 142) / 36) * 120 // repolarise to −80
  if (x < 214) return -80 + ((x - 178) / 36) * 10 // recover to −70
  return -70
}

function phase(x: number): string {
  if (x < 108) return 'Resting (−70 mV): the membrane sits ready, polarised by the Na⁺/K⁺ pump.'
  if (x < 143) return 'Depolarisation: Na⁺ channels fly open and sodium rushes IN — the voltage shoots up.'
  if (x < 179) return 'Repolarisation: K⁺ channels open and potassium flows OUT — the voltage drops back down.'
  if (x < 215) return 'Refractory period: a brief overshoot, then recovery before the neuron can fire again.'
  return 'Resting again — ready for the next impulse.'
}

const POINTS = (() => {
  const p: Array<string> = []
  for (let x = X0; x <= X1; x += 2) p.push(`${x},${yFor(apMv(x)).toFixed(1)}`)
  return p.join(' ')
})()

export function ActionPotential() {
  const markRef = useRef<SVGCircleElement | null>(null)
  const labelRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    let raf = 0
    const loop = (now: number) => {
      const x = X0 + ((now / 2600) % 1) * (X1 - X0)
      const y = yFor(apMv(x))
      markRef.current?.setAttribute('cx', x.toFixed(1))
      markRef.current?.setAttribute('cy', y.toFixed(1))
      if (labelRef.current) labelRef.current.textContent = phase(x)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 320 168" className="w-full">
        {/* axes */}
        <line x1={X0} y1={20} x2={X0} y2={155} stroke="var(--color-border)" strokeWidth={1} />
        <line x1={X0} y1={155} x2={X1} y2={155} stroke="var(--color-border)" strokeWidth={1} />
        {/* reference voltages */}
        <line x1={X0} y1={yFor(0)} x2={X1} y2={yFor(0)} stroke="var(--color-border)" strokeWidth={0.5} strokeDasharray="2 4" />
        <line x1={X0} y1={yFor(-55)} x2={X1} y2={yFor(-55)} stroke="#E67E22" strokeWidth={0.8} strokeDasharray="3 3" />
        <text x={X0 + 2} y={yFor(-55) - 2} className="fill-[#E67E22] text-[8px]">threshold −55</text>
        <text x={X0 + 2} y={yFor(40) + 8} className="fill-muted text-[8px]">+40</text>
        <text x={X0 + 2} y={yFor(-70) + 10} className="fill-muted text-[8px]">−70 rest</text>
        {/* the action potential */}
        <polyline points={POINTS} fill="none" stroke="#0984E3" strokeWidth={2.5} />
        <circle ref={markRef} cx={X0} cy={yFor(-70)} r={5} fill="#fff" stroke="#0984E3" strokeWidth={2} />
      </svg>

      <p ref={labelRef} className="mt-1 min-h-[2.5rem] text-center text-sm text-muted">
        Resting (−70 mV): the membrane sits ready, polarised by the Na⁺/K⁺ pump.
      </p>
      <p className="text-center text-xs text-muted">It's all-or-nothing: a stimulus either reaches threshold and fires a full spike, or nothing happens.</p>
    </div>
  )
}
