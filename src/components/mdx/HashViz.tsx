import { useState } from 'react'
import { asciiCode } from '#/lib/cs'
import { Icon } from '#/components/ui/Icon'

// A hash function squeezes any input down to a fixed-length fingerprint. Two
// hallmarks: it is one-way (you cannot run it backwards to recover the input)
// and it shows the avalanche effect (flip a single character and the whole
// digest changes utterly). This is an illustrative, NON-cryptographic hash —
// just enough to feel the behaviour. Real hashes (SHA-256) are far stronger,
// but the ideas are identical: integrity checks and safe password storage.

// A simple deterministic 32-bit string hash (FNV-style), shown as 8 hex digits.
function simpleHash(s: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= asciiCode(s[i])
    h = Math.imul(h, 0x01000193) >>> 0
  }
  // Spread the bits a little more so single-char changes ripple widely.
  h ^= h >>> 15
  h = Math.imul(h, 0x2c1b3c6d) >>> 0
  h ^= h >>> 12
  return (h >>> 0).toString(16).toUpperCase().padStart(8, '0')
}

export function HashViz() {
  const [text, setText] = useState('password123')

  const digest = simpleHash(text)
  // The same input but with its last character nudged, to show avalanche.
  const tweaked = text ? text.slice(0, -1) + String.fromCharCode((text.charCodeAt(text.length - 1) + 1)) : 'a'
  const tweakedDigest = simpleHash(tweaked)

  // Highlight which hex digits differ between the two digests.
  const diffMask = [...digest].map((c, i) => c !== tweakedDigest[i])

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Input (any length)</span>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={40}
          className="rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-ink outline-none focus:border-accent"
          placeholder="Type anything…"
        />
      </label>

      <div className="mt-4 rounded-xl border border-accent/40 bg-accent/10 p-3">
        <div className="text-xs text-muted">Digest (always 8 hex characters, whatever the input)</div>
        <div className="mt-1 break-all font-mono text-xl font-bold tracking-wider text-accent">{digest}</div>
      </div>

      <div className="mt-3 rounded-xl border border-border bg-surface-2 p-3">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Icon name="Activity" size={14} className="text-warn" />
          Avalanche effect: nudge one character → <span className="font-mono text-ink">{tweaked.slice(0, 20)}</span>
        </div>
        <div className="mt-1 break-all font-mono text-xl font-bold tracking-wider">
          {[...tweakedDigest].map((c, i) => (
            <span key={i} className={diffMask[i] ? 'text-warn' : 'text-muted'}>{c}</span>
          ))}
        </div>
        <div className="mt-1 text-[11px] text-muted">
          {diffMask.filter(Boolean).length} of 8 digits changed from a single-character tweak.
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="flex items-start gap-2 rounded-lg border border-border p-3 text-sm">
          <Icon name="LockKeyhole" size={16} className="mt-0.5 shrink-0 text-accent-2" />
          <span className="text-ink"><span className="font-semibold">One-way.</span> Given a digest, there is no way to run the function backwards to recover the input.</span>
        </div>
        <div className="flex items-start gap-2 rounded-lg border border-border p-3 text-sm">
          <Icon name="FileCheck" size={16} className="mt-0.5 shrink-0 text-success" />
          <span className="text-ink"><span className="font-semibold">Fingerprint.</span> Same input → same digest, so it verifies a download or a password without storing the original.</span>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">
        This demo uses a small <span className="text-ink">illustrative</span> hash, not a cryptographic one — but real hashes like <span className="text-ink">SHA‑256</span> behave the same way, just with 64 hex digits and no shortcuts to reverse them.
      </p>
    </div>
  )
}
