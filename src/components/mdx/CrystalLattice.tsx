import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

type Mode = 'square' | 'hex' | 'glass'

const COLS = 7
const ROWS = 5
const N = COLS * ROWS
const X0 = 70
const Y0 = 48
const SX = 38
const SY = 38

const COPY: Record<Mode, string> = {
  square: 'A simple cubic lattice — atoms on a square grid. The same motif repeats forever in every direction: long-range order.',
  hex: 'Close packing — each row nestles into the dips of the one below, the densest way to stack spheres. Still perfectly ordered.',
  glass: 'A glass (amorphous solid) — atoms are frozen mid-jumble with no repeating pattern. Solid, but not a crystal.',
}

// stable pseudo-random in [0,1) — no Math.random so positions are fixed per atom
function rnd(n: number) {
  const s = Math.sin(n * 127.1 + 0.5) * 43758.5453
  return s - Math.floor(s)
}

function homeFor(mode: Mode) {
  const out: Array<{ x: number; y: number }> = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c
      if (mode === 'square') out.push({ x: X0 + c * SX, y: Y0 + r * SY })
      else if (mode === 'hex') out.push({ x: X0 + c * SX + (r % 2) * (SX / 2) - 6, y: Y0 + r * SY * 0.87 })
      else out.push({ x: X0 + c * SX + (rnd(i) * 2 - 1) * SX * 0.46, y: Y0 + r * SY + (rnd(i + 99) * 2 - 1) * SY * 0.46 })
    }
  }
  return out
}

// What makes a crystal a crystal isn't being hard or shiny — it's *long-range order*:
// a single arrangement of atoms repeated faithfully across the whole solid. Switch the
// packing and watch the atoms march into a new lattice. A glass has none of it.
export function CrystalLattice() {
  const [mode, setMode] = useState<Mode>('square')
  const modeRef = useRef(mode)
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => { modeRef.current = mode }, [mode])

  useEffect(() => {
    const homes: Record<Mode, Array<{ x: number; y: number }>> = {
      square: homeFor('square'),
      hex: homeFor('hex'),
      glass: homeFor('glass'),
    }
    const pos = homes.square.map((p) => ({ ...p }))
    const phase = Array.from({ length: N }, (_, i) => rnd(i + 7) * Math.PI * 2)

    let raf = 0
    const loop = (now: number) => {
      const target = homes[modeRef.current]
      for (let i = 0; i < N; i++) {
        pos[i].x += (target[i].x - pos[i].x) * 0.08
        pos[i].y += (target[i].y - pos[i].y) * 0.08
        const jx = 1.3 * Math.sin(now * 0.003 + phase[i])
        const jy = 1.3 * Math.cos(now * 0.0027 + phase[i])
        const el = dotRefs.current[i]
        if (el) {
          el.setAttribute('cx', (pos[i].x + jx).toFixed(1))
          el.setAttribute('cy', (pos[i].y + jy).toFixed(1))
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {([['square', 'Simple cubic'], ['hex', 'Close-packed'], ['glass', 'Glass (amorphous)']] as Array<[Mode, string]>).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 240" className="w-full">
        <rect x="14" y="18" width="332" height="204" rx="10" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
        {Array.from({ length: N }).map((_, i) => (
          <circle key={i} ref={(el) => { dotRefs.current[i] = el }} cx={X0} cy={Y0} r="9" fill="#e84393" opacity="0.9" />
        ))}
      </svg>

      <p className="px-4 pb-4 pt-2 text-center text-sm text-muted">{COPY[mode]}</p>
    </div>
  )
}
