import { useMemo, useState } from 'react'
import { rng } from '#/lib/psych'
import { cn } from '#/lib/cn'

// The four basic schedules of reinforcement, drawn as cumulative records — the
// classic Skinner-box trace where the pen steps up with every response and a
// little tick marks each delivered reinforcer. The SHAPE of the line is the
// signature of each schedule:
//   FR — fast, with a post-reinforcement pause (the staircase).
//   VR — steady, very high rate, no pausing (slot-machine behaviour).
//   FI — the "scallop": slow after reward, accelerating toward the deadline.
//   VI — slow, steady, plodding.
// We simulate one fixed run per schedule with a seeded RNG (identical on server
// and client — no Math.random in render).

type Sched = 'FR' | 'VR' | 'FI' | 'VI'

const META: Record<Sched, { name: string; tagline: string; rate: string }> = {
  FR: { name: 'Fixed Ratio (FR-10)', tagline: 'Reward after every 10th response. Burst of work, then a brief pause after each payoff — the staircase.', rate: 'high, bursty' },
  VR: { name: 'Variable Ratio (VR-10)', tagline: 'Reward after an unpredictable number of responses (10 on average). Steady, relentless, pause-free — why slot machines hook us.', rate: 'highest, steady' },
  FI: { name: 'Fixed Interval (FI-30s)', tagline: 'First response after a fixed time is rewarded. Almost nothing happens, then a rush toward the deadline — the scallop.', rate: 'low, scalloped' },
  VI: { name: 'Variable Interval (VI-30s)', tagline: 'Reward for the first response after an unpredictable time. Slow, even, and plodding — like checking for email.', rate: 'low, steady' },
}

// plot geometry
const GX0 = 40
const GX1 = 430
const GY_TOP = 16
const GY_BASE = 168
const STEPS = 120 // simulated time slices

type Run = { resp: Array<number>; rewards: Array<number> }

// Simulate cumulative responses + reward indices over STEPS time-slices.
function simulate(sched: Sched): Run {
  const next = rng(sched.charCodeAt(0) * 101 + 7)
  const resp: Array<number> = [0]
  const rewards: Array<number> = []
  let total = 0
  let sinceReward = 0 // responses since last reward (ratio) or time since (interval)
  let threshold = sched === 'VR' ? Math.round(6 + next() * 8) : 10
  let timer = 0
  let interval = sched === 'VI' ? Math.round(6 + next() * 14) : 12

  for (let t = 1; t <= STEPS; t++) {
    if (sched === 'FR' || sched === 'VR') {
      // ratio: respond at a high baseline rate; pause briefly right after a reward (FR only)
      const pausing = sched === 'FR' && sinceReward < 2 && rewards.length > 0
      const rps = pausing ? 0.1 : 0.9 + next() * 0.4
      const presses = Math.round(rps)
      total += presses
      sinceReward += presses
      if (sinceReward >= threshold) {
        rewards.push(t)
        sinceReward = 0
        if (sched === 'VR') threshold = Math.round(6 + next() * 8)
      }
    } else {
      // interval: responding accelerates as the deadline nears (FI scallop); VI is flat
      timer++
      const frac = sched === 'FI' ? Math.min(1, timer / interval) : 0.45
      const rps = sched === 'FI' ? 0.1 + frac * frac * 1.0 : 0.42 + next() * 0.2
      total += rps
      if (timer >= interval) {
        rewards.push(t)
        timer = 0
        if (sched === 'VI') interval = Math.round(6 + next() * 14)
      }
    }
    resp.push(total)
  }
  return { resp, rewards }
}

export function ReinforcementSchedules() {
  const [sched, setSched] = useState<Sched>('VR')

  // simulate all four once (memoized, deterministic) so we can scale to a common max
  const runs = useMemo(() => {
    const all = {} as Record<Sched, Run>
    ;(['FR', 'VR', 'FI', 'VI'] as Array<Sched>).forEach((s) => { all[s] = simulate(s) })
    return all
  }, [])

  const maxResp = useMemo(() => {
    let m = 1
    ;(Object.keys(runs) as Array<Sched>).forEach((s) => {
      m = Math.max(m, runs[s].resp[runs[s].resp.length - 1])
    })
    return m
  }, [runs])

  const run = runs[sched]
  const tx = (t: number) => GX0 + (t / STEPS) * (GX1 - GX0)
  const ty = (r: number) => GY_BASE - (r / maxResp) * (GY_BASE - GY_TOP)

  const path = run.resp.map((r, t) => `${t === 0 ? 'M' : 'L'}${tx(t).toFixed(1)},${ty(r).toFixed(1)}`).join(' ')

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {(['FR', 'VR', 'FI', 'VI'] as Array<Sched>).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSched(s)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              sched === s ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 460 196" className="w-full">
        {/* axes */}
        <line x1={GX0} y1={GY_TOP} x2={GX0} y2={GY_BASE} stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1={GX0} y1={GY_BASE} x2={GX1 + 6} y2={GY_BASE} stroke="var(--color-border)" strokeWidth="1.5" />
        <text x="14" y={(GY_TOP + GY_BASE) / 2} fill="var(--color-muted)" fontSize="9" textAnchor="middle" transform={`rotate(-90 14 ${(GY_TOP + GY_BASE) / 2})`}>cumulative responses</text>
        <text x={(GX0 + GX1) / 2} y={GY_BASE + 18} fill="var(--color-muted)" fontSize="9" textAnchor="middle">time →</text>

        {/* the cumulative record */}
        <path d={path} fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="round" />

        {/* reinforcer ticks (little diagonal marks on the curve) */}
        {run.rewards.map((t, i) => {
          const x = tx(t)
          const y = ty(run.resp[t])
          return <line key={i} x1={x - 4} y1={y + 5} x2={x + 4} y2={y - 5} stroke="var(--color-success)" strokeWidth="1.6" />
        })}
      </svg>

      <div className="px-4 pb-1">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ background: 'var(--color-accent)' }} /> response curve
          <span className="ml-3 inline-block h-3 w-3 -rotate-45 rounded-[1px]" style={{ background: 'var(--color-success)' }} /> reinforcer delivered
        </div>
      </div>

      <p className="px-4 pb-1 pt-3 text-sm font-semibold text-ink">{META[sched].name}</p>
      <p className="px-4 pb-4 text-sm leading-snug text-muted">{META[sched].tagline}</p>
    </div>
  )
}
