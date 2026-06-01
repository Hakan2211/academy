import { useEffect } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Icon } from './Icon'

// The slide-in navigation drawer opened from the HUD hamburger (mockup `1.5A`
// shows the ☰; mockup `2.5`'s left rail spells out the destinations). Our IA is
// a top HUD, so the rail lives in an overlay drawer rather than eating space on
// the full-bleed cosmos pages. Live sections link out; planned sections show a
// "Soon" chip so the roadmap is visible without being clickable.

// Planned destinations (not built yet) — surfaced as the roadmap.
const SOON: Array<{ label: string; icon: string; desc: string }> = [
  { label: 'Dashboard', icon: 'LayoutDashboard', desc: 'Your progress at a glance' },
  { label: 'Discover', icon: 'Compass', desc: 'Browse every subject & lesson' },
  { label: 'Practice', icon: 'FlaskConical', desc: 'Standalone experiments & labs' },
  { label: 'Leaderboard', icon: 'Trophy', desc: 'See how you stack up' },
  { label: 'Profile', icon: 'User', desc: 'You, streaks & preferences' },
  { label: 'Settings', icon: 'Settings', desc: 'Theme, motion & account' },
]

const RIM = 'rgba(79,140,255,0.30)'

export function NavMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  // Close on Escape while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const linkClass =
    'group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.06]'

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            className="fixed inset-0 z-[55] bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            onClick={onClose}
            aria-hidden
          />

          {/* panel */}
          <motion.nav
            className="fixed right-0 top-0 z-[60] flex h-full w-[300px] max-w-[86vw] flex-col border-l bg-black/55 backdrop-blur-2xl"
            style={{
              borderColor: RIM,
              boxShadow:
                '-24px 0 70px -30px rgba(79,140,255,0.7), inset 1px 0 0 rgba(255,255,255,0.05)',
            }}
            initial={reduce ? { opacity: 0 } : { x: '100%' }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: '100%' }}
            transition={
              reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 34 }
            }
            aria-label="Main menu"
          >
            {/* header */}
            <div className="flex items-center justify-between px-5 pb-4 pt-5">
              <div className="flex items-center gap-2.5">
                <span
                  className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent"
                  style={{ boxShadow: '0 0 14px -2px rgba(79,140,255,0.85)' }}
                >
                  <Icon name="Atom" size={19} />
                </span>
                <span className="text-lg font-extrabold tracking-tight">Academy</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-ink"
              >
                <Icon name="X" size={18} />
              </button>
            </div>

            {/* search (placeholder — coming soon) */}
            <div className="px-4 pb-1">
              <div
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-muted"
                title="Search — coming soon"
              >
                <Icon name="Search" size={16} />
                <span className="flex-1">Search…</span>
                <SoonChip />
              </div>
            </div>

            {/* scrollable item list */}
            <div className="mt-2 flex-1 overflow-y-auto px-3 pb-4">
              <ul className="flex flex-col gap-1">
                <li>
                  <Link to="/" onClick={onClose} className={linkClass}>
                    <NavRowBody
                      icon="Orbit"
                      label="Home"
                      desc="Your universe of subjects"
                      active={pathname === '/'}
                    />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/subjects/$subjectSlug"
                    params={{ subjectSlug: 'physics' }}
                    onClick={onClose}
                    className={linkClass}
                  >
                    <NavRowBody
                      icon="Atom"
                      label="Physics"
                      desc="The flagship path"
                      active={pathname.startsWith('/subjects/physics')}
                    />
                  </Link>
                </li>
                <li>
                  <Link to="/badges" onClick={onClose} className={linkClass}>
                    <NavRowBody
                      icon="Medal"
                      label="Badges"
                      desc="Your trophy room"
                      active={pathname.startsWith('/badges')}
                    />
                  </Link>
                </li>
              </ul>

              <div className="mb-1 mt-5 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                Coming soon
              </div>
              <ul className="flex flex-col gap-1">
                {SOON.map((item) => (
                  <li key={item.label}>
                    <div
                      className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 opacity-55"
                      title={`${item.label} — coming soon`}
                      aria-disabled
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-muted">
                        <Icon name={item.icon} size={18} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-ink/80">
                          {item.label}
                        </span>
                        <span className="block truncate text-xs text-muted">
                          {item.desc}
                        </span>
                      </span>
                      <span className="ml-auto shrink-0">
                        <SoonChip />
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* footer */}
            <div className="border-t border-white/[0.08] px-5 py-3 text-[11px] text-muted">
              Physics · Phase 1 — more subjects on the way.
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}

function NavRowBody({
  icon,
  label,
  desc,
  active,
}: {
  icon: string
  label: string
  desc: string
  active: boolean
}) {
  return (
    <>
      <span
        className={
          'grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors ' +
          (active
            ? 'bg-accent/20 text-accent'
            : 'bg-white/[0.05] text-ink group-hover:text-accent')
        }
      >
        <Icon name={icon} size={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="block truncate text-xs text-muted">{desc}</span>
      </span>
      {active && (
        <span
          className="ml-auto h-2 w-2 shrink-0 rounded-full bg-accent"
          style={{ boxShadow: '0 0 8px var(--color-accent)' }}
        />
      )}
    </>
  )
}

function SoonChip() {
  return (
    <span className="rounded-full border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent">
      Soon
    </span>
  )
}
