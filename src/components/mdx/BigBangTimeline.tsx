import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const LOG0 = -43 // log10(seconds) at the Planck era
const LOG1 = 17.64 // log10(seconds) at 13.8 billion years
const SPAN = LOG1 - LOG0

type Era = { s: number; name: string; temp: string; color: string; desc: string }
const ERAS: Array<Era> = [
  { s: -43, name: 'Inflation', temp: '~10²⁷ K', color: '#ffffff', desc: 'In a sliver of a second, space erupts — doubling in size over and over, faster than light.' },
  { s: -32, name: 'Quark–Gluon Plasma', temp: '~10¹⁵ K', color: '#fff3bf', desc: 'A searing soup of fundamental particles, far too hot for anything to hold together.' },
  { s: -6, name: 'Protons & Neutrons', temp: '~10¹² K', color: '#ffe08a', desc: 'As it cools, quarks bind into the first protons and neutrons.' },
  { s: 0, name: 'Nucleosynthesis', temp: '~10⁹ K', color: '#ffa94d', desc: 'Within minutes, protons and neutrons fuse into the first hydrogen and helium nuclei.' },
  { s: 3.08, name: 'Opaque Plasma', temp: '~10⁵ K', color: '#ff922b', desc: 'A glowing fog of nuclei and loose electrons — light scatters and can’t travel far.' },
  { s: 13.08, name: 'Atoms Form → the CMB', temp: '~3000 K', color: '#e8590c', desc: 'Electrons join nuclei into neutral atoms; the fog clears and light streams free — the cosmic microwave background we still detect today.' },
  { s: 14.6, name: 'The Dark Ages', temp: '~60 K', color: '#495057', desc: 'No stars yet — just cooling, dark clouds of hydrogen and helium.' },
  { s: 15.8, name: 'First Stars', temp: '~20 K', color: '#4263eb', desc: 'Gravity collapses clouds until fusion ignites — the first stars flood the cosmos with light.' },
  { s: 16.5, name: 'Galaxies Assemble', temp: '~15 K', color: '#3b5bdb', desc: 'Stars gather into the first galaxies, which merge and grow into grand spirals.' },
  { s: 17.45, name: 'The Solar System', temp: '~3 K', color: '#364fc7', desc: 'Around 9 billion years in, our Sun and Earth condense from stardust enriched by earlier stars.' },
  { s: 17.64, name: 'Today', temp: '2.7 K', color: '#1a1a2e', desc: '13.8 billion years on — galaxies, stars, planets, and the curious life looking back at it all.' },
]

function ftime(sec: number) {
  if (sec < 1) return `${sec.toExponential(0)} s after the Big Bang`
  if (sec < 60) return `${sec.toPrecision(2)} s after the Big Bang`
  if (sec < 3600) return `${(sec / 60).toPrecision(2)} min after the Big Bang`
  const yr = sec / 3.156e7
  if (yr < 1) return `${(sec / 86400).toPrecision(2)} days after the Big Bang`
  if (yr < 1e6) return `${yr.toPrecision(3)} years after the Big Bang`
  if (yr < 1e9) return `${(yr / 1e6).toPrecision(3)} million years after the Big Bang`
  return `${(yr / 1e9).toPrecision(3)} billion years after the Big Bang`
}

const xFor = (s: number) => 30 + ((s - LOG0) / SPAN) * 340

// Run the whole history of the universe in one slider. From the first unimaginably
// hot instant, through the forging of the first nuclei, the moment light broke free
// (the CMB), the first stars, and on to galaxies, our Sun, and today — 13.8 billion
// years of cooling and structure, all driven by the expansion you just explored.
export function BigBangTimeline() {
  const [t, setT] = useState(55)
  const logSec = LOG0 + (t / 100) * SPAN
  const seconds = Math.pow(10, logSec)
  let era = ERAS[0]
  for (const e of ERAS) if (e.s <= logSec) era = e

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 400 170" className="w-full">
        {/* current-era swatch */}
        <circle cx="200" cy="64" r="46" fill={era.color} stroke="var(--color-border)" strokeWidth="1" />
        <circle cx="200" cy="64" r="46" fill="none" stroke={era.color} strokeWidth="10" opacity="0.2" />
        <text x="200" y="134" fill="var(--color-ink)" fontSize="15" fontWeight="700" textAnchor="middle">{era.name}</text>

        {/* timeline bar */}
        <line x1="30" y1="152" x2="370" y2="152" stroke="var(--color-border)" strokeWidth="2" />
        {ERAS.map((e) => (
          <line key={e.s} x1={xFor(e.s)} y1="148" x2={xFor(e.s)} y2="156" stroke="var(--color-border)" strokeWidth="1" />
        ))}
        <text x="30" y="167" fill="var(--color-muted)" fontSize="8">Big Bang</text>
        <text x="370" y="167" fill="var(--color-muted)" fontSize="8" textAnchor="end">now</text>
        {/* marker */}
        <path d={`M ${xFor(logSec)} 146 l -5 -8 l 10 0 z`} fill="var(--color-accent)" />
        <line x1={xFor(logSec)} y1="152" x2={xFor(logSec)} y2="158" stroke="var(--color-accent)" strokeWidth="2" />
      </svg>

      <div className="px-4 pt-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted">{ftime(seconds)}</span>
          <span className="font-mono text-ink">{era.temp}</span>
        </div>
        <div className="mb-2 mt-1 min-h-[2.5rem] text-center text-sm text-muted">{era.desc}</div>
        <SceneSlider label="Drag through cosmic history" value={t} min={0} max={100} step={1} unit="" onChange={setT} />
        <p className="mt-2 pb-4 text-center text-xs text-muted">
          The scale is logarithmic — the first slice covers a fraction of a second, the last covers billions of years.
        </p>
      </div>
    </div>
  )
}
