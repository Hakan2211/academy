import { useState } from 'react'
import { xorBits, toBinary, asciiCode } from '#/lib/cs'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Symmetric encryption: ONE shared secret key both locks and unlocks. We show
// it with XOR — the simplest reversible operation. XOR each message bit with a
// key bit to scramble; XOR the result with the SAME key to recover the original
// (because x XOR k XOR k = x). Then the catch: how do two strangers agree on
// that secret key over a wire an eavesdropper is already listening to?

export function SymmetricCrypto() {
  const [msg, setMsg] = useState('Hi')
  const [key, setKey] = useState('CS')

  // Turn each character into 8 bits and concatenate.
  const toBits = (s: string) => [...s].map((c) => toBinary(asciiCode(c), 8)).join('')
  const padKey = (k: string, len: number) => {
    const kb = toBits(k) || '0'
    let out = ''
    while (out.length < len) out += kb
    return out.slice(0, len)
  }

  const msgBits = toBits(msg).slice(0, 32)
  const keyBits = padKey(key, msgBits.length)
  const cipherBits = xorBits(msgBits, keyBits)
  const recovered = xorBits(cipherBits, keyBits)
  const ok = recovered === msgBits

  const Row = ({ label, bits, tone }: { label: string; bits: string; tone: string }) => (
    <div>
      <div className="text-xs text-muted">{label}</div>
      <div className={cn('mt-0.5 break-all font-mono text-sm tracking-wide', tone)}>{bits || '—'}</div>
    </div>
  )

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">Message</span>
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            maxLength={4}
            className="rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-ink outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">Shared secret key</span>
          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            maxLength={4}
            className="rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-ink outline-none focus:border-accent-2"
          />
        </label>
      </div>

      <div className="mt-4 space-y-2 rounded-xl border border-border bg-surface-2 p-3">
        <Row label="Message bits" bits={msgBits} tone="text-ink" />
        <Row label="XOR with key bits" bits={keyBits} tone="text-accent-2" />
        <Row label="= Ciphertext (scrambled — safe to send)" bits={cipherBits} tone="text-accent" />
        <div className="border-t border-border pt-2">
          <Row label="Receiver XORs with the SAME key → message returns" bits={recovered} tone={ok ? 'text-success' : 'text-warn'} />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm text-ink">
        <Icon name="Key" size={16} className="text-accent-2" />
        One key, used twice: <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs">x ⊕ k ⊕ k = x</code>. Lock and unlock are the same operation.
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-xl border border-warn/40 bg-warn/10 p-3">
        <Icon name="TriangleAlert" size={16} className="mt-0.5 shrink-0 text-warn" />
        <p className="text-sm text-ink">
          <span className="font-semibold text-warn">The key-distribution problem: </span>
          this only works if both sides already share the secret key. But how do two strangers <span className="font-semibold">agree on a key</span> over a wire an attacker is already tapping — without ever sending the key in the clear? That puzzle is what public-key cryptography solves next.
        </p>
      </div>
    </div>
  )
}
