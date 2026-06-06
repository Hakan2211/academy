import { createRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  // Falls back to a placeholder so the app still boots before you run
  // `npx convex dev` (which writes VITE_CONVEX_URL). Convex-backed routes
  // won't have data until then, but the rest of the app renders.
  const CONVEX_URL =
    (import.meta as any).env.VITE_CONVEX_URL ?? 'https://placeholder.convex.cloud'

  const convexQueryClient = new ConvexQueryClient(CONVEX_URL)

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  })
  convexQueryClient.connect(queryClient)

  const router = createRouter({
    routeTree,
    context: { queryClient, convexQueryClient },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    // ConvexAuthProvider supplies the Convex client context *and* the auth
    // state (token kept in localStorage). It replaces the plain ConvexProvider;
    // useQuery/useMutation now run as the signed-in user.
    Wrap: ({ children }) => (
      <ConvexAuthProvider client={convexQueryClient.convexClient}>
        {children}
      </ConvexAuthProvider>
    ),
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
