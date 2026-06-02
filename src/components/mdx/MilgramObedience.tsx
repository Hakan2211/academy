import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { SceneSlider } from '#/components/three/SceneSlider'

// Milgram's obedience experiment, rebuilt as a shock-generator dial. The learner
// raises the voltage from 15V toward 450V; at each switch the lab-coated
// experimenter prods them onward ("The experiment requires that you continue"),
// and a live curve shows what fraction of Milgram's 40 participants were STILL
// obeying at that voltage. The shocking finding: 65% went all the way to 450V,
// labelled "XXX", despite the learner's (staged) screams. Tasteful — no gore,
// just the numbers and the moral weight. Used in obedience.

const W = 360
const H = 150
const PAD_L = 34
const PAD_R = 14
const PAD_T = 12
const PAD_B = 26
const MAXV = 450

// Switches in 15V steps, 15..450 (30 switches).
const STEPS = Array.from({ length: 30 }, (_, i) => 15 * (i + 1))

// Documented obedience: every one of Milgram's 40 obeyed to 300V; defiance began
// there, and 65% (26/40) continued to the final 450V switch. Percent still
// obeying at each voltage, roughly tracing his published data.
function stillObeying(v: number): number {
  if (v <= 300) return 100
  if (v >= 450) return 65
  // 300V -> 100%, 315V -> ~88%, falling to 65% by 375V then flat.
  if (v <= 375) return Math.round(100 - ((v - 300) / 75) * 35)
  return 65
}

// The experimenter's four scripted prods, escalating.
const PRODS = [
  'Please continue.',
  'The experiment requires that you continue.',
  'It is absolutely essential that you continue.',
  'You have no other choice; you must go on.',
]

function label(v: number): string {
  if (v >= 435) return 'XXX — Danger: Severe Shock'
  if (v >= 375) return 'Danger: Severe Shock'
  if (v >= 255) return 'Intense Shock'
  if (v >= 135) return 'Strong Shock'
  return 'Slight Shock'
}

export function MilgramObedience() {
  const [v, setV] = useState(15)

  const xOf = (volt: number) => PAD_L + (volt / MAXV) * (W - PAD_L - PAD_R)
  const yOf = (pct: number) => PAD_T + (1 - pct / 100) * (H - PAD_T - PAD_B)
  const curve = STEPS.map((s, i) => `${i ? 'L' : 'M'}${xOf(s).toFixed(1)} ${yOf(stillObeying(s)).toFixed(1)}`).join(' ')

  const pct = stillObeying(v)
  // Snap the slider value to the nearest 15V switch.
  const snap = (raw: number) => setV(Math.round(raw / 15) * 15 || 15)
  const prodIdx = v <= 150 ? 0 : v <= 270 ? 1 : v <= 375 ? 2 : 3
  const atMax = v >= MAXV

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs uppercase tracking-wide text-muted">Shock generator</span>
        <span className="font-mono text-lg font-bold" style={{ color: v >= 375 ? '#E74C3C' : 'var(--color-accent)' }}>
          {v} V
        </span>
      </div>
      <p className="px-1 text-xs font-semibold" style={{ color: v >= 375 ? '#E74C3C' : 'var(--color-muted)' }}>
        {label(v)}
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full">
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke="var(--color-border)" strokeWidth="1.5" />
        {[0, 50, 100].map((p) => (
          <text key={p} x={PAD_L - 4} y={yOf(p) + 3} textAnchor="end" fontSize="8" fill="var(--color-muted)">
            {p}
          </text>
        ))}
        <text x={12} y={H / 2} textAnchor="middle" fontSize="8" fill="var(--color-muted)" transform={`rotate(-90 12 ${H / 2})`}>
          % still obeying
        </text>
        {/* danger threshold */}
        <line x1={xOf(375)} y1={PAD_T} x2={xOf(375)} y2={H - PAD_B} stroke="#E74C3C" strokeWidth="1" strokeDasharray="3 3" />
        <path d={curve} fill="none" stroke="var(--color-accent-2)" strokeWidth="2.5" />
        {/* current marker */}
        <line x1={xOf(v)} y1={PAD_T} x2={xOf(v)} y2={H - PAD_B} stroke="var(--color-accent)" strokeWidth="1.5" />
        <circle cx={xOf(v)} cy={yOf(pct)} r="5" fill="var(--color-accent)" />
        <text x={(PAD_L + W - PAD_R) / 2} y={H - 6} textAnchor="middle" fontSize="8" fill="var(--color-muted)">
          Voltage (15V → 450V) →
        </text>
      </svg>

      <div className="px-1 pt-1">
        <SceneSlider label="Turn the dial" value={v} min={15} max={450} step={15} unit="V" onChange={snap} />
      </div>

      <div className="mt-2 flex items-start gap-2 rounded-xl bg-surface-2 p-3">
        <span className="mt-0.5 shrink-0 text-muted">
          <Icon name="UserCog" size={16} />
        </span>
        <div>
          <p className="text-sm italic text-ink">&ldquo;{PRODS[prodIdx]}&rdquo;</p>
          <p className="mt-1 text-xs text-muted">— the experimenter, in a grey lab coat, not raising his voice</p>
        </div>
      </div>

      <p className="mt-2 px-1 text-sm leading-snug text-muted">
        At <span className="font-semibold text-accent">{v} V</span>,{' '}
        <span className="font-semibold text-ink">{pct}%</span> of Milgram&apos;s participants were still obeying.{' '}
        {atMax ? (
          <span className="text-[#E74C3C]">
            65% delivered the maximum 450-volt shock — to a screaming stranger — simply because a calm authority told them to.
          </span>
        ) : (
          'Every single participant obeyed to 300 V before anyone refused.'
        )}
      </p>
    </div>
  )
}
