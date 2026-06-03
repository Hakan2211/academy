import { useState } from 'react'
import { cn } from '#/lib/cn'

// A clickable human silhouette + system list. Selecting a system highlights
// the relevant region on the figure and shows a summary panel.

type System = {
  id: string
  label: string
  job: string
  organs: string[]
  health: string
  color: string
  // SVG highlight region: cx, cy, rx, ry of an ellipse
  ellipse: { cx: number; cy: number; rx: number; ry: number }
}

const SYSTEMS: Array<System> = [
  {
    id: 'circulatory',
    label: 'Circulatory',
    job: 'Pumps blood around the body, delivering oxygen and nutrients to every cell and carrying away waste.',
    organs: ['Heart', 'Arteries', 'Veins', 'Capillaries'],
    health: 'Regular aerobic exercise and a low-sodium diet keep your heart and vessels strong for life.',
    color: '#E74C3C',
    ellipse: { cx: 80, cy: 105, rx: 18, ry: 30 },
  },
  {
    id: 'respiratory',
    label: 'Respiratory',
    job: 'Brings oxygen from the air into the blood and expels carbon dioxide — the gas exchange that powers every breath.',
    organs: ['Lungs', 'Trachea', 'Bronchi', 'Diaphragm'],
    health: 'Not smoking is the single biggest thing you can do for your lungs.',
    color: '#3498DB',
    ellipse: { cx: 80, cy: 100, rx: 22, ry: 25 },
  },
  {
    id: 'digestive',
    label: 'Digestive',
    job: 'Breaks food down into nutrients the body can absorb and disposes of what cannot be used.',
    organs: ['Stomach', 'Small intestine', 'Large intestine', 'Liver', 'Pancreas'],
    health: 'High-fibre foods, regular meals, and staying hydrated support a healthy gut microbiome.',
    color: '#E67E22',
    ellipse: { cx: 80, cy: 130, rx: 20, ry: 30 },
  },
  {
    id: 'musculoskeletal',
    label: 'Musculoskeletal',
    job: 'Provides structure, protects organs, enables movement, and stores minerals like calcium.',
    organs: ['Bones (206)', 'Skeletal muscles', 'Tendons', 'Ligaments', 'Joints'],
    health: 'Weight-bearing exercise and calcium-rich foods build bone density that protects you decades later.',
    color: '#9B59B6',
    ellipse: { cx: 80, cy: 110, rx: 30, ry: 55 },
  },
  {
    id: 'nervous',
    label: 'Nervous',
    job: 'Processes information and coordinates all body functions — a constant two-way communication network.',
    organs: ['Brain', 'Spinal cord', 'Peripheral nerves'],
    health: 'Quality sleep, mental stimulation, and managing chronic stress all protect brain health long-term.',
    color: '#27AE60',
    ellipse: { cx: 80, cy: 55, rx: 18, ry: 22 },
  },
  {
    id: 'immune',
    label: 'Immune / Lymphatic',
    job: 'Defends against pathogens, removes debris, and returns fluid from tissues back into the bloodstream.',
    organs: ['White blood cells', 'Lymph nodes', 'Spleen', 'Thymus'],
    health: 'Adequate sleep, a varied diet, and vaccinations are the foundations of strong immune function.',
    color: '#16A085',
    ellipse: { cx: 80, cy: 110, rx: 16, ry: 40 },
  },
]

// Simple human silhouette as path data
const HEAD = { cx: 80, cy: 28, r: 18 }

export function BodySystemMap() {
  const [active, setActive] = useState<string>('circulatory')
  const sys = SYSTEMS.find((s) => s.id === active) ?? SYSTEMS[0]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* SVG figure */}
        <div className="flex shrink-0 justify-center sm:justify-start">
          <svg viewBox="0 0 160 220" className="w-28" aria-hidden="true">
            {/* Silhouette */}
            {/* Head */}
            <circle cx={HEAD.cx} cy={HEAD.cy} r={HEAD.r} fill="var(--color-border)" />
            {/* Neck */}
            <rect x={72} y={44} width={16} height={10} fill="var(--color-border)" />
            {/* Torso */}
            <rect x={52} y={54} width={56} height={70} rx={10} fill="var(--color-border)" />
            {/* Left arm */}
            <rect x={30} y={54} width={18} height={60} rx={8} fill="var(--color-border)" />
            {/* Right arm */}
            <rect x={112} y={54} width={18} height={60} rx={8} fill="var(--color-border)" />
            {/* Left leg */}
            <rect x={54} y={122} width={22} height={75} rx={8} fill="var(--color-border)" />
            {/* Right leg */}
            <rect x={84} y={122} width={22} height={75} rx={8} fill="var(--color-border)" />

            {/* Highlight overlay for selected system */}
            <ellipse
              cx={sys.ellipse.cx}
              cy={sys.ellipse.cy}
              rx={sys.ellipse.rx}
              ry={sys.ellipse.ry}
              fill={sys.color}
              opacity={0.45}
              style={{ filter: `drop-shadow(0 0 6px ${sys.color})`, transition: 'all 0.3s' }}
            />
          </svg>
        </div>

        {/* System list + info panel */}
        <div className="flex flex-1 flex-col gap-3">
          {/* Buttons */}
          <div className="grid grid-cols-2 gap-1.5">
            {SYSTEMS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                className={cn(
                  'rounded-xl border px-2 py-1.5 text-left text-xs transition-colors',
                  active === s.id
                    ? 'border-accent bg-accent/15 font-semibold text-accent'
                    : 'border-border text-muted hover:text-ink',
                )}
                style={active === s.id ? { borderColor: s.color, color: s.color, backgroundColor: s.color + '22' } : {}}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Info panel */}
          <div
            className="rounded-xl border p-3 text-sm transition-colors"
            style={{ borderColor: sys.color + '66', backgroundColor: sys.color + '11' }}
          >
            <p className="font-semibold" style={{ color: sys.color }}>
              {sys.label} System
            </p>
            <p className="mt-1 text-xs text-ink">{sys.job}</p>
            <p className="mt-1.5 text-xs text-muted">
              <span className="font-medium text-ink">Key organs: </span>
              {sys.organs.join(' · ')}
            </p>
            <p className="mt-1.5 rounded-lg px-2 py-1 text-xs" style={{ backgroundColor: sys.color + '18', color: sys.color }}>
              ♥ {sys.health}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
