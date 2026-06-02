import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A real app is split across two places. The FRONT-END runs in your browser:
// the HTML/CSS/JS that draws the screen and reacts to clicks. The BACK-END runs
// on a server you never see, where the DATABASE lives. They talk over an API:
// the front-end sends a request, the back-end queries the database and replies
// with JSON, and the front-end uses it to update the screen. Step through to see
// exactly where each piece runs.

type Step = {
  side: 'front' | 'back'
  title: string
  detail: string
}

const STEPS: Array<Step> = [
  { side: 'front', title: 'You click "Load profile"', detail: 'In the browser, a JavaScript event handler fires. The front-end has the markup but not the data yet.' },
  { side: 'front', title: 'Front-end calls the API', detail: 'It sends an HTTP request across the internet: GET /api/user/42 — asking the server for some data.' },
  { side: 'back', title: 'Back-end queries the database', detail: 'On the server, code receives the request and asks the database for user 42. The database lives here, never in the browser.' },
  { side: 'back', title: 'Back-end replies with JSON', detail: 'The server packages the result as JSON — plain text describing data — and sends it back as the HTTP response.' },
  { side: 'front', title: 'Front-end updates the screen', detail: 'The browser receives the JSON and JavaScript drops the values into the page. You see your profile appear — no reload.' },
]

const RESPONSE = `{ "id": 42, "name": "Nora", "joined": 2021 }`

export function FrontBackEnd() {
  const [step, setStep] = useState(0)
  const s = STEPS[step]
  const onFront = s.side === 'front'

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {/* FRONT-END */}
        <div
          className={cn(
            'rounded-xl border-2 p-3 transition-all',
            onFront ? 'border-accent bg-accent/10' : 'border-border bg-surface-2/40',
          )}
        >
          <div className="flex items-center gap-2">
            <Icon name="Monitor" size={16} className={onFront ? 'text-accent' : 'text-muted'} />
            <span className={cn('text-sm font-bold', onFront ? 'text-accent' : 'text-muted')}>Front-end</span>
            <span className="ml-auto text-[10px] text-muted">runs in your browser</span>
          </div>
          <div className="mt-2 space-y-1 text-[11px] text-muted">
            <div className="flex items-center gap-1.5"><Icon name="FileCode2" size={11} /> HTML · CSS · JavaScript</div>
            <div className="flex items-center gap-1.5"><Icon name="MousePointerClick" size={11} /> draws the screen, handles clicks</div>
          </div>
        </div>

        {/* BACK-END */}
        <div
          className={cn(
            'rounded-xl border-2 p-3 transition-all',
            !onFront ? 'border-accent-2 bg-accent-2/10' : 'border-border bg-surface-2/40',
          )}
          style={!onFront ? { borderColor: 'var(--color-accent-2)' } : undefined}
        >
          <div className="flex items-center gap-2">
            <Icon name="Server" size={16} style={{ color: !onFront ? 'var(--color-accent-2)' : 'var(--color-muted)' }} />
            <span className="text-sm font-bold" style={{ color: !onFront ? 'var(--color-accent-2)' : 'var(--color-muted)' }}>Back-end</span>
            <span className="ml-auto text-[10px] text-muted">runs on a server</span>
          </div>
          <div className="mt-2 space-y-1 text-[11px] text-muted">
            <div className="flex items-center gap-1.5"><Icon name="Cog" size={11} /> server code (the API)</div>
            <div className="flex items-center gap-1.5"><Icon name="Database" size={11} /> the database lives here</div>
          </div>
        </div>
      </div>

      {/* the API wire between them */}
      <div className="my-3 flex items-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-muted">
          API · HTTP {step === 1 ? '→ request' : step >= 3 ? '← JSON' : ''}
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* current step */}
      <div className="rounded-lg border border-border bg-surface-2 p-3">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-[#0a0f1f]">{step + 1}</span>
          <span className="text-sm font-semibold text-ink">{s.title}</span>
        </div>
        <p className="mt-1.5 text-xs text-muted">{s.detail}</p>
        {step >= 3 && (
          <pre className="mt-2 rounded border border-border bg-surface p-2 font-mono text-[11px] text-success">{RESPONSE}</pre>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <span key={i} className={cn('h-1.5 w-6 rounded-full', i <= step ? 'bg-accent' : 'bg-border')} />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStep((x) => Math.max(0, x - 1))}
            disabled={step === 0}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              step === 0 ? 'cursor-not-allowed border-border text-muted/40' : 'border-border text-muted hover:text-ink',
            )}
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setStep((x) => (x === STEPS.length - 1 ? 0 : x + 1))}
            className="rounded-full border border-accent bg-accent/15 px-4 py-1 text-sm text-accent transition-colors"
          >
            {step === STEPS.length - 1 ? 'Replay' : 'Next step'}
          </button>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        The <span className="text-ink">front-end</span> runs in the browser; the <span className="text-ink">back-end</span> and the <span className="text-ink">database</span> live on a server. They talk over an <span className="text-ink">API</span>, passing <span className="text-ink">JSON</span> back and forth.
      </p>
    </div>
  )
}
