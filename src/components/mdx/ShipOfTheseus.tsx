import { useState } from 'react'
import { cn } from '#/lib/cn'
import { clamp } from '#/lib/philo'

// Ship of Theseus — slider for % planks replaced, plus the "second ship"
// twist toggle. User picks which ship is the "real" one, and we show that
// thoughtful philosophers disagree (numerical-identity puzzle).

type Answer = 'repaired' | 'rebuilt' | 'neither' | 'both' | null

const ANSWERS: Array<{ id: NonNullable<Answer>; label: string; philosopher: string; rationale: string }> = [
  {
    id: 'repaired',
    label: 'The repaired ship (continuous history)',
    philosopher: 'Spatial-temporal continuity view',
    rationale:
      'Identity tracks the unbroken causal-spatial chain of the object through time. Even if every plank is new, the ship never ceased to exist — it was continuously maintained. The rebuilt ship is a replica, not the original.',
  },
  {
    id: 'rebuilt',
    label: 'The rebuilt ship (original materials)',
    philosopher: 'Material constitution view',
    rationale:
      'What makes something the thing it is, is the matter composing it. The rebuilt ship contains the very same planks as the original — so it has the stronger claim. The "repaired" ship is a gradual replacement that eventually shares nothing material.',
  },
  {
    id: 'neither',
    label: 'Neither — the original was destroyed',
    philosopher: 'Strict identity view (Leibniz)',
    rationale:
      'A = B only if every property of A is a property of B. Once a single plank is swapped, the original ship no longer exists in strict logical identity. Both the repaired and rebuilt ships are qualitatively similar copies, not numerically the same object.',
  },
  {
    id: 'both',
    label: 'Both — identity is indeterminate here',
    philosopher: 'Vagueness view',
    rationale:
      '"Same ship" is a vague predicate. The question has no sharp answer, not because we lack information, but because ordinary identity-talk doesn\'t carve reality at a sufficiently fine joint for this case. Both ships have equal claim.',
  },
]

// Simple ship SVG that visually ages based on % old planks remaining
function ShipSVG({ oldPct, label }: { oldPct: number; label: string }) {
  // planks: 6 visible hull planks — color transitions from aged to new
  const planks = [0, 1, 2, 3, 4, 5]
  const plankH = 12
  const plankY = (i: number) => 58 + i * (plankH + 2)
  // each plank goes new if its index/6 < (1 - oldPct/100)
  const threshold = 1 - oldPct / 100

  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 120 130" className="h-32 w-24" aria-label={label}>
        {/* mast */}
        <line x1="60" y1="10" x2="60" y2="55" stroke="#8b6f47" strokeWidth="3" strokeLinecap="round" />
        {/* sail */}
        <path d="M62 12 Q90 32 62 52 Z" fill="#e8dcc8" stroke="#c8b898" strokeWidth="1" />
        {/* hull planks */}
        {planks.map((i) => {
          const isNew = i / planks.length >= threshold
          const fill = isNew ? '#b8cce0' : '#c8a060'
          const stroke = isNew ? '#8aaac0' : '#906020'
          return (
            <rect
              key={i}
              x="15"
              y={plankY(i)}
              width="90"
              height={plankH}
              rx="2"
              fill={fill}
              stroke={stroke}
              strokeWidth="1"
            />
          )
        })}
        {/* hull outline */}
        <path
          d={`M15 58 L15 ${plankY(5) + plankH} Q60 ${plankY(5) + plankH + 10} 105 ${plankY(5) + plankH} L105 58 Z`}
          fill="none"
          stroke="#606060"
          strokeWidth="1.5"
        />
        {/* water */}
        <path d="M5 128 Q32 122 60 128 Q88 134 115 128" fill="none" stroke="#6090c0" strokeWidth="2" opacity="0.6" />
      </svg>
      <span className="text-center text-xs text-muted">{label}</span>
      <span className="text-xs font-semibold text-accent">
        {Math.round(oldPct)}% original planks
      </span>
    </div>
  )
}

export function ShipOfTheseus() {
  const [replaced, setReplaced] = useState(0)
  const [showTwist, setShowTwist] = useState(false)
  const [answer, setAnswer] = useState<Answer>(null)

  const originalPct = 100 - replaced

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* slider */}
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs text-muted">
          <span>% of planks replaced</span>
          <span className="font-semibold text-ink">{replaced}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={replaced}
          onChange={(e) => {
            setReplaced(clamp(Number(e.target.value), 0, 100))
            setAnswer(null)
          }}
          className="w-full accent-[var(--color-accent)]"
          aria-label="Percentage of planks replaced"
        />
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>Original</span>
          <span>Half & half</span>
          <span>All new</span>
        </div>
      </div>

      {/* single ship (before twist) */}
      {!showTwist && (
        <div className="mb-4 flex justify-center">
          <ShipSVG oldPct={originalPct} label="Ship of Theseus" />
        </div>
      )}

      {/* question */}
      {!showTwist && replaced > 0 && replaced < 100 && (
        <div className="mb-4 rounded-xl border border-border bg-surface-2 p-3 text-sm text-muted">
          After replacing <strong className="text-ink">{replaced}%</strong> of the planks, is it still the same ship? There is no single moment where most people agree it flips — identity may be a matter of degree.
        </div>
      )}
      {!showTwist && replaced === 100 && (
        <div className="mb-4 rounded-xl border border-border bg-surface-2 p-3 text-sm">
          <span className="font-semibold text-warn">Every single plank has been replaced.</span>{' '}
          <span className="text-muted">Not one atom of the original ship remains. Is it still the same ship?</span>
        </div>
      )}

      {/* twist toggle */}
      <button
        type="button"
        onClick={() => { setShowTwist((v) => !v); setAnswer(null) }}
        className={cn(
          'mb-4 w-full rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
          showTwist
            ? 'border-accent bg-accent/15 text-accent'
            : 'border-border text-muted hover:text-ink',
        )}
      >
        {showTwist ? '▲ Hide the twist' : '▼ Reveal the twist: a second ship'}
      </button>

      {/* two ships side by side */}
      {showTwist && (
        <>
          <p className="mb-3 text-sm text-muted">
            The <strong className="text-ink">old planks</strong> were stored in a warehouse. Someone reassembles them into a second complete ship. Now there are two ships:
          </p>
          <div className="mb-4 flex justify-around gap-2">
            <ShipSVG oldPct={0} label="Repaired ship (continuous history)" />
            <ShipSVG oldPct={100} label="Rebuilt ship (original planks)" />
          </div>
          <p className="mb-3 text-sm font-semibold text-ink">
            Which one is the real Ship of Theseus?
          </p>

          {/* answer choices */}
          <div className="mb-4 grid grid-cols-1 gap-2">
            {ANSWERS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAnswer(a.id)}
                className={cn(
                  'rounded-xl border px-3 py-2 text-left text-sm transition-colors',
                  answer === a.id
                    ? 'border-accent bg-accent/15 text-accent'
                    : 'border-border text-muted hover:text-ink',
                )}
              >
                {a.label}
              </button>
            ))}
          </div>

          {answer && (() => {
            const chosen = ANSWERS.find((a) => a.id === answer)!
            return (
              <div className="rounded-xl border border-border bg-surface-2 p-3 text-sm">
                <div className="mb-1 font-semibold text-accent">{chosen.philosopher}</div>
                <p className="mb-2 text-muted">{chosen.rationale}</p>
                <p className="text-xs text-muted italic">
                  Note: thoughtful philosophers defend all four positions. This puzzle has no universally agreed answer — that is precisely what makes it philosophically rich.
                </p>
              </div>
            )
          })()}
        </>
      )}
    </div>
  )
}
