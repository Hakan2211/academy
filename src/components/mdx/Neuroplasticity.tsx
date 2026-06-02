import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp, lerp } from '#/lib/psych'

// Neuroplasticity: the cortex rewires with experience. A strip of motor/sensory
// cortex is divided between body parts; drag "practice" up and the trained part
// (e.g. a violinist's left-hand fingers) claims more territory, while neighbours
// shrink. A second mode shows recovery after injury, where surviving regions
// take over a lost area's job. The total cortex is fixed — plasticity is a
// competition for real estate.
type Mode = 'practice' | 'injury'

const W = 320
const STRIP_Y = 70
const STRIP_H = 40
const X0 = 20
const X1 = 300
const STRIP_W = X1 - X0

export function Neuroplasticity() {
  const [mode, setMode] = useState<Mode>('practice')
  const [amount, setAmount] = useState(0) // 0..100 practice or healing

  const t = amount / 100

  // Baseline shares of the strip (sum to 1). The "trained"/"recovering" region
  // is the middle one (fingers / face) in this schematic.
  const base = [0.22, 0.34, 0.44] // trunk, hand/fingers, face
  let shares: Array<number>
  if (mode === 'practice') {
    // Fingers region grows; neighbours give up territory proportionally.
    const grow = lerp(base[1], 0.62, t)
    const rest = 1 - grow
    const restBase = base[0] + base[2]
    shares = [(base[0] / restBase) * rest, grow, (base[2] / restBase) * rest]
  } else {
    // Injury: the fingers region is damaged (dead zone shrinks toward 0 as
    // neighbours invade and take over its function).
    const dead = lerp(base[1], 0.04, t)
    const rest = 1 - dead
    const restBase = base[0] + base[2]
    shares = [(base[0] / restBase) * rest, dead, (base[2] / restBase) * rest]
  }

  const labels = ['Trunk', mode === 'practice' ? 'Trained fingers' : 'Injured zone', 'Face']
  const colors = ['#A29BFE', mode === 'practice' ? '#FF6B9D' : '#E74C3C', '#00D2D3']

  let x = X0
  const segs = shares.map((s, i) => {
    const w = s * STRIP_W
    const seg = { x, w, i }
    x += w
    return seg
  })

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {(['practice', 'injury'] as Array<Mode>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setAmount(0) }}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {m === 'practice' ? 'Practice a skill' : 'Recover from injury'}
          </button>
        ))}
      </div>

      <p className="mb-1 text-xs text-muted">A strip of cortex, divided among body parts (the "homunculus" map):</p>
      <svg viewBox={`0 0 ${W} 130`} className="w-full">
        <text x={W / 2} y={16} textAnchor="middle" fontSize="10" fill="var(--color-muted)">
          {mode === 'practice' ? 'before — even shares' : 'before — region healthy'}
        </text>
        {/* before strip (baseline) */}
        {(() => {
          let bx = X0
          return base.map((s, i) => {
            const w = s * STRIP_W
            const seg = (
              <rect key={`b${i}`} x={bx} y={26} width={w - 1.5} height={16} rx={3} fill={colors[i]} opacity={0.35} />
            )
            bx += w
            return seg
          })
        })()}

        <text x={W / 2} y={64} textAnchor="middle" fontSize="10" fill="var(--color-ink)">
          {mode === 'practice' ? 'after — the trained map expanded' : 'after — neighbours took over the lost area'}
        </text>
        {/* after strip (live) */}
        {segs.map((seg) => (
          <g key={seg.i}>
            <rect x={seg.x} y={STRIP_Y} width={Math.max(0, seg.w - 1.5)} height={STRIP_H} rx={4} fill={colors[seg.i]} />
            {seg.w > 44 && (
              <text x={seg.x + seg.w / 2} y={STRIP_Y + STRIP_H / 2 + 4} textAnchor="middle" fontSize="9" fill="#fff" fontWeight={600}>
                {labels[seg.i]}
              </text>
            )}
          </g>
        ))}
      </svg>

      <div className="mt-2">
        <SceneSlider
          label={mode === 'practice' ? 'Practice / experience' : 'Healing & retraining'}
          value={amount}
          min={0}
          max={100}
          step={1}
          unit="%"
          onChange={(v) => setAmount(clamp(v, 0, 100))}
        />
      </div>

      <p className="mt-2 text-sm text-muted">
        {mode === 'practice' ? (
          <>The more a skill is practised, the more cortical territory its region claims — string players, for instance, devote an enlarged map to their fingering hand. The brain is <span className="font-medium text-ink">use-it-or-lose-it</span>.</>
        ) : (
          <>After damage, neighbouring regions and the opposite hemisphere can gradually <span className="font-medium text-ink">take over</span> a lost function — fastest in childhood, but possible at any age. This rewiring underlies rehabilitation.</>
        )}
      </p>
    </div>
  )
}
