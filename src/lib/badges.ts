export type BadgeMeta = {
  label: string
  icon: string
  color: string
  /** How the badge is earned — shown when a badge is selected in the trophy room. */
  hint: string
}

// One onboarding milestone (`first-lesson`) + one per-category badge
// (`unit-<unitSlug>`, awarded when all published lessons in that unit are
// complete — convex/progress.ts completeLesson). Names/accents follow
// journey-ux-design.md §7a; icons are lucide fallbacks until art lands at
// public/badges/physics/<unitSlug>.png.
export const BADGES: Record<string, BadgeMeta> = {
  'first-lesson': {
    label: 'First Lesson',
    icon: 'Award',
    color: '#FFB020',
    hint: 'Complete your very first lesson.',
  },

  'unit-scientific-working': {
    label: 'Method Master',
    icon: 'FlaskConical',
    color: '#00B894',
    hint: 'Complete every lesson in Scientific Working & Measurement.',
  },
  'unit-energy': {
    label: 'Energy Adept',
    icon: 'Zap',
    color: '#FDCB6E',
    hint: 'Complete every lesson in Energy & Work.',
  },
  'unit-forces-and-motion': {
    label: 'Force Adept',
    icon: 'Move',
    color: '#FF8A4C',
    hint: 'Complete every lesson in Forces & Motion.',
  },
  'unit-oscillations': {
    label: 'Wave Rider',
    icon: 'Waves',
    color: '#00CEC9',
    hint: 'Complete every lesson in Oscillations & Waves.',
  },
  'unit-light-and-optics': {
    label: 'Optics Adept',
    icon: 'Rainbow',
    color: '#FAB1A0',
    hint: 'Complete every lesson in Light & Optics.',
  },
  'unit-electricity': {
    label: 'Circuit Master',
    icon: 'CircuitBoard',
    color: '#E17055',
    hint: 'Complete every lesson in Electricity & Circuits.',
  },
  'unit-magnetism': {
    label: 'Field Master',
    icon: 'Magnet',
    color: '#D63031',
    hint: 'Complete every lesson in Magnetism & Electromagnetism.',
  },
  'unit-matter': {
    label: 'Matter Master',
    icon: 'Thermometer',
    color: '#0984E3',
    hint: 'Complete every lesson in Matter, Pressure & Heat.',
  },
  'unit-atoms-and-quantum': {
    label: 'Quantum Adept',
    icon: 'Atom',
    color: '#A29BFE',
    hint: 'Complete every lesson in Atoms, Radioactivity & Quantum.',
  },
  'unit-relativity': {
    label: 'Spacetime Adept',
    icon: 'Orbit',
    color: '#74B9FF',
    hint: 'Complete every lesson in Relativity.',
  },
  'unit-astronomy': {
    label: 'Cosmic Voyager',
    icon: 'Telescope',
    color: '#4834D4',
    hint: 'Complete every lesson in Astronomy & Cosmology.',
  },
  'unit-frontiers': {
    label: 'Frontier Pioneer',
    icon: 'Gem',
    color: '#E84393',
    hint: 'Complete every lesson in Frontiers & Special Topics.',
  },
}

export function badgeMeta(key: string): BadgeMeta {
  return (
    BADGES[key] ?? {
      label: key,
      icon: 'Award',
      color: '#8a93b2',
      hint: 'Keep learning to unlock this badge.',
    }
  )
}
