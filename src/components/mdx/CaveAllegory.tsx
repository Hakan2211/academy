import { useState } from 'react'
import { cn } from '#/lib/cn'

// Plato's Allegory of the Cave — five-step stepper. Each step has a small SVG
// scene depicting the prisoners, the fire, the world above, and the return.
// Self-contained so it can be reused across multiple worlds.

type Step = {
  id: number
  label: string
  meaning: string
}

const STEPS: Array<Step> = [
  {
    id: 0,
    label: 'Chained in the cave',
    meaning:
      'The prisoners see only shadows flickering on the wall ahead. They have never turned around. These shadows are their entire reality — ordinary people mistaking **appearances** (doxa, mere opinion) for the real world.',
  },
  {
    id: 1,
    label: 'Freed: fire & puppets',
    meaning:
      'Turning around, the freed prisoner sees a fire behind them and puppets casting the shadows. It is painful and confusing. This represents the first step of philosophical awakening — realising that what we took for reality were just **images of images**.',
  },
  {
    id: 2,
    label: 'Dragged into the sunlight',
    meaning:
      'Pulled up out of the cave, the prisoner is blinded by the sun. Every step of inquiry is painful at first. This is the disorientation of encountering **genuine knowledge** after a lifetime of comfortable illusion.',
  },
  {
    id: 3,
    label: 'Sees the real world & the sun',
    meaning:
      "Eyes adjust. The philosopher sees real trees, real stars, and finally the **sun itself** — Plato's Form of the Good, the ultimate source of truth, being, and value. All knowledge is grounded in this highest principle.",
  },
  {
    id: 4,
    label: 'Returns to tell the others',
    meaning:
      "The philosopher descends back into the cave to free the others. But they don't believe him — his eyes have adjusted to the sun and he can no longer see the shadows as well as they can. **Truth-tellers are unpopular** (Socrates was executed). Yet the obligation to return persists.",
  },
]

// --- SVG scenes for each step ---

function SceneChained() {
  return (
    <svg viewBox="0 0 320 160" className="w-full" aria-label="Prisoners chained in cave">
      {/* cave wall */}
      <rect x="0" y="0" width="320" height="160" fill="#1a1520" />
      {/* shadow wall */}
      <rect x="0" y="10" width="10" height="150" fill="#2a2030" />
      <rect x="310" y="10" width="10" height="150" fill="#2a2030" />
      <rect x="10" y="10" width="300" height="8" fill="#2a2030" />
      {/* shadow screen */}
      <rect x="30" y="80" width="260" height="4" rx="2" fill="#3a3050" />
      {/* shadows projected */}
      <ellipse cx="100" cy="72" rx="18" ry="10" fill="#3a3050" opacity="0.7" />
      <ellipse cx="160" cy="68" rx="22" ry="12" fill="#3a3050" opacity="0.7" />
      <ellipse cx="220" cy="74" rx="16" ry="9" fill="#3a3050" opacity="0.7" />
      {/* prisoners (silhouettes) */}
      {[80, 140, 200].map((x) => (
        <g key={x}>
          <circle cx={x} cy="118" r="8" fill="#4a4060" />
          <rect x={x - 5} y="126" width="10" height="18" rx="3" fill="#4a4060" />
          {/* chain */}
          <line x1={x} y1="144" x2={x} y2="155" stroke="#5a5070" strokeWidth="1.5" strokeDasharray="3,2" />
        </g>
      ))}
      {/* fire glow (far back, small) */}
      <circle cx="160" cy="30" r="14" fill="#ff8800" opacity="0.18" />
      <circle cx="160" cy="34" r="8" fill="#ffaa00" opacity="0.22" />
      <text x="160" y="152" textAnchor="middle" fontSize="9" fill="#6a6080">
        ← shadow wall
      </text>
      <text x="160" y="28" textAnchor="middle" fontSize="8" fill="#ff8800" opacity="0.6">
        fire (unseen)
      </text>
    </svg>
  )
}

function SceneFirePuppets() {
  return (
    <svg viewBox="0 0 320 160" aria-label="Freed prisoner sees fire and puppets" className="w-full">
      <rect x="0" y="0" width="320" height="160" fill="#1a1520" />
      {/* fire */}
      <ellipse cx="160" cy="60" rx="20" ry="28" fill="#ff6600" opacity="0.7" />
      <ellipse cx="160" cy="58" rx="12" ry="20" fill="#ffaa00" opacity="0.8" />
      <ellipse cx="160" cy="56" rx="6" ry="12" fill="#ffdd88" opacity="0.9" />
      {/* glow */}
      <circle cx="160" cy="60" r="50" fill="#ff8800" opacity="0.07" />
      {/* puppets on walkway */}
      {[100, 220].map((x) => (
        <g key={x}>
          <circle cx={x} cy="80" r="7" fill="#8070a0" />
          <rect x={x - 4} y="87" width="8" height="14" rx="2" fill="#8070a0" />
          {/* puppet handle */}
          <line x1={x} y1="80" x2={x} y2="65" stroke="#6060a0" strokeWidth="1.5" />
        </g>
      ))}
      {/* freed prisoner — turning, looking back */}
      <circle cx="80" cy="128" r="9" fill="#a090c0" />
      <rect x="75" y="137" width="10" height="16" rx="3" fill="#a090c0" />
      {/* shadow on front wall */}
      <rect x="10" y="90" width="5" height="50" fill="#3a3050" />
      <ellipse cx="12" cy="88" rx="12" ry="7" fill="#3a3050" opacity="0.5" />
      <text x="160" y="155" textAnchor="middle" fontSize="9" fill="#aa9090">
        the fire casts the shadows
      </text>
    </svg>
  )
}

function SceneSunlight() {
  return (
    <svg viewBox="0 0 320 160" aria-label="Prisoner dragged into sunlight" className="w-full">
      {/* sky gradient */}
      <defs>
        <linearGradient id="skygrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffbe6" />
          <stop offset="60%" stopColor="#ffe4a0" />
          <stop offset="100%" stopColor="#c8c0b0" />
        </linearGradient>
        <radialGradient id="sungrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#ffe066" />
          <stop offset="100%" stopColor="#ff9900" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="320" height="160" fill="url(#skygrad)" />
      {/* sun — blinding, near centre */}
      <circle cx="160" cy="55" r="38" fill="url(#sungrad)" opacity="0.85" />
      <circle cx="160" cy="55" r="22" fill="#fff" opacity="0.9" />
      {/* cave opening at bottom */}
      <rect x="110" y="120" width="100" height="40" rx="8" fill="#1a1520" />
      {/* figure stumbling out, hands over eyes */}
      <circle cx="160" cy="105" r="9" fill="#7a6890" />
      <rect x="155" y="114" width="10" height="17" rx="3" fill="#7a6890" />
      {/* arms shielding */}
      <line x1="155" y1="118" x2="145" y2="108" stroke="#7a6890" strokeWidth="3" strokeLinecap="round" />
      <line x1="165" y1="118" x2="175" y2="108" stroke="#7a6890" strokeWidth="3" strokeLinecap="round" />
      <text x="160" y="155" textAnchor="middle" fontSize="9" fill="#806040">
        blinded — genuine knowledge hurts at first
      </text>
    </svg>
  )
}

function SceneRealWorld() {
  return (
    <svg viewBox="0 0 320 160" aria-label="Philosopher sees the real world and the sun" className="w-full">
      <defs>
        <radialGradient id="sunouter" cx="50%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#fffbe0" />
          <stop offset="100%" stopColor="#88aadd" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="320" height="160" fill="url(#sunouter)" />
      {/* sun */}
      <circle cx="160" cy="32" r="22" fill="#ffe060" opacity="0.9" />
      <circle cx="160" cy="32" r="15" fill="#fff5c0" opacity="0.95" />
      {/* sun rays */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 8
        const r1 = 26, r2 = 38
        return (
          <line
            key={i}
            x1={160 + r1 * Math.cos(a)}
            y1={32 + r1 * Math.sin(a)}
            x2={160 + r2 * Math.cos(a)}
            y2={32 + r2 * Math.sin(a)}
            stroke="#ffcc44"
            strokeWidth="2"
            opacity="0.7"
          />
        )
      })}
      {/* trees */}
      {[60, 240].map((x) => (
        <g key={x}>
          <rect x={x - 4} y="100" width="8" height="40" fill="#8b6f47" />
          <ellipse cx={x} cy="90" rx="22" ry="28" fill="#3a7a3a" />
          <ellipse cx={x} cy="82" rx="16" ry="20" fill="#4a9a4a" />
        </g>
      ))}
      {/* ground */}
      <rect x="0" y="130" width="320" height="30" fill="#6aaa4a" />
      {/* philosopher standing, looking up */}
      <circle cx="160" cy="110" r="9" fill="#a090c0" />
      <rect x="155" y="119" width="10" height="18" rx="3" fill="#a090c0" />
      <text x="160" y="155" textAnchor="middle" fontSize="9" fill="#204020">
        the sun = the Form of the Good (ultimate truth)
      </text>
    </svg>
  )
}

function SceneReturn() {
  return (
    <svg viewBox="0 0 320 160" aria-label="Philosopher returns to cave" className="w-full">
      <rect x="0" y="0" width="320" height="160" fill="#1a1520" />
      {/* faint outside light at top-right */}
      <ellipse cx="290" cy="20" rx="60" ry="40" fill="#ffe080" opacity="0.12" />
      {/* cave wall / screen */}
      <rect x="30" y="80" width="260" height="4" rx="2" fill="#3a3050" />
      {/* prisoners still watching shadows */}
      {[80, 160, 240].map((x) => (
        <g key={x}>
          <circle cx={x} cy="118" r="8" fill="#4a4060" />
          <rect x={x - 5} y="126" width="10" height="18" rx="3" fill="#4a4060" />
        </g>
      ))}
      {/* returning philosopher — glowing slightly */}
      <circle cx="290" cy="118" r="9" fill="#c0b0e0" />
      <rect x="285" y="127" width="10" height="18" rx="3" fill="#c0b0e0" />
      {/* speech bubble (they don't believe) */}
      <rect x="170" y="50" width="110" height="24" rx="6" fill="#2a2040" stroke="#5a5080" strokeWidth="1" />
      <text x="225" y="66" textAnchor="middle" fontSize="9" fill="#8080b0">
        "That's impossible…"
      </text>
      <line x1="225" y1="74" x2="240" y2="82" stroke="#5a5080" strokeWidth="1" />
      <text x="160" y="155" textAnchor="middle" fontSize="9" fill="#8080a0">
        the truth-teller returns — and is not believed
      </text>
    </svg>
  )
}

const SCENES = [SceneChained, SceneFirePuppets, SceneSunlight, SceneRealWorld, SceneReturn]

export function CaveAllegory() {
  const [active, setActive] = useState(0)
  const step = STEPS[active]!
  const Scene = SCENES[active]!

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      {/* step tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border bg-surface-2 p-2">
        {STEPS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(s.id)}
            className={cn(
              'rounded-lg border px-2 py-1 text-xs transition-colors',
              active === s.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {s.id + 1}. {s.label}
          </button>
        ))}
      </div>

      {/* scene */}
      <div className="p-3">
        <div className="overflow-hidden rounded-xl border border-border">
          <Scene />
        </div>
      </div>

      {/* meaning */}
      <div className="mx-3 mb-3 rounded-xl border border-border bg-surface-2 p-3 text-sm text-muted">
        <span className="font-semibold text-ink">Step {active + 1} — {step.label}. </span>
        {step.meaning.split('**').map((chunk, i) =>
          i % 2 === 1 ? (
            <strong key={i} className="text-accent">
              {chunk}
            </strong>
          ) : (
            <span key={i}>{chunk}</span>
          ),
        )}
      </div>

      {/* prev / next */}
      <div className="flex justify-between border-t border-border px-3 py-2">
        <button
          type="button"
          disabled={active === 0}
          onClick={() => setActive((n) => n - 1)}
          className="rounded-lg border border-border px-3 py-1 text-xs text-muted hover:text-ink disabled:opacity-30"
        >
          ← Previous
        </button>
        <span className="self-center text-xs text-muted">
          {active + 1} / {STEPS.length}
        </span>
        <button
          type="button"
          disabled={active === STEPS.length - 1}
          onClick={() => setActive((n) => n + 1)}
          className="rounded-lg border border-border px-3 py-1 text-xs text-muted hover:text-ink disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
