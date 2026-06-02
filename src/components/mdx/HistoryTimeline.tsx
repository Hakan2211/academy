import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A clickable tour through the history of computing — from beads on a wire to
// machines that write. Each leap was about doing more, faster, with less human
// effort: a recurring theme of the whole subject.

type Era = {
  year: string
  title: string
  icon: string
  color: string
  blurb: string
}

const ERAS: Array<Era> = [
  { year: '~2000 BCE', title: 'The Abacus', icon: 'Grip', color: '#FF6B6B', blurb: 'The first calculating tools were physical: beads on rods let merchants add and subtract far faster than counting by hand.' },
  { year: '1837', title: "Babbage's Engine", icon: 'Cog', color: '#FF8C42', blurb: 'Charles Babbage designed the Analytical Engine — a mechanical, programmable computer. Ada Lovelace wrote the first algorithm for it, becoming the first programmer.' },
  { year: '1936', title: 'The Turing Machine', icon: 'Brain', color: '#FFC83D', blurb: 'Alan Turing imagined a simple abstract machine that could compute anything computable — the theoretical foundation of every computer that followed.' },
  { year: '1945', title: 'ENIAC', icon: 'Zap', color: '#9BDE3C', blurb: 'One of the first general-purpose electronic computers: 18,000 vacuum tubes, the size of a room, programmed by rewiring it by hand.' },
  { year: '1947', title: 'The Transistor', icon: 'ToggleRight', color: '#1ABC9C', blurb: 'A tiny switch with no moving parts replaced fragile, power-hungry tubes. Shrinking it down is the engine behind every advance since.' },
  { year: '1971', title: 'The Microprocessor', icon: 'Cpu', color: '#00CEC9', blurb: "Intel's 4004 put an entire CPU on a single chip. Computing power could now fit in your hand — and get cheaper every year." },
  { year: '1977', title: 'The Personal Computer', icon: 'Monitor', color: '#4F8CFF', blurb: 'The Apple II, Commodore PET and others brought computers out of labs and into homes and schools. Computing became personal.' },
  { year: '1991', title: 'The World Wide Web', icon: 'Globe', color: '#9B59B6', blurb: 'Tim Berners-Lee linked documents across the internet with hyperlinks. Information — and people — became globally connected.' },
  { year: '2007', title: 'The Smartphone', icon: 'Smartphone', color: '#E84393', blurb: 'The iPhone fused a computer, a phone and the internet into a pocket device, putting a powerful computer in billions of pockets.' },
  { year: '2022', title: 'Generative AI', icon: 'Sparkles', color: '#A29BFE', blurb: 'Large language models learned to write, reason and code from vast data — machines that produce, not just calculate. The story continues.' },
]

export function HistoryTimeline() {
  const [sel, setSel] = useState(2)
  const e = ERAS[sel]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="relative overflow-x-auto pb-2">
        <div className="flex min-w-[640px] items-start gap-1">
          {ERAS.map((era, i) => (
            <button
              key={era.year}
              type="button"
              onClick={() => setSel(i)}
              className="flex flex-1 flex-col items-center gap-1 text-center"
            >
              <span className="text-[10px] font-mono text-muted">{era.year}</span>
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all',
                  sel === i ? 'scale-110' : 'opacity-70 hover:opacity-100',
                )}
                style={{
                  borderColor: era.color,
                  background: sel === i ? era.color : 'var(--color-surface-2)',
                  color: sel === i ? '#0a0f1f' : era.color,
                }}
              >
                <Icon name={era.icon} size={16} />
              </span>
              <span className={cn('text-[10px] leading-tight', sel === i ? 'text-ink' : 'text-muted')}>{era.title}</span>
            </button>
          ))}
        </div>
        <div className="absolute left-0 right-0 top-[34px] -z-0 mx-6 h-0.5 bg-border" />
      </div>

      <div className="mt-3 rounded-xl border border-border bg-surface-2 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: e.color, color: '#0a0f1f' }}>
            <Icon name={e.icon} size={16} />
          </span>
          <div>
            <div className="font-semibold text-ink">{e.title}</div>
            <div className="font-mono text-xs text-muted">{e.year}</div>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted">{e.blurb}</p>
      </div>
    </div>
  )
}
