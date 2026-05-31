import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Icon } from './Icon'
import { cn } from '#/lib/cn'

export type SubjectCardData = {
  slug: string
  name: string
  description: string
  color: string
  icon: string
  isPublished: boolean
}

export function SubjectCard({ subject }: { subject: SubjectCardData }) {
  const body = (
    <motion.div
      whileHover={subject.isPublished ? { y: -4 } : undefined}
      className={cn(
        'group relative h-full overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-colors',
        subject.isPublished ? 'hover:border-accent/50' : 'opacity-60',
      )}
    >
      <div
        className="mb-4 grid h-12 w-12 place-items-center rounded-xl"
        style={{ background: `${subject.color}22`, color: subject.color }}
      >
        <Icon name={subject.icon} size={24} />
      </div>
      <h3 className="text-lg font-semibold">{subject.name}</h3>
      <p className="mt-1 text-sm text-muted">{subject.description}</p>
      <div
        className="mt-4 text-sm font-medium"
        style={{ color: subject.isPublished ? subject.color : undefined }}
      >
        {subject.isPublished ? (
          <span className="inline-flex items-center gap-1">
            Start learning <Icon name="ArrowRight" size={16} />
          </span>
        ) : (
          <span className="text-muted">Coming soon</span>
        )}
      </div>
    </motion.div>
  )

  if (!subject.isPublished) return body
  return (
    <Link
      to="/subjects/$subjectSlug"
      params={{ subjectSlug: subject.slug }}
      className="block h-full"
    >
      {body}
    </Link>
  )
}
