import { useState } from 'react'
import { cn } from '#/lib/cn'

// A comparison tool for common contraceptive methods. Click a method to see
// how it works, typical-use effectiveness, reversibility, and whether it also
// protects against STIs (only barrier methods do).

type Method = {
  id: string
  name: string
  category: string
  color: string
  how: string
  effectiveness: number // typical-use %
  reversible: boolean
  stiProtection: boolean
  note?: string
}

const METHODS: Array<Method> = [
  {
    id: 'condom-external',
    name: 'External condom',
    category: 'Barrier',
    color: '#0984E3',
    how: 'A thin sheath worn over the penis that physically prevents sperm from reaching the egg. Must be used correctly every time.',
    effectiveness: 87,
    reversible: true,
    stiProtection: true,
    note: 'The only method that provides significant protection against most STIs as well as pregnancy.',
  },
  {
    id: 'condom-internal',
    name: 'Internal condom',
    category: 'Barrier',
    color: '#74B9FF',
    how: 'A pouch inserted into the vagina (or anus) before sex. Creates a physical barrier to sperm and pathogens.',
    effectiveness: 79,
    reversible: true,
    stiProtection: true,
    note: 'Can be inserted up to 8 hours before sex. Offers STI protection and is controlled by the person wearing it.',
  },
  {
    id: 'combined-pill',
    name: 'Combined pill',
    category: 'Hormonal',
    color: '#FD79A8',
    how: 'Daily oral tablet containing oestrogen and progestogen. Prevents ovulation, thickens cervical mucus, and thins the uterine lining.',
    effectiveness: 93,
    reversible: true,
    stiProtection: false,
    note: 'Effectiveness rises to ~99% with perfect use. Does not protect against STIs.',
  },
  {
    id: 'progestogen-pill',
    name: 'Progestogen-only pill',
    category: 'Hormonal',
    color: '#E84393',
    how: 'A daily pill containing only progestogen. Thickens cervical mucus and, in some people, suppresses ovulation. Must be taken within a narrow time window each day.',
    effectiveness: 93,
    reversible: true,
    stiProtection: false,
  },
  {
    id: 'implant',
    name: 'Implant',
    category: 'Long-acting hormonal',
    color: '#A29BFE',
    how: 'A small rod inserted under the skin of the upper arm by a clinician. Releases progestogen steadily, suppressing ovulation for up to 3 years.',
    effectiveness: 99.9,
    reversible: true,
    stiProtection: false,
    note: 'One of the most effective methods available. Fertility returns quickly after removal.',
  },
  {
    id: 'iud-copper',
    name: 'Copper IUD',
    category: 'Long-acting (non-hormonal)',
    color: '#00B894',
    how: 'A small T-shaped device inserted into the uterus by a clinician. Copper ions are toxic to sperm. Lasts up to 10 years and can also be used as emergency contraception.',
    effectiveness: 99.4,
    reversible: true,
    stiProtection: false,
    note: 'Hormone-free option. Can be used by people who cannot take hormonal contraceptives.',
  },
  {
    id: 'iud-hormonal',
    name: 'Hormonal IUS',
    category: 'Long-acting hormonal',
    color: '#6C5CE7',
    how: 'A small device inserted into the uterus that releases low-dose progestogen locally. Thickens cervical mucus and thins the lining. Lasts 3–8 years depending on type.',
    effectiveness: 99.8,
    reversible: true,
    stiProtection: false,
  },
  {
    id: 'emergency',
    name: 'Emergency contraception',
    category: 'Post-coital',
    color: '#E17055',
    how: 'Levonorgestrel pill ("morning-after pill") delays or prevents ovulation. Most effective within 72 hours. The copper IUD is the most effective emergency option (up to 5 days after). Not for regular use.',
    effectiveness: 85,
    reversible: true,
    stiProtection: false,
    note: 'A backup option after unprotected sex — not intended as a primary method.',
  },
]

const CATEGORIES = [...new Set(METHODS.map((m) => m.category))]

export function ContraceptionGuide() {
  const [activeId, setActiveId] = useState<string>('condom-external')
  const method = METHODS.find((m) => m.id === activeId) ?? METHODS[0]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Category groups */}
      <div className="mb-3 space-y-2">
        {CATEGORIES.map((cat) => (
          <div key={cat}>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted">{cat}</p>
            <div className="flex flex-wrap gap-1.5">
              {METHODS.filter((m) => m.category === cat).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveId(m.id)}
                  className={cn(
                    'rounded-xl border px-2.5 py-1 text-xs font-medium transition-colors',
                    activeId === m.id
                      ? 'border-accent bg-accent/15 text-accent'
                      : 'border-border text-muted hover:text-ink',
                  )}
                  style={
                    activeId === m.id
                      ? { borderColor: m.color, color: m.color, backgroundColor: m.color + '18' }
                      : {}
                  }
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Detail card */}
      <div
        className="rounded-xl border p-4 transition-colors"
        style={{ borderColor: method.color + '55', background: method.color + '0d' }}
      >
        <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-ink">{method.name}</p>
            <p className="text-xs text-muted">{method.category}</p>
          </div>
          {/* Effectiveness badge */}
          <div
            className="rounded-lg px-3 py-1 text-center"
            style={{ background: method.color + '22', color: method.color }}
          >
            <p className="text-lg font-bold leading-tight">{method.effectiveness}%</p>
            <p className="text-[10px] leading-tight opacity-80">typical-use</p>
          </div>
        </div>

        <p className="mb-3 text-xs leading-relaxed text-ink">{method.how}</p>

        {/* Attributes row */}
        <div className="flex flex-wrap gap-2">
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-[11px] font-medium',
              method.reversible
                ? 'bg-success/15 text-success'
                : 'bg-warn/15 text-warn',
            )}
          >
            {method.reversible ? 'Reversible' : 'Permanent'}
          </span>
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-[11px] font-medium',
              method.stiProtection
                ? 'bg-success/15 text-success'
                : 'bg-surface-2 text-muted',
            )}
          >
            {method.stiProtection ? 'STI protection: yes' : 'STI protection: no'}
          </span>
        </div>

        {method.note && (
          <p className="mt-2 text-[11px] leading-relaxed text-muted italic">{method.note}</p>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Effectiveness figures are typical-use averages. A healthcare provider can help you find the right method for your circumstances.
      </p>
    </div>
  )
}
