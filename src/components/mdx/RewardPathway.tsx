import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// The brain's dopamine REWARD CIRCUIT and the logic of TOLERANCE. Left: dopamine
// signals travel from the VTA to the nucleus accumbens and on to the prefrontal
// cortex (rAF dots flowing along the pathway). Right: a tolerance curve — drag
// the "uses" slider and watch the same dose produce a smaller and smaller
// response as the brain down-regulates, which drives people to escalate the dose.
const W = 360
const H = 260

// Three brain regions of the mesolimbic pathway, left-to-right.
const NODES = [
  { key: 'vta', label: 'VTA', sub: 'ventral tegmental area', x: 60, y: 170, color: '#FFB020' },
  { key: 'nac', label: 'NAcc', sub: 'nucleus accumbens', x: 175, y: 110, color: '#E056FD' },
  { key: 'pfc', label: 'PFC', sub: 'prefrontal cortex', x: 300, y: 60, color: '#00D2D3' },
] as const

// Two flowing segments: VTA -> NAcc -> PFC.
const SEGMENTS = [
  { a: NODES[0], b: NODES[1] },
  { a: NODES[1], b: NODES[2] },
]

const DOTS_PER_SEG = 4

// Tolerance curve: response = dose * effectiveness(uses). Effectiveness decays
// as the brain down-regulates dopamine receptors with repeated exposure.
function effectiveness(uses: number): number {
  return Math.exp(-uses / 9) // ~37% of original by ~9 uses
}

export function RewardPathway() {
  const [uses, setUses] = useState(0)
  const usesRef = useRef(uses)
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    usesRef.current = uses
  }, [uses])

  useEffect(() => {
    let raf = 0
    let last = 0
    let phase = 0

    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last) / 1000
      last = now
      // Flow speed drops as tolerance rises — fewer/dimmer signals get through.
      const eff = effectiveness(usesRef.current)
      phase = (phase + dt * (0.25 + eff * 0.45)) % 1

      let idx = 0
      for (const seg of SEGMENTS) {
        for (let d = 0; d < DOTS_PER_SEG; d++) {
          const t = (phase + d / DOTS_PER_SEG) % 1
          const x = seg.a.x + (seg.b.x - seg.a.x) * t
          const y = seg.a.y + (seg.b.y - seg.a.y) * t
          const el = dotRefs.current[idx]
          if (el) {
            el.setAttribute('cx', x.toFixed(1))
            el.setAttribute('cy', y.toFixed(1))
            el.setAttribute('opacity', (0.25 + eff * 0.75).toFixed(2))
          }
          idx++
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const eff = effectiveness(uses)
  const pct = Math.round(eff * 100)

  // Tolerance curve sample points for the mini-chart.
  const CHART_X0 = 40
  const CHART_Y0 = 230
  const CHART_W = 280
  const CHART_H = 70
  const MAX_USES = 20
  const curve = Array.from({ length: 41 }, (_, k) => {
    const u = (k / 40) * MAX_USES
    const x = CHART_X0 + (u / MAX_USES) * CHART_W
    const y = CHART_Y0 - effectiveness(u) * CHART_H
    return `${k === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')
  const markerX = CHART_X0 + (Math.min(uses, MAX_USES) / MAX_USES) * CHART_W
  const markerY = CHART_Y0 - eff * CHART_H

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* pathway lines */}
        {SEGMENTS.map((seg, k) => (
          <line
            key={k}
            x1={seg.a.x}
            y1={seg.a.y}
            x2={seg.b.x}
            y2={seg.b.y}
            stroke="var(--color-border)"
            strokeWidth={6}
            strokeLinecap="round"
          />
        ))}
        {/* flowing dopamine dots */}
        {Array.from({ length: SEGMENTS.length * DOTS_PER_SEG }).map((_, i) => (
          <circle key={i} ref={(el) => { dotRefs.current[i] = el }} r={4} fill="#FFB020" cx={-10} cy={-10} />
        ))}
        {/* region nodes */}
        {NODES.map((nd) => (
          <g key={nd.key}>
            <circle cx={nd.x} cy={nd.y} r={16} fill={nd.color} opacity={0.18} />
            <circle cx={nd.x} cy={nd.y} r={9} fill={nd.color} />
            <text x={nd.x} y={nd.y - 22} textAnchor="middle" fontSize="11" fontWeight="bold" fill="var(--color-ink)">
              {nd.label}
            </text>
            <text x={nd.x} y={nd.y + 26} textAnchor="middle" fontSize="8" fill="var(--color-muted)">
              {nd.sub}
            </text>
          </g>
        ))}

        {/* tolerance mini-chart */}
        <text x={CHART_X0} y={CHART_Y0 - CHART_H - 6} fontSize="9" fill="var(--color-muted)">
          response to same dose
        </text>
        <line x1={CHART_X0} y1={CHART_Y0} x2={CHART_X0 + CHART_W} y2={CHART_Y0} stroke="var(--color-border)" strokeWidth={1} />
        <line x1={CHART_X0} y1={CHART_Y0} x2={CHART_X0} y2={CHART_Y0 - CHART_H} stroke="var(--color-border)" strokeWidth={1} />
        <path d={curve} fill="none" stroke="#E056FD" strokeWidth={2.5} />
        <line x1={markerX.toFixed(1)} y1={CHART_Y0} x2={markerX.toFixed(1)} y2={markerY.toFixed(1)} stroke="var(--color-ink)" strokeWidth={1} strokeDasharray="2 2" />
        <circle cx={markerX.toFixed(1)} cy={markerY.toFixed(1)} r={4} fill="var(--color-ink)" />
        <text x={CHART_X0 + CHART_W} y={CHART_Y0 + 12} textAnchor="end" fontSize="8" fill="var(--color-muted)">
          repeated uses →
        </text>
      </svg>

      <div className="mt-2">
        <SceneSlider label="Repeated uses" value={uses} min={0} max={20} step={1} unit="" onChange={setUses} />
      </div>

      <p className="mt-2 text-sm leading-relaxed text-muted">
        Dopamine surges from the <span className="font-medium" style={{ color: '#FFB020' }}>VTA</span> to the{' '}
        <span className="font-medium" style={{ color: '#E056FD' }}>nucleus accumbens</span> and{' '}
        <span className="font-medium" style={{ color: '#00D2D3' }}>prefrontal cortex</span> — the circuit that tags things as
        rewarding. {uses === 0 ? (
          <>At first, a dose produces a <span className="font-medium text-ink">full {pct}%</span> response.</>
        ) : (
          <>
            After {uses} use{uses === 1 ? '' : 's'} the brain down-regulates, so the same dose now yields only{' '}
            <span className="font-medium text-ink">{pct}%</span> — <span className="font-medium text-ink">tolerance</span>. To
            chase the original feeling, people escalate the dose, the road toward <span className="font-medium text-ink">dependence and addiction</span>.
          </>
        )}
      </p>
    </div>
  )
}
