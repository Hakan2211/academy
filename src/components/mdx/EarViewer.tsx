import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// A labelled cross-section of the ear, grouped into outer / middle / inner.
// Click a part to learn its job; toggle the travelling sound wave to watch
// vibration pass pinna → canal → eardrum → ossicles → cochlea, where hair cells
// finally transduce it into nerve signals. The wave dot is animated via rAF +
// setAttribute on a ref (no per-frame React state).
type Part = {
  key: string
  region: 'Outer' | 'Middle' | 'Inner'
  name: string
  role: string
}

const PARTS: Array<Part> = [
  { key: 'pinna', region: 'Outer', name: 'Pinna (outer ear)', role: 'The visible flap. Funnels sound waves into the ear canal.' },
  { key: 'canal', region: 'Outer', name: 'Ear canal', role: 'Channels sound to the eardrum and amplifies certain frequencies.' },
  { key: 'eardrum', region: 'Middle', name: 'Eardrum', role: 'A taut membrane that vibrates in step with the incoming sound waves.' },
  { key: 'ossicles', region: 'Middle', name: 'Ossicles', role: 'Three tiny bones (hammer, anvil, stirrup) that lever and amplify the vibration.' },
  { key: 'cochlea', region: 'Inner', name: 'Cochlea', role: 'A coiled, fluid-filled tube. The vibration becomes a wave travelling along its length.' },
  { key: 'haircells', region: 'Inner', name: 'Hair cells', role: 'Sit on the basilar membrane. Bending of their tiny hairs transduces motion into nerve impulses.' },
  { key: 'auditory', region: 'Inner', name: 'Auditory nerve', role: 'Carries the impulses to the brain, which interprets pitch, loudness and timbre.' },
]

const REGION_COLOR: Record<Part['region'], string> = {
  Outer: '#4F8CFF',
  Middle: '#FDCB6E',
  Inner: '#00CEC9',
}

// Path the sound dot travels along (matches the drawing).
const PATH = 'M 20 60 L 70 110 L 120 110 L 165 110 L 210 110 C 250 110 250 150 215 165'

export function EarViewer() {
  const [sel, setSel] = useState('eardrum')
  const [playing, setPlaying] = useState(true)
  const dotRef = useRef<SVGCircleElement | null>(null)
  const pathRef = useRef<SVGPathElement | null>(null)

  const part = PARTS.find((p) => p.key === sel) ?? PARTS[0]

  useEffect(() => {
    if (!playing) return
    const path = pathRef.current
    if (!path) return
    const len = path.getTotalLength()
    let raf = 0
    let start = 0
    const loop = (now: number) => {
      if (!start) start = now
      const t = ((now - start) % 2200) / 2200
      const pt = path.getPointAtLength(t * len)
      const el = dotRef.current
      if (el) {
        el.setAttribute('cx', pt.x.toFixed(1))
        el.setAttribute('cy', pt.y.toFixed(1))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  const isSel = (k: string) => sel === k

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-2 flex flex-wrap gap-1.5">
        {PARTS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setSel(p.key)}
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs transition-colors',
              isSel(p.key) ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {p.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          className={cn(
            'ml-auto rounded-full border px-2.5 py-1 text-xs transition-colors',
            playing ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          {playing ? 'Pause wave' : 'Play wave'}
        </button>
      </div>

      <svg viewBox="0 0 280 200" className="w-full">
        {/* region bands */}
        <text x="55" y="16" textAnchor="middle" fontSize="9" fill={REGION_COLOR.Outer}>Outer</text>
        <text x="150" y="16" textAnchor="middle" fontSize="9" fill={REGION_COLOR.Middle}>Middle</text>
        <text x="225" y="16" textAnchor="middle" fontSize="9" fill={REGION_COLOR.Inner}>Inner</text>

        {/* Pinna */}
        <path d="M 16 50 Q 6 90 30 95 L 36 70 Z" fill={isSel('pinna') ? 'var(--color-accent)' : '#4F8CFF'} opacity="0.5" stroke={isSel('pinna') ? 'var(--color-accent)' : 'var(--color-border)'} strokeWidth={isSel('pinna') ? 3 : 2} />

        {/* Ear canal */}
        <path d="M 30 100 L 110 120 L 110 100 L 36 80 Z" fill={isSel('canal') ? 'var(--color-accent)' : 'var(--color-surface-2)'} stroke={isSel('canal') ? 'var(--color-accent)' : 'var(--color-border)'} strokeWidth={isSel('canal') ? 3 : 2} />

        {/* Eardrum */}
        <line x1="115" y1="92" x2="115" y2="128" stroke={isSel('eardrum') ? 'var(--color-accent)' : '#FDCB6E'} strokeWidth={isSel('eardrum') ? 5 : 3} />

        {/* Ossicles (three small bones) */}
        <g stroke={isSel('ossicles') ? 'var(--color-accent)' : '#FDCB6E'} strokeWidth={isSel('ossicles') ? 3 : 2} fill="none">
          <path d="M 120 100 l 14 6 l -4 12" />
          <circle cx="146" cy="108" r="4" />
        </g>

        {/* Cochlea (spiral) */}
        <path
          d="M 210 110 m 0 0 a 26 26 0 1 1 -2 0 a 18 18 0 1 0 2 12 a 10 10 0 1 1 -2 6"
          fill="none"
          stroke={isSel('cochlea') ? 'var(--color-accent)' : '#00CEC9'}
          strokeWidth={isSel('cochlea') ? 4 : 3}
        />

        {/* Hair cells marker */}
        <g fill={isSel('haircells') ? 'var(--color-accent)' : '#00CEC9'}>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={200 + i * 5} y1={148} x2={200 + i * 5} y2={140 - (i % 2) * 4} stroke={isSel('haircells') ? 'var(--color-accent)' : '#00CEC9'} strokeWidth="1.5" />
          ))}
        </g>

        {/* Auditory nerve */}
        <path d="M 215 165 q 30 18 52 8" fill="none" stroke={isSel('auditory') ? 'var(--color-accent)' : '#00CEC9'} strokeWidth={isSel('auditory') ? 4 : 3} />

        {/* Travelling sound path + dot */}
        <path ref={pathRef} d={PATH} fill="none" stroke="none" />
        {playing && <circle ref={dotRef} cx="20" cy="60" r="4.5" fill="#FF6B9D" />}
      </svg>

      <div className="mt-1 rounded-xl bg-surface-2 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: REGION_COLOR[part.region] }}>
          {part.region} ear
        </p>
        <p className="text-sm font-semibold text-accent">{part.name}</p>
        <p className="mt-0.5 text-sm text-muted">{part.role}</p>
      </div>
    </div>
  )
}
