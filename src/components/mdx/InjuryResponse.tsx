import { useState } from 'react'
import { cn } from '#/lib/cn'

// Everyday-injury scenario → correct-action exercise for the Health island.
// User picks from 3–4 options; correct answer reveals the full first-aid rationale.

type Option = {
  text: string
  correct: boolean
  why: string
}

type Scenario = {
  id: string
  emoji: string
  title: string
  situation: string
  options: Option[]
}

const SCENARIOS: Scenario[] = [
  {
    id: 'cut',
    emoji: '🩸',
    title: 'Bad Cut',
    situation: "Someone has a deep cut on their forearm that is bleeding steadily. What do you do first?",
    options: [
      {
        text: 'Apply firm, direct pressure with a clean cloth and hold for at least 10 minutes',
        correct: true,
        why: 'Firm direct pressure is the gold-standard first step for controlling bleeding. It allows clotting to occur. Keep pressing — don\'t keep lifting the cloth to check, as this disturbs the clot.',
      },
      {
        text: 'Rinse the wound under cold running water for 20 minutes',
        correct: false,
        why: 'Running water is the right approach for burns, not active bleeding. For a cut, controlling the bleeding with direct pressure comes first.',
      },
      {
        text: 'Apply a tourniquet immediately above the wound',
        correct: false,
        why: 'Tourniquets are a last resort for life-threatening limb bleeding that cannot be controlled by pressure. For a steady but non-arterial cut, direct pressure is the correct first step.',
      },
    ],
  },
  {
    id: 'burn',
    emoji: '🔥',
    title: 'Burn Injury',
    situation: "A person spills boiling water on their arm. The skin is red and painful. What is the right first response?",
    options: [
      {
        text: 'Apply butter or toothpaste to soothe the burn',
        correct: false,
        why: 'Butter, toothpaste, and other home remedies trap heat in the skin and can cause infection. Never apply them to a burn.',
      },
      {
        text: 'Cool under cool running water for at least 20 minutes, then loosely cover',
        correct: true,
        why: 'Cool (not ice-cold) running water removes heat from the tissue, limits the depth of the burn, and eases pain. 20 minutes is the minimum. Never use ice — it can damage the skin further. Do not pop blisters.',
      },
      {
        text: 'Cover with a tight bandage immediately to prevent infection',
        correct: false,
        why: 'Wrapping tightly before cooling traps heat. Always cool the burn first with running water for at least 20 minutes, then cover loosely with a sterile dressing or cling film.',
      },
    ],
  },
  {
    id: 'sprain',
    emoji: '🦶',
    title: 'Sprained Ankle',
    situation: "Someone rolls their ankle and it swells quickly. They can bear some weight but it is painful. What first-aid approach helps?",
    options: [
      {
        text: 'Massage the ankle firmly to loosen tight tissues',
        correct: false,
        why: 'Massaging an acute sprain increases blood flow and inflammation, worsening swelling and pain. Rest and ice are the right approach.',
      },
      {
        text: 'Encourage them to walk it off — movement speeds healing',
        correct: false,
        why: 'Walking on a freshly sprained ankle can worsen ligament damage. The RICE protocol (Rest, Ice, Compression, Elevation) reduces initial swelling and pain.',
      },
      {
        text: 'RICE: Rest, apply Ice wrapped in cloth, Compress with a bandage, Elevate the leg',
        correct: true,
        why: 'RICE (Rest, Ice, Compression, Elevation) is the standard first-aid response for sprains. Ice reduces swelling — never apply directly to skin. Compression and elevation further reduce fluid build-up. If they cannot bear weight at all, seek medical assessment for a possible fracture.',
      },
    ],
  },
  {
    id: 'nosebleed',
    emoji: '🩹',
    title: 'Nosebleed',
    situation: "A child has a spontaneous nosebleed that has been going for two minutes. What do you do?",
    options: [
      {
        text: 'Tilt the head back so blood runs down the throat',
        correct: false,
        why: 'Tilting the head back allows blood to run into the throat, which can cause nausea or be inhaled. Always lean forward.',
      },
      {
        text: 'Lean slightly forward, pinch the soft part of the nose, and breathe through the mouth for 10–15 minutes',
        correct: true,
        why: 'Leaning forward stops blood flowing into the throat. Pinching the soft, fleshy part of the nose (not the bony bridge) applies pressure to the bleeding vessels. Hold for 10–15 minutes without releasing to check. Seek medical help if it has not stopped after 30 minutes or if the person is on blood thinners.',
      },
      {
        text: 'Pack the nostrils tightly with tissue and leave it in place',
        correct: false,
        why: 'Packing with tissue can make it harder to apply sustained pressure and may leave fibres in the wound. Lean forward and pinch the soft part of the nose firmly instead.',
      },
    ],
  },
]

export function InjuryResponse() {
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)

  const scenario = SCENARIOS[scenarioIdx]
  const chosen = selected !== null ? scenario.options[selected] : null

  function changeScenario(idx: number) {
    setScenarioIdx(idx)
    setSelected(null)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Scenario tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => changeScenario(i)}
            className={cn(
              'flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors',
              i === scenarioIdx
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <span>{s.emoji}</span>
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {/* Scenario situation */}
      <div className="mb-4 rounded-xl border border-border bg-surface-2 px-4 py-3">
        <p className="text-sm font-medium text-ink">{scenario.situation}</p>
      </div>

      {/* Options */}
      <div className="mb-3 space-y-2">
        {scenario.options.map((opt, i) => {
          const isSelected = selected === i
          const showResult = selected !== null
          return (
            <button
              key={i}
              type="button"
              disabled={selected !== null}
              onClick={() => setSelected(i)}
              className={cn(
                'w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors',
                !showResult && 'border-border text-ink hover:border-accent hover:text-accent',
                showResult && isSelected && opt.correct && 'border-accent bg-accent/15 text-accent',
                showResult && isSelected && !opt.correct && 'border-warn bg-warn/10 text-warn',
                showResult && !isSelected && 'border-border text-muted opacity-50',
              )}
            >
              {opt.text}
            </button>
          )
        })}
      </div>

      {/* Reveal feedback */}
      {chosen !== null && (
        <div
          className={cn(
            'rounded-xl border px-4 py-3 text-sm',
            chosen.correct
              ? 'border-accent/40 bg-accent/10 text-ink'
              : 'border-warn/50 bg-warn/10 text-ink',
          )}
        >
          <p className={cn('mb-1 font-semibold', chosen.correct ? 'text-accent' : 'text-warn')}>
            {chosen.correct ? 'Correct!' : 'Not quite.'}
          </p>
          <p className="text-xs leading-relaxed">{chosen.why}</p>
        </div>
      )}

      {selected !== null && (
        <button
          type="button"
          onClick={() => changeScenario(scenarioIdx)}
          className="mt-3 w-full rounded-xl border border-border px-4 py-2 text-xs text-muted transition-colors hover:text-ink"
        >
          Try again
        </button>
      )}

      <p className="mt-3 text-center text-xs text-muted">
        Simplified scenarios — always seek professional medical help for serious injuries.
      </p>
    </div>
  )
}
