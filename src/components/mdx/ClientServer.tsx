import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// Almost everything on the internet runs on one tiny conversation: the client
// asks, the server answers. A browser (the CLIENT) sends a REQUEST to a server;
// the server does some work and sends back a RESPONSE with a status code —
// 200 OK when all is well, 404 when the page isn't there. Pick a request and
// watch the envelope travel out and the answer come back.

type Req = { key: string; method: string; path: string; status: number; ok: boolean; body: string }

const REQUESTS: Array<Req> = [
  { key: 'home', method: 'GET', path: '/index.html', status: 200, ok: true, body: '<html> … the page</html>' },
  { key: 'img', method: 'GET', path: '/cat.jpg', status: 200, ok: true, body: 'binary image data' },
  { key: 'missing', method: 'GET', path: '/oops', status: 404, ok: false, body: 'Page not found' },
]

const CLIENT_X = 60
const SERVER_X = 300
const Y = 60

export function ClientServer() {
  const [reqIdx, setReqIdx] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'request' | 'thinking' | 'response' | 'done'>('idle')
  const dotRef = useRef<SVGGElement | null>(null)
  const phaseRef = useRef(phase)

  useEffect(() => { phaseRef.current = phase }, [phase])

  function send() {
    setPhase('request')
  }

  // Drive the travelling envelope with rAF; React state marks the phase changes.
  useEffect(() => {
    if (phase !== 'request' && phase !== 'response') return
    let raf = 0
    let start = 0
    const outbound = phase === 'request'
    const loop = (now: number) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / 900)
      const from = outbound ? CLIENT_X : SERVER_X
      const to = outbound ? SERVER_X : CLIENT_X
      const x = from + (to - from) * t
      const el = dotRef.current
      if (el) {
        el.setAttribute('transform', `translate(${x.toFixed(1)} ${Y})`)
        el.setAttribute('opacity', '1')
      }
      if (t >= 1) {
        if (el) el.setAttribute('opacity', '0')
        if (outbound) {
          setPhase('thinking')
          window.setTimeout(() => {
            if (phaseRef.current === 'thinking') setPhase('response')
          }, 650)
        } else {
          setPhase('done')
        }
        return
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [phase])

  const r = REQUESTS[reqIdx]
  const busy = phase === 'request' || phase === 'thinking' || phase === 'response'
  const envelopeColor = phase === 'response' ? (r.ok ? '#2ECC71' : '#FF6B6B') : '#FFC83D'

  function pick(i: number) {
    setReqIdx(i)
    setPhase('idle')
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {REQUESTS.map((req, i) => (
          <button
            key={req.key}
            type="button"
            onClick={() => pick(i)}
            disabled={busy}
            className={cn(
              'rounded-full border px-3 py-1 font-mono text-xs transition-colors',
              reqIdx === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
              busy && 'opacity-60',
            )}
          >
            {req.method} {req.path}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 120" className="w-full">
        <line x1={CLIENT_X} y1={Y} x2={SERVER_X} y2={Y} stroke="var(--color-border)" strokeWidth="2" strokeDasharray="4 4" />

        {/* client */}
        <g>
          <rect x={CLIENT_X - 34} y={Y - 24} width="68" height="48" rx="8" fill="var(--color-surface-2)" stroke="var(--color-accent)" strokeWidth="2" />
          <text x={CLIENT_X} y={Y - 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--color-accent)">Client</text>
          <text x={CLIENT_X} y={Y + 10} textAnchor="middle" fontSize="8" fill="var(--color-muted)">browser</text>
        </g>

        {/* server */}
        <g>
          <rect x={SERVER_X - 34} y={Y - 24} width="68" height="48" rx="8" fill="var(--color-surface-2)" stroke="var(--color-accent-2)" strokeWidth="2" />
          <text x={SERVER_X} y={Y - 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--color-accent-2)">Server</text>
          <text x={SERVER_X} y={Y + 10} textAnchor="middle" fontSize="8" fill="var(--color-muted)">:443</text>
        </g>

        {phase === 'thinking' && (
          <text x={SERVER_X} y={Y - 32} textAnchor="middle" fontSize="9" fill="var(--color-muted)">…processing</text>
        )}

        {/* travelling envelope */}
        <g ref={dotRef} opacity="0" transform={`translate(${CLIENT_X} ${Y})`}>
          <rect x="-14" y="-9" width="28" height="18" rx="3" fill={envelopeColor} />
          <text x="0" y="4" textAnchor="middle" fontSize="8" fontWeight="800" fill="#0a0f1f">
            {phase === 'response' ? r.status : 'REQ'}
          </text>
        </g>
      </svg>

      <div className="border-t border-border p-4">
        <div className="grid gap-2 font-mono text-xs sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface-2 p-2">
            <div className="mb-1 text-[10px] uppercase text-muted">Request →</div>
            <div className="text-ink">{r.method} {r.path}</div>
            <div className="text-muted">Host: example.com</div>
          </div>
          <div className="rounded-lg border border-border bg-surface-2 p-2">
            <div className="mb-1 text-[10px] uppercase text-muted">← Response</div>
            {phase === 'done' ? (
              <>
                <div className={r.ok ? 'text-success' : 'text-warn'}>{r.status} {r.ok ? 'OK' : 'Not Found'}</div>
                <div className="text-muted">{r.body}</div>
              </>
            ) : (
              <div className="text-muted/60">waiting…</div>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-muted">
            The <span className="text-ink">client asks</span>, the <span className="text-ink">server answers</span>. This request/response loop is what the whole web runs on.
          </p>
          <button
            type="button"
            onClick={send}
            disabled={busy}
            className={cn(
              'shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors',
              busy ? 'cursor-not-allowed border-border text-muted/50' : 'border-accent bg-accent/15 text-accent',
            )}
          >
            {busy ? 'Sending…' : phase === 'done' ? 'Send again' : 'Send request'}
          </button>
        </div>
      </div>
    </div>
  )
}
