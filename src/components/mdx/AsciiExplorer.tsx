import { useState } from 'react'
import { toBinary, toHex } from '#/lib/cs'

// Text is just numbers in disguise. Each character has an agreed code (ASCII /
// Unicode); that code is stored as bits like any other number. Type something
// and watch every character become a code, a hex value, and 8 bits.

export function AsciiExplorer() {
  const [text, setText] = useState('Hi!')
  const chars = [...text].slice(0, 12)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Type a short message</span>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={12}
          className="rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-ink outline-none focus:border-accent"
          placeholder="Type here…"
        />
      </label>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[320px] text-center font-mono text-sm">
          <thead>
            <tr className="text-xs text-muted">
              <th className="py-1 font-normal">char</th>
              <th className="py-1 font-normal">code</th>
              <th className="py-1 font-normal">hex</th>
              <th className="py-1 font-normal">binary (8 bits)</th>
            </tr>
          </thead>
          <tbody>
            {chars.map((ch, i) => {
              const code = ch.codePointAt(0) ?? 0
              return (
                <tr key={i} className="border-t border-border">
                  <td className="py-1.5 text-lg text-accent">{ch === ' ' ? '␣' : ch}</td>
                  <td className="py-1.5 text-ink">{code}</td>
                  <td className="py-1.5 text-muted">{code <= 255 ? toHex(code, 2) : code.toString(16).toUpperCase()}</td>
                  <td className="py-1.5 text-accent-2">{code <= 255 ? toBinary(code, 8) : 'needs >1 byte'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Codes 0–127 are <span className="text-ink">ASCII</span> (English letters, digits, punctuation). <span className="text-ink">Unicode</span> extends this to every language and emoji — using more than one byte per character.
      </p>
    </div>
  )
}
