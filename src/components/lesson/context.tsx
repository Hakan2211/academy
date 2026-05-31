import { createContext, useContext } from 'react'

/** Result of finalizing a lesson — drives the reward screen animation. */
export type CompleteResult = {
  xpAwarded: number
  totalXP: number
  level: number
  leveledUp: boolean
  currentStreak: number
  longestStreak: number
  newBadges: Array<string>
}

/**
 * The bridge between the (Convex-agnostic) lesson UI and its host. The lesson
 * route fills this in with Convex-backed callbacks; the default is a no-op stub
 * so a lesson can also render standalone (e.g. a future mobile WebView, or local
 * preview) without a backend.
 */
export type LessonRuntime = {
  initialStep: number
  /** Called when the learner advances; `nextStepIndex` is the step now shown. */
  onStepAdvance: (nextStepIndex: number, totalSteps: number) => void
  /** Called on the final step. Returns the reward deltas for the card. */
  onComplete: (totalSteps: number) => Promise<CompleteResult>
  /** Leave the lesson (e.g. back to the path). Optional — card hides if absent. */
  onExit?: () => void
}

const STUB_RESULT: CompleteResult = {
  xpAwarded: 50,
  totalXP: 50,
  level: 1,
  leveledUp: false,
  currentStreak: 1,
  longestStreak: 1,
  newBadges: ['first-lesson'],
}

export const defaultLessonRuntime: LessonRuntime = {
  initialStep: 0,
  onStepAdvance: () => {},
  onComplete: async () => STUB_RESULT,
}

const LessonRuntimeContext = createContext<LessonRuntime>(defaultLessonRuntime)
export const LessonRuntimeProvider = LessonRuntimeContext.Provider
export const useLessonRuntime = () => useContext(LessonRuntimeContext)

/**
 * Per-step gate. Most steps can advance freely; a quiz blocks advancing until
 * answered correctly, by calling `setCanAdvance(true)`.
 */
export type StepGate = {
  canAdvance: boolean
  setCanAdvance: (v: boolean) => void
}

const StepGateContext = createContext<StepGate>({
  canAdvance: true,
  setCanAdvance: () => {},
})
export const StepGateProvider = StepGateContext.Provider
export const useStepGate = () => useContext(StepGateContext)
