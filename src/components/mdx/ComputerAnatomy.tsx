import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A whole computer is a handful of cooperating parts wired to a shared highway
// called the bus. The CPU computes; RAM holds the program and data it is using
// right now; storage keeps everything safely when the power is off; input and
// output devices connect it to the world. Click any block to learn its job.

type Part = {
  key: string
  name: string
  icon: string
  color: string
  role: string
}

const PARTS: Array<Part> = [
  {
    key: 'cpu',
    name: 'CPU',
    icon: 'Cpu',
    color: '#4F8CFF',
    role: 'The processor — the "brain" that actually computes. It fetches instructions, does arithmetic and logic, and tells every other part what to do. Built from the gates and ALU of the last world.',
  },
  {
    key: 'ram',
    name: 'RAM (main memory)',
    icon: 'MemoryStick',
    color: '#2ECC71',
    role: 'Fast, temporary working memory. It holds the program that is running and the data it is using right now. RAM is volatile: switch off the power and everything in it vanishes.',
  },
  {
    key: 'storage',
    name: 'Storage (disk)',
    icon: 'HardDrive',
    color: '#FFC83D',
    role: 'Slow but permanent memory — an SSD or hard disk. It keeps your files, apps and operating system even with the power off. Programs are copied from here into RAM to run.',
  },
  {
    key: 'input',
    name: 'Input devices',
    icon: 'Keyboard',
    color: '#00CEC9',
    role: 'How the world gets data into the computer: keyboard, mouse, touchscreen, microphone, camera, sensors. They turn your actions into bits the CPU can read.',
  },
  {
    key: 'output',
    name: 'Output devices',
    icon: 'Monitor',
    color: '#FF6B6B',
    role: 'How the computer shows you results: screen, speakers, printer. They turn bits back into pictures, sound and text you can sense.',
  },
  {
    key: 'bus',
    name: 'The bus',
    icon: 'Cable',
    color: '#9B59B6',
    role: 'The shared set of wires every part plugs into. Data, addresses and control signals travel along the bus, letting the CPU move bytes between memory, storage and devices.',
  },
]

function Block({ part, sel, onClick, x, y, w, h }: {
  part: Part
  sel: boolean
  onClick: () => void
  x: number
  y: number
  w: number
  h: number
}) {
  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="10"
        fill={sel ? part.color : 'var(--color-surface-2)'}
        stroke={part.color}
        strokeWidth={sel ? 3 : 2}
      />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={sel ? '#0a0f1f' : part.color}>
        {part.name.split(' ')[0]}
      </text>
    </g>
  )
}

export function ComputerAnatomy() {
  const [sel, setSel] = useState('cpu')
  const part = PARTS.find((p) => p.key === sel)!
  const pick = (k: string) => () => setSel(k)
  const is = (k: string) => sel === k

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 220" className="w-full">
        {/* connectors into the bus */}
        {[78, 180, 282].map((x) => (
          <line key={x} x1={x} y1="62" x2={x} y2="104" stroke="var(--color-border)" strokeWidth="2" />
        ))}
        {[78, 180, 282].map((x) => (
          <line key={x} x1={x} y1="128" x2={x} y2="160" stroke="var(--color-border)" strokeWidth="2" />
        ))}

        {/* top row: CPU, RAM, Storage */}
        <Block part={PARTS[0]} sel={is('cpu')} onClick={pick('cpu')} x={36} y={22} w={84} h={40} />
        <Block part={PARTS[1]} sel={is('ram')} onClick={pick('ram')} x={138} y={22} w={84} h={40} />
        <Block part={PARTS[2]} sel={is('storage')} onClick={pick('storage')} x={240} y={22} w={84} h={40} />

        {/* the bus */}
        <g onClick={pick('bus')} style={{ cursor: 'pointer' }}>
          <rect x={36} y={104} width={288} height={24} rx="6" fill={is('bus') ? PARTS[5].color : 'var(--color-surface-2)'} stroke={PARTS[5].color} strokeWidth={is('bus') ? 3 : 2} />
          <text x={180} y={120} textAnchor="middle" fontSize="11" fontWeight="700" fill={is('bus') ? '#0a0f1f' : PARTS[5].color}>BUS</text>
        </g>

        {/* bottom row: input, output */}
        <Block part={PARTS[3]} sel={is('input')} onClick={pick('input')} x={36} y={160} w={130} h={40} />
        <Block part={PARTS[4]} sel={is('output')} onClick={pick('output')} x={194} y={160} w={130} h={40} />
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
            {p.name}
          </button>
        ))}
      </div>
    </div>
  )
}
