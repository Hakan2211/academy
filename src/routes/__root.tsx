import { useEffect, useRef } from 'react'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { MDXProvider } from '@mdx-js/react'
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useMutation,
} from 'convex/react'
import type { QueryClient } from '@tanstack/react-query'
import type { ConvexQueryClient } from '@convex-dev/react-query'

import { api } from '../../convex/_generated/api'
import { DeviceIdProvider, useDeviceId } from '#/lib/deviceId.context'
import { PreferencesProvider } from '#/lib/preferences.context'
import { mdxComponents } from '#/components/mdx/MdxComponents'
import { StatBar } from '#/components/ui/StatBar'
import { SideRail } from '#/components/ui/SideRail'
import { CosmosBackdrop } from '#/components/ui/CosmosBackdrop'
import { Icon } from '#/components/ui/Icon'
import { Landing } from '#/components/landing/Landing'
import appCss from '../styles.css?url'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  convexQueryClient: ConvexQueryClient
}>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Academy — Learn science, visually' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

// Routes that render without authentication (and without the app chrome).
const PUBLIC_PATHS = new Set(['/login'])

// Calm cosmic loading state shown while the auth token resolves (and during the
// brief redirect to /login). The persistent CosmosBackdrop sits behind it.
function AuthSplash() {
  return (
    <div className="grid min-h-screen place-items-center">
      <span
        className="grid h-12 w-12 animate-pulse place-items-center rounded-2xl text-accent"
        style={{
          background: 'rgba(79,140,255,0.12)',
          boxShadow: '0 0 24px -6px rgba(79,140,255,0.9)',
        }}
      >
        <Icon name="Atom" size={26} />
      </span>
    </div>
  )
}

// Signed out on a gated route → bounce to /login, remembering where to return.
function RedirectToLogin({ pathname }: { pathname: string }) {
  const navigate = useNavigate()
  useEffect(() => {
    void navigate({ to: '/login', search: { redirect: pathname }, replace: true })
  }, [navigate, pathname])
  return <AuthSplash />
}

// Once the user is authenticated, merge any pre-auth (anonymous deviceId)
// progress into the account — exactly once. The mutation is idempotent, so a
// repeat (e.g. on remount) is harmless.
function ClaimOnAuth() {
  const deviceId = useDeviceId()
  const claim = useMutation(api.users.claimAnonymousProgress)
  const done = useRef(false)
  useEffect(() => {
    if (deviceId && !done.current) {
      done.current = true
      void claim({ deviceId })
    }
  }, [deviceId, claim])
  return null
}

// Gates the app: public paths render bare; everything else requires auth and
// gets the persistent chrome (StatBar + SideRail). Gated route content only
// mounts once authenticated, so its user-scoped queries never run signed out.
// `/` is the one route shown to BOTH: signed-out → public Landing, signed-in →
// the SubjectsHub (its route component, passed as children) with chrome.
function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  if (PUBLIC_PATHS.has(pathname)) {
    return <MDXProvider components={mdxComponents}>{children}</MDXProvider>
  }

  const isHome = pathname === '/'

  return (
    <>
      <AuthLoading>
        <AuthSplash />
      </AuthLoading>
      <Unauthenticated>
        {isHome ? <Landing /> : <RedirectToLogin pathname={pathname} />}
      </Unauthenticated>
      <Authenticated>
        <ClaimOnAuth />
        <StatBar />
        <SideRail />
        <MDXProvider components={mdxComponents}>{children}</MDXProvider>
      </Authenticated>
    </>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <DeviceIdProvider>
          <PreferencesProvider>
            <CosmosBackdrop />
            <AppShell>{children}</AppShell>
          </PreferencesProvider>
        </DeviceIdProvider>
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
