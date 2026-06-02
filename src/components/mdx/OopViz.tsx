import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Object-oriented programming bundles DATA and BEHAVIOUR together. A CLASS is a
// blueprint — it lists the fields every object will have and the methods they
// can do. From one class you stamp out many OBJECTS (instances): each carries
// its OWN data but SHARES the class's methods. Create dogs, then make one bark.

type Dog = { name: string; breed: string; sound: string }

const BLUEPRINTS: Array<Dog> = [
  { name: 'Rex', breed: 'Husky', sound: 'Awooo!' },
  { name: 'Bella', breed: 'Poodle', sound: 'Yip!' },
  { name: 'Max', breed: 'Beagle', sound: 'Woof!' },
]

export function OopViz() {
  const [instances, setInstances] = useState<Array<Dog>>([])
  const [barking, setBarking] = useState<number | null>(null)
  const nextIdx = instances.length

  function createNext() {
    if (nextIdx >= BLUEPRINTS.length) return
    setInstances((xs) => [...xs, BLUEPRINTS[nextIdx]])
    setBarking(null)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_1.3fr]">
        {/* The class blueprint */}
        <div className="rounded-xl border-2 border-dashed border-accent-2 bg-surface-2 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wide text-accent-2">
            <Icon name="Blocks" size={14} /> Class (blueprint)
          </div>
          <div className="font-mono text-sm font-bold text-ink">class Dog</div>
          <div className="mt-2 text-[11px] uppercase text-muted">Fields (each object's own data)</div>
          <ul className="font-mono text-xs text-muted">
            <li>• name</li>
            <li>• breed</li>
          </ul>
          <div className="mt-2 text-[11px] uppercase text-muted">Method (shared behaviour)</div>
          <ul className="font-mono text-xs text-accent">
            <li>• bark()</li>
          </ul>
        </div>

        {/* The objects stamped from it */}
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wide text-accent">
            <Icon name="Copy" size={14} /> Objects (instances)
          </div>
          <div className="grid min-h-28 grid-cols-1 gap-2 sm:grid-cols-2">
            {instances.length === 0 && (
              <div className="col-span-full flex items-center justify-center rounded-lg border border-dashed border-border py-6 text-xs text-muted">
                No objects yet. Create one from the blueprint.
              </div>
            )}
            {instances.map((d, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-lg border bg-surface-2 p-2.5 transition-all',
                  barking === i ? 'border-accent bg-accent/15' : 'border-border',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-ink">{d.name}</span>
                  <Icon name="Dog" size={15} className="text-muted" />
                </div>
                <div className="font-mono text-[11px] text-muted">breed = {d.breed}</div>
                <button
                  type="button"
                  onClick={() => setBarking(i)}
                  className="mt-1.5 w-full rounded-md border border-accent/40 bg-accent/10 px-2 py-1 font-mono text-xs text-accent transition-colors hover:bg-accent/20"
                >
                  .bark()
                </button>
                <div className="mt-1 h-4 text-center font-mono text-xs text-success">
                  {barking === i ? d.sound : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        One blueprint, many objects. Each dog stores its <span className="text-ink">own</span> name and breed, yet they all
        share the single <span className="font-mono text-accent">bark()</span> method — data and behaviour, bundled together. That bundling is <span className="text-ink">encapsulation</span>.
      </p>

      <div className="mt-3 flex justify-center gap-2">
        <button
          type="button"
          onClick={createNext}
          disabled={nextIdx >= BLUEPRINTS.length}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm transition-colors',
            nextIdx >= BLUEPRINTS.length ? 'cursor-not-allowed border-border text-muted/50' : 'border-accent bg-accent/15 text-accent',
          )}
        >
          {nextIdx >= BLUEPRINTS.length ? 'All created' : `new Dog("${BLUEPRINTS[nextIdx].name}")`}
        </button>
        <button
          type="button"
          onClick={() => { setInstances([]); setBarking(null) }}
          className="rounded-full border border-border px-4 py-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
