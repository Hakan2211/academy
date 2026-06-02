import { useState } from 'react'

// A Plutchik-style wheel of eight basic emotions. They sit in four opposing
// pairs across the circle (joy ↔ sadness, trust ↔ disgust, fear ↔ anger,
// surprise ↔ anticipation). Neighbours combine into richer "dyad" emotions —
// joy + trust = love, fear + surprise = awe. Click a wedge to explore.
type Emotion = {
  key: string
  name: string
  color: string
  // blend with the clockwise neighbour
  blendWith: string
  blend: string
}

// ordered clockwise from the top; index i opposes index i+4
const EMOTIONS: Array<Emotion> = [
  { key: 'joy', name: 'Joy', color: '#FDD835', blendWith: 'Trust', blend: 'Love' },
  { key: 'trust', name: 'Trust', color: '#66BB6A', blendWith: 'Fear', blend: 'Submission' },
  { key: 'fear', name: 'Fear', color: '#26A69A', blendWith: 'Surprise', blend: 'Awe' },
  { key: 'surprise', name: 'Surprise', color: '#42A5F5', blendWith: 'Sadness', blend: 'Disapproval' },
  { key: 'sadness', name: 'Sadness', color: '#5C6BC0', blendWith: 'Disgust', blend: 'Remorse' },
  { key: 'disgust', name: 'Disgust', color: '#AB47BC', blendWith: 'Anger', blend: 'Contempt' },
  { key: 'anger', name: 'Anger', color: '#EF5350', blendWith: 'Anticipation', blend: 'Aggression' },
  { key: 'anticipation', name: 'Anticipation', color: '#FF7043', blendWith: 'Joy', blend: 'Optimism' },
]

const N = EMOTIONS.length
const CX = 130
const CY = 130
const R_OUT = 118
const R_IN = 42
const STEP = (2 * Math.PI) / N

// build an annular wedge path for slice i
function wedge(i: number): string {
  const a0 = -Math.PI / 2 + (i - 0.5) * STEP
  const a1 = -Math.PI / 2 + (i + 0.5) * STEP
  const p = (r: number, a: number) => `${(CX + r * Math.cos(a)).toFixed(1)} ${(CY + r * Math.sin(a)).toFixed(1)}`
  return [
    `M ${p(R_IN, a0)}`,
    `L ${p(R_OUT, a0)}`,
    `A ${R_OUT} ${R_OUT} 0 0 1 ${p(R_OUT, a1)}`,
    `L ${p(R_IN, a1)}`,
    `A ${R_IN} ${R_IN} 0 0 0 ${p(R_IN, a0)}`,
    'Z',
  ].join(' ')
}

function labelPos(i: number): { x: number; y: number } {
  const a = -Math.PI / 2 + i * STEP
  const r = (R_OUT + R_IN) / 2
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
}

export function EmotionWheel() {
  const [i, setI] = useState(0)
  const e = EMOTIONS[i]
  const opposite = EMOTIONS[(i + N / 2) % N]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid items-center gap-3 sm:grid-cols-[auto_1fr]">
        <svg viewBox="0 0 260 260" className="w-full sm:w-[260px]">
          {EMOTIONS.map((em, k) => {
            const sel = k === i
            const isOpp = k === (i + N / 2) % N
            const lp = labelPos(k)
            return (
              <g key={em.key} onClick={() => setI(k)} style={{ cursor: 'pointer' }}>
                <path
                  d={wedge(k)}
                  fill={em.color}
                  fillOpacity={sel ? 1 : isOpp ? 0.55 : 0.32}
                  stroke={sel || isOpp ? 'var(--color-ink)' : 'var(--color-surface)'}
                  strokeWidth={sel ? 2.5 : isOpp ? 1.5 : 1}
                />
                <text
                  x={lp.x}
                  y={lp.y + 3}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={sel ? 700 : 500}
                  fill={sel ? '#fff' : 'var(--color-ink)'}
                  pointerEvents="none"
                >
                  {em.name}
                </text>
              </g>
            )
          })}
          <circle cx={CX} cy={CY} r={R_IN - 4} fill="var(--color-surface-2)" stroke="var(--color-border)" />
          <text x={CX} y={CY + 4} textAnchor="middle" fontSize="11" fontWeight={700} fill="var(--color-ink)" pointerEvents="none">
            8 basics
          </text>
        </svg>

        <div className="rounded-xl border border-border bg-surface-2 p-3">
          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full" style={{ background: e.color }} />
            <p className="text-base font-semibold text-ink">{e.name}</p>
          </div>
          <p className="mt-2 text-sm text-muted">
            <span className="font-medium text-ink">Opposite: </span>
            <span style={{ color: opposite.color }} className="font-semibold">{opposite.name}</span>
            {' '}— it sits straight across the wheel.
          </p>
          <p className="mt-2 text-sm text-muted">
            <span className="font-medium text-ink">Blend: </span>
            {e.name} + its neighbour {e.blendWith} mix into{' '}
            <span className="font-semibold text-accent">{e.blend}</span>.
          </p>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Eight primary emotions in four opposing pairs. Most feelings we name are <span className="text-ink">blends</span>{' '}
        of neighbours — just as colours mix from a few primaries.
      </p>
    </div>
  )
}
