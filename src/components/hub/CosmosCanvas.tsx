import {
  Canvas,
  extend,
  useFrame,
  useThree,
  type ThreeElement,
} from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import vertexShader from '#/shaders/nebula.vert.glsl'
import fragmentShader from '#/shaders/nebula.frag.glsl'
import { ClientOnly } from '#/components/ClientOnly'

// WebGL cosmos backdrop — an animated GLSL nebula + parallax starfield that
// replaces the flat JPG (design.md layer 1, now living). Pointer parallax is
// fed in via a shared ref (uMouse) so it stays in sync with the DOM islands.
const NebulaMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(1, 1),
    uMouse: new THREE.Vector2(0, 0),
    uReduced: 0,
  },
  vertexShader,
  fragmentShader,
)

extend({ NebulaMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    nebulaMaterial: ThreeElement<typeof NebulaMaterial>
  }
}

type MouseRef = { current: { x: number; y: number } }

type NebulaUniforms = THREE.ShaderMaterial & {
  uTime: number
  uResolution: THREE.Vector2
  uMouse: THREE.Vector2
  uReduced: number
}

function NebulaPlane({
  mouseRef,
  paused,
}: {
  mouseRef: MouseRef
  paused: boolean
}) {
  const matRef = useRef<NebulaUniforms>(null)
  const { size, gl } = useThree()
  useFrame((_state, delta) => {
    const m = matRef.current
    if (!m) return
    if (!paused) m.uTime += delta
    m.uReduced = paused ? 1 : 0
    const pr = gl.getPixelRatio()
    m.uResolution.set(size.width * pr, size.height * pr)
    m.uMouse.set(mouseRef.current.x, mouseRef.current.y)
  })
  return (
    // Over-scaled plane just needs to cover the frame; the shader maps pixels
    // via gl_FragCoord, so the exact size doesn't matter.
    <mesh scale={[40, 24, 1]}>
      <planeGeometry args={[1, 1]} />
      <nebulaMaterial ref={matRef} />
    </mesh>
  )
}

/** Full-bleed animated WebGL nebula. Place as the bottom layer of a `relative` stage. */
export function CosmosCanvas({
  mouseRef,
  reduce,
}: {
  mouseRef: MouseRef
  reduce: boolean
}) {
  return (
    <div className="absolute inset-0">
      <ClientOnly>
        <Canvas
          camera={{ position: [0, 0, 1], fov: 60 }}
          gl={{ antialias: false }}
          dpr={[1, 1.75]}
        >
          <NebulaPlane mouseRef={mouseRef} paused={reduce} />
        </Canvas>
      </ClientOnly>
    </div>
  )
}
