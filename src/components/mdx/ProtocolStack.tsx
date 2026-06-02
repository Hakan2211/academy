import { useState } from 'react'
import { cn } from '#/lib/cn'

// The internet is organised as a stack of layers, each speaking its own
// protocol. As a message travels DOWN the sender's stack, every layer wraps it
// in a header (encapsulation); travelling UP the receiver's stack, each layer
// peels its own header off (decapsulation). Crucially, every layer only ever
// "talks to" its peer on the other side. Step through, or click a layer for its job.

type Layer = { key: string; name: string; job: string; header: string; color: string }

// Simplified TCP/IP model, top (closest to you) -> bottom (the wire).
const LAYERS: Array<Layer> = [
  { key: 'app', name: 'Application', job: 'Your actual message — a web page request, an email, a chat. Speaks HTTP, SMTP, DNS…', header: 'DATA', color: '#FF6B6B' },
  { key: 'transport', name: 'Transport', job: 'TCP splits data into segments, numbers them for reliable, in-order delivery, and adds PORT numbers so the right app gets it. (UDP trades that safety for speed.)', header: 'TCP', color: '#FFC83D' },
  { key: 'internet', name: 'Internet', job: 'IP wraps each segment in a packet stamped with source + destination IP ADDRESSES, so routers can forward it across networks.', header: 'IP', color: '#2ECC71' },
  { key: 'link', name: 'Link', job: 'Turns the packet into signals on the actual medium — Wi-Fi, Ethernet, fibre — hop by hop to the next device.', header: 'FRAME', color: '#5B6CFF' },
]

export function ProtocolStack() {
  // step 0..3 going down (encapsulation), 4 = on the wire, 5..8 going up.
  const [step, setStep] = useState(0)
  const [sel, setSel] = useState(0)

  const goingDown = step <= 3
  const onWire = step === 4
  // how many headers are currently attached (max 4)
  const wrapped = step <= 4 ? step : 8 - step

  const phase = onWire ? 'wire' : goingDown ? 'down' : 'up'
  const activeLayer = onWire ? -1 : goingDown ? step : 8 - step

  function next() {
    setStep((s) => {
      const n = (s + 1) % 9
      const al = n === 4 ? -1 : n <= 3 ? n : 8 - n
      if (al >= 0) setSel(al)
      return n
    })
  }

  const phaseCopy =
    phase === 'down'
      ? 'Sender — going DOWN: each layer adds its own header (encapsulation).'
      : phase === 'wire'
        ? 'The fully wrapped packet crosses the network as bits on the wire.'
        : 'Receiver — going UP: each layer strips its own header (decapsulation).'

  const l = LAYERS[sel]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-4 sm:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="space-y-1.5">
            {LAYERS.map((layer, i) => {
              const active = activeLayer === i
              return (
                <button
                  key={layer.key}
                  type="button"
                  onClick={() => setSel(i)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg border-2 px-3 py-2 text-left transition-all',
                    sel === i ? 'bg-surface-2' : 'border-transparent bg-surface-2/40 hover:bg-surface-2',
                  )}
                  style={{ borderColor: sel === i ? layer.color : 'transparent' }}
                >
                  <span className={cn('text-sm', sel === i ? 'font-semibold text-ink' : 'text-muted')}>{layer.name}</span>
                  {active && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: layer.color, color: '#0a0f1f' }}>
                      {phase === 'down' ? '+ add header' : '− strip header'}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* the message + nested headers it currently carries. wrapped = how
              many of {Transport, Internet, Link} headers are attached; drawn
              outer-to-inner so it reads FRAME IP TCP DATA. */}
          <div className="mt-3 flex items-center justify-center gap-0.5 font-mono text-[10px]">
            {[3, 2, 1].map((idx) => {
              if (idx > wrapped) return null
              const layer = LAYERS[idx]
              return (
                <span key={layer.key} className="rounded px-1 py-1 font-bold" style={{ background: layer.color, color: '#0a0f1f' }}>
                  {layer.header}
                </span>
              )
            })}
            <span className="rounded px-2 py-1 font-bold" style={{ background: LAYERS[0].color, color: '#0a0f1f' }}>DATA</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface-2 p-4">
          <div className="flex items-center gap-2">
            <span className="rounded-md px-2 py-1 text-xs font-bold" style={{ background: l.color, color: '#0a0f1f' }}>{l.header}</span>
            <div className="font-semibold text-ink">{l.name}</div>
          </div>
          <p className="mt-2 text-sm text-ink/90">{l.job}</p>
          <p className="mt-2 text-xs text-muted">
            This layer only ever talks to the <span className="text-ink">matching {l.name} layer</span> on the other side.
          </p>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">{phaseCopy}</p>

      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={next}
          className="rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm text-accent transition-colors"
        >
          {step === 0 ? 'Start: send a message' : step === 8 ? 'Restart' : 'Next step'}
        </button>
      </div>
    </div>
  )
}
