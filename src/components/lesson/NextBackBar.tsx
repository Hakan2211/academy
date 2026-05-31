import { Button } from '#/components/ui/Button'
import { Icon } from '#/components/ui/Icon'

export function NextBackBar({
  current,
  total,
  busy,
  canAdvance,
  onBack,
  onNext,
}: {
  current: number
  total: number
  busy: boolean
  canAdvance: boolean
  onBack: () => void
  onNext: () => void
}) {
  const isLast = current === total - 1
  return (
    <div className="mt-6 flex items-center justify-between gap-3">
      <Button variant="ghost" onClick={onBack} disabled={current === 0 || busy}>
        <Icon name="ArrowLeft" size={16} /> Back
      </Button>
      <Button onClick={onNext} disabled={!canAdvance || busy}>
        {busy ? (
          'Saving…'
        ) : isLast ? (
          <>
            Complete <Icon name="Check" size={16} />
          </>
        ) : (
          <>
            Next <Icon name="ArrowRight" size={16} />
          </>
        )}
      </Button>
    </div>
  )
}
