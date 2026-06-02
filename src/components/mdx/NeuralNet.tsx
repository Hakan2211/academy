import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// Stack neurons into layers and you get a network that computes far richer
// functions than any single neuron could. Values enter at the left, flow along
// weighted edges, and each node fires according to its activation. Watch a
// FORWARD PASS ripple left-to-right, nodes lighting up by how strongly they
// activate. "Learning" means nudging every weight a little, over and over, so the
// outputs get closer to the right answers — that's backpropagation, in spirit.

const LAYERS = [3, 4, 2]
const COL_X = [70, 200, 330]
const W = 400
const H = 230

type Node = { x: number; y: number; layer: number; idx: number }

const NODES: Array<Node> = []
LAYERS.forEach((count, layer) => {
  const gap = H / (count + 1)
  for (let i = 0; i < count; i++) {
    NODES.push({ x: COL_X[layer], y: gap * (i + 1), layer, idx: i })
  }
})
const nodeAt = (layer: number, idx: number) => NODES.find((n) => n.layer === layer && n.idx === idx)!

type Edge = { from: Node; to: Node; w: number }
const EDGES: Array<Edge> = []
for (let l = 0; l < LAYERS.length - 1; l++) {
  for (let a = 0; a < LAYERS[l]; a++) {
    for (let b = 0; b < LAYERS[l + 1]; b++) {
      EDGES.push({ from: nodeAt(l, a), to: nodeAt(l + 1, b), w: Math.random() * 2 - 1 })
    }
  }
}

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z))
const BIASES = NODES.map(() => Math.random() * 0.6 - 0.3)

// Compute activations for every node given the 3 inputs.
function activations(inputs: Array<number>): Array<number> {
  const act = NODES.map((n) => (n.layer === 0 ? inputs[n.idx] : 0))
  for (let l = 1; l < LAYERS.length; l++) {
    for (let b = 0; b < LAYERS[l]; b++) {
      const node = nodeAt(l, b)
      let z = BIASES[NODES.indexOf(node)]
      for (const e of EDGES) {
        if (e.to === node) z += e.from.layer === l - 1 ? act[NODES.indexOf(e.from)] * e.w : 0
      }
      act[NODES.indexOf(node)] = sigmoid(z * 1.4)
    }
  }
  return act
}

export function NeuralNet() {
  const [inputs, setInputs] = useState([0.8, 0.2, 0.6])
  const nodeRefs = useRef<Array<SVGCircleElement | null>>([])
  const inputsRef = useRef(inputs)
  const startRef = useRef(0) // timestamp the current sweep began
  useEffect(() => { inputsRef.current = inputs }, [inputs])

  useEffect(() => {
    let raf = 0
    const loop = (now: number) => {
      if (!startRef.current) startRef.current = now
      // Sweep the activation "wavefront" rightward over ~1.4s, then hold.
      const pulse = Math.min(LAYERS.length - 1, (now - startRef.current) / 700)
      const act = activations(inputsRef.current)
      for (let k = 0; k < NODES.length; k++) {
        const n = NODES[k]
        const reached = pulse >= n.layer - 0.001
        const a = reached ? act[k] : 0
        const el = nodeRefs.current[k]
        if (el) {
          el.setAttribute('fill-opacity', (0.12 + a * 0.88).toFixed(3))
          el.setAttribute('r', (12 + a * 5).toFixed(2))
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Restart the left-to-right sweep whenever inputs change or on replay.
  const restart = () => { startRef.current = 0 }
  const setInput = (i: number, v: number) => {
    setInputs(inputs.map((x, j) => (j === i ? v : x)))
    restart()
  }

  const act = activations(inputs)
  const outKeys = NODES.map((n, k) => (n.layer === LAYERS.length - 1 ? k : -1)).filter((k) => k >= 0)
  const outVals = outKeys.map((k) => act[k])
  const winner = outVals[0] >= outVals[1] ? 0 : 1

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {['input', 'hidden', 'output'].map((label, l) => (
          <text key={label} x={COL_X[l]} y="16" textAnchor="middle" fontSize="10" fill="var(--color-muted)">{label}</text>
        ))}
        {EDGES.map((e, i) => (
          <line
            key={i}
            x1={e.from.x}
            y1={e.from.y}
            x2={e.to.x}
            y2={e.to.y}
            stroke={e.w >= 0 ? 'var(--color-accent)' : '#FFB454'}
            strokeWidth={0.4 + Math.abs(e.w) * 2}
            opacity={0.35}
          />
        ))}
        {NODES.map((n, k) => (
          <g key={k}>
            <circle
              ref={(el) => { nodeRefs.current[k] = el }}
              cx={n.x}
              cy={n.y}
              r="12"
              fill={n.layer === LAYERS.length - 1 ? '#2ECC71' : 'var(--color-accent-2)'}
              fillOpacity="0.5"
              stroke="var(--color-border)"
              strokeWidth="1.5"
            />
            {n.layer === 0 && (
              <text x={n.x - 24} y={n.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-ink)">{inputs[n.idx].toFixed(1)}</text>
            )}
            {n.layer === LAYERS.length - 1 && (
              <text x={n.x + 26} y={n.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={n.idx === winner ? '#2ECC71' : 'var(--color-muted)'}>{act[k].toFixed(2)}</text>
            )}
          </g>
        ))}
      </svg>

      <div className="mt-2 grid grid-cols-3 gap-2">
        {inputs.map((v, i) => (
          <label key={i} className="flex flex-col gap-1 text-xs text-muted">
            <span>input {i + 1}: <span className="font-mono text-ink">{v.toFixed(2)}</span></span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={v}
              onChange={(e) => setInput(i, Number(e.target.value))}
              className="accent-accent"
            />
          </label>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-muted">
          Output favours <span className={cn('font-bold', winner === 0 ? 'text-success' : 'text-accent-2')}>class {winner + 1}</span> ({(outVals[winner] * 100).toFixed(0)}% activation).
        </p>
        <button type="button" onClick={restart} className="rounded-full border border-accent-2 bg-accent-2/10 px-3 py-1 text-sm font-semibold text-accent-2">
          Replay pass
        </button>
      </div>
    </div>
  )
}
