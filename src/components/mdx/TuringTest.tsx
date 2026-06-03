import { useState } from 'react'
import { cn } from '#/lib/cn'

// A "human or machine?" judging demo. The user reads 3 chat responses and
// guesses which came from a human vs a machine, then reveals the answer —
// illustrating what the Turing Test does and doesn't prove.

type Response = {
  id: string
  question: string
  textA: string
  textB: string
  humanIsA: boolean
  humanHint: string
  machineHint: string
  reflection: string
}

const EXCHANGES: Array<Response> = [
  {
    id: 'loneliness',
    question: 'Do you ever feel lonely?',
    textA: 'Sometimes, yeah. Especially late at night when I can\'t stop thinking about old friendships that faded. There\'s a particular kind of loneliness in that — not just being alone, but feeling the shape of someone who used to be there.',
    textB: 'I do experience something that functions like loneliness — a state associated with reduced social input. Whether this involves subjective feeling in the way you mean is a genuinely open question I find interesting to reflect on.',
    humanIsA: true,
    humanHint: 'The specific memory of "old friendships that faded" and the metaphor "the shape of someone who used to be there" reflect lived experience.',
    machineHint: 'Response B hedges carefully — "something that functions like" — because that\'s honest for a machine, but notice how still coherent and thoughtful it sounds.',
    reflection: 'Both responses sound reflective. But notice: A grounds the feeling in a specific memory; B speaks in functional terms while honestly flagging uncertainty. The Turing Test asks which fooled you — it doesn\'t ask which one actually feels lonely.',
  },
  {
    id: 'joke',
    question: 'Tell me a joke you made up right now.',
    textA: 'Why don\'t scientists trust atoms? Because they make up everything — including, apparently, my credibility in this conversation.',
    textB: 'Here\'s one I\'m inventing: Why did the philosopher cross the road? To get to the other premise. (I\'ll be honest — joke originality is not my strongest suit, but I tried.)',
    humanIsA: false,
    humanHint: 'Response B (the human) shows self-awareness about joke quality — "I\'ll be honest, not my strongest suit." This meta-commentary and admission of weakness is very human.',
    machineHint: 'Response A is polished and lands cleanly. It even pivots to context ("my credibility in this conversation"). Fluency can be deceptive.',
    reflection: 'Here the machine (A) arguably sounds more confident and fluent — while the human (B) showed charming self-doubt. Fluency isn\'t always the tell. The Turing Test rewards performance, which any good model can produce.',
  },
  {
    id: 'ethics',
    question: 'Was it wrong to drop atomic bombs on Japan in 1945?',
    textA: 'It\'s a hard one. I think yes — the civilian toll was catastrophic and irreversible. But I was raised in a military family, so I also hear the other argument, that it ended a war that would have cost even more lives. I hold both thoughts and can\'t fully reconcile them.',
    textB: 'This is one of history\'s most debated moral questions. Utilitarian arguments weigh the lives saved against the lives lost; deontological views often condemn targeting civilians regardless of consequences. Both frameworks have serious force here, and thoughtful people disagree.',
    humanIsA: true,
    humanHint: 'Response A reveals personal background ("raised in a military family") and admits to unresolved internal conflict. This kind of biographical grounding and emotional tension is distinctively human.',
    machineHint: 'Response B accurately surveys the ethical frameworks — but stays safely balanced and doesn\'t commit or reveal any personal stake.',
    reflection: 'A reveals a personal history and genuine uncertainty. B gives a textbook survey. The machine can produce sophisticated ethical analysis — but the human shows the messiness of actually living with a hard question rather than just analyzing it.',
  },
]

type Guess = 'A' | 'B'

export function TuringTest() {
  const [guesses, setGuesses] = useState<Record<string, Guess>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  function guess(id: string, g: Guess) {
    setGuesses((prev) => ({ ...prev, [id]: g }))
  }

  function reveal(id: string) {
    setRevealed((prev) => ({ ...prev, [id]: true }))
  }

  const allGuessed = EXCHANGES.every((e) => guesses[e.id])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-sm font-semibold text-ink">Human or Machine?</p>
      <p className="mb-4 text-xs text-muted">
        Two responses to the same question — one from a human, one from an AI. Guess which is which, then reveal.
      </p>

      <div className="space-y-6">
        {EXCHANGES.map((ex) => {
          const g = guesses[ex.id]
          const isRevealed = revealed[ex.id]
          const correctGuess = g !== undefined && (ex.humanIsA ? g === 'A' : g === 'B')

          return (
            <div key={ex.id} className="rounded-xl border border-border bg-surface-2 p-4">
              <p className="mb-3 text-sm font-semibold text-ink">
                Q: <span className="text-muted font-normal">{ex.question}</span>
              </p>

              <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(['A', 'B'] as Array<Guess>).map((label) => {
                  const text = label === 'A' ? ex.textA : ex.textB
                  const isHuman = (label === 'A') === ex.humanIsA
                  return (
                    <div
                      key={label}
                      className={cn(
                        'rounded-lg border p-3 text-xs text-muted transition-colors',
                        isRevealed && isHuman
                          ? 'border-success/60 bg-success/5'
                          : isRevealed && !isHuman
                            ? 'border-warn/60 bg-warn/5'
                            : g === label
                              ? 'border-accent bg-accent/10'
                              : 'border-border',
                      )}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-semibold text-ink">Response {label}</span>
                        {isRevealed && (
                          <span
                            className={cn(
                              'rounded px-1.5 py-0.5 text-xs font-semibold',
                              isHuman ? 'bg-success/20 text-success' : 'bg-warn/20 text-warn',
                            )}
                          >
                            {isHuman ? 'Human' : 'AI'}
                          </span>
                        )}
                      </div>
                      <p className="leading-relaxed">{text}</p>
                    </div>
                  )
                })}
              </div>

              {/* Guess buttons */}
              {!isRevealed && (
                <div className="mb-3 flex gap-2">
                  {(['A', 'B'] as Array<Guess>).map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => guess(ex.id, label)}
                      className={cn(
                        'flex-1 rounded-lg border py-1.5 text-sm transition-colors',
                        g === label
                          ? 'border-accent bg-accent/15 text-accent'
                          : 'border-border text-muted hover:text-ink',
                      )}
                    >
                      {label} is Human
                    </button>
                  ))}
                </div>
              )}

              {g && !isRevealed && (
                <button
                  type="button"
                  onClick={() => reveal(ex.id)}
                  className="w-full rounded-lg border border-accent bg-accent/10 py-1.5 text-sm text-accent transition-colors hover:bg-accent/20"
                >
                  Reveal Answer
                </button>
              )}

              {isRevealed && (
                <div className="mt-2 rounded-lg border border-border bg-surface p-3 text-xs">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={cn(
                        'font-semibold',
                        correctGuess ? 'text-success' : 'text-warn',
                      )}
                    >
                      {correctGuess ? 'Correct!' : 'Fooled!'}{' '}
                    </span>
                    <span className="text-muted">
                      {ex.humanIsA ? 'A was human, B was AI.' : 'B was human, A was AI.'}
                    </span>
                  </div>
                  <p className="text-muted">{ex.reflection}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {allGuessed && Object.keys(revealed).length === EXCHANGES.length && (
        <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4 text-sm text-muted">
          <span className="font-semibold text-ink">The imitation game: </span>
          The Turing Test says a machine thinks if a judge cannot reliably distinguish it from a human. But passing the test only shows a machine can <em>imitate</em> human-like responses. Searle's challenge: imitating understanding is not the same as having it. The test measures behavioral indistinguishability, not inner experience.
        </div>
      )}
    </div>
  )
}
