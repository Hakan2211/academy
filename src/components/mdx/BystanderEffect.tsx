import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { SceneSlider } from '#/components/three/SceneSlider'

// The bystander effect (Darley & Latané). The more people present at an
// emergency, the LESS likely any one of them helps — responsibility diffuses
// across the crowd ("someone else will do it"). The learner slides the number of
// bystanders and watches both the crowd of figures grow AND the probability that
// any single person helps fall. Below, Latané & Darley's five-step decision tree:
// help only happens if you clear notice → interpret as emergency → take
// responsibility → know how → and act; a crowd snaps the chain at step 3. Used in
// good-and-evil.

const STEPS = [
  { label: 'Notice the event', icon: 'Eye' },
  { label: 'Interpret as emergency', icon: 'AlertTriangle' },
  { label: 'Take responsibility', icon: 'Hand' },
  { label: 'Know how to help', icon: 'Lightbulb' },
  { label: 'Decide to act', icon: 'HeartHandshake' },
]

// Probability any single bystander helps, as a function of group size. With one
// witness, help is very likely (~85%); it falls steeply as the crowd grows
// (diffusion of responsibility), levelling off low. Smith/Latané-style decay.
function helpProb(n: number): number {
  return Math.round(85 * Math.pow(0.78, n - 1) + 6)
}

export function BystanderEffect() {
  const [n, setN] = useState(1)
  const p = helpProb(n)
  // Where the chain tends to break for a lone witness vs a crowd.
  const breakAt = n >= 4 ? 2 : -1 // index 2 = "take responsibility"

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-sm text-muted">
        Someone collapses on a busy street. How many other bystanders are around?
      </p>

      {/* crowd of figures */}
      <svg viewBox="0 0 360 70" className="mt-3 w-full">
        {Array.from({ length: Math.min(n, 12) }).map((_, i) => {
          const x = 22 + (i % 12) * 28
          return (
            <g key={i} transform={`translate(${x}, 18)`} opacity={0.5 + 0.5 * (1 / n)}>
              <circle cx="0" cy="0" r="6" fill="var(--color-accent-2)" />
              <rect x="-5" y="7" width="10" height="18" rx="4" fill="var(--color-accent-2)" />
            </g>
          )
        })}
        {n > 12 && (
          <text x="340" y="28" textAnchor="end" fontSize="11" fill="var(--color-muted)">
            +{n - 12}
          </text>
        )}
      </svg>

      <div className="px-1">
        <SceneSlider label="Bystanders present" value={n} min={1} max={20} step={1} unit="" onChange={(v) => setN(Math.round(v))} />
      </div>

      {/* help probability */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-muted">
          <span>Chance any one person steps in to help</span>
          <span className="font-mono text-ink">{p}%</span>
        </div>
        <div className="mt-1 h-3 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${p}%`, background: p > 55 ? 'var(--color-success)' : p > 30 ? '#E67E22' : '#E74C3C' }}
          />
        </div>
      </div>

      <p className="mt-3 text-sm leading-snug text-muted">
        {n === 1 ? (
          <>
            <span className="font-semibold text-success">Alone, you almost certainly act.</span> The responsibility is
            entirely yours — there is no one to defer to.
          </>
        ) : (
          <>
            <span className="font-semibold text-[#E74C3C]">In a crowd, help grows less likely</span>, not more.
            Responsibility <span className="text-ink">diffuses</span> — &ldquo;surely someone else will&rdquo; — and
            everyone&apos;s glance at everyone else reads the emergency as a non-emergency.
          </>
        )}
      </p>

      {/* Latané & Darley decision tree */}
      <p className="mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wide text-accent">The 5 steps to helping</p>
      <div className="space-y-1.5">
        {STEPS.map((s, k) => {
          const broken = k === breakAt
          return (
            <div
              key={s.label}
              className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm"
              style={{
                borderColor: broken ? '#E74C3C' : 'var(--color-border)',
                background: broken ? '#E74C3C18' : 'var(--color-surface-2)',
                color: broken ? '#E74C3C' : 'var(--color-ink)',
              }}
            >
              <Icon name={s.icon} size={15} />
              <span>{s.label}</span>
              {broken && <span className="ml-auto text-xs">← the chain often snaps here in a crowd</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
