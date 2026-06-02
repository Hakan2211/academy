import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// The diathesis-stress model: a disorder appears only when a person's
// underlying VULNERABILITY (diathesis — genes, temperament, early experience)
// combines with enough life STRESS to cross a threshold. Two people with the
// same stress can fare completely differently because their vulnerabilities
// differ — and high vulnerability stays dormant if life is calm. Slide both
// and watch the combined load cross (or stay below) the onset line.
const W = 360
const H = 170
const LEFT = 40
const RIGHT = W - 16
const BASE = H - 26
const TOP = 18
const THRESHOLD = 11 // combined load (0..20) at which onset occurs

const toBarH = (v: number) => (v / 20) * (BASE - TOP)

export function DiathesisStress() {
  const [diathesis, setDiathesis] = useState(4)
  const [stress, setStress] = useState(3)

  const load = diathesis + stress
  const onset = load >= THRESHOLD
  const thY = BASE - toBarH(THRESHOLD)

  const diaH = toBarH(diathesis)
  const strH = toBarH(stress)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* baseline */}
        <line x1={LEFT - 6} y1={BASE} x2={RIGHT} y2={BASE} stroke="var(--color-muted)" strokeWidth="1.5" />

        {/* threshold line */}
        <line x1={LEFT - 6} y1={thY} x2={RIGHT} y2={thY} stroke="var(--color-danger)" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x={RIGHT} y={thY - 5} textAnchor="end" fontSize="9" fill="var(--color-danger)">onset threshold</text>

        {/* stacked bar: diathesis (bottom) + stress (top) */}
        <g>
          <rect x={W / 2 - 38} y={BASE - diaH} width={76} height={diaH} rx={4} fill="var(--color-accent)" opacity="0.85" />
          <rect x={W / 2 - 38} y={BASE - diaH - strH} width={76} height={strH} rx={4} fill="var(--color-warn)" opacity="0.85" />
          {/* total marker */}
          <line
            x1={W / 2 - 46}
            y1={BASE - diaH - strH}
            x2={W / 2 + 46}
            y2={BASE - diaH - strH}
            stroke={onset ? 'var(--color-danger)' : 'var(--color-ink)'}
            strokeWidth="2"
          />
        </g>

        {/* legend */}
        <g fontSize="9">
          <rect x={LEFT} y={TOP} width={10} height={10} rx={2} fill="var(--color-warn)" />
          <text x={LEFT + 14} y={TOP + 9} fill="var(--color-muted)">life stress</text>
          <rect x={LEFT} y={TOP + 16} width={10} height={10} rx={2} fill="var(--color-accent)" />
          <text x={LEFT + 14} y={TOP + 25} fill="var(--color-muted)">vulnerability</text>
        </g>
      </svg>

      <div className="grid gap-2 sm:grid-cols-2">
        <SceneSlider label="Vulnerability (diathesis)" value={diathesis} min={0} max={10} step={1} unit="" onChange={setDiathesis} />
        <SceneSlider label="Life stress" value={stress} min={0} max={10} step={1} unit="" onChange={setStress} />
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 p-3">
        {onset ? (
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-danger)' }}>
            <span className="font-semibold">Combined load crosses the threshold.</span> The vulnerability and the stress together are enough to tip into a disorder. Note: it took <span className="font-semibold">both</span> — neither alone had to be extreme.
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-success">
            <span className="font-semibold">Below the threshold — no onset.</span> Even a real vulnerability can stay dormant when life is calm, and ordinary stress is harmless for someone with little vulnerability.
          </p>
        )}
        <p className="mt-1 text-xs text-muted">
          This is why the same stressful event can break one person and barely touch another: a high diathesis lowers the stress it takes to cross the line.
        </p>
      </div>
    </div>
  )
}
