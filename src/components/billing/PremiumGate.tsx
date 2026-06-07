import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { Icon } from '#/components/ui/Icon'
import { PLAN_PRICE } from '#/lib/billing'

// Full-page premium gate shown in place of locked content (premium world
// trails, deep-linked premium lessons, Practice). Purely presentational — the
// server refuses progress/XP writes for free users regardless.
export function PremiumGate({
  title,
  description,
  accent = '#FFB020',
  backTo,
  backLabel,
}: {
  title: string
  description?: string
  accent?: string
  backTo?: string
  backLabel?: string
}) {
  const reduce = useReducedMotion()

  return (
    <div className="grid min-h-[70vh] w-full place-items-center px-4 py-16">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md rounded-3xl border bg-black/40 p-8 text-center backdrop-blur-2xl"
        style={{
          borderColor: `color-mix(in srgb, ${accent} 35%, transparent)`,
          boxShadow: `0 0 0 1px color-mix(in srgb, ${accent} 8%, transparent), 0 30px 80px -28px color-mix(in srgb, ${accent} 50%, transparent), inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
      >
        <span
          className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl"
          style={{
            color: accent,
            background: `color-mix(in srgb, ${accent} 12%, transparent)`,
            boxShadow: `0 0 28px -6px ${accent}`,
          }}
        >
          <Icon name="Lock" size={26} />
        </span>

        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-warn">
          Premium
        </p>
        <h1 className="mt-1.5 text-2xl font-extrabold text-ink">{title}</h1>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
        )}

        <Link
          to="/upgrade"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-[#1a1304] transition-opacity hover:opacity-90"
          style={{
            background:
              'linear-gradient(135deg, color-mix(in srgb, var(--color-warn) 70%, white), var(--color-warn))',
            boxShadow: '0 10px 30px -10px rgba(255,176,32,0.9)',
          }}
        >
          <Icon name="Crown" size={16} />
          Unlock everything — ${PLAN_PRICE} lifetime
        </Link>

        {backTo && (
          <Link
            to={backTo}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-ink"
          >
            <Icon name="ArrowLeft" size={15} />
            {backLabel ?? 'Back'}
          </Link>
        )}
      </motion.div>
    </div>
  )
}
