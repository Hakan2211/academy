import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { QuizOption } from '#/components/ui/QuizOption'
import type { QuizOptionState } from '#/components/ui/QuizOption'
import { useStepGate } from '#/components/lesson/context'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

export function Quiz({
  prompt,
  options,
  correctIndex,
  explanation,
}: {
  prompt: string
  options: Array<string>
  correctIndex: number
  explanation?: string
}) {
  const { setCanAdvance } = useStepGate()
  const [selected, setSelected] = useState<number | null>(null)
  const answeredCorrectly = selected === correctIndex

  const choose = (i: number) => {
    if (answeredCorrectly) return // locked once correct
    setSelected(i)
    if (i === correctIndex) setCanAdvance(true)
  }

  const stateFor = (i: number): QuizOptionState => {
    if (selected === null) return 'idle'
    if (i === correctIndex && answeredCorrectly) return 'correct'
    if (i === selected && i !== correctIndex) return 'wrong'
    return 'idle'
  }

  return (
    <div className="space-y-3">
      <p className="font-medium">{prompt}</p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <QuizOption
            key={i}
            label={opt}
            state={stateFor(i)}
            onClick={() => choose(i)}
            disabled={answeredCorrectly}
          />
        ))}
      </div>
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              'rounded-xl border p-3 text-sm',
              answeredCorrectly
                ? 'border-success/40 bg-success/10'
                : 'border-warn/40 bg-warn/10',
            )}
          >
            <div className="mb-1 flex items-center gap-2 font-semibold">
              <Icon name={answeredCorrectly ? 'CircleCheck' : 'Info'} size={16} />
              {answeredCorrectly ? 'Correct!' : 'Not quite — try again'}
            </div>
            {explanation && <p className="text-muted">{explanation}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
