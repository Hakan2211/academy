// Code-rendered "deep space" backdrop for the Physics overworld — a low-contrast
// star field, a couple of constellation lines, and a soft nebula wash. Fully
// deterministic (a sin-hash, never Math.random) so SSR and client render the
// same nodes (no hydration mismatch). Art drop-in can replace this later; for
// now it's the sanctioned code fallback. Parallax is deferred polish.

const VB_W = 1000
const VB_H = 1600

// Hash → [0,1). Deterministic, stable across SSR/CSR.
function rnd(seed: number): number {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

type Star = { x: number; y: number; r: number; o: number }

function buildLayer(
  count: number,
  base: number,
  rMin: number,
  rMax: number,
  oMin: number,
  oMax: number,
): Array<Star> {
  const out: Array<Star> = []
  for (let i = 0; i < count; i++) {
    out.push({
      x: rnd(base + i * 2.17) * VB_W,
      y: rnd(base + i * 3.91 + 1) * VB_H,
      r: rMin + rnd(base + i * 1.27 + 2) * (rMax - rMin),
      o: oMin + rnd(base + i * 0.73 + 3) * (oMax - oMin),
    })
  }
  return out
}

// Computed once at module load (deterministic) — same on server and client.
const FAR = buildLayer(70, 11, 0.6, 1.5, 0.1, 0.32)
const MID = buildLayer(34, 53, 1.0, 2.2, 0.25, 0.55)
const NEAR = buildLayer(14, 97, 1.6, 3.0, 0.45, 0.85)

// A couple of hand-placed constellations so the field reads as intentional.
const CONSTELLATIONS: Array<Array<[number, number]>> = [
  [
    [140, 250],
    [220, 330],
    [300, 300],
    [360, 400],
    [300, 300],
    [340, 210],
  ],
  [
    [760, 980],
    [830, 1040],
    [880, 980],
    [840, 1120],
    [880, 980],
    [950, 940],
  ],
]

export function SpaceBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="neb-a" cx="20%" cy="12%" r="55%">
            <stop offset="0%" stopColor="#6C5CE7" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#6C5CE7" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="neb-b" cx="82%" cy="88%" r="55%">
            <stop offset="0%" stopColor="#74B9FF" stopOpacity="0.13" />
            <stop offset="100%" stopColor="#74B9FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#neb-a)" />
        <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#neb-b)" />

        {/* constellation lines + their vertices */}
        <g stroke="#9aa6d6" strokeOpacity="0.18" strokeWidth="1" fill="none">
          {CONSTELLATIONS.map((pts, ci) => (
            <polyline
              key={ci}
              points={pts.map(([x, y]) => `${x},${y}`).join(' ')}
            />
          ))}
        </g>
        <g fill="#cdd6f4" fillOpacity="0.5">
          {CONSTELLATIONS.flat().map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.6} />
          ))}
        </g>

        {/* star layers, far → near */}
        <g fill="#c7d2fe">
          {FAR.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fillOpacity={s.o} />
          ))}
        </g>
        <g fill="#dbe4ff">
          {MID.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fillOpacity={s.o} />
          ))}
        </g>
        <g fill="#ffffff">
          {NEAR.map((s, i) => (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fillOpacity={s.o}
              className={i % 3 === 0 ? 'animate-pulse' : undefined}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
