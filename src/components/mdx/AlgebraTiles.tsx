import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'

// Algebra tiles. x² is a big square, x a tall bar, 1 a small square — different
// shapes for different terms. You can only stack tiles of the SAME shape, which
// is exactly why you collect like terms. Reused in letters-for-numbers,
// simplifying, and the deep-dive.
function term(count: number, sym: string): string | null {
  if (count === 0) return null
  const c = Math.abs(count) === 1 && sym ? '' : Math.abs(count)
  return `${count < 0 ? '−' : '+'} ${c}${sym}`
}

export function AlgebraTiles() {
  const [x2, setX2] = useState(1)
  const [x, setX] = useState(2)
  const [one, setOne] = useState(3)

  const parts = [term(x2, 'x²'), term(x, 'x'), term(one, '')].filter(Boolean) as Array<string>
  let expr = parts.join(' ').replace(/^\+\s*/, '')
  if (!expr) expr = '0'

  const Group = ({ label, count, set, cls, shape }: { label: string; count: number; set: (n: number) => void; cls: string; shape: string }) => (
    <div className="flex flex-col items-center gap-2">
      <div className="flex min-h-[52px] flex-wrap content-center items-center justify-center gap-1">
        {Array.from({ length: Math.min(Math.abs(count), 6) }, (_, i) => (
          <span key={i} className={`${shape} ${count < 0 ? 'opacity-40 ring-2 ring-red-400' : ''} ${cls}`} />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => set(count - 1)} className="text-muted hover:text-accent"><Icon name="MinusCircle" size={18} /></button>
        <span className="w-6 text-center font-mono text-sm text-ink">{count}{label}</span>
        <button onClick={() => set(count + 1)} className="text-muted hover:text-accent"><Icon name="PlusCircle" size={18} /></button>
      </div>
    </div>
  )

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex justify-around gap-2">
        <Group label="x²" count={x2} set={setX2} cls="bg-accent" shape="h-7 w-7 rounded-sm" />
        <Group label="x" count={x} set={setX} cls="bg-accent-2" shape="h-7 w-3 rounded-sm" />
        <Group label="" count={one} set={setOne} cls="bg-muted" shape="h-3 w-3 rounded-sm" />
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 py-3 text-center">
        <span className="font-mono text-2xl font-bold text-ink">{expr}</span>
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        Tiles of the same shape combine; different shapes can't. x² + x is already as simple as it gets — they're different terms.
      </p>
    </div>
  )
}
