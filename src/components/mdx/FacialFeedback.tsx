import { useState } from 'react'
import { cn } from '#/lib/cn'

// The facial-feedback hypothesis: our expressions don't just broadcast feelings,
// they feed back and nudge them. In the classic study, people held a pen in
// their teeth (forcing a smile) or their lips (forcing a frown) and rated
// cartoons — the "smilers" found them funnier. Toggle the held expression and
// watch the reported amusement shift.
type Pose = 'smile' | 'neutral' | 'frown'

const POSES: Record<Pose, { label: string; rating: number; note: string; mouth: string; brow: string }> = {
  smile: {
    label: 'Pen in teeth (forces a smile)',
    rating: 7.2,
    note: 'Activating the smile muscles feeds back to the brain — the cartoons feel a little funnier, even though nothing about them changed.',
    mouth: 'M40 74 Q60 90 80 74',
    brow: 'M40 44 Q48 41 56 44 M64 44 Q72 41 80 44',
  },
  neutral: {
    label: 'Relaxed face',
    rating: 5.4,
    note: 'A baseline reading with no expression nudging the feeling either way.',
    mouth: 'M42 80 L78 80',
    brow: 'M40 45 L56 45 M64 45 L80 45',
  },
  frown: {
    label: 'Pen in lips (forces a frown)',
    rating: 4.1,
    note: 'Engaging the frown muscles feeds back as mild displeasure — the very same cartoons are rated less amusing.',
    mouth: 'M40 84 Q60 70 80 84',
    brow: 'M40 42 L56 48 M80 42 L64 48',
  },
}

export function FacialFeedback() {
  const [pose, setPose] = useState<Pose>('neutral')
  const p = POSES[pose]
  const pct = (p.rating / 10) * 100

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {(['frown', 'neutral', 'smile'] as Array<Pose>).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setPose(k)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              pose === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="grid items-center gap-3 sm:grid-cols-[auto_1fr]">
        <svg viewBox="0 0 120 120" className="mx-auto h-36 w-36">
          <circle cx="60" cy="62" r="50" fill="#FFE0B2" stroke="#FF7043" strokeWidth="2.5" />
          <path d={p.brow} fill="none" stroke="#1d1d1f" strokeWidth="3" strokeLinecap="round" />
          <circle cx="48" cy="56" r="3.5" fill="#1d1d1f" />
          <circle cx="72" cy="56" r="3.5" fill="#1d1d1f" />
          <path d={p.mouth} fill="none" stroke="#1d1d1f" strokeWidth="3.5" strokeLinecap="round" />
          {/* the pen being held */}
          <rect x="36" y={pose === 'smile' ? 70 : pose === 'frown' ? 78 : 76} width="48" height="4" rx="2" fill="#FBC02D" stroke="#F9A825" strokeWidth="1" />
        </svg>

        <div className="rounded-xl border border-border bg-surface-2 p-3">
          <p className="text-sm font-medium text-ink">{p.label}</p>
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Reported amusement</span>
              <span className="font-mono text-ink">{p.rating.toFixed(1)} / 10</span>
            </div>
            <div className="mt-1 h-3 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: 'var(--color-accent)' }}
              />
            </div>
          </div>
          <p className="mt-2 text-sm leading-snug text-muted">{p.note}</p>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        The same cartoons, the same person — only the held expression differs. Expression doesn&apos;t merely show
        feeling; it gently <span className="text-ink">shapes</span> it.
      </p>
    </div>
  )
}
