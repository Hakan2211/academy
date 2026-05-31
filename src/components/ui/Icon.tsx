import * as Lucide from 'lucide-react'
import type { LucideProps } from 'lucide-react'

type IconComponent = (props: LucideProps) => React.ReactNode

/** Render a lucide icon by name (e.g. "Atom", "Flame", "Check"). */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const lib = Lucide as unknown as Record<string, IconComponent>
  const Cmp = lib[name] ?? lib['Circle']
  return <Cmp {...props} />
}
