import { useState } from 'react'
import { cn } from '#/lib/cn'
import { Icon } from '#/components/ui/Icon'

// Match each disease to its primary transmission route, then see how to break
// the chain of infection. Owner: disease-and-prevention (W11).

type RouteId = 'airborne' | 'droplet' | 'contact' | 'fecaloral' | 'vector' | 'bloodborne'

const ROUTES: Record<RouteId, { label: string; break: string; color: string; icon: string }> = {
  airborne:   { label: 'Airborne',      break: 'Ventilation, masks, HEPA filtration',        color: '#74b9ff', icon: 'Wind'      },
  droplet:    { label: 'Droplet',       break: 'Distance (>1 m), masks, covering coughs',    color: '#a29bfe', icon: 'Droplets'  },
  contact:    { label: 'Contact',       break: 'Hand-washing, not touching face, gloves',    color: '#fd79a8', icon: 'Hand'      },
  fecaloral:  { label: 'Fecal-oral',    break: 'Clean water, sanitation, hand hygiene',      color: '#55efc4', icon: 'Waves'     },
  vector:     { label: 'Vector',        break: 'Insect repellent, nets, mosquito control',   color: '#fdcb6e', icon: 'Bug'       },
  bloodborne: { label: 'Bloodborne',    break: 'Sterile needles, blood screening, PPE',      color: '#e17055', icon: 'Syringe'   },
}

type Disease = { id: string; name: string; route: RouteId }

const DISEASES: Disease[] = [
  { id: 'flu',     name: 'Influenza (flu)',   route: 'airborne'   },
  { id: 'cold',    name: 'Common cold',       route: 'contact'    },
  { id: 'cholera', name: 'Cholera',           route: 'fecaloral'  },
  { id: 'malaria', name: 'Malaria',           route: 'vector'     },
  { id: 'hiv',     name: 'HIV/AIDS',          route: 'bloodborne' },
  { id: 'covid',   name: 'COVID-19',          route: 'airborne'   },
]

export function TransmissionRoutes() {
  const [selected, setSelected] = useState<string | null>(null)
  const [guesses, setGuesses] = useState<Record<string, RouteId>>({})
  const [revealed, setRevealed] = useState(false)

  const active = selected ? DISEASES.find((d) => d.id === selected) ?? null : null
  const allGuessed = DISEASES.every((d) => guesses[d.id])

  function pickRoute(route: RouteId) {
    if (!selected) return
    setGuesses((prev) => ({ ...prev, [selected]: route }))
    const next = DISEASES.find((d) => !guesses[d.id] && d.id !== selected)
    setSelected(next?.id ?? null)
  }

  function reset() {
    setGuesses({})
    setSelected(null)
    setRevealed(false)
  }

  const correct = DISEASES.filter((d) => guesses[d.id] === d.route).length

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4 space-y-4">
      <p className="text-sm text-muted">
        Select a disease, then click its main transmission route. When done, see how to break the chain.
      </p>

      {/* disease chips */}
      <div className="flex flex-wrap gap-2">
        {DISEASES.map((d) => {
          const g = guesses[d.id]
          const isCorrect = g === d.route
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => !g && setSelected(d.id)}
              disabled={!!g}
              className={cn(
                'rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors',
                selected === d.id
                  ? 'border-accent bg-accent/15 text-accent'
                  : g
                    ? isCorrect
                      ? 'border-success/50 bg-success/10 text-ink'
                      : 'border-warn/50 bg-warn/10 text-warn'
                    : 'border-border text-muted hover:text-ink',
              )}
            >
              {g && (isCorrect ? '✓ ' : '✗ ')}
              {d.name}
            </button>
          )
        })}
      </div>

      {/* route buttons */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {(Object.entries(ROUTES) as [RouteId, typeof ROUTES[RouteId]][]).map(([id, meta]) => (
          <button
            key={id}
            type="button"
            onClick={() => pickRoute(id)}
            disabled={!selected}
            className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 p-2 text-left text-xs transition-colors enabled:hover:border-accent disabled:opacity-50"
          >
            <Icon name={meta.icon} size={14} style={{ color: meta.color }} />
            <span className="font-medium" style={{ color: meta.color }}>{meta.label}</span>
          </button>
        ))}
      </div>

      {/* score + reveal */}
      {allGuessed && (
        <div className="rounded-xl border border-border bg-surface-2 p-3 space-y-2">
          <p className="text-sm font-semibold text-accent">
            {correct} / {DISEASES.length} correct
          </p>
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="text-xs text-muted hover:text-ink underline"
          >
            {revealed ? 'Hide' : 'Show'} how to break each chain
          </button>
          {revealed && (
            <ul className="mt-1 space-y-1.5">
              {DISEASES.map((d) => {
                const meta = ROUTES[d.route]
                return (
                  <li key={d.id} className="text-xs">
                    <span className="font-medium text-ink">{d.name}</span>
                    <span className="text-muted"> → {meta.label}: </span>
                    <span className="text-muted italic">{meta.break}</span>
                  </li>
                )
              })}
            </ul>
          )}
          <button
            type="button"
            onClick={reset}
            className="mt-1 rounded-lg border border-border px-3 py-1 text-xs text-muted hover:text-ink"
          >
            Try again
          </button>
        </div>
      )}

      {!selected && !allGuessed && (
        <p className="text-xs text-muted">Click a disease above to begin.</p>
      )}
      {selected && (
        <p className="text-xs text-accent">
          Assigning: <strong>{active?.name}</strong> — click its route above.
        </p>
      )}
    </div>
  )
}
