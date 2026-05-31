import { createFileRoute } from '@tanstack/react-router'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../convex/_generated/api'
import { useDeviceId } from '#/lib/deviceId.context'
import { BadgeConstellation } from '#/components/ui/BadgeConstellation'

export const Route = createFileRoute('/badges')({
  component: BadgesPage,
})

function BadgesPage() {
  const deviceId = useDeviceId()
  const statsQ = useQuery({
    ...convexQuery(api.progress.getUserStats, { deviceId: deviceId ?? '' }),
    enabled: Boolean(deviceId),
  })

  const earned = new Set(statsQ.data?.badges ?? [])
  return <BadgeConstellation earned={earned} />
}
