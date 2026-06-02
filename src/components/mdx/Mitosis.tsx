import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Mitosis, stage by stage: one cell makes two genetically identical copies of
// itself — the basis of growth and repair. Step through prophase to cytokinesis.
const STAGES = [
  { title: 'Interphase', caption: 'Before mitosis, the cell grows and copies its DNA. Each chromosome is now two identical sister chromatids, still loose as chromatin.' },
  { title: 'Prophase', caption: 'Chromosomes condense into visible X shapes (paired sister chromatids). The nuclear envelope breaks down and spindle fibres form.' },
  { title: 'Metaphase', caption: 'The chromosomes line up single-file across the middle of the cell, attached to spindle fibres from both poles.' },
  { title: 'Anaphase', caption: 'The spindle pulls the sister chromatids apart, dragging one copy of each chromosome to opposite ends of the cell.' },
  { title: 'Telophase & cytokinesis', caption: 'A nucleus reforms at each end and the cell splits in two — making two identical daughter cells.' },
]

// replicated chromosome (two sister chromatids + centromere)
function Dup({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <rect x={x - 6} y={y - 17} width={5} height={34} rx={2.5} fill={color} />
      <rect x={x + 1} y={y - 17} width={5} height={34} rx={2.5} fill={color} />
      <circle cx={x} cy={y} r={3} fill="#1f2937" />
    </g>
  )
}
function Single({ x, y, color }: { x: number; y: number; color: string }) {
  return <rect x={x - 2.5} y={y - 17} width={5} height={34} rx={2.5} fill={color} />
}

const RED = '#E74C3C'
const BLUE = '#4F8CFF'

function Stage({ i }: { i: number }) {
  if (i === 0) {
    return (
      <>
        <circle cx={180} cy={110} r={80} fill="#10243a" stroke="#4FD1C5" strokeWidth={2} />
        <circle cx={180} cy={110} r={46} fill="none" stroke="#A29BFE" strokeWidth={2} />
        <path d="M 158 96 q 10 -8 20 0 q 10 8 20 0" fill="none" stroke={RED} strokeWidth={3} />
        <path d="M 158 122 q 10 -8 20 0 q 10 8 20 0" fill="none" stroke={BLUE} strokeWidth={3} />
      </>
    )
  }
  if (i === 1) {
    return (
      <>
        <circle cx={180} cy={110} r={80} fill="#10243a" stroke="#4FD1C5" strokeWidth={2} />
        <circle cx={180} cy={110} r={50} fill="none" stroke="#A29BFE" strokeWidth={1.5} strokeDasharray="4 4" opacity={0.6} />
        <Dup x={160} y={100} color={RED} />
        <Dup x={205} y={120} color={BLUE} />
      </>
    )
  }
  if (i === 2) {
    return (
      <>
        <circle cx={180} cy={110} r={80} fill="#10243a" stroke="#4FD1C5" strokeWidth={2} />
        <line x1={40} y1={110} x2={165} y2={110} stroke="#64748b" strokeWidth={1} />
        <line x1={320} y1={110} x2={195} y2={110} stroke="#64748b" strokeWidth={1} />
        <Dup x={168} y={110} color={RED} />
        <Dup x={196} y={110} color={BLUE} />
      </>
    )
  }
  if (i === 3) {
    return (
      <>
        <circle cx={180} cy={110} r={80} fill="#10243a" stroke="#4FD1C5" strokeWidth={2} />
        <Single x={118} y={100} color={RED} />
        <Single x={130} y={122} color={BLUE} />
        <Single x={242} y={100} color={RED} />
        <Single x={230} y={122} color={BLUE} />
        <line x1={40} y1={110} x2={120} y2={110} stroke="#64748b" strokeWidth={1} />
        <line x1={320} y1={110} x2={240} y2={110} stroke="#64748b" strokeWidth={1} />
      </>
    )
  }
  return (
    <>
      <circle cx={110} cy={110} r={58} fill="#10243a" stroke="#4FD1C5" strokeWidth={2} />
      <circle cx={250} cy={110} r={58} fill="#10243a" stroke="#4FD1C5" strokeWidth={2} />
      <circle cx={110} cy={110} r={30} fill="none" stroke="#A29BFE" strokeWidth={1.5} />
      <circle cx={250} cy={110} r={30} fill="none" stroke="#A29BFE" strokeWidth={1.5} />
      <Single x={102} y={110} color={RED} />
      <Single x={118} y={110} color={BLUE} />
      <Single x={242} y={110} color={RED} />
      <Single x={258} y={110} color={BLUE} />
    </>
  )
}

export function Mitosis() {
  const [i, setI] = useState(0)
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 220" className="w-full">
        <Stage i={i} />
      </svg>

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
