import { useState } from 'react'
import type { ReactElement } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Identify the universal emotion from a schematic face. Ekman's research found
// six basic expressions that people across every culture recognise: happiness,
// sadness, anger, fear, surprise and disgust. Each is drawn here from a few
// SVG features — guess, then reveal.
type Emotion = 'happiness' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust'

const ORDER: Array<Emotion> = ['happiness', 'sadness', 'anger', 'fear', 'surprise', 'disgust']

const TELLS: Record<Emotion, string> = {
  happiness: 'Mouth corners pull up into a smile; cheeks raise and crinkle the eyes (a true "Duchenne" smile).',
  sadness: 'Mouth corners droop; inner eyebrows lift and draw together; eyelids sag.',
  anger: 'Brows pull down and together; eyes glare hard; lips press tight or bare the teeth.',
  fear: 'Brows raise and pull together; upper eyelids lift wide; mouth stretches open.',
  surprise: 'Brows arch high; eyes open wide and round; jaw drops, mouth forms an O.',
  disgust: 'Nose wrinkles; upper lip curls up; brows lower — the "something smells bad" face.',
}

// Each face: eyebrows (two paths), eyes, and a mouth path, drawn in a 120×120 box.
function Face({ emotion }: { emotion: Emotion }) {
  // shared eye + brow geometry tweaked per emotion
  const eyes: Record<Emotion, ReactElement> = {
    happiness: (
      <>
        <path d="M38 52 Q46 46 54 52" fill="none" stroke="#1d1d1f" strokeWidth="3" strokeLinecap="round" />
        <path d="M66 52 Q74 46 82 52" fill="none" stroke="#1d1d1f" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
    sadness: (
      <>
        <circle cx="46" cy="54" r="3.5" fill="#1d1d1f" />
        <circle cx="74" cy="54" r="3.5" fill="#1d1d1f" />
      </>
    ),
    anger: (
      <>
        <circle cx="46" cy="55" r="3.5" fill="#1d1d1f" />
        <circle cx="74" cy="55" r="3.5" fill="#1d1d1f" />
      </>
    ),
    fear: (
      <>
        <circle cx="46" cy="54" r="5" fill="#fff" stroke="#1d1d1f" strokeWidth="2" />
        <circle cx="46" cy="54" r="2.5" fill="#1d1d1f" />
        <circle cx="74" cy="54" r="5" fill="#fff" stroke="#1d1d1f" strokeWidth="2" />
        <circle cx="74" cy="54" r="2.5" fill="#1d1d1f" />
      </>
    ),
    surprise: (
      <>
        <circle cx="46" cy="54" r="6" fill="#fff" stroke="#1d1d1f" strokeWidth="2" />
        <circle cx="46" cy="54" r="3" fill="#1d1d1f" />
        <circle cx="74" cy="54" r="6" fill="#fff" stroke="#1d1d1f" strokeWidth="2" />
        <circle cx="74" cy="54" r="3" fill="#1d1d1f" />
      </>
    ),
    disgust: (
      <>
        <path d="M40 55 Q46 52 52 55" fill="none" stroke="#1d1d1f" strokeWidth="3" strokeLinecap="round" />
        <path d="M68 55 Q74 52 80 55" fill="none" stroke="#1d1d1f" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  }

  const brows: Record<Emotion, ReactElement> = {
    happiness: (
      <>
        <path d="M38 42 Q46 39 54 42" fill="none" stroke="#1d1d1f" strokeWidth="3" strokeLinecap="round" />
        <path d="M66 42 Q74 39 82 42" fill="none" stroke="#1d1d1f" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
    sadness: (
      <>
        <path d="M38 44 Q46 40 54 43" fill="none" stroke="#1d1d1f" strokeWidth="3" strokeLinecap="round" />
        <path d="M66 43 Q74 40 82 44" fill="none" stroke="#1d1d1f" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
    anger: (
      <>
        <path d="M38 40 L56 47" fill="none" stroke="#1d1d1f" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M82 40 L64 47" fill="none" stroke="#1d1d1f" strokeWidth="3.5" strokeLinecap="round" />
      </>
    ),
    fear: (
      <>
        <path d="M38 41 Q47 36 55 41" fill="none" stroke="#1d1d1f" strokeWidth="3" strokeLinecap="round" />
        <path d="M65 41 Q73 36 82 41" fill="none" stroke="#1d1d1f" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
    surprise: (
      <>
        <path d="M37 38 Q46 33 55 38" fill="none" stroke="#1d1d1f" strokeWidth="3" strokeLinecap="round" />
        <path d="M65 38 Q74 33 83 38" fill="none" stroke="#1d1d1f" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
    disgust: (
      <>
        <path d="M38 45 L54 44" fill="none" stroke="#1d1d1f" strokeWidth="3" strokeLinecap="round" />
        <path d="M66 44 L82 45" fill="none" stroke="#1d1d1f" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  }

  const mouths: Record<Emotion, ReactElement> = {
    happiness: <path d="M44 78 Q60 92 76 78" fill="none" stroke="#1d1d1f" strokeWidth="3.5" strokeLinecap="round" />,
    sadness: <path d="M44 86 Q60 74 76 86" fill="none" stroke="#1d1d1f" strokeWidth="3.5" strokeLinecap="round" />,
    anger: <path d="M44 84 L76 84" fill="none" stroke="#1d1d1f" strokeWidth="3.5" strokeLinecap="round" />,
    fear: <ellipse cx="60" cy="84" rx="11" ry="9" fill="#1d1d1f" />,
    surprise: <circle cx="60" cy="84" r="10" fill="#1d1d1f" />,
    disgust: (
      <>
        <path d="M44 82 Q60 90 76 82" fill="none" stroke="#1d1d1f" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M52 70 Q60 66 68 70" fill="none" stroke="#1d1d1f" strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
  }

  return (
    <svg viewBox="0 0 120 120" className="h-40 w-40">
      <circle cx="60" cy="62" r="50" fill="#FFE0B2" stroke="#FF7043" strokeWidth="2.5" />
      {brows[emotion]}
      {eyes[emotion]}
      {mouths[emotion]}
    </svg>
  )
}

export function FacialExpressions() {
  const [i, setI] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const emotion = ORDER[i]

  const next = () => {
    setI((v) => (v + 1) % ORDER.length)
    setRevealed(false)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="mb-2 text-center text-sm text-muted">Which universal emotion is this face showing?</p>

      <div className="flex justify-center">
        <Face emotion={emotion} />
      </div>

      {revealed ? (
        <div className="mt-2 rounded-xl bg-surface-2 p-3 text-center">
          <p className="text-base font-semibold capitalize text-accent">{emotion}</p>
          <p className="mt-1 text-sm leading-snug text-muted">{TELLS[emotion]}</p>
        </div>
      ) : (
        <p className="mt-2 text-center text-xs text-muted">Make your guess, then reveal.</p>
      )}

      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setRevealed(true)}
          disabled={revealed}
          className={cn(
            'flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition-colors',
            revealed ? 'border-border text-muted opacity-50' : 'border-accent bg-accent/15 text-accent hover:bg-accent/25',
          )}
        >
          <Icon name="Eye" size={14} /> Reveal
        </button>
        <button
          type="button"
          onClick={next}
          className="flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-sm text-muted hover:text-ink"
        >
          Next face <Icon name="ArrowRight" size={14} />
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        These six expressions are recognised in <span className="text-ink">every culture studied</span> — even by people
        with no exposure to outside media — strong evidence that they are biologically universal.
      </p>
    </div>
  )
}
