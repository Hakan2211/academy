import { useState } from 'react'
import { makeScale } from '#/lib/math'

// The four transformations on one grid: translation, reflection, rotation,
// enlargement. A chiral triangle makes reflections and rotations obvious. The
// faint shape is the original; the bright one is its image. Reused across
// translations, reflections-and-rotations, and enlargements.
type Pt = [number, number]
const SHAPE: Array<Pt> = [
  [1, 1], [4, 1], [1, 3],
]

export function TransformGrid() {
  const [mode, setMode] = useState<'translate' | 'reflect' | 'rotate' | 'enlarge'>('translate')
  const [dx, setDx] = useState(2)
  const [dy, setDy] = useState(-3)
  const [mirror, setMirror] = useState<'x' | 'y' | 'yx'>('y')
  const [rot, setRot] = useState(90)
  const [k, setK] = useState(2)

  const tf = (p: Pt): Pt => {
    const [x, y] = p
    if (mode === 'translate') return [x + dx, y + dy]
    if (mode === 'reflect') return mirror === 'x' ? [x, -y] : mirror === 'y' ? [-x, y] : [y, x]
    if (mode === 'rotate') {
      if (rot === 90) return [-y, x]
      if (rot === 180) return [-x, -y]
      return [y, -x] // 270
    }
    return [k * x, k * y] // enlarge from origin
  }
  const image = SHAPE.map(tf)

  const W = 300
  const px = makeScale(-7, 7, 10, W - 10)
  const py = makeScale(-7, 7, W - 10, 10)
  const poly = (pts: Array<Pt>) => pts.map((p) => `${px(p[0])},${py(p[1])}`).join(' ')

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {(['translate', 'reflect', 'rotate', 'enlarge'] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`rounded-lg border px-2.5 py-1 text-xs capitalize transition ${m === mode ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>{m}</button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${W}`} className="mx-auto w-full max-w-[300px]">
        {Array.from({ length: 15 }, (_, i) => i - 7).map((g) => (
          <g key={g}>
            <line x1={px(g)} y1={py(-7)} x2={px(g)} y2={py(7)} stroke="var(--color-border)" strokeWidth="0.4" opacity="0.3" />
            <line x1={px(-7)} y1={py(g)} x2={px(7)} y2={py(g)} stroke="var(--color-border)" strokeWidth="0.4" opacity="0.3" />
          </g>
        ))}
        <line x1={px(-7)} y1={py(0)} x2={px(7)} y2={py(0)} stroke="var(--color-muted)" strokeWidth="1.2" />
        <line x1={px(0)} y1={py(-7)} x2={px(0)} y2={py(7)} stroke="var(--color-muted)" strokeWidth="1.2" />
        {mode === 'reflect' && mirror === 'yx' && <line x1={px(-7)} y1={py(-7)} x2={px(7)} y2={py(7)} stroke="var(--color-accent-2)" strokeWidth="1" strokeDasharray="4 3" />}
        {(mode === 'rotate' || mode === 'enlarge') && <circle cx={px(0)} cy={py(0)} r="3" fill="var(--color-accent-2)" />}
        <polygon points={poly(SHAPE)} fill="var(--color-muted)" fillOpacity="0.18" stroke="var(--color-muted)" strokeWidth="1.5" />
        <polygon points={poly(image)} fill="var(--color-accent)" fillOpacity="0.25" stroke="var(--color-accent)" strokeWidth="2" />
      </svg>

      <div className="mt-2 px-1 text-sm">
        {mode === 'translate' && (
          <div className="space-y-1.5">
            <label className="flex items-center justify-between gap-3"><span className="text-muted">move x</span><input type="range" min={-5} max={5} value={dx} onChange={(e) => setDx(Number(e.target.value))} className="w-1/2 accent-accent" /><span className="w-6 text-right font-mono text-ink">{dx}</span></label>
            <label className="flex items-center justify-between gap-3"><span className="text-muted">move y</span><input type="range" min={-5} max={5} value={dy} onChange={(e) => setDy(Number(e.target.value))} className="w-1/2 accent-accent" /><span className="w-6 text-right font-mono text-ink">{dy}</span></label>
            <p className="text-center text-xs text-muted">Translation by vector ({dx}, {dy}) — slides every point the same way; shape unchanged.</p>
          </div>
        )}
        {mode === 'reflect' && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              {(['x', 'y', 'yx'] as const).map((m) => (<button key={m} onClick={() => setMirror(m)} className={`rounded border px-2 py-1 text-xs transition ${m === mirror ? 'border-accent text-accent' : 'border-border text-muted'}`}>{m === 'x' ? 'x-axis' : m === 'y' ? 'y-axis' : 'y = x'}</button>))}
            </div>
            <p className="text-center text-xs text-muted">Reflection flips the shape across the mirror line — it becomes its mirror image.</p>
          </div>
        )}
        {mode === 'rotate' && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">{[90, 180, 270].map((a) => (<button key={a} onClick={() => setRot(a)} className={`rounded border px-2 py-1 text-xs transition ${a === rot ? 'border-accent text-accent' : 'border-border text-muted'}`}>{a}°</button>))}</div>
            <p className="text-center text-xs text-muted">Rotation by {rot}° about the origin — turns the shape, size unchanged.</p>
          </div>
        )}
        {mode === 'enlarge' && (
          <div className="space-y-1.5">
            <label className="flex items-center justify-between gap-3"><span className="text-muted">scale factor</span><input type="range" min={-2} max={3} step={0.5} value={k} onChange={(e) => setK(Number(e.target.value))} className="w-1/2 accent-accent" /><span className="w-8 text-right font-mono text-ink">{k}</span></label>
            <p className="text-center text-xs text-muted">Enlargement ×{k} from the origin — a negative factor flips it through the centre.</p>
          </div>
        )}
      </div>
    </div>
  )
}
