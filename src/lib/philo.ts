// Shared helpers for the Philosophy island interactives. Pure + SSR-safe
// (no Math.random in render paths — use rng(seed) for deterministic jitter).
// Mirrors src/lib/econ.ts / psych.ts conventions. Philosophy is less numeric
// than the science islands, so this is mostly logic + small utilities.

export function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function round(n: number, dp = 0): number {
  const f = 10 ** dp
  return Math.round(n * f) / f
}

/** Deterministic PRNG (mulberry32) — seed in, () => number in [0, 1). */
export function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// --- Propositional logic (drives the W2 logic-world interactives) ---

/** Material conditional P → Q. False only when P is true and Q is false. */
export function implies(p: boolean, q: boolean): boolean {
  return !p || q
}

/**
 * The classic conditional argument forms. Given a conditional "if P then Q" and
 * a second premise, is the inference to the stated conclusion deductively VALID?
 * - modus-ponens:  P→Q, P    ⊢ Q          (valid)
 * - modus-tollens: P→Q, ¬Q   ⊢ ¬P         (valid)
 * - affirm-consequent: P→Q, Q ⊢ P         (INVALID — a formal fallacy)
 * - deny-antecedent:   P→Q, ¬P ⊢ ¬Q       (INVALID — a formal fallacy)
 */
export type ArgumentForm =
  | 'modus-ponens'
  | 'modus-tollens'
  | 'affirm-consequent'
  | 'deny-antecedent'

export function isValidForm(form: ArgumentForm): boolean {
  return form === 'modus-ponens' || form === 'modus-tollens'
}

/**
 * A *sound* argument is both valid (good form) and has all true premises.
 * Validity is about form; soundness adds the truth of the premises.
 */
export function isSound(valid: boolean, premisesAllTrue: boolean): boolean {
  return valid && premisesAllTrue
}

/** Expected value of a payoff matrix row given a probability — used by Pascal's Wager. */
export function expectedValue(payoffs: Array<number>, probs: Array<number>): number {
  return payoffs.reduce((sum, v, i) => sum + v * (probs[i] ?? 0), 0)
}
