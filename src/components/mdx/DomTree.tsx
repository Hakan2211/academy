import { useState } from 'react'
import { cn } from '#/lib/cn'

// HTML is a tree. Every tag you open is a node; tags nested inside it are its
// children. The browser parses your text into this tree — the DOM — and that
// tree IS the structure of the page. Here the same little document is shown
// three ways: the source you write, the tree the browser builds, and the page
// it renders. Click any node to see all three light up together.

type DomNode = {
  id: string
  tag: string
  text?: string
  children?: Array<DomNode>
}

// A small but real document: html > head/body, body holds a heading, a
// paragraph, and a list. Indentation in the source mirrors the nesting.
const DOC: DomNode = {
  id: 'html',
  tag: 'html',
  children: [
    {
      id: 'body',
      tag: 'body',
      children: [
        { id: 'h1', tag: 'h1', text: 'My Page' },
        { id: 'p', tag: 'p', text: 'A web page is a tree of tags.' },
        {
          id: 'ul',
          tag: 'ul',
          children: [
            { id: 'li1', tag: 'li', text: 'Structure' },
            { id: 'li2', tag: 'li', text: 'is just' },
            { id: 'li3', tag: 'li', text: 'nesting' },
          ],
        },
      ],
    },
  ],
}

// Flatten to source lines, tracking depth (for indentation) and node id.
type Line = { id: string; depth: number; text: string }
function toLines(node: DomNode, depth: number, out: Array<Line>) {
  const pad = '  '.repeat(depth)
  if (node.children) {
    out.push({ id: node.id, depth, text: `${pad}<${node.tag}>` })
    for (const c of node.children) toLines(c, depth + 1, out)
    out.push({ id: `${node.id}-close`, depth, text: `${pad}</${node.tag}>` })
  } else {
    out.push({ id: node.id, depth, text: `${pad}<${node.tag}>${node.text}</${node.tag}>` })
  }
}

export function DomTree() {
  const [sel, setSel] = useState<string | null>('h1')

  const lines: Array<Line> = []
  toLines(DOC, 0, lines)

  // Recursive tree rendering with indentation by depth.
  function renderTree(node: DomNode, depth: number) {
    const active = sel === node.id
    return (
      <div key={node.id}>
        <button
          type="button"
          onClick={() => setSel(node.id)}
          style={{ marginLeft: `${depth * 14}px` }}
          className={cn(
            'flex items-center gap-1.5 rounded-md border px-2 py-1 text-left font-mono text-xs transition-colors',
            active ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          <span className="font-bold">&lt;{node.tag}&gt;</span>
          {node.text && <span className="text-muted">{node.text}</span>}
        </button>
        {node.children && (
          <div className="mt-1 space-y-1 border-l border-border/60" style={{ marginLeft: `${depth * 14 + 7}px` }}>
            {node.children.map((c) => renderTree(c, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  // The rendered page, with the selected element highlighted.
  function hl(id: string) {
    return sel === id ? { outline: '2px solid #5B6CFF', borderRadius: '3px', background: 'rgba(91,108,255,0.12)' } : undefined
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-3 lg:grid-cols-3">
        <div>
          <div className="mb-1.5 text-[10px] uppercase tracking-wide text-muted">HTML source you write</div>
          <pre className="rounded-lg border border-border bg-surface-2 p-3 font-mono text-xs leading-5">
            {lines.map((ln) => (
              <div
                key={ln.id}
                className={cn('rounded px-1', sel && (ln.id === sel || ln.id === `${sel}-close`) ? 'bg-accent/15 text-accent' : 'text-ink')}
              >
                {ln.text}
              </div>
            ))}
          </pre>
        </div>

        <div>
          <div className="mb-1.5 text-[10px] uppercase tracking-wide text-muted">The DOM tree it becomes</div>
          <div className="space-y-1 rounded-lg border border-border bg-surface-2 p-3">
            {renderTree(DOC, 0)}
          </div>
        </div>

        <div>
          <div className="mb-1.5 text-[10px] uppercase tracking-wide text-muted">The page it renders</div>
          <div className="rounded-lg border border-border bg-white p-3" style={{ color: '#0a0f1f' }}>
            <div className="text-lg font-bold" style={hl('h1')}>My Page</div>
            <div className="mt-1 text-sm" style={hl('p')}>A web page is a tree of tags.</div>
            <ul className="mt-2 list-disc pl-5 text-sm" style={hl('ul')}>
              <li style={hl('li1')}>Structure</li>
              <li style={hl('li2')}>is just</li>
              <li style={hl('li3')}>nesting</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Click any node: the <span className="text-ink">source</span>, the <span className="text-ink">tree</span>, and the <span className="text-ink">rendered element</span> all match. HTML is just <span className="text-ink">nested tags</span> — a tree the browser walks to draw your page.
      </p>
    </div>
  )
}
