import { useState } from 'react'
import { toBinary } from '#/lib/cs'

// To a CPU, a program is just numbers. Each instruction is one number split into
// two fields: an OPCODE saying which operation, and an OPERAND giving the value
// or address it works on. Assembly language (LOAD, ADD, …) is simply a readable
// nickname for those numbers. Pick an instruction and watch its bits light up.

type Ins = {
  mnemonic: string
  opcode: number // 0-15, 4 bits
  meaning: string
  hasOperand: boolean
  sample: number // operand value for the encoding demo
}

// A tiny made-up 8-bit instruction set: 4-bit opcode + 4-bit operand.
const SET: Array<Ins> = [
  { mnemonic: 'LOAD', opcode: 1, meaning: 'Copy a value from memory into the register', hasOperand: true, sample: 5 },
  { mnemonic: 'STORE', opcode: 2, meaning: 'Copy the register back out to memory', hasOperand: true, sample: 6 },
  { mnemonic: 'ADD', opcode: 3, meaning: 'Add a value to the register (uses the ALU)', hasOperand: true, sample: 3 },
  { mnemonic: 'SUB', opcode: 4, meaning: 'Subtract a value from the register (uses the ALU)', hasOperand: true, sample: 2 },
  { mnemonic: 'JUMP', opcode: 5, meaning: 'Continue from a different address — loops and decisions', hasOperand: true, sample: 0 },
  { mnemonic: 'HALT', opcode: 6, meaning: 'Stop. The program is finished', hasOperand: false, sample: 0 },
]

export function MachineCode() {
  const [sel, setSel] = useState(0)
  const ins = SET[sel]
  const operand = ins.hasOperand ? ins.sample : 0
  const opBits = toBinary(ins.opcode, 4)
  const argBits = toBinary(operand, 4)
  const full = ins.opcode * 16 + operand

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      {/* instruction-set table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] text-left font-mono text-sm">
          <thead>
            <tr className="text-xs text-muted">
              <th className="py-1 font-normal">opcode</th>
              <th className="py-1 font-normal">mnemonic</th>
              <th className="py-1 font-normal">meaning</th>
            </tr>
          </thead>
          <tbody>
            {SET.map((row, i) => (
              <tr
                key={row.mnemonic}
                onClick={() => setSel(i)}
                className={
                  'cursor-pointer border-t border-border transition-colors ' +
                  (i === sel ? 'bg-accent/15' : 'hover:bg-surface-2')
                }
              >
                <td className="py-1.5 text-accent-2">{toBinary(row.opcode, 4)}</td>
                <td className={'py-1.5 ' + (i === sel ? 'text-accent' : 'text-ink')}>{row.mnemonic}</td>
                <td className="py-1.5 font-sans text-xs text-muted">{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* encoding of the selected instruction */}
      <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4">
        <div className="text-center text-xs text-muted">
          assembly: <span className="font-mono font-bold text-accent">{ins.mnemonic}{ins.hasOperand ? ` ${operand}` : ''}</span>
        </div>

        <div className="mt-3 flex items-end justify-center gap-1 font-mono">
          {opBits.split('').map((b, i) => (
            <span key={'o' + i} className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-accent-2 bg-accent/10 text-sm font-bold text-accent-2">{b}</span>
          ))}
          <span className="mx-1 h-9 w-px self-stretch bg-border" />
          {argBits.split('').map((b, i) => (
            <span key={'a' + i} className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-accent bg-accent/5 text-sm font-bold text-accent">{b}</span>
          ))}
        </div>

        <div className="mt-1 flex justify-center gap-1 text-[10px] uppercase tracking-wide">
          <span className="w-[148px] text-center text-accent-2">opcode (which op)</span>
          <span className="w-[148px] text-center text-accent">operand (the value)</span>
        </div>

        <div className="mt-3 text-center text-xs text-muted">
          to the CPU this whole instruction is just the number <span className="font-mono font-bold text-ink">{full}</span>
          {' '}(binary <span className="font-mono text-ink">{toBinary(full, 8)}</span>)
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Machine code <span className="text-ink">is</span> numbers. <span className="text-ink">Assembly</span> language gives each opcode a short name so humans can read it.
      </p>
    </div>
  )
}
