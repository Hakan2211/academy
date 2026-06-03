import { useState } from 'react'
import { cn } from '#/lib/cn'

// The teleological (design) argument and its main replies — presented in a
// balanced way. The user first sees the argument's structure, then toggles
// through the key objections to weigh them against the argument's pull.

type Reply = {
  id: string
  title: string
  body: string
  source: string
}

const REPLIES: Array<Reply> = [
  {
    id: 'hume',
    title: "Hume's Objection",
    body:
      "David Hume (Dialogues Concerning Natural Religion, 1779) argued that the analogy between the universe and a human artefact is weak. Human artefacts are made by minds — but we know this only because we have observed many artefacts being made. We have observed exactly one universe. We cannot infer, from a single data point, that universes in general require a mind-like cause. The universe might equally resemble a vegetable or an organism, which grow without a designer.",
    source: 'Hume, Dialogues (1779)',
  },
  {
    id: 'darwin',
    title: "Darwin's Reply",
    body:
      "Charles Darwin's theory of evolution by natural selection (1859) provided a powerful alternative explanation for apparent design in biology. Complex structures — the eye, the wing, the immune system — can arise through the gradual accumulation of small changes, each of which is selected because it confers a marginal advantage. The appearance of design does not require a designer; it can be the output of an undirected selection process over vast timescales.",
    source: 'Darwin, On the Origin of Species (1859)',
  },
  {
    id: 'multiverse',
    title: 'The Anthropic / Multiverse Reply',
    body:
      'Fine-tuning seems surprising only if our universe is the only one. If there are vastly many universes (a multiverse) with different physical constants, it is unsurprising that we find ourselves in one hospitable to life — we could not exist to observe any other. This is the anthropic principle: we should expect to observe conditions that permit our existence, regardless of how those conditions arose. Critics note this is speculative (multiverses are not directly observable) and may not fully dissolve the intuition.',
    source: 'Barrow & Tipler, The Anthropic Cosmological Principle (1986)',
  },
  {
    id: 'evil',
    title: 'The Design Counter-Evidence',
    body:
      "If the universe is designed, it seems to be designed imperfectly. The human eye has a blind spot and is wired backwards (photoreceptors facing away from the light). The birth canal is dangerously narrow for human infants. Most species that ever existed have gone extinct. If there is a designer, Philo (Hume's sceptic) asks: why should we conclude it is omnipotent and benevolent rather than merely competent, or working with limited materials, or not caring about suffering?",
    source: 'Hume, Dialogues; Dawkins, The Blind Watchmaker (1986)',
  },
]

type Tab = 'argument' | 'replies'

export function DesignArgument() {
  const [tab, setTab] = useState<Tab>('argument')
  const [openReply, setOpenReply] = useState<string | null>(null)
  const [strengthVote, setStrengthVote] = useState<'strong' | 'weak' | null>(null)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Tab switcher */}
      <div className="mb-4 flex gap-2">
        {(['argument', 'replies'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              tab === t ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {t === 'argument' ? 'The Argument' : 'The Replies'}
          </button>
        ))}
      </div>

      {tab === 'argument' && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-surface-2 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">The Watchmaker (Paley, 1802)</p>
            <p className="text-sm text-ink">
              If you found a watch on the heath, you would infer a watchmaker — because its parts are precisely
              fitted together to serve a purpose. The human eye, the wing, the cell are far more complex than any
              watch. Therefore, a designer exists who is far greater than any watchmaker.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface-2 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Fine-Tuning</p>
            <p className="text-sm text-ink">
              The fundamental constants of physics — the gravitational constant, the mass of electrons, the
              cosmological constant — are set to extraordinary precision. If any of them were even slightly
              different, stars, chemistry, and life would be impossible. The probability of this arising by
              chance seems vanishingly small. A designer who intended life seems the more natural explanation.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface-2 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Formal structure</p>
            <p className="text-sm font-mono text-muted">
              P1: Things that exhibit complex purposive order are typically the products of intelligent design.<br />
              P2: The universe exhibits complex purposive order (fine-tuning, biological complexity).<br />
              C: Therefore, the universe is probably the product of intelligent design.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface-2 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Your assessment</p>
            <p className="mb-2 text-sm text-muted">Before reading the replies — how strong do you find this argument?</p>
            <div className="flex gap-2">
              {(['strong', 'weak'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setStrengthVote(v)}
                  className={cn(
                    'rounded-lg border px-3 py-1 text-sm capitalize transition-colors',
                    strengthVote === v
                      ? 'border-accent bg-accent/15 text-accent'
                      : 'border-border text-muted hover:text-ink',
                  )}
                >
                  {v === 'strong' ? 'Compelling' : 'Questionable'}
                </button>
              ))}
            </div>
            {strengthVote && (
              <p className="mt-2 text-xs text-muted">
                {strengthVote === 'strong'
                  ? "Many thoughtful philosophers and scientists have found fine-tuning deeply compelling. Now explore the replies and see if your assessment changes."
                  : "Scepticism about analogical arguments is equally thoughtful. Explore the replies to see the main objections spelled out."}
              </p>
            )}
          </div>
        </div>
      )}

      {tab === 'replies' && (
        <div className="space-y-2">
          <p className="mb-3 text-sm text-muted">
            The design argument has attracted serious objections. Select each reply to read it.
          </p>
          {REPLIES.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-surface-2">
              <button
                type="button"
                onClick={() => setOpenReply(openReply === r.id ? null : r.id)}
                className="flex w-full items-center justify-between px-3 py-2 text-left"
              >
                <span className="text-sm font-semibold text-ink">{r.title}</span>
                <span className="text-xs text-muted">{openReply === r.id ? '▲' : '▼'}</span>
              </button>
              {openReply === r.id && (
                <div className="border-t border-border px-3 pb-3 pt-2">
                  <p className="mb-2 text-sm text-ink">{r.body}</p>
                  <p className="text-xs text-muted italic">{r.source}</p>
                </div>
              )}
            </div>
          ))}
          <div className="mt-3 rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs text-muted">
            Evaluating this argument requires weighing the intuitive force of fine-tuning against the strength of
            each reply. Philosophers and scientists of great ability have landed on opposite sides — and the
            debate continues.
          </div>
        </div>
      )}
    </div>
  )
}
