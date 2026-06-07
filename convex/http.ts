import { httpRouter } from 'convex/server'
import { registerRoutes } from '@convex-dev/stripe'
import { auth } from './auth'
import { components, internal } from './_generated/api'

const http = httpRouter()

// Mounts the OAuth callback + sign-in HTTP routes (e.g.
// /api/auth/callback/google) on the deployment's .convex.site domain.
auth.addHttpRoutes(http)

// Stripe webhooks (signature-verified by the component) at /stripe/webhook on
// the same .convex.site domain. The component syncs its own tables first, then
// calls these hooks. Entitlement is granted HERE — never from the success URL.
//
// Error policy: unattributable events (no userId metadata) warn + return so we
// answer 2xx and Stripe stops retrying; genuine internal failures throw so
// Stripe redelivers (grantLifetime is idempotent, so redelivery is safe).
registerRoutes(http, components.stripe, {
  webhookPath: '/stripe/webhook',
  events: {
    // Primary entitlement signal for mode:'payment' checkouts.
    'payment_intent.succeeded': async (ctx, event) => {
      const intent = event.data.object
      const userId = intent.metadata?.userId
      if (!userId) {
        console.warn(
          'stripe webhook: payment_intent.succeeded without userId metadata',
          intent.id,
        )
        return
      }
      await ctx.runMutation(internal.billing.grantLifetime, {
        userId,
        stripeCustomerId:
          typeof intent.customer === 'string' ? intent.customer : undefined,
      })
    },
    // Belt-and-braces second chance: a paid checkout session also grants. The
    // session itself carries our metadata only when set at the session level,
    // so this fires only for sessions whose metadata.userId is present.
    'checkout.session.completed': async (ctx, event) => {
      const session = event.data.object
      if (session.payment_status !== 'paid') return
      const userId = session.metadata?.userId
      if (!userId) return // primary handler owns attribution via the intent
      await ctx.runMutation(internal.billing.grantLifetime, {
        userId,
        stripeCustomerId:
          typeof session.customer === 'string' ? session.customer : undefined,
      })
    },
  },
})

export default http
