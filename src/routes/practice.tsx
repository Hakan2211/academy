import { createFileRoute } from '@tanstack/react-router'
import { Practice } from '#/components/practice/Practice'

// Client-only: reads device-local progress + shuffles options (Math.random),
// neither of which should run during SSR.
export const Route = createFileRoute('/practice')({
  ssr: false,
  component: Practice,
})
