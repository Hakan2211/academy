import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// Transpiration: water is pulled up from the roots, through the stem, and
// evaporates out of the leaves. Toggle the conditions and watch the rate change.
const COND = [
  { id: 'light', label: '☀️ Bright', factor: 1.7 },
  { id: 'wind', label: '💨 Windy', factor: 1.5 },
  { id: 'warm', label: '🔥 Warm', factor: 1.4 },
  { id: 'humid', label: '💧 Humid', factor: 0.45 },
] as const

const NDOTS = 6

export function Transpiration() {
  const [on, setOn] = useState<Record<string, boolean>>({ light: true })
  const rate = COND.reduce((r, c) => (on[c.id] ? r * c.factor : r), 1)
  const rateRef = useRef(rate)
  rateRef.current = rate
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    const ys = Array.from({ length: NDOTS }, (_, i) => 180 - i * 22)
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      const speed = rateRef.current * 0.018
      ys.forEach((_, i) => {
        ys[i] -= speed * dt
        if (ys[i] < 48) ys[i] = 182
        dotRefs.current[i]?.setAttribute('cy', ys[i].toFixed(1))
        dotRefs.current[i]?.setAttribute('opacity', ys[i] < 60 ? ((ys[i] - 48) / 12).toFixed(2) : '1')
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 280 210" className="mx-auto block h-[200px]">
        {/* leaves */}
        <ellipse cx={96} cy={52} rx={34} ry={16} fill="#2e9b4a" transform="rotate(-18 96 52)" />
        <ellipse cx={184} cy={52} rx={34} ry={16} fill="#2e9b4a" transform="rotate(18 184 52)" />
        {/* evaporating vapour */}
        {[70, 200].map((x) => (
          <text key={x} x={x} y={34} textAnchor="middle" className="fill-muted text-[10px]" style={{ opacity: Math.min(1, rate / 2) }}>≈</text>
        ))}
        {/* stem */}
        <rect x={132} y={56} width={16} height={130} rx={4} fill="#3a6b2e" />
        <line x1={140} y1={60} x2={140} y2={182} stroke="#1e4d6b" strokeWidth={4} strokeDasharray="2 4" />
        {/* soil */}
        <rect x={40} y={182} width={200} height={24} rx={4} fill="#5a4631" />
        {/* roots */}
        {[-1, 0, 1].map((d) => (
          <line key={d} x1={140} y1={186} x2={140 + d * 30} y2={206} stroke="#7b5a3a" strokeWidth={2} />
        ))}
        {/* rising water */}
        {Array.from({ length: NDOTS }).map((_, i) => (
          <circle key={i} ref={(el) => { dotRefs.current[i] = el }} cx={140} cy={180} r={3.5} fill="#4F8CFF" />
        ))}
      </svg>

      {/* rate bar */}
      <div className="my-2">
        <div className="mb-1 flex justify-between text-xs text-muted"><span>transpiration rate</span><span className="font-mono text-ink">{rate.toFixed(1)}×</span></div>
        <div className="h-3 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${Math.min(100, (rate / 5) * 100)}%` }} />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {COND.map((c) => (
          <button key={c.id} type="button" onClick={() => setOn((o) => ({ ...o, [c.id]: !o[c.id] }))} className={cn('rounded-full border px-3 py-1 text-sm transition-colors', on[c.id] ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}>
            {c.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-muted">Light, wind, and warmth speed transpiration up; humidity slows it down.</p>
    </div>
  )
}
