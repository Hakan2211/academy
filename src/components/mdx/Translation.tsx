import { useEffect, useRef } from 'react'

// Translation: the ribosome reads the mRNA three bases at a time. For each codon
// a matching tRNA delivers one amino acid, which is added to a growing protein
// chain — until a STOP codon ends it.
const CODONS = ['AUG', 'CUU', 'UCU', 'GGU', 'UAA']
const AMINOS = ['Met', 'Leu', 'Ser', 'Gly']
const CODON_X = [66, 124, 182, 240, 298]
const BASE_COLOR: Record<string, string> = { A: '#FDCB6E', U: '#4F8CFF', G: '#2ECC71', C: '#A29BFE' }
const D = 2200

export function Translation() {
  const riboRef = useRef<SVGGElement | null>(null)
  const trnaRef = useRef<SVGGElement | null>(null)
  const trnaLabelRef = useRef<SVGTextElement | null>(null)
  const beadRefs = useRef<Array<SVGGElement | null>>([])
  const statusRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    let raf = 0
    const loop = (now: number) => {
      const k = Math.floor(now / D) % CODONS.length
      const ph = (now / D) % 1
      const stop = k === 4

      // ribosome position (shifts to next codon at the end of each cycle)
      const from = CODON_X[k]
      const to = CODON_X[Math.min(k + 1, 4)]
      const rx = ph < 0.8 ? from : from + (to - from) * ((ph - 0.8) / 0.2)
      riboRef.current?.setAttribute('transform', `translate(${rx.toFixed(1)} 116)`)

      // tRNA delivers an amino acid (not on the stop codon)
      if (!stop && ph < 0.8) {
        const y = ph < 0.35 ? 205 - (ph / 0.35) * 50 : ph < 0.55 ? 155 : 155 + ((ph - 0.55) / 0.25) * 55
        const op = ph < 0.7 ? 1 : Math.max(0, 1 - (ph - 0.7) / 0.1)
        trnaRef.current?.setAttribute('transform', `translate(${CODON_X[k]} ${y.toFixed(1)})`)
        trnaRef.current?.setAttribute('opacity', op.toFixed(2))
        if (trnaLabelRef.current) trnaLabelRef.current.textContent = AMINOS[k]
      } else {
        trnaRef.current?.setAttribute('opacity', '0')
      }

      // grow the protein chain
      const built = stop ? 4 : k + (ph > 0.5 ? 1 : 0)
      beadRefs.current.forEach((b, i) => b?.setAttribute('opacity', i < built ? '1' : '0'))

      if (statusRef.current) {
        statusRef.current.textContent = stop
          ? 'STOP codon reached — the finished protein is released.'
          : ph < 0.55
            ? `Codon ${CODONS[k]} → a tRNA brings ${AMINOS[k]}.`
            : `${AMINOS[k]} is added to the chain; the ribosome moves on.`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 230" className="w-full">
        {/* growing polypeptide chain (top) */}
        <line x1={60} y1={40} x2={228} y2={40} stroke="#5b3fb0" strokeWidth={2} />
        {AMINOS.map((a, i) => (
          <g key={i} ref={(el) => { beadRefs.current[i] = el }} opacity={0}>
            <circle cx={66 + i * 44} cy={40} r={13} fill="#A29BFE" stroke="#cfc4f5" strokeWidth={1.5} />
            <text x={66 + i * 44} y={44} textAnchor="middle" className="fill-white text-[8px] font-semibold">{a}</text>
          </g>
        ))}
        <text x={150} y={20} textAnchor="middle" className="fill-muted text-[9px]">protein chain</text>

        {/* ribosome */}
        <g ref={riboRef} transform="translate(66 116)">
          <ellipse rx={38} ry={22} cy={6} fill="#4FD1C5" opacity={0.85} />
          <ellipse rx={34} ry={14} cy={-12} fill="#3aa99f" opacity={0.85} />
        </g>

        {/* mRNA strand with codons */}
        <line x1={30} y1={150} x2={330} y2={150} stroke="#94a3b8" strokeWidth={3} />
        {CODONS.map((codon, ci) => (
          <g key={ci}>
            {codon.split('').map((b, bi) => (
              <text key={bi} x={CODON_X[ci] - 14 + bi * 14} y={166} textAnchor="middle" className="text-[11px] font-mono font-bold" fill={BASE_COLOR[b]}>{b}</text>
            ))}
          </g>
        ))}
        <text x={30} y={184} className="fill-muted text-[9px]">mRNA (read 3 bases at a time)</text>

        {/* tRNA */}
        <g ref={trnaRef} transform="translate(66 205)" opacity={0}>
          <path d="M -14 22 L 14 22 L 9 4 L -9 4 Z" fill="#E17055" />
          <circle cy={-10} r={12} fill="#A29BFE" />
          <text ref={trnaLabelRef} y={-6} textAnchor="middle" className="fill-white text-[8px] font-semibold">Met</text>
        </g>
      </svg>

      <p ref={statusRef} className="mt-1 min-h-[2.5rem] text-center text-sm text-muted">
        Codon AUG → a tRNA brings Met.
      </p>
    </div>
  )
}
