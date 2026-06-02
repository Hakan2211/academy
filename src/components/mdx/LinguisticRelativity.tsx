import { useMemo, useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'
import { clamp, lerp } from '#/lib/psych'

// The Russian-blues experiment (Winawer et al., 2007). Russian has two distinct
// basic colour words — goluboy (light blue) and siniy (dark blue) — where
// English has just "blue". When two shades fall on OPPOSITE sides of that
// lexical boundary, Russian speakers tell them apart faster than English
// speakers; when both shades are the same Russian word, the advantage vanishes.
// Here the user slides two squares along a light->dark blue continuum and
// toggles their "language". We simulate the discrimination reaction time: the
// boundary speeds you up only if your language draws a line there. A gentle,
// honest demo of weak linguistic relativity — language nudges perception at the
// margins; it doesn't imprison it.
// Used in language-and-mind.

type Lang = 'english' | 'russian'

// Russian boundary between goluboy/siniy sits around the middle of the range.
const BOUNDARY = 0.5

function shade(t: number): string {
  // t in [0,1]: 0 = light blue (goluboy), 1 = dark blue (siniy)
  const l = lerp(78, 28, t) // lightness %
  return `hsl(212 85% ${l}%)`
}

function nameFor(t: number, lang: Lang): string {
  if (lang === 'english') return 'blue'
  return t < BOUNDARY ? 'goluboy (light blue)' : 'siniy (dark blue)'
}

export function LinguisticRelativity() {
  const [a, setA] = useState(0.38)
  const [b, setB] = useState(0.62)
  const [lang, setLang] = useState<Lang>('russian')

  const crossesBoundary = (a < BOUNDARY) !== (b < BOUNDARY)
  const perceptualDist = Math.abs(a - b)

  // Simulated reaction time (ms): everyone is faster when shades are far apart.
  // For Russian speakers, crossing the lexical boundary gives an extra speed-up
  // (a "categorical perception" bonus). English speakers get no such bonus.
  const rt = useMemo(() => {
    let ms = lerp(900, 540, clamp(perceptualDist * 3, 0, 1))
    if (lang === 'russian' && crossesBoundary) ms -= 90
    return Math.round(ms)
  }, [perceptualDist, crossesBoundary, lang])

  const sameWord = nameFor(a, lang) === nameFor(b, lang)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {(['english', 'russian'] as Array<Lang>).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              lang === l ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {l === 'english' ? 'English speaker' : 'Russian speaker'}
          </button>
        ))}
      </div>

      {/* the two squares + the continuum strip */}
      <div className="rounded-xl bg-surface-2 p-4">
        <div className="flex items-center justify-center gap-6">
          {[
            { t: a, name: nameFor(a, lang) },
            { t: b, name: nameFor(b, lang) },
          ].map((sq, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="h-16 w-16 rounded-lg border border-border" style={{ background: shade(sq.t) }} />
              <span className="text-xs text-muted">{sq.name}</span>
            </div>
          ))}
        </div>

        {/* the continuum with the lexical boundary marked */}
        <div className="relative mt-4 h-4 w-full overflow-hidden rounded-full" style={{ background: 'linear-gradient(90deg, hsl(212 85% 78%), hsl(212 85% 28%))' }}>
          {lang === 'russian' && (
            <div className="absolute top-0 h-full w-0.5 bg-white" style={{ left: `${BOUNDARY * 100}%` }} />
          )}
        </div>
        {lang === 'russian' && (
          <p className="mt-1 text-center text-[11px] text-muted">↑ goluboy / siniy boundary in Russian</p>
        )}
      </div>

      <div className="mt-3 space-y-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="flex items-center justify-between text-muted">
            <span>Square 1 shade</span>
            <span className="font-mono text-ink">{a.toFixed(2)}</span>
          </span>
          <input type="range" min={0} max={1} step={0.01} value={a} onChange={(e) => setA(Number(e.target.value))} className="accent-accent" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="flex items-center justify-between text-muted">
            <span>Square 2 shade</span>
            <span className="font-mono text-ink">{b.toFixed(2)}</span>
          </span>
          <input type="range" min={0} max={1} step={0.01} value={b} onChange={(e) => setB(Number(e.target.value))} className="accent-accent" />
        </label>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl bg-surface-2 p-3">
        <span className="flex items-center gap-1.5 text-sm text-muted">
          <Icon name="Timer" size={15} /> Time to tell them apart
        </span>
        <span className={cn('font-mono text-lg font-bold', lang === 'russian' && crossesBoundary ? 'text-success' : 'text-ink')}>
          {rt} ms
        </span>
      </div>

      <p className="mt-2 text-sm leading-snug text-muted">
        {lang === 'russian' && crossesBoundary ? (
          <>These two shades sit on <span className="text-ink">opposite sides</span> of the goluboy/siniy line, so a
          Russian speaker labels them differently and spots the difference <span className="text-success">faster</span>.</>
        ) : sameWord ? (
          <>Both squares get the <span className="text-ink">same word</span> ({nameFor(a, lang)}), so naming gives no
          shortcut — speed depends only on how different the shades actually look.</>
        ) : (
          <>For an English speaker both are just "<span className="text-ink">blue</span>". With no lexical line to cross,
          there's no naming bonus — only raw perceptual distance matters.</>
        )}
      </p>

      <div className="mt-3 rounded-xl border border-border bg-surface-2 p-3 text-sm text-muted">
        This is <span className="text-accent">weak linguistic relativity</span>: the words a language hands you can
        sharpen the boundaries you notice. It's a <span className="text-ink">nudge, not a cage</span> — Russians and
        English speakers both <em>see</em> every shade; the categories just make some differences pop a little faster.
      </div>
    </div>
  )
}
