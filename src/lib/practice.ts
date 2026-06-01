// Shared types + helpers for the Practice (spaced retrieval) system. The item
// bank itself is generated from the lesson <Quiz>s into bank.generated.ts; this
// file is the hand-written contract.

export type PracticeItem = {
  id: string // stable id (= contentSlug for now; contentSlug#n when >1/lesson)
  contentSlug: string // links the item back to its lesson
  subject: string // derived from contentSlug prefix, e.g. "physics"
  lessonTitle: string
  prompt: string
  options: Array<string>
  correctIndex: number
  explanation: string
}

// Per-item review schedule as seen by the client (mirror of the reviewState row).
export type ReviewState = {
  itemId: string
  dueDate: string // "YYYY-MM-DD"
  reps: number
  ease: number
  intervalDays: number
}

// Fisher–Yates: vary option order each review so the answer isn't memorised by
// position. Returns the shuffled options plus the new index of the correct one.
export function shuffleOptions(
  options: ReadonlyArray<string>,
  correctIndex: number,
): { options: Array<string>; correctIndex: number } {
  const idx = options.map((_, i) => i)
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return {
    options: idx.map((i) => options[i]),
    correctIndex: idx.indexOf(correctIndex),
  }
}
