import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useState } from 'react'
import * as THREE from 'three'
import { ClientOnly } from '#/components/ClientOnly'

function PendulumModel({ L, g }: { L: number; g: number }) {
  const armRef = useRef<THREE.Group>(null)
  const tRef = useRef(0)
  const theta0 = 0.5 // ~28° amplitude (small-angle regime)

  useFrame((_state, delta) => {
    tRef.current += delta
    const omega = Math.sqrt(g / L)
    const theta = theta0 * Math.cos(omega * tRef.current)
    if (armRef.current) armRef.current.rotation.z = theta
  })

  return (
    <group position={[0, 1.7, 0]}>
      {/* pivot */}
      <mesh>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#8a93b2" />
      </mesh>
      {/* swinging arm + bob */}
      <group ref={armRef}>
        <mesh position={[0, -L / 2, 0]}>
          <cylinderGeometry args={[0.015, 0.015, L, 12]} />
          <meshStandardMaterial color="#5b6488" />
        </mesh>
        <mesh position={[0, -L, 0]}>
          <sphereGeometry args={[0.24, 32, 32]} />
          <meshStandardMaterial
            color="#4F8CFF"
            metalness={0.35}
            roughness={0.35}
            emissive="#2a2350"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    </group>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (v: number) => void
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="flex items-center justify-between text-muted">
        <span>{label}</span>
        <span className="font-mono text-ink">
          {value.toFixed(1)} {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-accent"
      />
    </label>
  )
}

export function PendulumScene() {
  const [L, setL] = useState(1.5)
  const [g, setG] = useState(9.8)
  const period = 2 * Math.PI * Math.sqrt(L / g)

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
          <Canvas camera={{ position: [0, 0.3, 4.8], fov: 50 }} dpr={[1, 2]}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 4, 5]} intensity={1.3} />
            <Suspense fallback={null}>
              <PendulumModel L={L} g={g} />
            </Suspense>
          </Canvas>
        </ClientOnly>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <Slider
          label="Length (L)"
          value={L}
          min={0.5}
          max={3}
          step={0.1}
          unit="m"
          onChange={setL}
        />
        <Slider
          label="Gravity (g)"
          value={g}
          min={1}
          max={20}
          step={0.1}
          unit="m/s²"
          onChange={setG}
        />
      </div>

      <div className="border-t border-border bg-surface-2 px-4 py-3 text-center text-sm">
        Period&nbsp; T = 2π√(L/g) ={' '}
        <span className="font-mono text-base font-semibold text-accent-2">
          {period.toFixed(2)} s
        </span>
      </div>
    </div>
  )
}
