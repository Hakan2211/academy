import { Children, isValidElement, useEffect, useMemo, useState } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { Step } from './Step'
import type { StepProps } from './Step'
import { LessonShell } from '#/components/lesson/LessonShell'
import { LessonCompleteCard } from '#/components/lesson/LessonCompleteCard'
import { getHeroTypes } from '#/components/lesson/heroTypes'
import { StepGateProvider, useLessonRuntime } from '#/components/lesson/context'
import type { CompleteResult } from '#/components/lesson/context'

function isStep(node: ReactNode): node is ReactElement<StepProps> {
  return isValidElement(node) && node.type === Step
}

// Partition a step's children into a single hero visual + the rest (prose,
// quiz, callouts…). Exactly one hero → the shell renders two-pane; zero or
// several → single centred column (the heroes, if any, just flow inline).
function splitStep(children: ReactNode): {
  hero: ReactNode | null
  body: Array<ReactNode>
} {
  const arr = Children.toArray(children)
  const heroTypes = getHeroTypes()
  const heroes = arr.filter((c) => isValidElement(c) && heroTypes.has(c.type))
  if (heroes.length === 1) {
    const hero = heroes[0]
    return { hero, body: arr.filter((c) => c !== hero) }
  }
  return { hero: null, body: arr }
}

/**
 * Paginates the <Step> children of an authored MDX lesson into a Brilliant-style
 * flow. Stays backend-agnostic: navigation and completion go through the
 * LessonRuntime context, which the route fills with Convex-backed callbacks.
 * The per-step layout (two-pane vs single column) is decided by `splitStep`.
 */
export function Lesson({ children }: { children: ReactNode }) {
  const runtime = useLessonRuntime()
  const steps = useMemo(() => Children.toArray(children).filter(isStep), [children])
  const total = steps.length

  const [current, setCurrent] = useState(() =>
    Math.min(Math.max(runtime.initialStep, 0), Math.max(total - 1, 0)),
  )
  const [result, setResult] = useState<CompleteResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [canAdvance, setCanAdvance] = useState(true)

  const stepEl = steps[current]
  const kind = stepEl?.props.kind ?? 'explain'
  const title = stepEl?.props.title ?? ''

  // Quizzes block advancing until answered correctly; other steps are free.
  useEffect(() => {
    setCanAdvance(kind !== 'quiz')
  }, [current, kind])

  const { hero, body } = useMemo(
    () => (stepEl ? splitStep(stepEl.props.children) : { hero: null, body: [] }),
    [stepEl],
  )

  if (total === 0) return null
  if (result) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-20">
        <LessonCompleteCard
          result={result}
          onExit={runtime.onExit}
          accent={runtime.accent}
        />
      </div>
    )
  }

  const goBack = () => setCurrent((c) => Math.max(0, c - 1))
  const goNext = async () => {
    if (current < total - 1) {
      const next = current + 1
      runtime.onStepAdvance(next, total)
      setCurrent(next)
    } else {
      setBusy(true)
      try {
        setResult(await runtime.onComplete(total))
      } finally {
        setBusy(false)
      }
    }
  }

  return (
    <StepGateProvider value={{ canAdvance, setCanAdvance }}>
      <LessonShell
        title={title}
        kind={kind}
        current={current}
        total={total}
        hero={hero}
        busy={busy}
        canAdvance={canAdvance}
        onBack={goBack}
        onNext={goNext}
        onExit={runtime.onExit}
        accent={runtime.accent}
      >
        {body}
      </LessonShell>
    </StepGateProvider>
  )
}
