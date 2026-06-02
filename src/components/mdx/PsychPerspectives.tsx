import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// One behaviour seen through the seven major perspectives of psychology. Pick a
// behaviour; each lens offers its own explanation. The book's signature move —
// reused in the World 1 deep-dive on aggression.
type Behavior = 'aggression' | 'anxiety' | 'love'

const LENSES = [
  { key: 'biological', name: 'Biological', icon: 'Brain', color: '#FF6B9D' },
  { key: 'evolutionary', name: 'Evolutionary', icon: 'Bird', color: '#E67E22' },
  { key: 'psychodynamic', name: 'Psychodynamic', icon: 'Waves', color: '#A29BFE' },
  { key: 'behaviorist', name: 'Behaviourist', icon: 'Bell', color: '#27AE60' },
  { key: 'cognitive', name: 'Cognitive', icon: 'Cpu', color: '#3498DB' },
  { key: 'humanistic', name: 'Humanistic', icon: 'Sun', color: '#FDCB6E' },
  { key: 'sociocultural', name: 'Sociocultural', icon: 'Users', color: '#F7B731' },
] as const

const EXPLAIN: Record<Behavior, Record<string, string>> = {
  aggression: {
    biological: 'Testosterone, a hyper-reactive amygdala, or low serotonin tip the balance toward attack.',
    evolutionary: 'Aggression once helped win mates, defend territory and protect kin — so the capacity was selected for.',
    psychodynamic: 'A buried death drive and frustration leak out as hostility, often displaced onto a safer target.',
    behaviorist: 'Aggression that was rewarded — by getting one’s way or by status — is learned and repeated.',
    cognitive: 'Hostile attribution bias: ambiguous acts ("they bumped me") are read as deliberate provocations.',
    humanistic: 'Blocked growth and a gap between the real and ideal self breed frustration that erupts as anger.',
    sociocultural: 'Cultures of honour, violent norms and modelled behaviour teach when aggression is "appropriate".',
  },
  anxiety: {
    biological: 'An over-active fear circuit and imbalanced GABA leave the alarm system stuck on.',
    evolutionary: 'A readiness to fear snakes, heights and social rejection kept our ancestors alive.',
    psychodynamic: 'Anxiety signals unconscious conflict pushing toward awareness; defences hold it back.',
    behaviorist: 'A neutral situation paired with a scare becomes a learned trigger through conditioning.',
    cognitive: 'Catastrophic thinking — "this will be a disaster" — manufactures and magnifies the threat.',
    humanistic: 'Living out of step with one’s true self and values produces a deep, nagging unease.',
    sociocultural: 'Pressure to meet cultural ideals of success and image fuels chronic worry.',
  },
  love: {
    biological: 'Dopamine, oxytocin and vasopressin drive attraction, bonding and attachment.',
    evolutionary: 'Pair-bonding kept partners together long enough to raise vulnerable offspring.',
    psychodynamic: 'Early attachment to caregivers shapes the partners and patterns we are drawn to as adults.',
    behaviorist: 'We come to love those whose presence is paired with reward, comfort and good feelings.',
    cognitive: 'How we interpret a racing heart — "I’m in love" vs "I’m nervous" — shapes the feeling itself.',
    humanistic: 'Love flourishes with unconditional positive regard — being fully accepted as we are.',
    sociocultural: 'Culture scripts who is desirable, how courtship works and what "love" is even supposed to mean.',
  },
}

export function PsychPerspectives() {
  const [behavior, setBehavior] = useState<Behavior>('aggression')

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {(['aggression', 'anxiety', 'love'] as Array<Behavior>).map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => setBehavior(b)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              behavior === b ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {b}
          </button>
        ))}
      </div>

      <p className="mb-2 text-sm text-muted">
        Why do people experience <span className="font-semibold text-ink">{behavior}</span>? Seven lenses, seven answers:
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        {LENSES.map((l) => (
          <div key={l.key} className="rounded-xl border border-border bg-surface-2 p-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${l.color}22`, color: l.color }}>
                <Icon name={l.icon} size={16} />
              </span>
              <span className="text-sm font-semibold text-ink">{l.name}</span>
            </div>
            <p className="mt-1.5 text-sm leading-snug text-muted">{EXPLAIN[behavior][l.key]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
