import { useState } from 'react'
import { cn } from '#/lib/cn'

// The human reproductive organs, schematically. Toggle male/female and click a
// part to read what it does.
type Sex = 'female' | 'male'
type Part = { id: string; label: string; fn: string }

const FEMALE: Array<Part> = [
  { id: 'ovary', label: 'Ovary', fn: 'Holds the eggs and releases one each month (ovulation). Also makes the hormones oestrogen and progesterone.' },
  { id: 'oviduct', label: 'Oviduct', fn: 'The tube that carries the egg toward the uterus — and where fertilisation usually happens.' },
  { id: 'uterus', label: 'Uterus (womb)', fn: 'Muscular organ where a fertilised egg implants and a baby develops. Its lining thickens each month.' },
  { id: 'cervix', label: 'Cervix', fn: 'The ring of muscle at the neck of the uterus that opens during birth.' },
  { id: 'vagina', label: 'Vagina', fn: 'The passage that receives sperm and through which a baby is born.' },
]
const MALE: Array<Part> = [
  { id: 'testis', label: 'Testis', fn: 'Makes sperm (continuously, from puberty) and the hormone testosterone. Held in the scrotum, kept slightly cooler than the body.' },
  { id: 'spermduct', label: 'Sperm duct', fn: 'Carries sperm from the testis toward the urethra.' },
  { id: 'gland', label: 'Glands', fn: 'Add fluid to the sperm to make semen — providing nutrients and a medium to swim in.' },
  { id: 'urethra', label: 'Urethra', fn: 'The tube through the penis that carries semen (and, separately, urine) out of the body.' },
  { id: 'penis', label: 'Penis', fn: 'Delivers sperm into the female reproductive tract.' },
]

export function ReproductiveSystem() {
  const [sex, setSex] = useState<Sex>('female')
  const parts = sex === 'female' ? FEMALE : MALE
  const [sel, setSel] = useState('uterus')
  const part = parts.find((p) => p.id === sel) ?? parts[0]
  const lit = (id: string) => (part.id === id ? '#FACC15' : undefined)

  const pick = (id: string) => setSel(id)
  const switchSex = (s: Sex) => {
    setSex(s)
    setSel(s === 'female' ? 'uterus' : 'testis')
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex gap-2">
        {(['female', 'male'] as Array<Sex>).map((s) => (
          <button key={s} type="button" onClick={() => switchSex(s)} className={cn('rounded-full border px-3 py-1 text-sm capitalize transition-colors', sex === s ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}>
            {s}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 320 150" className="w-full">
        {sex === 'female' ? (
          <>
            {/* uterus */}
            <g onClick={() => pick('uterus')} className="cursor-pointer">
              <path d="M 130 40 Q 190 40 190 90 Q 190 120 160 120 Q 130 120 130 90 Z" fill="#FD79A8" stroke={lit('uterus') ?? '#0e1c2e'} strokeWidth={lit('uterus') ? 3 : 1.5} />
            </g>
            {/* oviducts */}
            <g onClick={() => pick('oviduct')} className="cursor-pointer">
              <path d="M 130 48 Q 90 36 70 60" fill="none" stroke={lit('oviduct') ?? '#fab1a0'} strokeWidth={6} strokeLinecap="round" />
              <path d="M 190 48 Q 230 36 250 60" fill="none" stroke={lit('oviduct') ?? '#fab1a0'} strokeWidth={6} strokeLinecap="round" />
            </g>
            {/* ovaries */}
            <g onClick={() => pick('ovary')} className="cursor-pointer">
              <ellipse cx={64} cy={64} rx={12} ry={8} fill="#E67E22" stroke={lit('ovary') ?? '#0e1c2e'} strokeWidth={lit('ovary') ? 2.5 : 1} />
              <ellipse cx={256} cy={64} rx={12} ry={8} fill="#E67E22" stroke={lit('ovary') ?? '#0e1c2e'} strokeWidth={lit('ovary') ? 2.5 : 1} />
            </g>
            {/* cervix + vagina */}
            <g onClick={() => pick('cervix')} className="cursor-pointer">
              <rect x={152} y={118} width={16} height={8} fill={lit('cervix') ?? '#c0508a'} />
            </g>
            <g onClick={() => pick('vagina')} className="cursor-pointer">
              <rect x={150} y={126} width={20} height={20} rx={4} fill={lit('vagina') ?? '#fab1a0'} />
            </g>
          </>
        ) : (
          <>
            {/* sperm ducts */}
            <g onClick={() => pick('spermduct')} className="cursor-pointer">
              <path d="M 80 120 Q 80 60 150 60" fill="none" stroke={lit('spermduct') ?? '#A29BFE'} strokeWidth={5} strokeLinecap="round" />
            </g>
            {/* testis + scrotum */}
            <g onClick={() => pick('testis')} className="cursor-pointer">
              <ellipse cx={80} cy={128} rx={20} ry={14} fill="#4FD1C5" stroke={lit('testis') ?? '#0e1c2e'} strokeWidth={lit('testis') ? 3 : 1.5} />
            </g>
            {/* glands */}
            <g onClick={() => pick('gland')} className="cursor-pointer">
              <circle cx={150} cy={56} r={11} fill={lit('gland') ?? '#FDCB6E'} />
            </g>
            {/* urethra through penis */}
            <g onClick={() => pick('urethra')} className="cursor-pointer">
              <line x1={160} y1={60} x2={270} y2={60} stroke={lit('urethra') ?? '#E74C3C'} strokeWidth={4} />
            </g>
            <g onClick={() => pick('penis')} className="cursor-pointer">
              <rect x={170} y={50} width={108} height={20} rx={10} fill="none" stroke={lit('penis') ?? '#fab1a0'} strokeWidth={lit('penis') ? 3 : 2} />
            </g>
          </>
        )}
      </svg>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {parts.map((p) => (
          <button key={p.id} type="button" onClick={() => pick(p.id)} className={cn('rounded-full border px-2.5 py-0.5 text-xs transition-colors', part.id === p.id ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}>
            {p.label}
          </button>
        ))}
      </div>
      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        <span className="font-semibold text-ink">{part.label}: </span>{part.fn}
      </p>
    </div>
  )
}
