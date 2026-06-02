import { useState } from 'react'
import { cn } from '#/lib/cn'

// Freud's iceberg model of the mind. The tip above the waterline is the
// conscious; just below is the preconscious; the vast bulk underwater is the
// unconscious. The id/ego/superego are placed across these levels. Click any
// label to read its role. Presented as historical theory. Used in psychodynamic.

type Key = 'conscious' | 'preconscious' | 'unconscious' | 'id' | 'ego' | 'superego'

const INFO: Record<Key, { label: string; body: string }> = {
  conscious: {
    label: 'Conscious',
    body: 'The thin tip above the water: whatever you are aware of right now — this sentence, the room around you, your current mood.',
  },
  preconscious: {
    label: 'Preconscious',
    body: 'Just below the surface: memories and knowledge not in mind this second but easily called up — your phone number, last night\'s dinner.',
  },
  unconscious: {
    label: 'Unconscious',
    body: 'The huge submerged mass: wishes, fears and conflicts hidden from awareness yet, Freud claimed, steering much of what we feel and do.',
  },
  id: {
    label: 'Id',
    body: 'Fully unconscious. The primitive "I want it now" — raw drives for pleasure and survival, demanding immediate satisfaction.',
  },
  ego: {
    label: 'Ego',
    body: 'Spans all three levels. The realistic referee that satisfies the id\'s urges in ways the world will actually allow.',
  },
  superego: {
    label: 'Superego',
    body: 'Spans all three levels. The internalised conscience — society\'s rules and ideals, the source of guilt and pride.',
  },
}

const WATER = 78 // y of the waterline in the 360x260 viewBox

export function FreudIceberg() {
  const [sel, setSel] = useState<Key>('unconscious')

  const lvlFill = (k: Key, base: string) => (sel === k ? '#A29BFE' : base)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 260" className="mx-auto block w-full">
        {/* sky / water bands */}
        <rect x="0" y="0" width="360" height={WATER} fill="var(--color-surface-2)" />
        <rect x="0" y={WATER} width="360" height={260 - WATER} fill="#0e2233" />
        <line x1="0" y1={WATER} x2="360" y2={WATER} stroke="var(--color-accent-2)" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="350" y={WATER - 5} textAnchor="end" fontSize="9" fill="var(--color-accent-2)">waterline</text>

        {/* iceberg: small tip above, broad mass below */}
        <g onClick={() => setSel('conscious')} className="cursor-pointer">
          <polygon points="150,28 210,28 224,78 136,78" fill={lvlFill('conscious', '#dbe7ff')} opacity={0.95} />
        </g>
        <g onClick={() => setSel('preconscious')} className="cursor-pointer">
          <polygon points="136,78 224,78 232,120 128,120" fill={lvlFill('preconscious', '#9bb8e0')} opacity={0.9} />
        </g>
        <g onClick={() => setSel('unconscious')} className="cursor-pointer">
          <polygon points="128,120 232,120 256,238 104,238" fill={lvlFill('unconscious', '#4a6fa0')} opacity={0.9} />
        </g>

        {/* level labels */}
        <text x="180" y="56" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0b1020" className="pointer-events-none">Conscious</text>
        <text x="180" y="102" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0b1020" className="pointer-events-none">Preconscious</text>
        <text x="180" y="180" textAnchor="middle" fontSize="11" fontWeight="600" fill="#e7ecf7" className="pointer-events-none">Unconscious</text>

        {/* structural agencies as clickable chips along the right edge */}
        {([
          ['superego', 100],
          ['ego', 150],
          ['id', 210],
        ] as Array<[Key, number]>).map(([k, y]) => (
          <g key={k} onClick={() => setSel(k)} className="cursor-pointer">
            <rect x="280" y={y - 12} width="66" height="24" rx="12" fill={sel === k ? '#A29BFE' : 'var(--color-surface)'} stroke="#A29BFE" strokeWidth="1.5" />
            <text x="313" y={y + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill={sel === k ? '#0b1020' : '#A29BFE'} className="pointer-events-none">
              {INFO[k].label}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {(Object.keys(INFO) as Array<Key>).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setSel(k)}
            className={cn(
              'rounded-full border px-2.5 py-0.5 text-xs transition-colors',
              sel === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {INFO[k].label}
          </button>
        ))}
      </div>
      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        <span className="font-semibold text-ink">{INFO[sel].label}: </span>
        {INFO[sel].body}
      </p>
    </div>
  )
}
