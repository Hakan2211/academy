import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A guided tour of the threat landscape. Each card names a common attack, says
// what it actually is, and — crucially — how to defend against it. Knowing how
// an attack works is the first step to stopping it: this is defensive framing,
// not a how-to for attackers.

type Threat = {
  name: string
  icon: string
  color: string
  what: string
  defend: string
}

const THREATS: Array<Threat> = [
  {
    name: 'Malware',
    icon: 'Bug',
    color: '#FF6B6B',
    what: 'Malicious software — viruses, worms, trojans, spyware — that sneaks onto a device to steal data, spy, or take control. Often hidden inside a download or email attachment.',
    defend: 'Keep software updated, run reputable anti-malware, and never open attachments or installers from sources you do not trust.',
  },
  {
    name: 'Phishing',
    icon: 'Mail',
    color: '#FF8C42',
    what: 'A con, not a hack: a fake email or message impersonates a bank or colleague to trick you into typing a password or clicking a poisoned link. It targets people, not machines.',
    defend: 'Slow down. Check the real sender address, hover before clicking, and never enter credentials from a link. When unsure, visit the site directly.',
  },
  {
    name: 'Man-in-the-Middle',
    icon: 'Network',
    color: '#FFC83D',
    what: 'An attacker secretly sits between you and a server on an untrusted network (like open Wi‑Fi), reading or altering the messages you believe are private.',
    defend: 'Use HTTPS everywhere and a VPN on public Wi‑Fi. Encryption means an interceptor sees only scrambled, useless data.',
  },
  {
    name: 'DDoS',
    icon: 'Waves',
    color: '#1ABC9C',
    what: 'A Distributed Denial-of-Service flood: thousands of hijacked machines bombard a server with traffic until it buckles, knocking the service offline for everyone.',
    defend: 'It attacks availability, so defences are scale-based: traffic filtering, rate limiting, and content delivery networks that absorb the flood.',
  },
  {
    name: 'Ransomware',
    icon: 'Lock',
    color: '#4F8CFF',
    what: 'Malware that encrypts all your files and demands payment for the key. It weaponises encryption — the very tool meant to protect you — against you.',
    defend: 'Offline, tested **backups** are the real cure: if you can restore your data, the ransom loses its power. Patch systems and limit user permissions.',
  },
  {
    name: 'Injection',
    icon: 'Terminal',
    color: '#9B59B6',
    what: 'An attacker types crafted input into a form so the app mistakes that input for its own commands (e.g. SQL injection), tricking a database into leaking or deleting data.',
    defend: 'Never trust user input. Developers validate and sanitise everything and use parameterised queries so data can never be run as a command.',
  },
]

export function ThreatGallery() {
  const [sel, setSel] = useState(1)
  const t = THREATS[sel]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {THREATS.map((threat, i) => (
          <button
            key={threat.name}
            type="button"
            onClick={() => setSel(i)}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-all',
              sel === i ? 'border-accent bg-accent/15' : 'border-border hover:border-accent/50',
            )}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: sel === i ? threat.color : 'var(--color-surface-2)', color: sel === i ? '#0a0f1f' : threat.color }}
            >
              <Icon name={threat.icon} size={18} />
            </span>
            <span className={cn('text-center text-[10px] leading-tight', sel === i ? 'text-ink' : 'text-muted')}>{threat.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-border bg-surface-2 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: t.color, color: '#0a0f1f' }}>
            <Icon name={t.icon} size={16} />
          </span>
          <div className="font-semibold text-ink">{t.name}</div>
        </div>
        <p className="mt-2 text-sm text-muted">{t.what}</p>
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-success/40 bg-success/10 p-3">
          <Icon name="ShieldCheck" size={16} className="mt-0.5 shrink-0 text-success" />
          <p className="text-sm text-ink">
            <span className="font-semibold text-success">Defend: </span>
            {t.defend}
          </p>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Most attacks exploit either <span className="text-ink">software flaws</span> or <span className="text-ink">human trust</span>. Understanding the method is what lets you build the defence.
      </p>
    </div>
  )
}
