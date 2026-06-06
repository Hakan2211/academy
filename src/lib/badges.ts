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

  // --- Biology (14 worlds; accents mirror convex/seed.ts bioUnitsData) ---
  'unit-study-of-life': {
    label: 'Life Seeker',
    icon: 'Microscope',
    color: '#2ECC71',
    hint: 'Complete every lesson in The Study of Life.',
  },
  'unit-the-cell': {
    label: 'Cell Biologist',
    icon: 'CircleDot',
    color: '#1ABC9C',
    hint: 'Complete every lesson in The Cell.',
  },
  'unit-membranes-and-transport': {
    label: 'Gatekeeper',
    icon: 'ArrowRightLeft',
    color: '#00CEC9',
    hint: 'Complete every lesson in Membranes & Transport.',
  },
  'unit-molecules-of-life': {
    label: 'Molecule Maker',
    icon: 'TestTube',
    color: '#FDCB6E',
    hint: 'Complete every lesson in The Molecules of Life.',
  },
  'unit-energy-and-enzymes': {
    label: 'Enzyme Adept',
    icon: 'Zap',
    color: '#A3CB38',
    hint: 'Complete every lesson in Energy & Enzymes.',
  },
  'unit-dna-and-the-code': {
    label: 'Code Breaker',
    icon: 'Dna',
    color: '#A29BFE',
    hint: 'Complete every lesson in DNA & the Code of Life.',
  },
  'unit-division-and-inheritance': {
    label: 'Gene Keeper',
    icon: 'GitBranch',
    color: '#FD79A8',
    hint: 'Complete every lesson in Cell Division & Inheritance.',
  },
  'unit-evolution': {
    label: 'Natural Selector',
    icon: 'Bird',
    color: '#E67E22',
    hint: 'Complete every lesson in Evolution.',
  },
  'unit-body-fuel-and-transport': {
    label: 'Anatomist',
    icon: 'Heart',
    color: '#E74C3C',
    hint: 'Complete every lesson in The Human Body I — Fuel & Transport.',
  },
  'unit-body-control': {
    label: 'Neuro Navigator',
    icon: 'Brain',
    color: '#0984E3',
    hint: 'Complete every lesson in The Human Body II — Control.',
  },
  'unit-reproduction-and-development': {
    label: 'Life Giver',
    icon: 'Baby',
    color: '#FF6B9D',
    hint: 'Complete every lesson in Reproduction & Development.',
  },
  'unit-plants': {
    label: 'Botanist',
    icon: 'Sprout',
    color: '#6AB04C',
    hint: 'Complete every lesson in Plants.',
  },
  'unit-microbes-and-immunity': {
    label: 'Microbe Hunter',
    icon: 'Bug',
    color: '#9B59B6',
    hint: 'Complete every lesson in Microbes, Immunity & Disease.',
  },
  'unit-ecology': {
    label: 'Eco Guardian',
    icon: 'Trees',
    color: '#16A085',
    hint: 'Complete every lesson in Ecology & the Biosphere.',
  },

  // --- Chemistry (14 worlds; accents mirror convex/seed.ts chemUnitsData) ---
  'unit-matter-basics': {
    label: 'Matter Mapper',
    icon: 'Boxes',
    color: '#00D2D3',
    hint: 'Complete every lesson in The World of Matter.',
  },
  'unit-atoms': {
    label: 'Atom Architect',
    icon: 'Atom',
    color: '#5DADE2',
    hint: 'Complete every lesson in Atoms.',
  },
  'unit-periodic-table': {
    label: 'Table Master',
    icon: 'Grid3x3',
    color: '#48C9B0',
    hint: 'Complete every lesson in The Periodic Table.',
  },
  'unit-bonding': {
    label: 'Bond Builder',
    icon: 'Link2',
    color: '#16A085',
    hint: 'Complete every lesson in Chemical Bonding.',
  },
  'unit-mole': {
    label: 'Mole Wrangler',
    icon: 'Scale',
    color: '#F39C12',
    hint: 'Complete every lesson in The Mole & Stoichiometry.',
  },
  'unit-reactions': {
    label: 'Reaction Ranger',
    icon: 'FlaskConical',
    color: '#E67E22',
    hint: 'Complete every lesson in Chemical Reactions.',
  },
  'unit-gases': {
    label: 'Gas Whisperer',
    icon: 'Wind',
    color: '#3498DB',
    hint: 'Complete every lesson in Gases & States.',
  },
  'unit-solutions': {
    label: 'Solution Sage',
    icon: 'Droplets',
    color: '#1ABC9C',
    hint: 'Complete every lesson in Solutions & Mixtures.',
  },
  'unit-acids-and-bases': {
    label: 'pH Master',
    icon: 'TestTube',
    color: '#E74C3C',
    hint: 'Complete every lesson in Acids & Bases.',
  },
  'unit-thermochemistry': {
    label: 'Energy Alchemist',
    icon: 'Flame',
    color: '#E84393',
    hint: 'Complete every lesson in Energy & Thermochemistry.',
  },
  'unit-equilibrium': {
    label: 'Equilibrium Keeper',
    icon: 'Gauge',
    color: '#9B59B6',
    hint: 'Complete every lesson in Reaction Rates & Equilibrium.',
  },
  'unit-electrochemistry': {
    label: 'Cell Charger',
    icon: 'Battery',
    color: '#2ECC71',
    hint: 'Complete every lesson in Redox & Electrochemistry.',
  },
  'unit-organic': {
    label: 'Carbon Crafter',
    icon: 'Hexagon',
    color: '#D35400',
    hint: 'Complete every lesson in Organic Chemistry.',
  },
  'unit-biochemistry': {
    label: 'Life Chemist',
    icon: 'Dna',
    color: '#27AE60',
    hint: 'Complete every lesson in Biochemistry.',
  },

  // --- Math (18 worlds; accents mirror convex/seed.ts mathUnitsData) ---
  'unit-number-sense': {
    label: 'Number Navigator',
    icon: 'Hash',
    color: '#FFB020',
    hint: 'Complete every lesson in The World of Numbers.',
  },
  'unit-factors-and-primes': {
    label: 'Prime Hunter',
    icon: 'Grid3x3',
    color: '#F39C12',
    hint: 'Complete every lesson in Factors & Primes.',
  },
  'unit-fractions': {
    label: 'Fraction Tamer',
    icon: 'PieChart',
    color: '#E67E22',
    hint: 'Complete every lesson in Fractions, Decimals & Percents.',
  },
  'unit-ratio-proportion': {
    label: 'Proportion Pro',
    icon: 'Scale',
    color: '#E17055',
    hint: 'Complete every lesson in Ratio & Proportion.',
  },
  'unit-powers-and-roots': {
    label: 'Power Player',
    icon: 'Superscript',
    color: '#D63031',
    hint: 'Complete every lesson in Powers, Roots & Standard Form.',
  },
  'unit-algebra-basics': {
    label: 'Algebra Initiate',
    icon: 'Variable',
    color: '#E84393',
    hint: 'Complete every lesson in Into Algebra.',
  },
  'unit-equations': {
    label: 'Equation Solver',
    icon: 'Equal',
    color: '#FD79A8',
    hint: 'Complete every lesson in Equations.',
  },
  'unit-quadratics': {
    label: 'Quadratic Master',
    icon: 'Spline',
    color: '#9B59B6',
    hint: 'Complete every lesson in Quadratics.',
  },
  'unit-functions-and-graphs': {
    label: 'Graph Grapher',
    icon: 'LineChart',
    color: '#A29BFE',
    hint: 'Complete every lesson in Functions & Graphs.',
  },
  'unit-sequences': {
    label: 'Pattern Seer',
    icon: 'ListOrdered',
    color: '#E056FD',
    hint: 'Complete every lesson in Sequences & Patterns.',
  },
  'unit-angles-and-shapes': {
    label: 'Shape Shifter',
    icon: 'Triangle',
    color: '#1ABC9C',
    hint: 'Complete every lesson in Angles & Shapes.',
  },
  'unit-measurement': {
    label: 'Master Measurer',
    icon: 'Ruler',
    color: '#16A085',
    hint: 'Complete every lesson in Measurement & Mensuration.',
  },
  'unit-geometry': {
    label: 'Transformer',
    icon: 'Shapes',
    color: '#00D2D3',
    hint: 'Complete every lesson in Transformations & Vectors.',
  },
  'unit-trigonometry': {
    label: 'Trig Adept',
    icon: 'Compass',
    color: '#3498DB',
    hint: 'Complete every lesson in Trigonometry.',
  },
  'unit-probability': {
    label: 'Chance Master',
    icon: 'Dices',
    color: '#5DADE2',
    hint: 'Complete every lesson in Probability.',
  },
  'unit-statistics': {
    label: 'Data Detective',
    icon: 'BarChart3',
    color: '#0984E3',
    hint: 'Complete every lesson in Statistics & Data.',
  },
  'unit-calculus': {
    label: 'Calculus Pioneer',
    icon: 'TrendingUp',
    color: '#4834D4',
    hint: 'Complete every lesson in Calculus: The Mathematics of Change.',
  },
  'unit-the-infinite': {
    label: 'Infinity Sage',
    icon: 'Infinity',
    color: '#FDCB6E',
    hint: 'Complete every lesson in Infinity & Beautiful Mathematics.',
  },

  // --- Computer Science (16 worlds; accents mirror convex/seed.ts csUnitsData) ---
  'unit-foundations': {
    label: 'CS Initiate',
    icon: 'Lightbulb',
    color: '#FF6B6B',
    hint: 'Complete every lesson in What Is Computer Science?.',
  },
  'unit-data-representation': {
    label: 'Bit Wrangler',
    icon: 'Binary',
    color: '#FF8C42',
    hint: 'Complete every lesson in Bits & Bytes.',
  },
  'unit-boolean-logic': {
    label: 'Logic Smith',
    icon: 'ToggleRight',
    color: '#FFC83D',
    hint: 'Complete every lesson in Logic & Gates.',
  },
  'unit-computer-architecture': {
    label: 'Machine Architect',
    icon: 'Cpu',
    color: '#9BDE3C',
    hint: 'Complete every lesson in Inside the Machine.',
  },
  'unit-algorithms': {
    label: 'Algorithm Ace',
    icon: 'Workflow',
    color: '#2ECC71',
    hint: 'Complete every lesson in Algorithms.',
  },
  'unit-data-structures': {
    label: 'Structure Builder',
    icon: 'ListTree',
    color: '#1ABC9C',
    hint: 'Complete every lesson in Data Structures.',
  },
  'unit-programming': {
    label: 'Code Whisperer',
    icon: 'Code2',
    color: '#00CEC9',
    hint: 'Complete every lesson in Programming Languages.',
  },
  'unit-software-engineering': {
    label: 'Software Smith',
    icon: 'Wrench',
    color: '#22A6F2',
    hint: 'Complete every lesson in Building Software.',
  },
  'unit-operating-systems': {
    label: 'Kernel Keeper',
    icon: 'Layers',
    color: '#4F8CFF',
    hint: 'Complete every lesson in Operating Systems.',
  },
  'unit-networking': {
    label: 'Packet Pilot',
    icon: 'Network',
    color: '#5B6CFF',
    hint: 'Complete every lesson in Networks & the Internet.',
  },
  'unit-the-web': {
    label: 'Web Weaver',
    icon: 'Globe',
    color: '#9B59B6',
    hint: 'Complete every lesson in The World Wide Web.',
  },
  'unit-databases': {
    label: 'Data Keeper',
    icon: 'Database',
    color: '#E056FD',
    hint: 'Complete every lesson in Databases.',
  },
  'unit-cybersecurity': {
    label: 'Cyber Guardian',
    icon: 'ShieldCheck',
    color: '#E84393',
    hint: 'Complete every lesson in Cybersecurity & Cryptography.',
  },
  'unit-computer-graphics': {
    label: 'Pixel Artist',
    icon: 'Shapes',
    color: '#FD79A8',
    hint: 'Complete every lesson in Computer Graphics.',
  },
  'unit-artificial-intelligence': {
    label: 'AI Pioneer',
    icon: 'BrainCircuit',
    color: '#A29BFE',
    hint: 'Complete every lesson in Artificial Intelligence.',
  },
  'unit-theory-of-computation': {
    label: 'Limit Breaker',
    icon: 'Infinity',
    color: '#FFD54A',
    hint: 'Complete every lesson in The Limits of Computation.',
  },
  // --- Psychology (17 worlds; accents mirror convex/seed.ts psychUnitsData) ---
  'unit-what-is-psychology': {
    label: "Mind Initiate",
    icon: "Compass",
    color: "#E056FD",
    hint: "Complete every lesson in What Is Psychology?.",
  },
  'unit-research-methods': {
    label: "Lab Investigator",
    icon: "Microscope",
    color: "#5DADE2",
    hint: "Complete every lesson in Research Methods & Statistics.",
  },
  'unit-brain-and-behavior': {
    label: "Brain Explorer",
    icon: "Brain",
    color: "#FF6B9D",
    hint: "Complete every lesson in The Brain & Behavior.",
  },
  'unit-sensation-and-perception': {
    label: "Perception Pro",
    icon: "Eye",
    color: "#00CEC9",
    hint: "Complete every lesson in Sensation & Perception.",
  },
  'unit-consciousness': {
    label: "Dream Walker",
    icon: "Moon",
    color: "#6C5CE7",
    hint: "Complete every lesson in Consciousness.",
  },
  'unit-learning': {
    label: "Conditioning Adept",
    icon: "Bell",
    color: "#27AE60",
    hint: "Complete every lesson in Learning.",
  },
  'unit-memory': {
    label: "Memory Keeper",
    icon: "Archive",
    color: "#F39C12",
    hint: "Complete every lesson in Memory.",
  },
  'unit-language-and-thought': {
    label: "Deep Thinker",
    icon: "Languages",
    color: "#1ABC9C",
    hint: "Complete every lesson in Language & Thought.",
  },
  'unit-intelligence': {
    label: "Mind Measurer",
    icon: "Puzzle",
    color: "#3498DB",
    hint: "Complete every lesson in Intelligence.",
  },
  'unit-lifespan-development': {
    label: "Lifespan Guide",
    icon: "Footprints",
    color: "#FDCB6E",
    hint: "Complete every lesson in Lifespan Development.",
  },
  'unit-motivation-and-emotion': {
    label: "Heart & Drive",
    icon: "Flame",
    color: "#FF7043",
    hint: "Complete every lesson in Motivation & Emotion.",
  },
  'unit-stress-and-health': {
    label: "Resilience Master",
    icon: "HeartPulse",
    color: "#E74C3C",
    hint: "Complete every lesson in Stress & Health.",
  },
  'unit-personality': {
    label: "Self Cartographer",
    icon: "Fingerprint",
    color: "#A29BFE",
    hint: "Complete every lesson in Personality.",
  },
  'unit-psychological-disorders': {
    label: "Compassion Scholar",
    icon: "CloudRain",
    color: "#9B59B6",
    hint: "Complete every lesson in Psychological Disorders.",
  },
  'unit-psychotherapy': {
    label: "Healing Guide",
    icon: "Armchair",
    color: "#16A085",
    hint: "Complete every lesson in Therapy.",
  },
  'unit-social-psychology': {
    label: "Social Decoder",
    icon: "Users",
    color: "#F7B731",
    hint: "Complete every lesson in Social Psychology.",
  },
  'unit-positive-psychology': {
    label: "Flourish Sage",
    icon: "Sun",
    color: "#FFD54A",
    hint: "Complete every lesson in Positive Psychology & Well-Being.",
  },

  // --- Economics (15 worlds; accents mirror convex/seed.ts econUnitsData) ---
  'unit-economic-thinking': {
    label: 'Economic Initiate',
    icon: 'Scale',
    color: '#FDCB6E',
    hint: 'Complete every lesson in What Is Economics?.',
  },
  'unit-supply-and-demand': {
    label: 'Market Reader',
    icon: 'TrendingUp',
    color: '#F39C12',
    hint: 'Complete every lesson in Supply & Demand.',
  },
  'unit-elasticity': {
    label: 'Elasticity Expert',
    icon: 'Spline',
    color: '#E67E22',
    hint: 'Complete every lesson in Elasticity.',
  },
  'unit-consumer-choice': {
    label: 'Savvy Chooser',
    icon: 'ShoppingCart',
    color: '#FF7043',
    hint: 'Complete every lesson in Consumer Choice.',
  },
  'unit-firms-and-production': {
    label: 'Production Master',
    icon: 'Factory',
    color: '#E17055',
    hint: 'Complete every lesson in Firms & Production.',
  },
  'unit-market-structures': {
    label: 'Market Strategist',
    icon: 'Building2',
    color: '#9B59B6',
    hint: 'Complete every lesson in Market Structures.',
  },
  'unit-market-failure': {
    label: 'Market Mender',
    icon: 'TriangleAlert',
    color: '#16A085',
    hint: 'Complete every lesson in Market Failure.',
  },
  'unit-labor-and-income': {
    label: 'Wage Watcher',
    icon: 'HardHat',
    color: '#27AE60',
    hint: 'Complete every lesson in Labor & Income.',
  },
  'unit-measuring-the-economy': {
    label: 'Economy Gauge',
    icon: 'Gauge',
    color: '#0984E3',
    hint: 'Complete every lesson in Measuring the Economy.',
  },
  'unit-money-and-banking': {
    label: 'Coin Keeper',
    icon: 'Landmark',
    color: '#3498DB',
    hint: 'Complete every lesson in Money & Banking.',
  },
  'unit-aggregate-economy': {
    label: 'Cycle Surfer',
    icon: 'Waves',
    color: '#5DADE2',
    hint: 'Complete every lesson in The Aggregate Economy.',
  },
  'unit-economic-policy': {
    label: 'Policy Pilot',
    icon: 'SlidersHorizontal',
    color: '#5B6CFF',
    hint: 'Complete every lesson in Fiscal & Monetary Policy.',
  },
  'unit-economic-growth': {
    label: 'Growth Cultivator',
    icon: 'Sprout',
    color: '#9BDE3C',
    hint: 'Complete every lesson in Growth & Development.',
  },
  'unit-global-economy': {
    label: 'Global Trader',
    icon: 'Globe',
    color: '#4834D4',
    hint: 'Complete every lesson in Trade & the Global Economy.',
  },
  'unit-game-theory': {
    label: 'Grand Strategist',
    icon: 'Swords',
    color: '#FFD54A',
    hint: 'Complete every lesson in Game Theory & the Economics of Everything.',
  },

  // --- Philosophy (15 worlds; accents mirror convex/seed.ts philoUnitsData) ---
  'unit-what-is-philosophy': {
    label: 'Lover of Wisdom',
    icon: 'BookOpen',
    color: '#FDCB6E',
    hint: 'Complete every lesson in What Is Philosophy?.',
  },
  'unit-logic-and-arguments': {
    label: 'Logician',
    icon: 'Workflow',
    color: '#5DADE2',
    hint: 'Complete every lesson in Logic & Arguments.',
  },
  'unit-reasoning-and-fallacies': {
    label: 'Clear Thinker',
    icon: 'SearchCheck',
    color: '#E67E22',
    hint: 'Complete every lesson in Reasoning & Fallacies.',
  },
  'unit-epistemology': {
    label: 'Truth Seeker',
    icon: 'KeyRound',
    color: '#00CEC9',
    hint: 'Complete every lesson in Knowledge & Truth.',
  },
  'unit-metaphysics': {
    label: 'Reality Mapper',
    icon: 'Layers',
    color: '#9B59B6',
    hint: 'Complete every lesson in Reality & Being.',
  },
  'unit-philosophy-of-mind': {
    label: 'Mind Voyager',
    icon: 'Brain',
    color: '#A29BFE',
    hint: 'Complete every lesson in Mind & Consciousness.',
  },
  'unit-moral-foundations': {
    label: 'Moral Compass',
    icon: 'Compass',
    color: '#E74C3C',
    hint: 'Complete every lesson in What Is Right & Wrong?.',
  },
  'unit-ethical-theories': {
    label: 'Virtue Sage',
    icon: 'Scale',
    color: '#E17055',
    hint: 'Complete every lesson in How Should We Live?.',
  },
  'unit-applied-ethics': {
    label: 'Ethicist',
    icon: 'Split',
    color: '#FF7043',
    hint: 'Complete every lesson in Ethics in Action.',
  },
  'unit-political-philosophy': {
    label: 'Just Citizen',
    icon: 'Landmark',
    color: '#0984E3',
    hint: 'Complete every lesson in Society & Justice.',
  },
  'unit-ancient-philosophy': {
    label: 'Classical Scholar',
    icon: 'Columns3',
    color: '#16A085',
    hint: 'Complete every lesson in The Ancient World.',
  },
  'unit-modern-philosophy': {
    label: 'Enlightened Mind',
    icon: 'Lightbulb',
    color: '#3498DB',
    hint: 'Complete every lesson in The Modern Turn.',
  },
  'unit-existential-philosophy': {
    label: 'Free Spirit',
    icon: 'PersonStanding',
    color: '#E84393',
    hint: 'Complete every lesson in The Existential Turn.',
  },
  'unit-science-and-religion': {
    label: 'Reason & Faith',
    icon: 'Telescope',
    color: '#1ABC9C',
    hint: 'Complete every lesson in Science, Religion & Reality.',
  },
  'unit-meaning-of-life': {
    label: 'Wisdom Keeper',
    icon: 'Sunrise',
    color: '#FFD54A',
    hint: 'Complete every lesson in The Meaning of Life.',
  },

  // --- Health (15 worlds; accents mirror convex/seed.ts healthUnitsData) ---
  'unit-what-is-health': {
    label: "Wellness Initiate",
    icon: "HeartPulse",
    color: "#FF6B9D",
    hint: "Complete every lesson in What Is Health?.",
  },
  'unit-the-healthy-body': {
    label: "Body Knower",
    icon: "PersonStanding",
    color: "#E74C3C",
    hint: "Complete every lesson in How Your Body Works.",
  },
  'unit-nutrition-basics': {
    label: "Nutrition Novice",
    icon: "Utensils",
    color: "#E67E22",
    hint: "Complete every lesson in Nutrition Basics.",
  },
  'unit-vitamins-and-diet': {
    label: "Balanced Eater",
    icon: "Apple",
    color: "#F39C12",
    hint: "Complete every lesson in Vitamins, Minerals & a Balanced Diet.",
  },
  'unit-eating-well': {
    label: "Mindful Eater",
    icon: "Salad",
    color: "#9BDE3C",
    hint: "Complete every lesson in Eating Well.",
  },
  'unit-fitness-and-movement': {
    label: "Fitness Adept",
    icon: "Dumbbell",
    color: "#2ECC71",
    hint: "Complete every lesson in Fitness & Movement.",
  },
  'unit-sleep-and-rest': {
    label: "Rest Master",
    icon: "Moon",
    color: "#6C5CE7",
    hint: "Complete every lesson in Sleep & Rest.",
  },
  'unit-mental-health': {
    label: "Mind Carer",
    icon: "Brain",
    color: "#A29BFE",
    hint: "Complete every lesson in Mental Health.",
  },
  'unit-stress-and-resilience': {
    label: "Resilience Builder",
    icon: "Wind",
    color: "#00CEC9",
    hint: "Complete every lesson in Stress & Resilience.",
  },
  'unit-immunity': {
    label: "Immune Defender",
    icon: "Shield",
    color: "#1ABC9C",
    hint: "Complete every lesson in Immunity & Staying Well.",
  },
  'unit-disease-and-prevention': {
    label: "Prevention Pro",
    icon: "ShieldPlus",
    color: "#0984E3",
    hint: "Complete every lesson in Disease & Prevention.",
  },
  'unit-substances-and-the-body': {
    label: "Clear Choice",
    icon: "Scale",
    color: "#9B59B6",
    hint: "Complete every lesson in Substances & the Body.",
  },
  'unit-sexual-and-reproductive-health': {
    label: "Health Guardian",
    icon: "HeartHandshake",
    color: "#FD79A8",
    hint: "Complete every lesson in Sexual & Reproductive Health.",
  },
  'unit-first-aid-and-safety': {
    label: "First Responder",
    icon: "Cross",
    color: "#FF7043",
    hint: "Complete every lesson in First Aid & Safety.",
  },
  'unit-healthy-living': {
    label: "Vitality Sage",
    icon: "Sunrise",
    color: "#FFD54A",
    hint: "Complete every lesson in A Healthy Life, by Evidence.",
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

// Which subject each per-category (`unit-<slug>`) badge belongs to. Unit slugs
// are unique across subjects, so a flat map is unambiguous. Drives both the
// medal art path and the trophy-room grouping.
const UNIT_SUBJECT: Record<string, string> = {
  // Physics — public/badges/physics/<slug>.png
  'scientific-working': 'physics',
  energy: 'physics',
  'forces-and-motion': 'physics',
  oscillations: 'physics',
  'light-and-optics': 'physics',
  electricity: 'physics',
  magnetism: 'physics',
  matter: 'physics',
  'atoms-and-quantum': 'physics',
  relativity: 'physics',
  astronomy: 'physics',
  frontiers: 'physics',
  // Biology — public/badges/biology/<slug>.png
  'study-of-life': 'biology',
  'the-cell': 'biology',
  'membranes-and-transport': 'biology',
  'molecules-of-life': 'biology',
  'energy-and-enzymes': 'biology',
  'dna-and-the-code': 'biology',
  'division-and-inheritance': 'biology',
  evolution: 'biology',
  'body-fuel-and-transport': 'biology',
  'body-control': 'biology',
  'reproduction-and-development': 'biology',
  plants: 'biology',
  'microbes-and-immunity': 'biology',
  ecology: 'biology',
  // Chemistry — public/badges/chemistry/<slug>.png
  'matter-basics': 'chemistry',
  atoms: 'chemistry',
  'periodic-table': 'chemistry',
  bonding: 'chemistry',
  mole: 'chemistry',
  reactions: 'chemistry',
  gases: 'chemistry',
  solutions: 'chemistry',
  'acids-and-bases': 'chemistry',
  thermochemistry: 'chemistry',
  equilibrium: 'chemistry',
  electrochemistry: 'chemistry',
  organic: 'chemistry',
  biochemistry: 'chemistry',
  // Math — public/badges/math/<slug>.png
  'number-sense': 'math',
  'factors-and-primes': 'math',
  fractions: 'math',
  'ratio-proportion': 'math',
  'powers-and-roots': 'math',
  'algebra-basics': 'math',
  equations: 'math',
  quadratics: 'math',
  'functions-and-graphs': 'math',
  sequences: 'math',
  'angles-and-shapes': 'math',
  measurement: 'math',
  geometry: 'math',
  trigonometry: 'math',
  probability: 'math',
  statistics: 'math',
  calculus: 'math',
  'the-infinite': 'math',
  // Computer Science — public/badges/computer-science/<slug>.png
  foundations: 'computer-science',
  'data-representation': 'computer-science',
  'boolean-logic': 'computer-science',
  'computer-architecture': 'computer-science',
  algorithms: 'computer-science',
  'data-structures': 'computer-science',
  programming: 'computer-science',
  'software-engineering': 'computer-science',
  'operating-systems': 'computer-science',
  networking: 'computer-science',
  'the-web': 'computer-science',
  databases: 'computer-science',
  cybersecurity: 'computer-science',
  'computer-graphics': 'computer-science',
  'artificial-intelligence': 'computer-science',
  'theory-of-computation': 'computer-science',
  // Psychology — public/badges/psychology/<slug>.png
  "what-is-psychology": 'psychology',
  "research-methods": 'psychology',
  "brain-and-behavior": 'psychology',
  "sensation-and-perception": 'psychology',
  "consciousness": 'psychology',
  "learning": 'psychology',
  "memory": 'psychology',
  "language-and-thought": 'psychology',
  "intelligence": 'psychology',
  "lifespan-development": 'psychology',
  "motivation-and-emotion": 'psychology',
  "stress-and-health": 'psychology',
  "personality": 'psychology',
  "psychological-disorders": 'psychology',
  "psychotherapy": 'psychology',
  "social-psychology": 'psychology',
  "positive-psychology": 'psychology',
  // Economics — public/badges/economics/<slug>.png
  'economic-thinking': 'economics',
  'supply-and-demand': 'economics',
  elasticity: 'economics',
  'consumer-choice': 'economics',
  'firms-and-production': 'economics',
  'market-structures': 'economics',
  'market-failure': 'economics',
  'labor-and-income': 'economics',
  'measuring-the-economy': 'economics',
  'money-and-banking': 'economics',
  'aggregate-economy': 'economics',
  'economic-policy': 'economics',
  'economic-growth': 'economics',
  'global-economy': 'economics',
  'game-theory': 'economics',
  // Philosophy — public/badges/philosophy/<slug>.png
  'what-is-philosophy': 'philosophy',
  'logic-and-arguments': 'philosophy',
  'reasoning-and-fallacies': 'philosophy',
  'epistemology': 'philosophy',
  'metaphysics': 'philosophy',
  'philosophy-of-mind': 'philosophy',
  'moral-foundations': 'philosophy',
  'ethical-theories': 'philosophy',
  'applied-ethics': 'philosophy',
  'political-philosophy': 'philosophy',
  'ancient-philosophy': 'philosophy',
  'modern-philosophy': 'philosophy',
  'existential-philosophy': 'philosophy',
  'science-and-religion': 'philosophy',
  'meaning-of-life': 'philosophy',
  // Health — public/badges/health/<slug>.png
  'what-is-health': 'health',
  'the-healthy-body': 'health',
  'nutrition-basics': 'health',
  'vitamins-and-diet': 'health',
  'eating-well': 'health',
  'fitness-and-movement': 'health',
  'sleep-and-rest': 'health',
  'mental-health': 'health',
  'stress-and-resilience': 'health',
  'immunity': 'health',
  'disease-and-prevention': 'health',
  'substances-and-the-body': 'health',
  'sexual-and-reproductive-health': 'health',
  'first-aid-and-safety': 'health',
  'healthy-living': 'health',
}

// Subjects whose medal PNGs exist under public/badges/<subject>/. A unit whose
// subject isn't here resolves to no image, so its lucide icon (BadgeMeta.icon)
// renders instead of a broken <img>.
const SUBJECTS_WITH_ART = new Set([
  'physics',
  'biology',
  'chemistry',
  'math',
  'computer-science',
  'psychology',
  'economics',
  'philosophy',
  'health',
])

// Resolve a badge's medal-art URL, or null to fall back to the lucide icon.
// Per-category badges are keyed `unit-<unitSlug>`; the onboarding badge and any
// subject without art return null.
export function badgeImage(badgeKey: string): string | null {
  if (!badgeKey.startsWith('unit-')) return null
  const slug = badgeKey.slice('unit-'.length)
  const subject = UNIT_SUBJECT[slug]
  return subject && SUBJECTS_WITH_ART.has(subject)
    ? `/badges/${subject}/${slug}.png`
    : null
}

export function badgeSubject(badgeKey: string): string | null {
  if (!badgeKey.startsWith('unit-')) return null
  return UNIT_SUBJECT[badgeKey.slice('unit-'.length)] ?? null
}

// Ordered trophy-room sections: a leading "Milestones" group (badges not tied to
// a unit, e.g. first-lesson), then one section per subject in curriculum order.
// label/color/icon mirror convex/seed.ts subjectsData.
type BadgeGroupMeta = {
  subject: string | null
  label: string
  color: string
  icon: string
}
const SUBJECT_GROUPS: Array<BadgeGroupMeta> = [
  { subject: null, label: 'Milestones', color: '#FFB020', icon: 'Award' },
  { subject: 'physics', label: 'Physics', color: '#4F8CFF', icon: 'Atom' },
  { subject: 'chemistry', label: 'Chemistry', color: '#00D2D3', icon: 'FlaskConical' },
  { subject: 'biology', label: 'Biology', color: '#2ECC71', icon: 'Dna' },
  { subject: 'math', label: 'Math', color: '#FFB020', icon: 'Sigma' },
  { subject: 'computer-science', label: 'Computer Science', color: '#FF6B6B', icon: 'Binary' },
  { subject: 'psychology', label: 'Psychology', color: '#E056FD', icon: 'Brain' },
  { subject: 'economics', label: 'Economics', color: '#10B981', icon: 'TrendingUp' },
  { subject: 'philosophy', label: 'Philosophy', color: '#C9A24B', icon: 'Feather' },
  { subject: 'health', label: 'Health', color: '#FF5470', icon: 'HeartPulse' },
]

export type BadgeGroup = BadgeGroupMeta & { keys: Array<string> }

// Split every badge into its ordered subject section (preserving BADGES order
// within each). Empty sections are dropped, so the page scales as subjects land.
export function badgeGroups(): Array<BadgeGroup> {
  const keys = Object.keys(BADGES)
  return SUBJECT_GROUPS.map((g) => ({
    ...g,
    keys: keys.filter((k) => badgeSubject(k) === g.subject),
  })).filter((g) => g.keys.length > 0)
}
