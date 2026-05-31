import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useState } from 'react'
import * as THREE from 'three'
import { ClientOnly } from '#/components/ClientOnly'
import { SceneSlider } from './SceneSlider'

// A block pushed by a constant force F across a frictionless surface. It starts
// from rest and accelerates at a = F/m: x = Â½ a tÂ². When it slides off the
// right, the run resets so the loop reads as "stronger force / lighter block =
// quicker pickup."
function BlockModel({ a }: { a: number }) {
  const ref = useRef<THREE.Group>(null)
  const tRef = useRef(0)
  const startX = -2.3
  const maxX = 2.3
  const SCALE = 0.12 // visual metres-per-(m/sÂ²Â·sÂ²) so the motion reads well

  useFrame((_state, delta) => {
    tRef.current += delta
    let x = startX + 0.5 * a * tRef.current * tRef.current * SCALE
    if (x > maxX) {
      tRef.current = 0
      x = startX
    }
    if (ref.current) ref.current.position.x = x
  })

  return (
    <group>
      {/* ground */}
      <mesh position={[0, -0.55, 0]} receiveShadow>
        <boxGeometry args={[6, 0.1, 1.4]} />
        <meshStandardMaterial color="#1b2236" />
      </mesh>
      <group ref={ref} position={[startX, 0, 0]}>
        {/* the block */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial
            color="#4F8CFF"
            metalness={0.3}
            roughness={0.4}
            emissive="#2a2350"
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* force arrow: a red shaft + head on the left, pushing right */}
        <mesh position={[-0.75, 0, 0]}>
          <boxGeometry args={[0.5, 0.12, 0.12]} />
          <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[-0.45, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.14, 0.28, 16]} />
          <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </group>
  )
}

export function ForceBlockScene() {
  const [F, setF] = useState(10)
  const [m, setM] = useState(2)
  const a = F / m

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="h-72 w-full bg-[#0d1326]">
        <ClientOnly
          fallback={
            <div className="flex h-full items-center justify-center text-muted">
              Loading 3D sceneâ€¦
            </div>
          }
        >
          <Canvas camera={{ position: [0, 0.8, 5], fov: 50 }} dpr={[1, 2]}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 4, 5]} intensity={1.3} />
            <Suspense fallback={null}>
              <BlockModel a={a} />
            </Suspense>
          </Canvas>
        </ClientOnly>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <SceneSlider
          label="Force (F)"
          value={F}
          min={1}
          max={20}
          step={0.5}
          unit="N"
          onChange={setF}
        />
        <SceneSlider
          label="Mass (m)"
          value={m}
          min={1}
          max={10}
          step={0.5}
          unit="kg"
          onChange={setM}
        />
      </div>

      <div className="border-t border-border bg-surface-2 px-4 py-3 text-center text-sm">
        Acceleration&nbsp; a = F/m ={' '}
        <span className="font-mono text-base font-semibold text-accent-2">
          {a.toFixed(2)} m/sÂ²
        </span>
      </div>
    </div>
  )
}
