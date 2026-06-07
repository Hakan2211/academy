import { useState } from 'react'
import { useAction } from 'convex/react'
import { motion, useReducedMotion } from 'motion/react'
import { api } from '../../../convex/_generated/api'
import { Icon } from '#/components/ui/Icon'
import { PLAN_INCLUDES, PLAN_PRICE, PLAN_PRICE_FULL } from '#/lib/billing'

// The lifetime-unlock pricing card (mirrors the Landing pricing section's
// offer). The CTA opens Stripe Checkout — a full-page redirect away from the
// SPA; Stripe sends the buyer back to /upgrade?status=success|cancelled.
// Entitlement is granted by the webhook, never by this client.

const RIM = 'rgba(255,176,32,0.35)'
const GLASS =
  '0 0 0 1px rgba(255,176,32,0.08), 0 30px 80px -28px rgba(255,176,32,0.45), inset 0 1px 0 rgba(255,255,255,0.08)'

export function UpgradeCard() {
  const reduce = useReducedMotion()
  const checkout = useAction(api.billing.createCheckoutSession)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onCheckout() {
    setError(null)
    setPending(true)
    try {
      const { url } = await checkout({})
      if (url) {
        window.location.href = url // off to Stripe Checkout
        return // keep "Opening…" while the browser navigates
      }
      setError('Could not open checkout. Please try again.')
      setPending(false)
    } catch (e) {
      setError(
        e instanceof Error && e.message.includes('already have')
          ? 'You already have lifetime access.'
          : 'Could not open checkout. Please try again in a moment.',
      )
      setPending(false)
    }
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md rounded-3xl border bg-black/40 p-7 backdrop-blur-2xl"
      style={{ borderColor: RIM, boxShadow: GLASS }}
    >
      {/* eyebrow + price */}
      <div className="flex flex-col items-center text-center">
        <span
          className="mb-3 grid h-12 w-12 place-items-center rounded-2xl text-warn"
          style={{
            background: 'rgba(255,176,32,0.12)',
            boxShadow: '0 0 24px -6px rgba(255,176,32,0.9)',
          }}
        >
          <Icon name="Crown" size={24} />
        </span>
        <h2 className="text-xl font-extrabold text-ink">Lifetime access</h2>
        <p className="mt-1 text-sm text-muted">
          One price. Everything. Forever.
        </p>
        <div className="mt-4 flex items-end justify-center gap-2.5">
          <span className="pb-1.5 text-lg font-semibold text-muted line-through">
            ${PLAN_PRICE_FULL}
          </span>
          <span className="text-6xl font-extrabold tracking-tight text-white">
            ${PLAN_PRICE}
          </span>
        </div>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-warn">
          One-time payment · launch price
        </p>
      </div>

      {/* what's included */}
      <ul className="mt-6 space-y-2.5">
        {PLAN_INCLUDES.map((line) => (
          <li key={line} className="flex items-start gap-2.5 text-sm text-ink/90">
            <span className="mt-0.5 shrink-0 text-success">
              <Icon name="Check" size={16} />
            </span>
            {line}
          </li>
        ))}
      </ul>

      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300">
          {error}
        </p>
      )}

      {/* CTA */}
      <button
        type="button"
        onClick={onCheckout}
        disabled={pending}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-[#1a1304] transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--color-warn) 70%, white), var(--color-warn))',
          boxShadow: '0 10px 30px -10px rgba(255,176,32,0.9)',
        }}
      >
        {pending ? 'Opening secure checkout…' : 'Unlock everything'}
        {!pending && <Icon name="ArrowRight" size={16} />}
      </button>
      <p className="mt-3 text-center text-xs text-muted">
        Secure checkout by Stripe. No subscription — yours for good.
      </p>
    </motion.div>
  )
}
