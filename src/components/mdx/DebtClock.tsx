import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp, formatUSD } from '#/lib/econ'

// Deficits accumulate into debt. Every year the government runs a budget BALANCE:
// a DEFICIT (spending > revenue) borrows, adding to the stock of national DEBT;
// a SURPLUS pays some down. Run a steady deficit year after year and the debt
// climbs relentlessly — and because the economy (GDP) grows too, what really
// matters is the DEBT-TO-GDP ratio, the size of the debt relative to the economy's
// ability to carry it. Slide the annual balance, press play, and watch a rAF
// counter tick the debt up year by year while the debt-to-GDP bar fills. Heavy
// borrowing also competes with private borrowers for funds — CROWDING OUT.
const YEARS = 25
const START_DEBT = 1000 // $bn
const START_GDP = 5000 // $bn
const GDP_GROWTH = 0.03 // real economy grows ~3%/yr

const W = 360
const PLOT_H = 150
const X0 = 44
const Y0 = 162
const PW = 300

// project the path of debt and GDP given a constant annual balance (+ surplus / − deficit)
function project(balance: number) {
  const debt: Array<number> = [START_DEBT]
  const gdp: Array<number> = [START_GDP]
  for (let y = 1; y <= YEARS; y++) {
    debt.push(Math.max(0, debt[y - 1] - balance)) // balance<0 (deficit) raises debt
    gdp.push(gdp[y - 1] * (1 + GDP_GROWTH))
  }
  return { debt, gdp }
}

export function DebtClock() {
  const [balance, setBalance] = useState(-150) // $bn/yr; negative = deficit
  const [playing, setPlaying] = useState(false)
  const [year, setYear] = useState(YEARS) // current year shown when paused/at end
  const counterRef = useRef<HTMLSpanElement | null>(null)

  const { debt, gdp } = project(balance)
  const maxDebt = Math.max(...debt, START_DEBT)
  const sx = (y: number) => X0 + (y / YEARS) * PW
  const sy = (d: number) => Y0 - (d / maxDebt) * PLOT_H

  let debtPath = ''
  for (let y = 0; y <= YEARS; y++) {
    debtPath += `${y === 0 ? 'M' : 'L'}${sx(y).toFixed(1)} ${sy(debt[y]).toFixed(1)} `
  }

  // animate the year forward when playing; rAF drives the counter text directly.
  // Re-projects from `balance` inside the effect so it depends only on primitives
  // (no array-reference churn that would restart the animation each frame).
  useEffect(() => {
    if (!playing) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setYear(YEARS); setPlaying(false); return }
    const path = project(balance).debt
    let raf = 0
    let last = 0
    let t = 0 // fractional year
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      t += dt * 0.006
      const yr = clamp(t, 0, YEARS)
      // interpolate the debt counter between integer years for a smooth tick
      const i = Math.floor(yr)
      const frac = yr - i
      const dNow = i >= YEARS ? path[YEARS] : path[i] + (path[i + 1] - path[i]) * frac
      if (counterRef.current) counterRef.current.textContent = formatUSD(dNow * 1e9)
      if (t >= YEARS) {
        setYear(YEARS)
        setPlaying(false)
        return
      }
      setYear(Math.floor(yr))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [playing, balance])

  const shownYear = clamp(year, 0, YEARS)
  const debtNow = debt[shownYear]
  const gdpNow = gdp[shownYear]
  const ratio = debtNow / gdpNow
  const deficit = balance < 0

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="px-4 pt-4 text-center">
        <span ref={counterRef} className="font-mono text-2xl text-accent">{formatUSD(debtNow * 1e9)}</span>
        <div className="text-xs text-muted">national debt · year {shownYear}</div>
      </div>

      <svg viewBox={`0 0 ${W} ${PLOT_H + 50}`} className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PLOT_H} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 16} textAnchor="end" fontSize="11" fill="var(--color-muted)">Years →</text>
        <text x={X0 - 6} y={Y0 - PLOT_H} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Debt</text>

        {/* the rising debt path */}
        <path d={debtPath} fill="none" stroke="var(--color-accent)" strokeWidth="3" />
        {/* marker at the shown year */}
        <line x1={sx(shownYear)} y1={Y0} x2={sx(shownYear)} y2={sy(debtNow)} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
        <circle cx={sx(shownYear)} cy={sy(debtNow)} r="5" fill="var(--color-ink)" />
      </svg>

      {/* debt-to-GDP bar */}
      <div className="px-4">
        <div className="mb-1 flex items-center justify-between text-xs text-muted">
          <span>debt-to-GDP</span>
          <span className="font-mono text-ink">{Math.round(ratio * 100)}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full"
            style={{ width: `${clamp(ratio, 0, 1.5) / 1.5 * 100}%`, background: ratio > 1 ? 'var(--color-accent-2)' : 'var(--color-accent)' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 px-4 pt-3 text-center text-sm">
        <div><div className="font-mono text-ink">{formatUSD(debtNow * 1e9)}</div><div className="text-xs text-muted">debt</div></div>
        <div><div className="font-mono text-ink">{formatUSD(gdpNow * 1e9)}</div><div className="text-xs text-muted">GDP</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider
          label="Annual budget balance ($bn)"
          value={balance}
          min={-400}
          max={200}
          step={10}
          unit=""
          onChange={(v) => { setBalance(v); setYear(YEARS); setPlaying(false) }}
        />
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => { setYear(0); setPlaying(true) }}
            className="rounded-full border border-accent bg-accent/15 px-4 py-1 text-sm text-accent transition-colors hover:bg-accent/25"
          >
            ▶ Replay {YEARS} years
          </button>
          <span className="text-xs text-muted">{deficit ? `deficit of ${formatUSD(-balance * 1e9)}/yr` : balance > 0 ? `surplus of ${formatUSD(balance * 1e9)}/yr` : 'balanced budget'}</span>
        </div>
        <p className="text-sm text-muted">
          {deficit
            ? `Each year's deficit is borrowed and piled onto the debt, so it climbs year after year. After ${YEARS} years debt reaches ${Math.round(ratio * 100)}% of GDP. Heavy government borrowing competes with firms for the same pool of savings, pushing interest rates up and squeezing private investment — crowding out.`
            : balance > 0
              ? 'A surplus pays debt down, so the debt — and the debt-to-GDP ratio — falls over time.'
              : 'A balanced budget holds the debt steady. Because GDP keeps growing, even a flat debt shrinks relative to the economy.'}
        </p>
      </div>
    </div>
  )
}
