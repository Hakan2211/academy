import { useEffect, useRef } from 'react'

// The DNA double helix, slowly turning. Two sugar-phosphate backbones spiral
// around base pairs — and the bases only pair one way: A with T, G with C
// (colour-coded). That complementary pairing is the secret to copying DNA.
const SEQ = ['AT', 'GC', 'TA', 'CG', 'AT', 'TA', 'GC', 'CG', 'TA', 'AT', 'GC', 'TA', 'CG', 'GC', 'AT', 'TA', 'CG']
const CX = 100
const AMP = 56
const K = 0.085
const Y0 = 22
const DY = 15

const BASE_COLOR: Record<string, string> = { A: '#FDCB6E', T: '#4F8CFF', G: '#2ECC71', C: '#A29BFE' }

export function DNAHelix() {
  const s1Ref = useRef<SVGPathElement | null>(null)
  const s2Ref = useRef<SVGPathElement | null>(null)
  const rungRefs = useRef<Array<SVGLineElement | null>>([])

  useEffect(() => {
    let raf = 0
    const loop = (now: number) => {
      const phase = now / 900
      const p1: Array<string> = []
      const p2: Array<string> = []
      for (let i = 0; i < SEQ.length; i++) {
        const y = Y0 + i * DY
        const a = y * K + phase
        const x1 = CX + AMP * Math.sin(a)
        const x2 = CX + AMP * Math.sin(a + Math.PI)
        p1.push(`${i === 0 ? 'M' : 'L'} ${x1.toFixed(1)} ${y}`)
        p2.push(`${i === 0 ? 'M' : 'L'} ${x2.toFixed(1)} ${y}`)
        const rung = rungRefs.current[i]
        if (rung) {
          rung.setAttribute('x1', x1.toFixed(1))
          rung.setAttribute('x2', x2.toFixed(1))
          rung.setAttribute('y1', String(y))
          rung.setAttribute('y2', String(y))
          // fade rungs that are edge-on (backbones crossing) to fake depth
          rung.setAttribute('opacity', (0.35 + 0.65 * Math.abs(Math.cos(a))).toFixed(2))
        }
      }
      s1Ref.current?.setAttribute('d', p1.join(' '))
      s2Ref.current?.setAttribute('d', p2.join(' '))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 200 290" className="mx-auto block h-[280px]">
        {/* base-pair rungs (behind backbones) */}
        {SEQ.map((pair, i) => (
          <line
            key={i}
            ref={(el) => { rungRefs.current[i] = el }}
            x1={CX}
            y1={Y0 + i * DY}
            x2={CX}
            y2={Y0 + i * DY}
            stroke={BASE_COLOR[pair[0]]}
            strokeWidth={5}
            strokeLinecap="round"
          />
        ))}
        {/* backbones */}
        <path ref={s1Ref} d="" fill="none" stroke="#cbd5e1" strokeWidth={4} strokeLinecap="round" />
        <path ref={s2Ref} d="" fill="none" stroke="#94a3b8" strokeWidth={4} strokeLinecap="round" />
      </svg>

      <div className="mt-2 flex justify-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-4 rounded-full" style={{ background: BASE_COLOR.A }} />
          A
          <span className="inline-block h-2.5 w-4 rounded-full" style={{ background: BASE_COLOR.T }} />
          T
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-4 rounded-full" style={{ background: BASE_COLOR.G }} />
          G
          <span className="inline-block h-2.5 w-4 rounded-full" style={{ background: BASE_COLOR.C }} />
          C
        </span>
      </div>
      <p className="mt-2 text-center text-sm text-muted">
        The bases always pair the same way: <span className="font-semibold text-ink">A–T</span> and{' '}
        <span className="font-semibold text-ink">G–C</span> — complementary base pairing.
      </p>
    </div>
  )
}
