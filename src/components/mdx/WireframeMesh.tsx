import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'

// A 3D model is just a list of points in space (VERTICES) joined by EDGES into
// FACES — together, a MESH. The screen is flat, so to draw it we PROJECT each 3D
// point down to 2D with a little perspective: nearer points spread out, far ones
// shrink toward a vanishing point. Spin the cube and you can feel the depth, even
// though every line is computed from plain coordinates and a few multiplications.

const CX = 180
const CY = 130
const FOCAL = 320 // focal length in px -> controls perspective strength
const DIST = 4 // camera distance from the model centre

// 8 corners of a unit cube, centred on the origin.
const V: Array<[number, number, number]> = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
]
// 12 edges as index pairs.
const E: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
]

export function WireframeMesh() {
  const [speed, setSpeed] = useState(0.6)
  const [spin, setSpin] = useState(true)
  const speedRef = useRef(speed)
  const spinRef = useRef(spin)
  const lineRefs = useRef<Array<SVGLineElement | null>>([])
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => { speedRef.current = speed }, [speed])
  useEffect(() => { spinRef.current = spin }, [spin])

  useEffect(() => {
    let raf = 0
    let last = 0
    let ay = 0.6
    let ax = -0.5

    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      if (spinRef.current) {
        ay += speedRef.current * dt * 0.001
        ax += speedRef.current * dt * 0.0004
      }

      const cy = Math.cos(ay)
      const sy = Math.sin(ay)
      const cx = Math.cos(ax)
      const sx = Math.sin(ax)

      // project all 8 vertices
      const proj = V.map(([x, y, z]) => {
        // rotate around Y
        const rx = x * cy + z * sy
        let rz = -x * sy + z * cy
        let ry = y
        // rotate around X
        const ry2 = ry * cx - rz * sx
        rz = ry * sx + rz * cx
        ry = ry2
        // perspective project
        const f = FOCAL / (rz + DIST)
        return { sx: CX + rx * f, sy: CY - ry * f }
      })

      for (let i = 0; i < E.length; i++) {
        const [a, b] = E[i]
        const el = lineRefs.current[i]
        if (el) {
          el.setAttribute('x1', proj[a].sx.toFixed(1))
          el.setAttribute('y1', proj[a].sy.toFixed(1))
          el.setAttribute('x2', proj[b].sx.toFixed(1))
          el.setAttribute('y2', proj[b].sy.toFixed(1))
        }
      }
      for (let i = 0; i < proj.length; i++) {
        const el = dotRefs.current[i]
        if (el) {
          el.setAttribute('cx', proj[i].sx.toFixed(1))
          el.setAttribute('cy', proj[i].sy.toFixed(1))
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 260" className="w-full">
        <rect x="6" y="6" width="348" height="248" rx="10" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
        {E.map((_, i) => (
          <line
            key={i}
            ref={(el) => { lineRefs.current[i] = el }}
            x1={CX}
            y1={CY}
            x2={CX}
            y2={CY}
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
        {V.map((_, i) => (
          <circle
            key={i}
            ref={(el) => { dotRefs.current[i] = el }}
            cx={CX}
            cy={CY}
            r="3"
            fill="var(--color-accent-2)"
          />
        ))}
      </svg>

      <div className="grid gap-3 px-4 pt-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <SceneSlider label="Spin speed" value={speed} min={0} max={2} step={0.1} unit="×" onChange={setSpeed} />
        <button
          type="button"
          onClick={() => setSpin((s) => !s)}
          className={cn(
            'rounded-full border px-3 py-1.5 text-sm transition-colors',
            spin ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          {spin ? 'Pause' : 'Spin'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 pt-3 text-center text-sm">
        <div className="rounded-lg border border-border bg-surface-2 p-2">
          <div className="text-xs text-muted">vertices</div>
          <div className="font-mono font-bold text-accent-2">{V.length}</div>
        </div>
        <div className="rounded-lg border border-border bg-surface-2 p-2">
          <div className="text-xs text-muted">edges</div>
          <div className="font-mono font-bold text-accent">{E.length}</div>
        </div>
        <div className="rounded-lg border border-border bg-surface-2 p-2">
          <div className="text-xs text-muted">faces</div>
          <div className="font-mono font-bold text-ink">6</div>
        </div>
      </div>

      <p className="px-4 pb-4 pt-3 text-center text-xs text-muted">
        Eight 3D points, twelve edges. Every frame the computer rotates the points and{' '}
        <span className="text-ink">projects</span> them onto the flat screen with a touch of perspective — that's all "3D" really is.
      </p>
    </div>
  )
}
