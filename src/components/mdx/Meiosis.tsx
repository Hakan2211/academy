import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Meiosis makes gametes: TWO divisions that halve the chromosome number and
// shuffle the genes (crossing over), producing four genetically unique cells.
const STAGES = [
  { title: 'Interphase', caption: 'DNA is copied. A homologous pair — one chromosome from each parent — is now two replicated chromosomes.' },
  { title: 'Prophase I — crossing over', caption: 'The homologous chromosomes pair up and swap matching segments. This "crossing over" reshuffles genes and creates new combinations.' },
  { title: 'Metaphase I', caption: 'The homologous PAIRS line up at the equator — and which parent’s chromosome faces which pole is random, adding more variety.' },
  { title: 'Anaphase I', caption: 'The two homologous chromosomes are pulled to opposite poles. The cell will split — already halving the chromosome number.' },
  { title: 'Meiosis II', caption: 'In each of the two cells, the sister chromatids are now separated — just like in mitosis.' },
  { title: 'Four gametes', caption: 'The result is FOUR haploid cells, each with half the chromosomes — and, thanks to crossing over, all genetically different.' },
]

const RED = '#E74C3C'
const ORANGE = '#E67E22'

function Dup({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g>
      <rect x={x - 6} y={y - 16} width={5} height={32} rx={2.5} fill={c} />
      <rect x={x + 1} y={y - 16} width={5} height={32} rx={2.5} fill={c} />
      <circle cx={x} cy={y} r={2.6} fill="#1f2937" />
    </g>
  )
}
function Single({ x, y, c }: { x: number; y: number; c: string }) {
  return <rect x={x - 2.5} y={y - 16} width={5} height={32} rx={2.5} fill={c} />
}
function Cell({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return <circle cx={cx} cy={cy} r={r} fill="#10243a" stroke="#4FD1C5" strokeWidth={2} />
}

function Stage({ i }: { i: number }) {
  if (i === 0)
    return (<><Cell cx={180} cy={110} r={78} /><Dup x={155} y={110} c={RED} /><Dup x={205} y={110} c={ORANGE} /></>)
  if (i === 1)
    return (
      <>
        <Cell cx={180} cy={110} r={78} />
        <Dup x={170} y={110} c={RED} />
        <Dup x={192} y={110} c={ORANGE} />
        <line x1={176} y1={96} x2={186} y2={124} stroke="#fff" strokeWidth={1.5} opacity={0.7} />
        {/* swapped tips */}
        <rect x={167.5} y={94} width={5} height={6} rx={2} fill={ORANGE} />
        <rect x={189.5} y={120} width={5} height={6} rx={2} fill={RED} />
      </>
    )
  if (i === 2)
    return (<><Cell cx={180} cy={110} r={78} /><Dup x={168} y={110} c={RED} /><Dup x={196} y={110} c={ORANGE} /><line x1={40} y1={110} x2={150} y2={110} stroke="#64748b" strokeWidth={1} /><line x1={320} y1={110} x2={215} y2={110} stroke="#64748b" strokeWidth={1} /></>)
  if (i === 3)
    return (<><Cell cx={180} cy={110} r={78} /><Dup x={120} y={110} c={RED} /><Dup x={240} y={110} c={ORANGE} /></>)
  if (i === 4)
    return (
      <>
        <Cell cx={100} cy={110} r={54} />
        <Cell cx={260} cy={110} r={54} />
        <Single x={90} y={110} c={RED} />
        <Single x={110} y={110} c={RED} />
        <Single x={250} y={110} c={ORANGE} />
        <Single x={270} y={110} c={ORANGE} />
      </>
    )
  return (
    <>
      {[60, 140, 220, 300].map((cx) => (
        <Cell key={cx} cx={cx} cy={110} r={34} />
      ))}
      <Single x={60} y={110} c={RED} />
      <Single x={140} y={110} c={RED} />
      <Single x={220} y={110} c={ORANGE} />
      <Single x={300} y={110} c={ORANGE} />
      {/* crossed-over bits to show variation */}
      <rect x={57.5} y={94} width={5} height={6} rx={2} fill={ORANGE} />
      <rect x={297.5} y={120} width={5} height={6} rx={2} fill={RED} />
    </>
  )
}

export function Meiosis() {
  const [i, setI] = useState(0)
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 200" className="w-full">
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
