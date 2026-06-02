import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// Animated chemical synapse: an impulse arrives, vesicles release a
// neurotransmitter that crosses the cleft, binds receptors, and is reuptaken.
// A drug "mode" changes the picture — reused in Consciousness (drugs) and
// Therapy (how psychiatric medications act).
type NT = 'dopamine' | 'serotonin' | 'GABA' | 'acetylcholine'
type Mode = 'normal' | 'reuptake' | 'agonist' | 'antagonist'

const NT_INFO: Record<NT, { label: string; color: string; role: string }> = {
  dopamine: { label: 'Dopamine', color: '#FFB020', role: 'reward, motivation, movement' },
  serotonin: { label: 'Serotonin', color: '#00D2D3', role: 'mood, sleep, appetite' },
  GABA: { label: 'GABA', color: '#8E7CFF', role: 'the brain’s main brake (inhibition)' },
  acetylcholine: { label: 'Acetylcholine', color: '#2ECC71', role: 'muscles, attention, memory' },
}

const MODE_INFO: Record<Mode, string> = {
  normal: 'Normal: neurotransmitter binds briefly, then is pumped back for reuse (reuptake).',
  reuptake: 'Reuptake blocker (e.g. SSRIs): the pump is jammed, so the messenger lingers and keeps signalling.',
  agonist: 'Agonist: the drug mimics the neurotransmitter and binds the receptor itself, boosting the signal.',
  antagonist: 'Antagonist: the drug plugs receptors so the real neurotransmitter cannot bind — the signal is blocked.',
}

const W = 360
const H = 250
const TOP = 70 // bottom of presynaptic terminal
const BOTTOM = 188 // postsynaptic membrane
const SLOTS = 7
const N = 14

type Mol = { slot: number; phase: number; speed: number; drug: boolean }

export function SynapseViz() {
  const [nt, setNt] = useState<NT>('dopamine')
  const [mode, setMode] = useState<Mode>('normal')
  const ntRef = useRef(nt)
  const modeRef = useRef(mode)
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    ntRef.current = nt
  }, [nt])
  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  const slotX = (s: number) => 60 + (s * (W - 120)) / (SLOTS - 1)

  useEffect(() => {
    const mols: Array<Mol> = Array.from({ length: N }, (_, i) => ({
      slot: i % SLOTS,
      phase: i / N,
      speed: 0.18 + (i % 4) * 0.03,
      drug: i >= N - 4, // last few are "drug" molecules (used in agonist mode)
    }))

    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last) / 1000
      last = now
      const m = modeRef.current

      for (let i = 0; i < mols.length; i++) {
        const mol = mols[i]
        const isDrug = mol.drug
        // Drug molecules only appear in agonist mode.
        const active = !isDrug || m === 'agonist'
        let ph = mol.phase + mol.speed * dt

        // Reuptake blocker: molecules dwell bound (skip the return trip).
        if (m === 'reuptake' && ph > 0.55 && ph < 0.92) ph = 0.55 + (ph - 0.55) * 0.15
        if (ph >= 1) ph -= 1
        mol.phase = ph

        const el = dotRefs.current[i]
        if (!el) continue
        if (!active) {
          el.setAttribute('opacity', '0')
          continue
        }

        // 0..0.5 cross down, 0.5..0.7 bound (or stopped above if antagonist),
        // 0.7..1 reuptake back up.
        const x = slotX(mol.slot)
        let y: number
        let op = 1
        const bindY = m === 'antagonist' ? BOTTOM - 16 : BOTTOM - 4
        if (ph < 0.5) {
          y = TOP + (ph / 0.5) * (bindY - TOP)
        } else if (ph < 0.72) {
          y = bindY
        } else {
          const u = (ph - 0.72) / 0.28
          y = bindY - u * (bindY - TOP)
          op = 1 - u * 0.4
        }
        el.setAttribute('cx', x.toFixed(1))
        el.setAttribute('cy', y.toFixed(1))
        el.setAttribute('opacity', op.toFixed(2))
        el.setAttribute('fill', isDrug ? '#E84393' : NT_INFO[ntRef.current].color)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const info = NT_INFO[nt]

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="flex flex-wrap gap-2 px-1 pb-2">
        {(Object.keys(NT_INFO) as Array<NT>).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setNt(k)}
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs transition-colors',
              nt === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {NT_INFO[k].label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* presynaptic terminal */}
        <path d={`M30 10 H330 V${TOP - 14} Q330 ${TOP} 300 ${TOP} H60 Q30 ${TOP} 30 ${TOP - 14} Z`} fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
        <text x={W / 2} y={34} textAnchor="middle" fontSize="11" fill="var(--color-muted)">Sending neuron</text>
        {/* postsynaptic membrane + receptors */}
        <rect x={30} y={BOTTOM} width={300} height={52} rx={8} fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
        <text x={W / 2} y={BOTTOM + 34} textAnchor="middle" fontSize="11" fill="var(--color-muted)">Receiving neuron</text>
        {Array.from({ length: SLOTS }).map((_, s) => (
          <g key={s}>
            <rect x={slotX(s) - 7} y={BOTTOM - 6} width={14} height={10} rx={3} fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />
            {mode === 'antagonist' && (
              <text x={slotX(s)} y={BOTTOM + 1} textAnchor="middle" fontSize="10" fill="#E74C3C" fontWeight="bold">×</text>
            )}
          </g>
        ))}
        {/* molecules */}
        {Array.from({ length: N }).map((_, i) => (
          <circle key={i} ref={(el) => { dotRefs.current[i] = el }} r={5} fill={info.color} cx={-10} cy={-10} />
        ))}
      </svg>

      <div className="flex flex-wrap gap-2 px-1 pt-2">
        {(Object.keys(MODE_INFO) as Array<Mode>).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setMode(k)}
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs capitalize transition-colors',
              mode === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {k === 'reuptake' ? 'reuptake blocker' : k}
          </button>
        ))}
      </div>
      <p className="px-2 pt-2 text-sm text-muted">
        <span className="font-medium text-ink">{info.label}</span> — {info.role}.
      </p>
      <p className="px-2 pb-1 pt-1 text-sm text-muted">{MODE_INFO[mode]}</p>
    </div>
  )
}
