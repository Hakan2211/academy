import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The origin of complex cells: a host cell swallowed free-living bacteria that
// became its mitochondria and (in plants) chloroplasts. Step through the story.
type Stage = {
  title: string
  caption: string
  host: number // host radius
  guestColor: string
  guestLabel: string
  guestInside: boolean
  guestX: number
}

const STAGES: Array<Stage> = [
  {
    title: 'Two free-living cells',
    caption: 'Around 2 billion years ago, a large host cell lived alongside small aerobic bacteria that were brilliant at releasing energy with oxygen.',
    host: 70,
    guestColor: '#c0392b',
    guestLabel: 'aerobic bacterium',
    guestInside: false,
    guestX: 305,
  },
  {
    title: 'Engulfed, but not digested',
    caption: 'The host engulfed a bacterium — but instead of digesting it, it kept it alive. The bacterium earned its keep by supplying energy.',
    host: 78,
    guestColor: '#c0392b',
    guestLabel: 'endosymbiont',
    guestInside: true,
    guestX: 250,
  },
  {
    title: 'A permanent partnership → mitochondrion',
    caption: 'Over countless generations the bacterium became a permanent part of the cell: the mitochondrion. This is why mitochondria still have their OWN DNA and double membrane.',
    host: 82,
    guestColor: '#c0392b',
    guestLabel: 'mitochondrion',
    guestInside: true,
    guestX: 215,
  },
  {
    title: 'A second capture → chloroplast',
    caption: 'Later, one such cell engulfed a photosynthetic cyanobacterium. It became the chloroplast — and that cell became the ancestor of all plants and algae.',
    host: 86,
    guestColor: '#1f8b3a',
    guestLabel: 'chloroplast',
    guestInside: true,
    guestX: 150,
  },
]

export function Endosymbiosis() {
  const [i, setI] = useState(0)
  const s = STAGES[i]
  const hostX = 150
  const hostY = 110

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 380 220" className="w-full">
        {/* host cell */}
        <circle cx={hostX} cy={hostY} r={s.host} fill="#10243a" stroke="#4FD1C5" strokeWidth={2.5} />
        <circle cx={hostX - 18} cy={hostY - 14} r={22} fill="#5b3fb0" stroke="#A29BFE" strokeWidth={2} />
        <text x={hostX} y={hostY + s.host + 16} textAnchor="middle" className="fill-muted text-[10px]">
          host cell
        </text>

        {/* mitochondrion from earlier stage, once captured and i>=3 shows both */}
        {i >= 3 && (
          <g transform={`translate(${hostX + 30} ${hostY + 30})`}>
            <ellipse rx={20} ry={11} fill="#c0392b" stroke="#ff7a66" strokeWidth={2} />
            <path d="M -13 0 Q -7 -6 0 0 Q 7 6 13 0" fill="none" stroke="#ffd2c9" strokeWidth={1.4} />
          </g>
        )}

        {/* the guest */}
        <g transform={`translate(${s.guestX} ${s.guestInside ? hostY + 22 : 110})`}>
          <ellipse rx={24} ry={13} fill={s.guestColor} stroke="#ffffff" strokeOpacity={0.5} strokeWidth={1.5} />
          <path d="M -16 0 Q -9 -7 0 0 Q 9 7 16 0" fill="none" stroke="#ffffff" strokeOpacity={0.6} strokeWidth={1.4} />
        </g>
        <text
          x={s.guestInside ? s.guestX : 305}
          y={s.guestInside ? hostY + 44 : 138}
          textAnchor="middle"
          className="fill-muted text-[9px]"
        >
          {s.guestLabel}
        </text>
      </svg>

      <p className="mb-1 text-center text-sm font-semibold text-ink">{s.title}</p>
      <p className="min-h-[3.5rem] text-center text-sm text-muted">{s.caption}</p>

      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setI((v) => Math.max(0, v - 1))}
          disabled={i === 0}
          className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm text-muted enabled:hover:text-ink disabled:opacity-30"
        >
          <Icon name="ChevronLeft" size={14} /> Back
        </button>
        <div className="flex gap-1.5">
          {STAGES.map((_, k) => (
            <span key={k} className={cn('h-1.5 w-1.5 rounded-full', k === i ? 'bg-accent' : 'bg-border')} />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setI((v) => Math.min(STAGES.length - 1, v + 1))}
          disabled={i === STAGES.length - 1}
          className="flex items-center gap-1 rounded-full border border-accent bg-accent/15 px-3 py-1 text-sm text-accent enabled:hover:bg-accent/25 disabled:opacity-30"
        >
          Next <Icon name="ChevronRight" size={14} />
        </button>
      </div>
    </div>
  )
}
