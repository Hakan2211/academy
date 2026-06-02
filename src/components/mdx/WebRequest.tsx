import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// What actually happens when you visit a page. You give the browser a URL; it
// opens a connection to that server and sends an HTTP request; the server sends
// back a chunk of plain TEXT — the HTML; the browser reads that text and DRAWS
// the page. The big reveal: a web page is just text sent over the network, then
// painted on screen. Pick a URL and watch the round trip, end to end.

type Site = {
  key: string
  url: string
  title: string
  html: string
  render: { h1: string; p: string; tag: string }
}

const SITES: Array<Site> = [
  {
    key: 'hello',
    url: 'https://hello.world/',
    title: 'hello.world',
    html: '<h1>Hello!</h1>\n<p>You built this.</p>',
    render: { h1: 'Hello!', p: 'You built this.', tag: 'a tiny first page' },
  },
  {
    key: 'shop',
    url: 'https://shop.io/socks',
    title: 'shop.io',
    html: '<h1>Cosy Socks</h1>\n<p>$9 a pair.</p>',
    render: { h1: 'Cosy Socks', p: '$9 a pair.', tag: 'a product page' },
  },
  {
    key: 'blog',
    url: 'https://nora.dev/blog',
    title: 'nora.dev',
    html: "<h1>My Blog</h1>\n<p>Today I learned…</p>",
    render: { h1: 'My Blog', p: 'Today I learned…', tag: 'a blog post' },
  },
]

type Phase = 'idle' | 'request' | 'thinking' | 'response' | 'render'
const BROWSER_X = 64
const SERVER_X = 296
const Y = 56

export function WebRequest() {
  const [siteIdx, setSiteIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const dotRef = useRef<SVGGElement | null>(null)
  const phaseRef = useRef(phase)

  useEffect(() => { phaseRef.current = phase }, [phase])

  // rAF drives the travelling packet; React state marks each leg of the trip.
  useEffect(() => {
    if (phase !== 'request' && phase !== 'response') return
    let raf = 0
    let start = 0
    const outbound = phase === 'request'
    const loop = (now: number) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / 850)
      const from = outbound ? BROWSER_X : SERVER_X
      const to = outbound ? SERVER_X : BROWSER_X
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
          }, 600)
        } else {
          setPhase('render')
        }
        return
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [phase])

  const s = SITES[siteIdx]
  const busy = phase === 'request' || phase === 'thinking' || phase === 'response'
  const gotHtml = phase === 'response' || phase === 'render'
  const rendered = phase === 'render'

  function pick(i: number) {
    setSiteIdx(i)
    setPhase('idle')
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {SITES.map((site, i) => (
          <button
            key={site.key}
            type="button"
            onClick={() => pick(i)}
            disabled={busy}
            className={cn(
              'rounded-full border px-3 py-1 font-mono text-xs transition-colors',
              siteIdx === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
              busy && 'opacity-60',
            )}
          >
            {site.url}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 100" className="w-full">
        <line x1={BROWSER_X} y1={Y} x2={SERVER_X} y2={Y} stroke="var(--color-border)" strokeWidth="2" strokeDasharray="4 4" />

        <g>
          <rect x={BROWSER_X - 38} y={Y - 24} width="76" height="48" rx="8" fill="var(--color-surface-2)" stroke="var(--color-accent)" strokeWidth="2" />
          <text x={BROWSER_X} y={Y - 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--color-accent)">Browser</text>
          <text x={BROWSER_X} y={Y + 11} textAnchor="middle" fontSize="8" fill="var(--color-muted)">on your device</text>
        </g>

        <g>
          <rect x={SERVER_X - 38} y={Y - 24} width="76" height="48" rx="8" fill="var(--color-surface-2)" stroke="var(--color-accent-2)" strokeWidth="2" />
          <text x={SERVER_X} y={Y - 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--color-accent-2)">Web server</text>
          <text x={SERVER_X} y={Y + 11} textAnchor="middle" fontSize="8" fill="var(--color-muted)">holds the page</text>
        </g>

        {phase === 'thinking' && (
          <text x={SERVER_X} y={Y - 32} textAnchor="middle" fontSize="9" fill="var(--color-muted)">…finding the page</text>
        )}

        <g ref={dotRef} opacity="0" transform={`translate(${BROWSER_X} ${Y})`}>
          <rect x="-20" y="-9" width="40" height="18" rx="4" fill={phase === 'response' ? '#2ECC71' : '#FFC83D'} />
          <text x="0" y="4" textAnchor="middle" fontSize="8" fontWeight="800" fill="#0a0f1f">
            {phase === 'response' ? 'HTML' : 'GET'}
          </text>
        </g>
      </svg>

      <div className="grid gap-3 border-t border-border p-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface-2 p-3">
          <div className="mb-1 text-[10px] uppercase tracking-wide text-muted">The text that arrives (HTML)</div>
          {gotHtml ? (
            <pre className="whitespace-pre-wrap font-mono text-xs text-ink">{s.html}</pre>
          ) : (
            <div className="font-mono text-xs text-muted/60">{busy ? 'requesting…' : 'press Visit to fetch it'}</div>
          )}
        </div>

        <div className="rounded-lg border border-border bg-white p-3" style={{ color: '#0a0f1f' }}>
          <div className="mb-1 text-[10px] uppercase tracking-wide" style={{ color: '#64748b' }}>The page the browser draws</div>
          {rendered ? (
            <div>
              <div className="text-lg font-bold">{s.render.h1}</div>
              <div className="text-sm">{s.render.p}</div>
            </div>
          ) : (
            <div className="text-xs" style={{ color: '#94a3b8' }}>blank until the HTML is rendered</div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 pb-4">
        <p className="text-xs text-muted">
          A page is <span className="text-ink">just text</span> sent over the network. The browser turns <span className="text-ink">HTML</span> into the page you see — here, {s.render.tag}.
        </p>
        <button
          type="button"
          onClick={() => setPhase('request')}
          disabled={busy}
          className={cn(
            'shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors',
            busy ? 'cursor-not-allowed border-border text-muted/50' : 'border-accent bg-accent/15 text-accent',
          )}
        >
          {busy ? 'Loading…' : phase === 'render' ? 'Visit again' : 'Visit'}
        </button>
      </div>
    </div>
  )
}
