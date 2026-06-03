import { useState } from 'react'
import { cn } from '#/lib/cn'

// The capstone recap of the whole Philosophy island: a constellation of
// all 15 worlds the learner has traversed. Each world is a clickable node
// showing the world name and a one-line takeaway.

type World = {
  id: string
  number: number
  name: string
  icon: string
  takeaway: string
  theme: 'logic' | 'knowledge' | 'ethics' | 'history' | 'meaning'
}

const WORLDS: Array<World> = [
  {
    id: 'philosophy',
    number: 1,
    name: 'What Is Philosophy?',
    icon: '◎',
    takeaway: 'The love of wisdom begins with learning to ask the right questions.',
    theme: 'logic',
  },
  {
    id: 'logic',
    number: 2,
    name: 'Logic & Arguments',
    icon: '⊢',
    takeaway: 'Reasoning has structure — learn to tell good arguments from bad ones.',
    theme: 'logic',
  },
  {
    id: 'fallacies',
    number: 3,
    name: 'Reasoning & Fallacies',
    icon: '⊗',
    takeaway: 'The traps in thinking are many — naming them is the first step to avoiding them.',
    theme: 'logic',
  },
  {
    id: 'knowledge',
    number: 4,
    name: 'Knowledge & Truth',
    icon: '◈',
    takeaway: 'What we can know, and how — epistemology asks the most self-reflective question.',
    theme: 'knowledge',
  },
  {
    id: 'reality',
    number: 5,
    name: 'Reality & Being',
    icon: '◇',
    takeaway: 'Metaphysics asks: what is ultimately real beneath the surface of appearances?',
    theme: 'knowledge',
  },
  {
    id: 'mind',
    number: 6,
    name: 'Mind & Consciousness',
    icon: '◉',
    takeaway: 'The puzzle of how matter gives rise to experience remains philosophy\'s deepest mystery.',
    theme: 'knowledge',
  },
  {
    id: 'ethics-foundations',
    number: 7,
    name: 'What Is Right & Wrong?',
    icon: '▲',
    takeaway: 'Ethics is the inquiry into what genuinely matters and why — not just convention.',
    theme: 'ethics',
  },
  {
    id: 'ethical-theories',
    number: 8,
    name: 'How Should We Live?',
    icon: '△',
    takeaway: 'Consequentialism, deontology, and virtue ethics each illuminate morality differently.',
    theme: 'ethics',
  },
  {
    id: 'ethics-action',
    number: 9,
    name: 'Ethics in Action',
    icon: '▽',
    takeaway: 'Real dilemmas test our theories — and reveal what we truly value.',
    theme: 'ethics',
  },
  {
    id: 'society',
    number: 10,
    name: 'Society & Justice',
    icon: '▣',
    takeaway: 'Political philosophy asks how we should live together — and what we owe each other.',
    theme: 'ethics',
  },
  {
    id: 'ancient',
    number: 11,
    name: 'The Ancient World',
    icon: '☽',
    takeaway: 'Socrates, Plato, Aristotle, and the Stoics set the questions still driving philosophy.',
    theme: 'history',
  },
  {
    id: 'modern',
    number: 12,
    name: 'The Modern Turn',
    icon: '☀',
    takeaway: 'Descartes, Hume, and Kant reshaped philosophy through reason, experience, and their limits.',
    theme: 'history',
  },
  {
    id: 'existential',
    number: 13,
    name: 'The Existential Turn',
    icon: '✦',
    takeaway: 'Nietzsche, Sartre, and Camus made freedom, authenticity, and the absurd central questions.',
    theme: 'history',
  },
  {
    id: 'science-religion',
    number: 14,
    name: 'Science, Religion & Reality',
    icon: '✧',
    takeaway: 'Faith and reason each illuminate parts of reality the other cannot fully reach.',
    theme: 'history',
  },
  {
    id: 'meaning',
    number: 15,
    name: 'The Meaning of Life',
    icon: '★',
    takeaway: 'Philosophy does not hand you the answer — it equips you to live the question well.',
    theme: 'meaning',
  },
]

const THEME_COLORS: Record<World['theme'], { dot: string; label: string; bg: string; border: string; text: string }> = {
  logic: { dot: '#38bdf8', label: 'Logic & Reason', bg: 'bg-accent/10', border: 'border-accent/40', text: 'text-accent' },
  knowledge: { dot: '#a78bfa', label: 'Knowledge & Reality', bg: 'bg-accent-2/10', border: 'border-accent-2/40', text: 'text-accent-2' },
  ethics: { dot: '#34d399', label: 'Ethics & Society', bg: 'bg-success/10', border: 'border-success/40', text: 'text-success' },
  history: { dot: '#fb923c', label: 'History of Philosophy', bg: 'bg-warn/10', border: 'border-warn/40', text: 'text-warn' },
  meaning: { dot: '#f472b6', label: 'Meaning & Existence', bg: 'bg-[#f472b6]/10', border: 'border-[#f472b6]/40', text: 'text-[#f472b6]' },
}

export function PhilosophyJourney() {
  const [activeId, setActiveId] = useState<string | null>(null)

  const active = WORLDS.find((w) => w.id === activeId) ?? null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 text-sm text-muted">
        You have traversed 15 worlds. Select any world to revisit its core insight.
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.entries(THEME_COLORS) as Array<[World['theme'], (typeof THEME_COLORS)[World['theme']]]>).map(
          ([theme, c]) => (
            <div key={theme} className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.dot }} />
              <span className="text-xs text-muted">{c.label}</span>
            </div>
          ),
        )}
      </div>

      {/* Constellation grid */}
      <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {WORLDS.map((w) => {
          const c = THEME_COLORS[w.theme]
          const isActive = activeId === w.id
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => setActiveId(isActive ? null : w.id)}
              className={cn(
                'group flex flex-col items-center rounded-xl border py-3 px-1 text-center transition-colors',
                isActive ? `${c.border} ${c.bg}` : 'border-border bg-surface-2 hover:border-border hover:bg-surface',
              )}
            >
              <span
                className="mb-1 flex h-7 w-7 items-center justify-center rounded-full text-sm transition-all"
                style={{
                  backgroundColor: isActive ? c.dot : 'transparent',
                  color: isActive ? '#0f172a' : c.dot,
                  border: `1.5px solid ${c.dot}`,
                }}
              >
                {w.icon}
              </span>
              <span className={cn('text-xs font-medium leading-tight', isActive ? c.text : 'text-muted group-hover:text-ink')}>
                W{w.number}
              </span>
              <span className={cn('mt-0.5 text-xs leading-tight line-clamp-2', isActive ? 'text-ink' : 'text-muted group-hover:text-ink')}>
                {w.name}
              </span>
            </button>
          )
        })}
      </div>

      {/* Detail panel */}
      {active && (
        <div className={cn('rounded-xl border p-4 text-sm transition-colors', THEME_COLORS[active.theme].border, THEME_COLORS[active.theme].bg)}>
          <div className="mb-2 flex items-center gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg"
              style={{ backgroundColor: THEME_COLORS[active.theme].dot, color: '#0f172a' }}
            >
              {active.icon}
            </span>
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-muted">
                World {active.number} — {THEME_COLORS[active.theme].label}
              </div>
              <div className="font-bold text-ink">{active.name}</div>
            </div>
          </div>
          <p className={cn('text-sm font-medium', THEME_COLORS[active.theme].text)}>
            {active.takeaway}
          </p>
        </div>
      )}

      {!active && (
        <div className="rounded-xl border border-border bg-surface-2 p-4 text-center">
          <div className="mb-1 text-2xl">★</div>
          <p className="text-sm text-muted">
            Fifteen worlds. Thousands of years of inquiry. Every question led to deeper questions —
            and that is what philosophy is for.
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">
            You did not just study philosophy. You practised it.
          </p>
        </div>
      )}

      {/* Journey summary */}
      <div className="mt-4 rounded-xl border border-border bg-surface-2 p-3 text-xs text-muted">
        <div className="mb-1 font-semibold text-ink">The thread through it all</div>
        From the very first question — what is philosophy? — to this summit: every world sharpened a tool.
        Logic and epistemology gave you instruments for thinking clearly. Ethics and political philosophy gave
        you frameworks for living and acting well. The history of philosophy showed you that the greatest minds
        wrestled with the same questions you have. And existentialism, absurdism, and the question of meaning
        brought it home: the point was never to arrive at a final answer. The point was to become someone
        who can hold the questions openly, with courage and curiosity. That is what it means to love wisdom.
      </div>
    </div>
  )
}
