import { useState } from 'react'
import { gcd, lcm, primeFactorPowers, toSuperscript } from '#/lib/math'

// HCF & LCM through shared prime factors. Lay both numbers' prime factories side
// by side: the factors they SHARE multiply to the HCF; ALL factors (each taken
// to its highest power) multiply to the LCM. A Venn of primes.
function powMap(n: number) {
  const m = new Map<number, number>()
  for (const { prime, power } of primeFactorPowers(n)) m.set(prime, power)
  return m
}
const chip = (p: number, k: number) => (k > 1 ? `${p}${toSuperscript(k)}` : `${p}`)

export function HcfLcm() {
  const [a, setA] = useState(12)
  const [b, setB] = useState(18)
  const ma = powMap(a)
  const mb = powMap(b)
  const primes = [...new Set([...ma.keys(), ...mb.keys()])].sort((x, y) => x - y)

  const onlyA: Array<string> = []
  const shared: Array<string> = []
  const onlyB: Array<string> = []
  for (const p of primes) {
    const pa = ma.get(p) ?? 0
    const pb = mb.get(p) ?? 0
    const min = Math.min(pa, pb)
    if (min > 0) shared.push(chip(p, min))
    if (pa - min > 0) onlyA.push(chip(p, pa - min))
    if (pb - min > 0) onlyB.push(chip(p, pb - min))
  }

  const Col = ({ title, items, tone }: { title: string; items: Array<string>; tone: string }) => (
    <div className="flex flex-1 flex-col items-center gap-1">
      <span className="text-[11px] text-muted">{title}</span>
      <div className="flex min-h-[2rem] flex-wrap items-center justify-center gap-1">
        {items.length ? (
          items.map((c, i) => (
            <span key={i} className={`rounded-md px-2 py-0.5 font-mono text-sm ${tone}`}>
              {c}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted">—</span>
        )}
      </div>
    </div>
  )

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-stretch gap-2">
        <Col title={`only in ${a}`} items={onlyA} tone="bg-accent-2/15 text-accent-2" />
        <Col title="shared → HCF" items={shared} tone="bg-success/15 text-success" />
        <Col title={`only in ${b}`} items={onlyB} tone="bg-accent-2/15 text-accent-2" />
      </div>

      <div className="mt-3 space-y-2 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">First number</span>
          <input type="range" min={2} max={60} value={a} onChange={(e) => setA(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{a}</span>
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">Second number</span>
          <input type="range" min={2} max={60} value={b} onChange={(e) => setB(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{b}</span>
        </label>
      </div>

      <div className="mt-3 flex justify-center gap-6 text-sm">
        <span>
          <span className="text-muted">HCF = </span>
          <span className="font-mono font-semibold text-success">{gcd(a, b)}</span>
        </span>
        <span>
          <span className="text-muted">LCM = </span>
          <span className="font-mono font-semibold text-accent">{lcm(a, b)}</span>
        </span>
      </div>
      <p className="mt-1 text-center text-xs text-muted">
        HCF = product of the shared factors. LCM = HCF × the leftovers. Always: HCF × LCM = {a} × {b}.
      </p>
    </div>
  )
}
