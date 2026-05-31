import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const EX = 120
const EY = 140
const ORB = 84
const LIT = '#f5f3ff'
const DARK = '#2d2d44'
const SUN = '#fdcb6e'

// phase name + illuminated fraction from the Moon's orbital angle α (0 = new)
function phaseName(a: number) {
  if (a < 12 || a > 348) return 'New Moon'
  if (a < 78) return 'Waxing Crescent'
  if (a < 102) return 'First Quarter'
  if (a < 168) return 'Waxing Gibbous'
  if (a < 192) return 'Full Moon'
  if (a < 258) return 'Waning Gibbous'
  if (a < 282) return 'Third Quarter'
  return 'Waning Crescent'
}

// build the lit-region path for a phase disk
function litPath(cx: number, cy: number, r: number, f: number, waxing: boolean) {
  const tx = r * Math.cos(Math.PI * f) // terminator semi-width: r (new) .. 0 .. -r (full)
  const rx = Math.abs(tx)
  if (waxing) {
    return `M ${cx},${cy - r} A ${r},${r} 0 0 1 ${cx},${cy + r} A ${rx},${r} 0 0 ${tx > 0 ? 0 : 1} ${cx},${cy - r} Z`
  }
  return `M ${cx},${cy - r} A ${r},${r} 0 0 0 ${cx},${cy + r} A ${rx},${r} 0 0 ${tx > 0 ? 1 : 0} ${cx},${cy - r} Z`
}

// The Moon doesn't make its own light — we see the half the Sun lights up, from a
// shifting angle as it orbits Earth. That changing view is the cycle of phases.
// When the three line up, we get eclipses: a New-Moon Sun eclipse, a Full-Moon
// lunar eclipse. Drag the Moon around its orbit and watch the phase we'd see.
export function MoonPhases() {
  const [alpha, setAlpha] = useState(90) // 0 = new moon
  const pa = ((180 - alpha) * Math.PI) / 180 // position angle (sun at left)
  const mx = EX + ORB * Math.cos(pa)
  const my = EY - ORB * Math.sin(pa)
  const f = (1 - Math.cos((alpha * Math.PI) / 180)) / 2 // illuminated fraction
  const waxing = alpha < 180
  const eclipse = alpha < 8 || alpha > 352 ? 'A New Moon here can bring a solar eclipse.' : Math.abs(alpha - 180) < 8 ? 'A Full Moon here can bring a lunar eclipse.' : ''

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 400 280" className="w-full">
        {/* sunlight from the left */}
        {[70, 140, 210].map((y) => (
          <g key={y}>
            <line x1="6" y1={y} x2="58" y2={y} stroke={SUN} strokeWidth="2" />
            <path d={`M 58 ${y} l -8 -4 l 0 8 z`} fill={SUN} />
          </g>
        ))}
        <text x="30" y="250" fill={SUN} fontSize="10" textAnchor="middle">sunlight</text>

        {/* orbit */}
        <circle cx={EX} cy={EY} r={ORB} fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 4" />
        {/* Earth */}
        <circle cx={EX} cy={EY} r="16" fill="#0984e3" />
        <path d={`M ${EX},${EY - 16} A 16,16 0 0 0 ${EX},${EY + 16} Z`} fill={DARK} opacity="0.45" />
        <text x={EX} y={EY + 34} fill="var(--color-muted)" fontSize="10" textAnchor="middle">Earth</text>

        {/* Moon: lit half faces the Sun (left) */}
        <circle cx={mx} cy={my} r="10" fill={DARK} />
        <path d={`M ${mx},${my - 10} A 10,10 0 0 0 ${mx},${my + 10} Z`} fill={LIT} />
        <line x1={EX} y1={EY} x2={mx} y2={my} stroke="var(--color-border)" strokeWidth="0.75" strokeDasharray="2 2" />

        {/* phase as seen from Earth */}
        <text x="320" y="44" fill="var(--color-muted)" fontSize="11" textAnchor="middle">as seen from Earth</text>
        <circle cx="320" cy="130" r="46" fill={DARK} />
        <path d={litPath(320, 130, 46, f, waxing)} fill={LIT} />
        <text x="320" y="206" fill="var(--color-ink)" fontSize="13" fontWeight="700" textAnchor="middle">{phaseName(alpha)}</text>
        <text x="320" y="224" fill="var(--color-muted)" fontSize="10" textAnchor="middle">{Math.round(f * 100)}% lit</text>
      </svg>

      <div className="px-4 pt-2">
        <SceneSlider label="Moon in orbit (0 = new)" value={alpha} min={0} max={360} step={5} unit="°" onChange={setAlpha} />
        <p className="mt-2 pb-4 text-center text-xs text-muted">
          {eclipse || 'Same Moon, same lit half — only our viewing angle changes. The lit side always faces the Sun.'}
        </p>
      </div>
    </div>
  )
}
