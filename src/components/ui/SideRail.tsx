import { Link, useRouterState } from '@tanstack/react-router'
import { Icon } from './Icon'

// Floating left nav rail (mockup 1B): a vertical glass capsule of icon+label
// destinations hovering over the universe, separate from the stat HUD. Live
// sections link out with an active highlight; planned ones are dimmed. Kept
// vertically centred + narrow so it floats over the cosmos without colliding
// with the routes' top-left chrome. Hidden on the immersive lesson player and
// on the smallest screens (where it would crowd the scene).

const RIM = 'rgba(79,140,255,0.30)'

export function SideRail() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  // Hidden on the immersive lesson player and inside a category trail
  // (/subjects/<subject>/<unit>), where the trail's own back pill + outward
  // lesson cards already own the left edge. The hub (/) and subject overworld
  // (/subjects/<subject>) keep it.
  const segs = pathname.split('/').filter(Boolean)
  const isLessonTrail = segs[0] === 'subjects' && segs.length >= 3
  if (pathname.startsWith('/learn') || isLessonTrail) return null

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-1 rounded-[1.4rem] border bg-black/40 p-2 backdrop-blur-xl sm:flex"
      style={{
        borderColor: RIM,
        boxShadow:
          '0 0 0 1px rgba(79,140,255,0.08), 0 18px 50px -20px rgba(79,140,255,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      <Link to="/" className="block">
        <RailBody icon="Orbit" label="Home" active={pathname === '/'} />
      </Link>
      <Link to="/dashboard" className="block">
        <RailBody
          icon="LayoutDashboard"
          label="Stats"
          active={pathname.startsWith('/dashboard')}
        />
      </Link>
      <Link
        to="/subjects/$subjectSlug"
        params={{ subjectSlug: 'physics' }}
        className="block"
      >
        <RailBody
          icon="Atom"
          label="Physics"
          active={pathname.startsWith('/subjects/physics')}
        />
      </Link>
      <Link to="/practice" className="block">
        <RailBody
          icon="Brain"
          label="Practice"
          active={pathname.startsWith('/practice')}
        />
      </Link>
      <Link to="/badges" className="block">
        <RailBody icon="Medal" label="Badges" active={pathname.startsWith('/badges')} />
      </Link>

      <div className="my-1 h-px w-8 self-center bg-white/10" />

      <RailSoon icon="Compass" label="Discover" />
      <RailSoon icon="User" label="Profile" />
    </nav>
  )
}

function RailBody({
  icon,
  label,
  active,
}: {
  icon: string
  label: string
  active: boolean
}) {
  return (
    <span
      className={
        'group flex w-14 flex-col items-center gap-1 rounded-xl px-1 py-2 transition-colors ' +
        (active ? 'bg-accent/12' : 'hover:bg-white/[0.06]')
      }
    >
      <span
        className={
          'grid h-9 w-9 place-items-center rounded-lg transition-colors ' +
          (active
            ? 'bg-accent/25 text-accent'
            : 'bg-white/[0.04] text-ink group-hover:text-accent')
        }
        style={active ? { boxShadow: '0 0 16px -4px var(--color-accent)' } : undefined}
      >
        <Icon name={icon} size={18} />
      </span>
      <span
        className={
          'text-[9px] font-bold uppercase tracking-wide ' +
          (active ? 'text-accent' : 'text-muted')
        }
      >
        {label}
      </span>
    </span>
  )
}

function RailSoon({ icon, label }: { icon: string; label: string }) {
  return (
    <div
      className="flex w-14 cursor-not-allowed flex-col items-center gap-1 rounded-xl px-1 py-2 opacity-45"
      title={`${label} — coming soon`}
      aria-disabled
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.03] text-muted">
        <Icon name={icon} size={18} />
      </span>
      <span className="text-[9px] font-bold uppercase tracking-wide text-muted">
        {label}
      </span>
    </div>
  )
}
