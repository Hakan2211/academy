import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'

// Rotter's locus of control. The learner picks a scenario and slides a dial from
// fully external ("it was luck / fate / other people") to fully internal ("it
// was my own effort and choices"), then reads how that attribution shapes
// expectations and motivation. Used in social-cognitive.

type Scenario = 'exam' | 'job' | 'health'

const SCENARIOS: Record<Scenario, { label: string; event: string; internal: string; external: string }> = {
  exam: {
    label: 'You ace an exam',
    event: 'You just got a top mark on a hard exam.',
    internal: 'I earned this — I studied smart and worked hard, so I can do it again.',
    external: 'I got lucky — the questions just happened to be ones I knew. Next time, who knows.',
  },
  job: {
    label: 'You miss a job',
    event: 'You were turned down after a job interview.',
    internal: 'I can fix this — I\'ll sharpen my answers and practise before the next one.',
    external: 'The system is rigged — they\'d already picked someone. Nothing I do matters.',
  },
  health: {
    label: 'You feel run down',
    event: 'You\'ve been feeling unwell and low on energy lately.',
    internal: 'My habits matter — I\'ll fix my sleep and diet and likely feel better.',
    external: 'It\'s just bad genes or bad luck — there\'s nothing I can really do about it.',
  },
}

export function LocusOfControl() {
  const [scenario, setScenario] = useState<Scenario>('exam')
  // 0 = fully external, 100 = fully internal
  const [loc, setLoc] = useState(50)
  const sc = SCENARIOS[scenario]

  const internalWeight = loc / 100
  // Expectancy that future effort will pay off scales with internal locus.
  const expectancy = Math.round(20 + internalWeight * 70)
  const leaning = loc > 60 ? 'internal' : loc < 40 ? 'external' : 'mixed'

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {(Object.keys(SCENARIOS) as Array<Scenario>).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setScenario(s)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              scenario === s ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {SCENARIOS[s].label}
          </button>
        ))}
      </div>

      <p className="rounded-xl bg-surface-2 p-3 text-sm text-ink">{sc.event}</p>

      <div className="mt-3">
        <div className="mb-1 flex justify-between text-xs text-muted">
          <span>External (luck, fate, others)</span>
          <span>Internal (my effort, my choices)</span>
        </div>
        <SceneSlider label="Where do you place the cause?" value={loc} min={0} max={100} step={1} unit="" onChange={setLoc} />
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 p-3">
        <p className="text-sm italic leading-relaxed text-muted">
          &ldquo;{leaning === 'internal' ? sc.internal : leaning === 'external' ? sc.external : `${sc.internal} … and yet — ${sc.external.toLowerCase()}`}&rdquo;
        </p>

        {/* expectancy meter */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted">
            <span>Belief that future effort will pay off</span>
            <span className="font-mono text-ink">{expectancy}%</span>
          </div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${expectancy}%`, background: 'var(--color-accent)' }}
            />
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm leading-snug text-muted">
        A more <span className="font-semibold text-accent">internal</span> locus means you expect your actions to change outcomes, so you keep trying. A more <span className="font-semibold text-ink">external</span> locus can protect you from blame, but slide too far and it breeds <span className="text-ink">learned helplessness</span> — why bother, if nothing you do matters?
      </p>
    </div>
  )
}
