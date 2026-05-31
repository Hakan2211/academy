import { useEffect } from 'react'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { MDXProvider } from '@mdx-js/react'
import { useMutation } from 'convex/react'
import type { QueryClient } from '@tanstack/react-query'
import type { ConvexQueryClient } from '@convex-dev/react-query'

import { api } from '../../convex/_generated/api'
import { DeviceIdProvider, useDeviceId } from '#/lib/deviceId.context'
import { mdxComponents } from '#/components/mdx/MdxComponents'
import { StatBar } from '#/components/ui/StatBar'
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

// Creates (or finds) the anonymous user for this device once it's known.
function EnsureUser() {
  const deviceId = useDeviceId()
  const getOrCreate = useMutation(api.users.getOrCreateByDevice)
  useEffect(() => {
    if (deviceId) void getOrCreate({ deviceId })
  }, [deviceId, getOrCreate])
  return null
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <DeviceIdProvider>
          <EnsureUser />
          <StatBar />
          <MDXProvider components={mdxComponents}>{children}</MDXProvider>
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
