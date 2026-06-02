import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A variable is a named box that holds a value. Its TYPE says what kind of value
// lives inside — a number, some text (a string), or a true/false (boolean).
// Assign a new value and the box's contents change; assign a different kind of
// value and its type changes too. Click the chips to reassign the box.

type DType = 'number' | 'string' | 'boolean'

type Value = { type: DType; display: string }

const TYPE_COLOR: Record<DType, string> = {
  number: '#4F8CFF',
  string: '#FFC83D',
  boolean: '#2ECC71',
}

const TYPE_ICON: Record<DType, string> = {
  number: 'Hash',
  string: 'Type',
  boolean: 'ToggleRight',
}

// Each chip is a possible assignment: a literal you could write in code.
const ASSIGNMENTS: Array<{ code: string; value: Value }> = [
  { code: 'score = 42', value: { type: 'number', display: '42' } },
  { code: 'score = 3.14', value: { type: 'number', display: '3.14' } },
  { code: 'name = "Ada"', value: { type: 'string', display: '"Ada"' } },
  { code: 'name = "hello"', value: { type: 'string', display: '"hello"' } },
  { code: 'ready = true', value: { type: 'boolean', display: 'true' } },
  { code: 'ready = false', value: { type: 'boolean', display: 'false' } },
]

export function VariableBox() {
  const [sel, setSel] = useState(0)
  const a = ASSIGNMENTS[sel]
  const name = a.code.split(' ')[0]
  const value = a.value
  const color = TYPE_COLOR[value.type]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap justify-center gap-2">
        {ASSIGNMENTS.map((asn, i) => (
          <button
            key={asn.code}
            type="button"
            onClick={() => setSel(i)}
            className={cn(
              'rounded-full border px-3 py-1 font-mono text-xs transition-colors',
              sel === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {asn.code}
          </button>
        ))}
      </div>

      {/* The box */}
      <div className="mt-5 flex justify-center">
        <div className="flex flex-col items-center">
          <span className="mb-1 font-mono text-sm text-muted">{name}</span>
          <div
            className="flex h-24 w-44 items-center justify-center rounded-xl border-2 bg-surface-2 transition-all"
            style={{ borderColor: color }}
          >
            <span className="font-mono text-2xl font-bold" style={{ color }}>
              {value.display}
            </span>
          </div>
          <div
            className="mt-2 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs"
            style={{ borderColor: color, color }}
          >
            <Icon name={TYPE_ICON[value.type]} size={14} />
            <span className="font-semibold capitalize">{value.type}</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-muted">
        The box <span className="font-mono text-ink">{name}</span> holds{' '}
        <span className="font-mono" style={{ color }}>{value.display}</span> — a{' '}
        <span className="font-semibold" style={{ color }}>{value.type}</span>. Pick another assignment and the
        same box takes on a new value; choose a different kind of value and its <span className="text-ink">type</span> changes too.
      </p>
    </div>
  )
}
