import { createFileRoute } from '@tanstack/react-router'
import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery, useQuery } from '@tanstack/react-query'
import { api } from '../../convex/_generated/api'
import { CategoryOverworld } from '#/components/ui/CategoryOverworld'
import type { OverworldUnit } from '#/components/ui/CategoryOverworld'
import { useIsPremium } from '#/lib/billing'

export const Route = createFileRoute('/subjects/$subjectSlug/')({
  component: SubjectPage,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.catalog.getSubjectOverview, {
        subjectSlug: params.subjectSlug,
      }),
    )
  },
})

function SubjectPage() {
  const { subjectSlug } = Route.useParams()

  const { data } = useSuspenseQuery(
    convexQuery(api.catalog.getSubjectOverview, { subjectSlug }),
  )

  // Per-user completed-lesson set (one summary doc — bandwidth-lean).
  const progressQuery = useQuery(
    convexQuery(api.progress.getCompletedLessons, {}),
  )

  // Lifetime-unlock entitlement; premium worlds show the gold ring for free users.
  const { isPremium } = useIsPremium()

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">
        Subject not found.
      </div>
    )
  }

  const completedIds = new Set(progressQuery.data ?? [])

  const units: Array<OverworldUnit> = data.units.map((unit) => ({
    slug: unit.slug,
    name: unit.name,
    icon: unit.icon,
    accentColor: unit.accentColor,
    done: unit.lessonIds.filter((id) => completedIds.has(id)).length,
    total: unit.lessonCount,
    requiresPremium: unit.requiresPremium,
  }))

  if (units.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">
        Categories are coming soon.
      </div>
    )
  }

  return (
    <CategoryOverworld
      subjectSlug={subjectSlug}
      subjectName={data.subject.name}
      subjectColor={data.subject.color}
      units={units}
      isPremium={isPremium}
    />
  )
}
