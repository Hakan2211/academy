import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { Icon } from '#/components/ui/Icon'
import { useIsPremium } from '#/lib/billing'
import { UpgradeCard } from '#/components/billing/UpgradeCard'

// The /upgrade page. Three states driven by entitlement + the Stripe return
// search param:
//   free                     -> pricing card (+ "cancelled" note after abandon)
//   ?status=success, waiting -> "finalizing" (the webhook grants entitlement;
//                               this page just waits for currentUser.isPremium
//                               to flip reactively — NEVER granted client-side)
//   premium                  -> welcome card (confetti once per session)
export function Upgrade({ status }: { status?: 'success' | 'cancelled' }) {
  const { isPremium, premiumSince } = useIsPremium()

  if (isPremium === undefined) {
    return (
      <div className="grid min-h-[70vh] place-items-center text-muted">
        Loading…
      </div>
    )
  }

  if (isPremium) return <PremiumWelcome premiumSince={premiumSince} celebrate={status === 'success'} />
  if (status === 'success') return <Finalizing />

  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center gap-4 px-4 py-16">
      {status === 'cancelled' && (
        <div className="w-full max-w-md rounded-xl border border-white/12 bg-white/[0.05] px-4 py-3 text-center text-sm text-muted backdrop-blur-md">
          Checkout cancelled — you haven't been charged.
        </div>
      )}
      <UpgradeCard />
    </div>
  )
}

// Post-checkout wait: the webhook usually lands within a couple of seconds;
// Convex reactivity then re-renders this page into the welcome state without a
// reload. After 30s, reassure instead of alarming.
function Finalizing() {
  const [slow, setSlow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 30_000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="grid min-h-[70vh] place-items-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/12 bg-black/40 p-8 text-center backdrop-blur-2xl">
        <span className="mx-auto mb-4 grid h-14 w-14 animate-pulse place-items-center rounded-2xl bg-warn/10 text-warn">
          <Icon name="Sparkles" size={26} />
        </span>
        <h1 className="text-xl font-extrabold text-ink">
          Finalizing your upgrade…
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {slow
            ? 'Still processing — your payment is safe. This page updates automatically the moment your unlock is confirmed; if it persists, contact support.'
            : 'Confirming your payment with Stripe. This usually takes a few seconds — the page updates by itself.'}
        </p>
      </div>
    </div>
  )
}

function PremiumWelcome({
  premiumSince,
  celebrate,
}: {
  premiumSince: number | null
  celebrate: boolean
}) {
  const reduce = useReducedMotion()

  // Confetti once per session, only on the actual purchase landing (not when a
  // premium user casually revisits /upgrade). Mirrors CategoryCompleteCard.
  useEffect(() => {
    if (!celebrate || reduce) return
    const key = 'upgrade-celebrated'
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
    let cancelled = false
    void import('canvas-confetti').then(({ default: confetti }) => {
      if (cancelled) return
      confetti({
        particleCount: 180,
        spread: 90,
        origin: { y: 0.4 },
        colors: ['#ffb020', '#4F8CFF', '#00d2d3', '#2ecc71', '#e879f9'],
      })
    })
    return () => {
      cancelled = true
    }
  }, [celebrate, reduce])

  const since =
    premiumSince != null
      ? new Date(premiumSince).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null

  return (
    <div className="grid min-h-[70vh] place-items-center px-4">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md rounded-3xl border bg-black/40 p-8 text-center backdrop-blur-2xl"
        style={{
          borderColor: 'rgba(255,176,32,0.4)',
          boxShadow:
            '0 0 0 1px rgba(255,176,32,0.1), 0 30px 80px -28px rgba(255,176,32,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        <span
          className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl text-warn"
          style={{
            background: 'rgba(255,176,32,0.12)',
            boxShadow: '0 0 28px -6px rgba(255,176,32,0.95)',
          }}
        >
          <Icon name="Crown" size={26} />
        </span>
        <h1 className="text-2xl font-extrabold text-ink">
          You have lifetime access
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Every subject, every world, every future update — yours for good.
          {since && (
            <>
              <br />
              <span className="text-xs">Unlocked {since} · one-time purchase</span>
            </>
          )}
        </p>
        <Link
          to="/"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{
            background:
              'linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 78%, white), var(--color-accent))',
            boxShadow: '0 10px 30px -10px rgba(79,140,255,0.9)',
          }}
        >
          Start exploring
          <Icon name="ArrowRight" size={16} />
        </Link>
      </motion.div>
    </div>
  )
}
