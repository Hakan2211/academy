import { useState } from 'react'
import { cn } from '#/lib/cn'

// An entity-relationship diagram shows how separate tables LINK through keys. A
// PRIMARY KEY uniquely names each row in its own table; a FOREIGN KEY in another
// table points back at it. The Enrollments table sits between Students and
// Courses, holding their keys — that is how a "many-to-many" link is modelled.
// Click any table or the relationship line to see what connects to what.

type Sel = 'students' | 'courses' | 'enrollments' | 'rel'

const TABLES: Record<
  Exclude<Sel, 'rel'>,
  { title: string; fields: Array<{ name: string; tag?: 'PK' | 'FK' }> }
> = {
  students: {
    title: 'Students',
    fields: [
      { name: 'student_id', tag: 'PK' },
      { name: 'name' },
      { name: 'year' },
    ],
  },
  enrollments: {
    title: 'Enrollments',
    fields: [
      { name: 'enrollment_id', tag: 'PK' },
      { name: 'student_id', tag: 'FK' },
      { name: 'course_id', tag: 'FK' },
      { name: 'grade' },
    ],
  },
  courses: {
    title: 'Courses',
    fields: [
      { name: 'course_id', tag: 'PK' },
      { name: 'title' },
      { name: 'credits' },
    ],
  },
}

const EXPLAIN: Record<Sel, string> = {
  students: 'Each student is one row, uniquely named by the primary key student_id.',
  courses: 'Each course is one row, uniquely named by the primary key course_id.',
  enrollments:
    'A junction table. Each row links one student to one course via two foreign keys, recording that "this student takes this course". It resolves a many-to-many relationship into two one-to-many links.',
  rel: 'The lines join a foreign key back to the primary key it references. One student has many enrollments (1 → ∞); one course has many enrollments (1 → ∞). Keys are the glue between tables.',
}

function TableBox({
  k,
  sel,
  onSel,
}: {
  k: Exclude<Sel, 'rel'>
  sel: Sel
  onSel: (s: Sel) => void
}) {
  const t = TABLES[k]
  const active = sel === k
  return (
    <button
      type="button"
      onClick={() => onSel(k)}
      className={cn(
        'w-full overflow-hidden rounded-lg border-2 text-left transition-colors',
        active ? 'border-accent bg-accent/15' : 'border-border bg-surface-2 hover:border-accent-2',
      )}
    >
      <div className={cn('px-3 py-1.5 text-sm font-semibold', active ? 'text-accent' : 'text-ink')}>{t.title}</div>
      <div className="divide-y divide-border border-t border-border font-mono text-xs">
        {t.fields.map((f) => (
          <div key={f.name} className="flex items-center justify-between px-3 py-1">
            <span className="text-ink">{f.name}</span>
            {f.tag === 'PK' && <span className="text-warn">PK</span>}
            {f.tag === 'FK' && <span className="text-accent-2">FK</span>}
          </div>
        ))}
      </div>
    </button>
  )
}

export function ErDiagram() {
  const [sel, setSel] = useState<Sel>('enrollments')

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <TableBox k="students" sel={sel} onSel={setSel} />
        <button
          type="button"
          onClick={() => setSel('rel')}
          className={cn('px-1 text-center font-mono text-xs', sel === 'rel' ? 'text-accent' : 'text-muted hover:text-ink')}
        >
          1 ─── ∞
        </button>
        <TableBox k="enrollments" sel={sel} onSel={setSel} />
        <button
          type="button"
          onClick={() => setSel('rel')}
          className={cn('px-1 text-center font-mono text-xs', sel === 'rel' ? 'text-accent' : 'text-muted hover:text-ink')}
        >
          ∞ ─── 1
        </button>
        <TableBox k="courses" sel={sel} onSel={setSel} />
      </div>

      <div className="mt-3 rounded-lg border border-border bg-surface-2 p-3 text-sm">
        <span className="font-semibold text-accent">
          {sel === 'rel' ? 'Relationship' : TABLES[sel].title}:
        </span>{' '}
        <span className="text-ink/90">{EXPLAIN[sel]}</span>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        A <span className="text-warn">primary key (PK)</span> names a row in its own table; a{' '}
        <span className="text-accent-2">foreign key (FK)</span> points at another table's PK. That link is how separate tables relate.
      </p>
    </div>
  )
}
