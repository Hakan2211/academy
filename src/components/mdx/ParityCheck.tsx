import { useState } from 'react'
import { byteToBits, parityBit } from '#/lib/cs'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Data can be corrupted in transit — a stray bit flips. A parity bit is the
// simplest guard: the sender adds one extra bit so the total number of 1s is
// even. If a single bit flips on the way, the count becomes odd and the receiver
// knows something broke. Send a byte, then flip a bit and watch it get caught.

export function ParityCheck() {
  const [data] = useState(0b1011010)
  const [received, setReceived] = useState<Array<0 | 1>>(() => byteToBits(data).slice(1))
  const [corrupted, setCorrupted] = useState(false)

  const sentBits = byteToBits(data).slice(1) // 7 data bits
  const sentParity = parityBit(sentBits.join(''))

  const flip = (i: number) => {
    setReceived((b) => b.map((v, j) => (j === i ? ((v ? 0 : 1) as 0 | 1) : v)))
    setCorrupted(true)
  }
  const reset = () => {
    setReceived(sentBits)
    setCorrupted(false)
  }

  const recvParity = parityBit(received.join(''))
  const ok = recvParity === sentParity

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="text-xs text-muted">Sender transmits 7 data bits + 1 parity bit (chosen to make the number of 1s even):</div>
      <div className="mt-2 flex items-center gap-1.5">
        {sentBits.map((b, i) => (
          <span key={i} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-2 font-mono text-lg text-muted">{b}</span>
        ))}
        <span className="px-1 text-muted">+</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-accent-2 bg-accent-2/10 font-mono text-lg text-accent-2">{sentParity}</span>
      </div>

      <div className="mt-4 text-xs text-muted">Receiver gets (click a data bit to simulate a transmission error):</div>
      <div className="mt-2 flex items-center gap-1.5">
        {received.map((b, i) => {
          const flipped = b !== sentBits[i]
          return (
            <button
              key={i}
              type="button"
              onClick={() => flip(i)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg border-2 font-mono text-lg transition-colors',
                flipped ? 'border-warn bg-warn/15 text-warn' : 'border-border bg-surface-2 text-ink',
              )}
            >
              {b}
            </button>
          )
        })}
        <span className="px-1 text-muted">+</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-accent-2 bg-accent-2/10 font-mono text-lg text-accent-2">{sentParity}</span>
      </div>

      <div className={cn('mt-4 flex items-center gap-2 rounded-xl border p-3 text-sm', ok ? 'border-success/40 bg-success/10' : 'border-warn/40 bg-warn/10')}>
        <Icon name={ok ? 'ShieldCheck' : 'ShieldAlert'} size={18} className={ok ? 'text-success' : 'text-warn'} />
        <span className="text-ink">
          Receiver recomputes parity → <span className="font-mono font-bold">{recvParity}</span>.{' '}
          {ok ? 'Matches the sent parity — looks intact.' : 'Mismatch! An error was detected — please resend.'}
        </span>
      </div>

      {corrupted && (
        <button type="button" onClick={reset} className="mt-3 rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-ink">
          Reset transmission
        </button>
      )}
      <p className="mt-3 text-xs text-muted">
        A single parity bit <span className="text-ink">detects</span> any 1-bit error but can't say which bit (and misses 2-bit flips). Smarter schemes like Hamming codes can <span className="text-ink">correct</span> errors too.
      </p>
    </div>
  )
}
