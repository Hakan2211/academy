import { useState } from 'react'
import { cn } from '#/lib/cn'

// A database table organises data as ROWS (records) and COLUMNS (fields). Every
// row is uniquely identified by a PRIMARY KEY — here the student_id — so no two
// records are ever confused. Filter the rows the way a query would to feel how
// the table stays queryable: ask a question, get back only the matching records.

type Student = {
  id: number
  name: string
  year: number
  major: string
  gpa: number
}

const STUDENTS: Array<Student> = [
  { id: 1001, name: 'Ada Okafor', year: 1, major: 'Computer Science', gpa: 3.8 },
  { id: 1002, name: 'Bao Nguyen', year: 2, major: 'Mathematics', gpa: 3.5 },
  { id: 1003, name: 'Carla Reyes', year: 1, major: 'Computer Science', gpa: 3.2 },
  { id: 1004, name: 'Dmitri Petrov', year: 3, major: 'Physics', gpa: 3.9 },
  { id: 1005, name: 'Esi Mensah', year: 2, major: 'Computer Science', gpa: 3.6 },
  { id: 1006, name: 'Farah Haidar', year: 3, major: 'Mathematics', gpa: 3.4 },
]

type Filter = 'all' | 'cs' | 'year1' | 'gpa'
const FILTERS: Array<{ key: Filter; label: string; where: string }> = [
  { key: 'all', label: 'All records', where: '(no filter)' },
  { key: 'cs', label: 'CS majors', where: "major = 'Computer Science'" },
  { key: 'year1', label: 'First years', where: 'year = 1' },
  { key: 'gpa', label: 'GPA ≥ 3.6', where: 'gpa >= 3.6' },
]

function matches(s: Student, f: Filter): boolean {
  if (f === 'cs') return s.major === 'Computer Science'
  if (f === 'year1') return s.year === 1
  if (f === 'gpa') return s.gpa >= 3.6
  return true
}

export function DatabaseTable() {
  const [filter, setFilter] = useState<Filter>('all')
  const where = FILTERS.find((f) => f.key === filter)?.where ?? ''
  const shown = STUDENTS.filter((s) => matches(s, filter))

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted">Keep only rows where</span>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              filter === f.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 font-mono text-xs text-muted">
        WHERE <span className="text-accent-2">{where}</span>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[460px] text-left text-sm">
          <thead>
            <tr className="text-xs text-muted">
              <th className="px-2 py-1.5 font-semibold text-accent">
                student_id <span className="font-normal text-warn">PK</span>
              </th>
              <th className="px-2 py-1.5 font-normal">name</th>
              <th className="px-2 py-1.5 font-normal">year</th>
              <th className="px-2 py-1.5 font-normal">major</th>
              <th className="px-2 py-1.5 font-normal">gpa</th>
            </tr>
          </thead>
          <tbody>
            {STUDENTS.map((s) => {
              const on = matches(s, filter)
              return (
                <tr
                  key={s.id}
                  className={cn(
                    'border-t border-border transition-opacity',
                    on ? 'bg-accent/5' : 'opacity-30',
                  )}
                >
                  <td className="px-2 py-1.5 font-mono font-semibold text-accent">{s.id}</td>
                  <td className="px-2 py-1.5 text-ink">{s.name}</td>
                  <td className="px-2 py-1.5 text-ink">{s.year}</td>
                  <td className="px-2 py-1.5 text-muted">{s.major}</td>
                  <td className="px-2 py-1.5 text-ink">{s.gpa.toFixed(1)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Each <span className="text-ink">row</span> is one record; each <span className="text-ink">column</span> is one field. The{' '}
        <span className="text-accent">primary key</span> (student_id) uniquely identifies every row. The filter returned{' '}
        <span className="font-mono text-ink">{shown.length}</span> of <span className="font-mono text-ink">{STUDENTS.length}</span> records.
      </p>
    </div>
  )
}
