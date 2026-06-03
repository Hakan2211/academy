import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A casebook of market-power problems. Each card sketches a realistic scenario,
// names the market structure at issue, and gives the policy response a
// competition authority would reach for. The lesson: antitrust is not anti-big
// — it targets conduct and structures that harm consumers, while leaving
// genuine efficiencies (and unavoidable natural monopolies) to be regulated
// rather than broken up.
type Case = {
  name: string
  icon: string
  color: string
  scene: string
  structure: string
  response: string
}

const CASES: Array<Case> = [
  {
    name: 'The merger',
    icon: 'Combine',
    color: '#9B59B6',
    scene: 'The #1 and #2 supermarket chains in a region announce plans to merge, leaving just two large grocers to serve most shoppers.',
    structure: 'Would create a tight oligopoly — fewer, larger rivals with more market power and a real risk of higher prices.',
    response: 'Merger review. The authority blocks the deal, or clears it only if the firms divest stores in overlapping areas to preserve competition.',
  },
  {
    name: 'The cartel',
    icon: 'Handshake',
    color: '#E74C3C',
    scene: 'Executives from rival cement makers are caught on email agreeing to set the same high price and not poach each other\'s customers.',
    structure: 'Collusion — competitors secretly behaving like a single monopoly to fix prices and carve up the market.',
    response: 'Price-fixing is the cardinal antitrust sin: heavy fines, banned agreements, and in many countries criminal charges. Whistle-blowers get leniency.',
  },
  {
    name: 'The utility',
    icon: 'Zap',
    color: '#F39C12',
    scene: 'One company owns the only electricity grid in the city. Duplicating the wires would be hugely wasteful, so a single network is cheapest.',
    structure: 'A natural monopoly — costs fall over the whole market, so one provider is genuinely most efficient. Competition here would waste resources.',
    response: 'Don\'t break it up — regulate it. A regulator caps prices near average cost and oversees service, capturing the efficiency without the monopoly markup.',
  },
  {
    name: 'The platform',
    icon: 'Network',
    color: '#4F8CFF',
    scene: 'A dominant online marketplace ranks its own house-brand products above rival sellers and locks shoppers in, making it hard for competitors to reach buyers.',
    structure: 'Abuse of a dominant position — using monopoly power in one area to foreclose competition rather than win on the merits.',
    response: 'Conduct remedies: ban the self-preferencing, mandate fair access and interoperability, and fine the abuse — targeting the behaviour, not the size.',
  },
]

export function AntitrustCases() {
  const [sel, setSel] = useState(0)
  const c = CASES[sel]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {CASES.map((cs, i) => (
          <button
            key={cs.name}
            type="button"
            onClick={() => setSel(i)}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-all',
              sel === i ? 'border-accent bg-accent/15' : 'border-border hover:border-accent/50',
            )}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: sel === i ? cs.color : 'var(--color-surface-2)', color: sel === i ? '#0a0f1f' : cs.color }}
            >
              <Icon name={cs.icon} size={18} />
            </span>
            <span className={cn('text-center text-[10px] leading-tight', sel === i ? 'text-ink' : 'text-muted')}>{cs.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-border bg-surface-2 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: c.color, color: '#0a0f1f' }}>
            <Icon name={c.icon} size={16} />
          </span>
          <div className="font-semibold text-ink">{c.name}</div>
        </div>
        <p className="mt-2 text-sm text-muted">{c.scene}</p>

        <div className="mt-3 flex items-start gap-2 rounded-lg border border-border bg-surface p-3">
          <Icon name="Search" size={16} className="mt-0.5 shrink-0 text-accent" />
          <p className="text-sm text-ink">
            <span className="font-semibold text-accent">Structure: </span>
            {c.structure}
          </p>
        </div>

        <div className="mt-2 flex items-start gap-2 rounded-lg border border-success/40 bg-success/10 p-3">
          <Icon name="Gavel" size={16} className="mt-0.5 shrink-0 text-success" />
          <p className="text-sm text-ink">
            <span className="font-semibold text-success">Policy response: </span>
            {c.response}
          </p>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Antitrust is not <span className="text-ink">anti-big</span> — it targets conduct that <span className="text-ink">harms consumers</span>, and regulates the monopolies we cannot avoid.
      </p>
    </div>
  )
}
