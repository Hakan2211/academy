import { useState } from 'react'
import { cn } from '#/lib/cn'

// Searle's Chinese Room: a person inside follows a rule book to match Chinese
// input symbols to Chinese output symbols WITHOUT understanding Chinese.
// The user picks a symbol; the rulebook "processes" it with an animation-like
// stepper; the response appears — then the point is driven home.

type Prompt = {
  input: string
  inputMeaning: string
  rulebook: string
  output: string
  outputMeaning: string
}

const PROMPTS: Array<Prompt> = [
  {
    input: '你好，你好吗？',
    inputMeaning: '"Hello, how are you?"',
    rulebook: 'RULE 7b-α: Pattern [你好] → send [我很好，谢谢！] + append [你呢？]',
    output: '我很好，谢谢！你呢？',
    outputMeaning: '"I\'m fine, thank you! And you?"',
  },
  {
    input: '天空是什么颜色？',
    inputMeaning: '"What color is the sky?"',
    rulebook: 'RULE 14c-γ: Pattern [天空] + [颜色] → send [天空是蓝色的。] + append [因为光的散射。]',
    output: '天空是蓝色的。因为光的散射。',
    outputMeaning: '"The sky is blue. Because of light scattering."',
  },
  {
    input: '你能感受到痛苦吗？',
    inputMeaning: '"Can you feel pain?"',
    rulebook: 'RULE 31a-δ: Pattern [感受] + [痛苦] → send [我能理解关于痛苦的概念。]',
    output: '我能理解关于痛苦的概念。',
    outputMeaning: '"I can understand the concept of pain."',
  },
]

type Phase = 'idle' | 'processing' | 'done'

export function ChineseRoom() {
  const [selected, setSelected] = useState<number | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')

  function handleSelect(i: number) {
    setSelected(i)
    setPhase('processing')
    setTimeout(() => setPhase('done'), 1800)
  }

  const prompt = selected !== null ? PROMPTS[selected] : null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm font-semibold text-ink">Pass a message through the slot:</p>
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {PROMPTS.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSelect(i)}
            className={cn(
              'rounded-xl border px-3 py-2 text-left text-sm transition-colors',
              selected === i
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <div className="font-mono text-base leading-tight">{p.input}</div>
            <div className="mt-1 text-xs opacity-75">{p.inputMeaning}</div>
          </button>
        ))}
      </div>

      {/* The Room */}
      <div className="relative rounded-xl border border-border bg-surface-2 p-4">
        {/* Room illustration */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-lg">
            🧑
          </div>
          <div className="text-xs text-muted">Person inside — following rules, not understanding</div>
        </div>

        {/* Input */}
        {prompt && (
          <div className="mb-2 flex items-start gap-2">
            <span className="mt-0.5 shrink-0 rounded bg-border px-1.5 py-0.5 text-xs text-muted">IN</span>
            <div>
              <div className="font-mono text-sm text-ink">{prompt.input}</div>
              <div className="text-xs text-muted">{prompt.inputMeaning}</div>
            </div>
          </div>
        )}

        {/* Rulebook processing */}
        {prompt && (
          <div
            className={cn(
              'mb-2 rounded-lg border border-border bg-surface p-3 text-xs transition-opacity duration-300',
              phase === 'processing' ? 'opacity-100' : phase === 'done' ? 'opacity-60' : 'opacity-0',
            )}
          >
            <div className="mb-1 font-semibold text-muted">📖 Rule Book</div>
            <div className="font-mono text-muted">{prompt.rulebook}</div>
            {phase === 'processing' && (
              <div className="mt-1.5 flex items-center gap-1 text-muted">
                <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:0ms]" />
                <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:150ms]" />
                <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:300ms]" />
                <span className="ml-1">Looking up rule…</span>
              </div>
            )}
          </div>
        )}

        {/* Output */}
        {phase === 'done' && prompt && (
          <div className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0 rounded bg-accent/20 px-1.5 py-0.5 text-xs text-accent">OUT</span>
            <div>
              <div className="font-mono text-sm text-ink">{prompt.output}</div>
              <div className="text-xs text-muted">{prompt.outputMeaning}</div>
            </div>
          </div>
        )}

        {!prompt && (
          <p className="text-center text-xs text-muted">Select a message above to pass it through the slot.</p>
        )}
      </div>

      {/* The punch */}
      {phase === 'done' && (
        <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4 text-sm">
          <p className="font-semibold text-ink">The point:</p>
          <p className="mt-1 text-muted">
            The person produced a fluent, correct reply — but understood nothing. They manipulated symbols by following formal rules (syntax) without grasping what those symbols mean (semantics).{' '}
            <span className="text-ink">
              Searle's argument: a computer does exactly the same thing. Passing the Turing Test — behaving as if you understand — is not the same as actually understanding.
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
