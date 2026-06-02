import { useState } from 'react'

// Wire simple gates together and richer behaviour emerges. Here AND, OR and NOT
// combine into an XOR ("one or the other, but not both") — a function no single
// basic gate provides. XOR = (A OR B) AND NOT(A AND B). Flip A and B and trace
// the green signals through the circuit.

const ON = '#2ECC71'
const OFF = 'var(--color-border)'

export function GateCircuit() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(0)

  const g1 = a & b // AND
  const g2 = a | b // OR
  const g3 = g1 ? 0 : 1 // NOT
  const out = g2 & g3 // AND
  const col = (v: number) => (v ? ON : OFF)

  const gateBox = (x: number, y: number, label: string) => (
    <g>
      <rect x={x} y={y} width="56" height="34" rx="8" fill="var(--color-surface-2)" stroke="var(--color-accent-2)" strokeWidth="2" />
      <text x={x + 28} y={y + 22} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-accent-2)">{label}</text>
    </g>
  )

  const term = (x: number, y: number, v: number, onClick?: () => void) => (
    <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <circle cx={x} cy={y} r="11" fill={v ? ON : 'var(--color-surface-2)'} stroke="var(--color-border)" strokeWidth="2" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={v ? '#0a0f1f' : 'var(--color-muted)'}>{v}</text>
    </g>
  )

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 380 200" className="w-full">
        {/* A fans to AND(g1) and OR(g2) */}
        <path d="M28,55 H70 V50 H95" fill="none" stroke={col(a)} strokeWidth="3" />
        <path d="M70,55 V132 H95" fill="none" stroke={col(a)} strokeWidth="3" />
        {/* B fans to AND(g1) and OR(g2) */}
        <path d="M28,140 H58 V66 H95" fill="none" stroke={col(b)} strokeWidth="3" />
        <path d="M58,140 H95" fill="none" stroke={col(b)} strokeWidth="3" />
        {/* g1 -> NOT(g3) */}
        <line x1="151" y1="55" x2="195" y2="55" stroke={col(g1)} strokeWidth="3" />
        {/* g3 -> out (top input) */}
        <path d="M251,55 H268 V92 H285" fill="none" stroke={col(g3)} strokeWidth="3" />
        {/* g2 -> out (bottom input) */}
        <path d="M151,140 H268 V112 H285" fill="none" stroke={col(g2)} strokeWidth="3" />
        {/* out -> terminal */}
        <line x1="341" y1="102" x2="362" y2="102" stroke={col(out)} strokeWidth="3" />

        {gateBox(95, 38, 'AND')}
        {gateBox(95, 123, 'OR')}
        {gateBox(195, 38, 'NOT')}
        {gateBox(285, 85, 'AND')}

        {term(28, 55, a, () => setA(a ? 0 : 1))}
        {term(28, 140, b, () => setB(b ? 0 : 1))}
        <text x="14" y="40" fontSize="10" fill="var(--color-muted)">A</text>
        <text x="14" y="160" fontSize="10" fill="var(--color-muted)">B</text>
        {term(372, 102, out)}
      </svg>

      <p className="text-center text-sm text-muted">
        This whole circuit behaves as one <span className="font-mono text-accent">XOR</span> gate: output is <span className="text-ink">1</span> only when A and B differ. Complex logic is just simple gates, layered.
      </p>
    </div>
  )
}
