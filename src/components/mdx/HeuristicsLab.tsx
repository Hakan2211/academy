import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Two intuitive shortcuts, each with a built-in trap you fall into first.
//
// "Representativeness": the classic Linda conjunction problem. Linda fits the
// stereotype of a feminist, so people rank "bank teller AND feminist" as more
// likely than "bank teller" — but a conjunction can never beat its own part.
// The user picks, then the Venn reveal shows the subset is mathematically
// smaller. (P(A and B) <= P(A), always.)
//
// "Availability": which kills more people per year — shark attacks or falling
// vending machines? Sharks come to mind instantly (vivid, in the news), so we
// over-estimate them. The user guesses, then the real numbers land. We judge
// frequency by how easily examples spring to mind, not by actual base rates.
// Used in judgment-and-decisions.

type Tab = 'rep' | 'avail'

function Representativeness() {
  const [answered, setAnswered] = useState(false)
  const [pick, setPick] = useState<number | null>(null)

  const options = [
    'Linda is a bank teller.',
    'Linda is a bank teller and is active in the feminist movement.',
  ]

  return (
    <div>
      <p className="text-sm leading-relaxed text-muted">
        <span className="font-semibold text-ink">Linda</span> is 31, single, outspoken and very bright. As a
        student she majored in philosophy, cared deeply about discrimination and social justice, and joined
        anti-nuclear demonstrations. Which is <span className="text-ink">more probable</span>?
      </p>

      <div className="mt-3 space-y-2">
        {options.map((o, i) => {
          const isTrap = i === 1
          const show = answered
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => {
                setPick(i)
                setAnswered(true)
              }}
              className={cn(
                'flex w-full items-start gap-2 rounded-xl border p-3 text-left text-sm transition-colors',
                !show && 'border-border text-muted hover:text-ink',
                show && !isTrap && 'border-success bg-success/10 text-ink',
                show && isTrap && 'border-accent-2 text-ink',
              )}
              style={show && isTrap ? { borderColor: '#E67E22', background: '#E67E2214' } : undefined}
            >
              <span className="mt-0.5">
                {show ? (
                  isTrap ? (
                    <span style={{ color: '#E67E22' }}>
                      <Icon name="X" size={16} />
                    </span>
                  ) : (
                    <span className="text-success">
                      <Icon name="Check" size={16} />
                    </span>
                  )
                ) : (
                  <Icon name="Circle" size={16} />
                )}
              </span>
              <span>{o}</span>
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="mt-3 rounded-xl bg-surface-2 p-3">
          <div className="flex items-center justify-center gap-3">
            {/* Venn: tellers is the big circle; feminist-tellers a subset inside it */}
            <svg viewBox="0 0 200 110" className="w-full max-w-[220px]">
              <circle cx="100" cy="55" r="48" fill="#1ABC9C22" stroke="var(--color-accent)" strokeWidth="2" />
              <circle cx="118" cy="60" r="22" fill="#E67E2233" stroke="#E67E22" strokeWidth="2" />
              <text x="55" y="30" fontSize="9" fill="var(--color-accent)">bank tellers</text>
              <text x="118" y="63" textAnchor="middle" fontSize="8" fill="#E67E22">+ feminist</text>
            </svg>
          </div>
          <p className="mt-2 text-sm leading-snug text-muted">
            <span className="font-semibold text-ink">"Bank teller" is the safe answer.</span> The feminist
            tellers are a <span className="text-ink">subset</span> of all tellers, so they can never be more
            numerous. {pick === 1 && 'You picked the trap — and you are in good company: ~85% do. '}
            The vivid description <span className="text-accent">represents</span> the feminist stereotype, and
            that resemblance overrides the cold logic that a part can't exceed the whole — the{' '}
            <span className="text-ink">conjunction fallacy</span>.
          </p>
        </div>
      )}
    </div>
  )
}

function Availability() {
  const [pick, setPick] = useState<'shark' | 'vending' | null>(null)

  return (
    <div>
      <p className="text-sm leading-relaxed text-muted">
        In a typical year in the United States, which kills <span className="text-ink">more people</span>?
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {(['shark', 'vending'] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setPick(k)}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors',
              pick === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={k === 'shark' ? 'Fish' : 'Coffee'} size={28} />
            <span className="text-sm font-semibold">{k === 'shark' ? 'Shark attacks' : 'Falling vending machines'}</span>
          </button>
        ))}
      </div>

      {pick && (
        <div className="mt-3 rounded-xl bg-surface-2 p-3">
          <div className="space-y-2">
            <Bar label="Shark attacks" value={1} max={2} color="var(--color-border)" />
            <Bar label="Falling vending machines" value={2} max={2} color="var(--color-accent)" />
          </div>
          <p className="mt-2 text-sm leading-snug text-muted">
            Vending machines kill <span className="text-ink">about as many people as sharks — often more</span>{' '}
            (both are mercifully rare, roughly 1–2 deaths a year). But sharks star in films and headlines, so
            examples spring to mind instantly. {pick === 'shark' && 'That ease fooled you into ranking them higher. '}
            We judge how common something is by how <span className="text-accent">available</span> examples feel —
            not by the actual count. Vivid, recent, emotional events get massively over-weighted.
          </p>
        </div>
      )}
    </div>
  )
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{label}</span>
        <span className="font-mono text-ink">~{value}/yr</span>
      </div>
      <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-border/40">
        <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
    </div>
  )
}

export function HeuristicsLab() {
  const [tab, setTab] = useState<Tab>('rep')

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {(
          [
            { key: 'rep' as Tab, label: 'Representativeness' },
            { key: 'avail' as Tab, label: 'Availability' },
          ]
        ).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              tab === t.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'rep' ? <Representativeness /> : <Availability />}
    </div>
  )
}
