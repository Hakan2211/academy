import { useState } from 'react'
import { cn } from '#/lib/cn'

// How a kidney cleans the blood, in three steps: filter everything small out,
// reabsorb what's useful, and let the rest leave as urine.
const STEPS = [
  { id: 'filter', label: '1. Filtration', color: '#4F8CFF', fn: 'High blood pressure in the glomerulus forces small molecules — water, glucose, salts, and the waste urea — out of the blood into the tubule. Blood cells and proteins are too big to pass.' },
  { id: 'reabsorb', label: '2. Reabsorption', color: '#2ECC71', fn: 'As the filtrate flows along the tubule, the body reclaims what it needs: ALL the glucose, plus the right amount of water and salts, are reabsorbed back into the blood.' },
  { id: 'urine', label: '3. Urine', color: '#FDCB6E', fn: 'What stays behind — urea, excess water, and excess salts — continues on to the bladder as urine. The kidney has both cleaned the blood and balanced its water.' },
]

export function Nephron() {
  const [sel, setSel] = useState('filter')
  const step = STEPS.find((s) => s.id === sel)!

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 320 150" className="w-full">
        {/* blood in */}
        <text x={20} y={40} className="fill-[#E74C3C] text-[10px]">blood in</text>
        <line x1={20} y1={48} x2={70} y2={48} stroke="#E74C3C" strokeWidth={3} />
        {/* glomerulus (filter) */}
        <g onClick={() => setSel('filter')} className="cursor-pointer">
          <circle cx={88} cy={48} r={20} fill="none" stroke={sel === 'filter' ? '#FACC15' : '#4F8CFF'} strokeWidth={sel === 'filter' ? 4 : 2.5} strokeDasharray="3 3" />
          <text x={88} y={80} textAnchor="middle" className="fill-muted text-[8px]">glomerulus</text>
        </g>
        {/* tubule */}
        <g onClick={() => setSel('reabsorb')} className="cursor-pointer">
          <path d="M 108 48 q 30 0 30 24 q 0 24 30 24 q 30 0 30 -24 q 0 -24 30 -24" fill="none" stroke={sel === 'reabsorb' ? '#FACC15' : '#2ECC71'} strokeWidth={sel === 'reabsorb' ? 7 : 5} strokeLinecap="round" />
          <text x={168} y={118} textAnchor="middle" className="fill-muted text-[8px]">tubule (reabsorption)</text>
        </g>
        {/* reabsorbed back to blood */}
        <line x1={150} y1={70} x2={150} y2={30} stroke="#2ECC71" strokeWidth={1.5} strokeDasharray="2 2" />
        <text x={150} y={24} textAnchor="middle" className="fill-[#2ECC71] text-[8px]">→ blood</text>
        {/* urine out */}
        <g onClick={() => setSel('urine')} className="cursor-pointer">
          <line x1={238} y1={48} x2={295} y2={48} stroke={sel === 'urine' ? '#FACC15' : '#FDCB6E'} strokeWidth={sel === 'urine' ? 5 : 3} />
          <text x={290} y={40} textAnchor="end" className="fill-[#FDCB6E] text-[10px]">urine</text>
        </g>
      </svg>

      <div className="mt-1 flex flex-wrap gap-1.5">
        {STEPS.map((s) => (
          <button key={s.id} type="button" onClick={() => setSel(s.id)} className={cn('rounded-full border px-2.5 py-0.5 text-xs transition-colors', sel === s.id ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}>
            {s.label}
          </button>
        ))}
      </div>
      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        <span className="font-semibold" style={{ color: step.color }}>{step.label}: </span>{step.fn}
      </p>
    </div>
  )
}
