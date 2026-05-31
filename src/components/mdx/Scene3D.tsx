import { PendulumScene } from '#/components/three/PendulumScene'
import { ForceBlockScene } from '#/components/three/ForceBlockScene'
import { ProjectileScene } from '#/components/three/ProjectileScene'

// String -> component lookup so authored MDX stays declarative & serializable
// (a future mobile WebView host can map the same keys to native scenes).
const registry = {
  pendulum: PendulumScene,
  'force-block': ForceBlockScene,
  projectile: ProjectileScene,
} as const

export type SceneKey = keyof typeof registry

export function Scene3D({ component }: { component: SceneKey }) {
  const Cmp = registry[component]
  if (!Cmp) {
    return (
      <div className="rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm">
        Unknown 3D scene: <code>{component}</code>
      </div>
    )
  }
  return <Cmp />
}
