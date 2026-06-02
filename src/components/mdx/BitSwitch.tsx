import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { SceneSlider } from '#/components/three/SceneSlider'
import { cn } from '#/lib/cn'

// A bit is the smallest unit of information: one switch with two states. On its
// own it says yes/no, 1/0, true/false. The power comes from combining them —
// N switches give 2^N different patterns. Toggle the switches and add more to
// feel how fast that grows.

export function BitSwitch() {
  const [n, setN] = useState(4)
  const [bits, setBits] = useState<Array<0 | 1>>(() => Array(8).fill(0))

  const toggle = (i: number) =>
    setBits((b) => b.map((v, j) => (j === i ? ((v ? 0 : 1) as 0 | 1) : v)))

  const active = bits.slice(0, n)
  const value = active.reduce<number>((acc, b, i) => acc + b * 2 ** (n - 1 - i), 0)
  const patterns = 2 ** n

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-end justify-center gap-2">
        {Array.from({ length: n }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className={cn(
              'flex h-16 w-12 flex-col items-center justify-center gap-1 rounded-lg border-2 transition-colors',
              active[i]
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border bg-surface-2 text-muted',
            )}
          >
            <Icon name={active[i] ? 'ToggleRight' : 'ToggleLeft'} size={22} />
            <span className="font-mono text-lg font-bold">{active[i]}</span>
          </button>
        ))}
      </div>

      <div className="mx-auto mt-4 max-w-xs">
        <SceneSlider label="Number of bits" value={n} min={1} max={8} step={1} unit="bits" onChange={(v) => setN(v)} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl border border-border bg-surface-2 p-3">
          <div className="text-xs text-muted">This pattern means</div>
          <div className="font-mono text-2xl font-bold text-ink">{value}</div>
          <div className="font-mono text-xs text-muted">{active.join('')}</div>
        </div>
        <div className="rounded-xl border border-border bg-surface-2 p-3">
          <div className="text-xs text-muted">Possible patterns</div>
          <div className="font-mono text-2xl font-bold text-accent-2">{patterns.toLocaleString()}</div>
          <div className="font-mono text-xs text-muted">2^{n}</div>
        </div>
      </div>
    </div>
  )
}
