import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The four attachment patterns from Ainsworth's Strange Situation: how the
// infant reacts when the caregiver LEAVES and then RETURNS. Built on Harlow's
// finding that contact comfort — not just feeding — creates the bond. Click a
// style for its separation + reunion behaviour and its likely roots.
const STYLES = [
  {
    key: 'secure',
    name: 'Secure',
    icon: 'Heart',
    color: '#27AE60',
    share: '~60%',
    separation: 'Visibly upset when the caregiver leaves — they had used them as a "secure base" for exploring.',
    reunion: 'Quickly comforted on their return, then happily goes back to playing.',
    root: 'Caregivers who are sensitive and consistently responsive. The child trusts that comfort will be there.',
  },
  {
    key: 'anxious',
    name: 'Anxious-ambivalent',
    icon: 'Waves',
    color: '#E67E22',
    share: '~10%',
    separation: 'Intensely distressed — often too anxious to explore even before the caregiver leaves.',
    reunion: 'Seeks contact yet resists it: reaches to be held, then pushes away, hard to soothe.',
    root: 'Inconsistent caregiving — sometimes warm, sometimes unavailable — so the child never knows what to expect.',
  },
  {
    key: 'avoidant',
    name: 'Avoidant',
    icon: 'ShieldOff',
    color: '#3498DB',
    share: '~20%',
    separation: 'Shows little distress when the caregiver leaves; seems indifferent.',
    reunion: 'Avoids or ignores the caregiver on their return, as if they don\'t much matter.',
    root: 'Caregivers who are consistently distant or rebuffing, so the child learns to suppress its need for comfort.',
  },
  {
    key: 'disorganized',
    name: 'Disorganized',
    icon: 'Shuffle',
    color: '#A29BFE',
    share: '~10%',
    separation: 'Confused, contradictory reactions — no consistent strategy for handling the stress.',
    reunion: 'Dazed, frozen or jerky approaches — may move toward the caregiver then suddenly freeze or back away.',
    root: 'Often linked to frightening, unpredictable or abusive care: the source of comfort is also the source of fear.',
  },
] as const

export function AttachmentStyles() {
  const [i, setI] = useState(0)
  const s = STYLES[i]

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STYLES.map((st, k) => (
          <button
            key={st.key}
            type="button"
            onClick={() => setI(k)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-xl border px-2 py-2 transition-colors',
              k === i ? 'border-accent bg-accent/15' : 'border-border hover:border-accent/40',
            )}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${st.color}22`, color: st.color }}>
              <Icon name={st.icon} size={18} />
            </span>
            <span className={cn('text-center text-xs font-semibold leading-tight', k === i ? 'text-accent' : 'text-ink')}>
              {st.name}
            </span>
            <span className="text-[10px] text-muted">{st.share}</span>
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-surface-2 p-3">
        <p className="text-sm font-semibold" style={{ color: s.color }}>
          {s.name}
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg bg-surface p-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">On separation</p>
            <p className="mt-0.5 text-sm leading-snug text-ink">{s.separation}</p>
          </div>
          <div className="rounded-lg bg-surface p-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">On reunion</p>
            <p className="mt-0.5 text-sm leading-snug text-ink">{s.reunion}</p>
          </div>
        </div>
        <p className="mt-2 text-sm leading-snug text-muted">
          <span className="font-semibold text-ink">Likely root: </span>
          {s.root}
        </p>
      </div>

      <p className="mt-2 px-1 text-xs leading-snug text-muted">
        Harlow's monkeys showed why bonds form at all: given a wire "mother" that fed them and a soft cloth "mother" that
        didn't, infant monkeys clung to the cloth one — proof that <span className="text-ink">contact comfort</span>, not just food, builds attachment.
      </p>
    </div>
  )
}
