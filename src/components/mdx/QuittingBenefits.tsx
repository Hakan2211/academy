import { useState } from 'react'
import { cn } from '#/lib/cn'

// Timeline of what happens to the body after quitting smoking.
// Hopeful framing — it is never too late.

type Milestone = {
  time: string
  title: string
  detail: string
  color: string
  icon: string
}

const MILESTONES: Milestone[] = [
  {
    time: '20 minutes',
    title: 'Heart rate & blood pressure normalise',
    detail: 'Within 20 minutes of your last cigarette, heart rate drops back toward a healthy level and blood pressure begins to fall. Your circulation is already improving.',
    color: '#e17055',
    icon: '❤️',
  },
  {
    time: '12 hours',
    title: 'Carbon monoxide clears',
    detail: 'Cigarette smoke floods the blood with carbon monoxide (CO), which displaces oxygen. Within 12 hours, CO levels fall to normal and blood oxygen rises — every cell gets more oxygen.',
    color: '#fdcb6e',
    icon: '💨',
  },
  {
    time: '2–12 weeks',
    title: 'Circulation & lung function improve',
    detail: 'Over the following weeks, circulation improves noticeably — walking and exercise become easier. Lung capacity increases as inflammation reduces and cilia (the tiny cleaning hairs) begin to recover.',
    color: '#74b9ff',
    icon: '🫁',
  },
  {
    time: '1–9 months',
    title: 'Coughing & breathlessness ease',
    detail: 'Cilia in the airways — damaged by years of smoke — regrow and regain their ability to clear mucus. Coughing, shortness of breath, and sinus congestion all reduce significantly.',
    color: '#55efc4',
    icon: '🌬️',
  },
  {
    time: '1 year',
    title: 'Heart disease risk roughly halves',
    detail: 'One year smoke-free and your risk of coronary heart disease is already about half that of a continuing smoker. That is a dramatic, measurable reduction — achieved in just 12 months.',
    color: '#00b894',
    icon: '🏆',
  },
  {
    time: '5 years',
    title: 'Stroke risk falls to near non-smoker levels',
    detail: 'Five to fifteen years after quitting, the risk of stroke drops to approximately the same level as someone who has never smoked. The brain benefits substantially.',
    color: '#6c5ce7',
    icon: '🧠',
  },
  {
    time: '10 years',
    title: 'Lung cancer risk roughly halves',
    detail: 'After 10 years, the risk of dying from lung cancer is about half that of a current smoker. Risks of mouth, throat, oesophagus, bladder, kidney, and pancreatic cancers also fall.',
    color: '#a29bfe',
    icon: '🔬',
  },
  {
    time: '15 years',
    title: 'Heart disease risk near a non-smoker\'s',
    detail: "After 15 years smoke-free, your risk of coronary heart disease is close to that of someone who has never smoked at all. The body's capacity to heal is remarkable — at any age.",
    color: '#fd79a8',
    icon: '✨',
  },
]

export function QuittingBenefits() {
  const [idx, setIdx] = useState(0)
  const milestone = MILESTONES[idx]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4 space-y-4">
      <div>
        <p className="text-sm font-semibold text-ink">What Happens When You Quit Smoking</p>
        <p className="text-xs text-muted mt-0.5">
          Step through the timeline. Benefits begin within minutes — and continue for years.
          It is never too late to quit.
        </p>
      </div>

      {/* Timeline dots */}
      <div className="relative flex items-center justify-between gap-0">
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border" />
        {MILESTONES.map((m, i) => (
          <button
            key={m.time}
            type="button"
            title={m.time}
            onClick={() => setIdx(i)}
            className={cn(
              'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] transition-all',
              i <= idx
                ? 'border-accent bg-accent/20 text-accent'
                : 'border-border bg-surface text-muted',
            )}
            style={i === idx ? { borderColor: m.color, backgroundColor: m.color + '33', color: m.color } : {}}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Milestone card */}
      <div className="rounded-xl border p-4 transition-colors"
        style={{ borderColor: milestone.color + '66', backgroundColor: milestone.color + '11' }}>
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none mt-0.5">{milestone.icon}</span>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: milestone.color }}>
              {milestone.time} after quitting
            </p>
            <p className="mt-1 font-semibold text-sm text-ink">{milestone.title}</p>
            <p className="mt-1.5 text-xs text-muted leading-relaxed">{milestone.detail}</p>
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      <div className="flex gap-2">
        <button type="button"
          onClick={() => setIdx(i => Math.max(0, i - 1))}
          disabled={idx === 0}
          className={cn(
            'flex-1 rounded-xl border py-2 text-xs font-medium transition-colors',
            idx === 0
              ? 'border-border text-muted opacity-40 cursor-not-allowed'
              : 'border-border text-muted hover:text-ink',
          )}>
          ← Previous
        </button>
        <button type="button"
          onClick={() => setIdx(i => Math.min(MILESTONES.length - 1, i + 1))}
          disabled={idx === MILESTONES.length - 1}
          className={cn(
            'flex-1 rounded-xl border py-2 text-xs font-medium transition-colors',
            idx === MILESTONES.length - 1
              ? 'border-border text-muted opacity-40 cursor-not-allowed'
              : 'border-accent bg-accent/15 text-accent',
          )}>
          Next →
        </button>
      </div>

      {/* Progress label */}
      <p className="text-center text-xs text-muted">
        Milestone {idx + 1} of {MILESTONES.length}
        {idx === MILESTONES.length - 1 && (
          <span className="ml-1 text-success font-medium">— full timeline explored!</span>
        )}
      </p>

      <div className="rounded-xl border border-border bg-surface-2 p-3 text-xs text-muted">
        Quitting is hard — nicotine is one of the most addictive substances known. Most people
        need several attempts. Nicotine replacement therapy (patches, gum, lozenges) and
        prescription medications substantially improve success rates. Support is available —
        no previous attempts count against you.
      </div>
    </div>
  )
}
