import { LessonNode } from './LessonNode'
import type { LessonNodeData } from './LessonNode'

export function PathMap({ lessons }: { lessons: Array<LessonNodeData> }) {
  return (
    <div className="relative mx-auto max-w-2xl">
      {/* vertical spine, aligned to the node centers (h-14 -> center at 28px) */}
      <div className="absolute bottom-7 left-7 top-7 w-px bg-border" />
      <div className="relative space-y-6">
        {lessons.map((lesson) => (
          <LessonNode key={lesson.contentSlug} {...lesson} />
        ))}
      </div>
    </div>
  )
}
