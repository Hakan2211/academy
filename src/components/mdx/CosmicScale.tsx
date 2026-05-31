import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

type Tier = { max: number; name: string; desc: string; color: string; dots: number }
// `max` = upper bound of log10(size in metres) for this tier
const TIERS: Array<Tier> = [
  { max: 2, name: 'You', desc: 'A human being — about a metre tall.', color: '#fab1a0', dots: 1 },
  { max: 5, name: 'Cities & Mountains', desc: 'The scale of landscapes, from streets to peaks.', color: '#55efc4', dots: 3 },
  { max: 7, name: 'Planet Earth', desc: 'Our whole world, ~12,700 km across.', color: '#0984e3', dots: 1 },
  { max: 9, name: 'The Earth–Moon System', desc: 'The Moon orbits ~384,000 km away.', color: '#74b9ff', dots: 2 },
  { max: 13, name: 'The Solar System', desc: 'The Sun and its planets, measured in AU.', color: '#fdcb6e', dots: 6 },
  { max: 17, name: 'The Nearest Stars', desc: 'Neighbouring suns, a few light-years off.', color: '#ffeaa7', dots: 5 },
  { max: 21, name: 'The Milky Way', desc: 'Our galaxy — ~100,000 light-years of stars.', color: '#a29bfe', dots: 40 },
  { max: 23, name: 'The Local Group', desc: 'The Milky Way, Andromeda & dozens of galaxies.', color: '#6c5ce7', dots: 8 },
  { max: 25, name: 'The Cosmic Web', desc: 'Superclusters strung along vast filaments.', color: '#e056fd', dots: 60 },
  { max: 28, name: 'The Observable Universe', desc: 'Everything we can see — ~93 billion ly across.', color: '#636e72', dots: 90 },
]

function fmt(exp: number) {
  const v = Math.pow(10, exp)
  if (exp < 3) return `${v.toPrecision(2)} m`
  if (exp < 11) return `${(v / 1000).toExponential(1)} km`
  if (exp < 16) return `${(v / 1.496e11).toPrecision(2)} AU`
  const ly = v / 9.461e15
  if (ly < 1e6) return `${ly.toPrecision(2)} light-years`
  if (ly < 1e9) return `${(ly / 1e6).toPrecision(2)} million ly`
  return `${(ly / 1e9).toPrecision(2)} billion ly`
}

// deterministic scatter so the motif is stable per tier (no Math.random in render)
function scatter(n: number, seed: number) {
  const out: Array<{ x: number; y: number; r: number }> = []
  for (let i = 0; i < n; i++) {
    const a = (i * 2.39996 + seed)
    const rad = 12 + ((i * 37) % 70)
    out.push({ x: 200 + rad * Math.cos(a), y: 95 + rad * 0.62 * Math.sin(a), r: 1 + ((i * 13) % 3) })
  }
  return out
}

// The universe spans an almost unthinkable range of sizes. Slide from the scale of
// your own body out to the entire observable cosmos — each step a factor of ten —
// and watch what dominates: people, planets, stars, galaxies, the cosmic web.
export function CosmicScale() {
  const [exp, setExp] = useState(7)
  const tier = TIERS.find((t) => exp < t.max) ?? TIERS[TIERS.length - 1]
  const showDots = tier.dots > 1
  const dots = showDots ? scatter(tier.dots, tier.max) : []

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 400 190" className="w-full">
        {showDots ? (
          dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={tier.color} opacity="0.85" />)
        ) : (
          <>
            <circle cx="200" cy="95" r="46" fill={tier.color} />
            <circle cx="200" cy="95" r="46" fill="none" stroke={tier.color} strokeWidth="10" opacity="0.2" />
          </>
        )}
        <text x="200" y="168" fill="var(--color-ink)" fontSize="16" fontWeight="700" textAnchor="middle">{tier.name}</text>
      </svg>

      <div className="px-4 pt-1">
        <div className="mb-1 text-center text-sm text-muted">{tier.desc}</div>
        <SceneSlider label={`Scale ≈ ${fmt(exp)}`} value={exp} min={0} max={27} step={1} unit="" onChange={setExp} />
        <p className="mt-2 pb-4 text-center text-xs text-muted">
          Each notch multiplies the size by ten. It takes only ~27 of those steps to go from a person to the edge of the observable universe.
        </p>
      </div>
    </div>
  )
}
