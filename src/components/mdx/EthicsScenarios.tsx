import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Real and classic study scenarios, one at a time. For each, decide which
// ethical principle was most violated; the component tells you whether you are
// right and explains what went wrong and what modern rules now require. Drives
// home that informed consent, the limits of deception, protection from harm and
// the right to withdraw are not abstractions — they were written in response to
// studies that hurt people. Used in research-ethics.

type Principle = 'consent' | 'deception' | 'harm' | 'confidentiality'

const PRINCIPLES: Record<Principle, { label: string; icon: string }> = {
  consent: { label: 'Informed consent', icon: 'FileSignature' },
  deception: { label: 'Deception & debriefing', icon: 'Drama' },
  harm: { label: 'Protection from harm', icon: 'HeartPulse' },
  confidentiality: { label: 'Confidentiality', icon: 'Lock' },
}

type Scenario = {
  title: string
  body: string
  answer: Principle
  why: string
}

const SCENARIOS: Array<Scenario> = [
  {
    title: 'The Tuskegee study',
    body: 'For 40 years, researchers tracked the progression of syphilis in poor Black men — telling them they were being treated for "bad blood," and deliberately withholding penicillin even after it became the standard cure.',
    answer: 'harm',
    why: 'The men were exposed to grave, lifelong harm — a known cure was deliberately withheld. The fallout reshaped US research law and is the textbook case for protection from harm (and for the consent they were never given).',
  },
  {
    title: 'Milgram’s obedience study',
    body: 'Participants were ordered to deliver what they believed were increasingly painful electric shocks to a stranger. The shocks were fake and the "victim" an actor, but participants were not told this until afterward.',
    answer: 'deception',
    why: 'The study relied on deception: participants had to believe the shocks were real. That can be permissible only when the deception is necessary and followed by a thorough debriefing that reveals the truth and checks on the participant.',
  },
  {
    title: 'A surprise emotion study',
    body: 'Students sign up for "a survey about food." Without being told, their social-media feeds are quietly altered to show more negative posts, and their later mood is measured.',
    answer: 'consent',
    why: 'Participants never agreed to have their emotions experimentally manipulated — they consented to something else. Informed consent means knowing what you are actually signing up for before it happens.',
  },
  {
    title: 'The leaked questionnaire',
    body: 'A researcher studying drug use stores the responses — names attached — in a shared folder, and a list of who admitted to illegal use later leaks to others on campus.',
    answer: 'confidentiality',
    why: 'Data that can identify participants must be kept private and secure. Breaking confidentiality can expose people to real-world consequences they never agreed to risk.',
  },
]

export function EthicsScenarios() {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<Principle | null>(null)
  const s = SCENARIOS[i]
  const correct = picked === s.answer

  const go = (d: 1 | -1) => {
    setI((v) => (v + d + SCENARIOS.length) % SCENARIOS.length)
    setPicked(null)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          Scenario {i + 1} of {SCENARIOS.length}
        </p>
        <div className="flex gap-1">
          <button type="button" onClick={() => go(-1)} aria-label="previous" className="rounded-full border border-border p-1 text-muted hover:text-ink">
            <Icon name="ChevronLeft" size={16} />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="next" className="rounded-full border border-border p-1 text-muted hover:text-ink">
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>
      </div>

      <div className="mt-2 rounded-xl bg-surface-2 p-4">
        <p className="text-base font-semibold text-ink">{s.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
      </div>

      <p className="mb-1.5 mt-3 text-sm text-muted">Which principle is most at stake?</p>
      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(PRINCIPLES) as Array<Principle>).map((p) => {
          const isPicked = picked === p
          const reveal = picked !== null
          return (
            <button
              key={p}
              type="button"
              onClick={() => setPicked(p)}
              className={cn(
                'flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors',
                reveal && p === s.answer
                  ? 'border-success bg-success/15 text-success'
                  : isPicked
                    ? 'border-[#E67E22] bg-[#E67E22]/15 text-[#E67E22]'
                    : 'border-border text-muted hover:text-ink',
              )}
            >
              <Icon name={PRINCIPLES[p].icon} size={16} />
              {PRINCIPLES[p].label}
            </button>
          )
        })}
      </div>

      {picked && (
        <div className="mt-3 flex gap-2 rounded-xl border border-border bg-surface-2 p-3">
          <span className={cn('mt-0.5 shrink-0', correct ? 'text-success' : 'text-[#E67E22]')}>
            <Icon name={correct ? 'CheckCircle2' : 'Info'} size={16} />
          </span>
          <p className="text-sm leading-snug text-ink">
            <span className={cn('font-semibold', correct ? 'text-success' : 'text-[#E67E22]')}>
              {correct ? 'Right. ' : `The clearest answer is ${PRINCIPLES[s.answer].label.toLowerCase()}. `}
            </span>
            {s.why}
          </p>
        </div>
      )}
    </div>
  )
}
