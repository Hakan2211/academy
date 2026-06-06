import { createFileRoute } from '@tanstack/react-router'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../convex/_generated/api'
import { BadgeConstellation } from '#/components/ui/BadgeConstellation'

export const Route = createFileRoute('/badges')({
  component: BadgesPage,
})

function BadgesPage() {
  const statsQ = useQuery(convexQuery(api.progress.getUserStats, {}))

  const earned = new Set(statsQ.data?.badges ?? [])
  return <BadgeConstellation earned={earned} />
}
