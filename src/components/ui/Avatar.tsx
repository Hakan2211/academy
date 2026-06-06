import { useState } from 'react'

// A round profile avatar: the provider image when present, otherwise the
// learner's initials over a deterministic gradient (same name → same colors).
// Google/avatar URLs need `referrerPolicy="no-referrer"` to load, and a broken
// image silently falls back to initials.

function initialsOf(name?: string | null, email?: string | null): string {
  const src = (name && name.trim()) || (email ? email.split('@')[0] : '') || ''
  const parts = src.split(/[\s._-]+/).filter(Boolean)
  if (parts.length === 0) return '★'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Stable hue from the seed string, so a given learner always gets the same tint.
function hueOf(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360
  return h
}

export function Avatar({
  name,
  image,
  email,
  size = 44,
  ring,
}: {
  name?: string | null
  image?: string | null
  email?: string | null
  size?: number
  /** Optional accent for a 2px glow ring around the avatar. */
  ring?: string
}) {
  const [broken, setBroken] = useState(false)
  const showImg = !!image && !broken
  const initials = initialsOf(name, email)
  const h = hueOf((name || email || 'learner').toLowerCase())

  return (
    <span
      className="relative grid shrink-0 place-items-center overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        boxShadow: ring
          ? `0 0 0 2px ${ring}, 0 0 18px -4px ${ring}`
          : 'inset 0 0 0 1px rgba(255,255,255,0.12)',
      }}
    >
      {showImg ? (
        <img
          src={image as string}
          alt=""
          referrerPolicy="no-referrer"
          draggable={false}
          onError={() => setBroken(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className="grid h-full w-full select-none place-items-center font-bold text-white"
          style={{
            fontSize: size * 0.4,
            background: `linear-gradient(140deg, hsl(${h} 70% 56%), hsl(${(h + 42) % 360} 72% 40%))`,
          }}
        >
          {initials}
        </span>
      )}
    </span>
  )
}
