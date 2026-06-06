import Google from '@auth/core/providers/google'
import { Password } from '@convex-dev/auth/providers/Password'
import { convexAuth } from '@convex-dev/auth/server'
import type { MutationCtx } from './_generated/server'

// Convex Auth: Google OAuth + email/password. Identity lives in this Convex
// deployment; the authenticated user IS a row in the `users` table, looked up
// server-side via getAuthUserId(ctx). (Replaces the old anonymous deviceId model;
// a device's anonymous progress is merged in once via users.claimAnonymousProgress.)
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Google,
    Password({
      validatePasswordRequirements: (password: string) => {
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters.')
        }
      },
    }),
  ],
  callbacks: {
    // We own user creation because our `users` table has required gamification
    // fields the library's default insert wouldn't set. This must also handle
    // account linking by email itself.
    async createOrUpdateUser(ctx: MutationCtx, args) {
      // Re-auth of an already-linked account → keep the same row.
      if (args.existingUserId) return args.existingUserId

      // Provider profile values come through loosely typed — narrow to strings.
      const email = args.profile.email as string | undefined
      const name = args.profile.name as string | undefined
      const image = args.profile.image as string | undefined

      // Link by email: e.g. signed up with password, later signs in with Google.
      if (email) {
        const byEmail = await ctx.db
          .query('users')
          .withIndex('email', (q) => q.eq('email', email))
          .unique()
        if (byEmail) {
          await ctx.db.patch(byEmail._id, {
            name: name ?? byEmail.name,
            image: image ?? byEmail.image,
          })
          return byEmail._id
        }
      }

      // First sign-in → fresh learner with gamification defaults.
      return await ctx.db.insert('users', {
        email,
        name,
        image,
        createdAt: Date.now(),
        totalXP: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        badges: [],
      })
    },
  },
})
