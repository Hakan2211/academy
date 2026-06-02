import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'

// Public-key crypto's big idea, told with paint. Alice and Bob agree on a public
// base colour anyone can see. Each secretly adds a private colour and publicly
// swaps the mixtures. Each then stirs in their own private colour again — and
// lands on the SAME final shade. An eavesdropper saw the base and both mixtures
// but can never "un-mix" paint to recover a private colour, so the shared secret
// stays secret. Mixing is easy; un-mixing is practically impossible — exactly
// the one-way trick real public-key maths relies on.

// Average two #rrggbb colours (a stand-in for "mixing paint").
function mix(a: string, b: string): string {
  const p = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16))
  const [r1, g1, b1] = p(a)
  const [r2, g2, b2] = p(b)
  const h = (n: number) => Math.round(n).toString(16).padStart(2, '0')
  return `#${h((r1 + r2) / 2)}${h((g1 + g2) / 2)}${h((b1 + b2) / 2)}`
}

const SECRETS = ['#FF6B6B', '#FFC83D', '#1ABC9C', '#4F8CFF', '#9B59B6', '#E84393']

export function PublicKeyExchange() {
  const [base] = useState('#94A3B8') // public base colour, known to everyone
  const [aSecret, setASecret] = useState('#FF6B6B') // Alice's private colour
  const [bSecret, setBSecret] = useState('#4F8CFF') // Bob's private colour

  const aPublic = mix(base, aSecret) // Alice sends this in the open
  const bPublic = mix(base, bSecret) // Bob sends this in the open
  const aShared = mix(bPublic, aSecret) // Alice adds her secret to Bob's mix
  const bShared = mix(aPublic, bSecret) // Bob adds his secret to Alice's mix
  // aShared and bShared are the same shade — the shared secret.

  const Swatch = ({ color, size = 'h-12 w-12' }: { color: string; size?: string }) => (
    <span className={`${size} rounded-lg border border-border`} style={{ background: color }} />
  )

  const Picker = ({ value, onPick }: { value: string; onPick: (c: string) => void }) => (
    <div className="flex gap-1">
      {SECRETS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onPick(c)}
          className={`h-6 w-6 rounded-full border-2 transition-transform ${value === c ? 'scale-110 border-ink' : 'border-transparent'}`}
          style={{ background: c }}
          aria-label={`pick ${c}`}
        />
      ))}
    </div>
  )

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center justify-center gap-2 text-sm text-muted">
        <span>Public base colour (everyone sees it)</span>
        <Swatch color={base} size="h-8 w-8" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {([
          ['Alice', aSecret, setASecret, aPublic, '#FF6B6B'],
          ['Bob', bSecret, setBSecret, bPublic, '#4F8CFF'],
        ] as Array<[string, string, (c: string) => void, string, string]>).map(([who, secret, setSecret, pub, accent]) => (
          <div key={who} className="rounded-xl border border-border bg-surface-2 p-3">
            <div className="font-semibold" style={{ color: accent }}>{who}</div>
            <div className="mt-2 text-xs text-muted">Private colour (kept secret)</div>
            <div className="mt-1 flex items-center gap-2">
              <Swatch color={secret} size="h-7 w-7" />
              <Picker value={secret} onPick={setSecret} />
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted">
              <span>base + private =</span>
              <Swatch color={pub} size="h-7 w-7" />
              <span className="text-ink">sent publicly →</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 rounded-xl border border-success/40 bg-success/10 p-4">
        <div className="text-center">
          <Swatch color={aShared} size="h-14 w-14" />
          <div className="mt-1 text-[10px] text-muted">Alice computes</div>
        </div>
        <Icon name="Equal" size={20} className="text-success" />
        <div className="text-center">
          <Swatch color={bShared} size="h-14 w-14" />
          <div className="mt-1 text-[10px] text-muted">Bob computes</div>
        </div>
      </div>
      <div className="mt-2 text-center text-sm font-semibold text-success">Same shared secret — and neither ever sent it!</div>

      <p className="mt-3 text-xs text-muted">
        An eavesdropper saw the base and both public mixtures, yet cannot <span className="text-ink">un-mix</span> a colour to find a private one. Mixing is easy, un-mixing is practically impossible — a <span className="text-ink">one-way function</span>. Real systems publish a <span className="text-ink">public key</span> anyone can encrypt with, while only the matching secret <span className="text-ink">private key</span> can decrypt. No shared secret needed in advance — this is the backbone of <span className="text-ink">HTTPS</span> and digital signatures.
      </p>
    </div>
  )
}
