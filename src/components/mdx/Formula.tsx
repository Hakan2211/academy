import katex from 'katex'
import 'katex/dist/katex.min.css'

export function Formula({ tex, block = false }: { tex: string; block?: boolean }) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: block,
  })
  return (
    <span
      className={block ? 'my-3 block text-center text-lg' : ''}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
