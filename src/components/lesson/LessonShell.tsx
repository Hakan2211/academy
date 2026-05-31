import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'
import type { StepKind } from '#/components/mdx/Step'

// The immersive lesson-player shell (design.md §8 step 5, mockup `2.3`). It owns
// the Cosmic Glass chrome — exit pill, frosted-glass step panel, gradient
// Continue button, bottom step-dots — and lays a step out ADAPTIVELY:
//   • a step with one hero visual  → two-pane (visual left, glass panel right)
//   • otherwise (text-only / multi) → a single centred glass panel
// The controller (`Lesson`) decides the split and feeds in `hero` + `children`.

const KIND: Record<StepKind, { label: string; icon: string }> = {
  explain: { label: 'Concept', icon: 'BookOpen' },
  interactive: { label: 'Explore', icon: 'Sparkles' },
  quiz: { label: 'Check yourself', icon: 'CircleHelp' },
  recap: { label: 'Recap', icon: 'ListChecks' },
}

export function LessonShell({
  title,
  kind,
  current,
  total,
  hero,
  children,
  busy,
  canAdvance,
  onBack,
  onNext,
  onExit,
  accent = '#4f8cff',
}: {
  title: string
  kind: StepKind
  current: number
  total: number
  hero: ReactNode | null
  children: ReactNode
  busy: boolean
  canAdvance: boolean
  onBack: () => void
  onNext: () => void
  onExit?: () => void
  accent?: string
}) {
  const reduce = useReducedMotion()
  const isLast = current === total - 1
  const meta = KIND[kind] ?? KIND.explain
  // A lighter tint of the category accent — keeps the button/underline glow
  // monochromatic in the lesson's own colour (no fixed second hue).
  const accentLite = `color-mix(in srgb, ${accent} 48%, white)`

  const rise = reduce
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }
  const heroRise = reduce
    ? {}
    : { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 } }

  const panel = (
    <motion.div
      key={current}
      {...rise}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl sm:p-7"
      style={{ boxShadow: `0 36px 100px -44px ${accent}, inset 0 1px 0 rgba(255,255,255,0.06)` }}
    >
      {/* emblem */}
      <div
        className="mb-4 grid h-12 w-12 place-items-center rounded-2xl"
        style={{
          color: accent,
          background: `${accent}1f`,
          border: `1px solid ${accent}55`,
          boxShadow: `inset 0 0 18px ${accent}33`,
        }}
      >
        <Icon name={meta.icon} size={24} />
      </div>

      <span
        className="text-[11px] font-bold uppercase tracking-[0.18em]"
        style={{ color: accent }}
      >
        {meta.label}
      </span>
      <h1 className="mt-1 text-[26px] font-extrabold leading-tight sm:text-3xl">
        {title}
      </h1>
      <div
        className="mt-3 h-1 w-12 rounded-full"
        style={{ background: `linear-gradient(to right, ${accent}, ${accentLite})` }}
      />

      <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink/90">
        {children}
      </div>

      <div className="mt-7 flex items-center gap-3">
        {current > 0 && (
          <button
            type="button"
            onClick={onBack}
            disabled={busy}
            aria-label="Previous step"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-muted transition-colors hover:border-white/25 hover:text-ink disabled:opacity-40"
          >
            <Icon name="ArrowLeft" size={18} />
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={!canAdvance || busy}
          className="group relative grid h-12 flex-1 place-items-center rounded-2xl font-semibold text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
          style={{
            background: `linear-gradient(105deg, ${accent}, ${accentLite})`,
            boxShadow: `0 14px 38px -12px ${accent}`,
          }}
        >
          <span>{busy ? 'Saving…' : isLast ? 'Complete' : 'Continue'}</span>
          <span className="absolute right-2 grid h-8 w-8 place-items-center rounded-full bg-white/20">
            <Icon name={isLast ? 'Check' : 'ArrowRight'} size={16} />
          </span>
        </button>
      </div>
    </motion.div>
  )

  return (
    <div className="relative min-h-screen w-full">
      {/* exit pill */}
      {onExit && (
        <button
          type="button"
          onClick={onExit}
          className="fixed left-4 top-4 z-30 flex items-center gap-2.5 rounded-full border border-white/10 bg-black/35 py-1.5 pl-1.5 pr-4 text-left backdrop-blur-md transition-colors hover:border-white/25 hover:bg-black/55"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-ink">
            <Icon name="X" size={16} />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-ink">Exit</span>
            <span className="block text-[11px] text-muted">Leave lesson</span>
          </span>
        </button>
      )}

      {/* content — adaptive two-pane / single-column */}
      {hero ? (
        <div className="mx-auto flex min-h-screen w-full max-w-[1320px] flex-col items-center justify-center gap-8 px-4 pb-28 pt-24 lg:flex-row lg:gap-12 lg:pt-0">
          <motion.div
            key={`hero-${current}`}
            {...heroRise}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="flex w-full flex-1 items-center justify-center"
          >
            <div className="w-full max-w-[560px]">{hero}</div>
          </motion.div>
          <div className="w-full lg:max-w-[440px]">{panel}</div>
        </div>
      ) : (
        <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-4 pb-28 pt-24">
          <div className="w-full">{panel}</div>
        </div>
      )}

      {/* bottom step-dots */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-20 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          {Array.from({ length: total }).map((_, i) => {
            const isCurrent = i === current
            const isPast = i < current
            return (
              <span
                key={i}
                className={cn(
                  'rounded-full transition-all',
                  isCurrent ? 'h-2.5 w-2.5' : 'h-2 w-2',
                )}
                style={{
                  background: isCurrent
                    ? accent
                    : isPast
                      ? `${accent}aa`
                      : 'rgba(160,172,210,0.28)',
                  boxShadow: isCurrent ? `0 0 0 4px ${accent}33, 0 0 12px ${accent}` : undefined,
                }}
              />
            )
          })}
        </div>
        <span className="text-xs font-medium text-muted">
          {current + 1} of {total}
        </span>
      </div>
    </div>
  )
}
