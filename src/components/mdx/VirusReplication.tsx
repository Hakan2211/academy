import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A virus can't reproduce on its own — it hijacks a living cell. Step through the
// lytic cycle, from attachment to the cell bursting open.
const STAGES = [
  { title: '1. Attachment', caption: 'The virus lands on a host cell and locks onto specific receptors on its surface — like a key fitting a lock.' },
  { title: '2. Entry', caption: 'The virus injects its genetic material (DNA or RNA) into the cell. The viral genes are now inside.' },
  { title: '3. Replication', caption: 'The virus hijacks the cell’s own machinery, forcing it to copy the viral genes and build viral proteins.' },
  { title: '4. Assembly', caption: 'The new parts snap together into dozens or hundreds of complete new virus particles.' },
  { title: '5. Release (lysis)', caption: 'The cell bursts open, releasing the new viruses to infect more cells — and the cycle repeats.' },
]

function Stage({ i }: { i: number }) {
  return (
    <svg viewBox="0 0 320 160" className="w-full">
      {/* host cell */}
      {i < 4 ? (
        <circle cx={170} cy={80} r={60} fill="#10243a" stroke="#4FD1C5" strokeWidth={2} />
      ) : (
        // burst
        [0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
          const a = (k / 8) * Math.PI * 2
          return <line key={k} x1={170 + Math.cos(a) * 50} y1={80 + Math.sin(a) * 50} x2={170 + Math.cos(a) * 72} y2={80 + Math.sin(a) * 72} stroke="#4FD1C5" strokeWidth={2} />
        })
      )}

      {/* virus(es) */}
      {i === 0 && <Virus x={250} y={40} />}
      {i === 1 && (
        <>
          <Virus x={210} y={36} faded />
          <line x1={196} y1={48} x2={172} y2={70} stroke="#E74C3C" strokeWidth={2} strokeDasharray="2 2" />
        </>
      )}
      {i === 2 && [40, 80, 120].map((d, k) => <line key={k} x1={140} y1={50 + d * 0.4} x2={200} y2={60 + d * 0.3} stroke="#E74C3C" strokeWidth={2} />)}
      {(i === 3 || i === 4) &&
        [[150, 60], [195, 70], [165, 100], [200, 95], [140, 90]].map(([x, y], k) => <Virus key={k} x={i === 4 ? x + (x - 170) * 1.4 : x} y={i === 4 ? y + (y - 80) * 1.4 : y} small />)}
    </svg>
  )
}

function Virus({ x, y, faded, small }: { x: number; y: number; faded?: boolean; small?: boolean }) {
  const s = small ? 0.7 : 1
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={faded ? 0.4 : 1}>
      <polygon points="0,-12 10,-4 7,9 -7,9 -10,-4" fill="#E74C3C" />
      <line x1={0} y1={9} x2={-5} y2={18} stroke="#E74C3C" strokeWidth={2} />
      <line x1={0} y1={9} x2={5} y2={18} stroke="#E74C3C" strokeWidth={2} />
    </g>
  )
}

export function VirusReplication() {
  const [i, setI] = useState(0)
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <Stage i={i} />
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
