import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'

// The genetic code: every three RNA bases (a codon) spell one amino acid. Build
// a codon and look up what it means — including the START and STOP signals.
const BASES = ['U', 'C', 'A', 'G'] as const

const CODE: Record<string, string> = {
  UUU: 'Phe', UUC: 'Phe', UUA: 'Leu', UUG: 'Leu', CUU: 'Leu', CUC: 'Leu', CUA: 'Leu', CUG: 'Leu',
  AUU: 'Ile', AUC: 'Ile', AUA: 'Ile', AUG: 'Met', GUU: 'Val', GUC: 'Val', GUA: 'Val', GUG: 'Val',
  UCU: 'Ser', UCC: 'Ser', UCA: 'Ser', UCG: 'Ser', CCU: 'Pro', CCC: 'Pro', CCA: 'Pro', CCG: 'Pro',
  ACU: 'Thr', ACC: 'Thr', ACA: 'Thr', ACG: 'Thr', GCU: 'Ala', GCC: 'Ala', GCA: 'Ala', GCG: 'Ala',
  UAU: 'Tyr', UAC: 'Tyr', UAA: 'Stop', UAG: 'Stop', CAU: 'His', CAC: 'His', CAA: 'Gln', CAG: 'Gln',
  AAU: 'Asn', AAC: 'Asn', AAA: 'Lys', AAG: 'Lys', GAU: 'Asp', GAC: 'Asp', GAA: 'Glu', GAG: 'Glu',
  UGU: 'Cys', UGC: 'Cys', UGA: 'Stop', UGG: 'Trp', CGU: 'Arg', CGC: 'Arg', CGA: 'Arg', CGG: 'Arg',
  AGU: 'Ser', AGC: 'Ser', AGA: 'Arg', AGG: 'Arg', GGU: 'Gly', GGC: 'Gly', GGA: 'Gly', GGG: 'Gly',
}

const COLOR: Record<string, string> = { U: '#4F8CFF', C: '#A29BFE', A: '#FDCB6E', G: '#2ECC71' }

export function CodonWheel() {
  const [codon, setCodon] = useState(['A', 'U', 'G'])
  const key = codon.join('')
  const amino = CODE[key]
  const isStart = key === 'AUG'
  const isStop = amino === 'Stop'

  const cycle = (i: number) => {
    setCodon((c) => {
      const next = [...c]
      next[i] = BASES[(BASES.indexOf(c[i] as (typeof BASES)[number]) + 1) % 4]
      return next
    })
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-center gap-3">
        {codon.map((b, i) => (
          <button
            key={i}
            type="button"
            onClick={() => cycle(i)}
            className="group flex flex-col items-center"
            aria-label={`Change base ${i + 1}`}
          >
            <span
              className="grid h-16 w-16 place-items-center rounded-2xl text-2xl font-bold text-white transition-transform group-hover:scale-105"
              style={{ background: COLOR[b] }}
            >
              {b}
            </span>
            <Icon name="ChevronsUpDown" size={14} className="mt-1 text-muted" />
          </button>
        ))}
        <Icon name="ArrowRight" size={22} className="mx-1 text-muted" />
        <div
          className="grid h-20 min-w-[88px] place-items-center rounded-2xl border-2 px-3 text-center"
          style={{
            borderColor: isStop ? '#E74C3C' : isStart ? '#2ECC71' : 'var(--color-accent)',
            background: isStop ? '#E74C3C22' : isStart ? '#2ECC7122' : 'var(--color-surface-2)',
          }}
        >
          <span className="text-xl font-bold text-ink">{amino}</span>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-muted">
        {isStart
          ? 'AUG is the START codon (also the amino acid methionine) — it tells the ribosome where to begin.'
          : isStop
            ? 'A STOP codon — it carries no amino acid and ends the protein chain.'
            : `The codon ${key} codes for the amino acid ${amino}. Tap a base to change it.`}
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        4 bases × 3 positions = 64 codons for 20 amino acids — so most amino acids have several codons.
      </p>
    </div>
  )
}
