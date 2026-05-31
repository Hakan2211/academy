import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { Suspense, useRef, useState } from 'react'
import * as THREE from 'three'
import { ClientOnly } from '#/components/ClientOnly'
import { SceneSlider } from './SceneSlider'

const G = 9.8
const SCALE = 0.06 // world units per metre of range/height
const VSCALE = 0.06 // world units per (m/s) for the component arrows

// A launched ball tracing a parabola. The horizontal velocity (teal arrow) is
// constant; the vertical velocity (blue arrow) shrinks, flips, and grows —
// which is the whole point of decomposing projectile motion into two
// independent 1-D problems.
function ProjectileModel({
  angleDeg,
  speed,
}: {
  angleDeg: number
  speed: number
}) {
  const angle = (angleDeg * Math.PI) / 180
  const vx = speed * Math.cos(angle)
  const vy0 = speed * Math.sin(angle)
  const flight = (2 * vy0) / G
  const range = vx * flight
  const x0 = -(range * SCALE) / 2

  // Static trajectory polyline (cheap; recomputed only when sliders change).
  const points: Array<[number, number, number]> = []
  const N = 48
  for (let i = 0; i <= N; i++) {
    const t = (flight * i) / N
    points.push([
      x0 + vx * t * SCALE,
      (vy0 * t - 0.5 * G * t * t) * SCALE,
      0,
    ])
  }

  const ballRef = useRef<THREE.Group>(null)
  const hArrowRef = useRef<THREE.Mesh>(null)
  const vArrowRef = useRef<THREE.Mesh>(null)
  const tRef = useRef(0)

  useFrame((_state, delta) => {
    tRef.current += delta
    if (tRef.current > flight) tRef.current = 0
    const t = tRef.current
    const x = x0 + vx * t * SCALE
    const y = (vy0 * t - 0.5 * G * t * t) * SCALE
    if (ballRef.current) ballRef.current.position.set(x, y, 0)

    const vy = vy0 - G * t
    if (hArrowRef.current) {
      const len = Math.max(0.001, vx * VSCALE)
      hArrowRef.current.scale.set(len, 1, 1)
      hArrowRef.current.position.set(len / 2, 0, 0)
    }
    if (vArrowRef.current) {
      const len = Math.max(0.001, Math.abs(vy) * VSCALE)
      const sign = vy >= 0 ? 1 : -1
      vArrowRef.current.scale.set(1, len, 1)
      vArrowRef.current.position.set(0, (sign * len) / 2, 0)
    }
  })

  return (
    <group position={[0, -0.8, 0]}>
      {/* ground */}
      <Line
        points={[
          [-3.2, 0, 0],
          [3.2, 0, 0],
        ]}
        color="#2f3650"
        lineWidth={2}
      />
      {/* trajectory */}
      <Line points={points} color="#8a93b2" lineWidth={2} />
      {/* launch point */}
      <mesh position={[x0, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#5b6488" />
      </mesh>
      {/* the ball + its velocity components */}
      <group ref={ballRef}>
        <mesh>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial
            color="#fdcb6e"
            emissive="#7a5a10"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh ref={hArrowRef}>
          <boxGeometry args={[1, 0.05, 0.05]} />
          <meshStandardMaterial color="#00cec9" emissive="#00cec9" emissiveIntensity={0.4} />
        </mesh>
        <mesh ref={vArrowRef}>
          <boxGeometry args={[0.05, 1, 0.05]} />
          <meshStandardMaterial color="#74b9ff" emissive="#74b9ff" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </group>
  )
}

export function ProjectileScene() {
  const [angle, setAngle] = useState(45)
  const [speed, setSpeed] = useState(18)

  const rad = (angle * Math.PI) / 180
  const flight = (2 * speed * Math.sin(rad)) / G
  const range = speed * Math.cos(rad) * flight
  const maxHeight = (speed * Math.sin(rad)) ** 2 / (2 * G)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="h-72 w-full bg-[#0d1326]">
        <ClientOnly
          fallback={
            <div className="flex h-full items-center justify-center text-muted">
              Loading 3D scene…
            </div>
          }
        >
          <Canvas camera={{ position: [0, 0.4, 6], fov: 50 }} dpr={[1, 2]}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 4, 5]} intensity={1.3} />
            <Suspense fallback={null}>
              <ProjectileModel angleDeg={angle} speed={speed} />
            </Suspense>
          </Canvas>
        </ClientOnly>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <SceneSlider
          label="Launch angle"
          value={angle}
          min={10}
          max={80}
          step={1}
          unit="°"
          onChange={setAngle}
        />
        <SceneSlider
          label="Initial speed"
          value={speed}
          min={5}
          max={25}
          step={1}
          unit="m/s"
          onChange={setSpeed}
        />
      </div>

      <div className="grid grid-cols-3 divide-x divide-border border-t border-border bg-surface-2 text-center text-sm">
        <div className="px-2 py-3">
          <div className="text-muted">Range</div>
          <div className="font-mono font-semibold text-accent-2">
            {range.toFixed(1)} m
          </div>
        </div>
        <div className="px-2 py-3">
          <div className="text-muted">Max height</div>
          <div className="font-mono font-semibold text-accent-2">
            {maxHeight.toFixed(1)} m
          </div>
        </div>
        <div className="px-2 py-3">
          <div className="text-muted">Flight time</div>
          <div className="font-mono font-semibold text-accent-2">
            {flight.toFixed(1)} s
          </div>
        </div>
      </div>
    </div>
  )
}
