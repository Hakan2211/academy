declare module '*.mdx' {
  import type { ComponentType } from 'react'
  export const frontmatter: Record<string, any>
  const MDXComponent: ComponentType<Record<string, unknown>>
  export default MDXComponent
}
