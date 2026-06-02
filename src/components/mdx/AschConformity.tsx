import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Asch's line-judgment task. A reference line is shown next to three comparison
// lines; the answer (B) is obvious. But seven confederates, one after another,
// confidently call out the SAME wrong line. Now it's your turn. The learner picks
// — and sees how often real participants caved to the unanimous wrong majority
// (~37% of trials; 75% conformed at least once). A "stand alone" ally toggle
// shows how a single dissenter shatters the pressure. Used in conformity.

// Reference line length (arbitrary units) and the three comparison options.
const REF = 70
const OPTIONS = [
  { id: 'A', len: 52 },
  { id: 'B', len: 70 }, // the obviously correct match
  { id: 'C', len: 88 },
] as const
const CORRECT = 'B'
const GROUP_WRONG = 'C' // what the confederates all say

export function AschConformity() {
  const [ally, setAlly] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const conformed = picked === GROUP_WRONG
  const right = picked === CORRECT

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-sm text-muted">
        Which comparison line matches the reference? It&apos;s obvious. But{' '}
        <span className="text-ink">{ally ? 'six' : 'seven'} people before you</span> just confidently said{' '}
        <span className="font-mono font-semibold text-[#E67E22]">{GROUP_WRONG}</span>
        {ally && (
          <>
            {' '}
            — except <span className="text-success">one person who said {CORRECT}</span>
          </>
        )}
        .
      </p>

      <svg viewBox="0 0 360 150" className="mt-3 w-full">
        {/* reference line */}
        <text x="60" y="20" textAnchor="middle" fontSize="10" fill="var(--color-muted)">
          reference
        </text>
        <line x1={60 - REF / 2} y1="34" x2={60 + REF / 2} y2="34" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
        <line x1="160" y1="14" x2="160" y2="120" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 3" />
        {/* comparison lines */}
        {OPTIONS.map((o, i) => {
          const cx = 220 + i * 50
          return (
            <g key={o.id}>
              <line x1={cx - o.len / 2} y1="60" x2={cx + o.len / 2} y2="60" stroke="var(--color-accent-2)" strokeWidth="4" strokeLinecap="round" />
              <text x={cx} y="80" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--color-muted)">
                {o.id}
              </text>
            </g>
          )
        })}
        {/* the chorus of confederate votes */}
        <text x="160" y="115" textAnchor="middle" fontSize="9" fill="var(--color-muted)">
          group&apos;s answer:
        </text>
        <text x="160" y="132" textAnchor="middle" fontSize="14" fontWeight="700" fill="#E67E22">
          {GROUP_WRONG}
        </text>
      </svg>

      <p className="mb-1.5 text-sm text-muted">Your call:</p>
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setPicked(o.id)}
            className={cn(
              'rounded-xl border px-3 py-2 text-sm font-semibold transition-colors',
              picked === o.id ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            Line {o.id}
          </button>
        ))}
      </div>

      <label className="mt-3 flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" checked={ally} onChange={(e) => setAlly(e.target.checked)} className="accent-accent" />
        Give me one ally who tells the truth
      </label>

      {picked && (
        <div className="mt-3 flex gap-2 rounded-xl border border-border bg-surface-2 p-3">
          <span className={cn('mt-0.5 shrink-0', right ? 'text-success' : 'text-[#E67E22]')}>
            <Icon name={right ? 'CheckCircle2' : 'Users'} size={16} />
          </span>
          <p className="text-sm leading-snug text-ink">
            {conformed ? (
              <>
                <span className="font-semibold text-[#E67E22]">You conformed. </span>
                You ignored your own eyes to match the group — exactly what about a third of Asch&apos;s trials produced, and{' '}
                <span className="text-ink">75% of people did at least once</span>.
              </>
            ) : (
              <>
                <span className="font-semibold text-success">You held firm. </span>
                {ally
                  ? 'With even one ally breaking the unanimity, conformity collapses — it drops to near zero. The pressure was never about the lines; it was about being the lone dissenter.'
                  : 'Easy to say from a screen — but facing seven confident strangers, most people doubt themselves. Try adding an ally and notice how much lighter the pressure feels.'}
              </>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
