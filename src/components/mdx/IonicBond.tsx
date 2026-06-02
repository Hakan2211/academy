import { useState } from 'react'

// Ionic bonding: a metal hands an electron to a non-metal. Both become ions
// with full shells, and their opposite charges lock them together — repeated
// endlessly into a crystal lattice. Step through sodium + chlorine → salt.
const STEPS = [
  'Two neutral atoms: sodium has 1 lonely outer electron; chlorine needs just 1 more.',
  'Sodium transfers its electron to chlorine. Now Na⁺ and Cl⁻ — both with full shells.',
  'The opposite charges attract, snapping together. Repeated billions of times, this builds a crystal lattice.',
]

export function IonicBond() {
  const [step, setStep] = useState(0)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 320 170" className="w-full">
        {step < 2 ? (
          <>
            {/* sodium */}
            <circle cx={90} cy={85} r={40} fill="none" stroke="var(--color-border)" strokeWidth={1} />
            <circle cx={90} cy={85} r={16} fill={step === 1 ? '#FF6B6B' : '#FFA94D'} />
            <text x={90} y={89} textAnchor="middle" className="fill-white text-[11px] font-bold">
              {step === 1 ? 'Na⁺' : 'Na'}
            </text>
            {step === 0 && <circle cx={90} cy={45} r={5} fill="#F1C40F" stroke="#B7950B" />}

            {/* the travelling electron */}
            {step === 0 ? null : null}

            {/* chlorine */}
            <circle cx={230} cy={85} r={40} fill="none" stroke="var(--color-border)" strokeWidth={1} />
            <circle cx={230} cy={85} r={16} fill={step === 1 ? '#748FFC' : '#4DABF7'} />
            <text x={230} y={89} textAnchor="middle" className="fill-white text-[11px] font-bold">
              {step === 1 ? 'Cl⁻' : 'Cl'}
            </text>
            {/* chlorine's 7 (or 8) outer electrons */}
            {Array.from({ length: step === 1 ? 8 : 7 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2 - Math.PI / 2
              return <circle key={i} cx={230 + 40 * Math.cos(a)} cy={85 + 40 * Math.sin(a)} r={4.5} fill="#F1C40F" stroke="#B7950B" />
            })}
            {step === 1 && (
              <text x={160} y={150} textAnchor="middle" className="fill-muted text-[10px]">electron transferred →</text>
            )}
          </>
        ) : (
          // lattice
          <g>
            {Array.from({ length: 3 }).map((_, r) =>
              Array.from({ length: 5 }).map((_, c) => {
                const pos = (r + c) % 2 === 0
                return (
                  <g key={`${r}-${c}`}>
                    <circle cx={60 + c * 50} cy={45 + r * 40} r={pos ? 12 : 17} fill={pos ? '#FF6B6B' : '#4DABF7'} />
                    <text x={60 + c * 50} y={49 + r * 40} textAnchor="middle" className="fill-white text-[9px] font-bold">
                      {pos ? 'Na⁺' : 'Cl⁻'}
                    </text>
                  </g>
                )
              }),
            )}
          </g>
        )}
      </svg>

      <p className="my-2 min-h-[3rem] text-center text-sm text-muted">{STEPS[step]}</p>

      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-full border border-border px-4 py-1 text-sm text-muted disabled:opacity-40 hover:text-ink"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(2, s + 1))}
          disabled={step === 2}
          className="rounded-full border border-accent bg-accent/10 px-4 py-1 text-sm font-semibold text-accent disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
