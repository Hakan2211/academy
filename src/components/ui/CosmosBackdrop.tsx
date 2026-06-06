import { useEffect, useRef } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { useReducedMotion } from 'motion/react'
import { CosmosCanvas } from '#/components/hub/CosmosCanvas'
import type { HubIsland } from '#/components/hub/CosmosCanvas'

// The single, persistent "main universe" behind the whole app (mockups 1B/1.5B:
// one living cosmos under every screen). Mounted once in __root and never
// unmounts, so navigating between routes doesn't reload the WebGL or reset the
// stars — the HUD, rail and every page float over the same scene. Tinted by the
// six subject accents (kept in sync with SubjectsHub's LAYOUT) so it reads as
// the hub's universe everywhere. The immersive lesson player opts out (it has
// its own calm CSS backdrop), so this returns null on /learn.
// (Positions/accents kept in sync with SubjectsHub's LAYOUT — nine worlds.)
const SUBJECT_ISLANDS: Array<HubIsland> = [
  { x: 50, y: 13, accent: '#FDCB6E' }, // chemistry
  { x: 25, y: 21, accent: '#2ecc71' }, // biology
  { x: 75, y: 21, accent: '#74B9FF' }, // math
  { x: 13, y: 47, accent: '#C9A24B' }, // philosophy
  { x: 87, y: 47, accent: '#10B981' }, // economics
  { x: 23, y: 77, accent: '#00d2d3' }, // computer-science
  { x: 77, y: 77, accent: '#E84393' }, // psychology
  { x: 50, y: 85, accent: '#FF5470' }, // health
  { x: 50, y: 52, accent: '#4F8CFF' }, // physics (hero, front-centre)
]

export function CosmosBackdrop() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const reduce = useReducedMotion()
  const mouseRef = useRef({ x: 0, y: 0 })

  // Window-wide pointer parallax feeding the nebula (uMouse). Owned here once,
  // so individual routes no longer manage their own cosmos parallax.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const tick = () => {
      cx += (tx - cx) * 0.05
      cy += (ty - cy) * 0.05
      mouseRef.current.x = cx
      mouseRef.current.y = cy
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (pathname.startsWith('/learn')) return null

  // The island hub (`/`) is the showcase and keeps the vivid, undimmed nebula.
  // Every other route is a text-heavy content page, so it gets a readability
  // scrim that tames the bright nebula midtones — without it, muted text (page
  // subtitles, stat captions) washes out where the cosmos is light.
  const isHub = pathname === '/'

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden
      style={{ background: '#070a16' }}
    >
      <CosmosCanvas mouseRef={mouseRef} reduce={Boolean(reduce)} islands={SUBJECT_ISLANDS} />
      {/* global depth vignette so floating chrome + content read against the nebula */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(135% 100% at 50% 28%, transparent 56%, rgba(5,7,16,0.72) 100%)',
        }}
      />
      {/* content-route readability scrim (slightly stronger up top, where the
          page header + subtitle sit). Hub stays bright. */}
      {!isHub && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(6,9,20,0.62) 0%, rgba(6,9,20,0.5) 100%)',
          }}
        />
      )}
    </div>
  )
}
