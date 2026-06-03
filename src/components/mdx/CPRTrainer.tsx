import { useState, useEffect, useRef } from 'react'
import { cn } from '#/lib/cn'
import { clamp } from '#/lib/health'

// CPR compression-rate metronome for the Health island — first-aid-and-safety world.
// Drives a visual beat at a selectable rate (100–120 bpm, default 110).
// Uses setInterval with cleanup — SSR-safe (starts only on click).

const MIN_BPM = 100
const MAX_BPM = 120
const DEFAULT_BPM = 110

export function CPRTrainer() {
  const [bpm, setBpm] = useState(DEFAULT_BPM)
  const [running, setRunning] = useState(false)
  const [beats, setBeats] = useState(0)
  const [phase, setPhase] = useState<'push' | 'release'>('push')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const beatCountRef = useRef(0)
  const phaseRef = useRef<'push' | 'release'>('push')

  // Each "beat" toggles push→release at twice the bpm rate so push and release each last half a beat
  useEffect(() => {
    if (!running) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // interval in ms for each half-cycle (push + release = one full compression)
    const halfMs = (60_000 / bpm) / 2

    intervalRef.current = setInterval(() => {
      if (phaseRef.current === 'push') {
        phaseRef.current = 'release'
        setPhase('release')
      } else {
        phaseRef.current = 'push'
        beatCountRef.current += 1
        setBeats(beatCountRef.current)
        setPhase('push')
      }
    }, halfMs)

    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current)
    }
  }, [running, bpm])

  function handleToggle() {
    if (!running) {
      // Reset on start
      beatCountRef.current = 0
      phaseRef.current = 'push'
      setBeats(0)
      setPhase('push')
    }
    setRunning((r) => !r)
  }

  function handleBpmChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBpm(clamp(Number(e.target.value), MIN_BPM, MAX_BPM))
  }

  // Determine breath cycle label (30 compressions : 2 breaths)
  const breathCyclePos = beats > 0 ? beats % 30 : 0
  const compressionsLeft = 30 - breathCyclePos

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Guidance strip */}
      <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-xl border border-border bg-surface-2 p-2">
          <p className="font-bold text-accent">{bpm} bpm</p>
          <p className="text-muted">Rate</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-2 p-2">
          <p className="font-bold text-accent">5–6 cm</p>
          <p className="text-muted">Depth</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-2 p-2">
          <p className="font-bold text-accent">30 : 2</p>
          <p className="text-muted">Compressions : Breaths</p>
        </div>
      </div>

      {/* Rate slider */}
      <div className="mb-4">
        <label className="mb-1 flex justify-between text-xs text-muted">
          <span>Compression rate</span>
          <span className="text-ink">{bpm} bpm</span>
        </label>
        <input
          type="range"
          min={MIN_BPM}
          max={MAX_BPM}
          value={bpm}
          onChange={handleBpmChange}
          className="w-full accent-accent"
          disabled={running}
        />
        <div className="mt-0.5 flex justify-between text-xs text-muted">
          <span>{MIN_BPM}</span>
          <span>{MAX_BPM}</span>
        </div>
      </div>

      {/* Visual beat indicator */}
      <div className="mb-4 flex flex-col items-center gap-3">
        <div
          className={cn(
            'flex h-24 w-24 items-center justify-center rounded-full border-4 text-2xl font-black transition-all duration-75',
            running && phase === 'push'
              ? 'scale-100 border-accent bg-accent/20 text-accent'
              : running && phase === 'release'
                ? 'scale-90 border-accent/50 bg-accent/5 text-accent/60'
                : 'scale-90 border-border bg-surface-2 text-muted',
          )}
          aria-label={running ? phase : 'stopped'}
        >
          {running ? (phase === 'push' ? '↓' : '↑') : '○'}
        </div>

        <p
          className={cn(
            'text-sm font-semibold uppercase tracking-widest transition-colors',
            running && phase === 'push' ? 'text-accent' : 'text-muted',
          )}
        >
          {running ? (phase === 'push' ? 'PUSH' : 'RELEASE') : 'Ready'}
        </p>
      </div>

      {/* Stats row */}
      <div className="mb-4 flex justify-center gap-6 text-center text-xs">
        <div>
          <p className="text-xl font-bold text-ink">{beats}</p>
          <p className="text-muted">Compressions</p>
        </div>
        {running && (
          <div>
            <p className="text-xl font-bold text-accent-2">{compressionsLeft}</p>
            <p className="text-muted">Until rescue breaths</p>
          </div>
        )}
      </div>

      {/* 30:2 reminder */}
      {running && beats > 0 && breathCyclePos === 0 && (
        <div className="mb-4 rounded-xl border border-accent/40 bg-accent/10 px-4 py-2 text-center text-sm font-semibold text-accent">
          Give 2 rescue breaths now, then continue compressions
        </div>
      )}

      {/* Start / Stop */}
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'w-full rounded-xl border px-4 py-3 text-sm font-semibold transition-colors',
          running
            ? 'border-accent bg-accent/15 text-accent hover:bg-accent/25'
            : 'border-accent bg-accent/10 text-accent hover:bg-accent/20',
        )}
      >
        {running ? 'Stop Metronome' : 'Start Metronome'}
      </button>

      <p className="mt-3 text-center text-xs text-muted">
        This is a practice aid only. Hands-on certified training is essential before performing CPR.
        Always call emergency services first.
      </p>
    </div>
  )
}
