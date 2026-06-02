import { clamp } from '#/lib/psych'

// A reusable five-axis radar (spider) chart for the Big Five trait scores. Each
// score is 0-100; the polygon plots them on five spokes. Used as the chart
// inside BigFive, and standalone to illustrate a sample profile.

const AXES = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'] as const

export type FiveScores = {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

const CX = 130
const CY = 122
const R = 92

// Angle for axis i, starting straight up and going clockwise.
function angle(i: number): number {
  return -Math.PI / 2 + (i * 2 * Math.PI) / 5
}

function point(i: number, frac: number): [number, number] {
  const a = angle(i)
  const r = R * clamp(frac, 0, 1)
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
}

export function BigFiveRadar({ scores, color = 'var(--color-accent)' }: { scores: FiveScores; color?: string }) {
  const values = [scores.openness, scores.conscientiousness, scores.extraversion, scores.agreeableness, scores.neuroticism]
  const poly = values.map((v, i) => point(i, v / 100).map((n) => n.toFixed(1)).join(',')).join(' ')

  return (
    <svg viewBox="0 0 260 250" className="mx-auto block w-full max-w-[300px]">
      {/* concentric grid rings */}
      {[0.25, 0.5, 0.75, 1].map((ring) => (
        <polygon
          key={ring}
          points={AXES.map((_, i) => point(i, ring).map((n) => n.toFixed(1)).join(',')).join(' ')}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
      ))}
      {/* spokes + labels */}
      {AXES.map((label, i) => {
        const [ex, ey] = point(i, 1)
        const [lx, ly] = point(i, 1.18)
        const anchor = lx < CX - 4 ? 'end' : lx > CX + 4 ? 'start' : 'middle'
        return (
          <g key={label}>
            <line x1={CX} y1={CY} x2={ex} y2={ey} stroke="var(--color-border)" strokeWidth="1" />
            <text x={lx} y={ly} textAnchor={anchor} fontSize="9" fill="var(--color-muted)">
              {label.slice(0, 4)}.
            </text>
          </g>
        )
      })}
      {/* the profile polygon */}
      <polygon points={poly} fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
      {values.map((v, i) => {
        const [px, py] = point(i, v / 100)
        return <circle key={i} cx={px} cy={py} r="3" fill={color} />
      })}
    </svg>
  )
}
