import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A computer is a tower of abstractions. Each layer offers a simple interface
// and hides the messy complexity of the layer below. You can write an app
// without knowing how a transistor works — that is the whole point. Click any
// layer to see what it does and what it hides.

type Layer = { name: string; icon: string; color: string; what: string; hides: string }

// Top (what you touch) -> bottom (raw physics).
const LAYERS: Array<Layer> = [
  { name: 'Apps & websites', icon: 'AppWindow', color: '#FF6B6B', what: 'The buttons, games and pages you actually use.', hides: 'all the code that makes them work' },
  { name: 'Programs & languages', icon: 'Code2', color: '#FFC83D', what: 'Human-readable code (Python, JavaScript…) describing what to do.', hides: 'how the machine actually executes it' },
  { name: 'Operating system', icon: 'Layers', color: '#2ECC71', what: 'Shares the hardware between programs: files, memory, windows.', hides: 'the specific devices underneath' },
  { name: 'Machine instructions', icon: 'Binary', color: '#00CEC9', what: 'The tiny binary commands the CPU runs: ADD, LOAD, JUMP.', hides: 'the circuitry that performs them' },
  { name: 'Logic gates', icon: 'ToggleRight', color: '#4F8CFF', what: 'AND/OR/NOT switches that compute with 1s and 0s.', hides: 'the transistors wired to build them' },
  { name: 'Transistors', icon: 'Cpu', color: '#9B59B6', what: 'Billions of microscopic electronic switches on a chip.', hides: 'the physics of the silicon' },
  { name: 'Electrons & physics', icon: 'Atom', color: '#E84393', what: 'Voltage and current — electrons flowing through silicon.', hides: 'nothing — this is the bottom' },
]

export function AbstractionLayers() {
  const [sel, setSel] = useState(0)
  const l = LAYERS[sel]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-3 sm:grid-cols-[1.3fr_1fr]">
        <div className="space-y-1.5">
          {LAYERS.map((layer, i) => (
            <button
              key={layer.name}
              type="button"
              onClick={() => setSel(i)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg border-2 px-3 py-2 text-left transition-all',
                sel === i ? 'bg-surface-2' : 'border-transparent bg-surface-2/40 hover:bg-surface-2',
              )}
              style={{
                borderColor: sel === i ? layer.color : 'transparent',
                marginLeft: `${i * 8}px`,
              }}
            >
              <Icon name={layer.icon} size={16} style={{ color: layer.color }} />
              <span className={cn('text-sm', sel === i ? 'font-semibold text-ink' : 'text-muted')}>{layer.name}</span>
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-surface-2 p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: l.color, color: '#0a0f1f' }}>
              <Icon name={l.icon} size={16} />
            </span>
            <div className="font-semibold text-ink">{l.name}</div>
          </div>
          <p className="mt-2 text-sm text-ink/90">{l.what}</p>
          <p className="mt-2 text-xs text-muted">
            <span className="font-semibold" style={{ color: l.color }}>Hides:</span> {l.hides}
          </p>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Higher layers sit on lower ones. Each one lets you work without worrying about the details beneath it — that is <span className="text-ink">abstraction</span>.
      </p>
    </div>
  )
}
