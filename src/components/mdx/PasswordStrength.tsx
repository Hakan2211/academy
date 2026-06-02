import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A rough strength estimator. We never store anything — we just count the size
// of the character "pool" the password draws from and multiply by length to get
// an entropy estimate in bits, then turn that into an approximate time-to-crack
// at a guessing rate. The punchline the meter is built to reveal: adding length
// multiplies the search space far faster than adding a symbol or two — so a long
// passphrase beats a short, gnarly password every time.

const GUESSES_PER_SEC = 1e10 // a fast offline attacker, ~10 billion guesses/sec

function poolSize(pw: string): number {
  let n = 0
  if (/[a-z]/.test(pw)) n += 26
  if (/[A-Z]/.test(pw)) n += 26
  if (/[0-9]/.test(pw)) n += 10
  if (/[^a-zA-Z0-9]/.test(pw)) n += 33
  return n
}

function humanTime(seconds: number): string {
  if (seconds < 1) return 'instantly'
  const units: Array<[number, string]> = [
    [60, 'seconds'],
    [60, 'minutes'],
    [24, 'hours'],
    [365, 'days'],
    [1e9, 'years'],
  ]
  let v = seconds
  let label = 'seconds'
  for (const [step, name] of units) {
    if (v < step) { label = name; break }
    v /= step
    label = name
  }
  if (label === 'years' && v > 1e6) return 'longer than the age of the universe'
  return `${v < 10 ? v.toFixed(1) : Math.round(v).toLocaleString()} ${label}`
}

const LEVELS = [
  { max: 28, label: 'Very weak', color: 'var(--color-warn)', tw: 'text-warn' },
  { max: 50, label: 'Weak', color: '#FF8C42', tw: 'text-warn' },
  { max: 70, label: 'Reasonable', color: '#FFC83D', tw: 'text-ink' },
  { max: 100, label: 'Strong', color: '#1ABC9C', tw: 'text-success' },
  { max: Infinity, label: 'Very strong', color: 'var(--color-success)', tw: 'text-success' },
]

export function PasswordStrength() {
  const [pw, setPw] = useState('Tr0ub4dor')

  const pool = poolSize(pw)
  const bits = pw.length ? pw.length * Math.log2(pool || 1) : 0
  const combos = Math.pow(2, bits)
  const seconds = combos / 2 / GUESSES_PER_SEC // expected: half the keyspace
  const level = LEVELS.find((l) => bits < l.max) ?? LEVELS[LEVELS.length - 1]
  const fill = Math.min(100, (bits / 110) * 100)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Try a password (nothing is stored)</span>
        <input
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          maxLength={40}
          className="rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-ink outline-none focus:border-accent"
          placeholder="Type a password…"
        />
      </label>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full transition-all" style={{ width: `${fill}%`, background: level.color }} />
      </div>
      <div className="mt-1 flex items-center justify-between text-sm">
        <span className={cn('font-semibold', level.tw)}>{level.label}</span>
        <span className="font-mono text-xs text-muted">≈ {Math.round(bits)} bits of entropy</span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border border-border bg-surface-2 p-2">
          <div className="text-[10px] text-muted">Length</div>
          <div className="font-mono text-lg text-ink">{pw.length}</div>
        </div>
        <div className="rounded-lg border border-border bg-surface-2 p-2">
          <div className="text-[10px] text-muted">Char pool</div>
          <div className="font-mono text-lg text-ink">{pool}</div>
        </div>
        <div className="rounded-lg border border-border bg-surface-2 p-2">
          <div className="text-[10px] text-muted">Crack time</div>
          <div className={cn('font-mono text-sm font-bold', level.tw)}>{humanTime(seconds)}</div>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-xl border border-accent/40 bg-accent/10 p-3">
        <Icon name="Ruler" size={16} className="mt-0.5 shrink-0 text-accent" />
        <p className="text-sm text-ink">
          <span className="font-semibold text-accent">Length beats complexity. </span>
          Every extra character multiplies the guesses an attacker must make. A long, memorable passphrase like <code className="rounded bg-surface-2 px-1 py-0.5 font-mono text-xs">correct horse battery staple</code> is far harder to crack — and easier to remember — than a short tangle of symbols.
        </p>
      </div>
    </div>
  )
}
