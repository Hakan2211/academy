import { useState } from 'react'
import { cn } from '#/lib/cn'

// Normalisation splits data across tables; a JOIN recombines it on demand. We
// match rows where Orders.customer_id equals Customers.customer_id (the shared
// key), gluing each order to the customer who placed it. Step through to watch
// the engine pair up matching keys and build one combined result table.

const CUSTOMERS = [
  { id: 1, name: 'Ada' },
  { id: 2, name: 'Bao' },
  { id: 3, name: 'Esi' },
]

const ORDERS = [
  { order: 'A-90', customerId: 1, item: 'Keyboard' },
  { order: 'A-91', customerId: 3, item: 'Monitor' },
  { order: 'A-92', customerId: 1, item: 'Mouse' },
  { order: 'A-93', customerId: 2, item: 'Webcam' },
]

export function JoinViz() {
  // step 0 = nothing matched yet; 1..ORDERS.length = that many orders joined.
  const [step, setStep] = useState(0)
  const done = Math.min(step, ORDERS.length)
  const activeIdx = step >= 1 && step <= ORDERS.length ? step - 1 : -1
  const activeCustomerId = activeIdx >= 0 ? ORDERS[activeIdx].customerId : null

  const joined = ORDERS.slice(0, done).map((o) => ({
    ...o,
    name: CUSTOMERS.find((c) => c.id === o.customerId)?.name ?? '?',
  }))

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1 text-xs font-semibold text-muted">Customers</div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-muted">
                <th className="px-2 py-1 font-mono font-normal text-accent">customer_id</th>
                <th className="px-2 py-1 font-normal">name</th>
              </tr>
            </thead>
            <tbody>
              {CUSTOMERS.map((c) => (
                <tr
                  key={c.id}
                  className={cn(
                    'border-t border-border transition-colors',
                    activeCustomerId === c.id ? 'bg-accent/15' : '',
                  )}
                >
                  <td className="px-2 py-1 font-mono font-semibold text-accent">{c.id}</td>
                  <td className="px-2 py-1 text-ink">{c.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div className="mb-1 text-xs font-semibold text-muted">Orders</div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-muted">
                <th className="px-2 py-1 font-normal">order</th>
                <th className="px-2 py-1 font-mono font-normal text-accent-2">customer_id</th>
                <th className="px-2 py-1 font-normal">item</th>
              </tr>
            </thead>
            <tbody>
              {ORDERS.map((o, i) => (
                <tr
                  key={o.order}
                  className={cn(
                    'border-t border-border transition-colors',
                    i === activeIdx ? 'bg-accent/15' : i < done ? 'opacity-50' : '',
                  )}
                >
                  <td className="px-2 py-1 text-ink">{o.order}</td>
                  <td className="px-2 py-1 font-mono font-semibold text-accent-2">{o.customerId}</td>
                  <td className="px-2 py-1 text-ink">{o.item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:text-ink"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(ORDERS.length, s + 1))}
          className="rounded-full border border-accent bg-accent/15 px-3 py-1 text-sm font-semibold text-accent"
        >
          {done >= ORDERS.length ? 'All joined' : 'Match next row'}
        </button>
      </div>

      <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-surface-2 p-2 text-center font-mono text-xs text-muted">
        <span className="text-accent">SELECT</span> * <span className="text-accent">FROM</span> orders{'\n'}
        <span className="text-accent">JOIN</span> customers <span className="text-accent">ON</span> orders.customer_id ={' '}
        customers.customer_id<span className="text-muted">;</span>
      </pre>

      <div className="mt-3">
        <div className="mb-1 text-xs font-semibold text-success">Joined result</div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-muted">
              <th className="px-2 py-1 font-normal">order</th>
              <th className="px-2 py-1 font-normal">name</th>
              <th className="px-2 py-1 font-normal">item</th>
            </tr>
          </thead>
          <tbody>
            {joined.length === 0 && (
              <tr className="border-t border-border">
                <td colSpan={3} className="px-2 py-2 text-center text-muted">
                  Step through to build the joined table…
                </td>
              </tr>
            )}
            {joined.map((r) => (
              <tr key={r.order} className="border-t border-border bg-success/5">
                <td className="px-2 py-1 text-ink">{r.order}</td>
                <td className="px-2 py-1 font-semibold text-success">{r.name}</td>
                <td className="px-2 py-1 text-ink">{r.item}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        A <span className="text-ink">join</span> matches rows on a shared key (customer_id) to recombine separately stored data into one
        answer — pulling each customer's name into their orders.
      </p>
    </div>
  )
}
