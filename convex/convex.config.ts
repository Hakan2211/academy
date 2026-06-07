import { defineApp } from 'convex/server'
import stripe from '@convex-dev/stripe/convex.config.js'

// Convex components. The Stripe component owns checkout-session creation,
// webhook signature verification, and syncing customers/payments into its own
// namespaced tables; our entitlement (users.isPremium) is granted from its
// webhook event hooks in http.ts.
const app = defineApp()
app.use(stripe)

export default app
