import { useState } from 'react'
import { cn } from '#/lib/cn'

type Cls = 'quark' | 'lepton' | 'gauge' | 'scalar'
type P = { id: string; sym: string; name: string; cls: Cls; col: number; row: number; mass: string; charge: string; role: string }

const CLR: Record<Cls, string> = { quark: '#4F8CFF', lepton: '#00cec9', gauge: '#e17055', scalar: '#fdcb6e' }

const PARTS: Array<P> = [
  { id: 'u', sym: 'u', name: 'up', cls: 'quark', col: 1, row: 1, mass: '2.2 MeV', charge: '+â…”', role: 'A quark â€” building block of protons & neutrons. Feels the strong force.' },
  { id: 'c', sym: 'c', name: 'charm', cls: 'quark', col: 2, row: 1, mass: '1.27 GeV', charge: '+â…”', role: 'A heavier copy of the up quark, from the second generation.' },
  { id: 't', sym: 't', name: 'top', cls: 'quark', col: 3, row: 1, mass: '173 GeV', charge: '+â…”', role: 'The heaviest particle known â€” as heavy as a whole gold atom.' },
  { id: 'd', sym: 'd', name: 'down', cls: 'quark', col: 1, row: 2, mass: '4.7 MeV', charge: 'âˆ’â…“', role: 'A quark. Two downs + one up make a neutron.' },
  { id: 's', sym: 's', name: 'strange', cls: 'quark', col: 2, row: 2, mass: '95 MeV', charge: 'âˆ’â…“', role: 'Second-generation down-type quark.' },
  { id: 'b', sym: 'b', name: 'bottom', cls: 'quark', col: 3, row: 2, mass: '4.18 GeV', charge: 'âˆ’â…“', role: 'Third-generation down-type quark.' },
  { id: 'e', sym: 'e', name: 'electron', cls: 'lepton', col: 1, row: 3, mass: '0.511 MeV', charge: 'âˆ’1', role: 'The lepton that orbits atoms and carries electric current. No strong force.' },
  { id: 'mu', sym: 'Î¼', name: 'muon', cls: 'lepton', col: 2, row: 3, mass: '105.7 MeV', charge: 'âˆ’1', role: 'A heavy, short-lived cousin of the electron.' },
  { id: 'tau', sym: 'Ï„', name: 'tau', cls: 'lepton', col: 3, row: 3, mass: '1.777 GeV', charge: 'âˆ’1', role: 'The heaviest charged lepton.' },
  { id: 've', sym: 'Î½e', name: 'e-neutrino', cls: 'lepton', col: 1, row: 4, mass: '~0', charge: '0', role: 'A near-massless ghost â€” only the weak force touches it. Trillions pass through you each second.' },
  { id: 'vm', sym: 'Î½Î¼', name: 'Î¼-neutrino', cls: 'lepton', col: 2, row: 4, mass: '~0', charge: '0', role: 'The muonâ€™s neutrino partner.' },
  { id: 'vt', sym: 'Î½Ï„', name: 'Ï„-neutrino', cls: 'lepton', col: 3, row: 4, mass: '~0', charge: '0', role: 'The tauâ€™s neutrino partner.' },
  { id: 'g', sym: 'g', name: 'gluon', cls: 'gauge', col: 4, row: 1, mass: '0', charge: '0', role: 'Carrier of the strong force â€” glues quarks into protons & neutrons.' },
  { id: 'ph', sym: 'Î³', name: 'photon', cls: 'gauge', col: 4, row: 2, mass: '0', charge: '0', role: 'Carrier of electromagnetism â€” the particle of light itself.' },
  { id: 'z', sym: 'Z', name: 'Z boson', cls: 'gauge', col: 4, row: 3, mass: '91.2 GeV', charge: '0', role: 'Carrier of the weak force, behind some radioactive decays.' },
  { id: 'w', sym: 'W', name: 'W boson', cls: 'gauge', col: 4, row: 4, mass: '80.4 GeV', charge: 'Â±1', role: 'Carrier of the weak force â€” turns one quark flavour into another in beta decay.' },
  { id: 'h', sym: 'H', name: 'Higgs', cls: 'scalar', col: 5, row: 2, mass: '125 GeV', charge: '0', role: 'A ripple in the Higgs field â€” the field that gives the other particles their mass. Found in 2012.' },
]

const FILTERS: Array<{ key: Cls | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'quark', label: 'Quarks' },
  { key: 'lepton', label: 'Leptons' },
  { key: 'gauge', label: 'Force carriers' },
]

// Everything â€” every atom, every star, you â€” is built from this short list. Twelve matter
// particles (quarks and leptons), the force-carriers that bind them, and the Higgs that
// gives them mass. Tap any tile; filter by family to see the structure.
export function StandardModel() {
  const [sel, setSel] = useState('u')
  const [filter, setFilter] = useState<Cls | 'all'>('all')
  const p = PARTS.find((x) => x.id === sel) ?? PARTS[0]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              filter === f.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-1.5 px-3" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {PARTS.map((part) => {
          const dim = filter !== 'all' && part.cls !== filter
          const on = sel === part.id
          return (
            <button
              key={part.id}
              type="button"
              onClick={() => setSel(part.id)}
              style={{ gridColumn: part.col, gridRow: part.row, borderColor: CLR[part.cls], background: on ? CLR[part.cls] + '33' : CLR[part.cls] + '12' }}
              className={cn(
                'flex flex-col items-center rounded-lg border-2 py-1.5 transition-opacity',
                dim ? 'opacity-25' : 'opacity-100',
                on && 'ring-2 ring-white/40',
              )}
            >
              <span className="text-lg font-bold leading-none" style={{ color: CLR[part.cls] }}>{part.sym}</span>
              <span className="mt-0.5 text-[9px] leading-tight text-muted">{part.name}</span>
            </button>
          )
        })}
      </div>

      <div className="m-3 rounded-xl border p-3" style={{ borderColor: CLR[p.cls] + '66', background: CLR[p.cls] + '12' }}>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold" style={{ color: CLR[p.cls] }}>{p.sym}</span>
          <span className="font-semibold capitalize text-ink">{p.name}</span>
          <span className="ml-auto font-mono text-xs text-muted">mass {p.mass} Â· charge {p.charge}</span>
        </div>
        <p className="mt-1 text-sm text-muted">{p.role}</p>
      </div>
    </div>
  )
}
