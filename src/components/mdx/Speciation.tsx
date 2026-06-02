import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// How one species becomes two: split a population with a barrier, let the halves
// adapt to different conditions, and eventually they can no longer interbreed.
const STAGES = [
  { title: 'One interbreeding population', caption: 'A single species shares one gene pool — all its members can breed with one another.' },
  { title: 'A barrier divides it', caption: 'A river, mountain range, or ocean splits the population in two. The halves can no longer meet or interbreed.' },
  { title: 'The halves diverge', caption: 'Different environments mean different selection pressures. Mutations and natural selection push each half in its own direction.' },
  { title: 'Two separate species', caption: 'After enough change, the two groups can no longer interbreed even if reunited. One species has become two.' },
]

function Birds({ stage }: { stage: number }) {
  const left = ['🐦', '🐦', '🐦']
  const right = stage >= 2 ? ['🐤', '🐤', '🐤'] : ['🐦', '🐦', '🐦']
  return (
    <svg viewBox="0 0 360 120" className="w-full">
      {/* barrier */}
      {stage >= 1 && (
        <rect x={172} y={10} width={16} height={100} rx={4} fill={stage === 3 ? '#5a463155' : '#5a4631'} />
      )}
      {stage === 0 ? (
        [40, 100, 160, 210, 270, 320].map((x, i) => (
          <text key={i} x={x} y={70} textAnchor="middle" className="text-[22px]">🐦</text>
        ))
      ) : (
        <>
          {left.map((e, i) => (
            <text key={`l${i}`} x={40 + i * 46} y={70} textAnchor="middle" className="text-[22px]">{e}</text>
          ))}
          {right.map((e, i) => (
            <text key={`r${i}`} x={210 + i * 46} y={70} textAnchor="middle" className="text-[22px]">{e}</text>
          ))}
        </>
      )}
      {stage === 3 && (
        <text x={180} y={104} textAnchor="middle" className="fill-[#E74C3C] text-[11px] font-bold">✗ cannot interbreed</text>
      )}
    </svg>
  )
}

export function Speciation() {
  const [i, setI] = useState(0)
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <Birds stage={i} />
      <p className="mb-1 text-center text-sm font-semibold text-ink">{STAGES[i].title}</p>
      <p className="min-h-[3.5rem] text-center text-sm text-muted">{STAGES[i].caption}</p>
      <div className="mt-2 flex items-center justify-between">
        <button type="button" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm text-muted enabled:hover:text-ink disabled:opacity-30">
          <Icon name="ChevronLeft" size={14} /> Back
        </button>
        <div className="flex gap-1.5">
          {STAGES.map((_, k) => (
            <span key={k} className={cn('h-1.5 w-1.5 rounded-full', k === i ? 'bg-accent' : 'bg-border')} />
          ))}
        </div>
        <button type="button" onClick={() => setI((v) => Math.min(STAGES.length - 1, v + 1))} disabled={i === STAGES.length - 1} className="flex items-center gap-1 rounded-full border border-accent bg-accent/15 px-3 py-1 text-sm text-accent enabled:hover:bg-accent/25 disabled:opacity-30">
          Next <Icon name="ChevronRight" size={14} />
        </button>
      </div>
    </div>
  )
}
