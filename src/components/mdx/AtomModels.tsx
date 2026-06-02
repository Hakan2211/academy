import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// Our picture of the atom was rebuilt four times in a century. Each model kept
// what worked and fixed what new experiments revealed. Step through the history.
type Model = 'dalton' | 'thomson' | 'rutherford' | 'bohr'

const MODELS: Array<{ key: Model; name: string; year: string }> = [
  { key: 'dalton', name: 'Dalton', year: '1803' },
  { key: 'thomson', name: 'Thomson', year: '1897' },
  { key: 'rutherford', name: 'Rutherford', year: '1911' },
  { key: 'bohr', name: 'Bohr', year: '1913' },
]

const INFO: Record<Model, { title: string; text: string }> = {
  dalton: {
    title: 'The solid sphere',
    text: 'Dalton revived the atom as a tiny, solid, indivisible ball — the smallest piece of an element. It explained why elements combine in fixed ratios, but had no internal parts.',
  },
  thomson: {
    title: 'The plum pudding',
    text: 'Thomson discovered the electron — so the atom must contain negative bits. He pictured them studded through a ball of positive charge, like plums in a pudding.',
  },
  rutherford: {
    title: 'The nuclear atom',
    text: 'Firing particles at gold foil, Rutherford found most flew straight through but a few bounced back. The atom is mostly empty space with a tiny, dense, positive nucleus at its centre.',
  },
  bohr: {
    title: 'Electron shells',
    text: 'Bohr fixed the electrons into specific orbits, or shells, at set energy levels. Electrons jump between shells by absorbing or releasing exact packets of energy — explaining atomic spectra.',
  },
}

export function AtomModels() {
  const [model, setModel] = useState<Model>('dalton')
  const eRef = useRef<SVGGElement | null>(null)

  useEffect(() => {
    if (model !== 'rutherford' && model !== 'bohr') return
    let raf = 0
    let a = 0
    const loop = () => {
      a += 0.02
      eRef.current?.setAttribute('transform', `rotate(${((a * 57.3) % 360).toFixed(1)} 80 80)`)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [model])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {MODELS.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setModel(m.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              model === m.key
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {m.name} <span className="opacity-60">{m.year}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <svg viewBox="0 0 160 160" className="w-40 shrink-0">
          {model === 'dalton' && (
            <>
              <circle cx={80} cy={80} r={46} fill="#5DADE2" opacity={0.9} />
              <circle cx={80} cy={80} r={46} fill="none" stroke="#2C6FAD" strokeWidth={2} />
            </>
          )}

          {model === 'thomson' && (
            <>
              <circle cx={80} cy={80} r={48} fill="#E8A0BF" opacity={0.45} />
              {[
                [60, 60],
                [100, 64],
                [70, 98],
                [104, 100],
                [80, 78],
                [50, 86],
                [92, 86],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={5} fill="#2C3E50" />
              ))}
            </>
          )}

          {model === 'rutherford' && (
            <>
              <circle cx={80} cy={80} r={50} fill="none" stroke="var(--color-border)" strokeWidth={1} strokeDasharray="2 3" />
              <circle cx={80} cy={80} r={8} fill="#E74C3C" />
              <g ref={eRef}>
                <circle cx={80} cy={30} r={4} fill="#5DADE2" />
                <circle cx={130} cy={80} r={4} fill="#5DADE2" />
                <circle cx={80} cy={130} r={4} fill="#5DADE2" />
              </g>
            </>
          )}

          {model === 'bohr' && (
            <>
              <circle cx={80} cy={80} r={28} fill="none" stroke="var(--color-border)" strokeWidth={1.2} />
              <circle cx={80} cy={80} r={50} fill="none" stroke="var(--color-border)" strokeWidth={1.2} />
              <circle cx={80} cy={80} r={9} fill="#E74C3C" />
              <g ref={eRef}>
                <circle cx={80} cy={52} r={4} fill="#5DADE2" />
                <circle cx={80} cy={30} r={4} fill="#5DADE2" />
                <circle cx={130} cy={80} r={4} fill="#5DADE2" />
                <circle cx={30} cy={80} r={4} fill="#5DADE2" />
              </g>
            </>
          )}
        </svg>

        <div>
          <p className="font-semibold text-ink">{INFO[model].title}</p>
          <p className="mt-1 text-sm text-muted">{INFO[model].text}</p>
        </div>
      </div>
    </div>
  )
}
