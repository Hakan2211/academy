import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The operating system is the layer sitting between the apps you run and the raw
// hardware they run on. Apps never touch the disk, the keyboard or the chip
// directly — they ask the OS, which manages and shares the hardware on their
// behalf. Click any service to see what the OS quietly does for every program.

type Service = {
  key: string
  name: string
  icon: string
  color: string
  what: string
  illusion: string
}

const SERVICES: Array<Service> = [
  {
    key: 'process',
    name: 'Process management',
    icon: 'SquareStack',
    color: '#4F8CFF',
    what: 'Starts, pauses and stops every running program, and hands the CPU to each in turn.',
    illusion: 'so many programs seem to run at once on one chip',
  },
  {
    key: 'memory',
    name: 'Memory management',
    icon: 'MemoryStick',
    color: '#2ECC71',
    what: 'Gives each program its own private slice of RAM and tracks who owns what.',
    illusion: 'every program thinks it has the memory to itself',
  },
  {
    key: 'files',
    name: 'File system',
    icon: 'FolderTree',
    color: '#FFC83D',
    what: 'Turns billions of raw disk blocks into tidy named files and folders.',
    illusion: 'you save "essay.txt", not "blocks 4192–4197"',
  },
  {
    key: 'devices',
    name: 'Device drivers',
    icon: 'Plug',
    color: '#00CEC9',
    what: 'Speaks the private language of each keyboard, screen, printer and disk.',
    illusion: 'apps use one simple "read"/"write", whatever the device',
  },
  {
    key: 'security',
    name: 'Security & users',
    icon: 'ShieldCheck',
    color: '#FF6B6B',
    what: 'Checks permissions so one user or app cannot read or wreck another’s data.',
    illusion: 'many people share one machine safely',
  },
  {
    key: 'ui',
    name: 'User interface',
    icon: 'MousePointerClick',
    color: '#9B59B6',
    what: 'Draws windows, the desktop and the cursor, and routes your clicks to apps.',
    illusion: 'you point and click instead of typing raw commands',
  },
]

export function OsServices() {
  const [sel, setSel] = useState(0)
  const s = SERVICES[sel]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      {/* Apps on top */}
      <div className="rounded-xl border border-border bg-surface-2 px-3 py-2 text-center">
        <div className="text-[10px] uppercase tracking-wide text-muted">Apps</div>
        <div className="mt-1 flex flex-wrap justify-center gap-2">
          {['Browser', 'Game', 'Editor', 'Music'].map((a) => (
            <span key={a} className="rounded-md border border-border bg-surface px-2 py-0.5 text-xs text-ink/90">
              {a}
            </span>
          ))}
        </div>
      </div>

      <div className="my-1 text-center text-xs text-muted">↓ ask for things ↓</div>

      {/* OS in the middle: the services */}
      <div className="rounded-xl border-2 border-accent/60 bg-accent/10 p-3">
        <div className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wide text-accent">
          Operating system — the manager in the middle
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SERVICES.map((svc, i) => (
            <button
              key={svc.key}
              type="button"
              onClick={() => setSel(i)}
              className={cn(
                'flex items-center gap-2 rounded-lg border-2 px-2 py-1.5 text-left transition-all',
                sel === i ? 'bg-surface' : 'border-transparent bg-surface/40 hover:bg-surface',
              )}
              style={{ borderColor: sel === i ? svc.color : 'transparent' }}
            >
              <Icon name={svc.icon} size={15} style={{ color: svc.color }} />
              <span className={cn('text-xs leading-tight', sel === i ? 'font-semibold text-ink' : 'text-muted')}>
                {svc.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="my-1 text-center text-xs text-muted">↓ drives the real parts ↓</div>

      {/* Hardware at the bottom */}
      <div className="rounded-xl border border-border bg-surface-2 px-3 py-2 text-center">
        <div className="text-[10px] uppercase tracking-wide text-muted">Hardware</div>
        <div className="mt-1 flex flex-wrap justify-center gap-2">
          {['CPU', 'RAM', 'Disk', 'Keyboard', 'Screen', 'Network'].map((h) => (
            <span key={h} className="rounded-md border border-border bg-surface px-2 py-0.5 text-xs text-muted">
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* Explanation of the selected service */}
      <div className="mt-3 rounded-xl border border-border bg-surface-2 p-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: s.color, color: '#0a0f1f' }}>
            <Icon name={s.icon} size={15} />
          </span>
          <div className="font-semibold text-ink">{s.name}</div>
        </div>
        <p className="mt-2 text-sm text-ink/90">{s.what}</p>
        <p className="mt-1 text-xs text-muted">
          <span className="font-semibold" style={{ color: s.color }}>The illusion:</span> {s.illusion}.
        </p>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Apps never touch the hardware directly — they ask the <span className="text-ink">OS</span>, which shares one set of
        hardware among every program safely and fairly.
      </p>
    </div>
  )
}
