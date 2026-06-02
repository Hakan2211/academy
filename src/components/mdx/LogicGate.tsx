import { useState } from 'react'
import { cn } from '#/lib/cn'

// A logic gate is boolean logic made physical: a tiny circuit that takes 1s and
// 0s in and produces a 1 or 0 out, following one rule forever. Each gate has its
// own standard symbol. Click the input terminals to flip them and watch the
// signal (green = 1) flow to the output.

type Op = 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR' | 'NOT'

function evalOp(op: Op, a: number, b: number): number {
  switch (op) {
    case 'AND': return a & b
    case 'OR': return a | b
    case 'XOR': return a ^ b
    case 'NAND': return a & b ? 0 : 1
    case 'NOR': return a | b ? 0 : 1
    case 'NOT': return a ? 0 : 1
  }
}

const ON = '#2ECC71'
const OFF = 'var(--color-border)'

const BODY: Record<Op, string> = {
  AND: 'M140,58 L172,58 A32,32 0 0 1 172,122 L140,122 Z',
  NAND: 'M140,58 L172,58 A32,32 0 0 1 172,122 L140,122 Z',
  OR: 'M138,58 Q162,90 138,122 Q180,120 206,90 Q180,60 138,58 Z',
  NOR: 'M138,58 Q162,90 138,122 Q180,120 206,90 Q180,60 138,58 Z',
  XOR: 'M146,58 Q170,90 146,122 Q186,120 210,90 Q186,60 146,58 Z',
  NOT: 'M140,58 L206,90 L140,122 Z',
}

export function LogicGate() {
  const [op, setOp] = useState<Op>('AND')
  const [a, setA] = useState(1)
  const [b, setB] = useState(0)
  const single = op === 'NOT'
  const out = evalOp(op, a, single ? 0 : b)
  const inverted = op === 'NAND' || op === 'NOR' || op === 'NOT'
  const bubbleX = op === 'NOT' ? 212 : op === 'OR' || op === 'NOR' || op === 'XOR' ? 212 : 210
  const outEdge = inverted ? bubbleX + 6 : op === 'AND' ? 204 : 210

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap justify-center gap-2">
        {(['AND', 'OR', 'XOR', 'NAND', 'NOR', 'NOT'] as Array<Op>).map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setOp(o)}
            className={cn(
              'rounded-full border px-3 py-1 font-mono text-xs transition-colors',
              op === o ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {o}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 320 180" className="mt-2 w-full">
        {/* input wires */}
        <line x1="40" y1={single ? 90 : 70} x2="140" y2={single ? 90 : 70} stroke={a ? ON : OFF} strokeWidth="3" />
        {!single && <line x1="40" y1="110" x2="140" y2="110" stroke={b ? ON : OFF} strokeWidth="3" />}
        {/* output wire */}
        <line x1={outEdge} y1="90" x2="288" y2="90" stroke={out ? ON : OFF} strokeWidth="3" />

        {/* gate body */}
        <path d={BODY[op]} fill="var(--color-surface-2)" stroke="var(--color-accent-2)" strokeWidth="2.5" />
        {inverted && <circle cx={bubbleX} cy="90" r="6" fill="var(--color-surface-2)" stroke="var(--color-accent-2)" strokeWidth="2.5" />}
        <text x={op === 'NOT' ? 165 : 172} y="94" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-accent-2)">{op}</text>

        {/* input terminals (clickable) */}
        <g onClick={() => setA(a ? 0 : 1)} style={{ cursor: 'pointer' }}>
          <circle cx="40" cy={single ? 90 : 70} r="11" fill={a ? ON : 'var(--color-surface-2)'} stroke="var(--color-border)" strokeWidth="2" />
          <text x="40" y={single ? 94 : 74} textAnchor="middle" fontSize="11" fontWeight="700" fill={a ? '#0a0f1f' : 'var(--color-muted)'}>{a}</text>
        </g>
        {!single && (
          <g onClick={() => setB(b ? 0 : 1)} style={{ cursor: 'pointer' }}>
            <circle cx="40" cy="110" r="11" fill={b ? ON : 'var(--color-surface-2)'} stroke="var(--color-border)" strokeWidth="2" />
            <text x="40" y="114" textAnchor="middle" fontSize="11" fontWeight="700" fill={b ? '#0a0f1f' : 'var(--color-muted)'}>{b}</text>
          </g>
        )}
        {/* output lamp */}
        <circle cx="300" cy="90" r="11" fill={out ? ON : 'var(--color-surface-2)'} stroke="var(--color-border)" strokeWidth="2" />
        <text x="300" y="94" textAnchor="middle" fontSize="11" fontWeight="700" fill={out ? '#0a0f1f' : 'var(--color-muted)'}>{out}</text>
      </svg>

      <p className="text-center text-xs text-muted">
        Click the left terminals to change the inputs. The whole computer is millions of these gates wired together.
      </p>
    </div>
  )
}
