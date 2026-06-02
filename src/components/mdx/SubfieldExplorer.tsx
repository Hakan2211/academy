import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The many fields of psychology — click a tile to see what that psychologist
// actually studies or does. Shows how broad "psychology" really is.
const FIELDS = [
  { name: 'Clinical', icon: 'HeartPulse', desc: 'Diagnoses and treats psychological disorders, from anxiety to schizophrenia.' },
  { name: 'Counselling', icon: 'MessageCircle', desc: 'Helps people cope with everyday challenges — relationships, stress, life transitions.' },
  { name: 'Cognitive', icon: 'Cpu', desc: 'Studies thinking: memory, attention, language, problem-solving and decision-making.' },
  { name: 'Developmental', icon: 'Footprints', desc: 'Tracks how we change across the whole lifespan, from infancy to old age.' },
  { name: 'Social', icon: 'Users', desc: 'Examines how other people shape our thoughts, feelings and behaviour.' },
  { name: 'Biological', icon: 'Brain', desc: 'Links behaviour to the brain, nervous system, genes and hormones.' },
  { name: 'Industrial / Org.', icon: 'Briefcase', desc: 'Applies psychology to the workplace: motivation, hiring, leadership, teams.' },
  { name: 'Educational', icon: 'GraduationCap', desc: 'Studies how people learn and how to teach more effectively.' },
  { name: 'Forensic', icon: 'Scale', desc: 'Works at the meeting point of psychology and the legal system.' },
]

export function SubfieldExplorer() {
  const [sel, setSel] = useState(0)
  const f = FIELDS[sel]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid grid-cols-3 gap-2">
        {FIELDS.map((field, i) => (
          <button
            key={field.name}
            type="button"
            onClick={() => setSel(i)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-xl border p-2.5 text-center transition-colors',
              i === sel ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={field.icon} size={20} />
            <span className="text-[11px] font-medium leading-tight">{field.name}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-surface-2 p-3">
        <p className="text-sm font-semibold text-ink">{f.name} psychology</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{f.desc}</p>
      </div>
    </div>
  )
}
