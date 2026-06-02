import { useState } from 'react'
import { cn } from '#/lib/cn'

// A network is simply a set of devices wired so they can pass messages. HOW you
// wire them changes everything: a star is cheap but dies if the hub fails; a
// mesh survives almost anything but costs a fortune in cables. Zoom out far
// enough and the internet itself is just a mesh of smaller networks — a network
// of networks. Switch layout and click a node to see the trade-off.

type Topo = 'star' | 'mesh' | 'ring' | 'wan'

type Node = { x: number; y: number; label: string; hub?: boolean; cloud?: boolean }

const LAYOUTS: Record<Topo, { nodes: Array<Node>; links: Array<[number, number]> }> = {
  star: {
    nodes: [
      { x: 180, y: 95, label: 'Hub', hub: true },
      { x: 180, y: 30, label: 'PC' },
      { x: 250, y: 70, label: 'PC' },
      { x: 250, y: 130, label: 'PC' },
      { x: 110, y: 130, label: 'PC' },
      { x: 110, y: 70, label: 'PC' },
    ],
    links: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5]],
  },
  mesh: {
    nodes: [
      { x: 180, y: 28, label: 'A' },
      { x: 258, y: 78, label: 'B' },
      { x: 230, y: 150, label: 'C' },
      { x: 130, y: 150, label: 'D' },
      { x: 102, y: 78, label: 'E' },
    ],
    links: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]],
  },
  ring: {
    nodes: [
      { x: 180, y: 28, label: 'A' },
      { x: 258, y: 78, label: 'B' },
      { x: 230, y: 150, label: 'C' },
      { x: 130, y: 150, label: 'D' },
      { x: 102, y: 78, label: 'E' },
    ],
    links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]],
  },
  wan: {
    nodes: [
      { x: 70, y: 95, label: 'LAN', cloud: true },
      { x: 180, y: 50, label: 'ISP', cloud: true },
      { x: 290, y: 95, label: 'LAN', cloud: true },
      { x: 180, y: 150, label: 'LAN', cloud: true },
    ],
    links: [[0, 1], [1, 2], [1, 3], [0, 3], [2, 3]],
  },
}

const INFO: Record<Topo, { name: string; pro: string; con: string }> = {
  star: {
    name: 'Star',
    pro: 'Simple and cheap — every device plugs into one central hub or switch.',
    con: 'The hub is a single point of failure: kill it and the whole network drops.',
  },
  mesh: {
    name: 'Mesh',
    pro: 'Extremely resilient — many redundant paths, so traffic just reroutes around a break.',
    con: 'Costly and complex: the number of links explodes as you add devices.',
  },
  ring: {
    name: 'Ring',
    pro: 'Predictable — data passes node to node around the loop, with no central bottleneck.',
    con: 'One broken link can split the ring unless a second backup loop is added.',
  },
  wan: {
    name: 'LAN vs WAN',
    pro: 'Each LAN is a small local network; linking many LANs over long distances makes a WAN.',
    con: 'The internet is the ultimate WAN — a network OF networks, owned by no one.',
  },
}

export function NetworkTopology() {
  const [topo, setTopo] = useState<Topo>('star')
  const [sel, setSel] = useState<number | null>(null)
  const layout = LAYOUTS[topo]
  const info = INFO[topo]

  function pick(t: Topo) {
    setTopo(t)
    setSel(null)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {(['star', 'mesh', 'ring', 'wan'] as Array<Topo>).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => pick(t)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              topo === t ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {INFO[t].name}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 180" className="w-full">
        {layout.links.map(([a, b], i) => {
          const na = layout.nodes[a]
          const nb = layout.nodes[b]
          const lit = sel === a || sel === b
          return (
            <line
              key={i}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke={lit ? 'var(--color-accent)' : 'var(--color-border)'}
              strokeWidth={lit ? 3 : 2}
            />
          )
        })}
        {layout.nodes.map((n, i) => {
          const active = sel === i
          const color = n.hub ? '#FFC83D' : n.cloud ? '#5B6CFF' : 'var(--color-accent-2)'
          return (
            <g key={i} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
              {n.cloud ? (
                <rect x={n.x - 26} y={n.y - 16} width="52" height="32" rx="14" fill="var(--color-surface-2)" stroke={active ? 'var(--color-accent)' : color} strokeWidth={active ? 3 : 2} />
              ) : (
                <circle cx={n.x} cy={n.y} r={n.hub ? 18 : 14} fill="var(--color-surface-2)" stroke={active ? 'var(--color-accent)' : color} strokeWidth={active ? 3 : 2} />
              )}
              <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={n.cloud ? 11 : 10} fontWeight="700" fill={active ? 'var(--color-accent)' : color}>
                {n.label}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="border-t border-border p-4">
        <div className="text-sm font-semibold text-ink">{info.name}</div>
        <p className="mt-1 text-sm text-success">+ {info.pro}</p>
        <p className="mt-1 text-sm text-warn">− {info.con}</p>
        <p className="mt-2 text-xs text-muted">
          A network is just <span className="text-ink">connected devices that pass messages</span>. Click any node to highlight its links.
        </p>
      </div>
    </div>
  )
}
