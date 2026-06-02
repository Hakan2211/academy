import { useState } from 'react'
import { cn } from '#/lib/cn'

// The flagship periodic table: a real 18-column layout you can explore. Modes
// recolour it to teach different ideas — element families, the metal/non-metal
// divide, the s/p/d/f blocks, and the periodic trends. Reused across the
// Periodic Table world (and later in Bonding).
type Cat =
  | 'alkali' | 'alkaline' | 'transition' | 'post' | 'metalloid'
  | 'nonmetal' | 'halogen' | 'noble' | 'lan' | 'act'

type El = { z: number; sym: string; name: string; g: number; p: number; c: Cat }

// group, period coordinates. La/Ac sit in the f-block rows (p 9/10).
const MAIN: Array<El> = [
  { z: 1, sym: 'H', name: 'Hydrogen', g: 1, p: 1, c: 'nonmetal' },
  { z: 2, sym: 'He', name: 'Helium', g: 18, p: 1, c: 'noble' },
  { z: 3, sym: 'Li', name: 'Lithium', g: 1, p: 2, c: 'alkali' },
  { z: 4, sym: 'Be', name: 'Beryllium', g: 2, p: 2, c: 'alkaline' },
  { z: 5, sym: 'B', name: 'Boron', g: 13, p: 2, c: 'metalloid' },
  { z: 6, sym: 'C', name: 'Carbon', g: 14, p: 2, c: 'nonmetal' },
  { z: 7, sym: 'N', name: 'Nitrogen', g: 15, p: 2, c: 'nonmetal' },
  { z: 8, sym: 'O', name: 'Oxygen', g: 16, p: 2, c: 'nonmetal' },
  { z: 9, sym: 'F', name: 'Fluorine', g: 17, p: 2, c: 'halogen' },
  { z: 10, sym: 'Ne', name: 'Neon', g: 18, p: 2, c: 'noble' },
  { z: 11, sym: 'Na', name: 'Sodium', g: 1, p: 3, c: 'alkali' },
  { z: 12, sym: 'Mg', name: 'Magnesium', g: 2, p: 3, c: 'alkaline' },
  { z: 13, sym: 'Al', name: 'Aluminium', g: 13, p: 3, c: 'post' },
  { z: 14, sym: 'Si', name: 'Silicon', g: 14, p: 3, c: 'metalloid' },
  { z: 15, sym: 'P', name: 'Phosphorus', g: 15, p: 3, c: 'nonmetal' },
  { z: 16, sym: 'S', name: 'Sulfur', g: 16, p: 3, c: 'nonmetal' },
  { z: 17, sym: 'Cl', name: 'Chlorine', g: 17, p: 3, c: 'halogen' },
  { z: 18, sym: 'Ar', name: 'Argon', g: 18, p: 3, c: 'noble' },
  { z: 19, sym: 'K', name: 'Potassium', g: 1, p: 4, c: 'alkali' },
  { z: 20, sym: 'Ca', name: 'Calcium', g: 2, p: 4, c: 'alkaline' },
  { z: 21, sym: 'Sc', name: 'Scandium', g: 3, p: 4, c: 'transition' },
  { z: 22, sym: 'Ti', name: 'Titanium', g: 4, p: 4, c: 'transition' },
  { z: 23, sym: 'V', name: 'Vanadium', g: 5, p: 4, c: 'transition' },
  { z: 24, sym: 'Cr', name: 'Chromium', g: 6, p: 4, c: 'transition' },
  { z: 25, sym: 'Mn', name: 'Manganese', g: 7, p: 4, c: 'transition' },
  { z: 26, sym: 'Fe', name: 'Iron', g: 8, p: 4, c: 'transition' },
  { z: 27, sym: 'Co', name: 'Cobalt', g: 9, p: 4, c: 'transition' },
  { z: 28, sym: 'Ni', name: 'Nickel', g: 10, p: 4, c: 'transition' },
  { z: 29, sym: 'Cu', name: 'Copper', g: 11, p: 4, c: 'transition' },
  { z: 30, sym: 'Zn', name: 'Zinc', g: 12, p: 4, c: 'transition' },
  { z: 31, sym: 'Ga', name: 'Gallium', g: 13, p: 4, c: 'post' },
  { z: 32, sym: 'Ge', name: 'Germanium', g: 14, p: 4, c: 'metalloid' },
  { z: 33, sym: 'As', name: 'Arsenic', g: 15, p: 4, c: 'metalloid' },
  { z: 34, sym: 'Se', name: 'Selenium', g: 16, p: 4, c: 'nonmetal' },
  { z: 35, sym: 'Br', name: 'Bromine', g: 17, p: 4, c: 'halogen' },
  { z: 36, sym: 'Kr', name: 'Krypton', g: 18, p: 4, c: 'noble' },
  { z: 37, sym: 'Rb', name: 'Rubidium', g: 1, p: 5, c: 'alkali' },
  { z: 38, sym: 'Sr', name: 'Strontium', g: 2, p: 5, c: 'alkaline' },
  { z: 39, sym: 'Y', name: 'Yttrium', g: 3, p: 5, c: 'transition' },
  { z: 40, sym: 'Zr', name: 'Zirconium', g: 4, p: 5, c: 'transition' },
  { z: 41, sym: 'Nb', name: 'Niobium', g: 5, p: 5, c: 'transition' },
  { z: 42, sym: 'Mo', name: 'Molybdenum', g: 6, p: 5, c: 'transition' },
  { z: 43, sym: 'Tc', name: 'Technetium', g: 7, p: 5, c: 'transition' },
  { z: 44, sym: 'Ru', name: 'Ruthenium', g: 8, p: 5, c: 'transition' },
  { z: 45, sym: 'Rh', name: 'Rhodium', g: 9, p: 5, c: 'transition' },
  { z: 46, sym: 'Pd', name: 'Palladium', g: 10, p: 5, c: 'transition' },
  { z: 47, sym: 'Ag', name: 'Silver', g: 11, p: 5, c: 'transition' },
  { z: 48, sym: 'Cd', name: 'Cadmium', g: 12, p: 5, c: 'transition' },
  { z: 49, sym: 'In', name: 'Indium', g: 13, p: 5, c: 'post' },
  { z: 50, sym: 'Sn', name: 'Tin', g: 14, p: 5, c: 'post' },
  { z: 51, sym: 'Sb', name: 'Antimony', g: 15, p: 5, c: 'metalloid' },
  { z: 52, sym: 'Te', name: 'Tellurium', g: 16, p: 5, c: 'metalloid' },
  { z: 53, sym: 'I', name: 'Iodine', g: 17, p: 5, c: 'halogen' },
  { z: 54, sym: 'Xe', name: 'Xenon', g: 18, p: 5, c: 'noble' },
  { z: 55, sym: 'Cs', name: 'Caesium', g: 1, p: 6, c: 'alkali' },
  { z: 56, sym: 'Ba', name: 'Barium', g: 2, p: 6, c: 'alkaline' },
  { z: 72, sym: 'Hf', name: 'Hafnium', g: 4, p: 6, c: 'transition' },
  { z: 73, sym: 'Ta', name: 'Tantalum', g: 5, p: 6, c: 'transition' },
  { z: 74, sym: 'W', name: 'Tungsten', g: 6, p: 6, c: 'transition' },
  { z: 75, sym: 'Re', name: 'Rhenium', g: 7, p: 6, c: 'transition' },
  { z: 76, sym: 'Os', name: 'Osmium', g: 8, p: 6, c: 'transition' },
  { z: 77, sym: 'Ir', name: 'Iridium', g: 9, p: 6, c: 'transition' },
  { z: 78, sym: 'Pt', name: 'Platinum', g: 10, p: 6, c: 'transition' },
  { z: 79, sym: 'Au', name: 'Gold', g: 11, p: 6, c: 'transition' },
  { z: 80, sym: 'Hg', name: 'Mercury', g: 12, p: 6, c: 'transition' },
  { z: 81, sym: 'Tl', name: 'Thallium', g: 13, p: 6, c: 'post' },
  { z: 82, sym: 'Pb', name: 'Lead', g: 14, p: 6, c: 'post' },
  { z: 83, sym: 'Bi', name: 'Bismuth', g: 15, p: 6, c: 'post' },
  { z: 84, sym: 'Po', name: 'Polonium', g: 16, p: 6, c: 'post' },
  { z: 85, sym: 'At', name: 'Astatine', g: 17, p: 6, c: 'halogen' },
  { z: 86, sym: 'Rn', name: 'Radon', g: 18, p: 6, c: 'noble' },
  { z: 87, sym: 'Fr', name: 'Francium', g: 1, p: 7, c: 'alkali' },
  { z: 88, sym: 'Ra', name: 'Radium', g: 2, p: 7, c: 'alkaline' },
  { z: 104, sym: 'Rf', name: 'Rutherfordium', g: 4, p: 7, c: 'transition' },
  { z: 105, sym: 'Db', name: 'Dubnium', g: 5, p: 7, c: 'transition' },
  { z: 106, sym: 'Sg', name: 'Seaborgium', g: 6, p: 7, c: 'transition' },
  { z: 107, sym: 'Bh', name: 'Bohrium', g: 7, p: 7, c: 'transition' },
  { z: 108, sym: 'Hs', name: 'Hassium', g: 8, p: 7, c: 'transition' },
  { z: 109, sym: 'Mt', name: 'Meitnerium', g: 9, p: 7, c: 'transition' },
  { z: 110, sym: 'Ds', name: 'Darmstadtium', g: 10, p: 7, c: 'transition' },
  { z: 111, sym: 'Rg', name: 'Roentgenium', g: 11, p: 7, c: 'transition' },
  { z: 112, sym: 'Cn', name: 'Copernicium', g: 12, p: 7, c: 'transition' },
  { z: 113, sym: 'Nh', name: 'Nihonium', g: 13, p: 7, c: 'post' },
  { z: 114, sym: 'Fl', name: 'Flerovium', g: 14, p: 7, c: 'post' },
  { z: 115, sym: 'Mc', name: 'Moscovium', g: 15, p: 7, c: 'post' },
  { z: 116, sym: 'Lv', name: 'Livermorium', g: 16, p: 7, c: 'post' },
  { z: 117, sym: 'Ts', name: 'Tennessine', g: 17, p: 7, c: 'halogen' },
  { z: 118, sym: 'Og', name: 'Oganesson', g: 18, p: 7, c: 'noble' },
]

// f-block: laid out in rows 9 (lanthanides) and 10 (actinides), columns 3–17.
const LAN = ['La,Lanthanum', 'Ce,Cerium', 'Pr,Praseodymium', 'Nd,Neodymium', 'Pm,Promethium', 'Sm,Samarium', 'Eu,Europium', 'Gd,Gadolinium', 'Tb,Terbium', 'Dy,Dysprosium', 'Ho,Holmium', 'Er,Erbium', 'Tm,Thulium', 'Yb,Ytterbium', 'Lu,Lutetium']
const ACT = ['Ac,Actinium', 'Th,Thorium', 'Pa,Protactinium', 'U,Uranium', 'Np,Neptunium', 'Pu,Plutonium', 'Am,Americium', 'Cm,Curium', 'Bk,Berkelium', 'Cf,Californium', 'Es,Einsteinium', 'Fm,Fermium', 'Md,Mendelevium', 'No,Nobelium', 'Lr,Lawrencium']
const FBLOCK: Array<El> = [
  ...LAN.map((s, i) => {
    const [sym, name] = s.split(',')
    return { z: 57 + i, sym, name, g: 3 + i, p: 9, c: 'lan' as Cat }
  }),
  ...ACT.map((s, i) => {
    const [sym, name] = s.split(',')
    return { z: 89 + i, sym, name, g: 3 + i, p: 10, c: 'act' as Cat }
  }),
]

const CAT_COLOR: Record<Cat, string> = {
  alkali: '#FF6B6B',
  alkaline: '#FFA94D',
  transition: '#FFD43B',
  post: '#A9E34B',
  metalloid: '#38D9A9',
  nonmetal: '#4DABF7',
  halogen: '#748FFC',
  noble: '#DA77F2',
  lan: '#F783AC',
  act: '#E599F7',
}
const CAT_LABEL: Record<Cat, string> = {
  alkali: 'Alkali metal',
  alkaline: 'Alkaline earth metal',
  transition: 'Transition metal',
  post: 'Post-transition metal',
  metalloid: 'Metalloid',
  nonmetal: 'Reactive non-metal',
  halogen: 'Halogen',
  noble: 'Noble gas',
  lan: 'Lanthanide',
  act: 'Actinide',
}

const METALS: Set<Cat> = new Set(['alkali', 'alkaline', 'transition', 'post', 'lan', 'act'])

const BLOCK = (e: El): 's' | 'p' | 'd' | 'f' => {
  if (e.c === 'lan' || e.c === 'act') return 'f'
  if (e.c === 'transition') return 'd'
  if (e.g <= 2 || e.sym === 'He') return 's'
  return 'p'
}
const BLOCK_COLOR = { s: '#FF8787', p: '#4DABF7', d: '#FFD43B', f: '#F783AC' }

export type PeriodicMode =
  | 'default' | 'metals' | 'blocks'
  | 'radius' | 'ionization' | 'electronegativity'

// schematic trend value 0..1 (1 = high), from grid position
function trendValue(e: El, mode: PeriodicMode): number {
  const gx = (e.g - 1) / 17 // 0 left .. 1 right
  const py = (e.p - 1) / 6 // 0 top .. 1 bottom
  if (mode === 'radius') return 1 - (gx * 0.55 + (1 - py) * 0.45) // big bottom-left
  // ionization & electronegativity: high top-right
  return gx * 0.55 + (1 - py) * 0.45
}

function lerpColor(t: number): string {
  // cool (low) -> warm (high)
  const a = [56, 139, 247] // blue
  const b = [232, 67, 62] // red
  const r = Math.round(a[0] + (b[0] - a[0]) * t)
  const g = Math.round(a[1] + (b[1] - a[1]) * t)
  const bl = Math.round(a[2] + (b[2] - a[2]) * t)
  return `rgb(${r},${g},${bl})`
}

export function PeriodicTable({
  mode = 'default',
  highlightGroup,
  highlight,
}: {
  mode?: PeriodicMode
  highlightGroup?: number
  highlight?: string
}) {
  const [sel, setSel] = useState<El | null>(null)
  const isTrend = mode === 'radius' || mode === 'ionization' || mode === 'electronegativity'

  const colorFor = (e: El): string => {
    if (mode === 'metals') return METALS.has(e.c) ? '#FFA94D' : e.c === 'metalloid' ? '#38D9A9' : '#4DABF7'
    if (mode === 'blocks') return BLOCK_COLOR[BLOCK(e)]
    if (isTrend) return lerpColor(trendValue(e, mode))
    return CAT_COLOR[e.c]
  }

  const dim = (e: El): boolean => {
    if (highlightGroup) return e.g !== highlightGroup || e.p > 7
    if (highlight) return e.sym !== highlight
    return false
  }

  const Cell = ({ e }: { e: El }) => (
    <button
      type="button"
      onClick={() => setSel(e)}
      style={{ gridColumn: e.g, gridRow: e.p, background: colorFor(e), opacity: dim(e) ? 0.22 : 1 }}
      className={cn(
        'flex aspect-square min-w-0 flex-col items-center justify-center rounded-[3px] text-[#10141f] transition-opacity',
        sel?.z === e.z && 'ring-2 ring-white',
      )}
      title={e.name}
    >
      <span className="text-[6px] leading-none opacity-70">{e.z}</span>
      <span className="text-[9px] font-bold leading-none sm:text-[10px]">{e.sym}</span>
    </button>
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-3">
      {isTrend && (
        <div className="mb-2 flex items-center justify-center gap-2 text-xs text-muted">
          <span>low</span>
          <span className="h-2 w-24 rounded" style={{ background: 'linear-gradient(90deg,#388bf7,#e8433e)' }} />
          <span>high</span>
          <span className="ml-2 font-semibold text-ink">
            {mode === 'radius' ? 'atomic radius' : mode === 'ionization' ? 'ionization energy' : 'electronegativity'}
          </span>
        </div>
      )}

      <div className="overflow-x-auto">
        <div
          className="grid min-w-[440px] gap-[2px]"
          style={{ gridTemplateColumns: 'repeat(18, 1fr)', gridTemplateRows: 'repeat(7, 1fr) 0.4fr repeat(2, 1fr)' }}
        >
          {MAIN.map((e) => <Cell key={e.z} e={e} />)}
          {/* La/Ac placeholder markers pointing to the f-block */}
          <div style={{ gridColumn: 3, gridRow: 6 }} className="flex aspect-square items-center justify-center rounded-[3px] bg-[#F783AC]/40 text-[7px] text-muted">57–71</div>
          <div style={{ gridColumn: 3, gridRow: 7 }} className="flex aspect-square items-center justify-center rounded-[3px] bg-[#E599F7]/40 text-[7px] text-muted">89–103</div>
          {FBLOCK.map((e) => <Cell key={e.z} e={e} />)}
        </div>
      </div>

      {/* detail / legend */}
      {sel ? (
        <div className="mt-3 flex items-center gap-3 rounded-lg bg-surface-2 p-2.5">
          <div
            className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded text-[#10141f]"
            style={{ background: CAT_COLOR[sel.c] }}
          >
            <span className="text-[8px] leading-none">{sel.z}</span>
            <span className="text-sm font-bold leading-none">{sel.sym}</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-ink">{sel.name}</span>
            <span className="text-muted"> · {CAT_LABEL[sel.c]}</span>
            <br />
            <span className="text-muted">
              {sel.p <= 7 && sel.c !== 'lan' && sel.c !== 'act'
                ? `Group ${sel.g}, Period ${sel.p}`
                : `Period ${sel.c === 'lan' ? 6 : 7} (f-block)`}{' '}
              · {BLOCK(sel)}-block
            </span>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-center text-xs text-muted">Tap any element to inspect it.</p>
      )}
    </div>
  )
}
