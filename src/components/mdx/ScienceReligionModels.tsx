import { useState } from 'react'
import { cn } from '#/lib/cn'

// A selector for the three main models of the science-religion relationship:
// Conflict, Independence (NOMA), and Dialogue/Integration. Even-handed — each
// model is presented with its core claim, an example, a strength, and a weakness.

type Model = {
  id: string
  name: string
  subtitle: string
  claim: string
  example: string
  strength: string
  weakness: string
}

const MODELS: Array<Model> = [
  {
    id: 'conflict',
    name: 'Conflict',
    subtitle: 'They compete for the same territory',
    claim:
      "Science and religion make overlapping claims about the same domain — the age of the universe, the origin of species, the cause of disease. When they overlap, they contradict each other, and one must give way. On this model, the progress of science has historically come at the expense of religious explanations, and the conflict is unavoidable.",
    example:
      "The Galileo affair: the Catholic Church insisted on a geocentric cosmos as a matter of doctrine; Galileo's observations (and Copernicus's mathematics) showed it was heliocentric. One of them had to be wrong about the facts of the solar system.",
    strength:
      "Captures real historical episodes where scientific findings have overturned claims that religious authorities made about the natural world. It takes both sides seriously as making factual claims.",
    weakness:
      "Assumes that religious claims are always intended as literal factual claims about the physical world — a contested assumption. Many religious traditions interpret creation narratives allegorically or theologically, not as competing astrophysics.",
  },
  {
    id: 'independence',
    name: 'Independence (NOMA)',
    subtitle: "Non-Overlapping Magisteria — they occupy different domains",
    claim:
      "Stephen Jay Gould proposed that science and religion are 'non-overlapping magisteria' (NOMA): science covers the empirical realm — facts and theories about the natural world — while religion covers questions of ultimate meaning, moral value, and purpose. They do not overlap, so they cannot conflict.",
    example:
      "Science can tell us how the brain generates experience. Religion addresses why suffering matters morally, or whether life has ultimate meaning. Neither question is answerable by the other's methods.",
    strength:
      "Provides a peaceful coexistence model. It respects both domains as legitimate, and accurately reflects how many believers and scientists actually hold their two sets of commitments — without constant tension.",
    weakness:
      "Critics argue the magisteria do overlap more than Gould admits. Religions make some factual claims (miracles, resurrection, the soul's survival of death) that are not purely about 'meaning'. And scientists sometimes speak about meaning and value. The boundaries are blurrier than NOMA suggests.",
  },
  {
    id: 'dialogue',
    name: 'Dialogue / Integration',
    subtitle: 'They can inform each other',
    claim:
      "Science and religion are distinct but not hermetically sealed from each other. Each can inform the other's understanding. Cosmology raises questions about fine-tuning and origin that are also theological questions; theology raises questions about the nature of persons, consciousness, and value that bear on science's self-understanding. The relationship is a dialogue, not a war or a partition.",
    example:
      "The Big Bang — proposed by Georges Lemaître, a Catholic priest and physicist — was initially resisted by some scientists (Hoyle, ironically the one who coined 'Big Bang' derisively, preferred a steady-state universe). Some theologians saw the Bang as consonant with creatio ex nihilo; others warned against 'God of the gaps' reasoning. The conversation has been substantive on both sides.",
    strength:
      "Reflects the actual history of many scientists and theologians who have found genuine enrichment from the other tradition. It does not require either side to surrender its methods or core claims.",
    weakness:
      "Can be vague about the mechanism of dialogue. It may paper over genuine conflicts rather than resolving them. And it requires intellectual sophistication on both sides — casual 'dialogue' can collapse into either one side absorbing the other, or mutual incomprehension.",
  },
]

export function ScienceReligionModels() {
  const [selected, setSelected] = useState<string>(MODELS[0].id)
  const [tab, setTab] = useState<'claim' | 'example' | 'eval'>('claim')

  const model = MODELS.find((m) => m.id === selected) ?? MODELS[0]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Model selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {MODELS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => { setSelected(m.id); setTab('claim') }}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              selected === m.id ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Model header */}
      <div className="mb-3 rounded-xl border border-border bg-surface-2 px-3 py-2">
        <p className="text-sm font-semibold text-ink">{model.name}</p>
        <p className="text-xs text-muted">{model.subtitle}</p>
      </div>

      {/* Content tabs */}
      <div className="mb-3 flex gap-2 border-b border-border pb-2">
        {(['claim', 'example', 'eval'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              'rounded-t px-3 py-1 text-xs font-semibold transition-colors capitalize',
              tab === t ? 'text-accent' : 'text-muted hover:text-ink',
            )}
          >
            {t === 'eval' ? 'Strength & Weakness' : t === 'claim' ? 'Core Claim' : 'Example'}
          </button>
        ))}
      </div>

      <div className="text-sm text-ink">
        {tab === 'claim' && <p>{model.claim}</p>}
        {tab === 'example' && (
          <div className="rounded-xl border border-border bg-surface-2 px-3 py-2">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Example</p>
            <p>{model.example}</p>
          </div>
        )}
        {tab === 'eval' && (
          <div className="space-y-2">
            <div className="rounded-xl border border-success bg-success/10 px-3 py-2">
              <p className="mb-1 text-xs font-semibold text-success">Strength</p>
              <p className="text-sm text-ink">{model.strength}</p>
            </div>
            <div className="rounded-xl border border-warn bg-warn/10 px-3 py-2">
              <p className="mb-1 text-xs font-semibold text-warn">Weakness</p>
              <p className="text-sm text-ink">{model.weakness}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs text-muted">
        The three models are not mutually exclusive at every point. Many scientists and religious thinkers have
        found elements of all three useful. The key insight is that &ldquo;science vs religion&rdquo; is one
        framing — but not the only one, and not necessarily the most accurate one.
      </div>
    </div>
  )
}
