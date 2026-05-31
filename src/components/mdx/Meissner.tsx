import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const TC = 90 // critical temperature (K)
const MAG_CX = 180
const MAG_W = 84
const MAG_H = 26
const SLAB_TOP = 178

// Cool certain materials below a critical temperature and their electrical resistance
// vanishes completely — and they expel magnetic fields from their interior (the Meissner
// effect). The expelled field acts like a cushion, so a magnet floats. Drag the temperature
// across Tc and watch it lift off.
export function Meissner() {
  const [temp, setTemp] = useState(40)
  const sc = temp < TC // superconducting?
  const lift = sc ? Math.min(58, ((TC - temp) / TC) * 74) : 0
  const magTop = SLAB_TOP - MAG_H - lift
  const magBot = magTop + MAG_H
  const magL = MAG_CX - MAG_W / 2
  const magR = MAG_CX + MAG_W / 2

  const groupRef = useRef<SVGGElement | null>(null)
  const scRef = useRef(sc)
  useEffect(() => { scRef.current = sc }, [sc])

  // gentle bob while floating
  useEffect(() => {
    let raf = 0
    const loop = (now: number) => {
      const bob = scRef.current ? Math.sin(now * 0.0024) * 2.4 : 0
      groupRef.current?.setAttribute('transform', `translate(0 ${bob.toFixed(2)})`)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const arch = (h: number) =>
    `M ${magL + 10} ${magTop + MAG_H / 2} Q ${MAG_CX} ${magTop - h} ${magR - 10} ${magTop + MAG_H / 2}`

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 240" className="w-full">
        {/* cold vapour hint when superconducting */}
        {sc && <rect x="0" y="0" width="360" height="240" fill="#74b9ff" opacity="0.05" />}

        {/* field lines below the magnet */}
        {sc
          ? [-1.4, -0.5, 0.5, 1.4].map((k, i) => {
              const sx = MAG_CX + k * 16
              const sign = k < 0 ? -1 : 1
              return (
                <path
                  key={i}
                  d={`M ${sx} ${magBot} C ${sx} ${magBot + 18} ${sx + sign * 34} ${SLAB_TOP - 8} ${sx + sign * 50} ${SLAB_TOP - 3}`}
                  fill="none"
                  stroke="#00cec9"
                  strokeWidth="1.5"
                  opacity="0.8"
                />
              )
            })
          : [-1.4, -0.5, 0.5, 1.4].map((k, i) => {
              const sx = MAG_CX + k * 16
              return <line key={i} x1={sx} y1={magBot} x2={sx} y2={SLAB_TOP + 30} stroke="var(--color-muted)" strokeWidth="1.5" opacity="0.55" />
            })}

        {/* the superconductor slab */}
        <rect x="92" y={SLAB_TOP} width="176" height="34" rx="6" fill={sc ? '#0e2a3a' : 'var(--color-surface-2)'} stroke={sc ? '#00cec9' : 'var(--color-border)'} strokeWidth="2" />
        {sc && <rect x="92" y={SLAB_TOP} width="176" height="5" rx="2.5" fill="#00cec9" opacity="0.6" />}
        <text x="180" y={SLAB_TOP + 50} textAnchor="middle" fontSize="11" fill="var(--color-muted)">superconductor</text>

        {/* magnet + its field arches (bobbing group) */}
        <g ref={groupRef}>
          {[24, 40, 56].map((h) => (
            <path key={h} d={arch(h)} fill="none" stroke="#fab1a0" strokeWidth="1.2" opacity="0.6" />
          ))}
          <rect x={magL} y={magTop} width={MAG_W / 2} height={MAG_H} rx="3" fill="#d63031" />
          <rect x={MAG_CX} y={magTop} width={MAG_W / 2} height={MAG_H} rx="3" fill="#0984e3" />
          <text x={magL + MAG_W / 4} y={magTop + MAG_H / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">N</text>
          <text x={MAG_CX + MAG_W / 4} y={magTop + MAG_H / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">S</text>
        </g>

        {sc && <text x="180" y="28" textAnchor="middle" fontSize="11" fill="#00cec9">field expelled — the magnet floats</text>}
      </svg>

      <div className="px-4 pt-1">
        <SceneSlider label="Temperature" value={temp} min={4} max={150} step={2} unit="K" onChange={setTemp} />
        <p className="mt-2 pb-4 text-center text-sm text-muted">
          {sc ? (
            <span className="font-semibold text-[#00cec9]">Below Tc ≈ {TC} K: zero resistance, field expelled, magnet levitating.</span>
          ) : (
            <>Above Tc ≈ {TC} K: an ordinary material. Field passes straight through and the magnet just sits there.</>
          )}
        </p>
      </div>
    </div>
  )
}
