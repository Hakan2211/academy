import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../convex/_generated/api'

// Client-side view of the lifetime-unlock entitlement. Rides the same
// users.currentUser query the chrome already subscribes to (react-query dedupes
// it), so premium flips reactively the moment the Stripe webhook lands.
//
// `isPremium` is `undefined` WHILE LOADING — consumers must only render lock
// visuals when it is strictly `false` (avoids a lock-flash for premium users on
// slow connections; the server enforces the rule regardless of what the UI shows).
export function useIsPremium(): {
  isPremium: boolean | undefined
  premiumSince: number | null
} {
  const { data, isLoading } = useQuery(convexQuery(api.users.currentUser, {}))
  if (isLoading || data === undefined) {
    return { isPremium: undefined, premiumSince: null }
  }
  return {
    isPremium: data?.isPremium === true,
    premiumSince: data?.premiumSince ?? null,
  }
}

// Lifetime-unlock marketing copy shared by the Landing pricing section and the
// in-app /upgrade card so the offer never drifts between the two.
export const PLAN_PRICE = 199
export const PLAN_PRICE_FULL = 599
export const PLAN_INCLUDES = [
  'All 9 subjects: 136 worlds, 880+ interactive lessons',
  'Every future subject & update, included free',
  'Interactive sims, quizzes & spaced-retrieval practice',
  'Badges, streaks & your own learning journey',
  'Yours forever. One payment, no subscription',
]
