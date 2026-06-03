import { useState } from 'react'
import { cn } from '#/lib/cn'

// A clinical, factual, respectful explorer of the male and female reproductive
// systems. Toggle between the two; click a structure to read its one-line function.

type Structure = {
  id: string
  name: string
  fn: string
}

type System = {
  key: 'female' | 'male'
  label: string
  puberty: string
  structures: Array<Structure>
}

const SYSTEMS: Array<System> = [
  {
    key: 'female',
    label: 'Assigned female at birth',
    puberty:
      'Puberty typically begins between ages 8 and 13. Oestrogen and progesterone drive breast development, widening of the hips, growth of pubic and underarm hair, and the start of menstrual cycles. The pituitary hormones FSH and LH orchestrate these changes.',
    structures: [
      {
        id: 'ovaries',
        name: 'Ovaries (×2)',
        fn: 'Produce eggs (ova) and secrete the sex hormones oestrogen and progesterone.',
      },
      {
        id: 'fallopian',
        name: 'Fallopian tubes (×2)',
        fn: 'Transport eggs from an ovary toward the uterus; fertilisation typically occurs here.',
      },
      {
        id: 'uterus',
        name: 'Uterus',
        fn: 'A muscular, pear-shaped organ where a fertilised egg implants and a pregnancy develops.',
      },
      {
        id: 'cervix',
        name: 'Cervix',
        fn: 'The lower, narrow part of the uterus that opens into the vagina; produces mucus that changes across the cycle.',
      },
      {
        id: 'vagina',
        name: 'Vagina',
        fn: 'A muscular canal connecting the cervix to the external body; the birth canal during labour.',
      },
      {
        id: 'endometrium',
        name: 'Endometrium',
        fn: 'The inner lining of the uterus that thickens each cycle and is shed during menstruation if no pregnancy occurs.',
      },
    ],
  },
  {
    key: 'male',
    label: 'Assigned male at birth',
    puberty:
      'Puberty typically begins between ages 9 and 14. Testosterone drives growth of the testes and penis, development of pubic and facial hair, deepening of the voice, increases in muscle mass, and the start of sperm production (spermatogenesis).',
    structures: [
      {
        id: 'testes',
        name: 'Testes (×2)',
        fn: 'Produce sperm (spermatogenesis) and secrete the hormone testosterone.',
      },
      {
        id: 'epididymis',
        name: 'Epididymis',
        fn: 'A coiled tube behind each testis where sperm mature and are stored until ejaculation.',
      },
      {
        id: 'vas',
        name: 'Vas deferens',
        fn: 'A muscular duct that carries mature sperm from the epididymis toward the urethra during ejaculation.',
      },
      {
        id: 'seminal',
        name: 'Seminal vesicles',
        fn: 'Glands that produce most of the fluid in semen, providing energy (fructose) for sperm.',
      },
      {
        id: 'prostate',
        name: 'Prostate gland',
        fn: 'Secretes an alkaline fluid that protects and nourishes sperm and helps with ejaculation.',
      },
      {
        id: 'urethra',
        name: 'Urethra',
        fn: 'A shared duct for both urine and semen (not simultaneously); carries them to the external opening.',
      },
    ],
  },
]

export function ReproductiveAnatomy() {
  const [activeKey, setActiveKey] = useState<'female' | 'male'>('female')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const system = SYSTEMS.find((s) => s.key === activeKey) ?? SYSTEMS[0]
  const selected = system.structures.find((s) => s.id === selectedId) ?? null

  const handleSwitch = (key: 'female' | 'male') => {
    setActiveKey(key)
    setSelectedId(null)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Toggle */}
      <div className="mb-4 flex gap-2">
        {SYSTEMS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => handleSwitch(s.key)}
            className={cn(
              'flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
              activeKey === s.key
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Structure list */}
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {system.structures.map((st) => {
          const sel = selectedId === st.id
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setSelectedId(sel ? null : st.id)}
              className={cn(
                'rounded-xl border px-3 py-2 text-left text-xs font-medium transition-colors',
                sel
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border text-muted hover:text-ink',
              )}
            >
              {st.name}
            </button>
          )
        })}
      </div>

      {/* Detail panel */}
      <div className="min-h-[3.5rem] rounded-xl bg-surface-2 px-4 py-3 text-sm text-ink">
        {selected ? (
          <>
            <span className="font-semibold text-accent">{selected.name}: </span>
            {selected.fn}
          </>
        ) : (
          <span className="text-muted">Select a structure above to see its function.</span>
        )}
      </div>

      {/* Puberty note */}
      <details className="mt-3">
        <summary className="cursor-pointer select-none text-xs font-medium text-accent">
          Puberty and hormones
        </summary>
        <p className="mt-2 text-xs leading-relaxed text-muted">{system.puberty}</p>
      </details>

      <p className="mt-3 text-center text-xs text-muted">
        Anatomy varies between individuals. This overview covers typical structures.
      </p>
    </div>
  )
}
