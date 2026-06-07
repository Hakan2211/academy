import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../convex/_generated/api'
import { Icon } from '#/components/ui/Icon'
// Plan bullets are shared with the in-app /upgrade card so the offer never drifts.
import { PLAN_INCLUDES } from '#/lib/billing'

// The public front door (shown by the auth gate to signed-out visitors at `/`).
// A Cosmic-Glass marketing showcase over the shared WebGL universe. Model (owner
// 2026-06-04): free account → unlock everything for $199 one-time/lifetime, so
// the primary CTA stays "Create free account" and pricing advertises lifetime.
// The "Look inside" explorer pulls the REAL worlds live from getSubjectOverview
// (a public query) so it stays accurate. Signed-in users get the SubjectsHub.

const RIM = 'rgba(120,170,255,0.45)'
const GLASS =
  '0 0 0 1px rgba(120,170,255,0.10), 0 24px 64px -28px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.10)'
const ACCENT_BG =
  'linear-gradient(135deg, #6AA1FF, #2F6BFF)'

// Elegant ghost-glass secondary button: hairline border + faint fill + fine top
// highlight; on hover the border brightens and a soft azure halo blooms. Add
// padding/size per use.
const BTN_GHOST =
  'rounded-xl border border-white/15 bg-white/[0.04] font-semibold text-white/85 backdrop-blur-md ' +
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-200 ' +
  'hover:border-white/40 hover:bg-white/[0.08] hover:text-white ' +
  'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_0_24px_-6px_rgba(79,140,255,0.7)]'

// Text colors tuned for contrast over the bright nebula (+ the page scrim below).
const TXT_BODY = 'text-slate-200'
const TXT_SUBTLE = 'text-slate-300/80'

const SUBJECTS: Array<{ slug: string; name: string; tagline: string; accent: string }> = [
  { slug: 'physics', name: 'Physics', tagline: 'See the rules of the universe in motion.', accent: '#4F8CFF' },
  { slug: 'chemistry', name: 'Chemistry', tagline: 'Build the world one reaction at a time.', accent: '#22D3D4' },
  { slug: 'biology', name: 'Biology', tagline: 'Explore the machinery of life.', accent: '#2ECC71' },
  { slug: 'math', name: 'Mathematics', tagline: 'The language behind everything.', accent: '#FFB020' },
  { slug: 'computer-science', name: 'Computer Science', tagline: 'Teach a machine to think.', accent: '#FF7A7A' },
  { slug: 'psychology', name: 'Psychology', tagline: 'Decode the human mind.', accent: '#E879F9' },
  { slug: 'economics', name: 'Economics', tagline: 'How the world allocates scarce resources.', accent: '#34D399' },
  { slug: 'philosophy', name: 'Philosophy', tagline: 'Question knowledge, reality, right & wrong.', accent: '#E0BC5B' },
  { slug: 'health', name: 'Health', tagline: 'The science of a healthy body and mind.', accent: '#FF7A93' },
]

const PILLARS: Array<{ icon: string; title: string; body: string }> = [
  { icon: 'Orbit', title: 'See it move', body: 'Every idea is a living visual: 3D scenes, real simulations and diagrams you can actually play with, not walls of text.' },
  { icon: 'Sparkles', title: 'Learn by doing', body: 'Short, hands-on lessons with built-in questions that build real intuition, one step at a time.' },
  { icon: 'Repeat', title: 'Remember it forever', body: 'Spaced-retrieval practice resurfaces each idea right before you’d forget it, so it truly sticks.' },
]

const AUDIENCES: Array<{ icon: string; title: string; body: string }> = [
  { icon: 'Compass', title: 'The endlessly curious', body: 'Always wanted to really understand how the world works? Start anywhere and follow your curiosity across nine subjects.' },
  { icon: 'GraduationCap', title: 'Students & young minds', body: 'A playful, visual way to learn, from school science to far beyond the syllabus. Made for kids and teens to explore at their own pace.' },
  { icon: 'Coffee', title: 'Lifelong learners', body: 'Adults rediscovering the joy of learning. Bite-size lessons that fit real life and finally make the hard ideas click.' },
  { icon: 'Gift', title: 'A gift like no other', body: 'Give someone a whole universe of knowledge. Lifetime access is a thoughtful, lasting gift for the curious people you love.' },
]


export function Landing() {
  const reduce = useReducedMotion()

  const fadeUp = (delay = 0) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.5, ease: 'easeOut' as const, delay },
        }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* readability scrim: darkens the bright nebula so text/buttons keep
          contrast, while the cosmos still glows through. Sits between the
          global CosmosBackdrop (-z-10) and the content (z≥0). */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-[5]"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, rgba(8,12,24,0.45), rgba(6,9,20,0.78) 60%, rgba(5,8,18,0.9) 100%)',
        }}
      />

      {/* top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2.5">
          <span
            className="grid h-11 w-11 place-items-center rounded-xl text-white"
            style={{ background: 'rgba(79,140,255,0.22)', boxShadow: '0 0 18px -3px rgba(79,140,255,0.95)' }}
          >
            <span style={{ filter: 'drop-shadow(0 0 7px rgba(79,140,255,0.9))' }}>
              <img src="/logo.png" alt="" className="h-9 w-9" />
            </span>
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white">Orbisle</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="#pricing"
            className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:text-white sm:inline-block"
          >
            Pricing
          </a>
          <Link to="/login" search={{}} className={`${BTN_GHOST} px-4 py-2 text-sm`}>
            Sign in
          </Link>
        </div>
      </header>

      {/* hero */}
      <section className="mx-auto max-w-3xl px-5 pb-8 pt-12 text-center sm:pt-20">
        <motion.span
          {...fadeUp(0)}
          className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
          style={{ borderColor: RIM, background: 'rgba(79,140,255,0.18)' }}
        >
          <Icon name="Sparkles" size={13} /> Nine subjects · one universe
        </motion.span>

        <motion.h1
          {...fadeUp(0.05)}
          className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl"
          style={{ textShadow: '0 2px 30px rgba(0,0,0,0.5)' }}
        >
          Learn the universe,{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(120deg, #8FB8FF, #4F8CFF)' }}
          >
            visually
          </span>
          .
        </motion.h1>

        <motion.p
          {...fadeUp(0.12)}
          className={`mx-auto mt-5 max-w-xl text-lg ${TXT_BODY}`}
          style={{ textShadow: '0 1px 12px rgba(0,0,0,0.6)' }}
        >
          From atoms to the cosmos, from the human mind to the meaning of life.
          Nine subjects you can see, touch and play with, built on what actually
          makes ideas stick: vivid visuals, active recall and spaced practice.
        </motion.p>

        <motion.div {...fadeUp(0.2)} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/login"
            search={{ mode: 'signup' }}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-base font-bold text-white ring-1 ring-white/30 transition-transform hover:scale-[1.03]"
            style={{ background: ACCENT_BG, boxShadow: '0 16px 40px -10px rgba(47,107,255,0.85)' }}
          >
            Create free account <Icon name="ArrowRight" size={18} />
          </Link>
          <Link
            to="/login"
            search={{}}
            className={`${BTN_GHOST} inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base`}
          >
            Sign in
          </Link>
        </motion.div>

        <motion.p {...fadeUp(0.26)} className={`mt-4 text-xs ${TXT_SUBTLE}`}>
          Free to start. Lifetime access $199 (normally $599), for a limited time.
        </motion.p>

        {/* stat strip */}
        <motion.div
          {...fadeUp(0.32)}
          className="mx-auto mt-10 flex max-w-md items-center justify-center gap-4 rounded-2xl border bg-black/55 px-5 py-3.5 backdrop-blur-xl sm:gap-8"
          style={{ borderColor: 'rgba(120,170,255,0.18)' }}
        >
          <Stat value="9" label="subjects" />
          <span className="h-8 w-px bg-white/15" />
          <Stat value="136" label="worlds" />
          <span className="h-8 w-px bg-white/15" />
          <Stat value="880+" label="lessons" />
        </motion.div>
      </section>

      {/* Look inside — real worlds, live from the catalog */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <motion.div {...fadeUp(0)} className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Look inside the worlds
          </h2>
          <p className={`mt-3 ${TXT_BODY}`}>
            Each subject is a constellation of worlds. Pick one and see exactly what
            you’ll explore inside.
          </p>
        </motion.div>
        <WorldExplorer />
      </section>

      {/* how you learn */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <motion.h2 {...fadeUp(0)} className="mb-10 text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Not another video course
        </motion.h2>
        <div className="grid gap-4 md:grid-cols-3">
          {PILLARS.map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp(0.05 * i)}
              className="rounded-2xl border border-white/12 bg-black/55 p-6 backdrop-blur-xl"
              style={{ boxShadow: GLASS }}
            >
              <span
                className="mb-4 grid h-11 w-11 place-items-center rounded-xl text-white"
                style={{ background: 'rgba(79,140,255,0.22)', boxShadow: '0 0 18px -5px rgba(79,140,255,0.9)' }}
              >
                <Icon name={f.icon} size={22} />
              </span>
              <h3 className="text-lg font-bold text-white">{f.title}</h3>
              <p className={`mt-1.5 text-sm leading-relaxed ${TXT_BODY}`}>{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* who it's for */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <motion.div {...fadeUp(0)} className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Made for the curious, at any age
          </h2>
          <p className={`mt-3 ${TXT_BODY}`}>
            Whether it’s for you or someone you love, Orbisle turns curiosity into a habit.
          </p>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2">
          {AUDIENCES.map((a, i) => (
            <motion.div
              key={a.title}
              {...fadeUp(0.05 * (i % 2))}
              className="flex gap-4 rounded-2xl border border-white/12 bg-black/55 p-6 backdrop-blur-xl"
              style={{ boxShadow: GLASS }}
            >
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white"
                style={{ background: 'rgba(79,140,255,0.22)', boxShadow: '0 0 18px -5px rgba(79,140,255,0.9)' }}
              >
                <Icon name={a.icon} size={22} />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">{a.title}</h3>
                <p className={`mt-1.5 text-sm leading-relaxed ${TXT_BODY}`}>{a.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" className="mx-auto max-w-3xl scroll-mt-8 px-5 py-16">
        <motion.div {...fadeUp(0)} className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            One price. Everything. Forever.
          </h2>
          <p className={`mt-3 ${TXT_BODY}`}>
            Create a free account and start exploring. Unlock all nine subjects, plus
            every subject we ever add, with a single payment.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp(0.08)}
          className="overflow-hidden rounded-3xl border bg-black/55 backdrop-blur-2xl"
          style={{ borderColor: RIM, boxShadow: GLASS }}
        >
          <div className="border-b border-white/10 px-7 py-8 text-center">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white"
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
                boxShadow: '0 6px 20px -8px rgba(239,68,68,0.95)',
              }}
            >
              <Icon name="Clock" size={12} /> Launch offer · limited time
            </span>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#9cc0ff]">
              Lifetime access
            </p>
            <div className="mt-2 flex items-end justify-center gap-3">
              <span className="mb-1 text-2xl font-bold text-slate-400 line-through decoration-red-400/70">
                $599
              </span>
              <span className="text-6xl font-extrabold tracking-tight text-white">$199</span>
              <span className={`mb-2 text-sm font-medium ${TXT_BODY}`}>one-time</span>
            </div>
            <div className="mt-3">
              <span className="rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-bold text-green-300">
                Save $400 · 67% off
              </span>
            </div>
            <p className={`mt-3 text-sm ${TXT_SUBTLE}`}>
              No subscription, yours for good. This launch price won’t last.
            </p>
          </div>

          <div className="px-7 py-7">
            <ul className="space-y-3">
              {PLAN_INCLUDES.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white">
                  <span
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white"
                    style={{ background: '#2F6BFF' }}
                  >
                    <Icon name="Check" size={13} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              to="/login"
              search={{ mode: 'signup' }}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold text-white ring-1 ring-white/30 transition-transform hover:scale-[1.02]"
              style={{ background: ACCENT_BG, boxShadow: '0 16px 40px -10px rgba(47,107,255,0.85)' }}
            >
              Create free account <Icon name="ArrowRight" size={18} />
            </Link>
            <p className={`mt-3 text-center text-xs ${TXT_SUBTLE}`}>
              No card needed to start. Pay only when you’re ready to unlock everything.
            </p>

            <div
              className="mt-6 flex items-center gap-3 rounded-xl border px-4 py-3"
              style={{ borderColor: RIM, background: 'rgba(79,140,255,0.10)' }}
            >
              <span className="text-[#9cc0ff]">
                <Icon name="Gift" size={18} />
              </span>
              <p className={`text-xs ${TXT_BODY}`}>
                <span className="font-semibold text-white">Giving it as a gift?</span>{' '}
                Lifetime access makes a lasting present for any curious mind. Gifting is
                coming soon.
              </p>
            </div>
          </div>
        </motion.div>

        <p className={`mt-12 text-center text-xs ${TXT_SUBTLE}`}>
          Orbisle · Learn science, visually
        </p>
      </section>
    </div>
  )
}

// Subject pills + the selected subject's real worlds (live from the catalog).
function WorldExplorer() {
  const reduce = useReducedMotion()
  const fadeUp = (delay = 0) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.5, ease: 'easeOut' as const, delay },
        }
  const [active, setActive] = useState('physics')
  const subject = SUBJECTS.find((s) => s.slug === active) ?? SUBJECTS[0]
  const pathQ = useQuery(
    convexQuery(api.catalog.getSubjectPath, { subjectSlug: active }),
  )
  const units = pathQ.data?.units ?? []
  const lessons = pathQ.data?.lessons ?? []
  const lessonsByUnit = new Map<string, typeof lessons>()
  for (const l of lessons) {
    const arr = lessonsByUnit.get(String(l.unitId))
    if (arr) arr.push(l)
    else lessonsByUnit.set(String(l.unitId), [l])
  }
  const totalLessons = lessons.length

  return (
    <motion.div {...fadeUp(0.05)}>
      {/* subject selector */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {SUBJECTS.map((s) => {
          const on = s.slug === active
          return (
            <button
              key={s.slug}
              type="button"
              onClick={() => setActive(s.slug)}
              aria-pressed={on}
              className={
                'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold backdrop-blur-md transition-colors ' +
                (on ? 'text-white' : 'text-slate-300 hover:text-white')
              }
              style={{
                borderColor: on ? s.accent : 'rgba(255,255,255,0.14)',
                background: on ? `${s.accent}26` : 'rgba(0,0,0,0.4)',
                boxShadow: on ? `0 0 18px -6px ${s.accent}` : undefined,
              }}
            >
              <img
                src={`/islands/${s.slug}.png?v=3`}
                alt=""
                width={22}
                height={22}
                className="h-5 w-5 object-contain"
                aria-hidden
              />
              {s.name}
            </button>
          )
        })}
      </div>

      {/* active subject header */}
      <div className="mb-5 flex items-center justify-center gap-3 text-center">
        <h3 className="text-xl font-bold text-white">{subject.name}</h3>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{ color: subject.accent, background: `${subject.accent}22` }}
        >
          {units.length || '…'} worlds · {totalLessons || '…'} lessons
        </span>
      </div>
      <p className={`mb-7 text-center text-sm ${TXT_SUBTLE}`}>{subject.tagline}</p>

      {/* worlds grid — each world reveals a peek of its real lessons */}
      <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pathQ.isPending
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl border border-white/10 bg-black/40"
              />
            ))
          : units.map((u) => {
              const accent = u.accentColor ?? subject.accent
              const us = lessonsByUnit.get(String(u._id)) ?? []
              const peek = us.slice(0, 4)
              const more = us.length - peek.length
              return (
                <div
                  key={u.slug}
                  className="flex flex-col rounded-2xl border bg-black/55 p-4 backdrop-blur-xl"
                  style={{ borderColor: `${accent}40`, boxShadow: GLASS }}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white"
                      style={{ background: `${accent}2e`, boxShadow: `0 0 14px -5px ${accent}` }}
                    >
                      <Icon name={u.icon ?? 'Circle'} size={16} />
                    </span>
                    <h4 className="min-w-0 flex-1 text-sm font-bold leading-tight text-white">
                      {u.name}
                    </h4>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold"
                      style={{ color: accent, background: `${accent}1f` }}
                    >
                      {us.length}
                    </span>
                  </div>
                  {u.description && (
                    <p className={`mt-2 text-xs leading-relaxed ${TXT_SUBTLE}`}>{u.description}</p>
                  )}
                  {peek.length > 0 && (
                    <ul className="mt-3 space-y-1.5 border-t border-white/[0.07] pt-3">
                      {peek.map((l) => (
                        <li key={l._id} className="flex items-start gap-2 text-xs text-slate-200">
                          <span
                            className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: accent }}
                            aria-hidden
                          />
                          <span className="leading-snug">{l.title}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    {more > 0 ? (
                      <span className="text-[11px] font-bold" style={{ color: accent }}>
                        +{more} more {more === 1 ? 'lesson' : 'lessons'}
                      </span>
                    ) : (
                      <span />
                    )}
                    {u.levelRange && (
                      <span className={`shrink-0 text-[11px] ${TXT_SUBTLE}`}>{u.levelRange}</span>
                    )}
                  </div>
                </div>
              )
            })}
      </div>

      {/* CTA under the explorer */}
      <div className="mt-9 text-center">
        <Link
          to="/login"
          search={{ mode: 'signup', redirect: `/subjects/${active}` }}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white ring-1 ring-white/25 transition-transform hover:scale-[1.03]"
          style={{ background: ACCENT_BG, boxShadow: '0 14px 36px -12px rgba(47,107,255,0.8)' }}
        >
          Explore {subject.name} <Icon name="ArrowRight" size={16} />
        </Link>
      </div>
    </motion.div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-extrabold text-white">{value}</div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">{label}</div>
    </div>
  )
}
