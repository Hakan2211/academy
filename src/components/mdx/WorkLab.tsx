import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// Work = Force × Distance. A block is pushed by a constant force over a chosen
// distance; the readout and the shaded force-vs-distance rectangle both update
// so "work is the area under the force" lands visually. Only the slide is
// animated (rAF); the graph is plain React driven by the sliders.
export function WorkLab() {
  const [force, setForce] = useState(8) // N
  const [distance, setDistance] = useState(6) // m

  const groupRef = useRef<SVGGElement>(null)
  const trackScale = 22 // px per metre along the track

  useEffect(() => {
    let raf = 0
    let start = 0
    const move = 1800
    const pause = 900
    const cycle = move + pause

    const loop = (now: number) => {
      if (!start) start = now
      const t = (now - start) % cycle
      const p = t < move ? t / move : 1 // ease-free; 0→1 then hold
      const tx = p * distance * trackScale
      groupRef.current?.setAttribute('transform', `translate(${tx} 0)`)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [distance])

  const work = force * distance

  // force-vs-distance graph geometry
  const gx = 60
  const gy = 250
  const sX = 22 // px per metre
  const sY = 8 // px per newton
  const rectW = distance * sX
  const rectH = force * sY

  const arrowLen = force * 7 + 6
  const blockX = 36
  const blockW = 30

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 480 270" className="w-full">
        {/* ground track */}
        <line x1="30" y1="116" x2="450" y2="116" stroke="var(--color-border)" strokeWidth="3" />
        {/* faint start marker */}
        <line x1={blockX} y1="70" x2={blockX} y2="116" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 3" />

        {/* block + force arrow, translated together as it slides */}
        <g ref={groupRef}>
          <rect x={blockX} y="86" width={blockW} height="30" rx="5" fill="var(--color-accent)" />
          <line
            x1={blockX + blockW}
            y1="101"
            x2={blockX + blockW + arrowLen}
            y2="101"
            stroke="#fdcb6e"
            strokeWidth="5"
          />
          <polygon
            points={`${blockX + blockW + arrowLen},101 ${blockX + blockW + arrowLen - 10},95 ${blockX + blockW + arrowLen - 10},107`}
            fill="#fdcb6e"
          />
          <text x={blockX + blockW + arrowLen / 2} y="84" fill="#fdcb6e" fontSize="12" textAnchor="middle">
            {force} N
          </text>
        </g>

        {/* force-vs-distance graph: area = work */}
        <line x1={gx} y1={gy} x2={gx + 250} y2={gy} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={gx} y1={gy} x2={gx} y2={gy - 170} stroke="var(--color-border)" strokeWidth="2" />
        <text x={gx + 250} y={gy + 16} fill="var(--color-muted)" fontSize="11" textAnchor="end">
          distance →
        </text>
        <text x={gx - 6} y={gy - 168} fill="var(--color-muted)" fontSize="11" textAnchor="end">
          force
        </text>
        <rect
          x={gx}
          y={gy - rectH}
          width={rectW}
          height={rectH}
          fill="var(--color-accent)"
          opacity="0.25"
        />
        <rect
          x={gx}
          y={gy - rectH}
          width={rectW}
          height={rectH}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        <text x={gx + rectW / 2} y={gy - rectH / 2 + 4} fill="var(--color-ink)" fontSize="12" textAnchor="middle">
          W = {work} J
        </text>
      </svg>

      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <SceneSlider label="Force" value={force} min={0} max={20} step={1} unit="N" onChange={setForce} />
        <SceneSlider label="Distance" value={distance} min={0} max={10} step={1} unit="m" onChange={setDistance} />
      </div>
      <p className="px-4 pb-4 text-center text-sm">
        <span className="font-mono">W = F × d = {force} N × {distance} m = </span>
        <span className="font-semibold text-accent">{work} J</span>
      </p>
    </div>
  )
}
