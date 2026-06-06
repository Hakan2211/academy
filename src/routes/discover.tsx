import { createFileRoute } from '@tanstack/react-router'
import { Discover } from '#/components/discover/Discover'

export const Route = createFileRoute('/discover')({
  component: Discover,
})
