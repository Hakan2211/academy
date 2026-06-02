import { useState } from 'react'

// A Punnett square: set each parent's two alleles and see the predicted
// offspring. Click an allele to flip it. Used for Mendel's crosses and beyond.
function combine(a: string, b: string, dom: string) {
  // dominant allele written first
  return a === dom || b === dom ? (a === dom ? a + b : b + a) : a + b
}

export function PunnettSquare({
  dom = 'B',
  rec = 'b',
  trait = 'flower colour',
  domPheno = 'purple',
  recPheno = 'white',
  parent1 = ['B', 'b'],
  parent2 = ['B', 'b'],
}: {
  dom?: string
  rec?: string
  trait?: string
  domPheno?: string
  recPheno?: string
  parent1?: Array<string>
  parent2?: Array<string>
}) {
  const [p1, setP1] = useState(parent1)
  const [p2, setP2] = useState(parent2)

  const flip = (which: 1 | 2, idx: number) => {
    const set = which === 1 ? setP1 : setP2
    set((cur) => cur.map((a, i) => (i === idx ? (a === dom ? rec : dom) : a)))
  }

  const cells = p1.flatMap((a) => p2.map((b) => combine(a, b, dom)))
  const domCount = cells.filter((g) => g.includes(dom)).length
  const recCount = 4 - domCount

  const ratio =
    domCount === 4 ? `all ${domPheno}` : recCount === 4 ? `all ${recPheno}` : `${domCount} ${domPheno} : ${recCount} ${recPheno}`

  const AlleleBtn = ({ which, idx, val }: { which: 1 | 2; idx: number; val: string }) => (
    <button
      type="button"
      onClick={() => flip(which, idx)}
      className="grid h-9 w-9 place-items-center rounded-lg text-lg font-bold text-white transition-transform hover:scale-105"
      style={{ background: val === dom ? '#4F8CFF' : '#64748b' }}
    >
      {val}
    </button>
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-center text-sm text-muted">
        Trait: <span className="text-ink">{trait}</span> · <span className="text-[#4F8CFF] font-semibold">{dom}</span> ({domPheno}) is dominant over <span className="font-semibold text-slate-400">{rec}</span> ({recPheno})
      </p>

      <div className="mx-auto grid w-[220px] grid-cols-[40px_1fr_1fr] gap-1.5">
        {/* corner + parent 2 header */}
        <div />
        <div className="flex justify-center"><AlleleBtn which={2} idx={0} val={p2[0]} /></div>
        <div className="flex justify-center"><AlleleBtn which={2} idx={1} val={p2[1]} /></div>

        {/* rows */}
        {[0, 1].map((r) => (
          <Row key={r}>
            <div className="flex items-center justify-center"><AlleleBtn which={1} idx={r} val={p1[r]} /></div>
            {[0, 1].map((c) => {
              const g = combine(p1[r], p2[c], dom)
              const isDom = g.includes(dom)
              return (
                <div
                  key={c}
                  className="grid h-12 place-items-center rounded-lg border text-base font-bold"
                  style={{
                    borderColor: isDom ? '#4F8CFF55' : '#64748b55',
                    background: isDom ? '#4F8CFF18' : '#64748b18',
                    color: isDom ? '#9cc4ff' : '#cbd5e1',
                  }}
                >
                  {g}
                </div>
              )
            })}
          </Row>
        ))}
      </div>

      <p className="mt-3 text-center text-sm">
        <span className="text-muted">Predicted offspring: </span>
        <span className="font-semibold text-ink">{ratio}</span>
      </p>
    </div>
  )
}

// keeps the 3-col grid flowing (children are placed into the parent grid)
function Row({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
