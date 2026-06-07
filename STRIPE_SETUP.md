# Stripe setup — $199 lifetime unlock

The code is fully wired (see `convex/billing.ts`, `convex/http.ts`, `/upgrade`).
What remains is connecting YOUR Stripe account. ~15 minutes, test mode first.

## 1. Create the product (test mode)

1. [dashboard.stripe.com](https://dashboard.stripe.com) → toggle **Test mode** (top right).
2. Product catalog → **Add product**:
   - Name: `Academy — Lifetime access`
   - Price: **$199.00**, **One-off** (not recurring)
3. Copy the price id (`price_...`).

## 2. Set Convex env vars (dev deployment)

```
npx convex env set STRIPE_SECRET_KEY sk_test_...        # Developers → API keys
npx convex env set STRIPE_PRICE_LIFETIME price_...      # from step 1
npx convex env set SITE_URL http://localhost:3000
```

## 3. Add the webhook endpoint

1. Stripe Dashboard → Developers → **Webhooks** → Add endpoint.
2. URL: `https://<your-deployment>.convex.site/stripe/webhook`
   - ⚠️ `.convex.site`, NOT `.convex.cloud`. Find the deployment name in
     `.env.local` (`VITE_CONVEX_URL`) or the Convex dashboard.
3. Events to send — select at least:
   - `checkout.session.completed`
   - `payment_intent.succeeded`, `payment_intent.payment_failed`
   - `customer.created`, `customer.updated`
   - `charge.refunded`
   - `invoice.created`, `invoice.finalized`, `invoice.paid`, `invoice.payment_failed`
4. Copy the signing secret:
   ```
   npx convex env set STRIPE_WEBHOOK_SECRET whsec_...
   ```

## 4. Test the full flow

1. `npm run convex` + `npm run dev`, sign in with a test account.
2. Any subject → world 2+ shows the gold Premium ring → click → `/upgrade`.
3. **Unlock everything** → Stripe Checkout → card `4242 4242 4242 4242`,
   any future expiry, any CVC.
4. You land on `/upgrade?status=success` → "Finalizing…" → flips to the gold
   welcome card within seconds (webhook → `users.isPremium`). All locks melt.
5. If it hangs on "Finalizing": Stripe Dashboard → Webhooks → the endpoint →
   check recent deliveries (the response body shows the Convex error), and
   `npx convex logs` for `grantLifetime` warnings.

## 5. Before launch (live mode)

Repeat steps 1–3 with **live** keys against the **prod** Convex deployment:

```
npx convex env set STRIPE_SECRET_KEY sk_live_...  --prod
npx convex env set STRIPE_PRICE_LIFETIME price_... --prod   # live-mode price id
npx convex env set SITE_URL https://<your-domain> --prod
npx convex env set STRIPE_WEBHOOK_SECRET whsec_... --prod   # live endpoint secret
```

…and a separate live webhook endpoint pointing at the prod `.convex.site` URL.

## How entitlement works (for future reference)

- Free tier = the **first world (unit.order === 1) of every subject** —
  single source of truth in `convex/entitlements.ts`.
- Buying sets `users.isPremium` via the webhook (`payment_intent.succeeded`
  with `metadata.userId`) — **never** from the success URL.
- Server-enforced: `progress.recordStepCompletion` / `completeLesson` throw
  `Premium required` for premium lessons; practice queries return empty for
  free users. UI locks are cosmetic on top of that.
- Refunds: manual for now — refund in the Stripe dashboard, then clear
  `isPremium` on the user row in the Convex dashboard.
