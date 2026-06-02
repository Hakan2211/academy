import { useState } from 'react'
import { cn } from '#/lib/cn'

// One fat table repeats the same customer name and address on every order. That
// redundancy causes ANOMALIES: change Ada's address and you must edit it in many
// rows — miss one and the data disagrees with itself. NORMALISATION splits the
// data into clean linked tables so each fact is stored exactly once. Toggle
// before/after to see the duplication disappear.

const FLAT = [
  { order: 'A-90', name: 'Ada', city: 'Lagos', item: 'Keyboard' },
  { order: 'A-91', name: 'Bao', city: 'Hanoi', item: 'Monitor' },
  { order: 'A-92', name: 'Ada', city: 'Lagos', item: 'Mouse' },
  { order: 'A-93', name: 'Ada', city: 'Lagos', item: 'Webcam' },
  { order: 'A-94', name: 'Bao', city: 'Hanoi', item: 'Cable' },
]

// Normalised: customers stored once, orders reference them by id.
const CUSTOMERS = [
  { id: 1, name: 'Ada', city: 'Lagos' },
  { id: 2, name: 'Bao', city: 'Hanoi' },
]
const ORDERS = [
  { order: 'A-90', customerId: 1, item: 'Keyboard' },
  { order: 'A-91', customerId: 2, item: 'Monitor' },
  { order: 'A-92', customerId: 1, item: 'Mouse' },
  { order: 'A-93', customerId: 1, item: 'Webcam' },
  { order: 'A-94', customerId: 2, item: 'Cable' },
]

export function NormalizationViz() {
  const [after, setAfter] = useState(false)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex justify-center gap-2">
        {([['Before', false], ['After', true]] as const).map(([label, v]) => (
          <button
            key={label}
            type="button"
            onClick={() => setAfter(v)}
            className={cn(
              'rounded-full border px-4 py-1 text-sm transition-colors',
              after === v ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {!after ? (
        <div className="mt-3">
          <div className="mb-1 text-xs font-semibold text-warn">One table — name &amp; city repeated</div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[380px] text-left text-sm">
              <thead>
                <tr className="text-xs text-muted">
                  <th className="px-2 py-1 font-normal">order</th>
                  <th className="px-2 py-1 font-normal">name</th>
                  <th className="px-2 py-1 font-normal">city</th>
                  <th className="px-2 py-1 font-normal">item</th>
                </tr>
              </thead>
              <tbody>
                {FLAT.map((r) => {
                  const dup = r.name === 'Ada'
                  return (
                    <tr key={r.order} className="border-t border-border">
                      <td className="px-2 py-1 text-ink">{r.order}</td>
                      <td className={cn('px-2 py-1', dup ? 'bg-warn/10 text-warn' : 'text-ink')}>{r.name}</td>
                      <td className={cn('px-2 py-1', dup ? 'bg-warn/10 text-warn' : 'text-ink')}>{r.city}</td>
                      <td className="px-2 py-1 text-ink">{r.item}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-warn">
            Ada's name and city are stored 3 times. If she moves city, you must update every copy — an{' '}
            <span className="font-semibold">update anomaly</span> waiting to happen.
          </p>
        </div>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-1 text-xs font-semibold text-success">Customers — each fact once</div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-muted">
                  <th className="px-2 py-1 font-mono font-normal text-accent">id</th>
                  <th className="px-2 py-1 font-normal">name</th>
                  <th className="px-2 py-1 font-normal">city</th>
                </tr>
              </thead>
              <tbody>
                {CUSTOMERS.map((c) => (
                  <tr key={c.id} className="border-t border-border bg-success/5">
                    <td className="px-2 py-1 font-mono font-semibold text-accent">{c.id}</td>
                    <td className="px-2 py-1 text-ink">{c.name}</td>
                    <td className="px-2 py-1 text-ink">{c.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold text-success">Orders — link by key</div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-muted">
                  <th className="px-2 py-1 font-normal">order</th>
                  <th className="px-2 py-1 font-mono font-normal text-accent-2">customer_id</th>
                  <th className="px-2 py-1 font-normal">item</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.map((o) => (
                  <tr key={o.order} className="border-t border-border">
                    <td className="px-2 py-1 text-ink">{o.order}</td>
                    <td className="px-2 py-1 font-mono font-semibold text-accent-2">{o.customerId}</td>
                    <td className="px-2 py-1 text-ink">{o.item}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {after && (
        <p className="mt-2 text-xs text-success">
          Now Ada's city lives in exactly one row. Change it once and every order sees the update — no anomalies, no contradictions.
        </p>
      )}

      <p className="mt-3 text-center text-xs text-muted">
        <span className="text-ink">Normalisation</span> splits a redundant table into related ones so each fact is stored{' '}
        <span className="text-ink">once</span>, linked by keys. Less duplication, no update anomalies.
      </p>
    </div>
  )
}
