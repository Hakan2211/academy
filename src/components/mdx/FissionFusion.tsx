import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

type Mode = 'fission' | 'fusion'

const CX = 190
const CY = 110
const GRAY = '#95a5a6'
const FLASH = '#fdcb6e'

// Both nuclear powers come from the same trade: rearrange a nucleus into a more
// tightly-bound form and the leftover mass is released as energy (E = mc²).
// Fission splits a heavy nucleus; fusion joins light ones. Splitting uranium runs
// reactors; fusing hydrogen lights the stars.
export function FissionFusion() {
  const [mode, setMode] = useState<Mode>('fission')
  // fission refs
  const nInRef = useRef<SVGCircleElement>(null)
  const bigRef = useRef<SVGGElement>(null)
  const fragRefs = useRef<Array<SVGGElement | null>>([])
  const emitRefs = useRef<Array<SVGCircleElement | null>>([])
  const flashFRef = useRef<SVGCircleElement>(null)
  // fusion refs
  const aRef = useRef<SVGGElement>(null)
  const bRef = useRef<SVGGElement>(null)
  const heRef = useRef<SVGGElement>(null)
  const nOutRef = useRef<SVGCircleElement>(null)
  const flashURef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const P = mode === 'fission' ? 3200 : 3000
    let raf = 0
    let start = 0
    const set = (el: Element | null, attrs: Record<string, string | number>) => {
      if (!el) return
      for (const k in attrs) el.setAttribute(k, String(attrs[k]))
    }
    const loop = (now: number) => {
      if (!start) start = now
      const t = ((now - start) % P) / P

      if (mode === 'fission') {
        const split = 0.42
        if (t < split) {
          const u = t / split
          set(nInRef.current, { cx: 24 + 140 * u, cy: CY, opacity: 1 })
          set(bigRef.current, { opacity: 1 })
          set(flashFRef.current, { opacity: 0 })
          fragRefs.current.forEach((f) => set(f, { opacity: 0 }))
          emitRefs.current.forEach((e) => set(e, { opacity: 0 }))
        } else {
          const v = (t - split) / (1 - split)
          set(nInRef.current, { opacity: 0 })
          set(bigRef.current, { opacity: 0 })
          set(flashFRef.current, { opacity: Math.max(0, 1 - v), r: 12 + 52 * v })
          set(fragRefs.current[0], { transform: `translate(${110 * v}, ${-48 * v})`, opacity: 1 })
          set(fragRefs.current[1], { transform: `translate(${110 * v}, ${48 * v})`, opacity: 1 })
          set(emitRefs.current[0], { cx: CX + 140 * v, cy: CY, opacity: 1 })
          set(emitRefs.current[1], { cx: CX + 64 * v, cy: CY - 84 * v, opacity: 1 })
          set(emitRefs.current[2], { cx: CX + 64 * v, cy: CY + 84 * v, opacity: 1 })
        }
      } else {
        const fuse = 0.5
        if (t < fuse) {
          const u = t / fuse
          set(aRef.current, { transform: `translate(${130 * u}, 0)`, opacity: 1 })
          set(bRef.current, { transform: `translate(${-140 * u}, 0)`, opacity: 1 })
          set(heRef.current, { opacity: 0 })
          set(nOutRef.current, { opacity: 0 })
          set(flashURef.current, { opacity: 0 })
        } else {
          const v = (t - fuse) / (1 - fuse)
          set(aRef.current, { opacity: 0 })
          set(bRef.current, { opacity: 0 })
          set(heRef.current, { opacity: 1 })
          set(nOutRef.current, { cx: CX + 130 * v, cy: CY - 70 * v, opacity: 1 })
          set(flashURef.current, { opacity: Math.max(0, 1 - v), r: 12 + 46 * v })
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [mode])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {(['fission', 'fusion'] as Array<Mode>).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setMode(k)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              mode === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {k}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 400 220" className="w-full">
        {mode === 'fission' && (
          <>
            <circle ref={flashFRef} cx={CX} cy={CY} r="12" fill={FLASH} opacity="0" />
            {/* incoming neutron */}
            <circle ref={nInRef} cx="24" cy={CY} r="6" fill={GRAY} />
            {/* heavy nucleus U-235 */}
            <g ref={bigRef}>
              <circle cx={CX} cy={CY} r="28" fill="#6c5ce7" />
              <text x={CX} y={CY + 4} fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle">U-235</text>
            </g>
            {/* two fragments */}
            {[0, 1].map((i) => (
              <g key={i} ref={(g) => { fragRefs.current[i] = g }} opacity="0">
                <circle cx={CX} cy={CY} r="17" fill={i === 0 ? '#e17055' : '#0984e3'} />
              </g>
            ))}
            {/* emitted neutrons */}
            {[0, 1, 2].map((i) => (
              <circle key={i} ref={(el) => { emitRefs.current[i] = el }} cx={CX} cy={CY} r="5" fill={GRAY} opacity="0" />
            ))}
          </>
        )}

        {mode === 'fusion' && (
          <>
            <circle ref={flashURef} cx={CX} cy={CY} r="12" fill={FLASH} opacity="0" />
            {/* deuterium */}
            <g ref={aRef}>
              <circle cx="36" cy={CY} r="15" fill="#0984e3" />
              <text x="36" y={CY + 4} fill="#fff" fontSize="11" fontWeight="700" textAnchor="middle">²H</text>
            </g>
            {/* tritium */}
            <g ref={bRef}>
              <circle cx="354" cy={CY} r="17" fill="#e17055" />
              <text x="354" y={CY + 4} fill="#fff" fontSize="11" fontWeight="700" textAnchor="middle">³H</text>
            </g>
            {/* helium product */}
            <g ref={heRef} opacity="0">
              <circle cx={CX} cy={CY} r="22" fill="#a29bfe" />
              <text x={CX} y={CY + 4} fill="#fff" fontSize="12" fontWeight="700" textAnchor="middle">⁴He</text>
            </g>
            {/* spat-out neutron */}
            <circle ref={nOutRef} cx={CX} cy={CY} r="5" fill={GRAY} opacity="0" />
          </>
        )}
      </svg>

      <p className="px-4 pb-4 pt-1 text-center text-xs text-muted">
        {mode === 'fission'
          ? 'A stray neutron splits a uranium nucleus into two fragments and 2–3 fresh neutrons — which can split more nuclei: a chain reaction. Each split releases energy.'
          : 'Two light hydrogen nuclei slam together to make helium, spitting out a neutron and a burst of energy. This is what powers the Sun — and far more energy per kilogram than fission.'}
      </p>
    </div>
  )
}
