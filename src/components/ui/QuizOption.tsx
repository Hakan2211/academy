import { cn } from '#/lib/cn'
import { Icon } from './Icon'

export type QuizOptionState = 'idle' | 'selected' | 'correct' | 'wrong'

export function QuizOption({
  label,
  state,
  onClick,
  disabled,
}: {
  label: string
  state: QuizOptionState
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all disabled:cursor-default',
        state === 'idle' && 'border-border bg-surface-2 hover:border-accent/60',
        state === 'selected' && 'border-accent bg-accent/10',
        state === 'correct' && 'border-success bg-success/15',
        state === 'wrong' && 'border-danger bg-danger/15',
      )}
    >
      <span>{label}</span>
      {state === 'correct' && <Icon name="Check" size={18} className="text-success" />}
      {state === 'wrong' && <Icon name="X" size={18} className="text-danger" />}
    </button>
  )
}
