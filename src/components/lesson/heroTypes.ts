import { mdxComponents } from '#/components/mdx/MdxComponents'

// Which MDX components count as a step's "hero visual" (eligible for the
// two-pane lesson layout — big on the left, text panel on the right). Rather
// than tag ~70 viz components by hand, we treat EVERYTHING in the registry as a
// hero EXCEPT the lesson engine, the inline/panel blocks (quiz/callout/formula),
// and the styled typography. So any visual added to the registry in future is
// automatically hero-eligible — zero maintenance.
const NON_HERO = new Set([
  // engine
  'Lesson',
  'Step',
  // inline / panel blocks that belong with the prose, not as a hero stage
  'Quiz',
  'Callout',
  'Formula',
  // styled base typography
  'h1',
  'h2',
  'h3',
  'p',
  'ul',
  'ol',
  'li',
  'a',
  'strong',
  'code',
  'blockquote',
])

// Computed LAZILY (first call, at render) — not at module load — to dodge the
// Lesson ↔ MdxComponents import cycle (reading mdxComponents at eval time would
// see it half-initialised).
let cache: Set<unknown> | null = null
export function getHeroTypes(): Set<unknown> {
  if (cache) return cache
  cache = new Set(
    Object.entries(mdxComponents)
      .filter(([name]) => !NON_HERO.has(name))
      .map(([, comp]) => comp),
  )
  return cache
}
