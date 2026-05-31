import type { ReactNode } from 'react'

export type StepKind = 'explain' | 'interactive' | 'quiz' | 'recap'

export type StepProps = {
  title: string
  kind?: StepKind
  children: ReactNode
}

/**
 * Declares one navigable step. It only renders its body — the surrounding
 * <Lesson> engine reads `title`/`kind` off the element to drive the header,
 * progress, and gating.
 */
export function Step({ children }: StepProps) {
  return <>{children}</>
}
