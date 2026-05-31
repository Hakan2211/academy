import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * Renders children only after mount on the client. Use this around anything
 * that touches browser-only APIs (WebGL/Three.js, window, localStorage) so it
 * never runs during SSR.
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <>{fallback}</>
  return <>{children}</>
}
