import { useState } from 'react'
import { cn } from '#/lib/cn'

// Piaget's classic conservation-of-liquid task. The SAME water is poured from a
// short, wide glass into a tall, thin one. A preoperational child fixates on the
// taller column and declares "now there's more!" — they cannot yet conserve
// quantity across a change in appearance. Pour, then toggle whose verdict you see.
export function ConservationTask() {
  const [poured, setPoured] = useState(false)
  const [view, setView] = useState<'child' | 'reality'>('child')

  // Both glasses hold exactly the same volume of water (same area).
  const WIDE = { x: 40, w: 90, h: 70 } // short + wide
  const TALL = { x: 230, w: 50, h: 126 } // tall + thin (same area: 90*70 ≈ 50*126)
  const baseY = 170

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <svg viewBox="0 0 360 200" className="w-full">
        {/* left: short wide glass — always full of the original water */}
        <rect x={WIDE.x} y={baseY - WIDE.h} width={WIDE.w} height={WIDE.h} fill="none" stroke="var(--color-border)" strokeWidth="2" rx="3" />
        {!poured && (
          <rect x={WIDE.x + 2} y={baseY - WIDE.h + 2} width={WIDE.w - 4} height={WIDE.h - 4} fill="#74B9FF" opacity="0.6" rx="2" />
        )}
        <text x={WIDE.x + WIDE.w / 2} y={baseY + 14} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
          short &amp; wide
        </text>

        {/* arrow */}
        <text x={180} y={baseY - 30} textAnchor="middle" fontSize="20" fill="var(--color-accent)">
          {poured ? '→' : ''}
        </text>

        {/* right: tall thin glass — filled after pouring */}
        <rect x={TALL.x} y={baseY - TALL.h} width={TALL.w} height={TALL.h} fill="none" stroke="var(--color-border)" strokeWidth="2" rx="3" />
        {poured && (
          <rect x={TALL.x + 2} y={baseY - TALL.h + 2} width={TALL.w - 4} height={TALL.h - 4} fill="#74B9FF" opacity="0.6" rx="2" />
        )}
        <text x={TALL.x + TALL.w / 2} y={baseY + 14} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
          tall &amp; thin
        </text>

        {!poured && (
          <text x={180} y={baseY - 60} textAnchor="middle" fontSize="10" fill="var(--color-muted)">
            Same water, two glasses.
          </text>
        )}
      </svg>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setPoured((p) => !p)}
          className="rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm font-medium text-accent"
        >
          {poured ? 'Pour it back' : 'Pour into the tall glass'}
        </button>
        {poured &&
          (['child', 'reality'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                view === v ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
              )}
            >
              {v === 'child' ? "The 4-year-old's verdict" : 'The reality'}
            </button>
          ))}
      </div>

      <div className="mt-3 min-h-[3.5rem] rounded-xl bg-surface-2 p-3 text-center">
        {!poured ? (
          <p className="text-sm text-muted">
            We start with the same amount of water in the short, wide glass. The child agrees both glasses are equal. Now pour.
          </p>
        ) : view === 'child' ? (
          <p className="text-sm" style={{ color: '#E74C3C' }}>
            <span className="font-semibold">"Now there's MORE!"</span> The preoperational child fixates on the tall column and judges by height alone — they cannot yet conserve quantity.
          </p>
        ) : (
          <p className="text-sm" style={{ color: 'var(--color-success)' }}>
            <span className="font-semibold">It's exactly the same water.</span> Nothing was added or removed — only the shape changed. Around age 7 the child masters this and stops being fooled.
          </p>
        )}
      </div>
    </div>
  )
}
