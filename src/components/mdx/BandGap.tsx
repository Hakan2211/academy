import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'

type Mat = 'conductor' | 'semiconductor' | 'insulator'

type Cfg = { cTop: number; cBot: number; vTop: number; vBot: number; gap: string; note: string }
const CFG: Record<Mat, Cfg> = {
  conductor: { cTop: 64, cBot: 112, vTop: 112, vBot: 160, gap: 'none — the bands overlap', note: 'A metal: the conduction band is already partly full, so electrons move at the slightest push. Always conducts.' },
  semiconductor: { cTop: 56, cBot: 96, vTop: 150, vBot: 190, gap: 'small (~1 eV)', note: 'Cold, it acts like an insulator. Add heat or dopant atoms and electrons leap the small gap — leaving mobile holes behind. This switchable conduction is the whole basis of the chip.' },
  insulator: { cTop: 44, cBot: 82, vTop: 168, vBot: 206, gap: 'huge (~5 eV)', note: 'The gap is far too wide for ordinary heat to bridge, so the conduction band stays empty. No current flows.' },
}

const NE = 8
const x0 = 132
const x1 = 312
const exFor = (i: number) => x0 + (i * (x1 - x0)) / (NE - 1)

// Why is copper a conductor, glass an insulator, and silicon something you can switch
// between the two? Electrons can only occupy certain energy *bands*. What matters is the
// gap above the filled band. No gap → always conducts. Small gap → conducts on demand.
// Big gap → never. Slide the temperature on the semiconductor and watch electrons jump.
export function BandGap() {
  const [mat, setMat] = useState<Mat>('semiconductor')
  const [t, setT] = useState(30)
  const c = CFG[mat]

  const promoted = mat === 'conductor' ? 4 : mat === 'insulator' ? 0 : Math.round((t / 100) * 4)
  const conducts = mat === 'conductor' || promoted > 0
  const cMid = (c.cTop + c.cBot) / 2
  const vMid = (c.vTop + c.vBot) / 2

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap items-center gap-2 p-3">
        {(['conductor', 'semiconductor', 'insulator'] as Array<Mat>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMat(m)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              mat === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {m}
          </button>
        ))}
        <span
          className={cn('ml-auto rounded-full px-3 py-1 text-xs font-semibold', conducts ? 'bg-success/15 text-success' : 'bg-surface-2 text-muted')}
        >
          {conducts ? '⚡ conducts' : '∅ no current'}
        </span>
      </div>

      <svg viewBox="0 0 360 230" className="w-full">
        {/* energy axis */}
        <line x1="40" y1="30" x2="40" y2="214" stroke="var(--color-muted)" strokeWidth="1.5" />
        <text x="34" y="26" textAnchor="end" fontSize="10" fill="var(--color-muted)">energy</text>
        <polygon points="40,26 36,34 44,34" fill="var(--color-muted)" />

        {/* conduction band */}
        <rect x="60" y={c.cTop} width="280" height={c.cBot - c.cTop} rx="6" fill="#74b9ff22" stroke="#74b9ff" strokeWidth="1.5" />
        <text x="66" y={c.cTop - 4} fontSize="10" fill="#74b9ff">conduction band (empty)</text>

        {/* the gap */}
        <line x1="50" y1={c.cBot} x2="50" y2={c.vTop} stroke="var(--color-warn)" strokeWidth="1" strokeDasharray="3 3" />
        <text x="46" y={(c.cBot + c.vTop) / 2 + 3} textAnchor="end" fontSize="9" fill="var(--color-warn)">gap</text>

        {/* valence band */}
        <rect x="60" y={c.vTop} width="280" height={c.vBot - c.vTop} rx="6" fill="#a29bfe22" stroke="#a29bfe" strokeWidth="1.5" />
        <text x="66" y={c.vBot + 13} fontSize="10" fill="#a29bfe">valence band (filled)</text>

        {/* electrons */}
        {Array.from({ length: NE }).map((_, i) => {
          const up = i < promoted
          return up ? (
            <g key={i}>
              {/* promoted electron */}
              <circle cx={exFor(i)} cy={cMid} r="5" fill="#74b9ff" stroke="#fff" strokeWidth="0.6" />
              {/* hole left behind */}
              <circle cx={exFor(i)} cy={vMid} r="5" fill="none" stroke="var(--color-muted)" strokeWidth="1.5" strokeDasharray="2 2" />
              {/* jump arrow */}
              <line x1={exFor(i)} y1={vMid - 6} x2={exFor(i)} y2={cMid + 6} stroke="#74b9ff" strokeWidth="1" opacity="0.5" />
            </g>
          ) : (
            <circle key={i} cx={exFor(i)} cy={mat === 'conductor' && i % 2 === 0 ? cMid : vMid} r="5" fill="#a29bfe" stroke="#fff" strokeWidth="0.6" />
          )
        })}
      </svg>

      <div className="px-4 pt-1">
        <SceneSlider label="Temperature / doping" value={t} min={0} max={100} step={5} unit="%" onChange={setT} />
        <p className="mt-2 pb-4 text-center text-sm text-muted">
          Band gap: <span className="font-semibold text-ink">{c.gap}</span>. {c.note}
        </p>
      </div>
    </div>
  )
}
