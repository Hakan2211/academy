import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

type Prefix = { exp: number; name: string; sym: string; example: string }

// The engineering ladder — each rung a factor of one thousand. Examples are lengths.
const RUNGS: Array<Prefix> = [
  { exp: -12, name: 'pico', sym: 'p', example: 'an atom is a few hundred pm across' },
  { exp: -9, name: 'nano', sym: 'n', example: 'a DNA strand is ~2 nm wide' },
  { exp: -6, name: 'micro', sym: 'µ', example: 'a bacterium is ~1 µm long' },
  { exp: -3, name: 'milli', sym: 'm', example: 'a grain of sand is ~1 mm' },
  { exp: 0, name: '(base unit)', sym: '', example: 'a long stride is about 1 m' },
  { exp: 3, name: 'kilo', sym: 'k', example: 'a 15-minute walk is ~1 km' },
  { exp: 6, name: 'mega', sym: 'M', example: 'the Moon is ~3.5 Mm across' },
  { exp: 9, name: 'giga', sym: 'G', example: 'the Sun is ~1.4 Gm across' },
  { exp: 12, name: 'tera', sym: 'T', example: 'Saturn orbits ~1.4 Tm from the Sun' },
]

const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }
function sup(n: number) {
  return String(n).split('').map((c) => SUP[c] ?? c).join('')
}
function factorStr(exp: number) {
  if (exp === 0) return '1'
  if (exp > 0) return '1' + '0'.repeat(exp >= 6 ? 0 : exp) // fall through to scientific for big ones
  return ''
}

const W = 400
const PAD = 26

// A prefix is just shorthand for a power of ten. Slide along the ladder: each rung
// multiplies (or divides) the base unit by a thousand, so the same physical quantity
// can be written without a trailing parade of zeros.
export function PrefixLadder() {
  const [exp, setExp] = useState(3)
  const idx = RUNGS.findIndex((r) => r.exp === exp)
  const r = RUNGS[idx] ?? RUNGS[4]
  const minE = RUNGS[0].exp
  const maxE = RUNGS[RUNGS.length - 1].exp
  const xFor = (e: number) => PAD + ((e - minE) / (maxE - minE)) * (W - 2 * PAD)
  const markerX = xFor(exp)

  const plain = factorStr(exp)
  const value = exp === 0 ? '1' : plain !== '' ? `1 followed by ${exp} zeros` : `10${sup(exp)}`

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 400 110" className="w-full">
        {/* axis */}
        <line x1={PAD} y1="64" x2={W - PAD} y2="64" stroke="var(--color-border)" strokeWidth="2" />
        {RUNGS.map((rung) => {
          const x = xFor(rung.exp)
          const on = rung.exp === exp
          return (
            <g key={rung.exp}>
              <line x1={x} y1="58" x2={x} y2="70" stroke={on ? 'var(--color-accent)' : 'var(--color-border)'} strokeWidth={on ? 3 : 1.5} />
              <text x={x} y="86" textAnchor="middle" fontSize="10" fontWeight={on ? 700 : 400} fill={on ? 'var(--color-accent)' : 'var(--color-muted)'}>
                {rung.sym || '—'}
              </text>
              <text x={x} y="100" textAnchor="middle" fontSize="8" fill="var(--color-muted)" opacity="0.7">
                10{sup(rung.exp)}
              </text>
            </g>
          )
        })}
        {/* marker */}
        <polygon points={`${markerX},44 ${markerX - 6},32 ${markerX + 6},32`} fill="var(--color-accent)" />
        <circle cx={markerX} cy="64" r="5" fill="var(--color-accent)" />
        <text x={markerX} y="22" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-ink)" className="capitalize">
          {r.name}
        </text>
      </svg>

      <div className="px-4 pt-1">
        <SceneSlider label="Prefix" value={exp} min={minE} max={maxE} step={3} unit="" onChange={(v) => setExp(v)} />
        <p className="mt-2 pb-4 text-center text-sm text-muted">
          <span className="font-semibold text-ink capitalize">{r.name}{r.sym ? ` (${r.sym})` : ''}</span> means × {value} — {r.example}.
        </p>
      </div>
    </div>
  )
}
