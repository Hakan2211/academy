import { useState } from 'react'
import { cn } from '#/lib/cn'

// A clickable timeline of psychology's birth and major schools, including the
// women too often left out of the standard story (Calkins, Washburn).
const EVENTS = [
  { year: '1879', who: 'Wilhelm Wundt', what: 'Opens the first psychology lab in Leipzig — the moment psychology breaks away from philosophy to become a science.' },
  { year: '1890', who: 'William James', what: 'Publishes The Principles of Psychology and champions functionalism: asking what the mind is for, not just what it contains.' },
  { year: '1900', who: 'Sigmund Freud', what: 'The Interpretation of Dreams launches psychoanalysis and the idea of a powerful unconscious mind.' },
  { year: '1905', who: 'Mary Whiton Calkins', what: 'Becomes the first woman president of the APA — after Harvard refused her the PhD she had earned.' },
  { year: '1908', who: 'Margaret Floy Washburn', what: 'The first woman to earn a psychology PhD; her work on animal behaviour shapes comparative psychology.' },
  { year: '1913', who: 'John B. Watson', what: 'Declares that psychology should study only observable behaviour — the behaviourist manifesto.' },
  { year: '1938', who: 'B. F. Skinner', what: 'Formalises operant conditioning: behaviour is shaped by its consequences.' },
  { year: '1956', who: 'The Cognitive Revolution', what: 'Psychology turns back to the mind — memory, language, thinking — armed with the computer as a model.' },
  { year: '1960s', who: 'Humanistic Psychology', what: 'Maslow and Rogers add a "third force": human potential, growth and self-actualisation.' },
  { year: '1998', who: 'Positive Psychology', what: 'Seligman calls for a science not just of suffering but of what makes life worth living.' },
]

export function PsychTimeline() {
  const [sel, setSel] = useState(0)
  const e = EVENTS[sel]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex gap-1 overflow-x-auto pb-2">
        {EVENTS.map((ev, i) => (
          <button
            key={ev.year}
            type="button"
            onClick={() => setSel(i)}
            className={cn(
              'flex shrink-0 flex-col items-center gap-1 rounded-lg px-2.5 py-1.5 transition-colors',
              i === sel ? 'bg-accent/15 text-accent' : 'text-muted hover:text-ink',
            )}
          >
            <span className="font-mono text-xs font-semibold">{ev.year}</span>
            <span className={cn('h-2 w-2 rounded-full', i === sel ? 'bg-accent' : 'bg-border')} />
          </button>
        ))}
      </div>
      <div className="h-px w-full bg-border" />
      <div className="mt-3 rounded-xl bg-surface-2 p-4">
        <p className="font-mono text-sm text-accent">{e.year}</p>
        <p className="text-lg font-semibold text-ink">{e.who}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{e.what}</p>
      </div>
    </div>
  )
}
