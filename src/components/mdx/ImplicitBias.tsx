import { useEffect, useRef, useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'
import { mean, rng } from '#/lib/psych'

// A miniature Implicit Association Test. The learner sorts stimuli — flower vs
// insect words, and pleasant vs unpleasant words — into two response keys as fast
// as they can, across two blocks. In the "congruent" block the easy pairing
// (Flowers + Pleasant on one key) tends to feel fast; in the "incongruent" block
// (Insects + Pleasant share a key) it tends to feel slower. The GAP between mean
// reaction times is the IAT effect, taken to reflect the relative STRENGTH of
// learned associations — with a firm caveat that a single noisy run says little
// about any individual. Stimuli are deterministic via rng (no SSR mismatch);
// reaction time is measured with timestamps. Used in prejudice.

type Cat = 'flower' | 'insect' | 'pleasant' | 'unpleasant'

const WORDS: Record<Cat, Array<string>> = {
  flower: ['Rose', 'Tulip', 'Daisy', 'Lily', 'Orchid'],
  insect: ['Wasp', 'Roach', 'Maggot', 'Flea', 'Hornet'],
  pleasant: ['Joy', 'Peace', 'Love', 'Smile', 'Gift'],
  unpleasant: ['Pain', 'Hate', 'Filth', 'Grief', 'Rot'],
}

// Which side each category sits on, per block. Block 0 = congruent
// (Flowers+Pleasant left), block 1 = incongruent (Insects+Pleasant left).
const BLOCKS = [
  { left: ['flower', 'pleasant'] as Array<Cat>, right: ['insect', 'unpleasant'] as Array<Cat>, name: 'Flowers + Pleasant' },
  { left: ['insect', 'pleasant'] as Array<Cat>, right: ['flower', 'unpleasant'] as Array<Cat>, name: 'Insects + Pleasant' },
]

const PER_BLOCK = 8

type Stim = { word: string; cat: Cat }

// Build a deterministic randomized trial list for a block.
function buildTrials(seed: number): Array<Stim> {
  const next = rng(seed)
  const all: Array<Stim> = (Object.keys(WORDS) as Array<Cat>).flatMap((cat) => WORDS[cat].map((word) => ({ word, cat })))
  // Fisher–Yates with the deterministic source, then take PER_BLOCK.
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  return all.slice(0, PER_BLOCK)
}

export function ImplicitBias() {
  const [block, setBlock] = useState(0)
  const [trial, setTrial] = useState(0)
  const [started, setStarted] = useState(false)
  const [rts, setRts] = useState<[Array<number>, Array<number>]>([[], []])
  const [flash, setFlash] = useState<'ok' | 'err' | null>(null)
  const shownAt = useRef(0)

  // Deterministic trial lists, one seed per block.
  const trials = block === 0 ? buildTrials(101) : buildTrials(202)
  const cur = trials[trial]
  const b = BLOCKS[block]

  useEffect(() => {
    if (started && cur) shownAt.current = performance.now()
  }, [started, block, trial, cur])

  const answer = (side: 'left' | 'right') => {
    if (!started || !cur) return
    const correct = b[side].includes(cur.cat)
    if (!correct) {
      setFlash('err')
      return // IAT requires correcting before advancing
    }
    const rt = performance.now() - shownAt.current
    setRts((prev) => {
      const copy: [Array<number>, Array<number>] = [[...prev[0]], [...prev[1]]]
      copy[block].push(rt)
      return copy
    })
    setFlash('ok')
    if (trial + 1 < PER_BLOCK) {
      setTrial((t) => t + 1)
    } else if (block === 0) {
      setBlock(1)
      setTrial(0)
    } else {
      setStarted(false) // done
    }
  }

  // Clear the flash shortly after it appears.
  useEffect(() => {
    if (!flash) return
    const id = window.setTimeout(() => setFlash(null), 220)
    return () => window.clearTimeout(id)
  }, [flash])

  const done = !started && rts[0].length >= PER_BLOCK && rts[1].length >= PER_BLOCK
  const m0 = Math.round(mean(rts[0]))
  const m1 = Math.round(mean(rts[1]))
  const gap = m1 - m0

  const restart = () => {
    setBlock(0)
    setTrial(0)
    setRts([[], []])
    setStarted(true)
    setFlash(null)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      {!started && !done && (
        <div className="text-center">
          <p className="text-sm leading-snug text-muted">
            Sort each word as fast as you can. One key holds two categories at once. You&apos;ll do two rounds; we time how
            quickly you sort when the pairings feel natural versus mismatched.
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-3 rounded-full border border-accent bg-accent/15 px-5 py-2 text-sm font-semibold text-accent"
          >
            Start the sort
          </button>
        </div>
      )}

      {started && cur && (
        <div>
          <div className="flex items-center justify-between text-xs text-muted">
            <span>
              Round {block + 1} of 2 · {b.name}
            </span>
            <span>
              {trial + 1}/{PER_BLOCK}
            </span>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-accent">
            <span>{b.left.join(' / ')}</span>
            <span>{b.right.join(' / ')}</span>
          </div>

          <div
            className={cn(
              'my-3 rounded-xl border-2 py-8 text-center text-2xl font-bold transition-colors',
              flash === 'err'
                ? 'border-[#E74C3C] bg-[#E74C3C]/10 text-[#E74C3C]'
                : flash === 'ok'
                  ? 'border-success bg-success/10 text-ink'
                  : 'border-border bg-surface-2 text-ink',
            )}
          >
            {cur.word}
          </div>
          {flash === 'err' && <p className="-mt-2 mb-2 text-center text-xs text-[#E74C3C]">Wrong key — press the other side.</p>}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => answer('left')}
              className="rounded-xl border border-border py-3 text-sm font-semibold text-ink hover:border-accent"
            >
              ◄ Left
            </button>
            <button
              type="button"
              onClick={() => answer('right')}
              className="rounded-xl border border-border py-3 text-sm font-semibold text-ink hover:border-accent"
            >
              Right ►
            </button>
          </div>
        </div>
      )}

      {done && (
        <div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: BLOCKS[0].name, ms: m0 },
              { label: BLOCKS[1].name, ms: m1 },
            ].map((r) => (
              <div key={r.label} className="rounded-xl bg-surface-2 p-3 text-center">
                <p className="text-xs text-muted">{r.label}</p>
                <p className="font-mono text-xl font-bold text-accent">{r.ms} ms</p>
              </div>
            ))}
          </div>

          <p className="mt-3 text-sm leading-snug text-ink">
            {gap > 80
              ? `You were about ${gap} ms slower when insects shared a key with "pleasant".`
              : gap < -80
                ? `You were faster on the mismatched pairing this time — runs are noisy.`
                : `Your two rounds were close (${Math.abs(gap)} ms apart).`}{' '}
            The IAT reads a slower incongruent block as a sign that one pairing — here flowers-with-pleasant — is more
            tightly <span className="text-accent">associated</span> in your mind.
          </p>

          <div className="mt-3 flex gap-2 rounded-xl border border-warn/40 bg-warn/10 p-3 text-sm leading-snug text-ink/90">
            <span className="mt-0.5 shrink-0 text-warn">
              <Icon name="TriangleAlert" size={16} />
            </span>
            <p>
              <span className="font-semibold">Read with care.</span> A single short run like this is far too noisy to say
              anything about you. Even rigorous IATs measure the speed of learned <em>associations</em>, not hidden
              prejudice — and they predict individual behaviour only weakly. Implicit bias is real and worth studying;
              one reaction-time gap is not a verdict on a person.
            </p>
          </div>

          <button
            type="button"
            onClick={restart}
            className="mt-3 flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm text-muted hover:text-ink"
          >
            <Icon name="RefreshCw" size={14} /> Run it again
          </button>
        </div>
      )}
    </div>
  )
}
