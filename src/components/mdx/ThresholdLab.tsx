import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { cn } from '#/lib/cn'

// Three classic ideas about the edge of sensation, in one lab.
//  · Absolute threshold — the S-shaped curve of "can I detect it at all?"
//  · Difference threshold (Weber's law) — the just-noticeable change is a
//    constant fraction of the starting intensity, not a fixed amount.
//  · Signal detection — detection is a decision, scoring into hit / miss /
//    false-alarm / correct-rejection.
type Tab = 'absolute' | 'weber' | 'signal'

const W = 360
const H = 200
const PAD = 34

// Logistic detection probability: 50% defines the absolute threshold (=5 here).
function detectProb(intensity: number, threshold = 5, slope = 1.1): number {
  return 1 / (1 + Math.exp(-slope * (intensity - threshold)))
}

export function ThresholdLab() {
  const [tab, setTab] = useState<Tab>('absolute')

  // Absolute-threshold demo
  const [intensity, setIntensity] = useState(5)
  const p = detectProb(intensity)

  // Weber demo: weight in grams; Weber fraction for lifted weight ≈ 0.02 (2%).
  const [base, setBase] = useState(100)
  const jnd = base * 0.02

  const xOf = (i: number) => PAD + (i / 10) * (W - 2 * PAD)
  const yOf = (prob: number) => H - PAD - prob * (H - 2 * PAD)
  const N = 80
  const curve = Array.from({ length: N + 1 }, (_, k) => {
    const i = (10 * k) / N
    return `${k ? 'L' : 'M'}${xOf(i).toFixed(1)} ${yOf(detectProb(i)).toFixed(1)}`
  }).join(' ')

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 flex flex-wrap gap-2">
        {([
          ['absolute', 'Absolute threshold'],
          ['weber', "Weber's law"],
          ['signal', 'Signal detection'],
        ] as Array<[Tab, string]>).map(([t, label]) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              tab === t ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'absolute' && (
        <>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--color-border)" strokeWidth="1.5" />
            <line x1={PAD} y1={H - PAD} x2={PAD} y2={PAD} stroke="var(--color-border)" strokeWidth="1.5" />
            {/* 50%-detection threshold line */}
            <line x1={xOf(5)} y1={PAD} x2={xOf(5)} y2={H - PAD} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="2 3" />
            <text x={xOf(5)} y={PAD - 4} textAnchor="middle" fontSize="8" fill="var(--color-muted)">threshold (50%)</text>
            <path d={curve} fill="none" stroke="var(--color-accent-2)" strokeWidth="2.5" />
            <line x1={xOf(intensity)} y1={H - PAD} x2={xOf(intensity)} y2={yOf(p)} stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx={xOf(intensity)} cy={yOf(p)} r="6" fill="var(--color-accent)" />
            <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="9" fill="var(--color-muted)">Stimulus intensity →</text>
            <text x={12} y={H / 2} textAnchor="middle" fontSize="9" fill="var(--color-muted)" transform={`rotate(-90 12 ${H / 2})`}>P(detect) →</text>
          </svg>
          <div className="px-1">
            <SceneSlider label="Intensity" value={intensity} min={0} max={10} step={0.1} unit="" onChange={setIntensity} />
            <p className="mt-2 text-center text-sm text-muted">
              Chance of detecting it: <span className="font-semibold text-ink">{(p * 100).toFixed(0)}%</span>.
              The <span className="text-accent">absolute threshold</span> is the intensity you'd catch <span className="text-ink">half</span> the time — detection fades in gradually, not like a switch.
            </p>
          </div>
        </>
      )}

      {tab === 'weber' && (
        <>
          <div className="flex items-end justify-center gap-10 py-4">
            {[
              { label: 'Holding', g: base },
              { label: 'Just notice extra', g: base + jnd },
            ].map((b, i) => (
              <div key={b.label} className="flex flex-col items-center gap-2">
                <div
                  className="rounded-lg border"
                  style={{
                    width: 34 + b.g * 0.18,
                    height: 34 + b.g * 0.18,
                    background: i ? 'var(--color-accent)' : 'var(--color-surface-2)',
                    borderColor: i ? 'var(--color-accent)' : 'var(--color-border)',
                    opacity: i ? 0.85 : 1,
                  }}
                />
                <span className="text-xs text-muted">{b.label}</span>
                <span className="font-mono text-sm text-ink">{b.g.toFixed(0)} g</span>
              </div>
            ))}
          </div>
          <div className="px-1">
            <SceneSlider label="Weight you're holding" value={base} min={50} max={500} step={10} unit="g" onChange={setBase} />
            <p className="mt-2 text-center text-sm text-muted">
              You can just feel a change of about <span className="font-semibold text-ink">{jnd.toFixed(1)} g</span> (2% of the load).
              That's <span className="text-accent">Weber's law</span>: the just-noticeable difference is a <span className="text-ink">constant fraction</span> of the starting amount — a heavier load needs a bigger change to notice.
            </p>
          </div>
        </>
      )}

      {tab === 'signal' && (
        <>
          <div className="mx-auto grid max-w-[320px] grid-cols-[auto_1fr_1fr] gap-px overflow-hidden rounded-xl border border-border bg-border text-center text-sm">
            <div className="bg-surface" />
            <div className="bg-surface-2 p-2 font-semibold text-ink">Signal present</div>
            <div className="bg-surface-2 p-2 font-semibold text-ink">Signal absent</div>

            <div className="flex items-center justify-center bg-surface-2 p-2 font-semibold text-ink">You said "yes"</div>
            <div className="bg-surface p-3">
              <span className="font-semibold" style={{ color: 'var(--color-success)' }}>Hit</span>
              <p className="text-xs text-muted">Correctly caught it</p>
            </div>
            <div className="bg-surface p-3">
              <span className="font-semibold" style={{ color: '#E74C3C' }}>False alarm</span>
              <p className="text-xs text-muted">Cried wolf</p>
            </div>

            <div className="flex items-center justify-center bg-surface-2 p-2 font-semibold text-ink">You said "no"</div>
            <div className="bg-surface p-3">
              <span className="font-semibold" style={{ color: '#E74C3C' }}>Miss</span>
              <p className="text-xs text-muted">Let it slip past</p>
            </div>
            <div className="bg-surface p-3">
              <span className="font-semibold" style={{ color: 'var(--color-success)' }}>Correct rejection</span>
              <p className="text-xs text-muted">Rightly ignored it</p>
            </div>
          </div>
          <p className="mt-3 text-center text-sm text-muted">
            Near the threshold, detecting isn't pure sensing — it's a <span className="text-accent">decision</span>.
            Your <span className="text-ink">criterion</span> trades off the two errors: a jumpy radar operator gets more <span className="text-ink">hits</span> but also more <span style={{ color: '#E74C3C' }}>false alarms</span>.
          </p>
        </>
      )}
    </div>
  )
}
