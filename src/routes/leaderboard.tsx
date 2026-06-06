import { createFileRoute } from '@tanstack/react-router'
import { Leaderboard } from '#/components/leaderboard/Leaderboard'

export const Route = createFileRoute('/leaderboard')({
  component: Leaderboard,
})
