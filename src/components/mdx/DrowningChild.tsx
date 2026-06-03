import { useState } from 'react'
import { cn } from '#/lib/cn'

// DrowningChild — Peter Singer's argument made interactive.
// Start: child drowning in front of you. Then vary distance and cost.
// The morally relevant features do not change — pressing the question
// of why proximity should matter. Surface the standard replies too.

type Distance = 'front' | 'local' | 'national' | 'world'
type Cost = 'trivial' | 'modest' | 'significant' | 'sacrifice'

type DistOption = { id: Distance; label: string; desc: string; km: string }
type CostOption = { id: Cost; label: string; desc: string }

const DISTANCES: Array<DistOption> = [
  { id: 'front', label: 'Right in front of you', desc: 'A child is drowning in a shallow pond at your feet.', km: '0 m' },
  { id: 'local', label: 'One block away', desc: 'A child is drowning in a pond around the corner. You could walk there in two minutes.', km: '~100 m' },
  { id: 'national', label: 'Another city', desc: 'A child is drowning across the country. You learn of it via a live feed.', km: '~500 km' },
  { id: 'world', label: 'Another country', desc: 'A child is dying of a preventable disease in a distant country. A donation would save them.', km: '>5,000 km' },
]

const COSTS: Array<CostOption> = [
  { id: 'trivial', label: 'Ruin your shoes', desc: 'You wade in and ruin your €80 shoes. Inconvenient, but trivial.' },
  { id: 'modest', label: 'Miss a dinner', desc: 'Saving takes a few hours; you miss plans. A moderate disruption.' },
  { id: 'significant', label: 'Give a month\'s surplus', desc: 'The equivalent of donating €200–€500 — real money but not ruinous.' },
  { id: 'sacrifice', label: 'Major sacrifice', desc: 'Saving requires a substantial, lifestyle-changing sacrifice.' },
]

type Reply = {
  id: string
  label: string
  body: string
  singerResponse: string
}

const REPLIES: Array<Reply> = [
  {
    id: 'proximity',
    label: 'Proximity matters morally',
    body: 'We have stronger obligations to those physically near us. Distance dilutes duty.',
    singerResponse:
      'Singer asks: what is it about physical distance that matters morally? The child\'s suffering is equally real at 5,000 km. Distance affects our emotions and our knowledge — but if we know the child exists and can help, distance alone does not seem to create a moral difference.',
  },
  {
    id: 'special-relations',
    label: 'We have special obligations',
    body: 'We owe more to our family, community, and compatriots. Global strangers make weaker claims on us.',
    singerResponse:
      'A serious objection. Singer grants special obligations exist — but argues they do not eliminate general obligations. The question is whether the general duty to prevent easily preventable death is simply extinguished by the greater distance. He thinks partial obligations (to near ones) cannot fully cancel an impartial one (to any sufferer we can help).',
  },
  {
    id: 'demandingness',
    label: 'This is too demanding',
    body: 'If we must give until we sacrifice something of comparable moral importance, that\'s an impossibly high bar.',
    singerResponse:
      'Singer acknowledges this objection cuts deeply. He distinguishes a strong principle (give until near-equal sacrifice) from a moderate one (give until marginal utility — until giving more would cost you something you\'d reasonably value more). Even the moderate version implies far more giving than most people do.',
  },
  {
    id: 'collective-responsibility',
    label: 'Others could help too',
    body: 'If many people can help, why should the burden fall on me alone?',
    singerResponse:
      'Singer\'s reply: if others could help but are not helping, that does not reduce your obligation. In the drowning-child case, if ten bystanders walk past and do nothing, that does not justify you walking past too. The failure of others to act increases, not decreases, the urgency of your own action.',
  },
]

function SingerMeter({ distance, cost }: { distance: Distance; cost: Cost }) {
  const dScores: Record<Distance, number> = { front: 100, local: 95, national: 80, world: 70 }
  const cScores: Record<Cost, number> = { trivial: 100, modest: 85, significant: 65, sacrifice: 30 }

  const dScore = dScores[distance]
  const cScore = cScores[cost]
  const overall = Math.round((dScore * cScore) / 100)

  const label =
    overall >= 80
      ? 'Most philosophers and most people agree: you must help.'
      : overall >= 60
        ? 'Singer says: the obligation is still strong. Distance and cost do not eliminate it — they merely make it feel weaker.'
        : overall >= 40
          ? 'Here intuitions diverge sharply. Singer maintains the obligation; critics invoke demandingness and special relations.'
          : 'The hardest case. Singer\'s argument implies obligation persists; critics argue this proves the argument proves too much.'

  const barColor =
    overall >= 80 ? 'bg-success' : overall >= 55 ? 'bg-accent' : overall >= 35 ? 'bg-accent-2' : 'bg-warn'

  return (
    <div className="rounded-xl border border-border bg-surface-2 p-3 text-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        Strength of obligation — Singer's view
      </p>
      <div className="mb-1 h-3 overflow-hidden rounded-full bg-surface">
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${overall}%` }}
        />
      </div>
      <div className="mb-2 flex justify-between text-xs text-muted">
        <span>No obligation</span>
        <span className="font-mono font-semibold text-ink">{overall}%</span>
        <span>Strong obligation</span>
      </div>
      <p className="leading-relaxed text-muted">{label}</p>
    </div>
  )
}

export function DrowningChild() {
  const [distance, setDistance] = useState<Distance>('front')
  const [cost, setCost] = useState<Cost>('trivial')
  const [openReply, setOpenReply] = useState<string | null>(null)

  const distObj = DISTANCES.find((d) => d.id === distance)!
  const costObj = COSTS.find((c) => c.id === cost)!

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-sm font-semibold text-ink">Singer's argument, made interactive</p>
      <p className="mb-4 text-xs leading-relaxed text-muted">
        Peter Singer asks: if you would ruin your shoes to save a drowning child in front of you,
        why would distance or cost change that obligation? Vary the sliders below and watch the
        question follow you.
      </p>

      {/* Scenario display */}
      <div className="mb-4 rounded-xl border border-border bg-surface-2 p-3">
        <p className="text-sm leading-relaxed text-ink">
          <span className="font-semibold">{distObj.label}:</span> {distObj.desc}{' '}
          <span className="font-semibold">Cost to you:</span> {costObj.desc}
        </p>
        <p className="mt-1 text-xs text-muted">Distance: {distObj.km}</p>
      </div>

      {/* Distance selector */}
      <div className="mb-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Distance to the child</p>
        <div className="grid grid-cols-2 gap-2">
          {DISTANCES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDistance(d.id)}
              className={cn(
                'rounded-xl border px-3 py-2 text-left text-xs transition-colors',
                distance === d.id
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border text-muted hover:text-ink',
              )}
            >
              <div className="font-semibold">{d.label}</div>
              <div className="opacity-70">{d.km}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cost selector */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Cost to you</p>
        <div className="grid grid-cols-2 gap-2">
          {COSTS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCost(c.id)}
              className={cn(
                'rounded-xl border px-3 py-2 text-left text-xs transition-colors',
                cost === c.id
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border text-muted hover:text-ink',
              )}
            >
              <span className="font-semibold">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Singer meter */}
      <SingerMeter distance={distance} cost={cost} />

      {/* Singer's core argument */}
      <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-3 text-xs leading-relaxed text-muted">
        <p className="mb-1 font-semibold text-ink">Singer's core argument</p>
        <p>
          "If it is in our power to prevent something bad from happening, without thereby sacrificing
          anything of comparable moral importance, we ought, morally, to do it." Distance and the
          presence of others do not change what is bad or what is preventable — only our emotions.
        </p>
      </div>

      {/* Standard replies */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Standard replies — and Singer's response
        </p>
        <div className="space-y-2">
          {REPLIES.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-surface-2 text-sm">
              <button
                type="button"
                onClick={() => setOpenReply(openReply === r.id ? null : r.id)}
                className="flex w-full items-center justify-between px-3 py-2.5 text-left"
              >
                <span className="font-medium text-ink">{r.label}</span>
                <span className="ml-2 shrink-0 text-xs text-muted">{openReply === r.id ? '▲' : '▼'}</span>
              </button>
              {openReply === r.id && (
                <div className="border-t border-border px-3 pb-3 pt-2 text-xs">
                  <p className="mb-2 leading-relaxed text-ink">{r.body}</p>
                  <p className="leading-relaxed text-muted">
                    <span className="font-semibold text-accent">Singer's response: </span>
                    {r.singerResponse}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Singer does not claim this argument is easy to live by — he claims it is hard to refute. The
        gap between what we believe and what we do is itself a philosophical problem.
      </p>
    </div>
  )
}
