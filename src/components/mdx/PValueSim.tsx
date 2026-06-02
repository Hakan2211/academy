import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { gaussian, normalCdf } from '#/lib/psych'

// The logic of a p-value, drawn. The bell is the sampling distribution of
// results we would expect if nothing were really going on (the null hypothesis):
// most results land near zero just from chance. Slide the observed result; the
// tail beyond it shades, and its area is the p-value — the probability of a
// result this extreme (or more) by luck alone. Cross into the far tail (p < .05)
// and the result is flagged statistically significant. Uses the gaussian /
// normalCdf helpers. Used in inferential-statistics.

const W = 360
const H = 220
const PAD_X = 18
const PAD_B = 34
const TOP = 16
const LO = -4
const HI = 4

export function PValueSim() {
  const [obs, setObs] = useState(2.2)

  const xOf = (v: number) => PAD_X + ((v - LO) / (HI - LO)) * (W - 2 * PAD_X)
  const peak = gaussian(0, 0, 1)
  const yOf = (v: number) => TOP + (1 - gaussian(v, 0, 1) / peak) * (H - TOP - PAD_B)
  const baseline = H - PAD_B

  const N = 120
  const pts: Array<[number, number]> = []
  for (let k = 0; k <= N; k++) {
    const v = LO + ((HI - LO) * k) / N
    pts.push([xOf(v), yOf(v)])
  }
  const curve = pts.map((p, k) => `${k ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')

  // Two-tailed p-value: area beyond +|obs| and below -|obs|.
  const sx = xOf(obs)
  const tailPts = pts.filter((p) => p[0] >= sx)
  const tail =
    tailPts.length > 1
      ? `M${sx.toFixed(1)} ${baseline} ` +
        tailPts.map((p) => `L${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ') +
        ` L${xOf(HI).toFixed(1)} ${baseline} Z`
      : ''

  const p = 2 * (1 - normalCdf(Math.abs(obs)))
  const sig = p < 0.05

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[-1.96, 1.96].map((c) => (
          <line key={c} x1={xOf(c)} y1={TOP} x2={xOf(c)} y2={baseline} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 3" />
        ))}
        <line x1={xOf(0)} y1={TOP} x2={xOf(0)} y2={baseline} stroke="var(--color-border)" strokeWidth="1.5" />
        <text x={xOf(0)} y={H - 16} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
          no effect
        </text>

        {tail && <path d={tail} fill="var(--color-accent)" opacity={0.3} />}
        <path d={curve} fill="none" stroke="var(--color-accent-2)" strokeWidth="2.5" />

        {/* observed-result marker */}
        <line x1={sx} y1={TOP} x2={sx} y2={baseline} stroke="var(--color-accent)" strokeWidth="2" />
        <circle cx={sx} cy={yOf(obs)} r="5" fill="var(--color-accent)" />
        <text x={sx} y={TOP - 4} textAnchor="middle" fontSize="9" fill="var(--color-accent)">
          observed
        </text>
      </svg>

      <div className="px-1 pt-1">
        <SceneSlider label="observed result (in SDs from no-effect)" value={obs} min={0} max={4} step={0.1} unit="SD" onChange={setObs} />
        <p className="mt-2 text-center text-sm">
          p = <span className="font-mono font-bold text-accent">{p < 0.001 ? '<0.001' : p.toFixed(3)}</span>{' '}
          <span className="text-muted">— chance of a result this extreme if there were truly no effect.</span>
        </p>
        <p className="mt-1 text-center text-sm font-semibold" style={{ color: sig ? 'var(--color-success)' : 'var(--color-muted)' }}>
          {sig ? 'p < .05 → statistically significant: unlikely to be mere chance.' : 'p ≥ .05 → not significant: easily explained by chance alone.'}
        </p>
      </div>
    </div>
  )
}
