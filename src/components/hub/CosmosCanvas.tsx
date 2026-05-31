import {
  Canvas,
  extend,
  useFrame,
  useThree,
  type ThreeElement,
} from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import vertexShader from '#/shaders/nebula.vert.glsl'
import fragmentShader from '#/shaders/nebula.frag.glsl'
import { ClientOnly } from '#/components/ClientOnly'

const MAX_ISLANDS = 8

export type HubIsland = { x: number; y: number; accent: string }

// WebGL cosmos backdrop — an animated GLSL nebula + parallax starfield that
// replaces the flat JPG (design.md layer 1, now living). Pointer parallax is
// fed in via a shared ref (uMouse); the nebula is tinted by the islands, so
// their positions + accent colours are passed in as uniform arrays.
const NebulaMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(1, 1),
    uMouse: new THREE.Vector2(0, 0),
    uReduced: 0,
    uIslandPos: Array.from({ length: MAX_ISLANDS }, () => new THREE.Vector2()),
    uIslandColor: Array.from({ length: MAX_ISLANDS }, () => new THREE.Vector3()),
    uIslandCount: 0,
  },
  vertexShader,
  fragmentShader,
)

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

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
  uIslandPos: Array<THREE.Vector2>
  uIslandColor: Array<THREE.Vector3>
  uIslandCount: number
}

function NebulaPlane({
  mouseRef,
  paused,
  islands,
}: {
  mouseRef: MouseRef
  paused: boolean
  islands: Array<HubIsland>
}) {
  const matRef = useRef<NebulaUniforms>(null)
  const { size, gl } = useThree()

  // Island positions in the shader's centred, y-up space (+ accent rgb).
  const field = useMemo(() => {
    const count = Math.min(islands.length, MAX_ISLANDS)
    const pos = Array.from({ length: MAX_ISLANDS }, () => new THREE.Vector2())
    const col = Array.from({ length: MAX_ISLANDS }, () => new THREE.Vector3())
    for (let i = 0; i < count; i++) {
      pos[i].set(islands[i].x / 100 - 0.5, 0.5 - islands[i].y / 100)
      const [r, g, b] = hexToRgb(islands[i].accent)
      col[i].set(r, g, b)
    }
    return { pos, col, count }
  }, [islands])

  useFrame((_state, delta) => {
    const m = matRef.current
    if (!m) return
    if (!paused) m.uTime += delta
    m.uReduced = paused ? 1 : 0
    const pr = gl.getPixelRatio()
    m.uResolution.set(size.width * pr, size.height * pr)
    m.uMouse.set(mouseRef.current.x, mouseRef.current.y)
    // push the island field (positions/colours are static; copy is negligible)
    for (let i = 0; i < MAX_ISLANDS; i++) {
      m.uIslandPos[i].copy(field.pos[i])
      m.uIslandColor[i].copy(field.col[i])
    }
    m.uIslandCount = field.count
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
  islands,
}: {
  mouseRef: MouseRef
  reduce: boolean
  islands: Array<HubIsland>
}) {
  return (
    <div className="absolute inset-0">
      <ClientOnly>
        <Canvas
          camera={{ position: [0, 0, 1], fov: 60 }}
          gl={{ antialias: false }}
          dpr={[1, 1.75]}
        >
          <NebulaPlane mouseRef={mouseRef} paused={reduce} islands={islands} />
        </Canvas>
      </ClientOnly>
    </div>
  )
}
