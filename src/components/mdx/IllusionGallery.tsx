import { useState } from 'react'
import { cn } from '#/lib/cn'

// A gallery of the great geometric illusions. Each one fools the visual system
// in a specific way; hit "Reveal" to overlay a measuring guide proving the
// lines, circles or rows are actually equal / straight. The illusions survive
// even after you know the trick — perception isn't fully under conscious
// control. The flagship interactive of the deep-dive.
type Key = 'muller' | 'ponzo' | 'ebbinghaus' | 'cafewall' | 'kanizsa'

const TABS: Array<[Key, string]> = [
  ['muller', 'Müller-Lyer'],
  ['ponzo', 'Ponzo'],
  ['ebbinghaus', 'Ebbinghaus'],
  ['cafewall', 'Café wall'],
  ['kanizsa', 'Kanizsa'],
]

const COPY: Record<Key, { q: string; a: string }> = {
  muller: {
    q: 'Which horizontal line is longer?',
    a: 'They are identical. The outward-pointing fins make a line look longer than the inward-pointing one — your brain reads the fins as depth (a near vs far corner).',
  },
  ponzo: {
    q: 'Which yellow bar is bigger?',
    a: 'Both bars are the same size. The converging rails read as receding into distance, so the "farther" top bar is scaled up by your size-constancy machinery.',
  },
  ebbinghaus: {
    q: 'Which orange centre circle is larger?',
    a: 'The two orange circles are equal. A circle ringed by large neighbours looks small; ringed by small ones it looks large — judgement is relative to context.',
  },
  cafewall: {
    q: 'Are the long grey lines sloped or parallel?',
    a: 'Perfectly parallel and horizontal. The offset rows of light and dark tiles fool edge-detectors into seeing wedges, tilting the mortar lines.',
  },
  kanizsa: {
    q: 'Do you see a bright triangle?',
    a: 'There is no triangle — no edges are drawn. Your brain infers illusory contours and even a brighter-than-white surface from the three notched circles. Perception builds what should be there.',
  },
}

const ACCENT = '#00CEC9'

export function IllusionGallery() {
  const [key, setKey] = useState<Key>('muller')
  const [reveal, setReveal] = useState(false)

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {TABS.map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setKey(k)
              setReveal(false)
            }}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              key === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setReveal((v) => !v)}
          className={cn(
            'ml-auto rounded-full border px-3 py-1 text-sm transition-colors',
            reveal ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          {reveal ? 'Hide proof' : 'Reveal'}
        </button>
      </div>

      <svg viewBox="0 0 360 220" className="w-full rounded-xl bg-surface-2">
        {key === 'muller' && (
          <g stroke="var(--color-ink)" strokeWidth="3" fill="none" strokeLinecap="round">
            {/* top line, outward fins */}
            <line x1="110" y1="70" x2="250" y2="70" />
            <path d="M 110 70 l 16 -12 M 110 70 l 16 12" />
            <path d="M 250 70 l -16 -12 M 250 70 l -16 12" />
            {/* bottom line, inward fins — same length */}
            <line x1="110" y1="150" x2="250" y2="150" />
            <path d="M 110 150 l -16 -12 M 110 150 l -16 12" />
            <path d="M 250 150 l 16 -12 M 250 150 l 16 12" />
            {reveal && (
              <g stroke={ACCENT} strokeWidth="2" strokeDasharray="4 3">
                <line x1="110" y1="60" x2="110" y2="160" />
                <line x1="250" y1="60" x2="250" y2="160" />
              </g>
            )}
          </g>
        )}

        {key === 'ponzo' && (
          <g>
            <g stroke="var(--color-muted)" strokeWidth="2">
              <line x1="150" y1="200" x2="180" y2="30" />
              <line x1="210" y1="200" x2="180" y2="30" />
            </g>
            <rect x="140" y="60" width="80" height="14" fill="#FDCB6E" stroke="#c79a3a" />
            <rect x="140" y="150" width="80" height="14" fill="#FDCB6E" stroke="#c79a3a" />
            {reveal && (
              <g stroke={ACCENT} strokeWidth="2" strokeDasharray="4 3">
                <line x1="135" y1="60" x2="135" y2="74" />
                <line x1="225" y1="60" x2="225" y2="74" />
                <line x1="135" y1="150" x2="135" y2="164" />
                <line x1="225" y1="150" x2="225" y2="164" />
              </g>
            )}
          </g>
        )}

        {key === 'ebbinghaus' && (
          <g>
            {/* left: big surround */}
            {[0, 60, 120, 180, 240, 300].map((deg) => {
              const a = (deg * Math.PI) / 180
              return <circle key={`l${deg}`} cx={95 + Math.cos(a) * 42} cy={110 + Math.sin(a) * 42} r="18" fill="#9aa6b2" />
            })}
            <circle cx="95" cy="110" r="20" fill="#FF8A3D" />
            {/* right: small surround */}
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * 45 * Math.PI) / 180
              return <circle key={`r${i}`} cx={265 + Math.cos(a) * 36} cy={110 + Math.sin(a) * 36} r="7" fill="#9aa6b2" />
            })}
            <circle cx="265" cy="110" r="20" fill="#FF8A3D" />
            {reveal && (
              <g stroke={ACCENT} strokeWidth="2" strokeDasharray="4 3" fill="none">
                <circle cx="95" cy="110" r="20" />
                <circle cx="265" cy="110" r="20" />
              </g>
            )}
          </g>
        )}

        {key === 'cafewall' &&
          Array.from({ length: 6 }).map((_, row) => (
            <g key={row}>
              {Array.from({ length: 10 }).map((__, col) => {
                const offset = (row % 2) * 18
                const x = col * 36 + offset - 18
                const dark = (col + row) % 2 === 0
                return <rect key={col} x={x} y={20 + row * 30} width="36" height="22" fill={dark ? 'var(--color-ink)' : '#f3f3f3'} />
              })}
              {/* mortar line */}
              <line x1="0" y1={42 + row * 30} x2="360" y2={42 + row * 30} stroke="#8a8a8a" strokeWidth="2" />
              {reveal && row < 5 && <line x1="0" y1={42 + row * 30} x2="360" y2={42 + row * 30} stroke={ACCENT} strokeWidth="1.5" strokeDasharray="5 3" />}
            </g>
          ))}

        {key === 'kanizsa' && (
          <g>
            {/* three pac-man circles whose mouths suggest a triangle */}
            {[
              { cx: 110, cy: 60, rot: 30 },
              { cx: 250, cy: 60, rot: 150 },
              { cx: 180, cy: 175, rot: 270 },
            ].map((p, i) => (
              <path
                key={i}
                d={`M ${p.cx} ${p.cy} L ${p.cx + 26 * Math.cos((p.rot * Math.PI) / 180)} ${p.cy + 26 * Math.sin((p.rot * Math.PI) / 180)} A 26 26 0 1 0 ${p.cx + 26 * Math.cos(((p.rot + 60) * Math.PI) / 180)} ${p.cy + 26 * Math.sin(((p.rot + 60) * Math.PI) / 180)} Z`}
                fill="var(--color-ink)"
              />
            ))}
            {reveal && (
              <polygon points="110 60, 250 60, 180 175" fill="none" stroke={ACCENT} strokeWidth="2" strokeDasharray="5 3" />
            )}
          </g>
        )}
      </svg>

      <div className="mt-3 rounded-xl bg-surface-2 p-3">
        <p className="text-sm font-semibold text-ink">{COPY[key].q}</p>
        {reveal && <p className="mt-1 text-sm text-muted">{COPY[key].a}</p>}
        {!reveal && <p className="mt-1 text-sm text-muted">Make your guess, then hit <span className="text-accent">Reveal</span>.</p>}
      </div>
    </div>
  )
}
