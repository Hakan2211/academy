import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'

// HTML gives a page structure; CSS gives it style; JavaScript gives it BEHAVIOUR
// — it runs in response to events and changes the page on the fly. This demo is
// real (it IS JavaScript running in your browser right now): the counter buttons
// and the theme toggle actually work. Watching them respond is the whole point —
// that live reaction to a click is what JS adds to a page.

const TRIO = [
  { tag: 'HTML', role: 'Structure', desc: 'the tags and content', color: '#FF6B6B', icon: 'FileCode2' },
  { tag: 'CSS', role: 'Style', desc: 'colours, spacing, layout', color: '#5B6CFF', icon: 'Palette' },
  { tag: 'JS', role: 'Behaviour', desc: 'what happens when you act', color: '#FFC83D', icon: 'Zap' },
] as const

export function JsInteractive() {
  const [count, setCount] = useState(0)
  const [dark, setDark] = useState(true)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-4 grid grid-cols-3 gap-2">
        {TRIO.map((t) => (
          <div key={t.tag} className="rounded-lg border border-border bg-surface-2 p-2 text-center">
            <Icon name={t.icon} size={16} style={{ color: t.color }} className="mx-auto" />
            <div className="mt-1 text-xs font-bold" style={{ color: t.color }}>{t.tag}</div>
            <div className="text-[10px] font-semibold text-ink">{t.role}</div>
            <div className="text-[9px] text-muted">{t.desc}</div>
          </div>
        ))}
      </div>

      {/* The live mini-app. JS = the click handlers that change state below. */}
      <div
        className="rounded-xl border p-4 transition-colors"
        style={
          dark
            ? { background: '#0f172a', borderColor: '#334155', color: '#e2e8f0' }
            : { background: '#f8fafc', borderColor: '#cbd5e1', color: '#0f172a' }
        }
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold opacity-70">live demo — really running</span>
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors"
            style={dark ? { borderColor: '#475569' } : { borderColor: '#94a3b8' }}
          >
            <Icon name={dark ? 'Moon' : 'Sun'} size={13} />
            {dark ? 'Dark' : 'Light'}
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setCount((c) => c - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border text-xl font-bold transition-transform active:scale-90"
            style={dark ? { borderColor: '#475569' } : { borderColor: '#94a3b8' }}
            aria-label="decrease"
          >
            −
          </button>
          <div className="min-w-[3ch] text-center text-4xl font-black tabular-nums">{count}</div>
          <button
            type="button"
            onClick={() => setCount((c) => c + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border text-xl font-bold transition-transform active:scale-90"
            style={dark ? { borderColor: '#475569' } : { borderColor: '#94a3b8' }}
            aria-label="increase"
          >
            +
          </button>
        </div>
        <div className="mt-2 text-center text-xs opacity-60">
          {count === 0 ? 'press + or − — the number reacts instantly' : `clicked into the ${count > 0 ? 'positives' : 'negatives'}`}
        </div>
      </div>

      <pre className="mt-3 rounded-lg border border-border bg-surface-2 p-3 font-mono text-xs leading-5 text-ink">{`// JavaScript listens for an event, then changes the page:
button.addEventListener('click', () => {
  count = count + 1          // update some state
  display.textContent = count // change what's on screen
})`}</pre>

      <p className="mt-3 text-center text-xs text-muted">
        The buttons above genuinely work — that's <span className="text-ink">JavaScript</span> reacting to <span className="text-ink">events</span> and updating the page. HTML and CSS are static; <span className="text-ink">JS makes a page do things</span>.
      </p>
    </div>
  )
}
