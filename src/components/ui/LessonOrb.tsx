import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Icon } from './Icon'
import type { LessonNodeState } from './LessonNode'

// A single lesson "station" on the category trail — the design.md §2 layer-3
// overlay, one level down from the overworld's OrbStation. No per-lesson art
// exists, so the orb is a PROCEDURAL glass/energy sphere whose state is purely
// data-driven (lock / play / check / clock). Deep-dive lessons render as a
// larger "capstone" with a crown, double ring, godray crown and a bigger bloom
// (mockup `Category Trail` — "Master of Light"). The "shine" = outer bloom halo
// + a sweep clipped to the circle + an inner specular highlight, mirroring the
// hub/overworld grammar so the whole universe reads as one piece.
const CORE = 80 // core orb diameter (px)
const CAP = 118 // deep-dive capstone diameter (px)

export function LessonOrb({
  state,
  format,
  contentSlug,
  accent,
  index,
  reduce,
  lockHint,
}: {
  state: LessonNodeState
  format?: 'core' | 'deepdive'
  contentSlug: string
  accent: string
  index: number
  reduce: boolean
  lockHint?: string
}) {
  const isCap = format === 'deepdive'
  const interactive = state !== 'locked' && state !== 'soon'
  const locked = !interactive
  const current = state === 'current'
  const complete = state === 'complete'
  const lit = interactive

  const D = isCap ? CAP : CORE
  const RGAP = 10
  const RING = D + RGAP * 2

  const iconName = isCap
    ? locked
      ? state === 'soon'
        ? 'Clock'
        : 'Lock'
      : 'Trophy'
    : complete
      ? 'Check'
      : state === 'soon'
        ? 'Clock'
        : state === 'locked'
          ? 'Lock'
          : 'Play'
  const iconSize = isCap ? 44 : 30

  // Glassy interior: lit orbs glow in the accent; locked ones go cold slate.
  const sphereBg = lit
    ? `radial-gradient(circle at 34% 26%, color-mix(in srgb, ${accent} 56%, #0e1426) 0%, color-mix(in srgb, ${accent} 22%, #0a0e1c) 56%, #070b16 100%)`
    : 'radial-gradient(circle at 34% 26%, #1b2233 0%, #11141f 58%, #0a0d16 100%)'
  const rimColor = lit
    ? `color-mix(in srgb, ${accent} 78%, white)`
    : 'rgba(120,135,170,0.32)'

  const orbFace = (
    <div
      className="relative grid place-items-center rounded-full"
      style={{
        width: D,
        height: D,
        background: sphereBg,
        border: `1.5px solid ${rimColor}`,
        boxShadow: lit
          ? `0 0 ${current ? 30 : 20}px ${accent}, inset 0 0 22px color-mix(in srgb, ${accent} 32%, transparent), inset 5px 7px 16px color-mix(in srgb, ${accent} 32%, white)`
          : 'inset 0 0 16px rgba(0,0,0,0.55), inset -4px -5px 13px rgba(0,0,0,0.5)',
        filter: state === 'locked' ? 'grayscale(0.4)' : undefined,
      }}
    >
      {/* top specular highlight — the glass catches the light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 32% 22%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 42%)',
          opacity: lit ? 0.75 : 0.22,
        }}
      />
      {/* specular sweep — light glints across the orb (clipped to the circle) */}
      {lit && !reduce && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <motion.div
            className="absolute inset-[-30%]"
            style={{
              background:
                'linear-gradient(115deg, transparent 44%, rgba(255,255,255,0.6) 50%, transparent 56%)',
              mixBlendMode: 'screen',
            }}
            animate={{ x: ['-65%', '65%'] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              repeatDelay: current ? 1.4 : 3.6,
              ease: 'easeInOut',
              delay: index * 0.35,
            }}
          />
        </div>
      )}
      <Icon
        name={iconName}
        size={iconSize}
        style={{
          color: lit ? '#fff' : 'rgba(150,165,200,0.72)',
          filter: lit
            ? `drop-shadow(0 1px 2px rgba(0,0,0,0.6)) drop-shadow(0 0 7px ${accent})`
            : undefined,
        }}
      />
    </div>
  )

  const node = (
    <div
      className="relative grid place-items-center"
      style={{ width: RING, height: RING }}
    >
      {/* outer bloom — lit orbs radiate accent light into the nebula */}
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full blur-2xl"
        style={{
          width: RING * (isCap ? 2 : 1.5),
          height: RING * (isCap ? 2 : 1.5),
          background: accent,
          opacity: locked ? 0.07 : current ? 0.42 : complete ? 0.3 : 0.22,
          mixBlendMode: 'screen',
        }}
      />

      {/* CAPSTONE flourish — godray crown + rising beam + a crown above, so the
          deep-dive reads as the climactic challenge (no bespoke art needed) */}
      {isCap && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute rounded-full"
            style={{
              width: RING * 2.1,
              height: RING * 2.1,
              background: `repeating-conic-gradient(from 0deg, transparent 0deg, ${accent} 2deg, transparent 6deg, transparent 16deg)`,
              WebkitMaskImage: 'radial-gradient(circle, black 8%, transparent 58%)',
              maskImage: 'radial-gradient(circle, black 8%, transparent 58%)',
              mixBlendMode: 'screen',
              opacity: lit ? 0.42 : 0.22,
            }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={
              reduce ? undefined : { duration: 26, repeat: Infinity, ease: 'linear' }
            }
          />
          {/* second outer ring */}
          <div
            aria-hidden
            className="pointer-events-none absolute rounded-full"
            style={{
              width: RING + 16,
              height: RING + 16,
              border: `1px solid ${lit ? `color-mix(in srgb, ${accent} 50%, transparent)` : 'rgba(120,135,170,0.2)'}`,
            }}
          />
          {/* crown above the orb */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 -translate-x-1/2"
            style={{ bottom: RING - 6 }}
          >
            <Icon
              name="Crown"
              size={26}
              style={{
                color: lit ? accent : 'rgba(130,145,180,0.6)',
                filter: lit ? `drop-shadow(0 0 8px ${accent})` : undefined,
              }}
            />
          </div>
        </>
      )}

      {/* current "you are here" pulsing halo ring */}
      {current && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute rounded-full"
          style={{
            width: RING,
            height: RING,
            boxShadow: `0 0 24px 5px ${accent}, 0 0 58px 18px color-mix(in srgb, ${accent} 50%, transparent)`,
            border: `2px solid ${accent}`,
          }}
          animate={
            reduce
              ? { opacity: 0.9, scale: 1.03 }
              : { opacity: [0.4, 1, 0.4], scale: [1, 1.12, 1] }
          }
          transition={
            reduce
              ? undefined
              : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
          }
        />
      )}

      {/* thin static rim ring just outside the orb (the mockup's double ring) */}
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          width: RING,
          height: RING,
          border: `1px solid ${lit ? `color-mix(in srgb, ${accent} 42%, transparent)` : 'rgba(120,135,170,0.16)'}`,
        }}
      />

      {orbFace}
    </div>
  )

  if (!interactive) {
    return (
      <div
        className="cursor-not-allowed select-none"
        title={lockHint}
        aria-disabled
      >
        {node}
      </div>
    )
  }

  return (
    <Link
      to="/learn/$"
      params={{ _splat: contentSlug }}
      className="block transition-transform duration-300 ease-out hover:scale-[1.06] focus-visible:scale-[1.06] focus-visible:outline-none"
    >
      {node}
    </Link>
  )
}
