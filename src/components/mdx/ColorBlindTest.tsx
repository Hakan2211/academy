import { useMemo, useState } from 'react'
import { cn } from '#/lib/cn'
import { rng } from '#/lib/psych'

// An Ishihara-style plate, built from a field of coloured SVG dots with a digit
// hidden inside them. Normally the digit pops in a contrasting hue; flip the
// "red-green colour blindness" toggle and figure + ground collapse to the same
// muted tone, so the number vanishes — the everyday experience of the ~8% of
// men with red-green colour deficiency. Dot layout uses a deterministic rng so
// it is identical on server and client (no Math.random in render).

// 5×7 bitmaps for the digits we show.
const GLYPHS: Record<string, Array<string>> = {
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
}

const PLATES = ['2', '5', '7']

type Dot = { x: number; y: number; r: number; inFig: boolean }

const W = 240
const COLS = 22
const ROWS = 22
const CELL = W / COLS

function inGlyph(glyph: Array<string>, gx: number, gy: number): boolean {
  // Map a 0..1 position onto the 5×7 glyph, centred.
  const cx = Math.floor(gx * 5)
  const cy = Math.floor(gy * 7)
  const row = glyph[cy]
  return Boolean(row && row[cx] === '1')
}

function buildDots(seed: number, glyph: Array<string>): Array<Dot> {
  const next = rng(seed)
  const dots: Array<Dot> = []
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const jx = (next() - 0.5) * CELL * 0.5
      const jy = (next() - 0.5) * CELL * 0.5
      const x = col * CELL + CELL / 2 + jx
      const y = row * CELL + CELL / 2 + jy
      const r = CELL * (0.28 + next() * 0.16)
      // Only keep dots inside the circular plate.
      const dx = x - W / 2
      const dy = y - W / 2
      if (Math.hypot(dx, dy) > W / 2 - 4) continue
      // Glyph region: inset box in the middle of the plate.
      const gx = (x - W * 0.28) / (W * 0.44)
      const gy = (y - W * 0.18) / (W * 0.64)
      const inFig = gx >= 0 && gx < 1 && gy >= 0 && gy < 1 && inGlyph(glyph, gx, gy)
      dots.push({ x, y, r, inFig })
    }
  }
  return dots
}

export function ColorBlindTest() {
  const [plate, setPlate] = useState(0)
  const [blind, setBlind] = useState(false)

  const digit = PLATES[plate]
  const dots = useMemo(() => buildDots(1234 + plate * 97, GLYPHS[digit]), [plate, digit])

  // Background dots cycle warm tans/oranges; figure dots are green (normal) or,
  // when "blind", the same warm palette so they merge in.
  const bgPalette = ['#C9A36B', '#D8B07A', '#E0BE8C', '#C08B5C', '#D4A56A']
  const figPaletteNormal = ['#6BBF59', '#7FC96A', '#5DA94E', '#8AD17A']
  const next = rng(99 + plate)

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {PLATES.map((d, i) => (
          <button
            key={d}
            type="button"
            onClick={() => setPlate(i)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              plate === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            Plate {i + 1}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setBlind((v) => !v)}
          className={cn(
            'ml-auto rounded-full border px-3 py-1 text-sm transition-colors',
            blind ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          Red-green colour blindness
        </button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <svg viewBox={`0 0 ${W} ${W}`} className="w-full max-w-[260px]">
          <circle cx={W / 2} cy={W / 2} r={W / 2 - 2} fill="#F3E9D6" />
          {dots.map((d, i) => {
            const fill = d.inFig
              ? blind
                ? bgPalette[Math.floor(next() * bgPalette.length)]
                : figPaletteNormal[Math.floor(next() * figPaletteNormal.length)]
              : bgPalette[Math.floor(next() * bgPalette.length)]
            return <circle key={i} cx={d.x.toFixed(1)} cy={d.y.toFixed(1)} r={d.r.toFixed(1)} fill={fill} />
          })}
        </svg>

        <p className="text-center text-sm text-muted">
          {blind ? (
            <>With red-green deficiency the figure dots and background dots look the <span className="font-semibold text-ink">same</span> — the number simply isn't there.</>
          ) : (
            <>Can you read the number? (It's a <span className="font-semibold text-accent">{digit}</span>.) The green figure dots pop against the warm background.</>
          )}
        </p>
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 p-3 text-sm text-muted">
        Most red-green colour blindness comes from a <span className="text-ink">missing or shifted cone pigment</span> (usually on the X chromosome — why it's far more common in men). The eye still sees; it just can't separate certain red and green hues, so a figure built only from that contrast becomes invisible.
      </div>
    </div>
  )
}
