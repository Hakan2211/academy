import { createFileRoute, Link } from '@tanstack/react-router'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../convex/_generated/api'
import { useDeviceId } from '#/lib/deviceId.context'
import { BADGES } from '#/lib/badges'
import { BadgeMedal } from '#/components/ui/BadgeMedal'
import { Icon } from '#/components/ui/Icon'

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
  const keys = Object.keys(BADGES)
  const earnedCount = keys.filter((k) => earned.has(k)).length

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <Icon name="ArrowLeft" size={16} /> Home
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold">Badges</h1>
        <p className="mt-1 text-muted">
          {earnedCount} of {keys.length} earned — finish every lesson in a
          category to collect its medal.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-y-8 sm:grid-cols-4">
        {keys.map((k) => (
          <BadgeMedal key={k} badgeKey={k} earned={earned.has(k)} />
        ))}
      </div>
    </div>
  )
}
