import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuthActions } from '@convex-dev/auth/react'
import { motion, useReducedMotion } from 'motion/react'
import { Icon } from '#/components/ui/Icon'

export const Route = createFileRoute('/login')({
  // `redirect` = where to land after sign-in (set by the auth gate on a
  // bounced deep link). `mode=signup` opens the create-account view (the
  // landing page's primary CTA). Both default sensibly.
  validateSearch: (
    search: Record<string, unknown>,
  ): { redirect?: string; mode?: 'signup' } => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
    mode: search.mode === 'signup' ? 'signup' : undefined,
  }),
  // Auth state is client-side (token in localStorage) — no server render.
  ssr: false,
  component: LoginPage,
})

const RIM = 'rgba(79,140,255,0.32)'
const GLASS =
  '0 0 0 1px rgba(79,140,255,0.08), 0 30px 80px -28px rgba(79,140,255,0.6), inset 0 1px 0 rgba(255,255,255,0.08)'

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.85.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  )
}

function LoginPage() {
  const { redirect, mode: initialMode } = Route.useSearch()
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const { signIn } = useAuthActions()

  const [mode, setMode] = useState<'signIn' | 'signUp'>(
    initialMode === 'signup' ? 'signUp' : 'signIn',
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dest = redirect ?? '/'

  async function onPassword(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      await signIn('password', { email, password, flow: mode })
      await navigate({ to: dest })
    } catch {
      setError(
        mode === 'signIn'
          ? 'Invalid email or password.'
          : 'Could not create your account. The email may already be in use, or the password needs 8+ characters.',
      )
      setPending(false)
    }
  }

  async function onGoogle() {
    setError(null)
    setPending(true)
    try {
      // Redirects to Google, then back to `dest` once the account is linked.
      await signIn('google', { redirectTo: dest })
    } catch {
      setError('Could not start Google sign-in. Please try again.')
      setPending(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm rounded-3xl border bg-black/40 p-7 backdrop-blur-2xl"
        style={{ borderColor: RIM, boxShadow: GLASS }}
      >
        {/* brand */}
        <div className="mb-6 flex flex-col items-center text-center">
          <span
            className="mb-3 grid h-12 w-12 place-items-center rounded-2xl text-accent"
            style={{
              background: 'rgba(79,140,255,0.12)',
              boxShadow: '0 0 24px -6px rgba(79,140,255,0.9)',
            }}
          >
            <span style={{ filter: 'drop-shadow(0 0 8px rgba(79,140,255,0.9))' }}>
              <Icon name="Atom" size={26} />
            </span>
          </span>
          <h1 className="text-xl font-extrabold text-ink">
            {mode === 'signIn' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {mode === 'signIn'
              ? 'Sign in to continue your journey through the universe.'
              : 'Start learning science, visually — your progress saves to your account.'}
          </p>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={onGoogle}
          disabled={pending}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/95 px-4 py-2.5 text-sm font-semibold text-[#1f1f1f] transition-colors hover:bg-white disabled:opacity-60"
        >
          <GoogleGlyph />
          Continue with Google
        </button>

        {/* divider */}
        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            or
          </span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        {/* email / password */}
        <form onSubmit={onPassword} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent/60"
              placeholder="you@example.com"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted">Password</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent/60"
              placeholder={mode === 'signIn' ? 'Your password' : 'At least 8 characters'}
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 78%, white), var(--color-accent))',
              boxShadow: '0 10px 30px -10px rgba(79,140,255,0.9)',
            }}
          >
            {pending
              ? 'Just a moment…'
              : mode === 'signIn'
                ? 'Sign in'
                : 'Create account'}
            {!pending && <Icon name="ArrowRight" size={16} />}
          </button>
        </form>

        {/* toggle */}
        <p className="mt-5 text-center text-sm text-muted">
          {mode === 'signIn' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => {
              setMode((m) => (m === 'signIn' ? 'signUp' : 'signIn'))
              setError(null)
            }}
            className="font-semibold text-accent hover:underline"
          >
            {mode === 'signIn' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
