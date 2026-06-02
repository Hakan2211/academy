import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Stereotype threat: when a test situation reminds people of a negative
// stereotype about their group, the extra anxiety and self-monitoring eat into
// working memory and depress their score — even though nothing about their
// ability changed. Flip the cue off and performance bounces back. Illustrated
// with two paired bars (a stereotyped group vs a control) under each condition.
const W = 320
const H = 200
const PAD_B = 46
const PAD_T = 18
const BASE = H - PAD_B
const MAXH = BASE - PAD_T

// Scores out of 100. Without the threat cue, both groups perform the same.
// With the cue, the stereotyped group drops sharply; the control is unaffected.
const SCORES = {
  off: { stereotyped: 78, control: 79 },
  on: { stereotyped: 61, control: 79 },
}

function Bar({ x, value, color, label }: { x: number; value: number; color: string; label: string }) {
  const h = (value / 100) * MAXH
  const bw = 70
  return (
    <g>
      <rect
        x={x}
        y={BASE - h}
        width={bw}
        height={h}
        rx="4"
        fill={color}
        style={{ transition: 'height 0.5s ease, y 0.5s ease' }}
      />
      <text x={x + bw / 2} y={BASE - h - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-ink)">
        {value}
      </text>
      <text x={x + bw / 2} y={BASE + 16} textAnchor="middle" fontSize="10" fill="var(--color-muted)">
        {label}
      </text>
    </g>
  )
}

export function StereotypeThreat() {
  const [threat, setThreat] = useState(false)
  const s = threat ? SCORES.on : SCORES.off
  const drop = SCORES.off.stereotyped - SCORES.on.stereotyped

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setThreat(false)}
          className={cn(
            'rounded-full border px-3 py-1 text-sm transition-colors',
            !threat ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          No cue
        </button>
        <button
          type="button"
          onClick={() => setThreat(true)}
          className={cn(
            'rounded-full border px-3 py-1 text-sm transition-colors',
            threat ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          Stereotype cue on
        </button>
      </div>

      <div className="mb-3 rounded-xl border border-border bg-surface-2 p-3 text-sm">
        <div className="mb-1 flex items-center gap-2 font-semibold text-ink">
          <Icon name={threat ? 'TriangleAlert' : 'CheckCircle2'} size={15} className={threat ? 'text-warn' : 'text-success'} />
          {threat ? 'Before the test:' : 'Neutral framing:'}
        </div>
        <p className="text-muted">
          {threat
            ? '"This is a diagnostic test of your ability." Test-takers are reminded — subtly — of a negative stereotype about their group.'
            : '"This is just a problem-solving exercise." No mention of ability, no stereotype primed.'}
        </p>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line x1="30" y1={BASE} x2={W - 14} y2={BASE} stroke="var(--color-border)" strokeWidth="1" />
        {[0, 50, 100].map((v) => (
          <text key={v} x="24" y={BASE - (v / 100) * MAXH + 3} textAnchor="end" fontSize="9" fill="var(--color-muted)">
            {v}
          </text>
        ))}
        <Bar x={70} value={s.stereotyped} color="var(--color-accent)" label="Stereotyped group" />
        <Bar x={180} value={s.control} color="var(--color-accent-2)" label="Control group" />
      </svg>

      <p className="mt-1 text-center text-sm text-muted">
        {threat ? (
          <>
            With the cue, the stereotyped group drops{' '}
            <span className="font-semibold text-warn">{drop} points</span> — same ability, worse score.
          </>
        ) : (
          <>Without the cue, both groups perform <span className="font-semibold text-success">equally</span>.</>
        )}
      </p>

      <p className="mt-3 text-center text-xs text-muted">
        The threat itself — not ability — caused the gap. Remove the cue and it vanishes. A warning about reading tests as fixed measures of worth.
      </p>
    </div>
  )
}
