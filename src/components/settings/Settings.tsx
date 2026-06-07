import { Link, useNavigate } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { useAuthActions } from '@convex-dev/auth/react'
import { api } from '../../../convex/_generated/api'
import { usePreferences } from '#/lib/preferences.context'
import { Avatar } from '#/components/ui/Avatar'
import { Icon } from '#/components/ui/Icon'

// Account + device preferences. Appearance settings are device-local
// (localStorage via usePreferences); account identity lives on the Convex row
// and is edited on the Profile page, linked from here.

const ACCENT = '#4F8CFF'

function Card({
  children,
  title,
  icon,
}: {
  children: React.ReactNode
  title: string
  icon: string
}) {
  return (
    <div
      className="rounded-2xl border bg-black/40 p-5 backdrop-blur-xl"
      style={{
        borderColor: 'rgba(255,255,255,0.1)',
        boxShadow:
          '0 16px 44px -24px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/12 text-accent">
          <Icon name={icon} size={17} />
        </span>
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export function Settings() {
  const reduce = useReducedMotion()
  const navigate = useNavigate()
  const meQ = useQuery(convexQuery(api.users.currentUser, {}))
  const me = meQ.data ?? null
  const { signOut } = useAuthActions()
  const { reduceMotion, setReduceMotion } = usePreferences()

  const rise = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay: i * 0.06, ease: 'easeOut' as const },
        }

  async function onSignOut() {
    await signOut()
    void navigate({ to: '/' })
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full px-4 pb-20 pt-6 sm:pl-28 sm:pr-10">
      <div className="mx-auto max-w-2xl">
        <motion.header {...rise(0)} className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Settings
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Preferences
          </h1>
        </motion.header>

        <div className="flex flex-col gap-4">
          {/* account */}
          <motion.div {...rise(1)}>
            <Card title="Account" icon="User">
              <div className="flex items-center gap-3">
                <Avatar
                  name={me?.name}
                  image={me?.image}
                  email={me?.email}
                  size={52}
                  ring={ACCENT}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-bold text-ink">
                    {me?.name && me.name.trim() ? me.name : 'Learner'}
                  </p>
                  <p className="truncate text-sm text-muted">
                    {me?.email ?? 'Signed in'}
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/12 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-white/[0.08]"
                >
                  <Icon name="Pencil" size={14} /> Edit
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* plan / billing */}
          <motion.div {...rise(2)}>
            <Card title="Plan" icon="Gem">
              {me?.isPremium ? (
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-warn/12 text-warn">
                    <Icon name="Crown" size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-ink">Lifetime access</p>
                    <p className="text-xs text-muted">
                      {me.premiumSince
                        ? `Unlocked ${new Date(me.premiumSince).toLocaleDateString(
                            undefined,
                            { year: 'numeric', month: 'long', day: 'numeric' },
                          )} · one-time purchase`
                        : 'Everything unlocked · one-time purchase'}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-warn/40 bg-warn/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warn">
                    Premium
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.05] text-muted">
                    <Icon name="Compass" size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-ink">Free plan</p>
                    <p className="text-xs text-muted">
                      The first world of every subject is free to explore.
                    </p>
                  </div>
                  <Link
                    to="/upgrade"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-warn/40 bg-warn/10 px-3 py-2 text-sm font-semibold text-warn transition-colors hover:bg-warn/20"
                  >
                    <Icon name="Crown" size={14} /> Upgrade
                  </Link>
                </div>
              )}
            </Card>
          </motion.div>

          {/* appearance */}
          <motion.div {...rise(3)}>
            <Card title="Appearance" icon="Sparkles">
              <ToggleRow
                icon="Wind"
                label="Reduce motion"
                desc="Minimize animations and transitions across the app."
                checked={reduceMotion}
                onChange={setReduceMotion}
              />
              <div className="mt-3 border-t border-white/[0.06] pt-3">
                <StaticRow
                  icon="Palette"
                  label="Theme"
                  value="Cosmic"
                  soon
                  desc="A single deep-space theme for now — more on the way."
                />
              </div>
            </Card>
          </motion.div>

          {/* session */}
          <motion.div {...rise(4)}>
            <Card title="Session" icon="ShieldCheck">
              <button
                type="button"
                onClick={() => void onSignOut()}
                className="flex w-full items-center gap-3 rounded-xl border border-red-400/20 bg-red-500/[0.06] px-4 py-3 text-left transition-colors hover:bg-red-500/[0.12]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-500/12 text-red-300">
                  <Icon name="LogOut" size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-ink">Sign out</span>
                  <span className="block text-xs text-muted">
                    End your session on this device.
                  </span>
                </span>
              </button>
            </Card>
          </motion.div>

          <motion.p {...rise(5)} className="px-1 text-center text-xs text-muted">
            Orbisle · Phase 1 — your progress saves to your account.
          </motion.p>
        </div>
      </div>
    </div>
  )
}

function ToggleRow({
  icon,
  label,
  desc,
  checked,
  onChange,
}: {
  icon: string
  label: string
  desc: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.05] text-muted">
        <Icon name={icon} size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="text-xs text-muted">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
        style={{
          background: checked ? ACCENT : 'rgba(255,255,255,0.14)',
          boxShadow: checked ? `0 0 14px -3px ${ACCENT}` : undefined,
        }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
          style={{ left: checked ? '1.375rem' : '0.125rem' }}
        />
      </button>
    </div>
  )
}

function StaticRow({
  icon,
  label,
  value,
  desc,
  soon,
}: {
  icon: string
  label: string
  value: string
  desc: string
  soon?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.05] text-muted">
        <Icon name={icon} size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="text-xs text-muted">{desc}</p>
      </div>
      <span className="flex shrink-0 items-center gap-2">
        <span className="text-sm font-semibold text-muted">{value}</span>
        {soon && (
          <span className="rounded-full border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent">
            Soon
          </span>
        )}
      </span>
    </div>
  )
}
