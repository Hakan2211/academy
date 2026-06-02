import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { cn } from '#/lib/cn'

// The Caesar cipher: shift every letter a fixed number of places down the
// alphabet, wrapping Z back to A. Two thousand years old and trivially broken
// today — there are only 25 possible shifts, and letter-frequency analysis
// cracks it in seconds. A perfect first lesson in what "secret" really takes.

const A = 'A'.charCodeAt(0)

function shiftChar(ch: string, by: number): string {
  const code = ch.charCodeAt(0)
  if (code >= 65 && code <= 90) return String.fromCharCode(((code - A + by + 26) % 26) + A)
  if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + by + 26) % 26) + 97)
  return ch // leave spaces, punctuation, digits untouched
}

function shiftText(text: string, by: number): string {
  return [...text].map((c) => shiftChar(c, by)).join('')
}

export function CaesarCipher() {
  const [text, setText] = useState('Attack at dawn')
  const [shift, setShift] = useState(3)

  const cipher = shiftText(text, shift)
  const back = shiftText(cipher, -shift) // decrypt = shift the other way

  // Show how the letter 'E' rides the wheel, so the shift is visible.
  const wheel = ['A', 'B', 'C', 'D', 'E']

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Plaintext (the secret message)</span>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={28}
          className="rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-ink outline-none focus:border-accent"
          placeholder="Type a message…"
        />
      </label>

      <div className="mt-4">
        <SceneSlider label="Shift (the secret key)" value={shift} min={0} max={25} step={1} unit="places" onChange={(v) => setShift(Math.round(v))} />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-center font-mono">
        {wheel.map((c) => (
          <span key={c} className="flex flex-col items-center text-xs text-muted">
            <span className="flex h-7 w-7 items-center justify-center rounded border border-border bg-surface-2 text-ink">{c}</span>
            <span className="py-0.5">↓</span>
            <span className="flex h-7 w-7 items-center justify-center rounded border-2 border-accent bg-accent/15 text-accent">{shiftChar(c, shift)}</span>
          </span>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <div className="rounded-xl border border-accent/40 bg-accent/10 p-3">
          <div className="text-xs text-muted">Ciphertext (encrypted, +{shift})</div>
          <div className="mt-0.5 break-words font-mono text-lg font-bold text-accent">{cipher || '—'}</div>
        </div>
        <div className="rounded-xl border border-success/40 bg-success/10 p-3">
          <div className="text-xs text-muted">Decrypted by the receiver (shift back −{shift})</div>
          <div className={cn('mt-0.5 break-words font-mono text-lg font-bold', back === text ? 'text-success' : 'text-warn')}>{back || '—'}</div>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">
        The same number that locks the message <span className="text-ink">unlocks</span> it. But that is also the flaw: there are only <span className="text-ink">25 useful keys</span>, so a computer tries them all instantly. And because <span className="text-ink">E</span> stays the most common letter, counting letter frequencies reveals the shift without even guessing. Strong secrecy needs astronomically many keys.
      </p>
    </div>
  )
}
