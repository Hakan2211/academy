import { httpRouter } from 'convex/server'
import { auth } from './auth'

const http = httpRouter()

// Mounts the OAuth callback + sign-in HTTP routes (e.g.
// /api/auth/callback/google) on the deployment's .convex.site domain.
auth.addHttpRoutes(http)

export default http
