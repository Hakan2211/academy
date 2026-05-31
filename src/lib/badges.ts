export type BadgeMeta = { label: string; icon: string; color: string }

// Per-category badge key = `unit-<unitSlug>`, awarded when all published lessons
// in that unit are complete (convex/progress.ts completeLesson). Names/accents
// follow journey-ux-design.md §7a; icons are lucide fallbacks until art lands at
// public/badges/physics/<unitSlug>.svg.
export const BADGES: Record<string, BadgeMeta> = {
  'first-lesson': { label: 'First Lesson', icon: 'Award', color: '#FFB020' },
  'oscillation-novice': {
    label: 'Oscillation Novice',
    icon: 'Waves',
    color: '#00D2D3',
  },

  'unit-scientific-working': {
    label: 'Method Master',
    icon: 'FlaskConical',
    color: '#00B894',
  },
  'unit-energy': { label: 'Energy Adept', icon: 'Zap', color: '#FDCB6E' },
  'unit-forces-and-motion': {
    label: 'Force Adept',
    icon: 'Move',
    color: '#FF8A4C',
  },
  'unit-oscillations': {
    label: 'Wave Rider',
    icon: 'Waves',
    color: '#00CEC9',
  },
  'unit-light-and-optics': {
    label: 'Optics Adept',
    icon: 'Rainbow',
    color: '#FAB1A0',
  },
  'unit-electricity': {
    label: 'Circuit Master',
    icon: 'CircuitBoard',
    color: '#E17055',
  },
  'unit-magnetism': {
    label: 'Field Master',
    icon: 'Magnet',
    color: '#D63031',
  },
  'unit-matter': {
    label: 'Matter Master',
    icon: 'Thermometer',
    color: '#0984E3',
  },
  'unit-atoms-and-quantum': {
    label: 'Quantum Adept',
    icon: 'Atom',
    color: '#A29BFE',
  },
  'unit-relativity': {
    label: 'Spacetime Adept',
    icon: 'Orbit',
    color: '#74B9FF',
  },
  'unit-astronomy': {
    label: 'Cosmic Voyager',
    icon: 'Telescope',
    color: '#4834D4',
  },
  'unit-frontiers': {
    label: 'Frontier Pioneer',
    icon: 'Gem',
    color: '#E84393',
  },
}

export function badgeMeta(key: string): BadgeMeta {
  return BADGES[key] ?? { label: key, icon: 'Award', color: '#8a93b2' }
}
