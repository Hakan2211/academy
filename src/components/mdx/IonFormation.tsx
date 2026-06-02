import { useState } from 'react'
import { cn } from '#/lib/cn'

// Atoms are most stable with a full outer shell (eight electrons — an octet).
// Metals reach it by GIVING electrons away (becoming positive cations);
// non-metals reach it by TAKING electrons (becoming negative anions).
type Ion = {
  sym: string
  name: string
  inner: number // electrons in inner shells (drawn as a count badge)
  valence: number // neutral valence electrons
  change: number // electrons gained(+) or lost(-) to form the ion
  noble: string
}

const IONS: Array<Ion> = [
  { sym: 'Na', name: 'Sodium', inner: 10, valence: 1, change: -1, noble: 'Neon' },
  { sym: 'Mg', name: 'Magnesium', inner: 10, valence: 2, change: -2, noble: 'Neon' },
  { sym: 'Al', name: 'Aluminium', inner: 10, valence: 3, change: -3, noble: 'Neon' },
  { sym: 'O', name: 'Oxygen', inner: 2, valence: 6, change: +2, noble: 'Neon' },
  { sym: 'F', name: 'Fluorine', inner: 2, valence: 7, change: +1, noble: 'Neon' },
  { sym: 'Cl', name: 'Chlorine', inner: 10, valence: 7, change: +1, noble: 'Argon' },
]

function OuterShell({ count, highlight }: { count: number; highlight: 'lost' | 'gained' | 'none' }) {
  return (
    <g>
      <circle cx={70} cy={70} r={46} fill="none" stroke="var(--color-border)" strokeWidth={1} />
      <circle cx={70} cy={70} r={18} fill="#E74C3C" />
      {Array.from({ length: count }).map((_, i) => {
        const ang = (i / Math.max(1, count)) * Math.PI * 2 - Math.PI / 2
        return (
          <circle
            key={i}
            cx={70 + 46 * Math.cos(ang)}
            cy={70 + 46 * Math.sin(ang)}
            r={5}
            fill={highlight === 'gained' && i >= count - 0 ? '#2ECC71' : '#5DADE2'}
          />
        )
      })}
    </g>
  )
}

export function IonFormation() {
  const [sym, setSym] = useState('Na')
  const [formed, setFormed] = useState(false)
  const ion = IONS.find((i) => i.sym === sym) ?? IONS[0]

  const isMetal = ion.change < 0
  const finalValence = isMetal ? 0 : 8 // metals empty the outer shell; non-metals fill it
  const shownValence = formed ? finalValence : ion.valence
  const charge = ion.change < 0 ? -ion.change : -ion.change // net charge = -change (lost e- → +)
  const chargeStr = charge > 0 ? `${charge}+` : `${-charge}-`

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {IONS.map((i) => (
          <button
            key={i.sym}
            type="button"
            onClick={() => {
              setSym(i.sym)
              setFormed(false)
            }}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              sym === i.sym
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {i.sym}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-around">
        <svg viewBox="0 0 140 140" className="w-36">
          <OuterShell count={shownValence} highlight={formed ? (isMetal ? 'lost' : 'gained') : 'none'} />
          <text x={70} y={74} textAnchor="middle" className="fill-white text-[12px] font-bold">{ion.sym}</text>
        </svg>

        <div className="text-center sm:text-left">
          <p className="text-sm text-muted">
            {ion.name} is a <span className="font-semibold text-ink">{isMetal ? 'metal' : 'non-metal'}</span> with{' '}
            <span className="font-semibold text-ink">{ion.valence}</span> valence electron{ion.valence === 1 ? '' : 's'}.
          </p>
          <p className="mt-1 text-sm text-muted">
            To reach a full outer shell it{' '}
            <span className="font-semibold text-ink">
              {isMetal ? `loses ${-ion.change}` : `gains ${ion.change}`}
            </span>{' '}
            electron{Math.abs(ion.change) === 1 ? '' : 's'}.
          </p>
          {formed && (
            <p className="mt-2 rounded-lg bg-surface-2 p-2 text-sm">
              → <span className="font-mono font-semibold text-accent">{ion.sym}<sup>{chargeStr}</sup></span>{' '}
              <span className="text-muted">
                ({isMetal ? 'cation' : 'anion'}, same configuration as {ion.noble})
              </span>
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setFormed((f) => !f)}
        className="mt-3 w-full rounded-lg border border-accent bg-accent/10 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
      >
        {formed ? 'Reset to neutral atom' : `Form the ion (${isMetal ? 'lose' : 'gain'} electrons)`}
      </button>
    </div>
  )
}
