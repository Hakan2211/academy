import { cn } from '#/lib/cn'

export function ProgressDots({
  current,
  total,
}: {
  current: number
  total: number
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'h-1.5 rounded-full transition-all',
            i < current && 'w-6 bg-accent',
            i === current && 'w-6 bg-accent-2',
            i > current && 'w-3 bg-border',
          )}
        />
      ))}
    </div>
  )
}
