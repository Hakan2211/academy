import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { OrbStation } from './OrbStation'
import type { OrbState } from './OrbStation'
import { Icon } from './Icon'
import { cn } from '#/lib/cn'

export type OverworldUnit = {
  slug: string
  name: string
  icon?: string
  accentColor?: string
  done: number
  total: number
}

type Pt = { x: number; y: number; scale: number }

// Per-category planet/orb art (the §3.3 station planets) → used as the orb face.
// Keyed by unit slug so it's order-independent; a missing slug falls back to a
// procedural orb. (The §7a medal coins are separate — they live the reward role
// on `/badges`, not here.)
const ORB_IMAGE: Record<string, string> = {
  'scientific-working': '/orbs/physics/scientific-working.png',
  energy: '/orbs/physics/energy.png',
  'forces-and-motion': '/orbs/physics/forces-and-motion.png',
  oscillations: '/orbs/physics/oscillations.png',
  'light-and-optics': '/orbs/physics/light-and-optics.png',
  electricity: '/orbs/physics/electricity.png',
  magnetism: '/orbs/physics/magnetism.png',
  matter: '/orbs/physics/matter.png',
  'atoms-and-quantum': '/orbs/physics/atoms-and-quantum.png',
  relativity: '/orbs/physics/relativity.png',
  astronomy: '/orbs/physics/astronomy.png',
  frontiers: '/orbs/physics/frontiers.png',
  // Biology (14 worlds) — slugs are distinct from physics, so one flat map is safe.
  'study-of-life': '/orbs/biology/study-of-life.png',
  'the-cell': '/orbs/biology/the-cell.png',
  'membranes-and-transport': '/orbs/biology/membranes-and-transport.png',
  'molecules-of-life': '/orbs/biology/molecules-of-life.png',
  'energy-and-enzymes': '/orbs/biology/energy-and-enzymes.png',
  'dna-and-the-code': '/orbs/biology/dna-and-the-code.png',
  'division-and-inheritance': '/orbs/biology/division-and-inheritance.png',
  evolution: '/orbs/biology/evolution.png',
  'body-fuel-and-transport': '/orbs/biology/body-fuel-and-transport.png',
  'body-control': '/orbs/biology/body-control.png',
  'reproduction-and-development': '/orbs/biology/reproduction-and-development.png',
  plants: '/orbs/biology/plants.png',
  'microbes-and-immunity': '/orbs/biology/microbes-and-immunity.png',
  ecology: '/orbs/biology/ecology.png',
  // Chemistry (14 worlds) — slugs are distinct from physics/biology.
  'matter-basics': '/orbs/chemistry/matter-basics.png',
  atoms: '/orbs/chemistry/atoms.png',
  'periodic-table': '/orbs/chemistry/periodic-table.png',
  bonding: '/orbs/chemistry/bonding.png',
  mole: '/orbs/chemistry/mole.png',
  reactions: '/orbs/chemistry/reactions.png',
  gases: '/orbs/chemistry/gases.png',
  solutions: '/orbs/chemistry/solutions.png',
  'acids-and-bases': '/orbs/chemistry/acids-and-bases.png',
  thermochemistry: '/orbs/chemistry/thermochemistry.png',
  equilibrium: '/orbs/chemistry/equilibrium.png',
  electrochemistry: '/orbs/chemistry/electrochemistry.png',
  organic: '/orbs/chemistry/organic.png',
  biochemistry: '/orbs/chemistry/biochemistry.png',
  // Math (18 worlds) — slugs are distinct from the science subjects.
  'number-sense': '/orbs/math/number-sense.png',
  'factors-and-primes': '/orbs/math/factors-and-primes.png',
  fractions: '/orbs/math/fractions.png',
  'ratio-proportion': '/orbs/math/ratio-proportion.png',
  'powers-and-roots': '/orbs/math/powers-and-roots.png',
  'algebra-basics': '/orbs/math/algebra-basics.png',
  equations: '/orbs/math/equations.png',
  quadratics: '/orbs/math/quadratics.png',
  'functions-and-graphs': '/orbs/math/functions-and-graphs.png',
  sequences: '/orbs/math/sequences.png',
  'angles-and-shapes': '/orbs/math/angles-and-shapes.png',
  measurement: '/orbs/math/measurement.png',
  geometry: '/orbs/math/geometry.png',
  trigonometry: '/orbs/math/trigonometry.png',
  probability: '/orbs/math/probability.png',
  statistics: '/orbs/math/statistics.png',
  calculus: '/orbs/math/calculus.png',
  'the-infinite': '/orbs/math/the-infinite.png',
  // Computer Science (16 worlds).
  foundations: '/orbs/computer-science/foundations.png',
  'data-representation': '/orbs/computer-science/data-representation.png',
  'boolean-logic': '/orbs/computer-science/boolean-logic.png',
  'computer-architecture': '/orbs/computer-science/computer-architecture.png',
  algorithms: '/orbs/computer-science/algorithms.png',
  'data-structures': '/orbs/computer-science/data-structures.png',
  programming: '/orbs/computer-science/programming.png',
  'software-engineering': '/orbs/computer-science/software-engineering.png',
  'operating-systems': '/orbs/computer-science/operating-systems.png',
  networking: '/orbs/computer-science/networking.png',
  'the-web': '/orbs/computer-science/the-web.png',
  databases: '/orbs/computer-science/databases.png',
  cybersecurity: '/orbs/computer-science/cybersecurity.png',
  'computer-graphics': '/orbs/computer-science/computer-graphics.png',
  'artificial-intelligence': '/orbs/computer-science/artificial-intelligence.png',
  'theory-of-computation': '/orbs/computer-science/theory-of-computation.png',
  // Psychology (17 worlds).
  'what-is-psychology': '/orbs/psychology/what-is-psychology.png',
  'research-methods': '/orbs/psychology/research-methods.png',
  'brain-and-behavior': '/orbs/psychology/brain-and-behavior.png',
  'sensation-and-perception': '/orbs/psychology/sensation-and-perception.png',
  consciousness: '/orbs/psychology/consciousness.png',
  learning: '/orbs/psychology/learning.png',
  memory: '/orbs/psychology/memory.png',
  'language-and-thought': '/orbs/psychology/language-and-thought.png',
  intelligence: '/orbs/psychology/intelligence.png',
  'lifespan-development': '/orbs/psychology/lifespan-development.png',
  'motivation-and-emotion': '/orbs/psychology/motivation-and-emotion.png',
  'stress-and-health': '/orbs/psychology/stress-and-health.png',
  personality: '/orbs/psychology/personality.png',
  'psychological-disorders': '/orbs/psychology/psychological-disorders.png',
  psychotherapy: '/orbs/psychology/psychotherapy.png',
  'social-psychology': '/orbs/psychology/social-psychology.png',
  'positive-psychology': '/orbs/psychology/positive-psychology.png',
  // Economics (15 worlds).
  'economic-thinking': '/orbs/economics/economic-thinking.png',
  'supply-and-demand': '/orbs/economics/supply-and-demand.png',
  elasticity: '/orbs/economics/elasticity.png',
  'consumer-choice': '/orbs/economics/consumer-choice.png',
  'firms-and-production': '/orbs/economics/firms-and-production.png',
  'market-structures': '/orbs/economics/market-structures.png',
  'market-failure': '/orbs/economics/market-failure.png',
  'labor-and-income': '/orbs/economics/labor-and-income.png',
  'measuring-the-economy': '/orbs/economics/measuring-the-economy.png',
  'money-and-banking': '/orbs/economics/money-and-banking.png',
  'aggregate-economy': '/orbs/economics/aggregate-economy.png',
  'economic-policy': '/orbs/economics/economic-policy.png',
  'economic-growth': '/orbs/economics/economic-growth.png',
  'global-economy': '/orbs/economics/global-economy.png',
  'game-theory': '/orbs/economics/game-theory.png',
  // Philosophy (15 worlds).
  'what-is-philosophy': '/orbs/philosophy/what-is-philosophy.png',
  'logic-and-arguments': '/orbs/philosophy/logic-and-arguments.png',
  'reasoning-and-fallacies': '/orbs/philosophy/reasoning-and-fallacies.png',
  epistemology: '/orbs/philosophy/epistemology.png',
  metaphysics: '/orbs/philosophy/metaphysics.png',
  'philosophy-of-mind': '/orbs/philosophy/philosophy-of-mind.png',
  'moral-foundations': '/orbs/philosophy/moral-foundations.png',
  'ethical-theories': '/orbs/philosophy/ethical-theories.png',
  'applied-ethics': '/orbs/philosophy/applied-ethics.png',
  'political-philosophy': '/orbs/philosophy/political-philosophy.png',
  'ancient-philosophy': '/orbs/philosophy/ancient-philosophy.png',
  'modern-philosophy': '/orbs/philosophy/modern-philosophy.png',
  'existential-philosophy': '/orbs/philosophy/existential-philosophy.png',
  'science-and-religion': '/orbs/philosophy/science-and-religion.png',
  'meaning-of-life': '/orbs/philosophy/meaning-of-life.png',
  // Health (15 worlds).
  'what-is-health': '/orbs/health/what-is-health.png',
  'the-healthy-body': '/orbs/health/the-healthy-body.png',
  'nutrition-basics': '/orbs/health/nutrition-basics.png',
  'vitamins-and-diet': '/orbs/health/vitamins-and-diet.png',
  'eating-well': '/orbs/health/eating-well.png',
  'fitness-and-movement': '/orbs/health/fitness-and-movement.png',
  'sleep-and-rest': '/orbs/health/sleep-and-rest.png',
  'mental-health': '/orbs/health/mental-health.png',
  'stress-and-resilience': '/orbs/health/stress-and-resilience.png',
  immunity: '/orbs/health/immunity.png',
  'disease-and-prevention': '/orbs/health/disease-and-prevention.png',
  'substances-and-the-body': '/orbs/health/substances-and-the-body.png',
  'sexual-and-reproductive-health': '/orbs/health/sexual-and-reproductive-health.png',
  'first-aid-and-safety': '/orbs/health/first-aid-and-safety.png',
  'healthy-living': '/orbs/health/healthy-living.png',
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// Hand-tuned receding meander for a 12-world path (mockup 1A, tuned for Physics):
// foreground worlds are large/low, the path winds with shrinking amplitude as it
// climbs into the distance, settling on the summit at top-centre. x/y are % of the
// stage; scale shrinks with distance (atmospheric perspective).
const LAYOUT_12: Array<Pt> = [
  { x: 15, y: 89, scale: 1.28 },
  { x: 37, y: 84, scale: 1.16 },
  { x: 60, y: 80, scale: 1.06 },
  { x: 80, y: 71, scale: 0.96 },
  { x: 67, y: 62, scale: 0.88 },
  { x: 45, y: 57, scale: 0.8 },
  { x: 25, y: 51, scale: 0.73 },
  { x: 39, y: 42, scale: 0.67 },
  { x: 60, y: 37, scale: 0.62 },
  { x: 47, y: 30, scale: 0.58 },
  { x: 56, y: 23, scale: 0.55 },
  { x: 49, y: 13, scale: 0.64 }, // summit
]

// Hand-tuned winding path for a 14-world trail (shared by Biology and Chemistry —
// both have 14 worlds). Smaller orbs and a wider, more even meander than genLayout
// — the procedural version packed the nodes too tightly (high sine frequency) and
// ran them oversized, so the lower worlds overlapped. x/y are % of the stage;
// scale recedes with distance.
const LAYOUT_14: Array<Pt> = [
  { x: 72, y: 88, scale: 1.0 },
  { x: 50, y: 82.5, scale: 0.95 },
  { x: 26, y: 77, scale: 0.9 },
  { x: 40, y: 71.5, scale: 0.85 },
  { x: 64, y: 66, scale: 0.8 },
  { x: 78, y: 60.5, scale: 0.75 },
  { x: 56, y: 55, scale: 0.71 },
  { x: 33, y: 49.5, scale: 0.67 },
  { x: 48, y: 44, scale: 0.63 },
  { x: 68, y: 38.5, scale: 0.6 },
  { x: 57, y: 33, scale: 0.57 },
  { x: 38, y: 27, scale: 0.55 },
  { x: 50, y: 20, scale: 0.54 },
  { x: 49, y: 13, scale: 0.6 }, // summit
]

// Hand-tuned winding path for a 15-world trail (Economics, Philosophy, Health —
// all three have 15 worlds). Sits between LAYOUT_14 and LAYOUT_16: the same even,
// wide meander, just one extra slalom over LAYOUT_14. Foreground worlds swing the
// full width (x ~26→78) and the amplitude recedes toward the summit. Without this
// these subjects fell back to genLayout(), which packed the orbs too tightly.
const LAYOUT_15: Array<Pt> = [
  { x: 72, y: 88, scale: 0.98 },
  { x: 49, y: 82.5, scale: 0.93 },
  { x: 26, y: 77, scale: 0.88 },
  { x: 41, y: 71.5, scale: 0.84 },
  { x: 65, y: 66, scale: 0.8 },
  { x: 78, y: 60.5, scale: 0.76 },
  { x: 57, y: 55, scale: 0.72 },
  { x: 34, y: 49.5, scale: 0.69 },
  { x: 47, y: 44, scale: 0.66 },
  { x: 67, y: 38.5, scale: 0.63 },
  { x: 57, y: 33, scale: 0.6 },
  { x: 38, y: 27.5, scale: 0.58 },
  { x: 48, y: 22, scale: 0.56 },
  { x: 58, y: 16.5, scale: 0.55 },
  { x: 49, y: 10, scale: 0.6 }, // summit
]

// Hand-tuned winding path for a 16-world trail (Computer Science). Same even,
// wide meander as LAYOUT_14, just one extra slalom: foreground worlds swing the
// full width (x ~26→78) and the amplitude recedes toward the summit. Slightly
// smaller orbs than the 14-trail so the denser column doesn't overlap.
const LAYOUT_16: Array<Pt> = [
  { x: 72, y: 88, scale: 0.96 },
  { x: 49, y: 83, scale: 0.91 },
  { x: 26, y: 78, scale: 0.86 },
  { x: 41, y: 73, scale: 0.82 },
  { x: 65, y: 68, scale: 0.78 },
  { x: 78, y: 63, scale: 0.74 },
  { x: 58, y: 58, scale: 0.7 },
  { x: 34, y: 53, scale: 0.67 },
  { x: 46, y: 48, scale: 0.64 },
  { x: 67, y: 43, scale: 0.61 },
  { x: 60, y: 38, scale: 0.59 },
  { x: 40, y: 33, scale: 0.57 },
  { x: 33, y: 28, scale: 0.55 },
  { x: 47, y: 22.5, scale: 0.54 },
  { x: 57, y: 17, scale: 0.54 },
  { x: 49, y: 11, scale: 0.6 }, // summit
]

// Hand-tuned winding path for an 18-world trail (Math). Two more slaloms than
// LAYOUT_14 over the same vertical span, so the step is tighter (~4.5%) and the
// orbs start smaller — the wide meander keeps neighbours apart horizontally.
const LAYOUT_18: Array<Pt> = [
  { x: 72, y: 88, scale: 0.92 },
  { x: 49, y: 83.5, scale: 0.88 },
  { x: 27, y: 79, scale: 0.84 },
  { x: 41, y: 74.5, scale: 0.8 },
  { x: 64, y: 70, scale: 0.77 },
  { x: 77, y: 65.5, scale: 0.74 },
  { x: 59, y: 61, scale: 0.71 },
  { x: 36, y: 56.5, scale: 0.68 },
  { x: 46, y: 52, scale: 0.65 },
  { x: 67, y: 47.5, scale: 0.63 },
  { x: 56, y: 43, scale: 0.61 },
  { x: 38, y: 38.5, scale: 0.59 },
  { x: 47, y: 34, scale: 0.57 },
  { x: 61, y: 29.5, scale: 0.56 },
  { x: 52, y: 25, scale: 0.55 },
  { x: 39, y: 20.5, scale: 0.54 },
  { x: 47, y: 16, scale: 0.54 },
  { x: 49, y: 10, scale: 0.59 }, // summit
]

// Hand-tuned winding path for a 17-world trail (Psychology). Sits between the 16
// and 18 trails: one fewer slalom than Math over the same vertical span, so the
// orbs run a touch larger and the wide meander (x ~27->77 in the foreground,
// amplitude receding toward the summit) keeps neighbours well apart.
const LAYOUT_17: Array<Pt> = [
  { x: 72, y: 88, scale: 0.94 },
  { x: 49, y: 83.5, scale: 0.9 },
  { x: 27, y: 79, scale: 0.86 },
  { x: 42, y: 74.5, scale: 0.82 },
  { x: 65, y: 70, scale: 0.79 },
  { x: 77, y: 65.5, scale: 0.76 },
  { x: 58, y: 61, scale: 0.73 },
  { x: 35, y: 56.5, scale: 0.7 },
  { x: 46, y: 52, scale: 0.67 },
  { x: 66, y: 47.5, scale: 0.64 },
  { x: 57, y: 43, scale: 0.62 },
  { x: 39, y: 38.5, scale: 0.6 },
  { x: 47, y: 34, scale: 0.58 },
  { x: 60, y: 29.5, scale: 0.56 },
  { x: 53, y: 24.5, scale: 0.55 },
  { x: 44, y: 18.5, scale: 0.54 },
  { x: 49, y: 11, scale: 0.6 }, // summit
]

// Hand-tuned trails keyed by world count; subjects matching a count share the
// even, wide meander. Anything else falls back to the procedural genLayout.
const HAND_LAYOUTS: Record<number, Array<Pt>> = {
  12: LAYOUT_12,
  14: LAYOUT_14,
  15: LAYOUT_15,
  16: LAYOUT_16,
  17: LAYOUT_17,
  18: LAYOUT_18,
}

const ORB_BASE = 120 // desktop orb px diameter at scale 1 (matches OrbStation default)
const ORB_BASE_MOBILE = 84 // smaller orbs on the narrow phone climbing trail
const MOBILE_MAX = 899 // ≤ this viewport width → the vertical climbing-trail layout

// Fallback for any subject whose category count differs from physics' 12.
function genLayout(n: number): Array<Pt> {
  const out: Array<Pt> = []
  for (let i = 0; i < n; i++) {
    const t = n > 1 ? i / (n - 1) : 0
    const amp = 30 * (1 - t)
    out.push({
      x: 50 + amp * Math.sin(i * 1.7 + 0.6),
      y: 88 - t * 75,
      scale: 1.3 - t * 0.76,
    })
  }
  return out
}

// Phone layout — a gentle vertical climb the user scrolls UP, regardless of world
// count (the hand-tuned desktop meanders assume a wide landscape stage and pack
// too tightly when squeezed into a narrow column). World 1 sits centred at the
// bottom; the trail winds within a safe horizontal band (x ~27→73, narrowing as
// it climbs) and the summit lands centred at the top. The stage is made tall
// (see stageHeight) so the even vertical spacing keeps neighbours from touching.
function mobileLayout(n: number): Array<Pt> {
  const top = 8
  const bottom = 92
  const out: Array<Pt> = []
  for (let i = 0; i < n; i++) {
    const t = n > 1 ? i / (n - 1) : 0 // 0 = world 1 (bottom) … 1 = summit (top)
    const amp = 23 - 8 * t // wider sway low, tighter near the summit
    out.push({
      x: 50 + Math.sin(i * 0.95) * amp,
      y: bottom - t * (bottom - top),
      scale: 0.9 - 0.2 * t,
    })
  }
  if (n > 0) out[n - 1] = { ...out[n - 1], x: 50, scale: 1.0 } // summit: centred + hero-sized
  return out
}

// Strict gating mirrors lesson gating: a world unlocks only once the previous is
// 100% complete. The first incomplete unlocked world is the "current" target.
function computeStates(units: Array<OverworldUnit>): Array<OrbState> {
  const states: Array<OrbState> = []
  let unlocked = true
  let assignedCurrent = false
  for (const u of units) {
    const complete = u.total > 0 && u.done === u.total
    let s: OrbState
    if (complete) s = 'complete'
    else if (unlocked) {
      s = assignedCurrent ? 'available' : 'current'
      assignedCurrent = true
    } else s = 'locked'
    unlocked = complete
    states.push(s)
  }
  return states
}

// Catmull-Rom → cubic-Bézier control points per segment i (pts[i] → pts[i+1]).
function controlPoints(pts: Array<{ x: number; y: number }>) {
  const segs: Array<{ c1x: number; c1y: number; c2x: number; c2y: number }> = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    segs.push({
      c1x: p1.x + (p2.x - p0.x) / 6,
      c1y: p1.y + (p2.y - p0.y) / 6,
      c2x: p2.x - (p3.x - p1.x) / 6,
      c2y: p2.y - (p3.y - p1.y) / 6,
    })
  }
  return segs
}

function bezierPoint(
  p1: { x: number; y: number },
  c: { c1x: number; c1y: number; c2x: number; c2y: number },
  p2: { x: number; y: number },
  u: number,
) {
  const m = 1 - u
  const a = m * m * m
  const b = 3 * m * m * u
  const cc = 3 * m * u * u
  const d = u * u * u
  return {
    x: a * p1.x + b * c.c1x + cc * c.c2x + d * p2.x,
    y: a * p1.y + b * c.c1y + cc * c.c2y + d * p2.y,
  }
}

export function CategoryOverworld({
  subjectSlug,
  subjectName,
  subjectColor,
  units,
}: {
  subjectSlug: string
  subjectName: string
  subjectColor: string
  units: Array<OverworldUnit>
}) {
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const orbRefs = useRef<Array<HTMLDivElement | null>>([])

  const n = units.length
  const states = useMemo(() => computeStates(units), [units])

  // Viewport-driven mode. Content mounts client-side (it lives inside
  // <Authenticated>), so reading window on first render is safe and flicker-free.
  const [vp, setVp] = useState(() =>
    typeof window === 'undefined'
      ? { w: 1280, h: 800 }
      : { w: window.innerWidth, h: window.innerHeight },
  )
  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const mobile = vp.w <= MOBILE_MAX
  const orbBase = mobile ? ORB_BASE_MOBILE : ORB_BASE
  // Tall stage so the winding climb has room to breathe; scrolls vertically.
  const stageHeight = Math.max(vp.h - 64, Math.round(n * 150))

  const layout = useMemo<Array<Pt>>(
    () => (mobile ? mobileLayout(n) : (HAND_LAYOUTS[n] ?? genLayout(n))),
    [n, mobile],
  )
  const scales = layout.map((p) => p.scale)
  const sMax = Math.max(...scales, 1)
  const sMin = Math.min(...scales, 0.5)
  const depthOf = (s: number) => (sMax === sMin ? 1 : (s - sMin) / (sMax - sMin))

  const totals = useMemo(() => {
    const done = units.reduce((a, u) => a + u.done, 0)
    const total = units.reduce((a, u) => a + u.total, 0)
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 }
  }, [units])

  // How far the lit "completed" trail reaches: up to the current world, else the
  // last completed one (whole subject finished).
  const currentIdx = states.indexOf('current')
  let lastComplete = -1
  states.forEach((s, i) => {
    if (s === 'complete') lastComplete = i
  })
  const fillUpTo = currentIdx >= 0 ? currentIdx : lastComplete

  // Per-orb bloom spec for the canvas (lit coins radiate accent light).
  const orbGlow = useMemo(
    () =>
      units.map((u, i) => {
        const s = states[i]
        return {
          x: layout[i].x,
          y: layout[i].y,
          scale: layout[i].scale,
          rgb: hexToRgb(u.accentColor ?? subjectColor),
          intensity:
            s === 'current' ? 0.55 : s === 'complete' ? 0.4 : s === 'available' ? 0.3 : 0,
          current: s === 'current',
        }
      }),
    [units, states, layout, subjectColor],
  )

  // Pointer parallax: feed the smoothed pointer to the nebula (uMouse) and drift
  // each orb by its depth so the world reads as 2.5D.
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2
    }
    const tick = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      orbRefs.current.forEach((el, i) => {
        if (!el) return
        const f = 6 + depthOf(layout[i].scale) * 26
        el.style.transform = `translate(${cx * f}px, ${cy * f}px)`
      })
      raf = requestAnimationFrame(tick)
    }
    wrap.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      wrap.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout])

  // The luminous path — drawn in pixel space (undistorted) on a 2D canvas, like
  // the hub's energy bridges: a dim/cold full trail, a bright golden "completed"
  // prefix with flowing dashes + travelling pulses (additive bloom).
  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !wrap || !ctx || n < 2) return
    const reduceM = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let w = 0
    let h = 0
    let pts: Array<{ x: number; y: number }> = []
    let segs: ReturnType<typeof controlPoints> = []
    const resize = () => {
      const r = wrap.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      pts = layout.map((p) => ({ x: (p.x / 100) * w, y: (p.y / 100) * h }))
      segs = controlPoints(pts)
    }
    resize()

    const tracePath = (from: number, to: number) => {
      ctx.beginPath()
      ctx.moveTo(pts[from].x, pts[from].y)
      for (let i = from; i < to; i++) {
        const c = segs[i]
        ctx.bezierCurveTo(c.c1x, c.c1y, c.c2x, c.c2y, pts[i + 1].x, pts[i + 1].y)
      }
    }

    let raf = 0
    const draw = () => {
      const t = performance.now() / 1000
      ctx.clearRect(0, 0, w, h)

      // orb bloom — lit coins radiate accent light into the nebula (additive)
      ctx.globalCompositeOperation = 'lighter'
      for (const o of orbGlow) {
        if (o.intensity <= 0) continue
        const ox = (o.x / 100) * w
        const oy = (o.y / 100) * h
        const pulse = o.current && !reduceM ? 0.85 + 0.22 * Math.sin(t * 2.3) : 1
        const rad = (orbBase * o.scale * 0.85 + 26) * pulse
        const [r, g, b] = o.rgb
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, rad)
        grad.addColorStop(0, `rgba(${r},${g},${b},${o.intensity * pulse})`)
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${o.intensity * 0.32 * pulse})`)
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(ox, oy, rad, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'

      // full trail — dim, cold (the road ahead)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      tracePath(0, n - 1)
      ctx.strokeStyle = 'rgba(150,165,210,0.10)'
      ctx.lineWidth = 7
      ctx.stroke()
      tracePath(0, n - 1)
      ctx.strokeStyle = 'rgba(165,180,225,0.24)'
      ctx.lineWidth = 2.5
      ctx.stroke()

      // completed prefix — bright golden trail of light (additive bloom)
      if (fillUpTo >= 1) {
        ctx.globalCompositeOperation = 'lighter'
        tracePath(0, fillUpTo)
        ctx.strokeStyle = 'rgba(255,210,140,0.12)'
        ctx.lineWidth = 16
        ctx.stroke()
        tracePath(0, fillUpTo)
        ctx.strokeStyle = 'rgba(255,228,180,0.3)'
        ctx.lineWidth = 7
        ctx.stroke()
        tracePath(0, fillUpTo)
        ctx.strokeStyle = 'rgba(255,245,225,0.85)'
        ctx.lineWidth = 3
        ctx.stroke()
        tracePath(0, fillUpTo)
        ctx.strokeStyle = 'rgba(255,255,255,0.95)'
        ctx.lineWidth = 1.4
        ctx.stroke()

        // flowing energy dashes along the completed trail
        if (!reduceM) {
          ctx.setLineDash([5, 18])
          ctx.lineDashOffset = -((t * 60) % 23)
          tracePath(0, fillUpTo)
          ctx.strokeStyle = 'rgba(255,250,235,0.95)'
          ctx.lineWidth = 2.4
          ctx.stroke()
          ctx.setLineDash([])
        }

        // travelling pulses (segment-parametrised so they ride the spline)
        const span = fillUpTo
        const pulseUs = reduceM ? [0.5] : [(t * 0.18) % 1, (t * 0.18 + 0.5) % 1]
        for (const pu of pulseUs) {
          const s = pu * span
          const seg = Math.min(span - 1, Math.floor(s))
          const local = s - seg
          const p = bezierPoint(pts[seg], segs[seg], pts[seg + 1], local)
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 12)
          g.addColorStop(0, 'rgba(255,250,235,0.98)')
          g.addColorStop(1, 'rgba(255,210,140,0)')
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(p.x, p.y, 12, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalCompositeOperation = 'source-over'
      }

      if (!reduceM) raf = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [layout, n, fillUpTo, orbGlow, orbBase, stageHeight])

  // Phone trail: open scrolled to where the learner is — the current world, else
  // the last completed one, else the start at the bottom.
  useEffect(() => {
    if (!mobile) return
    const el = scrollRef.current
    if (!el) return
    const idx = currentIdx >= 0 ? currentIdx : lastComplete >= 0 ? lastComplete : 0
    const yPct = layout[idx]?.y ?? 92
    el.scrollTop = Math.max(0, (yPct / 100) * el.scrollHeight - el.clientHeight / 2)
  }, [mobile, layout, currentIdx, lastComplete, stageHeight])

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 'calc(100vh - 64px)', minHeight: 620 }}
    >
      {/* the shared universe (CosmosBackdrop) shows through; depth vignette over it —
          pinned to the viewport so it stays put while the trail scrolls */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(125% 90% at 50% 42%, transparent 58%, rgba(7,10,22,0.6) 100%)',
        }}
      />

      {/* scroll region — desktop pans horizontally if the stage is wider than the
          viewport; the phone trail scrolls vertically up toward the summit */}
      <div
        ref={scrollRef}
        className={cn(
          'relative z-10 h-full w-full',
          mobile
            ? 'overflow-y-auto overflow-x-hidden'
            : 'overflow-x-auto overflow-y-hidden',
        )}
      >
        <div
          ref={wrapRef}
          className="relative overflow-hidden"
          style={
            mobile
              ? { width: '100%', height: stageHeight }
              : { minWidth: 920, height: '100%' }
          }
        >
          {/* layer 2 — the luminous winding path */}
          <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />

          {/* layer 3 — the interactive orb worlds */}
          {units.map((u, i) => {
            const p = layout[i]
            const depth = depthOf(p.scale)
            return (
              <div
                key={u.slug}
                className="absolute"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  zIndex: 10 + Math.round(depth * 40),
                }}
              >
                {/* parallax wrapper (transform set per-frame) */}
                <div
                  ref={(el) => {
                    orbRefs.current[i] = el
                  }}
                  className="will-change-transform"
                >
                  {/* static centring — kept off the parallax/motion transforms */}
                  <div className="-translate-x-1/2 -translate-y-1/2">
                    <OrbStation
                      subjectSlug={subjectSlug}
                      unitSlug={u.slug}
                      name={u.name}
                      icon={u.icon}
                      image={ORB_IMAGE[u.slug]}
                      accent={u.accentColor ?? subjectColor}
                      state={states[i]}
                      done={u.done}
                      total={u.total}
                      order={i + 1}
                      scale={p.scale}
                      depth={depth}
                      isSummit={i === n - 1}
                      reduce={Boolean(reduce)}
                      index={i}
                      base={orbBase}
                      captionAbove={p.y > 78}
                      lockHint={
                        i > 0 ? `Finish ${units[i - 1].name} to unlock` : undefined
                      }
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* arrival flash — fades out the hub's "dive into the island" bloom */}
      {!reduce && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-40"
          style={{
            background: `radial-gradient(circle at 50% 48%, ${subjectColor}, #050710 70%)`,
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      )}

      {/* chrome — back link + subject progress (glass), pinned over the scroll region */}
      <div className="absolute left-4 top-4 z-30 flex flex-col items-start gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-sm font-medium text-ink backdrop-blur-md transition-colors hover:border-white/25 hover:bg-black/50"
        >
          <Icon name="ArrowLeft" size={15} /> All subjects
        </Link>
        <div className="rounded-2xl border border-white/10 bg-black/35 px-3.5 py-2 backdrop-blur-md">
          <p className="text-base font-bold" style={{ color: subjectColor }}>
            {subjectName}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{ width: `${totals.pct}%`, background: subjectColor }}
              />
            </div>
            <span className="text-xs text-muted">
              {totals.done}/{totals.total} · {n} worlds
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
