import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const C = 3e8 // speed of light, m/s
const BAR_X = 20
const BAR_W = 420
const BAR_Y = 74
const BAR_H = 40
const E_HI = 3 // log10(Î») at the left edge  (1 km, radio)
const E_LO = -12 // log10(Î») at the right edge (1 pm, gamma)

// The whole electromagnetic spectrum is one family of waves â€” only the
// wavelength differs. Visible light is a razor-thin slice in the middle. Drag
// the marker and watch the band, wavelength, and frequency change together.
const SEGMENTS: Array<{ name: string; hi: number; lo: number; fill: string }> = [
  { name: 'Radio', hi: 3, lo: -1, fill: '#7a1f1f' },
  { name: 'Microwave', hi: -1, lo: -3, fill: '#b8860b' },
  { name: 'Infrared', hi: -3, lo: -6.15, fill: '#c0392b' },
  { name: 'Visible', hi: -6.15, lo: -6.4, fill: 'url(#vis)' },
  { name: 'UV', hi: -6.4, lo: -8, fill: '#8e44ad' },
  { name: 'X-ray', hi: -8, lo: -11, fill: '#2980b9' },
  { name: 'Gamma', hi: -11, lo: -12, fill: '#4F8CFF' },
]

const xFromE = (e: number) => BAR_X + ((E_HI - e) / (E_HI - E_LO)) * BAR_W

function bandFor(e: number): string {
  for (const s of SEGMENTS) if (e <= s.hi && e > s.lo) return s.name
  return e > -1 ? 'Radio' : 'Gamma'
}

function fmtWavelength(lambda: number): string {
  if (lambda >= 1e3) return `${(lambda / 1e3).toPrecision(2)} km`
  if (lambda >= 1) return `${lambda.toPrecision(2)} m`
  if (lambda >= 1e-3) return `${(lambda * 1e3).toPrecision(2)} mm`
  if (lambda >= 1e-6) return `${(lambda * 1e6).toPrecision(2)} Âµm`
  if (lambda >= 1e-9) return `${(lambda * 1e9).toPrecision(2)} nm`
  return `${(lambda * 1e12).toPrecision(2)} pm`
}

function fmtFreq(f: number): string {
  const units: Array<[number, string]> = [
    [1e18, 'EHz'], [1e15, 'PHz'], [1e12, 'THz'], [1e9, 'GHz'], [1e6, 'MHz'], [1e3, 'kHz'],
  ]
  for (const [v, u] of units) if (f >= v) return `${(f / v).toPrecision(2)} ${u}`
  return `${f.toPrecision(2)} Hz`
}

export function SpectrumBar() {
  const [pos, setPos] = useState(50) // 0..100 across the bar
  const e = E_HI - (pos / 100) * (E_HI - E_LO)
  const lambda = Math.pow(10, e)
  const freq = C / lambda
  const markerX = xFromE(e)
  const band = bandFor(e)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 460 200" className="w-full">
        <defs>
          <linearGradient id="vis" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff0000" />
            <stop offset="33%" stopColor="#ffff00" />
            <stop offset="66%" stopColor="#00aaff" />
            <stop offset="100%" stopColor="#8a2be2" />
          </linearGradient>
        </defs>

        {SEGMENTS.map((s) => {
          const x = xFromE(s.hi)
          const w = xFromE(s.lo) - x
          const cx = x + w / 2
          return (
            <g key={s.name}>
              <rect x={x} y={BAR_Y} width={w} height={BAR_H} fill={s.fill} />
              {w > 32 && (
                <text x={cx} y={BAR_Y + BAR_H + 16} fill="var(--color-muted)" fontSize="10" textAnchor="middle">
                  {s.name}
                </text>
              )}
            </g>
          )
        })}

        {/* visible-light callout (it's a sliver) */}
        <line x1={xFromE(-6.27)} y1={BAR_Y} x2={xFromE(-6.27)} y2={BAR_Y - 16} stroke="var(--color-muted)" strokeWidth="1" />
        <text x={xFromE(-6.27)} y={BAR_Y - 20} fill="var(--color-muted)" fontSize="10" textAnchor="middle">visible</text>

        {/* long / short wavelength ends */}
        <text x={BAR_X} y={BAR_Y - 6} fill="var(--color-muted)" fontSize="10">â† long Î»</text>
        <text x={BAR_X + BAR_W} y={BAR_Y - 6} fill="var(--color-muted)" fontSize="10" textAnchor="end">short Î» â†’</text>

        {/* marker */}
        <line x1={markerX} y1={BAR_Y - 4} x2={markerX} y2={BAR_Y + BAR_H + 4} stroke="var(--color-ink)" strokeWidth="2" />
        <polygon
          points={`${markerX},${BAR_Y + BAR_H + 4} ${markerX - 5},${BAR_Y + BAR_H + 12} ${markerX + 5},${BAR_Y + BAR_H + 12}`}
          fill="var(--color-ink)"
        />
      </svg>

      <div className="px-4 pt-2">
        <SceneSlider label="Tune across the spectrum" value={pos} min={0} max={100} step={1} unit="%" onChange={setPos} />
        <p className="mt-2 pb-4 text-center text-sm">
          <span className="font-semibold text-accent-2">{band}</span>
          <span className="text-muted">  Â·  Î» â‰ˆ {fmtWavelength(lambda)}  Â·  f â‰ˆ {fmtFreq(freq)}</span>
        </p>
      </div>
    </div>
  )
}
