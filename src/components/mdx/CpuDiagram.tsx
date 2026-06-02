import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Zoom inside the CPU and the "brain" turns out to be a few small parts working
// together. The control unit reads instructions and conducts everyone; the ALU
// does the actual arithmetic and logic; registers are a handful of ultra-fast
// slots; the program counter remembers which instruction comes next. Click any
// block to see its job. (The ALU is the very calculator we built from gates.)

type Part = {
  key: string
  name: string
  short: string
  icon: string
  color: string
  role: string
}

const PARTS: Array<Part> = [
  {
    key: 'cu',
    name: 'Control unit',
    short: 'Control',
    icon: 'Workflow',
    color: '#9B59B6',
    role: 'The conductor. It decodes each instruction and sends signals telling every other part what to do and when — read this register, add these numbers, store that result.',
  },
  {
    key: 'alu',
    name: 'ALU (Arithmetic Logic Unit)',
    short: 'ALU',
    icon: 'Calculator',
    color: '#4F8CFF',
    role: 'The calculator we built from gates in the last world. It adds, subtracts, compares and runs logic (AND/OR) on numbers the control unit hands it, and reports the result back to a register.',
  },
  {
    key: 'reg',
    name: 'Registers',
    short: 'Registers',
    icon: 'Rows3',
    color: '#2ECC71',
    role: 'A tiny set of the fastest storage that exists — just a few bytes, right next to the ALU. The CPU keeps the numbers it is working on this instant here. Each is a row of latches: gates wired into a loop.',
  },
  {
    key: 'pc',
    name: 'Program counter (PC)',
    short: 'PC',
    icon: 'LocateFixed',
    color: '#FFC83D',
    role: 'A special register holding the memory address of the next instruction to run. After each instruction it ticks up by one — that is how the CPU marches through a program in order.',
  },
  {
    key: 'ir',
    name: 'Instruction register (IR)',
    short: 'IR',
    icon: 'FileCode2',
    color: '#FF6B6B',
    role: 'Holds the single instruction that was just fetched from memory while the control unit decodes it. Think of it as the line of the program the CPU is reading right now.',
  },
]

export function CpuDiagram() {
  const [sel, setSel] = useState('alu')
  const part = PARTS.find((p) => p.key === sel)!
  const is = (k: string) => sel === k
  const pick = (k: string) => () => setSel(k)

  const block = (k: string, x: number, y: number, w: number, h: number) => {
    const p = PARTS.find((q) => q.key === k)!
    return (
      <g onClick={pick(k)} style={{ cursor: 'pointer' }}>
        <rect x={x} y={y} width={w} height={h} rx="9" fill={is(k) ? p.color : 'var(--color-surface-2)'} stroke={p.color} strokeWidth={is(k) ? 3 : 2} />
        <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={is(k) ? '#0a0f1f' : p.color}>{p.short}</text>
      </g>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 220" className="w-full">
        {/* CPU chip outline */}
        <rect x="14" y="14" width="332" height="192" rx="14" fill="none" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="6 5" />
        <text x="26" y="32" fontSize="10" fill="var(--color-muted)">CPU</text>

        {/* internal wiring */}
        <line x1="120" y1="64" x2="240" y2="64" stroke="var(--color-border)" strokeWidth="2" />
        <line x1="180" y1="84" x2="180" y2="116" stroke="var(--color-border)" strokeWidth="2" />
        <line x1="120" y1="160" x2="240" y2="160" stroke="var(--color-border)" strokeWidth="2" />

        {/* top: control unit (wide) */}
        {block('cu', 90, 40, 180, 28)}

        {/* middle: PC | ALU | IR */}
        {block('pc', 36, 116, 84, 36)}
        {block('alu', 138, 116, 84, 36)}
        {block('ir', 240, 116, 84, 36)}

        {/* bottom: registers (wide) */}
        {block('reg', 90, 168, 180, 28)}
      </svg>

      <div className="mt-3 flex items-start gap-3 rounded-xl border border-border bg-surface-2 p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: part.color, color: '#0a0f1f' }}>
          <Icon name={part.icon} size={18} />
        </span>
        <div>
          <div className="font-semibold text-ink">{part.name}</div>
          <p className="mt-1 text-sm text-ink/90">{part.role}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {PARTS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={pick(p.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs transition-colors',
              sel === p.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {p.short}
          </button>
        ))}
      </div>
    </div>
  )
}
