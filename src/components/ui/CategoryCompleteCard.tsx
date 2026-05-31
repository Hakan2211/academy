import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { badgeMeta } from '#/lib/badges'
import { Icon } from './Icon'

// Shown at the top of a category's trail once every published lesson is
// complete. Fires confetti once per browser session per category (so revisiting
// a finished category doesn't re-blast it), and offers a path onward.
export function CategoryCompleteCard({
  subjectSlug,
  unitSlug,
  unitName,
  done,
  total,
  accent,
  nextUnitSlug,
  nextUnitName,
}: {
  subjectSlug: string
  unitSlug: string
  unitName: string
  done: number
  total: number
  accent: string
  nextUnitSlug?: string | null
  nextUnitName?: string | null
}) {
  const reduce = useReducedMotion()
  const badge = badgeMeta(`unit-${unitSlug}`)

  useEffect(() => {
    if (reduce) return
    const key = `cat-celebrated:${subjectSlug}/${unitSlug}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      // sessionStorage unavailable (private mode / SSR) â€” just celebrate.
    }
    let cancelled = false
    void import('canvas-confetti').then(({ default: confetti }) => {
      if (cancelled) return
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.35 },
        colors: [accent, '#4F8CFF', '#00d2d3', '#2ecc71', '#ffb020'],
      })
    })
    return () => {
      cancelled = true
    }
  }, [reduce, accent, subjectSlug, unitSlug])

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="relative mb-8 overflow-hidden rounded-2xl border bg-surface p-6 text-center"
      style={{ borderColor: `${accent}66` }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 -top-20 mx-auto h-40 w-40 rounded-full blur-3xl"
        style={{ background: `${accent}33` }}
      />
      <div
        className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full border-2"
        style={{
          color: accent,
          background: `${accent}22`,
          borderColor: accent,
          boxShadow: `0 0 0 4px ${accent}22, 0 0 30px -6px ${accent}`,
        }}
      >
        <Icon name={badge.icon} size={30} />
      </div>
      <p
        className="text-xs font-bold uppercase tracking-[0.2em]"
        style={{ color: accent }}
      >
        âœ¦ Category complete âœ¦
      </p>
      <h2 className="mt-1 text-2xl font-bold">{unitName}</h2>
      <p className="mt-1 text-muted">
        {done}/{total} lessons mastered
      </p>
      <div
        className="mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold"
        style={{
          color: accent,
          borderColor: `${accent}66`,
          background: `${accent}14`,
        }}
      >
        <Icon name="Medal" size={15} /> {badge.label} badge earned
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/subjects/$subjectSlug"
          params={{ subjectSlug }}
          className="inline-flex items-center gap-2 rounded-xl bg-surface-2 px-4 py-2.5 font-semibold text-ink transition-colors hover:bg-border"
        >
          <Icon name="Map" size={16} /> Back to map
        </Link>
        {nextUnitSlug && (
          <Link
            to="/subjects/$subjectSlug/$unitSlug"
            params={{ subjectSlug, unitSlug: nextUnitSlug }}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.98]"
            style={{ background: accent, boxShadow: `0 10px 25px -8px ${accent}99` }}
          >
            Next: {nextUnitName ?? 'Continue'} <Icon name="ArrowRight" size={16} />
          </Link>
        )}
      </div>
    </motion.div>
  )
}
