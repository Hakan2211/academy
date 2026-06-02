import { useState } from 'react'
import { cn } from '#/lib/cn'

// Freud's five psychosexual stages laid out on a developmental timeline. At each
// stage, psychic energy ("libido") focuses on a body zone; an unresolved
// conflict there can leave a lasting "fixation". Strongly contested today and
// presented as historical theory. Used in psychodynamic.

const STAGES = [
  {
    name: 'Oral',
    age: '0–1 yr',
    zone: 'Mouth',
    conflict: 'Weaning — moving off the breast or bottle.',
    fixation: 'Over- or under-gratification was said to leave "oral" traits: smoking, overeating, nail-biting, or excessive dependence.',
  },
  {
    name: 'Anal',
    age: '1–3 yr',
    zone: 'Bowel/bladder',
    conflict: 'Toilet training — control over elimination.',
    fixation: 'A harsh struggle here supposedly bred either "anal-retentive" (rigid, stingy, obsessively tidy) or "anal-expulsive" (messy, careless) adults.',
  },
  {
    name: 'Phallic',
    age: '3–6 yr',
    zone: 'Genitals',
    conflict: 'The Oedipus/Electra complex — desire for the opposite-sex parent, rivalry with the same-sex parent, then identification with them.',
    fixation: 'Freud claimed unresolved conflict here shaped later identity, morality and relationships. This is his most criticised idea.',
  },
  {
    name: 'Latency',
    age: '6–puberty',
    zone: 'Dormant',
    conflict: 'No new conflict — sexual urges are "latent".',
    fixation: 'A calm period of developing friendships, skills and same-sex peer bonds rather than fixation.',
  },
  {
    name: 'Genital',
    age: 'Puberty+',
    zone: 'Genitals (mature)',
    conflict: 'Channelling mature sexual energy into adult intimacy.',
    fixation: 'If earlier stages went well, the result is a healthy, balanced adult capable of love and work.',
  },
] as const

const W = 540
const PAD = 30

export function PsychosexualStages() {
  const [sel, setSel] = useState(0)
  const s = STAGES[sel]
  const slot = (W - 2 * PAD) / STAGES.length

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${W} 96`} className="w-full">
        {/* arrow of development */}
        <line x1={PAD} y1="40" x2={W - PAD + 4} y2="40" stroke="var(--color-border)" strokeWidth="2" />
        <polygon points={`${W - PAD + 4},40 ${W - PAD - 4},36 ${W - PAD - 4},44`} fill="var(--color-border)" />
        {STAGES.map((st, i) => {
          const cx = PAD + slot * (i + 0.5)
          const active = i === sel
          return (
            <g key={st.name} onClick={() => setSel(i)} className="cursor-pointer">
              <circle cx={cx} cy="40" r={active ? 12 : 9} fill={active ? '#A29BFE' : 'var(--color-surface-2)'} stroke="#A29BFE" strokeWidth="2" />
              <text x={cx} y="20" textAnchor="middle" fontSize="11" fontWeight="600" fill={active ? '#A29BFE' : 'var(--color-muted)'}>{st.name}</text>
              <text x={cx} y="72" textAnchor="middle" fontSize="9" fill="var(--color-muted)">{st.age}</text>
            </g>
          )
        })}
      </svg>

      <div className="mt-2 rounded-xl bg-surface-2 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-ink">{s.name} stage</span>
          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">focus: {s.zone}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          <span className="font-medium text-accent">Conflict: </span>{s.conflict}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          <span className="font-medium text-accent">Fixation: </span>{s.fixation}
        </p>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {STAGES.map((st, i) => (
          <button
            key={st.name}
            type="button"
            onClick={() => setSel(i)}
            className={cn(
              'rounded-full border px-2.5 py-0.5 text-xs transition-colors',
              i === sel ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {st.name}
          </button>
        ))}
      </div>
    </div>
  )
}
