import { createFileRoute } from '@tanstack/react-router'
import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { api } from '../../convex/_generated/api'
import { SubjectsHub } from '#/components/hub/SubjectsHub'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.catalog.listSubjects, {}),
    )
  },
})

function Home() {
  const { data: subjects } = useSuspenseQuery(
    convexQuery(api.catalog.listSubjects, {}),
  )

  return <SubjectsHub subjects={subjects} />
}
