import { Children, isValidElement, useEffect, useMemo, useState } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { Step } from './Step'
import type { StepProps } from './Step'
import { StepShell } from '#/components/lesson/StepShell'
import { NextBackBar } from '#/components/lesson/NextBackBar'
import { LessonCompleteCard } from '#/components/lesson/LessonCompleteCard'
import { StepGateProvider, useLessonRuntime } from '#/components/lesson/context'
import type { CompleteResult } from '#/components/lesson/context'

function isStep(node: ReactNode): node is ReactElement<StepProps> {
  return isValidElement(node) && node.type === Step
}

/**
 * Paginates the <Step> children of an authored MDX lesson into a Brilliant-style
 * flow. Stays backend-agnostic: navigation and completion go through the
 * LessonRuntime context, which the route fills with Convex-backed callbacks.
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

  if (total === 0) return null
  if (result)
    return <LessonCompleteCard result={result} onExit={runtime.onExit} />

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
      <StepShell
        title={title}
        kind={kind}
        current={current}
        total={total}
        footer={
          <NextBackBar
            current={current}
            total={total}
            busy={busy}
            canAdvance={canAdvance}
            onBack={goBack}
            onNext={goNext}
          />
        }
      >
        {stepEl}
      </StepShell>
    </StepGateProvider>
  )
}
