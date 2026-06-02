import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Humans remember names; machines route by numbers. DNS — the Domain Name
// System — is the internet's phone book, translating "example.com" into an IP
// address before any connection can begin. The first lookup walks from resolver
// to root to TLD to authoritative server; after that the answer is CACHED, so
// the next visit is instant. Step through a fresh lookup, then watch the cache hit.

type StepInfo = { icon: string; who: string; says: string; color: string }

const STEPS: Array<StepInfo> = [
  { icon: 'AppWindow', who: 'Browser', says: 'I need to reach example.com — what is its IP?', color: '#FF6B6B' },
  { icon: 'Server', who: 'DNS resolver', says: 'Not in my cache. I will go ask the hierarchy on your behalf.', color: '#FFC83D' },
  { icon: 'Globe', who: 'Root server', says: 'I don’t know example.com, but the .com TLD server is over there.', color: '#2ECC71' },
  { icon: 'Network', who: '.com TLD server', says: 'For example.com, ask its authoritative name server here.', color: '#00CEC9' },
  { icon: 'Database', who: 'Authoritative server', says: 'example.com lives at 93.184.216.34. Here you go.', color: '#5B6CFF' },
  { icon: 'Check', who: 'Resolver → Browser', says: 'IP is 93.184.216.34 (cached for next time). Now connect!', color: '#2ECC71' },
]

export function DnsLookup() {
  const [step, setStep] = useState(0)
  const [cached, setCached] = useState(false)

  const atEnd = step === STEPS.length - 1

  function next() {
    if (atEnd) {
      setCached(true)
      setStep(0)
      return
    }
    // With a warm cache, the resolver answers immediately — skip to the end.
    if (cached && step === 1) {
      setStep(STEPS.length - 1)
      return
    }
    setStep((s) => s + 1)
  }

  function reset() {
    setStep(0)
    setCached(false)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-sm">
        <Icon name="Lock" size={14} className="text-muted" />
        <span className="text-muted">https://</span>
        <span className="font-semibold text-ink">example.com</span>
        <span className="ml-auto text-xs text-accent-2">{cached ? 'cache: warm' : 'cache: cold'}</span>
      </div>

      <ol className="space-y-1.5">
        {STEPS.map((st, i) => {
          const active = i === step
          const done = i < step
          const skipped = cached && i >= 2 && i <= 4
          return (
            <li
              key={st.who}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-3 py-2 transition-all',
                active ? 'bg-surface-2' : 'border-transparent bg-surface-2/30',
                skipped && !active ? 'opacity-40' : '',
              )}
              style={{ borderColor: active ? st.color : 'transparent' }}
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{ background: active || done ? st.color : 'var(--color-surface)', color: active || done ? '#0a0f1f' : 'var(--color-muted)' }}
              >
                <Icon name={st.icon} size={15} />
              </span>
              <div className="min-w-0">
                <div className={cn('text-sm font-semibold', active ? 'text-ink' : 'text-muted')}>
                  {st.who}
                  {skipped && <span className="ml-2 text-[10px] uppercase text-accent-2">skipped (cached)</span>}
                </div>
                {active && <div className="text-xs text-muted">{st.says}</div>}
              </div>
            </li>
          )
        })}
      </ol>

      <p className="mt-3 text-center text-xs text-muted">
        DNS maps a <span className="text-ink">name</span> to a <span className="text-ink">number</span>. The first lookup walks the hierarchy; the answer is then <span className="text-ink">cached</span> so repeats are instant.
      </p>

      <div className="mt-3 flex justify-center gap-2">
        <button
          type="button"
          onClick={next}
          className="rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm text-accent transition-colors"
        >
          {atEnd ? 'Resolve again (cached)' : 'Next step'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-border px-4 py-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
