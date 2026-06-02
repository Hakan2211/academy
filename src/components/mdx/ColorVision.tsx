import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { cn } from '#/lib/cn'
import { clamp } from '#/lib/psych'

// Two halves of colour vision in one demo.
//  · Trichromatic: the retina has three cone types (R, G, B). Mix three lights
//    additively and any colour appears — exactly how a screen works.
//  · Opponent-process: cones feed opponent channels (red↔green, blue↔yellow).
//    Stare at a colour, fatigue one side, look away — the OPPOSITE colour glows
//    as an afterimage. This demo lets you stare, then release to see it.
type Tab = 'mix' | 'afterimage'

const SWATCHES = [
  { name: 'Red', fill: '#FF1F1F', after: 'cyan-green' },
  { name: 'Green', fill: '#1FCB1F', after: 'magenta' },
  { name: 'Blue', fill: '#2A6BFF', after: 'yellow' },
  { name: 'Yellow', fill: '#FFE21F', after: 'blue' },
] as const

// Rough complementary colour for the afterimage (opponent channel flip).
function complement(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const c = (v: number) => clamp(255 - v, 0, 255)
  // Desaturate slightly — real afterimages are pale, washed-out.
  const mix = (v: number) => Math.round(v * 0.55 + 110 * 0.45)
  const to = (v: number) => mix(c(v)).toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

export function ColorVision() {
  const [tab, setTab] = useState<Tab>('mix')

  // Additive mix
  const [r, setR] = useState(220)
  const [g, setG] = useState(60)
  const [b, setB] = useState(160)
  const hex = `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`

  // Afterimage: hold to stare, release to reveal complement
  const [swatch, setSwatch] = useState(0)
  const [staring, setStaring] = useState(false)
  const [reveal, setReveal] = useState(false)
  const [hold, setHold] = useState(0)
  const holdRef = useRef(0)

  useEffect(() => {
    if (!staring) return
    let raf = 0
    let start = 0
    const loop = (now: number) => {
      if (!start) start = now
      holdRef.current = Math.min(1, (now - start) / 4000)
      setHold(holdRef.current)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [staring])

  const begin = () => {
    setReveal(false)
    setStaring(true)
  }
  const end = () => {
    if (staring) setReveal(true)
    setStaring(false)
    setHold(0)
  }

  const cur = SWATCHES[swatch]

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 flex flex-wrap gap-2">
        {([
          ['mix', 'Additive mixing (trichromatic)'],
          ['afterimage', 'Afterimage (opponent-process)'],
        ] as Array<[Tab, string]>).map(([t, label]) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              tab === t ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'mix' && (
        <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
          <div className="space-y-2">
            {([
              ['Red light', r, setR, '#FF6B6B'],
              ['Green light', g, setG, '#2ECC71'],
              ['Blue light', b, setB, '#4F8CFF'],
            ] as Array<[string, number, (v: number) => void, string]>).map(([label, val, set, c]) => (
              <div key={label} style={{ color: c }}>
                <SceneSlider label={label} value={val} min={0} max={255} step={1} unit="" onChange={(v) => set(Math.round(v))} />
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="h-24 w-24 rounded-xl border border-border" style={{ background: hex }} />
            <div className="font-mono text-xs uppercase text-ink">{hex}</div>
            <p className="text-center text-[11px] text-muted">Three cone-matched lights → any colour</p>
          </div>
        </div>
      )}

      {tab === 'afterimage' && (
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            {SWATCHES.map((s, i) => (
              <button
                key={s.name}
                type="button"
                onClick={() => {
                  setSwatch(i)
                  setReveal(false)
                }}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-xs transition-colors',
                  swatch === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
                )}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onMouseDown={begin}
              onMouseUp={end}
              onMouseLeave={end}
              onTouchStart={begin}
              onTouchEnd={end}
              className="relative flex h-40 w-full max-w-[320px] select-none items-center justify-center overflow-hidden rounded-xl border border-border bg-white"
              style={{ background: reveal ? '#fff' : undefined }}
            >
              {!reveal ? (
                <span
                  className="h-24 w-24 rounded-full transition-transform"
                  style={{ background: cur.fill, transform: `scale(${1 + hold * 0.02})` }}
                />
              ) : (
                <span className="h-24 w-24 rounded-full" style={{ background: complement(cur.fill), animation: 'none' }} />
              )}
              {/* fixation dot */}
              <span className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-black/70" />
              {staring && (
                <span className="pointer-events-none absolute bottom-2 text-[11px] text-black/50">keep staring… {(hold * 100).toFixed(0)}%</span>
              )}
            </button>
            <p className="text-center text-sm text-muted">
              {reveal ? (
                <>You should glimpse a faint <span className="font-semibold text-ink">{cur.after}</span> ghost — the opponent channel rebounding the other way.</>
              ) : (
                <><span className="font-semibold text-ink">Press and hold</span> on the dot, stare for a few seconds, then <span className="text-ink">release</span> to look at the blank field.</>
              )}
            </p>
          </div>

          <div className="mt-3 rounded-xl bg-surface-2 p-3 text-sm text-muted">
            Staring <span className="text-ink">fatigues</span> one side of an opponent pair (e.g. the red side of red↔green). When you look away, the rested side over-fires, painting the <span className="text-accent">complementary</span> colour. That's the opponent-process theory in action — both theories are true, at different stages of the visual system.
          </div>
        </div>
      )}
    </div>
  )
}
