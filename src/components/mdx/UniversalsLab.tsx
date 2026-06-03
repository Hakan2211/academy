import { useState } from 'react'
import { cn } from '#/lib/cn'

// The Problem of Universals. Toggle between REALISM (there is one abstract
// "Redness" shared by all red things) and NOMINALISM (no extra entity — just
// particular things we label with a name).

type View = 'realism' | 'nominalism'

type Obj = {
  id: string
  label: string
  shape: 'apple' | 'rose' | 'car'
}

const OBJECTS: Array<Obj> = [
  { id: 'apple', label: 'Apple', shape: 'apple' },
  { id: 'rose', label: 'Rose', shape: 'rose' },
  { id: 'car', label: 'Car', shape: 'car' },
]

const RED = '#e03030'
const RED_GLOW = '#ff606080'

function AppleSVG({ glow }: { glow: boolean }) {
  return (
    <svg viewBox="0 0 60 60" className="h-full w-full" aria-label="apple">
      {glow && <circle cx="30" cy="32" r="26" fill={RED_GLOW} />}
      <ellipse cx="30" cy="35" rx="20" ry="22" fill={RED} />
      <ellipse cx="30" cy="35" rx="20" ry="22" fill="none" stroke="#b02020" strokeWidth="1.5" />
      {/* stem */}
      <line x1="30" y1="13" x2="30" y2="6" stroke="#5a3010" strokeWidth="2.5" strokeLinecap="round" />
      {/* leaf */}
      <ellipse cx="36" cy="8" rx="7" ry="4" fill="#4a9a4a" transform="rotate(-30 36 8)" />
      {/* shine */}
      <ellipse cx="23" cy="26" rx="4" ry="6" fill="#ff9090" opacity="0.4" transform="rotate(-20 23 26)" />
    </svg>
  )
}

function RoseSVG({ glow }: { glow: boolean }) {
  return (
    <svg viewBox="0 0 60 60" className="h-full w-full" aria-label="rose">
      {glow && <circle cx="30" cy="30" r="26" fill={RED_GLOW} />}
      {/* petals */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx={30 + 12 * Math.cos((deg * Math.PI) / 180)}
          cy={30 + 12 * Math.sin((deg * Math.PI) / 180)}
          rx="9"
          ry="5"
          fill={RED}
          stroke="#b02020"
          strokeWidth="0.8"
          transform={`rotate(${deg} ${30 + 12 * Math.cos((deg * Math.PI) / 180)} ${30 + 12 * Math.sin((deg * Math.PI) / 180)})`}
        />
      ))}
      {/* centre */}
      <circle cx="30" cy="30" r="8" fill="#cc2020" stroke="#901818" strokeWidth="1" />
      <circle cx="30" cy="30" r="4" fill="#ff5050" opacity="0.6" />
      {/* stem */}
      <line x1="30" y1="48" x2="30" y2="58" stroke="#2a7a2a" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="36" cy="53" rx="7" ry="3.5" fill="#3a8a3a" transform="rotate(30 36 53)" />
    </svg>
  )
}

function CarSVG({ glow }: { glow: boolean }) {
  return (
    <svg viewBox="0 0 60 60" className="h-full w-full" aria-label="red car">
      {glow && <ellipse cx="30" cy="38" rx="28" ry="18" fill={RED_GLOW} />}
      {/* body */}
      <rect x="6" y="32" width="48" height="18" rx="4" fill={RED} />
      {/* roof */}
      <path d="M16 32 Q20 18 40 18 Q44 18 48 32 Z" fill={RED} stroke="#b02020" strokeWidth="1" />
      {/* windows */}
      <path d="M19 32 Q22 20 36 20 Q40 20 44 32 Z" fill="#aaccee" opacity="0.7" />
      {/* wheels */}
      {[15, 45].map((x) => (
        <g key={x}>
          <circle cx={x} cy="50" r="8" fill="#222" />
          <circle cx={x} cy="50" r="4" fill="#777" />
          <circle cx={x} cy="50" r="1.5" fill="#aaa" />
        </g>
      ))}
      {/* headlights */}
      <rect x="50" y="36" width="5" height="3" rx="1" fill="#ffee88" />
      <rect x="5" y="36" width="5" height="3" rx="1" fill="#ffee88" opacity="0.4" />
      {/* shine */}
      <rect x="22" y="25" width="12" height="4" rx="2" fill="#ff9090" opacity="0.3" />
    </svg>
  )
}

const SVGS = { apple: AppleSVG, rose: RoseSVG, car: CarSVG }

const VERDICT: Record<View, { title: string; body: string }> = {
  realism: {
    title: 'Realism (Plato\'s Forms)',
    body:
      'The apple, rose, and car are all red because they each **participate in** the universal Form of Redness — an abstract, eternal thing that exists independently of any particular red object. When the last red thing in the universe burned away, Redness itself would still exist.',
  },
  nominalism: {
    title: 'Nominalism',
    body:
      "There is **no extra entity called Redness**. There are only particular things — this apple, this rose, this car. We call them all 'red' because they resemble each other in a certain way. The word 'red' is a convenient label (a *nomen* in Latin), not a pointer to any abstract object in the world.",
  },
}

export function UniversalsLab() {
  const [view, setView] = useState<View>('realism')
  const glow = view === 'realism'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Three distinct objects — what do they have in common?
      </p>

      {/* objects */}
      <div className="mb-4 flex justify-around gap-3">
        {OBJECTS.map((obj) => {
          const SvgComp = SVGS[obj.shape]
          return (
            <div key={obj.id} className="flex flex-col items-center gap-1">
              <div className="relative h-16 w-16">
                {glow && (
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ boxShadow: `0 0 18px 6px ${RED_GLOW}` }}
                  />
                )}
                <SvgComp glow={glow} />
              </div>
              <span className="text-xs text-muted">{obj.label}</span>
            </div>
          )
        })}
      </div>

      {/* abstract Redness (realism only) */}
      {glow && (
        <div className="mb-4 flex items-center justify-center gap-2">
          <div className="h-px flex-1 border-t border-dashed border-accent/50" />
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent text-xs font-bold text-accent"
            style={{ background: '#e0303018' }}
          >
            R
          </div>
          <div className="h-px flex-1 border-t border-dashed border-accent/50" />
        </div>
      )}
      {glow && (
        <p className="mb-3 text-center text-xs text-accent">
          The abstract universal "Redness" — all three participate in it
        </p>
      )}
      {!glow && (
        <div className="mb-4 flex items-center justify-center gap-2">
          <div className="h-px flex-1 border-t border-dashed border-border" />
          <span className="text-xs text-muted italic">no abstract entity</span>
          <div className="h-px flex-1 border-t border-dashed border-border" />
        </div>
      )}

      {/* toggle */}
      <div className="mb-4 flex gap-2">
        {(['realism', 'nominalism'] as Array<View>).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={cn(
              'flex-1 rounded-xl border px-3 py-2 text-sm font-medium capitalize transition-colors',
              view === v
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {v === 'realism' ? 'Realism (Plato)' : 'Nominalism'}
          </button>
        ))}
      </div>

      {/* verdict */}
      <div className="rounded-xl border border-border bg-surface-2 p-3 text-sm">
        <div className="mb-1 font-semibold text-ink">{VERDICT[view].title}</div>
        <p className="text-muted">
          {VERDICT[view].body.split('**').map((chunk, i) =>
            i % 2 === 1 ? (
              <strong key={i} className="text-ink">
                {chunk}
              </strong>
            ) : (
              <span key={i}>{chunk}</span>
            ),
          )}
        </p>
      </div>
    </div>
  )
}
