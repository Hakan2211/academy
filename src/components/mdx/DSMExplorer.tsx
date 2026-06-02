import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A browser of the major DSM-5 categories of psychological disorder. Click a
// tile for a plain-language description and an everyday example. The point is
// that the DSM is a shared *map* — a common vocabulary that lets clinicians,
// researchers and insurers talk about the same thing — not a verdict on a person.
const CATEGORIES = [
  {
    name: 'Anxiety',
    icon: 'Wind',
    desc: 'Excessive, persistent fear or worry that is out of proportion to any real threat and is hard to switch off.',
    example: 'Generalized anxiety disorder, panic disorder, specific phobias, social anxiety.',
  },
  {
    name: 'Mood',
    icon: 'CloudRain',
    desc: 'Lasting disturbances of emotional state — a heavy, persistent low, or swings between extreme highs and lows.',
    example: 'Major depressive disorder, bipolar disorder.',
  },
  {
    name: 'Trauma & Stress',
    icon: 'Zap',
    desc: 'Distress that follows exposure to a frightening or overwhelming event and lingers long after the danger passes.',
    example: 'Post-traumatic stress disorder (PTSD), acute stress disorder.',
  },
  {
    name: 'Obsessive–Compulsive',
    icon: 'RefreshCw',
    desc: 'Intrusive, unwanted thoughts (obsessions) and repetitive acts (compulsions) done to relieve the anxiety they cause.',
    example: 'Obsessive-compulsive disorder (OCD).',
  },
  {
    name: 'Psychotic',
    icon: 'Sparkles',
    desc: 'A loss of contact with shared reality — perceptions and beliefs that others do not share.',
    example: 'Schizophrenia, schizoaffective disorder.',
  },
  {
    name: 'Personality',
    icon: 'UserCog',
    desc: 'Long-standing, inflexible patterns of inner experience and relating to others that cause distress or difficulty.',
    example: 'Borderline personality disorder, antisocial personality disorder.',
  },
  {
    name: 'Neurodevelopmental',
    icon: 'Baby',
    desc: 'Differences in brain development that emerge early in life and shape attention, learning, or social communication.',
    example: 'ADHD, autism spectrum disorder, learning disorders.',
  },
  {
    name: 'Eating',
    icon: 'Utensils',
    desc: 'Severe disturbances in eating behaviour and in how one experiences body weight and shape.',
    example: 'Anorexia nervosa, bulimia nervosa, binge-eating disorder.',
  },
  {
    name: 'Dissociative',
    icon: 'Layers',
    desc: 'A disruption in the normally smooth links between memory, identity, and awareness — often following trauma.',
    example: 'Dissociative identity disorder, dissociative amnesia.',
  },
] as const

export function DSMExplorer() {
  const [sel, setSel] = useState(0)
  const c = CATEGORIES[sel]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        The <span className="font-semibold text-ink">DSM</span> sorts hundreds of conditions into families. Tap a category to see what it covers.
      </p>

      <div className="grid grid-cols-3 gap-2">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.name}
            type="button"
            onClick={() => setSel(i)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-xl border p-2.5 text-center transition-colors',
              i === sel ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={cat.icon} size={20} />
            <span className="text-[11px] font-medium leading-tight">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 p-3">
        <p className="text-sm font-semibold text-ink">{c.name} disorders</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{c.desc}</p>
        <p className="mt-2 text-xs text-muted">
          <span className="font-semibold text-ink">Examples: </span>
          {c.example}
        </p>
      </div>
    </div>
  )
}
