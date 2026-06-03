import { useState } from 'react'
import { cn } from '#/lib/cn'

// Three defence layers: Barriers → Innate → Adaptive.
// Send a pathogen through and watch which layer stops it.

type Layer = {
  id: 'barrier' | 'innate' | 'adaptive'
  name: string
  subtitle: string
  colour: string
  defenders: Array<string>
  stopDesc: string
}

const LAYERS: Array<Layer> = [
  {
    id: 'barrier',
    name: 'Barriers',
    subtitle: 'First line — physical & chemical',
    colour: '#1ABC9C',
    defenders: ['Skin', 'Mucus membranes', 'Stomach acid', 'Tears & saliva'],
    stopDesc: "The pathogen never makes it inside. Skin, mucus, acid, and enzymes block or trap it before it can cause trouble.",
  },
  {
    id: 'innate',
    name: 'Innate Immunity',
    subtitle: 'Second line — fast & general',
    colour: '#F39C12',
    defenders: ['Macrophages (engulf invaders)', 'Neutrophils', 'Natural killer cells', 'Inflammation', 'Fever'],
    stopDesc: "Phagocytes engulf the pathogen; inflammation seals off the site; fever slows bacterial growth. Response in minutes to hours — no memory.",
  },
  {
    id: 'adaptive',
    name: 'Adaptive Immunity',
    subtitle: 'Third line — slow, specific & remembers',
    colour: '#9B59B6',
    defenders: ['B cells → Antibodies', 'T-helper cells', 'Cytotoxic T cells', 'Memory B & T cells'],
    stopDesc: "Antibodies tag the specific pathogen; T cells destroy infected cells; memory cells keep the blueprint so the next encounter is much faster.",
  },
]

type Phase = 'idle' | 'barrier' | 'innate' | 'adaptive' | 'escaped'

const PHASE_DESC: Record<Phase, string> = {
  idle: "Press a button to send a pathogen in and see which layer stops it.",
  barrier: "The pathogen tried to enter — the skin and mucus membranes blocked it. It never made it inside.",
  innate: "The pathogen slipped through a skin cut. Phagocytes sensed it, engulfed it, and triggered inflammation. Stopped in hours.",
  adaptive: "A clever pathogen evaded the innate response. Over 5–7 days, B and T cells identified it, produced antibodies, and cleared the infection — leaving memory cells behind.",
  escaped: "(Not realistic in a healthy person — all three layers working together virtually always succeed.)",
}

export function ImmuneDefenders() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [stopped, setStopped] = useState<Layer['id'] | null>(null)

  function sendPathogen(stoppedAt: Layer['id']) {
    setStopped(stoppedAt)
    setPhase(stoppedAt)
  }

  const activeIdx = stopped ? LAYERS.findIndex((l) => l.id === stopped) : -1

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-sm font-semibold text-ink">Your Layered Defences</p>
      <p className="mb-4 text-xs text-muted">
        Three lines of defence work in order. A pathogen must defeat all three — which almost never happens.
      </p>

      {/* Layer cards */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
        {LAYERS.map((layer, idx) => {
          const isActive = stopped === layer.id
          const isPast = activeIdx > idx
          return (
            <div
              key={layer.id}
              className={cn(
                'flex-1 rounded-xl border p-3 transition-colors',
                isActive ? 'border-accent bg-accent/10' : isPast ? 'border-border bg-surface-2 opacity-50' : 'border-border bg-surface-2',
              )}
            >
              <div
                className="mb-1 flex items-center gap-1.5 text-xs font-bold"
                style={{ color: layer.colour }}
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white"
                  style={{ background: layer.colour }}
                >
                  {idx + 1}
                </span>
                {layer.name}
              </div>
              <div className="mb-2 text-[10px] text-muted">{layer.subtitle}</div>
              <ul className="space-y-0.5">
                {layer.defenders.map((d) => (
                  <li key={d} className="flex items-start gap-1 text-[10px] text-muted">
                    <span style={{ color: layer.colour }} className="mt-0.5 shrink-0">▸</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Send pathogen buttons */}
      <div className="mb-3 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => sendPathogen('barrier')}
          className={cn(
            'rounded-xl border px-2 py-2 text-xs transition-colors',
            stopped === 'barrier'
              ? 'border-accent bg-accent/15 text-accent font-semibold'
              : 'border-border text-muted hover:text-ink',
          )}
        >
          Stopped by<br />Barriers
        </button>
        <button
          type="button"
          onClick={() => sendPathogen('innate')}
          className={cn(
            'rounded-xl border px-2 py-2 text-xs transition-colors',
            stopped === 'innate'
              ? 'border-accent bg-accent/15 text-accent font-semibold'
              : 'border-border text-muted hover:text-ink',
          )}
        >
          Stopped by<br />Innate
        </button>
        <button
          type="button"
          onClick={() => sendPathogen('adaptive')}
          className={cn(
            'rounded-xl border px-2 py-2 text-xs transition-colors',
            stopped === 'adaptive'
              ? 'border-accent bg-accent/15 text-accent font-semibold'
              : 'border-border text-muted hover:text-ink',
          )}
        >
          Stopped by<br />Adaptive
        </button>
      </div>

      {/* Result description */}
      <div
        className={cn(
          'rounded-xl border px-3 py-2 text-xs',
          phase === 'idle' ? 'border-border bg-surface-2 text-muted' : 'border-accent/40 bg-accent/8 text-ink',
        )}
      >
        {PHASE_DESC[phase]}
      </div>

      {phase !== 'idle' && (
        <button
          type="button"
          onClick={() => { setPhase('idle'); setStopped(null) }}
          className="mt-2 text-xs text-muted underline hover:text-ink"
        >
          Reset
        </button>
      )}
    </div>
  )
}
