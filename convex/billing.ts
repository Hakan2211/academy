import { v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'
import { StripeSubscriptions } from '@convex-dev/stripe'
import {
  action,
  internalMutation,
  internalQuery,
} from './_generated/server'
import { components, internal } from './_generated/api'

// Lifetime unlock billing ($199 one-time, Stripe Checkout mode:'payment').
// The @convex-dev/stripe component owns session creation + webhook signature
// verification + syncing its own customers/payments tables; entitlement lives
// denormalized on the users row (isPremium) and is granted ONLY from webhook
// events (http.ts), never from the success URL (forgeable, races the webhook).
const stripe = new StripeSubscriptions(components.stripe, {})

// Profile snapshot for the checkout action (actions can't read the db).
// Flat nullable fields — the documented nested-object-in-union gotcha.
export const billingProfile = internalQuery({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      userId: v.string(),
      email: v.union(v.string(), v.null()),
      name: v.union(v.string(), v.null()),
      isPremium: v.boolean(),
    }),
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null
    const user = await ctx.db.get(userId)
    if (!user) return null
    return {
      userId: userId as string,
      email: user.email ?? null,
      name: user.name ?? null,
      isPremium: user.isPremium === true,
    }
  },
})

export const setStripeCustomerId = internalMutation({
  args: { userId: v.id('users'), stripeCustomerId: v.string() },
  returns: v.null(),
  handler: async (ctx, { userId, stripeCustomerId }) => {
    const user = await ctx.db.get(userId)
    if (user && user.stripeCustomerId !== stripeCustomerId) {
      await ctx.db.patch(userId, { stripeCustomerId })
    }
    return null
  },
})

// Grants the lifetime unlock. Called from Stripe webhook handlers, so it must
// be (a) idempotent — Stripe redelivers events — and (b) graceful on bad input:
// an unattributable event must NOT throw, or Stripe retries it forever.
export const grantLifetime = internalMutation({
  args: {
    userId: v.string(), // raw string from payment metadata — normalized here
    stripeCustomerId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, { userId, stripeCustomerId }) => {
    const id = ctx.db.normalizeId('users', userId)
    if (!id) {
      console.warn('grantLifetime: unparseable userId metadata', userId)
      return null
    }
    const user = await ctx.db.get(id)
    if (!user) {
      console.warn('grantLifetime: no user for id', userId)
      return null
    }
    if (user.isPremium === true) return null // redelivery — keep premiumSince
    await ctx.db.patch(id, {
      isPremium: true,
      premiumSince: Date.now(),
      ...(stripeCustomerId ? { stripeCustomerId } : {}),
    })
    return null
  },
})

// Starts Stripe Checkout for the lifetime unlock; the client redirects to the
// returned URL. Stripe sends the buyer back to /upgrade?status=success|cancelled.
export const createCheckoutSession = action({
  args: {},
  returns: v.object({ url: v.union(v.string(), v.null()) }),
  handler: async (ctx) => {
    // CRITICAL: with @convex-dev/auth, identity.subject is "userId|sessionId"
    // (changes per session) — getAuthUserId is the stable id Stripe metadata
    // and the customer mapping must use.
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Sign in to upgrade.')

    const profile = await ctx.runQuery(internal.billing.billingProfile, {})
    if (!profile) throw new Error('Sign in to upgrade.')
    if (profile.isPremium) throw new Error('You already have lifetime access.')

    const priceId = process.env.STRIPE_PRICE_LIFETIME
    if (!priceId) {
      throw new Error(
        'Billing is not configured (missing STRIPE_PRICE_LIFETIME). Run: npx convex env set STRIPE_PRICE_LIFETIME price_...',
      )
    }
    const siteUrl = process.env.SITE_URL
    if (!siteUrl) {
      throw new Error(
        'Billing is not configured (missing SITE_URL). Run: npx convex env set SITE_URL https://your-app...',
      )
    }

    const checkoutArgs = {
      priceId,
      mode: 'payment' as const,
      successUrl: `${siteUrl}/upgrade?status=success`,
      cancelUrl: `${siteUrl}/upgrade?status=cancelled`,
      // Attribution keys the webhooks read to grant the unlock: the payment
      // intent feeds payment_intent.succeeded (primary), the session-level
      // copy feeds checkout.session.completed (belt-and-braces).
      metadata: { userId: profile.userId },
      paymentIntentMetadata: { userId: profile.userId },
    }

    const customer = await stripe.getOrCreateCustomer(ctx, {
      userId: profile.userId,
      email: profile.email ?? undefined,
      name: profile.name ?? undefined,
    })
    let customerId = customer.customerId

    let session: { url: string | null }
    try {
      session = await stripe.createCheckoutSession(ctx, {
        ...checkoutArgs,
        customerId,
      })
    } catch (e) {
      if (!(e instanceof Error) || !e.message.includes('No such customer')) {
        throw e
      }
      // Self-heal a stale mapping: the Stripe customer was deleted (dashboard
      // cleanup / GDPR) but the component kept its row — getOrCreateCustomer
      // keeps returning the dead id. Orphan the row (re-point its userId AND
      // email away so neither lookup matches), mint a fresh customer, retry.
      await ctx.runMutation(components.stripe.public.createOrUpdateCustomer, {
        stripeCustomerId: customerId,
        email: `deleted+${customerId}@invalid.local`,
        metadata: { userId: `deleted:${customerId}` },
      })
      const fresh = await stripe.createCustomer(ctx, {
        email: profile.email ?? undefined,
        name: profile.name ?? undefined,
        metadata: { userId: profile.userId },
        // Deliberately NO idempotencyKey: getOrCreateCustomer keys creation on
        // the userId, and Stripe replays idempotent requests for 24h — a keyed
        // retry would hand back the DELETED customer again.
      })
      customerId = fresh.customerId
      session = await stripe.createCheckoutSession(ctx, {
        ...checkoutArgs,
        customerId,
      })
    }

    await ctx.runMutation(internal.billing.setStripeCustomerId, {
      userId,
      stripeCustomerId: customerId,
    })
    return { url: session.url }
  },
})

// Support/dev helper: revoke the lifetime unlock (after a refund, or to
// re-test checkout in dev). Run:
//   npx convex run billing:revokePremium '{"email":"user@example.com"}'
export const revokePremium = internalMutation({
  args: { email: v.string() },
  returns: v.boolean(),
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', email))
      .unique()
    if (!user) return false
    await ctx.db.patch(user._id, { isPremium: false, premiumSince: undefined })
    return true
  },
})
