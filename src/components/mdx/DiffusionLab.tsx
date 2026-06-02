import { useEffect, useRef, useState } from 'react'
import { Icon } from '#/components/ui/Icon'

// Diffusion as it really happens: scent molecules start crowded on the left and
// random-walk until they're spread evenly. No pumps, no plan — just net movement
// from high to low concentration, driven purely by random motion.
const N = 60
const X0 = 20
const X1 = 340
const Y0 = 20
const Y1 = 170
const MID = (X0 + X1) / 2
const R = 4

type P = { x: number; y: number }

export function DiffusionLab() {
  const [seed, setSeed] = useState(0)
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])
  const leftRef = useRef<SVGTextElement | null>(null)
  const rightRef = useRef<SVGTextElement | null>(null)
  const noteRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    const parts: Array<P> = Array.from({ length: N }, () => ({
      x: X0 + 6 + Math.random() * 70, // start crowded on the left
      y: Y0 + 6 + Math.random() * (Y1 - Y0 - 12),
    }))
    let raf = 0
    const loop = () => {
      let left = 0
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]
        p.x += (Math.random() - 0.5) * 4
        p.y += (Math.random() - 0.5) * 4
        if (p.x < X0 + R) p.x = X0 + R
        else if (p.x > X1 - R) p.x = X1 - R
        if (p.y < Y0 + R) p.y = Y0 + R
        else if (p.y > Y1 - R) p.y = Y1 - R
        if (p.x < MID) left++
        const el = dotRefs.current[i]
        if (el) {
          el.setAttribute('cx', p.x.toFixed(1))
          el.setAttribute('cy', p.y.toFixed(1))
        }
      }
      const right = N - left
      if (leftRef.current) leftRef.current.textContent = String(left)
      if (rightRef.current) rightRef.current.textContent = String(right)
      if (noteRef.current) {
        noteRef.current.textContent =
          Math.abs(left - right) <= 4
            ? 'Evenly spread — equilibrium reached. Particles still move, but there’s no net flow.'
            : 'More particles on the left, so more cross right than left — a net flow down the gradient.'
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [seed])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 200" className="w-full">
        <rect x={X0} y={Y0} width={X1 - X0} height={Y1 - Y0} rx={8} fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth={2} />
        <line x1={MID} y1={Y0} x2={MID} y2={Y1} stroke="var(--color-border)" strokeWidth={1} strokeDasharray="4 4" />
        {Array.from({ length: N }).map((_, i) => (
          <circle key={i} ref={(el) => { dotRefs.current[i] = el }} cx={X0} cy={Y0} r={R} fill="var(--color-accent-2)" />
        ))}
        <text ref={leftRef} x={(X0 + MID) / 2} y={192} textAnchor="middle" className="fill-ink text-[14px] font-mono">
          0
        </text>
        <text ref={rightRef} x={(MID + X1) / 2} y={192} textAnchor="middle" className="fill-ink text-[14px] font-mono">
          0
        </text>
        <text x={(X0 + MID) / 2} y={14} textAnchor="middle" className="fill-muted text-[9px]">left half</text>
        <text x={(MID + X1) / 2} y={14} textAnchor="middle" className="fill-muted text-[9px]">right half</text>
      </svg>

      <p ref={noteRef} className="mt-1 min-h-[2.5rem] text-center text-sm text-muted">
        More particles on the left, so more cross right than left — a net flow down the gradient.
      </p>

      <div className="mt-1 flex justify-center">
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <Icon name="RotateCcw" size={14} /> Reset
        </button>
      </div>
    </div>
  )
}
