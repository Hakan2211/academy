import type { ComponentType } from 'react'

export type LessonModule = {
  default: ComponentType<Record<string, unknown>>
  frontmatter: {
    title: string
    subject: string
    contentSlug: string
    order?: number
    estimatedMinutes?: number
    [key: string]: unknown
  }
}

// Lazy registry of every authored lesson. Keyed by file path; we match on the
// `contentSlug` suffix so routing is decoupled from the on-disk file tree.
const modules = import.meta.glob('../content/lessons/**/*.mdx') as Record<
  string,
  () => Promise<LessonModule>
>

export function getLessonModule(
  contentSlug: string,
): (() => Promise<LessonModule>) | undefined {
  const entry = Object.entries(modules).find(([path]) =>
    path.endsWith(`/lessons/${contentSlug}.mdx`),
  )
  return entry?.[1]
}

export function allLessonSlugs(): Array<string> {
  return Object.keys(modules)
    .map((p) => p.match(/\/lessons\/(.+)\.mdx$/)?.[1])
    .filter((s): s is string => Boolean(s))
}
