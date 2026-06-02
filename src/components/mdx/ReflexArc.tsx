import { useEffect, useRef } from 'react'

// A reflex: touch something hot and your hand pulls back before you even feel the
// pain. The signal takes a shortcut through the spinal cord (not the brain),
// which is what makes it so fast and automatic.
const PATH = 'M 70 96 C 120 50 200 54 240 78 C 252 96 252 104 240 122 C 200 146 120 150 86 132'

export function ReflexArc() {
  const pulseRef = useRef<SVGCircleElement | null>(null)
  const handRef = useRef<SVGTextElement | null>(null)
  const pathRef = useRef<SVGPathElement | null>(null)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const len = path.getTotalLength()
    let raf = 0
    const loop = (now: number) => {
      const f = (now / 1600) % 1
      const p = path.getPointAtLength(f * len)
      pulseRef.current?.setAttribute('cx', p.x.toFixed(1))
      pulseRef.current?.setAttribute('cy', p.y.toFixed(1))
      // hand jerks away as the impulse reaches the muscle
      const jerk = f > 0.82 ? (f - 0.82) / 0.18 : f < 0.05 ? 1 - f / 0.05 : 0
      handRef.current?.setAttribute('transform', `translate(${(-jerk * 14).toFixed(1)} ${(-jerk * 14).toFixed(1)})`)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 320 180" className="w-full">
        {/* spinal cord */}
        <rect x={238} y={40} width={22} height={100} rx={11} fill="#A29BFE" opacity={0.85} />
        <text x={249} y={154} textAnchor="middle" className="fill-muted text-[8px]">spinal cord</text>

        {/* flame + hand (receptor) */}
        <text x={44} y={56} textAnchor="middle" className="text-[20px]">🔥</text>
        <text ref={handRef} x={64} y={98} textAnchor="middle" className="text-[20px]">🤚</text>

        {/* the reflex arc path */}
        <path ref={pathRef} d={PATH} fill="none" stroke="#334155" strokeWidth={6} strokeLinecap="round" />

        {/* labels */}
        <text x={150} y={48} textAnchor="middle" className="fill-[#FD79A8] text-[9px]">sensory neuron →</text>
        <text x={150} y={162} textAnchor="middle" className="fill-[#4FD1C5] text-[9px]">← motor neuron</text>
        <text x={258} y={88} className="fill-muted text-[8px]">relay</text>

        {/* travelling impulse */}
        <circle ref={pulseRef} cx={70} cy={96} r={6} fill="#fff" />
      </svg>

      <p className="mt-1 text-center text-sm text-muted">
        Receptor → sensory neuron → spinal cord (relay) → motor neuron → muscle. It skips the brain — that’s why a reflex is so <span className="text-ink">fast and automatic</span>.
      </p>
    </div>
  )
}
