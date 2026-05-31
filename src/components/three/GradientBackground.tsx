import {
  Canvas,
  extend,
  useFrame,
  type ThreeElement,
} from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import vertexShader from '#/shaders/gradient.vert.glsl'
import fragmentShader from '#/shaders/gradient.frag.glsl'
import { ClientOnly } from '#/components/ClientOnly'

// Custom GLSL material via drei's shaderMaterial helper + R3F extend().
const GradientMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorA: new THREE.Color('#10182f'),
    uColorB: new THREE.Color('#6c5ce7'),
  },
  vertexShader,
  fragmentShader,
)

extend({ GradientMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    gradientMaterial: ThreeElement<typeof GradientMaterial>
  }
}

function GradientPlane() {
  const matRef = useRef<THREE.ShaderMaterial & { uTime: number }>(null)
  useFrame((_state, delta) => {
    if (matRef.current) matRef.current.uTime += delta
  })
  return (
    <mesh scale={[12, 8, 1]}>
      <planeGeometry args={[1, 1]} />
      {/* @ts-expect-error custom shaderMaterial element */}
      <gradientMaterial ref={matRef} />
    </mesh>
  )
}

/** Decorative animated GLSL gradient. Place inside a `relative` container. */
export function GradientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <ClientOnly>
        <Canvas camera={{ position: [0, 0, 1], fov: 60 }} gl={{ antialias: false }}>
          <GradientPlane />
        </Canvas>
      </ClientOnly>
    </div>
  )
}
