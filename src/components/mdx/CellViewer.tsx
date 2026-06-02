import { useState } from 'react'
import { cn } from '#/lib/cn'

// An interactive, labelled cell. Toggle between an animal and a plant cell and
// click any organelle to learn its job. The flagship visual for the cell
// world — reused across several lessons (nucleus, mitochondria, plant cell…).
type CellType = 'animal' | 'plant'
type OrgId =
  | 'membrane'
  | 'cytoplasm'
  | 'nucleus'
  | 'mitochondria'
  | 'rough-er'
  | 'ribosomes'
  | 'golgi'
  | 'wall'
  | 'vacuole'
  | 'chloroplast'

type Org = { id: OrgId; label: string; job: string; in: 'both' | 'animal' | 'plant' }

const ORGANELLES: Array<Org> = [
  { id: 'membrane', label: 'Cell membrane', job: 'A thin oily border that controls what enters and leaves the cell.', in: 'both' },
  { id: 'cytoplasm', label: 'Cytoplasm', job: 'The jelly-like fluid where most chemical reactions happen and organelles float.', in: 'both' },
  { id: 'nucleus', label: 'Nucleus', job: 'The control centre — it holds the DNA and directs everything the cell does.', in: 'both' },
  { id: 'mitochondria', label: 'Mitochondria', job: 'The power plants — they release energy from glucose in respiration.', in: 'both' },
  { id: 'rough-er', label: 'Rough ER & ribosomes', job: 'Ribosomes build proteins; the rough endoplasmic reticulum ships them onward.', in: 'both' },
  { id: 'golgi', label: 'Golgi apparatus', job: 'The packaging and dispatch centre — it modifies and exports proteins.', in: 'both' },
  { id: 'wall', label: 'Cell wall', job: 'A tough cellulose layer outside the membrane that gives a plant cell its shape and support.', in: 'plant' },
  { id: 'vacuole', label: 'Vacuole', job: 'A large fluid-filled sac that keeps the plant cell firm (turgid).', in: 'plant' },
  { id: 'chloroplast', label: 'Chloroplasts', job: 'Green organelles that capture sunlight to make food in photosynthesis.', in: 'plant' },
]

export function CellViewer({
  initial = 'animal',
  highlight,
}: {
  initial?: CellType
  highlight?: OrgId
}) {
  const [type, setType] = useState<CellType>(initial)
  const [sel, setSel] = useState<OrgId>(highlight ?? 'nucleus')
  const visible = ORGANELLES.filter((o) => o.in === 'both' || o.in === type)
  const selected = visible.find((o) => o.id === sel) ?? visible[0]
  const on = (id: OrgId) => sel === id
  const stroke = (id: OrgId, base: string) => (on(id) ? '#FACC15' : base)
  const sw = (id: OrgId, base: number) => (on(id) ? base + 2 : base)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* type toggle */}
      <div className="mb-3 flex gap-2">
        {(['animal', 'plant'] as Array<CellType>).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              type === t ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {t} cell
          </button>
        ))}
      </div>

      <svg viewBox="0 0 380 300" className="w-full">
        {/* ---- cell body ---- */}
        {type === 'plant' ? (
          <>
            {/* cell wall */}
            <g onClick={() => setSel('wall')} className="cursor-pointer">
              <rect x={10} y={14} width={360} height={272} rx={14} fill="none" stroke={stroke('wall', '#3a8f4a')} strokeWidth={sw('wall', 7)} />
            </g>
            {/* membrane + cytoplasm */}
            <g onClick={() => setSel('cytoplasm')} className="cursor-pointer">
              <rect x={20} y={24} width={340} height={252} rx={9} fill="#16361f" stroke={stroke('membrane', '#2ECC71')} strokeWidth={sw('membrane', 2)} />
            </g>
            {/* membrane explicit click target */}
            <g onClick={() => setSel('membrane')} className="cursor-pointer">
              <rect x={20} y={24} width={340} height={252} rx={9} fill="none" stroke={stroke('membrane', '#2ECC71')} strokeWidth={sw('membrane', 2)} />
            </g>
            {/* vacuole */}
            <g onClick={() => setSel('vacuole')} className="cursor-pointer">
              <rect x={150} y={60} width={185} height={180} rx={26} fill="#1e5fb422" stroke={stroke('vacuole', '#4F8CFF')} strokeWidth={sw('vacuole', 2)} />
            </g>
          </>
        ) : (
          <g onClick={() => setSel('cytoplasm')} className="cursor-pointer">
            <ellipse cx={190} cy={150} rx={176} ry={132} fill="#10243a" stroke={stroke('membrane', '#4FD1C5')} strokeWidth={sw('membrane', 3)} />
          </g>
        )}

        {/* membrane click target for animal (drawn on top, no fill) */}
        {type === 'animal' && (
          <g onClick={() => setSel('membrane')} className="cursor-pointer">
            <ellipse cx={190} cy={150} rx={176} ry={132} fill="none" stroke={stroke('membrane', '#4FD1C5')} strokeWidth={sw('membrane', 3)} />
          </g>
        )}

        {/* ---- nucleus ---- */}
        <g onClick={() => setSel('nucleus')} className="cursor-pointer">
          <circle cx={type === 'plant' ? 90 : 150} cy={type === 'plant' ? 95 : 140} r={42} fill="#5b3fb0" stroke={stroke('nucleus', '#A29BFE')} strokeWidth={sw('nucleus', 3)} />
          <circle cx={type === 'plant' ? 90 : 150} cy={type === 'plant' ? 95 : 140} r={14} fill="#3a2570" />
        </g>

        {/* ---- mitochondria ---- */}
        <g onClick={() => setSel('mitochondria')} className="cursor-pointer">
          {(type === 'plant' ? [[265, 250], [95, 250]] : [[280, 120], [110, 235]]).map(([cx, cy], i) => (
            <g key={i} transform={`translate(${cx} ${cy})`}>
              <ellipse rx={26} ry={13} fill="#c0392b" stroke={stroke('mitochondria', '#ff7a66')} strokeWidth={sw('mitochondria', 2)} />
              <path d="M -18 0 Q -12 -7 -6 0 Q 0 7 6 0 Q 12 -7 18 0" fill="none" stroke="#ffd2c9" strokeWidth={1.5} />
            </g>
          ))}
        </g>

        {/* ---- rough ER + ribosomes ---- */}
        <g onClick={() => setSel('rough-er')} className="cursor-pointer">
          {(type === 'plant' ? [[150, 110], [150, 130]] : [[235, 200], [235, 220]]).map(([x, y], i) => (
            <path key={i} d={`M ${x} ${y} q 22 -10 44 0 q 22 10 44 0`} fill="none" stroke={stroke('rough-er', '#8e7bd6')} strokeWidth={sw('rough-er', 2)} />
          ))}
          {(type === 'plant' ? [[155, 108], [175, 100], [200, 104], [225, 100]] : [[240, 198], [262, 192], [288, 196], [312, 192]]).map(([cx, cy], i) => (
            <circle key={`r${i}`} cx={cx} cy={cy} r={3} fill="#cfc4f5" />
          ))}
        </g>

        {/* ---- golgi ---- */}
        <g onClick={() => setSel('golgi')} className="cursor-pointer">
          {[0, 6, 12, 18].map((dy, i) => (
            <path
              key={i}
              d={`M ${type === 'plant' ? 250 : 90} ${(type === 'plant' ? 95 : 85) + dy} q 26 -7 ${44 - i * 4} 0`}
              fill="none"
              stroke={stroke('golgi', '#f0a93b')}
              strokeWidth={sw('golgi', 2)}
            />
          ))}
        </g>

        {/* ---- chloroplasts (plant only) ---- */}
        {type === 'plant' && (
          <g onClick={() => setSel('chloroplast')} className="cursor-pointer">
            {[[60, 175], [105, 205], [70, 240]].map(([cx, cy], i) => (
              <g key={i} transform={`translate(${cx} ${cy}) rotate(${-25 + i * 20})`}>
                <ellipse rx={20} ry={10} fill="#1f8b3a" stroke={stroke('chloroplast', '#7CFC9A')} strokeWidth={sw('chloroplast', 2)} />
                {[-9, -3, 3, 9].map((ox) => (
                  <circle key={ox} cx={ox} cy={0} r={2.4} fill="#0e5021" />
                ))}
              </g>
            ))}
          </g>
        )}
      </svg>

      {/* organelle chips */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {visible.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setSel(o.id)}
            className={cn(
              'rounded-full border px-2.5 py-0.5 text-xs transition-colors',
              on(o.id) ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        <span className="font-semibold text-ink">{selected.label}: </span>
        {selected.job}
      </p>
    </div>
  )
}
