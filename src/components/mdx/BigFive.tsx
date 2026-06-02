import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { BigFiveRadar } from '#/components/mdx/BigFiveRadar'
import type { FiveScores } from '#/components/mdx/BigFiveRadar'

// The flagship Big Five builder. Five sliders (OCEAN) drive a live radar chart
// plus a short, level-sensitive interpretation of each trait. The learner
// builds a personality profile and watches it take shape. Used in trait-theories.

type Key = keyof FiveScores

const TRAITS: Array<{
  key: Key
  name: string
  high: string
  low: string
}> = [
  {
    key: 'openness',
    name: 'Openness',
    high: 'curious, imaginative, drawn to art, ideas and novelty.',
    low: 'practical, conventional, preferring the familiar and concrete.',
  },
  {
    key: 'conscientiousness',
    name: 'Conscientiousness',
    high: 'organised, disciplined, reliable — plans ahead and follows through.',
    low: 'spontaneous and easygoing, but can be careless or disorganised.',
  },
  {
    key: 'extraversion',
    name: 'Extraversion',
    high: 'outgoing, energetic, recharged by being around other people.',
    low: 'reserved and reflective, recharged by quiet and solitude (introversion).',
  },
  {
    key: 'agreeableness',
    name: 'Agreeableness',
    high: 'warm, trusting, cooperative — quick to help and to forgive.',
    low: 'competitive and skeptical, willing to challenge and put self first.',
  },
  {
    key: 'neuroticism',
    name: 'Neuroticism',
    high: 'emotionally reactive — feels anxiety, worry and mood swings keenly.',
    low: 'calm and even-tempered, hard to rattle (emotional stability).',
  },
]

function band(v: number): 'low' | 'average' | 'high' {
  if (v < 35) return 'low'
  if (v > 65) return 'high'
  return 'average'
}

export function BigFive() {
  const [scores, setScores] = useState<FiveScores>({
    openness: 70,
    conscientiousness: 55,
    extraversion: 40,
    agreeableness: 65,
    neuroticism: 45,
  })

  const set = (key: Key, v: number) => setScores((s) => ({ ...s, [key]: v }))

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2.5">
          {TRAITS.map((t) => (
            <SceneSlider
              key={t.key}
              label={t.name}
              value={scores[t.key]}
              min={0}
              max={100}
              step={1}
              unit=""
              onChange={(v) => set(t.key, v)}
            />
          ))}
        </div>
        <div className="flex items-center justify-center rounded-xl bg-surface-2 p-2">
          <BigFiveRadar scores={scores} />
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {TRAITS.map((t) => {
          const b = band(scores[t.key])
          return (
            <p key={t.key} className="text-sm leading-snug text-muted">
              <span className="font-semibold text-ink">{t.name}</span>{' '}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-xs font-medium',
                  b === 'high' ? 'bg-accent/15 text-accent' : b === 'low' ? 'bg-surface text-muted' : 'bg-surface text-muted',
                )}
              >
                {b}
              </span>{' '}
              {b === 'high' ? t.high : b === 'low' ? t.low : `a balance — sometimes ${t.high.replace(/[.,]/, '')}, sometimes ${t.low}`}
            </p>
          )
        })}
      </div>

      <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-xs text-muted">
        There are no "good" or "bad" scores — just a profile. The same five dials describe almost everyone you'll ever meet.
      </p>
    </div>
  )
}
