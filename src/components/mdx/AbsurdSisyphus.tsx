import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// Camus' myth of Sisyphus: an animated SVG of Sisyphus and his boulder, plus
// an interactive choice of how to respond to the absurd. Self-contained; reused
// by other worlds. Keep it hopeful — Camus' answer is rebellion and joy, not despair.

type Response = 'despair' | 'leap' | 'rebellion'

const RESPONSES: Array<{
  id: Response
  label: string
  icon: string
  blurb: string
  camusVerdict: string
  endorses: boolean
}> = [
  {
    id: 'despair',
    label: 'Physical or Philosophical Suicide',
    icon: '✗',
    blurb:
      'If life has no meaning, what\'s the point? Give up — either literally or by withdrawing into numbness and passivity.',
    camusVerdict:
      'Camus rejects this entirely. It is the coward\'s dodge — it takes the absurd seriously only to capitulate to it. It destroys the very consciousness that recognized the absurd in the first place. Camus calls this the "act of eluding."',
    endorses: false,
  },
  {
    id: 'leap',
    label: 'The Philosophical Leap',
    icon: '~',
    blurb:
      'Turn to religion or an ideology that promises a higher meaning beyond human reason — leap to God, to History, to some transcendent purpose that dissolves the tension.',
    camusVerdict:
      'Camus calls this "philosophical suicide." It is intellectually dishonest: the absurd arises from the clash of our craving for meaning and the universe\'s silence. Leaping to God papers over that clash rather than living within it honestly. Kierkegaard made this leap; Camus admires his honesty but refuses to follow.',
    endorses: false,
  },
  {
    id: 'rebellion',
    label: 'Revolt — Live Fully Anyway',
    icon: '✓',
    blurb:
      'Keep the absurd in view, refuse false comfort, and embrace life with passionate intensity anyway. Find joy in the struggle itself.',
    camusVerdict:
      'This is Camus\' answer — the only honest and life-affirming one. Sisyphus knows his rock will roll back. He returns to it with clear eyes and a full heart. The struggle toward the heights is enough to fill a human heart. "We must imagine Sisyphus happy." Revolt, freedom, passion: these are the existential virtues.',
    endorses: true,
  },
]

// --- Animated boulder SVG ---

function SisyphusSVG({ phase }: { phase: 'push' | 'roll' }) {
  // Boulder position: phase "push" = near top; phase "roll" = rolled back down
  const boulderY = phase === 'push' ? 68 : 110
  const boulderX = phase === 'push' ? 118 : 72

  return (
    <svg
      viewBox="0 0 200 160"
      className="mx-auto block w-full max-w-xs"
      aria-label="Sisyphus pushing a boulder up a hill"
    >
      {/* sky */}
      <rect width="200" height="160" fill="#0f172a" rx="12" />

      {/* hill */}
      <polygon points="0,155 200,155 200,90 80,90" fill="#1e293b" />
      <line x1="80" y1="90" x2="200" y2="90" stroke="#334155" strokeWidth="1.5" />

      {/* stars */}
      {[
        [20, 20],
        [50, 12],
        [90, 30],
        [140, 15],
        [170, 35],
        [155, 55],
        [35, 50],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1} fill="#94a3b8" opacity={0.8} />
      ))}

      {/* boulder — moves between positions */}
      <circle
        cx={boulderX}
        cy={boulderY}
        r={13}
        fill="#475569"
        stroke="#64748b"
        strokeWidth="1.5"
        style={{ transition: 'cx 0.8s ease-in-out, cy 0.8s ease-in-out' }}
      />
      {/* crack in boulder */}
      <path
        d={`M${boulderX - 5},${boulderY - 4} l3,8 l3,-5`}
        stroke="#94a3b8"
        strokeWidth="1"
        fill="none"
        style={{ transition: 'd 0.8s ease-in-out' }}
      />

      {/* Sisyphus figure */}
      {/* body leans into the push */}
      <circle cx={100} cy={96} r={5} fill="#e2e8f0" /> {/* head */}
      <line x1="100" y1="101" x2="96" y2="115" stroke="#e2e8f0" strokeWidth="2.5" /> {/* torso */}
      <line x1="96" y1="107" x2="92" y2="100" stroke="#e2e8f0" strokeWidth="2" /> {/* left arm */}
      <line x1="96" y1="107" x2="113" y2={phase === 'push' ? 73 : 80} stroke="#e2e8f0" strokeWidth="2" /> {/* right arm — reaches for boulder */}
      <line x1="96" y1="115" x2="90" y2="130" stroke="#e2e8f0" strokeWidth="2" /> {/* left leg */}
      <line x1="96" y1="115" x2="102" y2="128" stroke="#e2e8f0" strokeWidth="2" /> {/* right leg */}

      {/* caption */}
      <text x="100" y="148" textAnchor="middle" fontSize="9" fill="#64748b">
        {phase === 'push' ? 'pushing the rock up…' : '…and it rolls back down'}
      </text>
    </svg>
  )
}

export function AbsurdSisyphus() {
  const [boulderPhase, setBoulderPhase] = useState<'push' | 'roll'>('push')
  const [chosen, setChosen] = useState<Response | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Gently animate the boulder cycle to illustrate the endless repetition
    intervalRef.current = setInterval(() => {
      setBoulderPhase((p) => (p === 'push' ? 'roll' : 'push'))
    }, 2200)
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current)
    }
  }, [])

  const chosenData = RESPONSES.find((r) => r.id === chosen)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Sisyphus was condemned by the gods to roll a boulder up a hill forever — only for it to roll
        back down each time. Camus sees this as the human condition: we crave meaning, but the
        universe stays silent. How should we respond?
      </p>

      <SisyphusSVG phase={boulderPhase} />

      <p className="my-4 text-center text-sm font-semibold text-ink">
        The rock rolls back. It always will. Choose your response to the absurd:
      </p>

      <div className="space-y-2">
        {RESPONSES.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setChosen(r.id)}
            className={cn(
              'w-full rounded-xl border px-4 py-3 text-left transition-colors',
              chosen === r.id
                ? r.endorses
                  ? 'border-success bg-success/10'
                  : 'border-warn bg-warn/10'
                : 'border-border bg-surface-2 hover:border-accent/40',
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-base font-bold',
                  chosen === r.id
                    ? r.endorses
                      ? 'text-success'
                      : 'text-warn'
                    : 'text-muted',
                )}
              >
                {r.icon}
              </span>
              <span
                className={cn(
                  'text-sm font-semibold',
                  chosen === r.id ? 'text-ink' : 'text-muted',
                )}
              >
                {r.label}
              </span>
            </div>
            {chosen === r.id && (
              <p className="mt-1 text-xs text-muted">{r.blurb}</p>
            )}
          </button>
        ))}
      </div>

      {chosenData && (
        <div
          className={cn(
            'mt-4 rounded-xl border p-4',
            chosenData.endorses
              ? 'border-success/40 bg-success/10'
              : 'border-warn/40 bg-warn/10',
          )}
        >
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted">
            Camus' verdict
          </p>
          <p className="text-sm text-ink">{chosenData.camusVerdict}</p>
        </div>
      )}

      {chosenData?.endorses && (
        <div className="mt-3 rounded-xl border border-accent/30 bg-accent/10 p-3 text-center">
          <p className="text-sm font-semibold text-accent">
            "One must imagine Sisyphus happy."
          </p>
          <p className="mt-1 text-xs text-muted">— Albert Camus, The Myth of Sisyphus (1942)</p>
        </div>
      )}
    </div>
  )
}
