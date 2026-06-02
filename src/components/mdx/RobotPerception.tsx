import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// A robot lives in a SENSE → THINK → ACT loop. Its sensors never report clean
// truth — they report noisy estimates. Here a rover reads its distance to a wall
// through a sensor we can make noisy; it must interpret that messy signal, decide
// how confident it is, and choose an action. Perception is the art of turning
// uncertain real-world signals into good decisions despite the noise.

const W = 360
const TRUE_DIST = 60 // px to the wall (the ground truth the robot can't see directly)

type Action = { label: string; tone: string }

function decide(reading: number): Action {
  if (reading < 35) return { label: 'BRAKE — wall close!', tone: 'text-warn' }
  if (reading < 90) return { label: 'Slow & steer', tone: 'text-accent-2' }
  return { label: 'Drive forward', tone: 'text-success' }
}

export function RobotPerception() {
  const [noise, setNoise] = useState(20)
  const [reading, setReading] = useState(TRUE_DIST)
  const [running, setRunning] = useState(true)
  const noiseRef = useRef(noise)
  const runRef = useRef(running)
  useEffect(() => { noiseRef.current = noise }, [noise])
  useEffect(() => { runRef.current = running }, [running])

  useEffect(() => {
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (now - last > 420 && runRef.current) {
        last = now
        // Gaussian-ish noise via summed uniforms.
        const n = noiseRef.current
        const g = ((Math.random() + Math.random() + Math.random() - 1.5) / 1.5) * n
        const r = Math.max(8, Math.min(160, TRUE_DIST + g))
        setReading(r)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Confidence shrinks as noise grows.
  const confidence = Math.max(5, Math.round(100 - noise * 1.6))
  const action = decide(reading)
  const roverX = 40
  const wallX = roverX + TRUE_DIST + 40
  const ghostX = roverX + reading + 40 // where the robot *thinks* the wall is

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${W} 120`} className="w-full rounded-xl bg-surface-2">
        {/* ground */}
        <line x1="10" y1="92" x2={W - 10} y2="92" stroke="var(--color-border)" strokeWidth="2" />
        {/* true wall */}
        <rect x={wallX} y="30" width="14" height="62" rx="2" fill="var(--color-border)" />
        <text x={wallX + 7} y="106" textAnchor="middle" fontSize="9" fill="var(--color-muted)">real wall</text>
        {/* perceived wall (ghost) */}
        <rect x={ghostX} y="34" width="14" height="54" rx="2" fill="#FFB454" opacity="0.45" />
        {/* sensor beam */}
        <line x1={roverX + 22} y1="64" x2={ghostX} y2="64" stroke="var(--color-accent-2)" strokeWidth="2" strokeDasharray="4 3" />
        {/* rover */}
        <rect x={roverX} y="52" width="26" height="22" rx="4" fill="var(--color-accent)" />
        <circle cx={roverX + 7} cy="78" r="5" fill="var(--color-ink)" />
        <circle cx={roverX + 19} cy="78" r="5" fill="var(--color-ink)" />
        <circle cx={roverX + 24} cy="60" r="3" fill="#2ECC71" />
      </svg>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-lg border border-border bg-surface-2 p-2">
          <div className="text-[10px] uppercase text-muted">Sense</div>
          <div className="font-mono font-bold text-accent-2">{reading.toFixed(0)} px</div>
        </div>
        <div className="rounded-lg border border-border bg-surface-2 p-2">
          <div className="text-[10px] uppercase text-muted">Think</div>
          <div className={cn('font-bold', confidence > 60 ? 'text-success' : confidence > 30 ? 'text-accent-2' : 'text-warn')}>{confidence}% sure</div>
        </div>
        <div className="rounded-lg border border-border bg-surface-2 p-2">
          <div className="text-[10px] uppercase text-muted">Act</div>
          <div className={cn('font-bold', action.tone)}>{action.label}</div>
        </div>
      </div>

      <label className="mt-3 flex items-center gap-2 text-sm text-muted">
        <span className="shrink-0">sensor noise</span>
        <input type="range" min={0} max={50} step={1} value={noise} onChange={(e) => setNoise(Number(e.target.value))} className="flex-1 accent-accent" />
        <span className="w-8 text-right font-mono text-ink">{noise}</span>
      </label>

      <div className="mt-2 flex justify-center">
        <button type="button" onClick={() => setRunning((r) => !r)} className="rounded-full border border-accent-2 bg-accent-2/10 px-3 py-1 text-sm font-semibold text-accent-2">
          {running ? 'Pause sensor' : 'Resume sensor'}
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        The <span className="text-accent-2">orange ghost</span> is where the rover *thinks* the wall is. Crank up the noise: readings jitter, confidence drops, and a wrong reading can trigger the wrong action. Real robots fuse many noisy sensors over time to stay safe.
      </p>
    </div>
  )
}
