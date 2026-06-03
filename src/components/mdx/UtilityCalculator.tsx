import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { cn } from '#/lib/cn'

// Hedonic-calculus tool. An action affects several people; the user adjusts
// how much pleasure/pain each person gets (-10..+10) and sees the net utility.
// A preset exposes the classic "sacrifice the few" objection.

type Person = { id: string; name: string; value: number }

type Scenario = {
  id: string
  label: string
  description: string
  people: Array<Person>
}

const SCENARIOS: Array<Scenario> = [
  {
    id: 'park',
    label: 'Build the park',
    description:
      'A city proposes turning an empty lot into a public park. A few residents lose parking; many gain green space.',
    people: [
      { id: 'a', name: 'Neighbourhood residents (50 people)', value: 7 },
      { id: 'b', name: 'Nearby drivers (10 people)', value: -4 },
      { id: 'c', name: 'Local shop owners (5 people)', value: 3 },
      { id: 'd', name: 'Property owners (3 people)', value: 5 },
    ],
  },
  {
    id: 'minority',
    label: 'Sacrifice the few',
    description:
      'Classic objection: an action brings enormous pleasure to many but deeply harms a small minority. High net utility — but at what cost?',
    people: [
      { id: 'a', name: 'The majority (90 people)', value: 8 },
      { id: 'b', name: 'The harmed minority (5 people)', value: -9 },
      { id: 'c', name: 'Bystanders (20 people)', value: 2 },
      { id: 'd', name: 'Administrators (3 people)', value: 4 },
    ],
  },
]

function netUtility(people: Array<Person>): number {
  return people.reduce((sum, p) => sum + p.value, 0)
}

function verdictText(net: number): string {
  if (net > 10) return 'Strong positive utility — the action maximises total happiness.'
  if (net > 0) return 'Net positive utility — overall happiness is increased.'
  if (net === 0) return 'Neutral — pleasure and pain exactly balance.'
  if (net > -10) return 'Net negative utility — overall happiness is reduced.'
  return 'Strong negative utility — the action causes more harm than good.'
}

function verdictColor(net: number): string {
  if (net > 0) return 'text-success'
  if (net === 0) return 'text-muted'
  return 'text-warn'
}

export function UtilityCalculator() {
  const [scenarioId, setScenarioId] = useState<string>('park')
  const [peoples, setPeoples] = useState<Record<string, Array<Person>>>({
    park: SCENARIOS[0]!.people.map((p) => ({ ...p })),
    minority: SCENARIOS[1]!.people.map((p) => ({ ...p })),
  })

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!
  const people = peoples[scenarioId]!
  const net = netUtility(people)

  function updateValue(personId: string, value: number) {
    setPeoples((prev) => ({
      ...prev,
      [scenarioId]: prev[scenarioId]!.map((p) => (p.id === personId ? { ...p, value } : p)),
    }))
  }

  function reset() {
    setPeoples((prev) => ({
      ...prev,
      [scenarioId]: scenario.people.map((p) => ({ ...p })),
    }))
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Scenario tabs */}
      <div className="mb-4 flex gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setScenarioId(s.id)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm transition-colors',
              scenarioId === s.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="mb-4 text-sm text-muted">{scenario.description}</p>

      {/* Per-person sliders */}
      <div className="mb-4 flex flex-col gap-3">
        {people.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-surface-2 p-3">
            <div className="mb-2 text-sm font-medium text-ink">{p.name}</div>
            <SceneSlider
              label={p.value >= 0 ? 'Pleasure' : 'Pain'}
              value={p.value}
              min={-10}
              max={10}
              step={1}
              unit="utils"
              onChange={(v) => updateValue(p.id, v)}
            />
            {/* Visual bar */}
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.abs(p.value) * 10}%`,
                  marginLeft: p.value < 0 ? `${(10 + p.value) * 10}%` : '50%',
                  backgroundColor: p.value >= 0 ? '#22c55e' : '#f59e0b',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Net utility verdict */}
      <div className="rounded-xl border border-border bg-surface-2 p-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">Net Utility</span>
          <span className={cn('font-mono text-lg font-bold', verdictColor(net))}>
            {net > 0 ? '+' : ''}{net} utils
          </span>
        </div>
        <p className={cn('text-sm', verdictColor(net))}>{verdictText(net)}</p>

        {scenarioId === 'minority' && net > 0 && (
          <div className="mt-3 rounded-lg border border-warn/40 bg-warn/10 p-2 text-xs text-warn">
            <strong>The objection:</strong> The minority's suffering is real and severe — yet it is
            simply outweighed in the sum. Critics argue this shows that pure utility-maximisation
            can license injustice: it treats rights and dignity as mere inputs to a calculation.
          </div>
        )}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-border px-3 py-1 text-xs text-muted hover:text-ink"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  )
}
