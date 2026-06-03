import { useState } from 'react'
import { cn } from '#/lib/cn'

// The teleporter thought experiment for personal identity. Steps through the
// scenario; branches on "does the original survive?"; asks the user what they
// think and surfaces the puzzle for psychological vs physical continuity.

type Scenario = 'normal' | 'malfunction'
type Theory = 'psychological' | 'physical'

const STAGES = ['setup', 'scan', 'transmit', 'arrive', 'verdict'] as const
type Stage = (typeof STAGES)[number]

const NORMAL: Record<Stage, { title: string; body: string }> = {
  setup: {
    title: 'Step In',
    body: 'You step into the teleporter. It will scan every atom in your body — your exact brain structure, memories, personality, every physical detail — then destroy the original and reconstruct you perfectly at the destination.',
  },
  scan: {
    title: 'Perfect Scan',
    body: 'The machine records a complete blueprint of you: every neuron connection, every memory trace, every quirk of your personality. The copy will be physically identical — and will remember being you, remember stepping in, remember your whole life.',
  },
  transmit: {
    title: 'Destruction + Reconstruction',
    body: 'The original is disintegrated. Simultaneously, the blueprint is used to build an exact copy at the destination. The copy opens its eyes. It feels like continuous experience — no gap, no awareness of anything unusual.',
  },
  arrive: {
    title: 'The Copy Arrives',
    body: 'The copy at the destination has all your memories, your personality, your plans for tomorrow. From the inside, it feels exactly like waking up after a dreamless sleep. From the outside — is this you?',
  },
  verdict: {
    title: 'Did You Survive?',
    body: 'This is the question. The copy is psychologically continuous with you — same memories, personality, beliefs. But the physical body was destroyed and rebuilt. What makes you YOU across time — psychological continuity, or physical continuity?',
  },
}

const MALFUNCTION: Record<Stage, { title: string; body: string }> = {
  setup: {
    title: 'Step In (Malfunction Mode)',
    body: 'You step into the teleporter. Unknown to the operators, there is a malfunction today. The machine will scan you and reconstruct a copy at the destination — but it will FAIL to destroy the original.',
  },
  scan: {
    title: 'Scan Complete',
    body: 'The scan is perfect. The blueprint captures everything about you. The reconstruction begins at the destination. You — the original — are still standing in the booth, unaware anything has gone wrong.',
  },
  transmit: {
    title: 'Two of You Exist',
    body: 'The copy materialises at the destination. It opens its eyes and remembers being you. The original — also you — is still in the booth and remembers the exact same things. Both have an equal claim to being "the" you.',
  },
  arrive: {
    title: 'The Reunion',
    body: 'The original walks out of the booth. The copy walks out of the receiver. You meet. Both of you have the same memories up to the scan. Who is the real you? Both? Neither? One — but which?',
  },
  verdict: {
    title: 'The Duplication Problem',
    body: 'If psychological continuity is what makes you YOU, then both copies are equally you — which seems absurd. But if physical continuity is what matters, neither copy is you (the original was never destroyed; the copy is a new person). The malfunction reveals that psychological continuity alone cannot be the full story.',
  },
}

export function TeleporterPuzzle() {
  const [scenario, setScenario] = useState<Scenario>('normal')
  const [stageIndex, setStageIndex] = useState(0)
  const [userTheory, setUserTheory] = useState<Theory | null>(null)

  const stageKey = STAGES[stageIndex]
  const content = scenario === 'normal' ? NORMAL[stageKey] : MALFUNCTION[stageKey]
  const isLastStage = stageIndex === STAGES.length - 1

  function switchScenario(s: Scenario) {
    setScenario(s)
    setStageIndex(0)
    setUserTheory(null)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Scenario switch */}
      <div className="mb-4 flex gap-2">
        {(['normal', 'malfunction'] as Array<Scenario>).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => switchScenario(s)}
            className={cn(
              'flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
              scenario === s
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {s === 'normal' ? '🚀 Standard Teleport' : '⚠️ Malfunction'}
          </button>
        ))}
      </div>

      {/* Stage progress */}
      <div className="mb-4 flex items-center gap-1.5">
        {STAGES.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-2 flex-1 rounded-full transition-colors',
              i === stageIndex ? 'bg-accent' : i < stageIndex ? 'bg-accent/40' : 'bg-border',
            )}
          />
        ))}
      </div>

      {/* Teleporter visual */}
      <div className="mb-4">
        <TeleporterSVG scenario={scenario} stage={stageKey} />
      </div>

      {/* Content */}
      <div className="mb-4 rounded-xl border border-border bg-surface-2 p-4">
        <h3 className="mb-2 text-sm font-semibold text-ink">{content.title}</h3>
        <p className="text-sm text-muted">{content.body}</p>
      </div>

      {/* Theory question (last stage only) */}
      {isLastStage && (
        <div className="mb-4 rounded-xl border border-border bg-surface-2 p-4">
          <p className="mb-3 text-sm font-semibold text-ink">What makes you YOU over time?</p>
          <div className="grid grid-cols-2 gap-2">
            {([
              { id: 'psychological' as Theory, label: 'Psychological continuity', desc: 'Same memories, personality, and mental life — the "soul" is the pattern, not the matter.' },
              { id: 'physical' as Theory, label: 'Physical continuity', desc: 'The same body/brain must persist. Exact copies are new persons, however similar.' },
            ]).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setUserTheory(t.id)}
                className={cn(
                  'rounded-xl border px-3 py-2 text-left text-sm transition-colors',
                  userTheory === t.id
                    ? 'border-accent bg-accent/15 text-accent'
                    : 'border-border text-muted hover:text-ink',
                )}
              >
                <div className="font-semibold">{t.label}</div>
                <div className="mt-1 text-xs opacity-80">{t.desc}</div>
              </button>
            ))}
          </div>

          {userTheory && (
            <div className="mt-3 rounded-lg border border-border bg-surface p-3 text-xs text-muted">
              {userTheory === 'psychological' ? (
                <>
                  <span className="font-semibold text-ink">Psychological view: </span>
                  You survive — the copy is you because it has psychological continuity with you. But the malfunction scenario is brutal: if there are two continuous streams, both have an equal claim. Locke held this view; Derek Parfit refined it, arguing identity might not be what matters — what matters is psychological continuity, even without numerical identity.
                </>
              ) : (
                <>
                  <span className="font-semibold text-ink">Physical continuity view: </span>
                  The copy is a new person who happens to be exactly like you. You — the original — only survive if your physical body persists. This handles the malfunction cleanly (the original survived; the copy is a new person) but struggles with ordinary change: your atoms are replaced continuously. When did you stop being "physically continuous"?
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStageIndex((i) => Math.max(0, i - 1))}
          disabled={stageIndex === 0}
          className={cn(
            'rounded-lg border px-4 py-1.5 text-sm transition-colors',
            stageIndex === 0
              ? 'border-border text-muted opacity-40'
              : 'border-border text-muted hover:text-ink',
          )}
        >
          ← Back
        </button>
        <span className="text-xs text-muted">
          {stageIndex + 1} / {STAGES.length}
        </span>
        <button
          type="button"
          onClick={() => setStageIndex((i) => Math.min(STAGES.length - 1, i + 1))}
          disabled={isLastStage}
          className={cn(
            'rounded-lg border px-4 py-1.5 text-sm transition-colors',
            isLastStage
              ? 'border-border text-muted opacity-40'
              : 'border-accent bg-accent/15 text-accent hover:bg-accent/25',
          )}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

function TeleporterSVG({ scenario, stage }: { scenario: Scenario; stage: Stage }) {
  const showCopy = stage === 'arrive' || stage === 'verdict'
  const showOriginal = scenario === 'malfunction' && (stage === 'arrive' || stage === 'verdict')
  const transmitting = stage === 'transmit'

  return (
    <svg viewBox="0 0 320 120" className="w-full rounded-xl bg-surface-2" aria-hidden="true">
      {/* Sender pad */}
      <rect x="20" y="70" width="80" height="35" rx="6" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />
      <rect x="30" y="76" width="60" height="6" rx="3" fill="var(--color-accent)" opacity="0.5" />
      <text x="60" y="116" fontSize="9" fill="var(--color-muted)" textAnchor="middle" fontFamily="sans-serif">SENDER</text>

      {/* Receiver pad */}
      <rect x="220" y="70" width="80" height="35" rx="6" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />
      <rect x="230" y="76" width="60" height="6" rx="3" fill="var(--color-accent)" opacity="0.5" />
      <text x="260" y="116" fontSize="9" fill="var(--color-muted)" textAnchor="middle" fontFamily="sans-serif">RECEIVER</text>

      {/* Beam */}
      {transmitting && (
        <line x1="100" y1="85" x2="220" y2="85" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="6 3" opacity="0.8" />
      )}

      {/* Original person (sender) */}
      {(stage === 'setup' || stage === 'scan') && (
        <g transform="translate(60, 45)">
          <circle cx="0" cy="-12" r="8" fill="var(--color-accent-2)" opacity="0.9" />
          <line x1="0" y1="-4" x2="0" y2="18" stroke="var(--color-accent-2)" strokeWidth="3" opacity="0.9" />
          <line x1="-10" y1="6" x2="10" y2="6" stroke="var(--color-accent-2)" strokeWidth="2.5" opacity="0.9" />
          <line x1="0" y1="18" x2="-8" y2="36" stroke="var(--color-accent-2)" strokeWidth="2.5" opacity="0.9" />
          <line x1="0" y1="18" x2="8" y2="36" stroke="var(--color-accent-2)" strokeWidth="2.5" opacity="0.9" />
        </g>
      )}

      {/* Transmitting (faded) */}
      {transmitting && (
        <g transform="translate(60, 45)" opacity="0.3">
          <circle cx="0" cy="-12" r="8" fill="var(--color-accent-2)" />
          <line x1="0" y1="-4" x2="0" y2="18" stroke="var(--color-accent-2)" strokeWidth="3" />
          <line x1="-10" y1="6" x2="10" y2="6" stroke="var(--color-accent-2)" strokeWidth="2.5" />
          <line x1="0" y1="18" x2="-8" y2="36" stroke="var(--color-accent-2)" strokeWidth="2.5" />
          <line x1="0" y1="18" x2="8" y2="36" stroke="var(--color-accent-2)" strokeWidth="2.5" />
        </g>
      )}

      {/* Copy at receiver */}
      {showCopy && (
        <g transform="translate(260, 45)">
          <circle cx="0" cy="-12" r="8" fill="var(--color-accent)" opacity="0.9" />
          <line x1="0" y1="-4" x2="0" y2="18" stroke="var(--color-accent)" strokeWidth="3" opacity="0.9" />
          <line x1="-10" y1="6" x2="10" y2="6" stroke="var(--color-accent)" strokeWidth="2.5" opacity="0.9" />
          <line x1="0" y1="18" x2="-8" y2="36" stroke="var(--color-accent)" strokeWidth="2.5" opacity="0.9" />
          <line x1="0" y1="18" x2="8" y2="36" stroke="var(--color-accent)" strokeWidth="2.5" opacity="0.9" />
        </g>
      )}

      {/* Original still alive (malfunction) */}
      {showOriginal && (
        <g transform="translate(60, 45)">
          <circle cx="0" cy="-12" r="8" fill="var(--color-accent-2)" opacity="0.9" />
          <line x1="0" y1="-4" x2="0" y2="18" stroke="var(--color-accent-2)" strokeWidth="3" opacity="0.9" />
          <line x1="-10" y1="6" x2="10" y2="6" stroke="var(--color-accent-2)" strokeWidth="2.5" opacity="0.9" />
          <line x1="0" y1="18" x2="-8" y2="36" stroke="var(--color-accent-2)" strokeWidth="2.5" opacity="0.9" />
          <line x1="0" y1="18" x2="8" y2="36" stroke="var(--color-accent-2)" strokeWidth="2.5" opacity="0.9" />
        </g>
      )}

      {/* Labels for malfunction */}
      {showOriginal && showCopy && (
        <>
          <text x="60" y="10" fontSize="8" fill="var(--color-muted)" textAnchor="middle" fontFamily="sans-serif">Original (you?)</text>
          <text x="260" y="10" fontSize="8" fill="var(--color-muted)" textAnchor="middle" fontFamily="sans-serif">Copy (also you?)</text>
        </>
      )}
    </svg>
  )
}
