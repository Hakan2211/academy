import { useState } from 'react'
import { cn } from '#/lib/cn'

// Mary's Room: Frank Jackson's famous knowledge argument against physicalism.
// A stepper walks through the scenario — grayscale room → color world → the
// philosophical punch. Uses SVG for the room visual (no rAF needed).

type Step = {
  id: number
  title: string
  body: string
  visual: 'bw' | 'color' | 'question' | 'reply'
}

const STEPS: Array<Step> = [
  {
    id: 0,
    title: 'The World\'s Greatest Color Scientist',
    body: 'Mary is an extraordinary neuroscientist. She has memorised every physical fact about color vision — the wavelengths of light, how the retina responds, which neurons fire, what brain states arise. She knows ALL the physical facts about what happens when people see red.',
    visual: 'bw',
  },
  {
    id: 1,
    title: 'The Black-and-White Room',
    body: 'There\'s a catch: Mary has spent her entire life in a black-and-white room. She has never personally seen a color. She reads her books on a monochrome screen, sees only grey walls, and has never looked out a window.',
    visual: 'bw',
  },
  {
    id: 2,
    title: 'The Moment of Liberation',
    body: 'One day, Mary leaves the room and sees a ripe tomato for the first time. She experiences red. Jackson\'s question: does Mary learn something new in that moment?',
    visual: 'color',
  },
  {
    id: 3,
    title: 'The Knowledge Argument',
    body: 'Jackson says: yes, she learns something new — what it FEELS like to see red, the quale of redness. But she already knew all the physical facts. Therefore, the physical facts don\'t capture everything about conscious experience. Knowing all the facts about brain states doesn\'t tell you what it\'s like to be in them. This seems to show physicalism is incomplete.',
    visual: 'question',
  },
  {
    id: 4,
    title: 'The Physicalist Reply',
    body: 'Physicalists push back hard. Knowing ABOUT an experience in the abstract is different from actually HAVING the experience — but that difference might be a difference in cognitive ability, not new factual knowledge. Mary gains a new way of recognising and remembering red, not new facts about the world. This is the "ability hypothesis": she learns to do something, not to know something new.',
    visual: 'reply',
  },
]

function RoomSVG({ visual }: { visual: Step['visual'] }) {
  const isColor = visual === 'color' || visual === 'question' || visual === 'reply'
  const wallFill = isColor ? '#1a1a2e' : '#2a2a2a'
  const floorFill = isColor ? '#16213e' : '#1a1a1a'
  const tomato = isColor ? '#e84040' : '#6b6b6b'
  const desk = isColor ? '#6b4226' : '#444'
  const monitor = isColor ? '#1a1a2e' : '#222'
  const monitorScreen = isColor ? '#4a90d9' : '#555'
  const bookColor = isColor ? '#4a7c59' : '#555'

  return (
    <svg viewBox="0 0 320 160" className="w-full rounded-xl" aria-hidden="true">
      {/* Room background */}
      <rect x="0" y="0" width="320" height="160" fill={wallFill} rx="8" />
      {/* Floor */}
      <rect x="0" y="110" width="320" height="50" fill={floorFill} />
      {/* Desk */}
      <rect x="60" y="85" width="160" height="25" fill={desk} rx="3" />
      <rect x="75" y="110" width="8" height="25" fill={desk} />
      <rect x="207" y="110" width="8" height="25" fill={desk} />
      {/* Monitor */}
      <rect x="120" y="52" width="60" height="38" fill={monitor} rx="3" />
      <rect x="124" y="56" width="52" height="28" fill={monitorScreen} rx="2" />
      {/* Books on desk */}
      <rect x="62" y="75" width="10" height="13" fill={bookColor} />
      <rect x="74" y="73" width="10" height="15" fill={isColor ? '#8b5cf6' : '#444'} />
      <rect x="86" y="76" width="10" height="12" fill={isColor ? '#f59e0b' : '#555'} />
      {/* Tomato */}
      <circle cx={isColor ? 240 : 240} cy={isColor ? 78 : 78} r="12" fill={tomato} />
      {isColor && (
        <ellipse cx="240" cy="67" rx="3" ry="5" fill="#2d5a27" transform="rotate(-10 240 67)" />
      )}
      {/* Window (only visible in bw room) */}
      {!isColor && (
        <rect x="260" y="20" width="40" height="50" fill="#333" stroke="#555" strokeWidth="2" rx="2" />
      )}
      {/* Colorful window for color room */}
      {isColor && (
        <>
          <rect x="260" y="20" width="40" height="50" fill="#87ceeb" stroke="#8b7355" strokeWidth="2" rx="2" />
          <rect x="262" y="22" width="17" height="22" fill="#87ceeb" />
          <rect x="281" y="22" width="17" height="22" fill="#b0e0e8" />
        </>
      )}
      {/* Overlay text for question step */}
      {visual === 'question' && (
        <>
          <rect x="10" y="8" width="200" height="28" fill="rgba(0,0,0,0.6)" rx="6" />
          <text x="20" y="27" fontSize="13" fill="#e8e8e8" fontFamily="sans-serif">
            Does she learn something new?
          </text>
        </>
      )}
      {visual === 'reply' && (
        <>
          <rect x="10" y="8" width="220" height="28" fill="rgba(0,0,0,0.6)" rx="6" />
          <text x="20" y="27" fontSize="13" fill="#e8e8e8" fontFamily="sans-serif">
            New ability, not new fact?
          </text>
        </>
      )}
    </svg>
  )
}

export function MarysRoom() {
  const [step, setStep] = useState(0)
  const current = STEPS[step]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Step indicators */}
      <div className="mb-4 flex items-center gap-1.5">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(i)}
            className={cn(
              'h-2 flex-1 rounded-full transition-colors',
              i === step ? 'bg-accent' : i < step ? 'bg-accent/40' : 'bg-border',
            )}
            aria-label={`Step ${i + 1}: ${s.title}`}
          />
        ))}
      </div>

      {/* Visual */}
      <div className="mb-4">
        <RoomSVG visual={current.visual} />
      </div>

      {/* Content */}
      <div className="mb-4 rounded-xl border border-border bg-surface-2 p-4">
        <h3 className="mb-2 text-sm font-semibold text-ink">{current.title}</h3>
        <p className="text-sm text-muted">{current.body}</p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className={cn(
            'rounded-lg border px-4 py-1.5 text-sm transition-colors',
            step === 0
              ? 'border-border text-muted opacity-40'
              : 'border-border text-muted hover:text-ink',
          )}
        >
          ← Back
        </button>
        <span className="text-xs text-muted">
          {step + 1} / {STEPS.length}
        </span>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
          className={cn(
            'rounded-lg border px-4 py-1.5 text-sm transition-colors',
            step === STEPS.length - 1
              ? 'border-border text-muted opacity-40'
              : 'border-accent bg-accent/15 text-accent hover:bg-accent/25',
          )}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
