import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Sartre's concept of "bad faith" (mauvaise foi): self-deception where a person
// denies their freedom by pretending they "had no choice" or that they're merely
// a fixed role. Authenticity = owning your freedom fully.

type Verdict = 'bad-faith' | 'authentic' | null

type Scenario = {
  id: string
  situation: string
  response: string
  verdict: Verdict
  explanation: string
}

const SCENARIOS: Array<Scenario> = [
  {
    id: 'waiter',
    situation: 'You are asked why you stay in a job you dislike.',
    response: '"I can\'t quit — I\'m just a waiter. It\'s who I am."',
    verdict: 'bad-faith',
    explanation:
      'Sartre uses the waiter as his key example. By identifying completely with the role, the waiter pretends the job is a fixed fact about themselves — like a stone is a stone. But you are never only a role; you are always free to quit, change, or redefine yourself. Collapsing your identity into a social function is bad faith.',
  },
  {
    id: 'no-choice',
    situation: 'You went along with a group decision you privately disagreed with.',
    response: '"I had no choice — everyone else agreed and I couldn\'t rock the boat."',
    verdict: 'bad-faith',
    explanation:
      'There was a choice: you could have spoken up, walked away, or accepted the social cost of disagreement. Saying "I had no choice" erases your agency and projects your own decision onto external forces. Sartre calls this flight from freedom — you made a choice and then hid it from yourself.',
  },
  {
    id: 'nature',
    situation: 'You are asked why you snapped at a friend.',
    response: '"That\'s just who I am — I\'ve always been hot-headed. I can\'t change it."',
    verdict: 'bad-faith',
    explanation:
      'Claiming a personality trait as an unchangeable essence treats yourself like an object with fixed properties. But you are not a thing — you are a being who is always projecting toward a future. Past patterns do not imprison you; every moment you choose how to respond. Denying this is bad faith.',
  },
  {
    id: 'own-stay',
    situation: 'You are asked why you stay in a job you dislike.',
    response:
      '"I\'m choosing to stay for now because the income matters more to me at this point — and I own that trade-off."',
    verdict: 'authentic',
    explanation:
      'This is authenticity. You acknowledge that staying is a choice, name your reason honestly, and take responsibility for it. You do not hide behind necessity or role. Sartre does not say you must quit — he says you must recognise the choice as yours and own it fully.',
  },
  {
    id: 'own-spoke',
    situation: 'You went along with a group decision you privately disagreed with.',
    response:
      '"I chose not to push back this time — I weighed the conflict and decided it wasn\'t worth it to me today."',
    verdict: 'authentic',
    explanation:
      'Authentic. You see the choice, accept the responsibility, and state your reason — even if the outcome is the same "compliant" action. The difference is internal: you are not deceiving yourself about what happened. Authenticity is not about heroic rebellion; it is about honest self-ownership.',
  },
  {
    id: 'heidegger',
    situation: 'You learn you will eventually die and it changes how you approach your days.',
    response:
      '"Being-toward-death makes the time I have feel genuinely mine — I can\'t outsource how I live it."',
    verdict: 'authentic',
    explanation:
      'This is Heidegger\'s contribution: confronting our own mortality (being-toward-death) strips away comfortable distractions and social roles, forcing us to ask what we genuinely want from the time we have. Death cannot be delegated — it is the most individualising fact of existence, and taking it seriously pulls us toward authenticity.',
  },
]

export function BadFaith() {
  const [selected, setSelected] = useState<Record<string, Verdict>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  function handleVote(id: string, v: Verdict) {
    setSelected((prev) => ({ ...prev, [id]: v }))
    setRevealed((prev) => ({ ...prev, [id]: true }))
  }

  const done = SCENARIOS.filter((s) => revealed[s.id]).length

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-sm text-muted">
        Sartre distinguishes <span className="font-semibold text-ink">bad faith</span> (fleeing your
        freedom) from <span className="font-semibold text-ink">authenticity</span> (owning it). Read
        each response and classify it — then see Sartre's reasoning.
      </p>
      <p className="mb-4 text-xs text-muted">
        {done}/{SCENARIOS.length} classified
      </p>

      <div className="space-y-4">
        {SCENARIOS.map((s) => {
          const userPick = selected[s.id] ?? null
          const isRevealed = revealed[s.id] ?? false
          const correct = s.verdict

          return (
            <div
              key={s.id}
              className="rounded-xl border border-border bg-surface-2 p-3"
            >
              <p className="text-xs text-muted">{s.situation}</p>
              <p className="mt-1 text-sm font-semibold text-ink">{s.response}</p>

              {!isRevealed && (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleVote(s.id, 'bad-faith')}
                    className="flex-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-warn hover:text-warn"
                  >
                    Bad Faith
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVote(s.id, 'authentic')}
                    className="flex-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-success hover:text-success"
                  >
                    Authentic
                  </button>
                </div>
              )}

              {isRevealed && (
                <div
                  className={cn(
                    'mt-3 rounded-lg border p-3',
                    correct === 'bad-faith'
                      ? 'border-warn/40 bg-warn/10'
                      : 'border-success/40 bg-success/10',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      name={correct === 'bad-faith' ? 'AlertTriangle' : 'CheckCircle2'}
                      size={14}
                    />
                    <span
                      className={cn(
                        'text-xs font-bold uppercase tracking-wide',
                        correct === 'bad-faith' ? 'text-warn' : 'text-success',
                      )}
                    >
                      {correct === 'bad-faith' ? 'Bad Faith' : 'Authentic'}
                    </span>
                    {userPick !== null && userPick !== correct && (
                      <span className="ml-auto text-xs text-muted">(you guessed differently)</span>
                    )}
                    {userPick !== null && userPick === correct && (
                      <span className="ml-auto text-xs text-success">✓ Correct</span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-ink">{s.explanation}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {done === SCENARIOS.length && (
        <div className="mt-4 rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm text-accent">
          <span className="font-semibold">Key insight: </span>
          Sartre does not demand heroism. He demands honesty. You may stay in the job, go along with
          the group, or keep an old habit — as long as you do not lie to yourself about the fact that
          you are choosing to.
        </div>
      )}
    </div>
  )
}
