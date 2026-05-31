import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { cn } from '#/lib/cn'

const RED = '#e17055'
const BLUE = '#0984e3'
const TURNS = [120, 137, 154, 171, 188, 205, 222, 239]

// Coil up a current-carrying wire and the circular fields of every turn line up
// into one strong field — a bar-magnet shape with a N and an S end. Now you have
// an electromagnet you can switch, strengthen, and reverse at will. Slip an iron
// core inside and the field jumps; flip the current and the poles swap.
export function Solenoid() {
  const [amps, setAmps] = useState(3)
  const [core, setCore] = useState(true)
  const [nRight, setNRight] = useState(true)

  const strength = Math.min(1, (amps / 5) * (core ? 1 : 0.55))
  const op = 0.2 + 0.6 * strength
  const sw = 1.2 + 2.4 * strength

  const nx = nRight ? 250 : 110 // N-pole end
  const sx = nRight ? 110 : 250 // S-pole end
  const arrowDir = nRight ? 1 : -1 // inside field points toward N

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        <button
          type="button"
          onClick={() => setCore((c) => !c)}
          className={cn(
            'rounded-full border px-3 py-1 text-sm transition-colors',
            core ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          {core ? 'iron core: in' : 'iron core: out'}
        </button>
        <button
          type="button"
          onClick={() => setNRight((n) => !n)}
          className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:text-ink"
        >
          reverse current
        </button>
      </div>

      <svg viewBox="0 0 360 240" className="w-full">
        {/* outside field loops (N → around → S) */}
        <path
          d={`M ${nx} 96 C ${nx + arrowDir * 70} 30, ${sx - arrowDir * 70} 30, ${sx} 96`}
          fill="none"
          stroke="var(--color-accent-2)"
          strokeWidth={sw}
          opacity={op}
        />
        <path
          d={`M ${nx} 144 C ${nx + arrowDir * 70} 210, ${sx - arrowDir * 70} 210, ${sx} 144`}
          fill="none"
          stroke="var(--color-accent-2)"
          strokeWidth={sw}
          opacity={op}
        />

        {/* iron core */}
        {core && <rect x="116" y="104" width="128" height="32" rx="3" fill="var(--color-muted)" opacity="0.35" />}

        {/* inside field arrows pointing toward N */}
        {[104, 120, 136].map((y) => (
          <g key={y} stroke="var(--color-accent-2)" strokeWidth={sw} opacity={op}>
            <line x1="120" y1={y} x2="240" y2={y} />
            <path
              d={
                arrowDir > 0
                  ? `M 232 ${y - 5} L 240 ${y} L 232 ${y + 5}`
                  : `M 128 ${y - 5} L 120 ${y} L 128 ${y + 5}`
              }
              fill="none"
            />
          </g>
        ))}

        {/* coil turns */}
        {TURNS.map((x) => (
          <ellipse key={x} cx={x} cy={120} rx="11" ry="36" fill="none" stroke="#b08968" strokeWidth="3" />
        ))}

        {/* pole labels */}
        <text x={sx === 110 ? 96 : 254} y="125" fill={BLUE} fontSize="18" fontWeight="700" textAnchor="middle">S</text>
        <text x={nx === 250 ? 254 : 96} y="125" fill={RED} fontSize="18" fontWeight="700" textAnchor="middle">N</text>

        {/* strength meter */}
        <text x="40" y="214" fill="var(--color-muted)" fontSize="12">field strength</text>
        <line x1="140" y1="210" x2="300" y2="210" stroke="var(--color-border)" strokeWidth="6" strokeLinecap="round" />
        <rect x="140" y="207" width={160 * strength} height="6" rx="3" fill="#d63031" />
      </svg>

      <div className="px-4 pb-4">
        <SceneSlider label="Current" value={amps} min={0} max={5} step={0.5} unit="A" onChange={setAmps} />
        <p className="mt-2 text-center text-xs text-muted">
          More current, more turns, and an iron core all strengthen the field — and unlike a bar magnet, you can switch it off.
        </p>
      </div>
    </div>
  )
}
