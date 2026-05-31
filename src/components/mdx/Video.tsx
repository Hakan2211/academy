export function Video({
  src,
  poster,
  caption,
}: {
  src: string
  poster?: string
  caption?: string
}) {
  return (
    <figure className="my-2 overflow-hidden rounded-xl border border-border bg-black">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video src={src} poster={poster} controls className="w-full" />
      {caption && (
        <figcaption className="border-t border-border bg-surface-2 px-4 py-2 text-sm text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
