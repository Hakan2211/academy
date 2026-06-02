import { useEffect, useRef, useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The CPU is fast; devices (keyboards, disks, networks) are slow and unpredictable.
// Two ways to cope. POLLING: the CPU keeps asking "ready yet? ready yet?" —
// simple but it wastes time checking. INTERRUPTS: the CPU gets on with real work,
// and the device taps it on the shoulder only when it actually has data. Toggle
// the mode; in interrupt mode press the button to fire a device event.

type Mode = 'polling' | 'interrupt'

export function IoDevices() {
  const [mode, setMode] = useState<Mode>('polling')
  const [pollCount, setPollCount] = useState(0)
  const [handling, setHandling] = useState(false) // CPU is servicing an interrupt
  const [work, setWork] = useState(0) // useful work done in interrupt mode

  // Animated dot travelling CPU <-> device along the bus.
  const dotRef = useRef<SVGCircleElement | null>(null)
  const modeRef = useRef(mode)
  useEffect(() => { modeRef.current = mode }, [mode])

  useEffect(() => {
    let raf = 0
    let start = 0
    const loop = (now: number) => {
      if (!start) start = now
      const t = (now - start) / 1000
      const el = dotRef.current
      if (el) {
        // ping-pong between CPU (x=70) and device (x=290)
        const f = 0.5 - 0.5 * Math.cos(t * 3) // 0..1 ease
        el.setAttribute('cx', (70 + f * 220).toFixed(1))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // In polling mode, the CPU "wastes" cycles repeatedly checking.
  useEffect(() => {
    if (mode !== 'polling') return
    const id = window.setInterval(() => setPollCount((c) => c + 1), 500)
    return () => window.clearInterval(id)
  }, [mode])

  // In interrupt mode, the CPU steadily gets useful work done.
  useEffect(() => {
    if (mode !== 'interrupt' || handling) return
    const id = window.setInterval(() => setWork((w) => w + 1), 500)
    return () => window.clearInterval(id)
  }, [mode, handling])

  function fireInterrupt() {
    if (mode !== 'interrupt' || handling) return
    setHandling(true)
    window.setTimeout(() => setHandling(false), 1100)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex justify-center gap-2">
        {(['polling', 'interrupt'] as Array<Mode>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setPollCount(0); setWork(0); setHandling(false) }}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 130" className="mt-3 w-full">
        {/* bus line */}
        <line x1="70" y1="64" x2="290" y2="64" stroke="var(--color-border)" strokeWidth="3" />
        <text x="180" y="56" textAnchor="middle" fontSize="9" fill="var(--color-muted)">bus</text>

        {/* CPU */}
        <rect x="24" y="40" width="80" height="48" rx="10" fill={handling ? '#FFC83D' : 'var(--color-surface-2)'} stroke="var(--color-accent)" strokeWidth="2.5" />
        <text x="64" y="60" textAnchor="middle" fontSize="11" fontWeight="700" fill={handling ? '#0a0f1f' : 'var(--color-accent)'}>CPU</text>
        <text x="64" y="76" textAnchor="middle" fontSize="8" fill={handling ? '#0a0f1f' : 'var(--color-muted)'}>
          {handling ? 'handling!' : mode === 'polling' ? 'checking…' : 'working'}
        </text>

        {/* Device + controller */}
        <rect x="256" y="40" width="80" height="48" rx="10" fill="var(--color-surface-2)" stroke="var(--color-accent-2)" strokeWidth="2.5" />
        <text x="296" y="60" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-accent-2)">Device</text>
        <text x="296" y="76" textAnchor="middle" fontSize="8" fill="var(--color-muted)">+ controller</text>

        {/* travelling data dot */}
        <circle ref={dotRef} cx="70" cy="64" r="5" fill={handling ? '#FFC83D' : 'var(--color-accent)'} />

        {/* interrupt line lights up when handling */}
        {handling && (
          <text x="180" y="108" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFC83D">⚡ interrupt</text>
        )}
      </svg>

      {mode === 'polling' ? (
        <div className="mt-2 rounded-xl border border-warn/40 bg-surface-2 p-3 text-center text-sm">
          <div className="text-warn">
            <Icon name="RefreshCw" size={14} /> Wasted checks: <span className="font-mono font-bold">{pollCount}</span>
          </div>
          <p className="mt-1 text-xs text-muted">
            The CPU loops asking <span className="text-ink">“ready yet?”</span> over and over. Every check is time it could have spent computing — even though the device is usually not ready.
          </p>
        </div>
      ) : (
        <div className="mt-2 rounded-xl border border-success/40 bg-surface-2 p-3 text-center text-sm">
          <div className="text-success">
            <Icon name="CircleCheck" size={14} /> Useful work done: <span className="font-mono font-bold">{work}</span>
          </div>
          <p className="mt-1 text-xs text-muted">
            The CPU just works. When the device is ready it sends an <span className="text-ink">interrupt</span>; the CPU pauses, runs a short handler, then resumes — no wasted checking.
          </p>
          <button
            type="button"
            onClick={fireInterrupt}
            disabled={handling}
            className={cn(
              'mt-2 rounded-full border px-4 py-1.5 text-sm transition-colors',
              handling ? 'cursor-not-allowed border-border text-muted/50' : 'border-accent bg-accent/15 text-accent',
            )}
          >
            {handling ? 'Handling…' : 'Fire device event'}
          </button>
        </div>
      )}
    </div>
  )
}
