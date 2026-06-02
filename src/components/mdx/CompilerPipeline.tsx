import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The CPU only runs machine code, so high-level source must be TRANSLATED. A
// compiler does it in stages: the lexer splits text into TOKENS, the parser
// arranges them into a SYNTAX TREE, then code generation emits MACHINE CODE.
// Step through the pipeline. The toggle contrasts COMPILED (translate it all up
// front, then run fast) with INTERPRETED (translate and run line-by-line).

type Mode = 'compiled' | 'interpreted'

type Stage = { key: string; name: string; icon: string; body: Array<string>; note: string }

const STAGES: Array<Stage> = [
  {
    key: 'source',
    name: 'Source code',
    icon: 'FileCode2',
    body: ['x = 2 + 3'],
    note: 'What you wrote — human-readable text. The CPU cannot run this directly.',
  },
  {
    key: 'tokens',
    name: 'Lexer → tokens',
    icon: 'Scan',
    body: ['x', '=', '2', '+', '3'],
    note: 'The lexer chops the text into tokens: the smallest meaningful pieces.',
  },
  {
    key: 'tree',
    name: 'Parser → syntax tree',
    icon: 'GitFork',
    body: ['= ', '├─ x', '└─ +', '   ├─ 2', '   └─ 3'],
    note: 'The parser checks the grammar and builds a tree showing structure.',
  },
  {
    key: 'codegen',
    name: 'Code generation',
    icon: 'Cpu',
    body: ['LOAD 2', 'ADD 3', 'STORE x'],
    note: 'Each part of the tree becomes simple CPU instructions.',
  },
  {
    key: 'machine',
    name: 'Machine code',
    icon: 'Binary',
    body: ['0001 0010', '0010 0011', '0011 1010'],
    note: 'The final binary the CPU actually fetches and executes (World 4).',
  },
]

export function CompilerPipeline() {
  const [mode, setMode] = useState<Mode>('compiled')
  const [stage, setStage] = useState(0)
  const s = STAGES[stage]
  const done = stage === STAGES.length - 1

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex justify-center gap-2">
        {(['compiled', 'interpreted'] as Array<Mode>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Stage rail */}
      <div className="mt-4 flex items-center justify-between gap-1">
        {STAGES.map((st, i) => (
          <div key={st.key} className="flex flex-1 items-center">
            <button
              type="button"
              onClick={() => setStage(i)}
              title={st.name}
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 transition-all',
                i === stage ? 'border-accent bg-accent/15 text-accent scale-110' : i < stage ? 'border-success/50 text-success' : 'border-border text-muted',
              )}
            >
              <Icon name={st.icon} size={17} />
            </button>
            {i < STAGES.length - 1 && (
              <div className={cn('h-0.5 flex-1', i < stage ? 'bg-success/50' : 'bg-border')} />
            )}
          </div>
        ))}
      </div>

      {/* Current stage panel */}
      <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Icon name={s.icon} size={16} />
          </span>
          <div className="font-semibold text-ink">{s.name}</div>
          <span className="ml-auto text-xs text-muted">Stage {stage + 1} / {STAGES.length}</span>
        </div>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-sm text-ink">
          {s.body.join('\n')}
        </pre>
        <p className="mt-2 text-sm text-muted">{s.note}</p>
      </div>

      <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 p-3 text-center text-xs text-ink">
        {mode === 'compiled' ? (
          <>
            <span className="font-semibold text-accent">Compiled:</span> run the whole pipeline <span className="text-ink">once, ahead of time</span>, producing a machine-code file. Running it later is fast — the translating is already done.
          </>
        ) : (
          <>
            <span className="font-semibold text-accent">Interpreted:</span> an interpreter walks the source <span className="text-ink">line-by-line as it runs</span>, translating each piece on the fly. Slower per line, but it starts instantly and runs anywhere the interpreter exists.
          </>
        )}
      </div>

      <div className="mt-3 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setStage((i) => Math.max(0, i - 1))}
          disabled={stage === 0}
          className="rounded-full border border-border px-4 py-1.5 text-sm text-muted disabled:opacity-40 hover:text-ink"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => setStage((i) => Math.min(STAGES.length - 1, i + 1))}
          disabled={done}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm transition-colors',
            done ? 'cursor-not-allowed border-border text-muted/50' : 'border-accent bg-accent/15 text-accent',
          )}
        >
          Next stage →
        </button>
      </div>
    </div>
  )
}
