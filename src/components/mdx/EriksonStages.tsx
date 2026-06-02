import { useState } from 'react'
import { cn } from '#/lib/cn'

// Erikson's eight psychosocial stages span the whole life. At each stage a
// central CRISIS (a tension between two pulls) must be resolved; success grants
// a lasting VIRTUE. Click a point on the lifespan arc to read its conflict.
const STAGES = [
  { age: '0–1', conflict: 'Trust vs Mistrust', virtue: 'Hope', body: 'Can I rely on the world? Consistent, loving care teaches the infant that needs will be met — the bedrock of trust.' },
  { age: '1–3', conflict: 'Autonomy vs Shame', virtue: 'Will', body: 'The toddler asserts independence — feeding, toileting, choosing. Encouragement builds confidence; over-control breeds shame and doubt.' },
  { age: '3–6', conflict: 'Initiative vs Guilt', virtue: 'Purpose', body: 'The child initiates play and plans, asks endless questions, leads games. Supported, they gain purpose; criticised, they feel guilt for asserting themselves.' },
  { age: '6–12', conflict: 'Industry vs Inferiority', virtue: 'Competence', body: 'School-age children learn to make and do. Mastering skills brings a sense of competence; repeated failure breeds feelings of inferiority.' },
  { age: '12–18', conflict: 'Identity vs Role Confusion', virtue: 'Fidelity', body: 'The adolescent asks "Who am I?", trying on roles, values and beliefs. Forming a coherent identity is the central task of the teen years.' },
  { age: '18–40', conflict: 'Intimacy vs Isolation', virtue: 'Love', body: 'Young adults seek deep, committed relationships. Forming close bonds yields love; failing to do so risks loneliness and isolation.' },
  { age: '40–65', conflict: 'Generativity vs Stagnation', virtue: 'Care', body: 'Middle adults want to contribute — through family, work and mentoring the next generation. Without it comes a sense of stagnation and self-absorption.' },
  { age: '65+', conflict: 'Integrity vs Despair', virtue: 'Wisdom', body: 'Looking back, the older adult either feels their life had meaning (integrity) or is haunted by regret (despair). Integrity yields wisdom.' },
] as const

export function EriksonStages() {
  const [i, setI] = useState(0)
  const s = STAGES[i]
  const W = 360
  const PAD = 24

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <svg viewBox={`0 0 ${W} 70`} className="w-full">
        {/* the lifespan arc */}
        <path d={`M${PAD} 56 Q${W / 2} -6 ${W - PAD} 56`} fill="none" stroke="var(--color-border)" strokeWidth="2" />
        {STAGES.map((st, k) => {
          const t = k / (STAGES.length - 1)
          const x = PAD + t * (W - 2 * PAD)
          // quadratic bezier y at parameter t
          const y = (1 - t) * (1 - t) * 56 + 2 * (1 - t) * t * -6 + t * t * 56
          const active = k === i
          return (
            <g key={st.age} className="cursor-pointer" onClick={() => setI(k)}>
              <circle cx={x} cy={y} r={active ? 8 : 5} fill={active ? 'var(--color-accent)' : 'var(--color-surface-2)'} stroke={active ? 'var(--color-accent)' : 'var(--color-border)'} strokeWidth="2" />
              <text x={x} y={y - 11} textAnchor="middle" fontSize="8" fill={active ? 'var(--color-accent)' : 'var(--color-muted)'}>
                {st.age}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mb-1 flex flex-wrap gap-1">
        {STAGES.map((st, k) => (
          <button
            key={st.age}
            type="button"
            onClick={() => setI(k)}
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs transition-colors',
              k === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {st.conflict.split(' vs ')[0]}
          </button>
        ))}
      </div>

      <div className="mt-2 rounded-xl bg-surface-2 p-3">
        <div className="flex flex-wrap items-baseline justify-between gap-1">
          <p className="text-sm font-semibold text-ink">{s.conflict}</p>
          <p className="text-xs text-muted">
            age {s.age} · virtue: <span className="font-semibold text-accent">{s.virtue}</span>
          </p>
        </div>
        <p className="mt-1 text-sm leading-snug text-muted">{s.body}</p>
      </div>
    </div>
  )
}
