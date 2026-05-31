import { createFileRoute, Outlet } from '@tanstack/react-router'

// Layout route for a subject. The category grid lives in the index child
// (subjects.$subjectSlug.index.tsx) and each category's table of contents in
// subjects.$subjectSlug.$unitSlug.tsx; this just renders whichever matched.
export const Route = createFileRoute('/subjects/$subjectSlug')({
  component: () => <Outlet />,
})
