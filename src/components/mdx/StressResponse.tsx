import { useEffect, useRef, useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The body's stress response on two fronts. The fast SAM track — the sympathetic
// nervous system firing the adrenal medulla for an adrenaline-fuelled fight-or-
// flight surge — and the slower HPA axis: hypothalamus → pituitary → adrenal
// cortex → cortisol. Press the stressor and a pulse travels down the cascade
// while the body's dials swing into emergency mode.

type Effect = { id: string; label: string; icon: string; change: 'up' | 'down'; note: string }

const EFFECTS: Array<Effect> = [
  { id: 'heart', label: 'Heart rate', icon: 'HeartPulse', change: 'up', note: 'Pumps oxygen-rich blood to the muscles, fast.' },
  { id: 'breath', label: 'Breathing', icon: 'Wind', change: 'up', note: 'Lungs open wide to load the blood with oxygen.' },
  { id: 'pupils', label: 'Pupils', icon: 'Eye', change: 'up', note: 'Dilate to let in more light — sharpen the senses.' },
  { id: 'sugar', label: 'Blood sugar', icon: 'Zap', change: 'up', note: 'The liver dumps glucose for instant fuel.' },
  { id: 'sweat', label: 'Sweating', icon: 'Droplets', change: 'up', note: 'Cools a body braced for hard exertion.' },
  { id: 'digest', label: 'Digestion', icon: 'Utensils', change: 'down', note: 'Shuts down — no time to digest lunch in a crisis.' },
]

// The HPA cascade, top to bottom.
const STAGES = [
  { label: 'Hypothalamus', sub: 'releases CRH', note: 'The brain detects threat and fires the first chemical signal (CRH) toward the pituitary.' },
  { label: 'Pituitary', sub: 'releases ACTH', note: 'The master gland answers, sending ACTH through the blood to the adrenal glands.' },
  { label: 'Adrenal cortex', sub: 'releases cortisol', note: 'Atop the kidneys, the adrenal cortex pours out cortisol — the main stress hormone.' },
  { label: 'Cortisol', sub: 'floods the body', note: 'Cortisol keeps blood sugar high and energy mobilised — useful briefly, costly if it never switches off.' },
] as const

export function StressResponse() {
  // step 0 = calm; 1..4 = cascade stages reached; we animate "active" up to step.
  const [step, setStep] = useState(0)
  const stressed = step > 0

  // rAF: ease an arousal dial from 0→1 (when stressed) or back to 0 (when calm).
  const dialRef = useRef<SVGRectElement | null>(null)
  const target = useRef(0)
  const level = useRef(0)
  useEffect(() => {
    target.current = stressed ? 1 : 0
  }, [stressed])
  useEffect(() => {
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      level.current += (target.current - level.current) * 0.006 * dt
      const el = dialRef.current
      if (el) {
        const w = 4 + level.current * 196
        el.setAttribute('width', w.toFixed(1))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* HPA cascade */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">The HPA axis (slow track)</p>
          <div className="flex flex-col gap-1.5">
            {STAGES.map((s, k) => {
              const reached = step > k
              return (
                <div key={s.label}>
                  <div
                    className={cn(
                      'rounded-xl border px-3 py-2 transition-colors',
                      reached ? 'border-accent bg-accent/15' : 'border-border bg-surface-2',
                    )}
                  >
                    <p className={cn('text-sm font-semibold', reached ? 'text-accent' : 'text-muted')}>{s.label}</p>
                    <p className={cn('text-xs', reached ? 'text-ink' : 'text-muted')}>{s.sub}</p>
                  </div>
                  {k < STAGES.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <Icon name="ChevronDown" size={14} className={reached ? 'text-accent' : 'text-muted'} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Fight-or-flight body dials (fast SAM track) */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-2">Fight-or-flight (fast track)</p>
          <div className="grid grid-cols-2 gap-1.5">
            {EFFECTS.map((e) => (
              <div
                key={e.id}
                className={cn(
                  'rounded-lg border px-2 py-1.5 transition-colors',
                  stressed ? 'border-accent-2/50 bg-accent-2/10' : 'border-border bg-surface-2',
                )}
              >
                <div className="flex items-center gap-1.5">
                  <Icon name={e.icon} size={13} className={stressed ? 'text-accent-2' : 'text-muted'} />
                  <span className="text-[11px] font-medium text-ink">{e.label}</span>
                  {stressed && (
                    <Icon
                      name={e.change === 'up' ? 'ArrowUp' : 'ArrowDown'}
                      size={12}
                      className={e.change === 'up' ? 'text-danger' : 'text-success'}
                    />
                  )}
                </div>
                {stressed && <p className="mt-0.5 text-[10px] leading-tight text-muted">{e.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* arousal dial */}
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs text-muted">
          <span>Body arousal</span>
          <span className={stressed ? 'text-danger' : 'text-success'}>{stressed ? 'mobilised' : 'resting'}</span>
        </div>
        <svg viewBox="0 0 200 12" className="w-full">
          <rect x={0} y={2} width={200} height={8} rx={4} fill="var(--color-surface-2)" />
          <rect ref={dialRef} x={0} y={2} width={4} height={8} rx={4} fill="var(--color-danger)" />
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(STAGES.length, s + 1))}
          disabled={step >= STAGES.length}
          className="flex items-center gap-1.5 rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm text-accent disabled:opacity-40"
        >
          <Icon name="AlertTriangle" size={14} />
          {step === 0 ? 'Trigger stressor' : 'Next stage'}
        </button>
        <button
          type="button"
          onClick={() => setStep(0)}
          disabled={step === 0}
          className="rounded-full border border-border px-4 py-1.5 text-sm text-muted enabled:hover:text-ink disabled:opacity-40"
        >
          Calm down
        </button>
      </div>

      <p className="mt-3 min-h-[2.5rem] rounded-lg bg-surface-2 px-3 py-2 text-center text-sm text-muted">
        {step === 0
          ? 'All quiet. Press “Trigger stressor” to fire the alarm.'
          : STAGES[step - 1].note}
      </p>
    </div>
  )
}
