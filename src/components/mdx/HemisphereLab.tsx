import { useState } from 'react'
import { cn } from '#/lib/cn'

// Split-brain demo. The optic nerves cross so the LEFT visual field projects to
// the RIGHT hemisphere and vice versa. In most people language lives in the
// LEFT hemisphere. When the corpus callosum is cut (split-brain surgery), the
// two halves can no longer share. So a word flashed to the left field reaches
// the (mute) right hemisphere: the person can't NAME it, but the left hand
// (also right-hemisphere) can POINT to the matching object.
type Field = 'left' | 'right'

const ITEMS: Record<Field, string> = { left: 'SPOON', right: 'KEY' }

export function HemisphereLab() {
  const [field, setField] = useState<Field>('right')
  const [intact, setIntact] = useState(false) // corpus callosum cut?

  // Visual field → opposite hemisphere.
  const targetHemi = field === 'left' ? 'right' : 'left'
  const word = ITEMS[field]
  // Language is in the left hemisphere. Can the person SAY the word?
  // - If the info reached the left hemisphere directly, yes.
  // - If it reached the right but the callosum is intact, it shuttles over → yes.
  // - If it reached the right and the callosum is CUT → no (but the left hand can point).
  const canName = targetHemi === 'left' || intact
  const leftFill = targetHemi === 'left' ? '#FF6B9D' : 'var(--color-surface-2)'
  const rightFill = targetHemi === 'right' ? '#FF6B9D' : 'var(--color-surface-2)'

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="self-center text-xs text-muted">Flash word to:</span>
        {(['left', 'right'] as Array<Field>).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setField(f)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              field === f ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {f} visual field
          </button>
        ))}
      </div>

      <svg viewBox="0 0 320 200" className="w-full">
        {/* fixation + the two visual fields */}
        <text x={160} y={16} textAnchor="middle" fontSize="10" fill="var(--color-muted)">eyes fixate the centre +</text>
        <line x1={160} y1={22} x2={160} y2={60} stroke="var(--color-border)" strokeWidth={1} strokeDasharray="3 3" />
        <rect x={36} y={24} width={120} height={28} rx={6} fill={field === 'left' ? '#FF6B9D22' : 'var(--color-surface-2)'} stroke="var(--color-border)" strokeWidth={1} />
        <rect x={164} y={24} width={120} height={28} rx={6} fill={field === 'right' ? '#FF6B9D22' : 'var(--color-surface-2)'} stroke="var(--color-border)" strokeWidth={1} />
        <text x={96} y={42} textAnchor="middle" fontSize="11" fill={field === 'left' ? '#FF6B9D' : 'var(--color-muted)'} fontWeight={field === 'left' ? 700 : 400}>{field === 'left' ? word : 'left field'}</text>
        <text x={224} y={42} textAnchor="middle" fontSize="11" fill={field === 'right' ? '#FF6B9D' : 'var(--color-muted)'} fontWeight={field === 'right' ? 700 : 400}>{field === 'right' ? word : 'right field'}</text>

        {/* crossing optic paths */}
        <path d={`M ${field === 'left' ? 96 : 224} 52 C ${field === 'left' ? 96 : 224} 78, ${targetHemi === 'left' ? 110 : 210} 86, ${targetHemi === 'left' ? 110 : 210} 104`} fill="none" stroke="#FF6B9D" strokeWidth={2} strokeDasharray="4 3" />

        {/* two hemispheres */}
        <path d="M 160 104 C 120 96, 96 110, 96 138 C 96 168, 130 182, 160 178 Z" fill={leftFill} stroke="var(--color-border)" strokeWidth={1.5} />
        <path d="M 160 104 C 200 96, 224 110, 224 138 C 224 168, 190 182, 160 178 Z" fill={rightFill} stroke="var(--color-border)" strokeWidth={1.5} />
        <text x={120} y={144} textAnchor="middle" fontSize="10" fill="var(--color-ink)">Left</text>
        <text x={120} y={156} textAnchor="middle" fontSize="8" fill="var(--color-muted)">language</text>
        <text x={200} y={144} textAnchor="middle" fontSize="10" fill="var(--color-ink)">Right</text>
        <text x={200} y={156} textAnchor="middle" fontSize="8" fill="var(--color-muted)">mute</text>

        {/* corpus callosum (the bridge) */}
        {intact ? (
          <line x1={150} y1={140} x2={170} y2={140} stroke="#2ECC71" strokeWidth={4} strokeLinecap="round" />
        ) : (
          <g>
            <line x1={150} y1={140} x2={156} y2={140} stroke="#E74C3C" strokeWidth={4} strokeLinecap="round" />
            <line x1={164} y1={140} x2={170} y2={140} stroke="#E74C3C" strokeWidth={4} strokeLinecap="round" />
            <text x={160} y={134} textAnchor="middle" fontSize="11" fill="#E74C3C" fontWeight="bold">✂</text>
          </g>
        )}
      </svg>

      <div className="mt-1 flex justify-center">
        <button
          type="button"
          onClick={() => setIntact((v) => !v)}
          className={cn(
            'rounded-full border px-3 py-1 text-sm transition-colors',
            intact ? 'border-border text-muted hover:text-ink' : 'border-accent bg-accent/15 text-accent',
          )}
        >
          Corpus callosum: {intact ? 'intact' : 'cut (split-brain)'}
        </button>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg bg-surface-2 px-3 py-2">
          <p className="text-xs font-semibold text-ink">"What did you see?"</p>
          <p className="text-sm" style={{ color: canName ? '#2ECC71' : '#E74C3C' }}>
            {canName ? `Says "${word}" ✓` : '"I saw nothing." ✗'}
          </p>
        </div>
        <div className="rounded-lg bg-surface-2 px-3 py-2">
          <p className="text-xs font-semibold text-ink">"Point to it with your left hand"</p>
          <p className="text-sm" style={{ color: '#2ECC71' }}>Picks the {word.toLowerCase()} ✓</p>
        </div>
      </div>

      <p className="mt-2 text-sm text-muted">
        The {field} field reaches the <span className="font-medium text-ink">{targetHemi} hemisphere</span>.{' '}
        {targetHemi === 'left'
          ? 'That side holds language, so naming is easy.'
          : intact
            ? 'The intact bridge ships the word to the left (language) side, so the person can still say it.'
            : 'With the bridge cut, the mute right hemisphere knows the word but can’t speak it — yet the left hand it controls can point right to the object.'}
      </p>
    </div>
  )
}
