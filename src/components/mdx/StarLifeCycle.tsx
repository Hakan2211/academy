import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// colour & size of a main-sequence star from its mass (solar masses)
function starLook(m: number) {
  if (m < 0.6) return { color: '#e17055', r: 10, label: 'small red dwarf' }
  if (m < 1.4) return { color: '#fdcb6e', r: 16, label: 'Sun-like yellow star' }
  if (m < 6) return { color: '#f5f3ff', r: 22, label: 'hot white star' }
  return { color: '#74b9ff', r: 28, label: 'massive blue giant' }
}

function fate(m: number) {
  if (m < 8) {
    return {
      old: 'Red Giant',
      death: 'Planetary Nebula',
      remnant: 'White Dwarf',
      rColor: '#dfe6e9',
      note: 'A low-mass star like the Sun gently puffs off its outer layers and leaves a slowly cooling white dwarf.',
    }
  }
  if (m < 20) {
    return {
      old: 'Red Supergiant',
      death: 'Supernova',
      remnant: 'Neutron Star',
      rColor: '#a29bfe',
      note: 'A heavy star burns out fast, explodes as a supernova, and crushes its core into an ultra-dense neutron star.',
    }
  }
  return {
    old: 'Red Supergiant',
    death: 'Supernova',
    remnant: 'Black Hole',
    rColor: '#0b0b16',
    note: 'The most massive stars collapse so hard after their supernova that nothing â€” not even light â€” can escape: a black hole.',
  }
}

// A star's entire life and death are decided at birth by one number: its mass.
// Lightweights like the Sun live long and fade to a white dwarf; heavyweights
// burn bright and brief, then explode and leave a neutron star or black hole.
// (The core fuses hydrogen the whole time â€” the same fusion from the atoms unit.)
export function StarLifeCycle() {
  const [mass, setMass] = useState(1)
  const look = starLook(mass)
  const f = fate(mass)
  const stages = [
    { title: 'Nebula', sub: 'cloud collapses', node: <circle cx="0" cy="0" r="14" fill="#4F8CFF" opacity="0.4" /> },
    { title: 'Main Sequence', sub: look.label, node: <circle cx="0" cy="0" r={Math.min(15, look.r * 0.6)} fill={look.color} /> },
    { title: f.old, sub: 'swells & cools', node: <circle cx="0" cy="0" r="15" fill="#e17055" opacity="0.85" /> },
    { title: f.remnant, sub: f.death, node: <circle cx="0" cy="0" r={f.remnant === 'White Dwarf' ? 5 : f.remnant === 'Neutron Star' ? 4 : 7} fill={f.rColor} stroke={f.rColor === '#0b0b16' ? '#fdcb6e' : 'none'} strokeWidth="1" /> },
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      {/* the star itself, sized & coloured by mass */}
      <div className="flex items-center justify-center pt-4">
        <svg viewBox="0 0 120 70" className="h-[70px]">
          <circle cx="60" cy="35" r={look.r} fill={look.color} />
          <circle cx="60" cy="35" r={look.r} fill="none" stroke={look.color} strokeWidth="6" opacity="0.25" />
        </svg>
      </div>

      {/* life-cycle flow */}
      <svg viewBox="0 0 400 120" className="w-full">
        {stages.map((s, i) => {
          const x = 50 + i * 100
          return (
            <g key={i}>
              {i > 0 && <line x1={x - 100 + 26} y1="40" x2={x - 26} y2="40" stroke="var(--color-border)" strokeWidth="1.5" markerEnd="url(#ar)" />}
              <g transform={`translate(${x},40)`}>{s.node}</g>
              <text x={x} y="78" fill="var(--color-ink)" fontSize="10" fontWeight="600" textAnchor="middle">{s.title}</text>
              <text x={x} y="92" fill="var(--color-muted)" fontSize="8" textAnchor="middle">{s.sub}</text>
            </g>
          )
        })}
        <defs>
          <marker id="ar" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--color-border)" />
          </marker>
        </defs>
      </svg>

      <div className="px-4 pt-1">
        <SceneSlider label="Star mass" value={mass} min={0.3} max={30} step={0.1} unit="â˜‰" onChange={setMass} />
        <p className="mt-2 pb-4 text-center text-xs text-muted">{f.note}</p>
      </div>
    </div>
  )
}
