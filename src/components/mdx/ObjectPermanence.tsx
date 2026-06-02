import { useState } from 'react'
import { cn } from '#/lib/cn'

// Object permanence: knowing a thing still exists when you can't see it. Hide a
// toy under a cloth. A YOUNG infant (~4 months) acts as if it ceased to exist
// and doesn't search. An OLDER infant (~10 months) lifts the cloth to find it.
// Toggle the age, then cover the toy.
type Age = 'young' | 'old'

export function ObjectPermanence() {
  const [age, setAge] = useState<Age>('young')
  const [covered, setCovered] = useState(false)

  const searches = age === 'old'

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 flex flex-wrap gap-2 px-1">
        {(['young', 'old'] as Array<Age>).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => {
              setAge(a)
              setCovered(false)
            }}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              age === a ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {a === 'young' ? '~4-month-old' : '~10-month-old'}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 180" className="w-full">
        {/* table */}
        <line x1={20} y1={140} x2={340} y2={140} stroke="var(--color-border)" strokeWidth="2" />

        {/* the toy */}
        <g>
          <circle cx={180} cy={118} r={20} fill="#E17055" />
          <circle cx={173} cy={112} r={4} fill="#fff" />
          <circle cx={187} cy={112} r={4} fill="#fff" />
          <path d="M170 124 Q180 132 190 124" fill="none" stroke="#fff" strokeWidth="2" />
        </g>

        {/* the cloth */}
        {covered && (
          <path
            d="M150 138 Q150 86 180 86 Q210 86 210 138 Z"
            fill="#A29BFE"
            stroke="#6C5CE7"
            strokeWidth="2"
          />
        )}

        {/* the infant's "thought bubble" */}
        <g transform="translate(60 30)">
          <ellipse cx={0} cy={0} rx={48} ry={28} fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
          <circle cx={20} cy={34} r={5} fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
          {covered && !searches ? (
            // young infant: toy is gone from the mind
            <text x={0} y={5} textAnchor="middle" fontSize="22" fill="var(--color-muted)">
              ?
            </text>
          ) : (
            // toy still pictured (visible, or older infant remembers)
            <circle cx={0} cy={0} r={11} fill="#E17055" opacity={covered ? 0.9 : 0.5} />
          )}
        </g>
        <text x={60} y={74} textAnchor="middle" fontSize="8" fill="var(--color-muted)">
          baby's mind
        </text>

        {covered && searches && (
          <text x={300} y={120} textAnchor="middle" fontSize="22" fill="var(--color-accent)">
            🤚
          </text>
        )}
      </svg>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setCovered((c) => !c)}
          className="rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm font-medium text-accent"
        >
          {covered ? 'Lift the cloth' : 'Cover the toy with a cloth'}
        </button>
      </div>

      <div className="mt-3 min-h-[3.5rem] rounded-xl bg-surface-2 p-3 text-center">
        {!covered ? (
          <p className="text-sm text-muted">The toy is in plain sight. Both infants happily look at it. Now hide it.</p>
        ) : searches ? (
          <p className="text-sm" style={{ color: 'var(--color-success)' }}>
            <span className="font-semibold">The older infant reaches for the cloth.</span> They have developed object permanence: the toy still exists in their mind even when hidden.
          </p>
        ) : (
          <p className="text-sm" style={{ color: '#E74C3C' }}>
            <span className="font-semibold">The young infant just stares — and doesn't search.</span> Out of sight is out of mind: for them the toy has, in a sense, ceased to exist.
          </p>
        )}
      </div>
    </div>
  )
}
