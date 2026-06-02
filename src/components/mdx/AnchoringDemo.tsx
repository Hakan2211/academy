import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'

// Anchoring in action. The user is shown a clearly-irrelevant number (a high or
// low "anchor") and then asked the same factual estimate: what percentage of
// the world's countries are in Africa? The truth is about 28%. Classic studies
// (Tversky & Kahneman's wheel-of-fortune) found that even a random anchor drags
// estimates toward it. Here we let the user feel the pull, then reveal where
// people who saw the OTHER anchor typically land, plus the true value.
// Used in judgment-and-decisions.

type Anchor = 'low' | 'high'

const TRUTH = 28 // ~ 54 of 195 countries are in Africa
const LOW_ANCHOR = 10
const HIGH_ANCHOR = 65
// Where the average person who saw each anchor lands (the documented pull).
const TYPICAL = { low: 18, high: 42 }

export function AnchoringDemo() {
  const [anchor, setAnchor] = useState<Anchor>('low')
  const [guess, setGuess] = useState(30)
  const [locked, setLocked] = useState(false)

  const anchorVal = anchor === 'low' ? LOW_ANCHOR : HIGH_ANCHOR

  function reset(next: Anchor) {
    setAnchor(next)
    setGuess(30)
    setLocked(false)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {(['low', 'high'] as Array<Anchor>).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => reset(a)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              anchor === a ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {a === 'low' ? 'I saw a LOW number' : 'I saw a HIGH number'}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-surface-2 p-3 text-sm text-muted">
        First, a quick spin of a wheel landed on{' '}
        <span className="font-mono text-lg font-bold text-accent">{anchorVal}</span> — totally random, ignore it.
        <br />
        Now: <span className="text-ink">what percentage of the world's countries are in Africa?</span>
      </div>

      <div className="mt-3">
        <SceneSlider
          label="Your estimate"
          value={guess}
          min={0}
          max={100}
          step={1}
          unit="%"
          onChange={(v) => {
            if (!locked) setGuess(v)
          }}
        />
      </div>

      {!locked ? (
        <button
          type="button"
          onClick={() => setLocked(true)}
          className="mt-3 w-full rounded-full border border-accent bg-accent/15 px-4 py-2 text-sm font-semibold text-accent"
        >
          Lock in my answer
        </button>
      ) : (
        <div className="mt-3">
          {/* number line showing anchor, the typical pulled answer, your answer, and truth */}
          <svg viewBox="0 0 360 70" className="w-full">
            <line x1="20" y1="45" x2="340" y2="45" stroke="var(--color-border)" strokeWidth="2" />
            {[0, 25, 50, 75, 100].map((t) => {
              const x = 20 + (t / 100) * 320
              return (
                <g key={t}>
                  <line x1={x} y1="41" x2={x} y2="49" stroke="var(--color-border)" strokeWidth="2" />
                  <text x={x} y="63" textAnchor="middle" fontSize="9" fill="var(--color-muted)">
                    {t}%
                  </text>
                </g>
              )
            })}
            {/* anchor */}
            <Marker pos={anchorVal} color="#E67E22" label="anchor" />
            {/* typical pulled answer */}
            <Marker pos={TYPICAL[anchor]} color="var(--color-accent-2)" label="typical" />
            {/* truth */}
            <Marker pos={TRUTH} color="var(--color-success)" label="truth" />
            {/* your answer */}
            <Marker pos={guess} color="var(--color-accent)" label="you" big />
          </svg>

          <div className="mt-1 rounded-xl bg-surface-2 p-3 text-sm leading-snug text-muted">
            The true answer is about <span className="font-semibold text-success">{TRUTH}%</span> (54 of 195
            countries). People who first saw the{' '}
            <span style={{ color: '#E67E22' }} className="font-semibold">
              {anchor === 'low' ? 'low' : 'high'} anchor ({anchorVal})
            </span>{' '}
            typically guess around <span className="text-accent-2 font-semibold">{TYPICAL[anchor]}%</span> —
            pulled <span className="text-ink">{anchor === 'low' ? 'too low' : 'too high'}</span> by a number they
            were told to ignore. That's <span className="text-accent">anchoring</span>: the mind starts from the
            first figure it sees and adjusts too little.
          </div>

          <button
            type="button"
            onClick={() => reset(anchor === 'low' ? 'high' : 'low')}
            className="mt-3 flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm text-muted hover:text-ink"
          >
            <Icon name="RefreshCw" size={14} /> Try the other anchor
          </button>
        </div>
      )}
    </div>
  )
}

function Marker({ pos, color, label, big = false }: { pos: number; color: string; label: string; big?: boolean }) {
  const x = 20 + (pos / 100) * 320
  return (
    <g>
      <circle cx={x} cy="45" r={big ? 6 : 4} fill={color} stroke="#fff" strokeWidth={big ? 1.5 : 0.8} />
      <text x={x} y={big ? 20 : 30} textAnchor="middle" fontSize="9" fontWeight={big ? 700 : 400} fill={color}>
        {label}
      </text>
    </g>
  )
}
