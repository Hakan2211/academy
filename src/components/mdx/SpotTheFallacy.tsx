import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A mini-game: read a short argument, pick which fallacy it commits from
// 3–4 options, see whether you were right + a brief explanation.
// Cycles through 5 scenarios with a running score.

type Scenario = {
  id: string
  argument: string
  options: Array<string>
  correctIndex: number
  explanation: string
}

const SCENARIOS: Array<Scenario> = [
  {
    id: 's1',
    argument:
      '"We should ignore the senator\'s proposed tax reform — everyone knows she was arrested for drunk driving ten years ago."',
    options: ['Red Herring', 'Ad Hominem', 'Straw Man', 'Slippery Slope'],
    correctIndex: 1,
    explanation:
      'This is Ad Hominem: attacking the senator\'s past rather than evaluating her actual policy proposal. Her driving record tells us nothing about the merits of tax reform.',
  },
  {
    id: 's2',
    argument:
      '"My opponent says we should spend more on public schools. Apparently he wants to bankrupt the state and raise taxes on every single family in the country."',
    options: ['Hasty Generalisation', 'Ad Hominem', 'Straw Man', 'Appeal to Authority'],
    correctIndex: 2,
    explanation:
      'This is a Straw Man: the proposal was to spend more on schools, not to bankrupt the state. The speaker replaced the actual position with an extreme version and attacked that instead.',
  },
  {
    id: 's3',
    argument:
      '"Doctors in five countries have signed this open letter saying the supplement is safe. It must be fine to take."',
    options: ['Begging the Question', 'Appeal to Authority', 'Red Herring', 'False Dilemma'],
    correctIndex: 1,
    explanation:
      'This is an Appeal to Authority: doctor signatures are impressive but they don\'t replace peer-reviewed clinical evidence. We need to ask whether those doctors reviewed the relevant data.',
  },
  {
    id: 's4',
    argument:
      '"You\'re either a supporter of free speech or you want to censor everything. Since you want some content moderated, you must be pro-censorship."',
    options: ['Slippery Slope', 'Ad Hominem', 'False Dilemma', 'Hasty Generalisation'],
    correctIndex: 2,
    explanation:
      'This is a False Dilemma: the real landscape includes many positions — supporting free speech while allowing limited, carefully defined moderation is a coherent middle ground.',
  },
  {
    id: 's5',
    argument:
      '"We can\'t change the drug laws. Once we decriminalise one substance, people will demand all drugs be legal, violence will spike, and civilisation will unravel."',
    options: ['Red Herring', 'Begging the Question', 'Straw Man', 'Slippery Slope'],
    correctIndex: 3,
    explanation:
      'This is a Slippery Slope: the argument jumps from decriminalising one substance to civilisation unravelling, without evidence that each step in the chain will actually occur.',
  },
]

type Phase = 'question' | 'result'

export function SpotTheFallacy() {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('question')
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const scenario = SCENARIOS[index]!
  const isCorrect = picked === scenario.correctIndex

  function choose(i: number) {
    if (phase !== 'question') return
    setPicked(i)
    setPhase('result')
    if (i === scenario.correctIndex) setScore((s) => s + 1)
  }

  function next() {
    if (index + 1 >= SCENARIOS.length) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
      setPhase('question')
      setPicked(null)
    }
  }

  function restart() {
    setIndex(0)
    setPhase('question')
    setPicked(null)
    setScore(0)
    setDone(false)
  }

  if (done) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-surface p-6 text-center">
        <p className="text-2xl font-bold text-ink">
          {score} / {SCENARIOS.length}
        </p>
        <p className="mt-1 text-sm text-muted">
          {score === SCENARIOS.length
            ? 'Perfect score — you\'re a fallacy-spotter!'
            : score >= 3
              ? 'Strong work. A couple slipped through — review those explanations.'
              : 'Good start. Revisit the fallacy definitions and try again.'}
        </p>
        <button
          type="button"
          onClick={restart}
          className="mt-4 rounded-full border border-accent bg-accent/15 px-5 py-2 text-sm font-semibold text-accent"
        >
          Play again
        </button>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-muted">
          Scenario {index + 1} of {SCENARIOS.length}
        </span>
        <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
          Score: {score}
        </span>
      </div>

      {/* Argument */}
      <div className="rounded-xl border border-border bg-surface-2 p-3 text-sm italic leading-relaxed text-ink">
        {scenario.argument}
      </div>

      <p className="mt-3 text-xs text-muted">Which fallacy does this argument commit?</p>

      {/* Options */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        {scenario.options.map((opt, i) => {
          let style = 'border-border text-muted hover:text-ink'
          if (phase === 'result') {
            if (i === scenario.correctIndex) style = 'border-success/60 bg-success/10 text-success'
            else if (i === picked) style = 'border-warn/60 bg-warn/10 text-warn'
            else style = 'border-border text-muted opacity-50'
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              disabled={phase === 'result'}
              className={cn(
                'rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-colors',
                style,
              )}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {phase === 'result' && (
        <div
          className={cn(
            'mt-3 rounded-xl border p-3 text-xs leading-relaxed',
            isCorrect
              ? 'border-success/40 bg-success/10 text-ink'
              : 'border-warn/40 bg-warn/10 text-ink',
          )}
        >
          <div className="mb-1 flex items-center gap-1 font-bold">
            <Icon name={isCorrect ? 'CheckCircle' : 'XCircle'} size={14} />
            {isCorrect ? 'Correct!' : `Not quite — the answer is ${scenario.options[scenario.correctIndex]}.`}
          </div>
          {scenario.explanation}
        </div>
      )}

      {phase === 'result' && (
        <button
          type="button"
          onClick={next}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-full border border-accent bg-accent/15 py-2 text-sm font-semibold text-accent"
        >
          {index + 1 >= SCENARIOS.length ? 'See results' : 'Next scenario'}
          <Icon name="ChevronRight" size={14} />
        </button>
      )}
    </div>
  )
}
