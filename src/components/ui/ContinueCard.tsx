import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../convex/_generated/api'
import { Icon } from './Icon'

// Home-screen entry point back into the journey. Reads the resume point for the
// flagship subject and renders one of three states: a fresh "start" nudge, a
// "continue" card pointing at the next lesson, or a "done" celebration once
// every published Physics lesson is complete.
const SUBJECT = 'physics'
const DEFAULT_ACCENT = '#4F8CFF'

export function ContinueCard() {
  const resumeQ = useQuery(
    convexQuery(api.catalog.getResumePoint, { subjectSlug: SUBJECT }),
  )

  const resume = resumeQ.data
  if (!resume) return null // loading, unknown subject, or no published lessons

  if (resume.state === 'done') {
    return (
      <Shell accent={DEFAULT_ACCENT}>
        <div className="min-w-0">
          <Eyebrow accent={DEFAULT_ACCENT}>Physics complete</Eyebrow>
          <h3 className="mt-1 text-lg font-semibold">
            You&rsquo;ve finished every Physics lesson 🎉
          </h3>
        </div>
        <Link
          to="/subjects/$subjectSlug"
          params={{ subjectSlug: SUBJECT }}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.98]"
          style={{
            background: DEFAULT_ACCENT,
            boxShadow: `0 10px 25px -8px ${DEFAULT_ACCENT}99`,
          }}
        >
          <Icon name="Map" size={18} /> Review map
        </Link>
      </Shell>
    )
  }

  // 'start' | 'continue' — the resume fields are populated together.
  const contentSlug = resume.contentSlug
  if (!contentSlug) return null
  const accent: string = resume.accentColor ?? DEFAULT_ACCENT
  const isStart = resume.state === 'start'

  return (
    <Shell accent={accent}>
      <div className="min-w-0">
        <Eyebrow accent={accent}>
          {isStart ? 'Start your journey' : 'Continue your path'}
        </Eyebrow>
        <p className="mt-1 text-sm text-muted">
          {resume.unitName} · Lesson {resume.lessonNumber}
        </p>
        <h3 className="mt-0.5 truncate text-lg font-semibold">{resume.title}</h3>
      </div>
      <Link
        to="/learn/$"
        params={{ _splat: contentSlug }}
        className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.98]"
        style={{ background: accent, boxShadow: `0 10px 25px -8px ${accent}99` }}
      >
        <Icon name="Play" size={18} /> {isStart ? 'Start' : 'Go'}
      </Link>
    </Shell>
  )
}

function Shell({
  accent,
  children,
}: {
  accent: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative mb-8 flex items-center justify-between gap-4 overflow-hidden rounded-2xl border bg-surface p-5"
      style={{ borderColor: `${accent}55` }}
    >
      {/* soft accent glow in the corner */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl"
        style={{ background: `${accent}22` }}
      />
      {children}
    </motion.div>
  )
}

function Eyebrow({
  accent,
  children,
}: {
  accent: string
  children: React.ReactNode
}) {
  return (
    <p
      className="text-xs font-bold uppercase tracking-wider"
      style={{ color: accent }}
    >
      {children}
    </p>
  )
}
