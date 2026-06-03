import { useState } from 'react'
import { cn } from '#/lib/cn'
import { Icon } from '#/components/ui/Icon'

// Kant's idea that the mind shapes experience. "Raw reality" passes through
// the mind's built-in lenses — space, time, causation — before becoming
// "experienced reality." Toggle off the spectacles to see what the noumenal
// (thing-in-itself) would be... and discover we can't even picture it.

type Lens = {
  id: string
  label: string
  icon: string
  description: string
  withLens: string
  withoutLens: string
}

const LENSES: Lens[] = [
  {
    id: 'space',
    label: 'Space',
    icon: 'Move',
    description: 'Objects appear located in three-dimensional space — near or far, left or right, large or small.',
    withLens: 'You see a tree standing twenty metres away, taller than you, rooted in the ground to your left.',
    withoutLens: '??? — Without the spatial lens, "near," "far," "left," and "right" dissolve. There is no location. The very idea of "where" disappears.',
  },
  {
    id: 'time',
    label: 'Time',
    icon: 'Clock',
    description: 'Events appear arranged in sequence — before and after, cause and effect, past and future.',
    withLens: 'You hear thunder after lightning; you remember yesterday; you anticipate tomorrow.',
    withoutLens: '??? — Without the temporal lens, "before" and "after" vanish. There is no sequence, no memory, no anticipation — just an undifferentiated... something.',
  },
  {
    id: 'causation',
    label: 'Causation',
    icon: 'GitMerge',
    description: 'Events appear connected — some things bring about others. We expect effects to follow causes.',
    withLens: 'You drop the cup and expect it to fall. You see fire and expect heat. Cause precedes effect.',
    withoutLens: '??? — Without causation, events become disconnected flickers. Nothing leads to anything else. The cup falls — or doesn\'t — for no reason, or for every reason, or neither.',
  },
]

export function KantSpectacles() {
  const [spectaclesOn, setSpectaclesOn] = useState(true)
  const [activeLens, setActiveLens] = useState(0)

  const lens = LENSES[activeLens]!

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Kant argued the mind supplies three built-in "spectacles" through which all experience is filtered.
        Explore each lens — then try removing them.
      </p>

      {/* Spectacles toggle */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-surface-2 px-3 py-2">
        <div className="flex items-center gap-2 text-sm">
          <Icon name="Glasses" size={16} className={spectaclesOn ? 'text-accent' : 'text-muted'} />
          <span className={cn('font-semibold', spectaclesOn ? 'text-accent' : 'text-muted')}>
            {spectaclesOn ? 'Spectacles: ON — structured experience' : 'Spectacles: OFF — raw noumenal reality'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setSpectaclesOn((v) => !v)}
          className={cn(
            'flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
            spectaclesOn
              ? 'border-warn/60 text-warn hover:bg-warn/10'
              : 'border-accent bg-accent/15 text-accent hover:bg-accent/25',
          )}
        >
          {spectaclesOn ? (
            <>
              <Icon name="EyeOff" size={12} />
              Remove
            </>
          ) : (
            <>
              <Icon name="Eye" size={12} />
              Put on
            </>
          )}
        </button>
      </div>

      {/* Lens selector */}
      <div className="mb-4 flex gap-2">
        {LENSES.map((l, i) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setActiveLens(i)}
            className={cn(
              'flex flex-1 flex-col items-center rounded-xl border px-2 py-2 text-xs transition-colors',
              i === activeLens
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={l.icon as Parameters<typeof Icon>[0]['name']} size={14} className="mb-1" />
            <span className="font-semibold">{l.label}</span>
          </button>
        ))}
      </div>

      {/* Perception diagram */}
      <div className="mb-4 flex items-center gap-2 text-xs">
        <div className="flex-1 rounded-lg border border-border bg-surface-2 p-2 text-center text-muted">
          <div className="mb-1 font-semibold text-ink">Noumenal Reality</div>
          <div className="italic">"Thing-in-itself" — unknowable</div>
        </div>
        <Icon name="ArrowRight" size={14} className="shrink-0 text-muted" />
        <div
          className={cn(
            'flex-1 rounded-lg border p-2 text-center transition-colors',
            spectaclesOn
              ? 'border-accent/40 bg-accent/10'
              : 'border-warn/40 bg-warn/10',
          )}
        >
          <div className={cn('mb-1 font-semibold', spectaclesOn ? 'text-accent' : 'text-warn')}>
            {spectaclesOn ? 'Mind\'s Lens' : 'Lens Removed'}
          </div>
          <div className={cn('text-xs', spectaclesOn ? 'text-accent' : 'text-warn')}>
            {spectaclesOn ? lens.label : '???'}
          </div>
        </div>
        <Icon name="ArrowRight" size={14} className="shrink-0 text-muted" />
        <div className="flex-1 rounded-lg border border-border bg-surface-2 p-2 text-center text-muted">
          <div className="mb-1 font-semibold text-ink">Phenomenal Experience</div>
          <div className="italic">What we actually perceive</div>
        </div>
      </div>

      {/* Lens detail */}
      <div className={cn(
        'mb-4 rounded-xl border p-3 text-sm transition-colors',
        spectaclesOn ? 'border-accent/40 bg-accent/10' : 'border-warn/40 bg-warn/10',
      )}>
        <div className={cn('mb-2 font-semibold', spectaclesOn ? 'text-accent' : 'text-warn')}>
          {spectaclesOn ? `With the ${lens.label} lens` : `Without the ${lens.label} lens`}
        </div>
        <p className="text-ink">
          {spectaclesOn ? lens.withLens : lens.withoutLens}
        </p>
        {!spectaclesOn && (
          <p className="mt-2 text-muted text-xs">
            Notice: you cannot actually imagine this. The mind won't let you — because{' '}
            <span className="font-semibold">{lens.label.toLowerCase()}</span> is a condition of experience
            itself, not something that can simply be switched off. That's Kant's point.
          </p>
        )}
      </div>

      {/* Kant's insight box */}
      {!spectaclesOn && (
        <div className="mb-4 rounded-xl border border-warn/50 bg-warn/10 p-3 text-sm">
          <div className="mb-1 flex items-center gap-2 font-semibold text-warn">
            <Icon name="Lightbulb" size={14} />
            Kant's Copernican Revolution
          </div>
          <p className="text-muted">
            We cannot perceive "things as they are in themselves" (noumena) — only things as they
            appear to minds structured by space, time, and causation (phenomena). The mind doesn't
            passively receive reality; it actively <span className="font-semibold text-ink">constitutes</span> it.
            Objects conform to our minds, not the reverse.
          </p>
        </div>
      )}

      {spectaclesOn && (
        <div className="rounded-xl border border-border bg-surface-2 p-3 text-sm">
          <p className="text-muted">
            <span className="font-semibold text-ink">{lens.label}:</span> {lens.description}
          </p>
          <p className="mt-2 text-xs text-muted italic">
            Try removing the spectacles to see what experience would be like without this lens.
          </p>
        </div>
      )}
    </div>
  )
}
