import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// Every program, no matter how vast, is built from just three control
// structures: SEQUENCE (do steps in order), SELECTION (choose a path with
// if/else), and ITERATION (repeat with a loop). Here a glowing token walks a
// flowchart so you can watch each one. For selection, toggle the condition; for
// iteration, press Run and watch the token circle back while the count is low.

type Mode = 'selection' | 'iteration'

// Waypoints the token follows, as [x, y] in the 360x220 viewBox, per mode.
const SELECT_TRUE = [[180, 26], [180, 70], [90, 130], [90, 175], [180, 200]]
const SELECT_FALSE = [[180, 26], [180, 70], [270, 130], [270, 175], [180, 200]]
const LOOP_PATH = [[180, 26], [180, 64], [180, 110], [300, 110], [300, 160], [180, 160]]

export function ControlFlowViz() {
  const [mode, setMode] = useState<Mode>('selection')
  const [cond, setCond] = useState(true) // selection: is the condition true?
  const [count, setCount] = useState(0) // iteration: loop counter
  const [running, setRunning] = useState(false)
  const tokenRef = useRef<SVGCircleElement | null>(null)

  // Animate the token along the active path. For iteration we loop while count<3.
  const modeRef = useRef(mode)
  const condRef = useRef(cond)
  modeRef.current = mode
  condRef.current = cond
  const countRef = useRef(count)
  countRef.current = count

  useEffect(() => {
    if (!running) return
    let raf = 0
    let start = 0
    const SEG_MS = 480
    const loop = (now: number) => {
      if (!start) start = now
      const m = modeRef.current
      const path = m === 'iteration' ? LOOP_PATH : condRef.current ? SELECT_TRUE : SELECT_FALSE
      const elapsed = now - start
      const segs = path.length - 1
      let seg = Math.floor(elapsed / SEG_MS)

      if (m === 'iteration' && seg >= segs) {
        // completed one lap: increment counter and decide whether to loop again
        const next = countRef.current + 1
        setCount(next)
        if (next >= 3) {
          if (tokenRef.current) {
            tokenRef.current.setAttribute('cx', String(path[segs][0]))
            tokenRef.current.setAttribute('cy', String(path[segs][1]))
          }
          setRunning(false)
          return
        }
        start = now
        seg = 0
      } else if (m === 'selection' && seg >= segs) {
        if (tokenRef.current) {
          tokenRef.current.setAttribute('cx', String(path[segs][0]))
          tokenRef.current.setAttribute('cy', String(path[segs][1]))
        }
        setRunning(false)
        return
      }

      const t = (elapsed % SEG_MS) / SEG_MS
      const [ax, ay] = path[seg]
      const [bx, by] = path[Math.min(seg + 1, segs)]
      if (tokenRef.current) {
        tokenRef.current.setAttribute('cx', (ax + (bx - ax) * t).toFixed(1))
        tokenRef.current.setAttribute('cy', (ay + (by - ay) * t).toFixed(1))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [running])

  function run() {
    if (mode === 'iteration') setCount(0)
    if (tokenRef.current) {
      tokenRef.current.setAttribute('cx', '180')
      tokenRef.current.setAttribute('cy', '26')
    }
    setRunning(true)
  }

  function switchMode(m: Mode) {
    setRunning(false)
    setMode(m)
    setCount(0)
    if (tokenRef.current) {
      tokenRef.current.setAttribute('cx', '180')
      tokenRef.current.setAttribute('cy', '26')
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex justify-center gap-2">
        {(['selection', 'iteration'] as Array<Mode>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {m === 'selection' ? 'Selection (if / else)' : 'Iteration (loop)'}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 220" className="mt-3 w-full">
        {/* Start node */}
        <ellipse cx="180" cy="26" rx="38" ry="16" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2" />
        <text x="180" y="30" textAnchor="middle" fontSize="11" fill="var(--color-muted)">start</text>

        {mode === 'selection' ? (
          <>
            {/* Decision diamond */}
            <path d="M180,54 L222,90 L180,126 L138,90 Z" fill="var(--color-surface-2)" stroke="var(--color-accent-2)" strokeWidth="2" />
            <text x="180" y="86" textAnchor="middle" fontSize="10" fill="var(--color-accent-2)">score</text>
            <text x="180" y="98" textAnchor="middle" fontSize="10" fill="var(--color-accent-2)">≥ 50 ?</text>
            {/* branches */}
            <line x1="138" y1="90" x2="90" y2="130" stroke={cond ? 'var(--color-accent)' : 'var(--color-border)'} strokeWidth="2" />
            <line x1="222" y1="90" x2="270" y2="130" stroke={cond ? 'var(--color-border)' : 'var(--color-accent)'} strokeWidth="2" />
            <text x="110" y="120" fontSize="9" fill="var(--color-success)">true</text>
            <text x="240" y="120" fontSize="9" fill="var(--color-warn)">false</text>
            {/* true / false action boxes */}
            <rect x="50" y="132" width="80" height="34" rx="8" fill="var(--color-surface-2)" stroke="var(--color-success)" strokeWidth="2" />
            <text x="90" y="153" textAnchor="middle" fontSize="10" fill="var(--color-success)">"Pass"</text>
            <rect x="230" y="132" width="80" height="34" rx="8" fill="var(--color-surface-2)" stroke="var(--color-warn)" strokeWidth="2" />
            <text x="270" y="153" textAnchor="middle" fontSize="10" fill="var(--color-warn)">"Try again"</text>
            {/* merge to end */}
            <line x1="90" y1="166" x2="160" y2="200" stroke="var(--color-border)" strokeWidth="2" />
            <line x1="270" y1="166" x2="200" y2="200" stroke="var(--color-border)" strokeWidth="2" />
          </>
        ) : (
          <>
            {/* condition diamond */}
            <path d="M180,44 L226,82 L180,120 L134,82 Z" fill="var(--color-surface-2)" stroke="var(--color-accent-2)" strokeWidth="2" />
            <text x="180" y="79" textAnchor="middle" fontSize="10" fill="var(--color-accent-2)">i &lt; 3 ?</text>
            <text x="180" y="91" textAnchor="middle" fontSize="9" fill="var(--color-muted)">loop</text>
            {/* loop body box (right) */}
            <line x1="180" y1="120" x2="180" y2="160" stroke="var(--color-success)" strokeWidth="2" />
            <text x="150" y="142" fontSize="9" fill="var(--color-success)">true</text>
            <rect x="120" y="160" width="120" height="34" rx="8" fill="var(--color-surface-2)" stroke="var(--color-success)" strokeWidth="2" />
            <text x="180" y="181" textAnchor="middle" fontSize="10" fill="var(--color-success)">do work; i ← i + 1</text>
            {/* feedback arrow back up to the condition */}
            <path d="M240,177 H300 V110 H226" fill="none" stroke="var(--color-accent)" strokeWidth="2" markerEnd="url(#cf-arrow)" />
            {/* exit when false */}
            <line x1="226" y1="82" x2="320" y2="82" stroke="var(--color-warn)" strokeWidth="2" strokeDasharray="3 3" />
            <text x="300" y="74" textAnchor="middle" fontSize="9" fill="var(--color-warn)">false → exit</text>
            <defs>
              <marker id="cf-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-accent)" />
              </marker>
            </defs>
          </>
        )}

        {/* End node */}
        <ellipse cx="180" cy="200" rx="34" ry="14" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2" />
        <text x="180" y="204" textAnchor="middle" fontSize="11" fill="var(--color-muted)">end</text>

        {/* The walking token */}
        <circle ref={tokenRef} cx="180" cy="26" r="8" fill="var(--color-accent)" stroke="#0a0f1f" strokeWidth="1.5" />
      </svg>

      {mode === 'selection' ? (
        <div className="mt-1 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => { setCond((c) => !c); setRunning(false) }}
            className={cn(
              'rounded-full border px-3 py-1 text-xs transition-colors',
              cond ? 'border-success text-success' : 'border-warn text-warn',
            )}
          >
            condition is {cond ? 'true' : 'false'} — click to flip
          </button>
          <p className="text-center text-xs text-muted">
            The token reaches the diamond and takes <span className={cond ? 'text-success' : 'text-warn'}>one</span> path — never both. That is <span className="text-ink">selection</span>.
          </p>
        </div>
      ) : (
        <p className="mt-1 text-center text-xs text-muted">
          While <span className="font-mono text-ink">i &lt; 3</span> the token loops back through the body. Counter: <span className="font-mono text-accent">i = {count}</span>. That repetition is <span className="text-ink">iteration</span>.
        </p>
      )}

      <div className="mt-3 flex justify-center gap-2">
        <button
          type="button"
          onClick={run}
          disabled={running}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm transition-colors',
            running ? 'cursor-not-allowed border-border text-muted/50' : 'border-accent bg-accent/15 text-accent',
          )}
        >
          Run
        </button>
        <button
          type="button"
          onClick={() => switchMode(mode)}
          className="rounded-full border border-border px-4 py-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
