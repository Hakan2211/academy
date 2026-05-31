export function Figure({
  src,
  alt,
  caption,
}: {
  src: string
  alt?: string
  caption?: string
}) {
  return (
    <figure className="my-2 overflow-hidden rounded-xl border border-border bg-surface">
      <img src={src} alt={alt ?? caption ?? ''} className="w-full" />
      {caption && (
        <figcaption className="border-t border-border bg-surface-2 px-4 py-2 text-sm text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
