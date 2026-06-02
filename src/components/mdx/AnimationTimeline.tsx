import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// Animators don't draw every frame. They set a few KEYFRAMES — the object's pose
// at chosen moments — and let the computer fill the gaps by TWEENING:
// interpolating smoothly between them. Play it back fast enough (tens of frames a
// second) and persistence of vision fuses the stills into motion. Scrub the
// timeline to see any in-between frame the computer invented.

type Key = { t: number; x: number; y: number }

const TRACK_W = 300
const TRACK_X = 30
const STAGE_W = 340
const STAGE_H = 150

// Three keyframes across a 0..100 timeline. (x,y) in stage pixels.
const KEYS: Array<Key> = [
  { t: 0, x: 40, y: 110 },
  { t: 50, x: 170, y: 30 },
  { t: 100, x: 300, y: 110 },
]

// Smoothstep eases the tween so motion accelerates and settles, not robotic.
function ease(u: number) {
  return u * u * (3 - 2 * u)
}

function poseAt(t: number): { x: number; y: number } {
  for (let i = 0; i < KEYS.length - 1; i++) {
    const a = KEYS[i]
    const b = KEYS[i + 1]
    if (t <= b.t) {
      const u = ease((t - a.t) / (b.t - a.t))
      return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u }
    }
  }
  const last = KEYS[KEYS.length - 1]
  return { x: last.x, y: last.y }
}

export function AnimationTimeline() {
  const [playing, setPlaying] = useState(true)
  const [time, setTime] = useState(0) // 0..100, drives both auto-play and scrub
  const playingRef = useRef(playing)
  const timeRef = useRef(time)
  const ballRef = useRef<SVGCircleElement | null>(null)
  const headRef = useRef<SVGLineElement | null>(null)
  const fpsLabel = useRef<HTMLSpanElement | null>(null)

  useEffect(() => { playingRef.current = playing }, [playing])
  useEffect(() => { timeRef.current = time }, [time])

  useEffect(() => {
    let raf = 0
    let last = 0
    let frames = 0
    let acc = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = now - last
      last = now

      if (playingRef.current) {
        timeRef.current = (timeRef.current + dt * 0.025) % 100
      }
      const p = poseAt(timeRef.current)
      ballRef.current?.setAttribute('cx', p.x.toFixed(1))
      ballRef.current?.setAttribute('cy', p.y.toFixed(1))
      const hx = TRACK_X + (timeRef.current / 100) * TRACK_W
      headRef.current?.setAttribute('x1', hx.toFixed(1))
      headRef.current?.setAttribute('x2', hx.toFixed(1))

      // fps readout, updated ~twice a second
      frames++
      acc += dt
      if (acc >= 500) {
        if (fpsLabel.current) fpsLabel.current.textContent = String(Math.round((frames * 1000) / acc))
        frames = 0
        acc = 0
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Path that the tween traces, sampled densely.
  const path = Array.from({ length: 60 }, (_, i) => {
    const p = poseAt((i / 59) * 100)
    return `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`
  }).join(' ')

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} className="w-full">
        <rect x="6" y="6" width={STAGE_W - 12} height={STAGE_H - 12} rx="10" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
        {/* tween path */}
        <path d={path} fill="none" stroke="var(--color-muted)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
        {/* keyframe markers */}
        {KEYS.map((k, i) => (
          <g key={i}>
            <rect x={k.x - 5} y={k.y - 5} width="10" height="10" fill="none" stroke="var(--color-accent-2)" strokeWidth="2" transform={`rotate(45 ${k.x} ${k.y})`} />
            <text x={k.x} y={k.y - 12} textAnchor="middle" fontSize="9" fill="var(--color-muted)">t={k.t}</text>
          </g>
        ))}
        {/* the tweened object */}
        <circle ref={ballRef} cx={KEYS[0].x} cy={KEYS[0].y} r="9" fill="var(--color-accent)" />
      </svg>

      {/* timeline */}
      <svg viewBox="0 0 360 40" className="mt-1 w-full">
        <line x1={TRACK_X} y1="20" x2={TRACK_X + TRACK_W} y2="20" stroke="var(--color-border)" strokeWidth="3" strokeLinecap="round" />
        {KEYS.map((k, i) => {
          const x = TRACK_X + (k.t / 100) * TRACK_W
          return <rect key={i} x={x - 4} y="16" width="8" height="8" fill="var(--color-accent-2)" transform={`rotate(45 ${x} 20)`} />
        })}
        <line ref={headRef} x1={TRACK_X} y1="8" x2={TRACK_X} y2="32" stroke="var(--color-accent)" strokeWidth="2" />
      </svg>

      <input
        type="range"
        min={0}
        max={100}
        step={0.5}
        value={time}
        onChange={(e) => { setPlaying(false); setTime(Number(e.target.value)) }}
        className="w-full accent-accent"
        aria-label="Scrub timeline"
      />

      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm transition-colors',
            playing ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          {playing ? 'Pause' : 'Play'}
        </button>
        <div className="text-sm text-muted">
          <span ref={fpsLabel} className="font-mono font-bold text-accent-2">60</span> frames / sec
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        You set the <span className="text-accent-2">keyframes</span> (the diamonds); the computer{' '}
        <span className="text-accent">tweens</span> every frame in between. Scrub the slider to inspect any
        invented in-between frame — motion is just dozens of these stills a second.
      </p>
    </div>
  )
}
