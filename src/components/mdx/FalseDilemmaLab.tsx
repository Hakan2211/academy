import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Makes the false dilemma vivid. Each example shows a real-sounding
// either/or framing and then reveals the spectrum of middle positions
// the dilemma deliberately hid.

type Position = {
  label: string
  description: string
  isExtreme: boolean
}

type Dilemma = {
  id: string
  topic: string
  claim: string
  extreme1: string
  extreme2: string
  middle: Array<Position>
  why: string
}

const DILEMMAS: Array<Dilemma> = [
  {
    id: 'security',
    topic: 'National Security vs. Privacy',
    claim: '"You either support unlimited surveillance to keep us safe, or you support privacy and accept terrorism."',
    extreme1: 'Unlimited surveillance',
    extreme2: 'Zero government data access',
    middle: [
      {
        label: 'Warrants required',
        description: 'Government can access data with judicial approval; random bulk collection is banned.',
        isExtreme: false,
      },
      {
        label: 'Targeted monitoring',
        description: 'Surveillance of specific credible threats only, with independent oversight committees.',
        isExtreme: false,
      },
      {
        label: 'Sunset clauses',
        description: 'Emergency surveillance powers expire and must be renewed with fresh evidence.',
        isExtreme: false,
      },
    ],
    why:
      'The dilemma collapses every nuanced security policy into "side with terrorists." In reality, democracies have designed dozens of oversight frameworks between the extremes.',
  },
  {
    id: 'environment',
    topic: 'Economy vs. Environment',
    claim: '"We either keep burning fossil fuels and stay prosperous, or we go green and destroy the economy."',
    extreme1: 'Unlimited fossil fuels',
    extreme2: 'Immediate total ban',
    middle: [
      {
        label: 'Carbon pricing',
        description: 'Tax emissions to let markets find the cheapest path to reduction over time.',
        isExtreme: false,
      },
      {
        label: 'Phased transition',
        description: 'Commit to net-zero by 2050, accelerate renewables, retrain fossil-fuel workers.',
        isExtreme: false,
      },
      {
        label: 'Tech investment',
        description: 'Fund breakthroughs in fusion, green hydrogen, and carbon capture — grow the economy while decarbonising.',
        isExtreme: false,
      },
    ],
    why:
      'The framing treats economic growth and environmental protection as opposites. Decades of evidence show energy efficiency gains and renewable investment can grow GDP while cutting emissions.',
  },
  {
    id: 'speech',
    topic: 'Free Speech vs. Harm Prevention',
    claim: '"Either all speech is protected or we live under total censorship — there\'s no middle ground."',
    extreme1: 'Absolute free speech',
    extreme2: 'Government controls all expression',
    middle: [
      {
        label: 'Context-specific rules',
        description: 'Different platforms, workplaces, and public squares have different norms with democratic accountability.',
        isExtreme: false,
      },
      {
        label: 'Narrow incitement law',
        description: 'Only direct, credible incitement to imminent violence is restricted; opinion and protest are protected.',
        isExtreme: false,
      },
      {
        label: 'Counter-speech model',
        description: 'Rather than remove harmful content, actively fund media literacy and amplify counter-narratives.',
        isExtreme: false,
      },
    ],
    why:
      'Every functioning liberal democracy places some limits on expression (fraud, perjury, credible threats) while protecting vast swaths of speech. The "all or nothing" framing prevents any conversation about where lines should be drawn.',
  },
]

export function FalseDilemmaLab() {
  const [dilemmaId, setDilemmaId] = useState<string>(DILEMMAS[0].id)
  const [revealed, setRevealed] = useState(false)

  const dilemma = DILEMMAS.find((d) => d.id === dilemmaId) ?? DILEMMAS[0]!

  function switchDilemma(id: string) {
    setDilemmaId(id)
    setRevealed(false)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Each example shows a real-sounding either/or framing. Reveal the hidden middle positions it erases.
      </p>

      {/* Topic selector */}
      <div className="flex flex-wrap gap-2">
        {DILEMMAS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => switchDilemma(d.id)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
              dilemmaId === d.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {d.topic}
          </button>
        ))}
      </div>

      {/* The claim */}
      <div className="mt-4 rounded-xl border border-warn/40 bg-warn/10 p-3 text-sm italic leading-relaxed text-ink">
        {dilemma.claim}
      </div>

      {/* The spectrum */}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs text-muted">
          <span className="rounded-full border border-border px-2 py-0.5 font-semibold">
            {dilemma.extreme1}
          </span>
          <span className="text-muted">— spectrum —</span>
          <span className="rounded-full border border-border px-2 py-0.5 font-semibold">
            {dilemma.extreme2}
          </span>
        </div>

        {/* Middle positions (hidden until revealed) */}
        <div className="relative mt-1 min-h-[60px]">
          {!revealed && (
            <div className="flex items-center justify-center rounded-xl border border-dashed border-border py-5">
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="flex items-center gap-1.5 text-sm font-semibold text-accent"
              >
                <Icon name="Eye" size={15} />
                Reveal the hidden middle ground
              </button>
            </div>
          )}

          {revealed && (
            <div className="space-y-2">
              {dilemma.middle.map((pos) => (
                <div
                  key={pos.label}
                  className="rounded-xl border border-accent/30 bg-accent/5 p-3 text-sm"
                >
                  <p className="font-semibold text-ink">{pos.label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">{pos.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Why it's a fallacy */}
      {revealed && (
        <div className="mt-3 rounded-xl border border-border bg-surface-2 p-3 text-xs leading-relaxed text-muted">
          <span className="font-semibold text-ink">Why it's a false dilemma: </span>
          {dilemma.why}
        </div>
      )}
    </div>
  )
}
