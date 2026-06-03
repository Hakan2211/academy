import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// The Phillips curve. In the SHORT RUN there is a trade-off: push unemployment
// down (by stimulating demand) and inflation rises; let unemployment climb and
// inflation falls. That downward curve tempted policymakers to think they could
// permanently "buy" low unemployment with a bit more inflation. The LONG RUN says
// otherwise. There is a NATURAL RATE of unemployment the economy gravitates to;
// any attempt to hold unemployment below it works only until people's inflation
// EXPECTATIONS catch up. Once they do, the short-run curve shifts UP and you're
// back at the natural rate — just with higher inflation. So the long-run Phillips
// curve is VERTICAL at the natural rate: no permanent trade-off. Drag the point
// along the short-run curve; toggle the long-run curve and shifting expectations.
const X0 = 50
const Y0 = 230
const PW = 286
const PH = 196
const U_MIN = 2 // unemployment axis (%)
const U_MAX = 11
const PI_MAX = 10 // inflation axis (%)
const NATURAL = 6 // natural rate of unemployment (%)

const sx = (u: number) => X0 + ((u - U_MIN) / (U_MAX - U_MIN)) * PW
const sy = (pi: number) => Y0 - (pi / PI_MAX) * PH

// short-run curve: inflation falls as unemployment rises, around an expected level.
// pi = expected + k·(natural − u)  → at u = natural, pi = expected.
function srInflation(u: number, expected: number) {
  return clamp(expected + 1.1 * (NATURAL - u), 0, PI_MAX)
}

export function PhillipsCurve() {
  const [u, setU] = useState(NATURAL)
  const [showLong, setShowLong] = useState(false)
  const [expected, setExpected] = useState(2) // expected inflation anchors the SR curve

  const pi = srInflation(u, expected)

  // build the short-run curve path
  let srPath = ''
  for (let i = 0; i <= 60; i++) {
    const uu = U_MIN + (i / 60) * (U_MAX - U_MIN)
    srPath += `${i === 0 ? 'M' : 'L'}${sx(uu).toFixed(1)} ${sy(srInflation(uu, expected)).toFixed(1)} `
  }

  const belowNatural = u < NATURAL - 0.2

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        <button
          type="button"
          onClick={() => setShowLong((s) => !s)}
          className={cn(
            'rounded-full border px-3 py-1 text-sm transition-colors',
            showLong ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          {showLong ? 'Long-run curve on' : 'Show long-run curve'}
        </button>
      </div>

      <svg viewBox="0 0 360 270" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Unemployment % →</text>
        <text x={X0 - 6} y={Y0 - PH + 4} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Inflation %</text>

        {/* long-run vertical Phillips curve at the natural rate */}
        {showLong && (
          <>
            <line x1={sx(NATURAL)} y1={Y0} x2={sx(NATURAL)} y2={Y0 - PH} stroke="var(--color-success)" strokeWidth="2.5" strokeDasharray="7 4" />
            <text x={sx(NATURAL)} y={Y0 - PH - 4} textAnchor="middle" fontSize="10" fill="var(--color-success)">LRPC</text>
            <text x={sx(NATURAL)} y={Y0 + 16} textAnchor="middle" fontSize="9" fill="var(--color-success)">natural rate</text>
          </>
        )}

        {/* short-run Phillips curve */}
        <path d={srPath} fill="none" stroke="var(--color-accent)" strokeWidth="3" />
        <text x={sx(U_MIN) + 4} y={sy(srInflation(U_MIN, expected)) - 6} fontSize="11" fill="var(--color-accent)">SRPC</text>

        {/* current point + guides */}
        <line x1={sx(u)} y1={sy(pi)} x2={sx(u)} y2={Y0} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
        <line x1={sx(u)} y1={sy(pi)} x2={X0} y2={sy(pi)} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
        <circle cx={sx(u)} cy={sy(pi)} r="6" fill="var(--color-ink)" />
      </svg>

      <div className="grid grid-cols-2 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-ink">{u.toFixed(1)}%</div><div className="text-xs text-muted">unemployment (natural {NATURAL}%)</div></div>
        <div><div className="font-mono text-ink">{pi.toFixed(1)}%</div><div className="text-xs text-muted">inflation</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Move along the curve: unemployment (%)" value={u} min={U_MIN} max={U_MAX} step={0.1} unit="%" onChange={setU} />
        {showLong && (
          <SceneSlider label="Expected inflation (%) — shifts the short-run curve" value={expected} min={0} max={8} step={0.5} unit="%" onChange={setExpected} />
        )}
        <div
          className={cn(
            'rounded-xl border px-3 py-2 text-center text-sm',
            !showLong ? 'border-accent/50 text-accent'
              : belowNatural ? 'border-accent-2/50 text-accent-2' : 'border-success/50 text-success',
          )}
        >
          {!showLong && 'Short run: a clear trade-off. Slide unemployment down and inflation climbs; let it rise and inflation eases. This is the menu policymakers once thought they could pick from.'}
          {showLong && belowNatural && 'You are holding unemployment below the natural rate — but only by accepting ever-higher inflation. As people come to expect that inflation, raise the Expected-inflation slider: the whole short-run curve shifts up and you drift back toward the natural rate.'}
          {showLong && !belowNatural && 'In the long run unemployment returns to its natural rate whatever the inflation rate, so the long-run Phillips curve is vertical. Higher expected inflation just shifts the short-run curve up — more inflation, same unemployment. No permanent trade-off.'}
        </div>
      </div>
    </div>
  )
}
