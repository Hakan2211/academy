import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Software is a process, not a single act of typing. The Software Development
// Life Cycle (SDLC) loops through six stages — and it never really ends, because
// real software lives on for years. Click a stage on the ring to see what
// happens in it. Note that maintenance is the longest, costliest stage of all.

type Stage = {
  key: string
  name: string
  icon: string
  color: string
  blurb: string
  cost: string
}

const STAGES: Array<Stage> = [
  { key: 'req', name: 'Requirements', icon: 'ClipboardList', color: '#FF6B6B', blurb: 'Figure out what to build and why. Talk to users, write down what the software must do. Getting this wrong here is the most expensive mistake of all.', cost: 'A vague requirement found late costs 100× more to fix than one caught now.' },
  { key: 'design', name: 'Design', icon: 'PencilRuler', color: '#FFC83D', blurb: 'Plan the structure before writing code: which modules, what data, how the pieces fit. A good design makes the build — and every future change — easier.', cost: 'Decide the shape of the system: modules, interfaces, data flow.' },
  { key: 'impl', name: 'Implementation', icon: 'Code2', color: '#2ECC71', blurb: 'The part people imagine when they hear "software": actually writing the code. Surprisingly, it is usually a minority of the total effort.', cost: 'Coding is real work — but only one slice of the whole life cycle.' },
  { key: 'test', name: 'Testing', icon: 'FlaskConical', color: '#00CEC9', blurb: 'Check that it does what the requirements said — and survives weird inputs. Bugs found here are cheap; bugs found by users are not.', cost: 'Catch defects before users do. Cheaper now than after release.' },
  { key: 'deploy', name: 'Deployment', icon: 'Rocket', color: '#4F8CFF', blurb: 'Ship it to real users: install, release, roll out. The software finally meets the messy real world it was built for.', cost: 'Release to production and watch how it behaves with real users.' },
  { key: 'maint', name: 'Maintenance', icon: 'Wrench', color: '#9B59B6', blurb: 'Fix bugs, adapt to change, add features — for years. This is where most of a system’s total cost is spent, long after launch.', cost: 'Typically 60–80% of total cost. Software is mostly maintained, not built.' },
]

// Position each stage evenly around a circle, starting at the top.
const CX = 150
const CY = 150
const R = 108

export function SdlcCycle() {
  const [sel, setSel] = useState(0)
  const s = STAGES[sel]
  const n = STAGES.length

  const pos = (i: number) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2
    return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid items-center gap-3 sm:grid-cols-[1fr_1fr]">
        <svg viewBox="0 0 300 300" className="w-full">
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="4 5" />
          {STAGES.map((stage, i) => {
            const p = pos(i)
            const active = sel === i
            return (
              <g key={stage.key} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={active ? 24 : 19}
                  fill={active ? stage.color : 'var(--color-surface-2)'}
                  stroke={stage.color}
                  strokeWidth="2.5"
                  style={{ transition: 'r 0.15s' }}
                />
                <text x={p.x} y={p.y + 30} textAnchor="middle" className="text-[9px]" fill="var(--color-muted)">
                  {stage.name}
                </text>
              </g>
            )
          })}
          <text x={CX} y={CY - 6} textAnchor="middle" className="text-[11px] font-semibold" fill="var(--color-ink)">SDLC</text>
          <text x={CX} y={CY + 10} textAnchor="middle" className="text-[8px]" fill="var(--color-muted)">it loops, forever</text>
        </svg>

        <div className="rounded-xl border border-border bg-surface-2 p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: s.color, color: '#0a0f1f' }}>
              <Icon name={s.icon} size={16} />
            </span>
            <div>
              <div className="font-semibold text-ink">{s.name}</div>
              <div className="text-xs text-muted">Stage {sel + 1} of {n}</div>
            </div>
          </div>
          <p className="mt-2 text-sm text-ink/90">{s.blurb}</p>
          <p className="mt-2 rounded-lg border border-accent/30 bg-accent/5 p-2 text-xs text-muted">{s.cost}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {STAGES.map((stage, i) => (
          <button
            key={stage.key}
            type="button"
            onClick={() => setSel(i)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs transition-colors',
              sel === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {stage.name}
          </button>
        ))}
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        The arrows point back to the start: real software is never &ldquo;done&rdquo; — it keeps cycling through <span className="text-ink">maintenance</span>.
      </p>
    </div>
  )
}
