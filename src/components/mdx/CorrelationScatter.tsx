import { useMemo, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp, gaussianSample, rng } from '#/lib/psych'

// A slider sets the correlation r from -1 to +1; the point cloud rebuilds to
// match. Scatter is deterministic (seeded rng + Box-Muller) so it never shifts
// between server and client, and it recomputes whenever r changes. A caption
// names the strength and reminds you that even a strong r is not causation —
// with the ice-cream-and-drowning example, where hot weather drives both.
// Used in correlation.

const W = 340
const H = 250
const PAD = 26
const N = 40

export function CorrelationScatter() {
  const [r, setR] = useState(0.6)

  // Deterministic bivariate-normal scatter for the chosen r. Recompute on r.
  const pts = useMemo(() => {
    const next = rng(20240601)
    const out: Array<{ x: number; y: number }> = []
    for (let i = 0; i < N; i++) {
      const z1 = gaussianSample(next)
      const z2 = gaussianSample(next)
      // y correlated with x at coefficient r: y = r*x + sqrt(1-r^2)*indep
      const y = r * z1 + Math.sqrt(Math.max(0, 1 - r * r)) * z2
      out.push({ x: z1, y })
    }
    return out
  }, [r])

  // Map standardized values (roughly [-3,3]) into the plot box.
  const px = (z: number) => PAD + ((clamp(z, -3, 3) + 3) / 6) * (W - 2 * PAD)
  const py = (z: number) => H - PAD - ((clamp(z, -3, 3) + 3) / 6) * (H - 2 * PAD)

  const strength =
    Math.abs(r) < 0.15
      ? 'no relationship'
      : Math.abs(r) < 0.45
        ? 'weak'
        : Math.abs(r) < 0.75
          ? 'moderate'
          : 'strong'
  const dir = r > 0.05 ? 'positive' : r < -0.05 ? 'negative' : ''

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--color-muted)" strokeWidth="1.2" />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="var(--color-muted)" strokeWidth="1.2" />
        <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="10" fill="var(--color-muted)">
          variable X
        </text>
        <text x={12} y={H / 2} textAnchor="middle" fontSize="10" fill="var(--color-muted)" transform={`rotate(-90 12 ${H / 2})`}>
          variable Y
        </text>

        {/* line of best fit (slope = r in standardized space) */}
        {Math.abs(r) >= 0.15 && (
          <line
            x1={px(-3)}
            y1={py(r * -3)}
            x2={px(3)}
            y2={py(r * 3)}
            stroke="var(--color-accent-2)"
            strokeWidth="2"
            strokeDasharray="5 4"
          />
        )}

        {pts.map((p, i) => (
          <circle key={i} cx={px(p.x)} cy={py(p.y)} r="3.6" fill="var(--color-accent)" stroke="#fff" strokeWidth="0.7" opacity="0.9" />
        ))}
      </svg>

      <div className="px-1">
        <SceneSlider label="correlation r" value={r} min={-1} max={1} step={0.1} unit="" onChange={setR} />
      </div>

      <p className="mt-2 text-center text-sm">
        r = <span className="font-mono font-bold text-accent">{r.toFixed(1)}</span>
        <span className="text-muted">
          {' '}
          — {strength}
          {dir ? ` ${dir}` : ''} {Math.abs(r) >= 0.15 ? 'relationship' : ''}
        </span>
      </p>

      <div className="mt-3 rounded-xl bg-surface-2 p-3 text-sm leading-snug text-muted">
        <span className="font-semibold text-ink">Correlation ≠ causation.</span> Ice-cream sales and drownings rise together
        (a strong positive r) — yet neither causes the other. A hidden <span className="font-semibold text-ink">third variable</span>,
        hot weather, drives both. A high r tells you two things move together, never <em>why</em>.
      </div>
    </div>
  )
}
