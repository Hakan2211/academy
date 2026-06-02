import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// The ~28-day menstrual cycle, run by hormones. Drag the day to see oestrogen and
// progesterone rise and fall, the uterus lining build and shed, and ovulation.
const X0 = 38
const X1 = 308
const dayX = (d: number) => X0 + ((d - 1) / 27) * (X1 - X0)

const sq = (x: number) => x * x
const oestrogen = (d: number) => Math.exp(-sq((d - 13) / 3.5)) * 0.95 + Math.exp(-sq((d - 21) / 5)) * 0.3
const progesterone = (d: number) => (d < 14 ? 0.05 : Math.exp(-sq((d - 21) / 4)) * 0.9)
const lining = (d: number) => (d <= 5 ? 0.55 - (d - 1) * 0.1 : Math.min(0.95, 0.15 + (d - 5) / 19 * 0.8))

const yFor = (v: number) => 120 - v * 92

function phaseText(d: number): string {
  if (d <= 5) return `Days 1–5: menstruation — the old uterus lining breaks down and is shed (a period).`
  if (d < 14) return `Days 6–13: oestrogen rises, rebuilding the uterus lining and ripening an egg.`
  if (d <= 15) return `Day 14: ovulation — an egg is released from the ovary, ready to be fertilised.`
  return `Days 15–28: progesterone keeps the lining thick. If no fertilisation, it falls — triggering the next period.`
}

function curve(fn: (d: number) => number) {
  const pts: Array<string> = []
  for (let d = 1; d <= 28; d++) pts.push(`${dayX(d).toFixed(1)},${yFor(fn(d)).toFixed(1)}`)
  return pts.join(' ')
}

export function MenstrualCycle() {
  const [day, setDay] = useState(14)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 320 150" className="w-full">
        {/* lining (filled area) */}
        <polygon points={`${X0},130 ${curve(lining)} ${X1},130`} fill="#FD79A822" stroke="none" />
        {/* axes */}
        <line x1={X0} y1={20} x2={X0} y2={130} stroke="var(--color-border)" strokeWidth={1} />
        <line x1={X0} y1={130} x2={X1} y2={130} stroke="var(--color-border)" strokeWidth={1} />
        {/* ovulation marker */}
        <line x1={dayX(14)} y1={20} x2={dayX(14)} y2={130} stroke="#2ECC71" strokeWidth={1} strokeDasharray="2 3" />
        <text x={dayX(14)} y={16} textAnchor="middle" className="fill-[#2ECC71] text-[8px]">ovulation</text>
        {/* hormone curves */}
        <polyline points={curve(oestrogen)} fill="none" stroke="#A29BFE" strokeWidth={2} />
        <polyline points={curve(progesterone)} fill="none" stroke="#4FD1C5" strokeWidth={2} />
        {/* day marker */}
        <line x1={dayX(day)} y1={20} x2={dayX(day)} y2={130} stroke="#FDCB6E" strokeWidth={1.5} />
        <text x={X1} y={142} textAnchor="end" className="fill-muted text-[8px]">day →</text>
      </svg>

      <div className="mb-2 flex justify-center gap-4 text-[11px]">
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-4 rounded bg-[#A29BFE]" /> oestrogen</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-4 rounded bg-[#4FD1C5]" /> progesterone</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-4 rounded bg-[#FD79A8]/40" /> lining</span>
      </div>

      <p className="mb-2 min-h-[2.5rem] text-center text-sm text-muted">{phaseText(day)}</p>
      <SceneSlider label="Day of cycle" value={day} min={1} max={28} step={1} unit="" onChange={(v) => setDay(Math.round(v))} />
    </div>
  )
}
