import { useEffect, useRef, useState } from 'react'

type Part = { x: number; y: number; dx: number; dy: number }

const N = 28
const minX = 22
const maxX = 246
const minY = 26
const maxY = 204
const COLS = 6
const ROWS = 3

// Start every particle packed into the left half — an ordered, low-entropy
// state. Release them and they spread to fill the box; the "disorder" meter
// climbs and then just... stays there. You never see them spontaneously gather
// back into the corner. That one-way arrow is the Second Law.
export function EntropyBox() {
  const [seed, setSeed] = useState(0)
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])
  const barRef = useRef<SVGRectElement>(null)
  const pctRef = useRef<SVGTextElement>(null)

  useEffect(() => {
    const parts: Array<Part> = []
    for (let i = 0; i < N; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 0.05 + Math.random() * 0.03
      parts.push({
        x: minX + Math.random() * (128 - minX), // packed into the left
        y: minY + Math.random() * (maxY - minY),
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
      })
    }

    const barMax = 280
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now

      const occupied = new Set<number>()
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]
        p.x += p.dx * dt
        p.y += p.dy * dt
        if (p.x < minX) { p.x = minX; p.dx = -p.dx }
        else if (p.x > maxX) { p.x = maxX; p.dx = -p.dx }
        if (p.y < minY) { p.y = minY; p.dy = -p.dy }
        else if (p.y > maxY) { p.y = maxY; p.dy = -p.dy }
        const col = Math.min(COLS - 1, Math.floor(((p.x - minX) / (maxX - minX)) * COLS))
        const row = Math.min(ROWS - 1, Math.floor(((p.y - minY) / (maxY - minY)) * ROWS))
        occupied.add(row * COLS + col)
        const el = dotRefs.current[i]
        if (el) {
          el.setAttribute('cx', p.x.toFixed(1))
          el.setAttribute('cy', p.y.toFixed(1))
        }
      }

      const frac = occupied.size / (COLS * ROWS)
      barRef.current?.setAttribute('width', String(frac * barMax))
      if (pctRef.current) pctRef.current.textContent = `${Math.round(frac * 100)}%`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [seed])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex items-center justify-between p-3">
        <span className="text-sm text-muted">Order → disorder, one way only</span>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-full border border-accent bg-accent/15 px-3 py-1 text-sm text-accent transition-colors hover:bg-accent/25"
        >
          Re-pack &amp; release
        </button>
      </div>

      <svg viewBox="0 0 360 270" className="w-full">
        <rect x="14" y="18" width="240" height="194" rx="8" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2" />
        {/* the dividing wall the gas starts behind */}
        <line x1="134" y1="18" x2="134" y2="212" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />

        {Array.from({ length: N }).map((_, i) => (
          <circle
            key={i}
            ref={(el) => { dotRefs.current[i] = el }}
            cx={minX}
            cy={minY}
            r="5"
            fill="var(--color-accent-2)"
          />
        ))}

        {/* disorder / entropy meter */}
        <text x="20" y="238" fill="var(--color-muted)" fontSize="12">
          disorder (entropy)
        </text>
        <text ref={pctRef} x="300" y="238" fill="var(--color-ink)" fontSize="12" textAnchor="end">
          0%
        </text>
        <line x1="20" y1="252" x2="300" y2="252" stroke="var(--color-border)" strokeWidth="6" strokeLinecap="round" />
        <rect ref={barRef} x="20" y="249" width="0" height="6" rx="3" fill="#e84393" />
      </svg>
    </div>
  )
}
