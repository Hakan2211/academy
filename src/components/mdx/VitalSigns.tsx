import { useState } from 'react'
import { cn } from '#/lib/cn'

// An interactive explorer of the four main adult resting vital signs.
// Click a vital to see its normal range, what it measures, and what deviations
// might signal — kept clearly general and non-alarming.

type Vital = {
  id: string
  name: string
  abbr: string
  normal: string
  unit: string
  icon: string
  color: string
  what: string
  highNote: string
  lowNote: string
}

const VITALS: Array<Vital> = [
  {
    id: 'hr',
    name: 'Heart Rate',
    abbr: 'HR',
    normal: '60–100',
    unit: 'bpm',
    icon: '♥',
    color: '#E74C3C',
    what: 'The number of times the heart beats per minute. Each beat pushes a fresh surge of blood around the body.',
    highNote: 'Above 100 bpm at rest (tachycardia) can occur with dehydration, fever, stress, caffeine, or be a sign to check in with a doctor if persistent.',
    lowNote: 'Below 60 bpm at rest (bradycardia) is normal in fit athletes. It can also reflect excellent cardiovascular efficiency — but very low rates with symptoms need medical review.',
  },
  {
    id: 'bp',
    name: 'Blood Pressure',
    abbr: 'BP',
    normal: '~120/80',
    unit: 'mmHg',
    icon: '⬆',
    color: '#9B59B6',
    what: 'Two numbers: systolic (the push as the heart beats) over diastolic (the pressure when the heart rests between beats). Measured in millimetres of mercury (mmHg).',
    highNote: 'Persistently above ~130/80 mmHg is hypertension — it strains arteries and the heart over time, raising the risk of heart attack and stroke. Often has no symptoms — hence "the silent killer."',
    lowNote: 'Below ~90/60 mmHg is hypotension. Mild cases cause dizziness on standing up. It can be normal in some people but significant drops warrant investigation.',
  },
  {
    id: 'temp',
    name: 'Body Temperature',
    abbr: 'Temp',
    normal: '36.1–37.2',
    unit: '°C',
    icon: '🌡',
    color: '#E67E22',
    what: 'Core body temperature reflects the balance between heat produced by metabolism and heat lost to the environment. The hypothalamus defends a set point near 37 °C.',
    highNote: 'Above 38 °C is a fever — usually the immune system ramping up to fight infection. Moderate fever is often helpful, but very high fever (>40 °C) needs urgent attention.',
    lowNote: 'Below 35 °C is hypothermia — the body has lost more heat than it can generate. Even mild hypothermia impairs judgment and coordination.',
  },
  {
    id: 'rr',
    name: 'Respiratory Rate',
    abbr: 'RR',
    normal: '12–20',
    unit: 'breaths/min',
    icon: '💨',
    color: '#3498DB',
    what: 'How many times per minute you breathe in. Each breath draws oxygen into the alveoli and flushes out carbon dioxide. Breathing rate is controlled by the brain stem, responding to CO₂ levels.',
    highNote: 'Above 20 breaths/min at rest (tachypnea) can indicate anxiety, infection, pain, or a lung/heart issue if it persists.',
    lowNote: 'Below 12 breaths/min (bradypnea) may occur with certain medications (especially opioids), neurological conditions, or deep sleep.',
  },
]

export function VitalSigns() {
  const [activeId, setActiveId] = useState<string>('hr')
  const vital = VITALS.find((v) => v.id === activeId) ?? VITALS[0]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Vital selector */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {VITALS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setActiveId(v.id)}
            className={cn(
              'flex flex-col items-center rounded-xl border px-2 py-2 text-xs transition-colors',
              activeId === v.id
                ? 'border-accent bg-accent/15 font-semibold text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
            style={
              activeId === v.id
                ? { borderColor: v.color, color: v.color, backgroundColor: v.color + '18' }
                : {}
            }
          >
            <span className="text-lg">{v.icon}</span>
            <span className="mt-0.5">{v.abbr}</span>
          </button>
        ))}
      </div>

      {/* Info panel */}
      <div
        className="rounded-xl border p-4 transition-colors"
        style={{ borderColor: vital.color + '55', backgroundColor: vital.color + '0d' }}
      >
        {/* Name + range */}
        <div className="flex items-baseline justify-between">
          <p className="font-semibold" style={{ color: vital.color }}>
            {vital.name}
          </p>
          <p className="rounded-lg px-2 py-0.5 text-sm font-bold" style={{ color: vital.color, backgroundColor: vital.color + '22' }}>
            {vital.normal} <span className="text-xs font-normal opacity-80">{vital.unit}</span>
          </p>
        </div>
        <p className="mt-2 text-xs text-ink">{vital.what}</p>

        {/* High / low notes */}
        <div className="mt-3 space-y-2">
          <div className="rounded-lg border border-[#E74C3C33] bg-[#E74C3C08] px-3 py-2 text-xs text-muted">
            <span className="font-medium text-[#E74C3C]">↑ Too high: </span>
            {vital.highNote}
          </div>
          <div className="rounded-lg border border-[#3498DB33] bg-[#3498DB08] px-3 py-2 text-xs text-muted">
            <span className="font-medium text-[#3498DB]">↓ Too low: </span>
            {vital.lowNote}
          </div>
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-muted">
        These are typical adult resting values — individual variation is normal. Always consult a healthcare professional for personal health concerns.
      </p>
    </div>
  )
}
