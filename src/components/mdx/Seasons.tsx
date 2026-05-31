import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const SX = 200
const SY = 140
const RX = 140
const RY = 92
const TILT = (23.5 * Math.PI) / 180
const SUN = '#fdcb6e'

// The seasons aren't caused by the Earth moving closer to or farther from the Sun
// — they come from its 23.5° axial tilt, which stays pointed the same way in space
// all year. When your hemisphere leans toward the Sun, its light strikes more
// directly and the days are long: summer. Six months later it leans away: winter.
export function Seasons() {
  const [deg, setDeg] = useState(180)
  const th = (deg * Math.PI) / 180
  const ex = SX + RX * Math.cos(th)
  const ey = SY + RY * Math.sin(th)

  // axis leans toward +x in space (fixed direction); north end up-right
  const ax = Math.sin(TILT)
  const ay = -Math.cos(TILT)
  const R = 18

  // northern-hemisphere season from orbital position
  const sv = -Math.cos(th) // +1 at deg=180 (N summer), -1 at deg=0 (N winter)
  let north = 'Spring'
  let month = 'Mar'
  if (sv > 0.5) { north = 'Summer'; month = 'Jun' }
  else if (sv < -0.5) { north = 'Winter'; month = 'Dec' }
  else if (Math.sin(th) > 0) { north = 'Autumn'; month = 'Sep' }
  const south = { Summer: 'Winter', Winter: 'Summer', Spring: 'Autumn', Autumn: 'Spring' }[north]

  const markers: Array<[number, string]> = [[0, 'Dec'], [90, 'Sep'], [180, 'Jun'], [270, 'Mar']]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 400 280" className="w-full">
        {/* orbit */}
        <ellipse cx={SX} cy={SY} rx={RX} ry={RY} fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 4" />
        {markers.map(([d, m]) => {
          const a = (d * Math.PI) / 180
          return (
            <text key={d} x={SX + (RX + 14) * Math.cos(a)} y={SY + (RY + 14) * Math.sin(a) + 4} fill="var(--color-muted)" fontSize="9" textAnchor="middle">
              {m}
            </text>
          )
        })}

        {/* Sun */}
        <circle cx={SX} cy={SY} r="20" fill={SUN} />
        <circle cx={SX} cy={SY} r="20" fill="none" stroke={SUN} strokeWidth="6" opacity="0.3" />

        {/* sunlight ray to Earth */}
        <line x1={SX} y1={SY} x2={ex} y2={ey} stroke={SUN} strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />

        {/* Earth with tilted axis */}
        <circle cx={ex} cy={ey} r={R} fill="#0984e3" />
        {/* lit hemisphere hint: equator */}
        <line x1={ex - R} y1={ey} x2={ex + R} y2={ey} stroke="#fff" strokeWidth="0.75" opacity="0.4" />
        <line x1={ex - ax * (R + 8)} y1={ey - ay * (R + 8)} x2={ex + ax * (R + 8)} y2={ey + ay * (R + 8)} stroke="var(--color-ink)" strokeWidth="2" />
        <circle cx={ex + ax * (R + 8)} cy={ey + ay * (R + 8)} r="3" fill="#e17055" />
        <text x={ex + ax * (R + 8) + 6} y={ey + ay * (R + 8)} fill="var(--color-muted)" fontSize="9">N</text>
      </svg>

      <div className="px-4 pt-2">
        <SceneSlider label="Position in orbit" value={deg} min={0} max={360} step={5} unit="°" onChange={setDeg} />
        <p className="mt-2 text-center text-sm text-ink">
          Northern Hemisphere: <strong>{north}</strong> ({month}) · Southern Hemisphere: <strong>{south}</strong>
        </p>
        <p className="mt-1 pb-4 text-center text-xs text-muted">
          The axis (with its red N pole) always points the same way. Which hemisphere it leans toward decides the season — distance to the Sun barely matters.
        </p>
      </div>
    </div>
  )
}
