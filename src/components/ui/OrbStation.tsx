import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Icon } from './Icon'
import { cn } from '#/lib/cn'

export type OrbState = 'locked' | 'available' | 'current' | 'complete'

// A single category "world" on the overworld. When a medal image is supplied
// (the §3.3 / §7a per-category coin), it IS the orb art — a glossy chrome-rimmed
// accent disc with the emblem baked in. State is data-driven: complete (glow +
// ✓), current (pulsing halo + lively shine), available (lit), locked (muted +
// desaturated + lock, but still visible so the art reads). Without an image it
// falls back to a procedural lit sphere (other subjects, before art exists).
// This is the design.md §2 layer-3 overlay; the "shine" = bloom halo + a masked
// specular sweep over the coin (the islands' technique) + canvas bloom behind.
const BASE = 120 // orb diameter (px) at scale 1.0

export function OrbStation({
  subjectSlug,
  unitSlug,
  name,
  icon,
  image,
  accent,
  state,
  done,
  total,
  order,
  scale,
  depth,
  isSummit,
  reduce,
  index,
  lockHint,
  captionAbove,
}: {
  subjectSlug: string
  unitSlug: string
  name: string
  icon?: string
  image?: string
  accent: string
  state: OrbState
  done: number
  total: number
  order: number // 1-based number shown under the orb
  scale: number
  depth: number // 0 (far/dim) … 1 (near/bright) — atmospheric perspective
  isSummit?: boolean
  reduce: boolean
  index: number
  lockHint?: string
  captionAbove?: boolean // foreground orbs put the label above so it never clips
}) {
  const locked = state === 'locked'
  const current = state === 'current'
  const complete = state === 'complete'
  const lit = !locked
  const frac = complete ? 1 : total > 0 ? Math.min(1, done / total) : 0

  const D = Math.round(BASE * scale)
  const RGAP = Math.max(7, Math.round(10 * scale))
  const RING = D + RGAP * 2
  const rr = RING / 2 - 2.5
  const C = 2 * Math.PI * rr

  // Atmospheric perspective: lit orbs in the distance recede a little.
  const haloOpacity = locked ? 0.08 : 0.18 + 0.26 * depth

  // Clip the shine/veil overlays to the coin silhouette via the PNG alpha.
  const maskUrl = image ? `url(${image})` : undefined
  const maskStyle = image
    ? ({
        WebkitMaskImage: maskUrl,
        maskImage: maskUrl,
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
      } as const)
    : undefined

  const emblemSize = Math.round(D * 0.4)
  const labelW = Math.max(96, Math.round(D * 1.18))

  // Procedural sphere fill (fallback when no medal art).
  const sphereBg = locked
    ? `radial-gradient(circle at 34% 28%, color-mix(in srgb, ${accent} 16%, #232b40) 0%, color-mix(in srgb, ${accent} 10%, #161c2c) 52%, #0d1220 100%)`
    : `radial-gradient(circle at 33% 27%, color-mix(in srgb, ${accent} 58%, white) 0%, ${accent} 40%, color-mix(in srgb, ${accent} 64%, #04060e) 100%)`

  const planet = image ? (
    <div className="relative" style={{ width: D, height: D }}>
      <img
        src={image}
        alt=""
        draggable={false}
        loading="lazy"
        decoding="async"
        className="block h-full w-full select-none"
        style={{
          opacity: locked ? 0.84 : 1,
          filter: locked
            ? 'grayscale(0.5) brightness(0.62)'
            : `drop-shadow(0 0 ${current ? 22 : complete ? 15 : 11}px ${accent}) drop-shadow(0 7px 16px rgba(0,0,0,0.5))`,
        }}
      />
      {/* specular shine sweep — light glints across the chrome coin (lit only) */}
      {lit && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            ...maskStyle,
            mixBlendMode: 'screen',
            opacity: 0.85,
            backgroundImage:
              'linear-gradient(115deg, transparent 42%, rgba(255,255,255,0.55) 48%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.55) 52%, transparent 58%)',
            backgroundSize: '260% 100%',
          }}
          animate={reduce ? undefined : { backgroundPosition: ['175% 0%', '-80% 0%'] }}
          transition={
            reduce
              ? undefined
              : {
                  duration: 2.6,
                  repeat: Infinity,
                  repeatDelay: current ? 1.6 : 3.6,
                  ease: 'easeInOut',
                  delay: index * 0.4,
                }
          }
        />
      )}
      {/* breathing accent core — the current world pulses with energy */}
      {current && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ ...maskStyle, mixBlendMode: 'screen', background: accent }}
          animate={reduce ? { opacity: 0.16 } : { opacity: [0.06, 0.22, 0.06] }}
          transition={reduce ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {/* locked veil — darken the coin so it reads as "not yet earned" */}
      {locked && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ ...maskStyle, background: 'rgba(7,10,22,0.4)' }}
        />
      )}
    </div>
  ) : (
    <div
      className="relative rounded-full"
      style={{
        width: D,
        height: D,
        background: sphereBg,
        opacity: locked ? 1 : 0.62 + 0.38 * depth,
        filter: locked ? 'grayscale(0.55) brightness(0.85)' : undefined,
        boxShadow: locked
          ? 'inset -7px -9px 18px rgba(0,0,0,0.5)'
          : `inset -8px -11px 22px rgba(0,0,0,0.42), inset 7px 8px 18px color-mix(in srgb, ${accent} 70%, white), 0 6px 22px rgba(0,0,0,0.45)`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 30% 24%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 38%)',
          opacity: locked ? 0.25 : 0.9,
        }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <Icon
          name={icon ?? 'Folder'}
          size={emblemSize}
          style={{
            color: '#fff',
            opacity: locked ? 0.5 : 0.95,
            filter: locked
              ? undefined
              : `drop-shadow(0 1px 2px rgba(0,0,0,0.55)) drop-shadow(0 0 6px ${accent})`,
          }}
        />
      </div>
    </div>
  )

  const orb = (
    <div className="relative grid place-items-center" style={{ width: RING, height: RING }}>
      {/* bloom halo behind the coin (larger + brighter at the summit) */}
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full blur-2xl"
        style={{
          width: RING * (isSummit ? 2.1 : 1.55),
          height: RING * (isSummit ? 2.1 : 1.55),
          background: accent,
          opacity: isSummit ? Math.max(0.34, haloOpacity) : haloOpacity,
          mixBlendMode: 'screen',
        }}
      />

      {/* SUMMIT AURA — godray crown + rising beam + orbiting sparkles, so the
          final world reads as the climactic destination (no extra art needed) */}
      {isSummit && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute rounded-full"
            style={{
              width: RING * 2.5,
              height: RING * 2.5,
              background: `repeating-conic-gradient(from 0deg, transparent 0deg, ${accent} 2.5deg, transparent 7deg, transparent 18deg)`,
              WebkitMaskImage: 'radial-gradient(circle, black 10%, transparent 60%)',
              maskImage: 'radial-gradient(circle, black 10%, transparent 60%)',
              mixBlendMode: 'screen',
              opacity: lit ? 0.5 : 0.32,
            }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={reduce ? undefined : { duration: 28, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: '44%',
              width: RING * 0.46,
              height: RING * 2.1,
              background: `linear-gradient(to top, ${accent}, transparent)`,
              filter: 'blur(9px)',
              mixBlendMode: 'screen',
              transformOrigin: 'bottom center',
            }}
            animate={
              reduce ? { opacity: 0.38 } : { opacity: [0.22, 0.5, 0.22], scaleY: [1, 1.1, 1] }
            }
            transition={reduce ? undefined : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          {!reduce && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute"
              style={{ width: RING * 1.7, height: RING * 1.7 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 19, repeat: Infinity, ease: 'linear' }}
            >
              {[0, 120, 240].map((deg) => (
                <span
                  key={deg}
                  className="absolute left-1/2 top-1/2"
                  style={{ transform: `rotate(${deg}deg) translateY(-${RING * 0.82}px)` }}
                >
                  <span
                    className="block rounded-full"
                    style={{
                      width: 6,
                      height: 6,
                      background: '#fff',
                      boxShadow: `0 0 9px 2px ${accent}`,
                    }}
                  />
                </span>
              ))}
            </motion.div>
          )}
        </>
      )}

      {/* current-target pulsing halo — the bright "you are here" ring */}
      {current && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute rounded-full"
          style={{
            width: RING,
            height: RING,
            boxShadow: `0 0 26px 6px ${accent}, 0 0 64px 20px color-mix(in srgb, ${accent} 55%, transparent)`,
            border: `2px solid ${accent}`,
          }}
          animate={
            reduce
              ? { opacity: 0.9, scale: 1.04 }
              : { opacity: [0.4, 1, 0.4], scale: [1, 1.13, 1] }
          }
          transition={reduce ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* progress ring — a thin glowing arc orbiting just outside the coin */}
      <svg
        width={RING}
        height={RING}
        className="absolute"
        style={{ filter: locked ? undefined : `drop-shadow(0 0 5px ${accent})` }}
      >
        <circle
          cx={RING / 2}
          cy={RING / 2}
          r={rr}
          fill="none"
          stroke="rgba(160,172,210,0.18)"
          strokeWidth={2.5}
        />
        {frac > 0 && !locked && (
          <circle
            cx={RING / 2}
            cy={RING / 2}
            r={rr}
            fill="none"
            stroke={accent}
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - frac)}
            transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
          />
        )}
      </svg>

      {planet}

      {/* state badge — ✓ complete / 🔒 locked */}
      {complete && (
        <span
          className="absolute grid h-7 w-7 place-items-center rounded-full text-white"
          style={{
            right: RGAP,
            bottom: RGAP,
            background: '#22c55e',
            border: '2px solid #070a16',
            boxShadow: '0 0 10px rgba(34,197,94,0.75)',
          }}
        >
          <Icon name="Check" size={15} />
        </span>
      )}
      {locked && (
        <span
          className="absolute grid h-7 w-7 place-items-center rounded-full text-muted"
          style={{
            right: RGAP,
            bottom: RGAP,
            background: 'rgba(20,26,43,0.92)',
            border: '2px solid #070a16',
          }}
        >
          <Icon name="Lock" size={13} />
        </span>
      )}

    </div>
  )

  // Float-bob (per-orb phase) keeps the worlds alive; static under reduced motion.
  const floated = (
    <motion.div
      animate={reduce ? undefined : { y: [0, -7 - 4 * depth, 0] }}
      transition={
        reduce
          ? undefined
          : { duration: 5 + index * 0.45, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      {orb}
    </motion.div>
  )

  // Number + name caption, sized down with distance.
  const caption = (
    <div
      className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-center"
      style={{
        ...(captionAbove ? { bottom: RING + 4 } : { top: RING + 4 }),
        width: labelW,
        textShadow: '0 2px 10px rgba(0,0,0,0.9)',
      }}
    >
      <div
        className="font-extrabold tabular-nums tracking-wider"
        style={{
          fontSize: Math.max(13, Math.round(17 * scale)),
          color: locked ? 'var(--color-muted)' : accent,
        }}
      >
        {String(order).padStart(2, '0')}
      </div>
      <div
        className={cn('font-semibold leading-tight', locked ? 'text-muted' : 'text-ink')}
        style={{ fontSize: Math.max(11, Math.round(13.5 * scale)) }}
      >
        {name}
      </div>
      <div
        className="text-muted"
        style={{ fontSize: Math.max(10, Math.round(11 * scale)) }}
      >
        {locked
          ? 'Locked'
          : complete
            ? `${total}/${total} ✓`
            : total > 0
              ? `${done}/${total} lessons`
              : 'Coming soon'}
      </div>
    </div>
  )

  const body = (
    <div className="relative grid place-items-center">
      {floated}
      {caption}
    </div>
  )

  if (locked) {
    return (
      <div
        className="cursor-not-allowed select-none"
        title={lockHint}
        aria-label={`${name} — locked. ${lockHint ?? ''}`}
        aria-disabled
      >
        {body}
      </div>
    )
  }

  return (
    <Link
      to="/subjects/$subjectSlug/$unitSlug"
      params={{ subjectSlug, unitSlug }}
      aria-label={`${name} — ${complete ? 'complete' : `${done} of ${total} lessons done`}`}
      className="block transition-transform duration-300 ease-out hover:scale-[1.07] focus-visible:scale-[1.07] focus-visible:outline-none"
    >
      {body}
    </Link>
  )
}
