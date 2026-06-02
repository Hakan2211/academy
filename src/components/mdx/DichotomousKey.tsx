import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'

// A dichotomous key: identify a mystery creature by answering a chain of
// yes/no questions. Each answer splits the possibilities in two until only one
// is left — exactly how biologists name an unknown specimen.
type QNode = { kind: 'q'; q: string; yes: string; no: string }
type RNode = { kind: 'r'; result: string; emoji: string; note: string }
type Node = QNode | RNode

const KEY: Record<string, Node> = {
  start: { kind: 'q', q: 'Does it have a backbone?', yes: 'vert', no: 'invert' },
  vert: { kind: 'q', q: 'Does it have feathers?', yes: 'bird', no: 'vert2' },
  vert2: { kind: 'q', q: 'Does it breathe through gills?', yes: 'fish', no: 'vert3' },
  vert3: { kind: 'q', q: 'Does it have fur or hair?', yes: 'mammal', no: 'reptile' },
  invert: { kind: 'q', q: 'Does it have jointed legs?', yes: 'invert2', no: 'mollusc' },
  invert2: { kind: 'q', q: 'Does it have exactly six legs?', yes: 'insect', no: 'arachnid' },
  bird: { kind: 'r', result: 'Bird', emoji: '🦅', note: 'Vertebrate with feathers and a beak.' },
  fish: { kind: 'r', result: 'Fish', emoji: '🐟', note: 'Vertebrate that breathes through gills.' },
  mammal: { kind: 'r', result: 'Mammal', emoji: '🦊', note: 'Vertebrate with fur that feeds its young milk.' },
  reptile: { kind: 'r', result: 'Reptile or amphibian', emoji: '🦎', note: 'Vertebrate, no fur or feathers, often scaly or moist skin.' },
  insect: { kind: 'r', result: 'Insect', emoji: '🐝', note: 'Six-legged invertebrate with a jointed exoskeleton.' },
  arachnid: { kind: 'r', result: 'Arachnid', emoji: '🕷️', note: 'Eight-legged invertebrate — spiders and their kin.' },
  mollusc: { kind: 'r', result: 'Mollusc or worm', emoji: '🐌', note: 'Soft-bodied invertebrate with no jointed legs.' },
}

export function DichotomousKey() {
  const [id, setId] = useState('start')
  const [history, setHistory] = useState<Array<string>>([])
  const node = KEY[id]

  const go = (next: string) => {
    setHistory((h) => [...h, id])
    setId(next)
  }
  const back = () => {
    setHistory((h) => {
      if (!h.length) return h
      setId(h[h.length - 1])
      return h.slice(0, -1)
    })
  }
  const reset = () => {
    setId('start')
    setHistory([])
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-5">
      <div className="mb-3 flex items-center justify-between text-xs text-muted">
        <span>Step {history.length + 1}</span>
        {history.length > 0 && (
          <button type="button" onClick={back} className="flex items-center gap-1 hover:text-ink">
            <Icon name="Undo2" size={13} /> Back
          </button>
        )}
      </div>

      {node.kind === 'q' ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <p className="text-lg font-semibold text-ink">{node.q}</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => go(node.yes)}
              className="rounded-full border border-accent-2 bg-accent-2/15 px-6 py-2 font-semibold text-accent-2 transition-colors hover:bg-accent-2/25"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => go(node.no)}
              className="rounded-full border border-border px-6 py-2 font-semibold text-muted transition-colors hover:text-ink"
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <div className="text-5xl">{node.emoji}</div>
          <p className="text-xs uppercase tracking-wide text-accent-2">Identified</p>
          <p className="text-xl font-bold text-ink">{node.result}</p>
          <p className="max-w-xs text-sm text-muted">{node.note}</p>
          <button
            type="button"
            onClick={reset}
            className="mt-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  )
}
