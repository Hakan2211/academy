import type { ButtonHTMLAttributes } from 'react'
import { cn } from '#/lib/cn'

type Variant = 'primary' | 'ghost' | 'subtle'

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40'
  const variants: Record<Variant, string> = {
    primary:
      'bg-accent text-white shadow-lg shadow-accent/25 hover:brightness-110 active:scale-[0.98]',
    ghost: 'text-muted hover:bg-surface-2 hover:text-ink',
    subtle: 'bg-surface-2 text-ink hover:bg-border',
  }
  return <button className={cn(base, variants[variant], className)} {...props} />
}
