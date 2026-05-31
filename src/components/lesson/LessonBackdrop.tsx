import { useMemo } from 'react'

// A calm, focused deep-space plate for the lesson player (design.md §2 layer-1,
// mockup `2.3`). Unlike the busy hub nebula, this is deliberately quiet — a dark
// base, one soft accent glow behind the stage, faint floor ripples under it, a
// subtle starfield, and an edge vignette — so the lesson content stays the hero.
// Pure CSS (no WebGL); the lesson route is ssr:false so the deterministic stars
// can't cause a hydration mismatch.
export function LessonBackdrop({ accent = '#7c6cf0' }: { accent?: string }) {
  // Deterministic starfield as a single element's box-shadow (cheap; one node).
  const stars = useMemo(() => {
    const out: Array<string> = []
    let seed = 9
    const rnd = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      return seed / 0x7fffffff
    }
    for (let i = 0; i < 70; i++) {
      const x = Math.round(rnd() * 100)
      const y = Math.round(rnd() * 100)
      const a = (0.18 + rnd() * 0.5).toFixed(2)
      out.push(`${x}vw ${y}vh 0 0 rgba(255,255,255,${a})`)
    }
    return out.join(', ')
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base deep-space gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(125% 100% at 50% 26%, #121833 0%, #0a0e1d 52%, #05070f 100%)',
        }}
      />
      {/* starfield (one element, 70 box-shadow dots) */}
      <div
        className="absolute left-0 top-0 h-px w-px rounded-full"
        style={{ boxShadow: stars }}
      />
      {/* soft accent glow behind the stage */}
      <div
        className="absolute left-1/2 top-1/2 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ background: accent, opacity: 0.16, mixBlendMode: 'screen' }}
      />
      {/* faint floor ripples under the visual */}
      <div
        className="absolute bottom-[8%] left-1/2 h-[34vh] w-[60vw] -translate-x-1/2"
        style={{
          background: `radial-gradient(ellipse at center, ${accent}22 0%, transparent 62%)`,
          maskImage:
            'repeating-radial-gradient(ellipse at center, black 0 2px, transparent 2px 26px)',
          WebkitMaskImage:
            'repeating-radial-gradient(ellipse at center, black 0 2px, transparent 2px 26px)',
          opacity: 0.5,
        }}
      />
      {/* edge vignette to focus the centre */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 45%, transparent 56%, rgba(4,6,12,0.7) 100%)',
        }}
      />
    </div>
  )
}
