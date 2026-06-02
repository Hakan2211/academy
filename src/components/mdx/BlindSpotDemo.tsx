import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// A working version of the classic find-your-blind-spot test. Close your LEFT
// eye, stare at the cross with your right eye, and slide the red dot. At a
// certain spot the dot lands on your optic disc — where the optic nerve leaves
// and there are no receptors — and it vanishes. Your brain "fills in" the gap.
const W = 360
const H = 150
const CROSS_X = 70
const CY = H / 2

export function BlindSpotDemo() {
  const [dotX, setDotX] = useState(160)
  const sep = dotX - CROSS_X

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <p className="mb-2 text-sm text-muted">
        Close your <span className="font-semibold text-ink">left</span> eye. Stare hard at the <span className="text-accent">+</span> with your right eye (don't look at the dot). Now slide the dot — at one spot it will <span className="text-ink">disappear</span> completely.
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl bg-white">
        {/* Fixation cross */}
        <line x1={CROSS_X - 9} y1={CY} x2={CROSS_X + 9} y2={CY} stroke="#111" strokeWidth="3" />
        <line x1={CROSS_X} y1={CY - 9} x2={CROSS_X} y2={CY + 9} stroke="#111" strokeWidth="3" />
        {/* The disappearing dot */}
        <circle cx={dotX} cy={CY} r="11" fill="#E74C3C" />
      </svg>

      <div className="mt-3 px-1">
        <SceneSlider label="Dot position" value={dotX} min={110} max={330} step={1} unit="px" onChange={setDotX} />
        <p className="mt-2 text-center text-sm text-muted">
          Dot sits <span className="font-mono text-ink">{sep.toFixed(0)} px</span> from the cross.
          For most people the dot vanishes when it's roughly <span className="text-ink">15–18°</span> out to the side — try around the <span className="text-accent">middle-right</span> of the slider, then nudge slowly.
        </p>
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 p-3 text-sm text-muted">
        <span className="font-semibold text-ink">Why it happens: </span>
        the optic nerve punches through the retina at the <span className="text-accent">optic disc</span>, leaving a patch with <span className="text-ink">no rods or cones</span>. When the dot's image falls there, no signal is sent — yet you don't see a black hole, because your brain seamlessly <span className="text-ink">fills in</span> the surrounding background. Perception is partly invention.
      </div>
    </div>
  )
}
