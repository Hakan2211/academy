import { useState } from 'react'
import { cn } from '#/lib/cn'

// The artificial neuron, stripped bare. It takes inputs, multiplies each by a
// WEIGHT, adds them up with a BIAS, then squashes the total through an
// ACTIVATION function. That's the whole atom of a neural network. With the right
// weights a single neuron behaves like an AND or OR gate — connecting this world
// straight back to logic gates: a neuron is a learnable, fuzzy gate.

type Act = 'step' | 'sigmoid'
type Preset = 'AND' | 'OR' | 'custom'

const PRESETS: Record<Exclude<Preset, 'custom'>, { w: [number, number]; b: number }> = {
  AND: { w: [1, 1], b: -1.5 },
  OR: { w: [1, 1], b: -0.5 },
}

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z))

export function Perceptron() {
  const [x1, setX1] = useState(1)
  const [x2, setX2] = useState(1)
  const [w1, setW1] = useState(1)
  const [w2, setW2] = useState(1)
  const [bias, setBias] = useState(-1.5)
  const [act, setAct] = useState<Act>('step')
  const [preset, setPreset] = useState<Preset>('AND')

  const z = w1 * x1 + w2 * x2 + bias
  const out = act === 'step' ? (z >= 0 ? 1 : 0) : sigmoid(z)
  const outStr = act === 'step' ? String(out) : out.toFixed(2)

  const applyPreset = (p: Exclude<Preset, 'custom'>) => {
    setW1(PRESETS[p].w[0])
    setW2(PRESETS[p].w[1])
    setBias(PRESETS[p].b)
    setPreset(p)
  }
  const onWeight = (set: (n: number) => void) => (v: number) => { set(v); setPreset('custom') }

  // Does this neuron match the chosen gate over all 4 input combos?
  const gateOk = preset !== 'custom' && act === 'step' && [0, 1].every((a) =>
    [0, 1].every((b) => {
      const zz = w1 * a + w2 * b + bias
      const o = zz >= 0 ? 1 : 0
      const want = preset === 'AND' ? a & b : a | b
      return o === want
    }),
  )

  const SliderRow = ({ label, value, min, max, on, color }: { label: string; value: number; min: number; max: number; on: (v: number) => void; color: string }) => (
    <label className="flex items-center gap-2 text-sm">
      <span className="w-14 font-mono" style={{ color }}>{label}</span>
      <input type="range" min={min} max={max} step={0.1} value={value} onChange={(e) => on(Number(e.target.value))} className="flex-1 accent-accent" />
      <span className="w-10 text-right font-mono text-ink">{value.toFixed(1)}</span>
    </label>
  )

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {(['AND', 'OR'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => applyPreset(p)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              preset === p ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {p} gate
          </button>
        ))}
        {(['step', 'sigmoid'] as Array<Act>).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAct(a)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              act === a ? 'border-accent-2 bg-accent-2/10 text-accent-2' : 'border-border text-muted hover:text-ink',
            )}
          >
            {a}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 170" className="w-full">
        {/* edges */}
        <line x1="60" y1="50" x2="190" y2="85" stroke="var(--color-accent)" strokeWidth={1 + Math.abs(w1) * 1.6} opacity="0.8" />
        <line x1="60" y1="120" x2="190" y2="85" stroke="var(--color-accent)" strokeWidth={1 + Math.abs(w2) * 1.6} opacity="0.8" />
        <line x1="210" y1="85" x2="320" y2="85" stroke="var(--color-accent-2)" strokeWidth="3" />
        {/* input nodes */}
        {[{ y: 50, v: x1, set: setX1, l: 'x₁' }, { y: 120, v: x2, set: setX2, l: 'x₂' }].map((n) => (
          <g key={n.l} onClick={() => n.set(n.v ? 0 : 1)} style={{ cursor: 'pointer' }}>
            <circle cx="50" cy={n.y} r="20" fill={n.v ? 'var(--color-accent)' : 'var(--color-surface-2)'} stroke="var(--color-border)" strokeWidth="2" />
            <text x="50" y={n.y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={n.v ? '#0a0f1f' : 'var(--color-ink)'}>{n.v}</text>
            <text x="50" y={n.y - 26} textAnchor="middle" fontSize="11" fill="var(--color-muted)">{n.l}</text>
          </g>
        ))}
        {/* weight labels */}
        <text x="120" y="58" textAnchor="middle" fontSize="10" fill="var(--color-accent)">w₁={w1.toFixed(1)}</text>
        <text x="120" y="115" textAnchor="middle" fontSize="10" fill="var(--color-accent)">w₂={w2.toFixed(1)}</text>
        {/* neuron */}
        <circle cx="200" cy="85" r="28" fill="var(--color-surface-2)" stroke="var(--color-accent-2)" strokeWidth="2.5" />
        <text x="200" y="82" textAnchor="middle" fontSize="11" fill="var(--color-muted)">Σ + b</text>
        <text x="200" y="98" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-ink)">{z.toFixed(1)}</text>
        {/* output */}
        <circle cx="335" cy="85" r="18" fill={out >= 0.5 ? '#2ECC71' : 'var(--color-surface-2)'} stroke="var(--color-border)" strokeWidth="2" />
        <text x="335" y="89" textAnchor="middle" fontSize="11" fontWeight="700" fill={out >= 0.5 ? '#0a0f1f' : 'var(--color-ink)'}>{outStr}</text>
      </svg>

      <div className="mt-2 space-y-1.5">
        <SliderRow label="w₁" value={w1} min={-2} max={2} on={onWeight(setW1)} color="var(--color-accent)" />
        <SliderRow label="w₂" value={w2} min={-2} max={2} on={onWeight(setW2)} color="var(--color-accent)" />
        <SliderRow label="bias" value={bias} min={-3} max={1} on={onWeight(setBias)} color="var(--color-muted)" />
      </div>

      <p className="mt-3 text-center text-sm text-muted">
        z = w₁·x₁ + w₂·x₂ + b = <span className="font-mono text-ink">{z.toFixed(2)}</span> → {act} → <span className="font-mono font-bold text-accent-2">{outStr}</span>.
        {preset !== 'custom' && (
          gateOk
            ? <span className="text-success"> These weights make a perfect {preset} gate.</span>
            : <span className="text-warn"> Switch to step activation to act as a clean gate.</span>
        )}
      </p>
    </div>
  )
}
