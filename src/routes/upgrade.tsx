import { createFileRoute } from '@tanstack/react-router'
import { Upgrade } from '#/components/billing/Upgrade'

// Lifetime-unlock purchase page. Stripe Checkout returns here with
// ?status=success|cancelled (set by billing.createCheckoutSession's URLs).
// Not in PUBLIC_PATHS, so the auth gate bounces signed-out visitors to
// /login?redirect=/upgrade and brings them back after sign-in.
export const Route = createFileRoute('/upgrade')({
  validateSearch: (
    search: Record<string, unknown>,
  ): { status?: 'success' | 'cancelled' } => ({
    status:
      search.status === 'success' || search.status === 'cancelled'
        ? search.status
        : undefined,
  }),
  // Entitlement is client-side reactive state (auth token in localStorage).
  ssr: false,
  component: UpgradePage,
})

function UpgradePage() {
  const { status } = Route.useSearch()
  return <Upgrade status={status} />
}
