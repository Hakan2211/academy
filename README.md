# Academy — Learn science, visually

A gamified visual learning platform (think Brilliant × Blinkist × Mondly, for
science). Phase 1 is the **web app**, starting with **Physics**. Lessons are
authored in **MDX** with injected interactive components (3D scenes, shaders,
animated SVG, quizzes). A mobile app is a Phase-2 goal — the Convex backend and
lesson content are kept reusable.

## Stack

- **TanStack Start** (React, Vite, SSR) — framework & routing
- **Convex** — database/backend (queries, mutations, realtime)
- **MDX** (`@mdx-js/rollup` + `@mdx-js/react`) — lesson content with custom components
- **React Three Fiber / drei / GLSL** (`vite-plugin-glsl`) — 3D & shaders
- **motion** (Framer Motion) + animated SVG — 2D animation
- **Tailwind CSS v4** — styling
- **KaTeX** — formulas

## First-time setup

> Convex needs a one-time interactive login (opens a browser). Run it yourself:

1. **Provision Convex** — logs in, creates a dev deployment, writes
   `VITE_CONVEX_URL` to `.env.local`, and generates `convex/_generated/`:

   ```sh
   npm run convex        # = npx convex dev  (leave running in its own terminal)
   ```

2. **Seed the catalog** (once, in another terminal):

   ```sh
   npm run seed          # = npx convex run seed:run
   ```

   `seed:run` is a no-op if the catalog already exists. To re-apply an updated
   taxonomy (e.g. after editing categories/lessons in `seed.ts`), wipe first:

   ```sh
   npx convex run seed:reset   # deletes subjects/units/lessons
   npm run seed                # re-seed
   ```

3. **Run the web app** (third terminal):

   ```sh
   npm run dev           # http://localhost:3000
   ```

## Project layout

```
convex/                     # backend (self-contained; extractable to a package later)
  schema.ts                 # subjects, units (categories), lessons, users, userProgress
  catalog.ts                # listSubjects / getSubjectOverview / getCategoryPath / getLessonMeta
  users.ts                  # getOrCreateByDevice / getUser  (anonymous identity)
  progress.ts               # recordStepCompletion / completeLesson / getProgressForUser
  gamification.ts           # pure XP/level/streak helpers
  seed.ts                   # `npm run seed` (run) + `seed:reset`
src/
  router.tsx                # Convex + react-query + router wiring
  routes/
    __root.tsx              # shell, MDXProvider, DeviceIdProvider, EnsureUser
    index.tsx               # home: subject grid
    subjects.$subjectSlug.tsx        # subject layout (renders <Outlet/>)
    subjects.$subjectSlug.index.tsx  # category grid for a subject
    subjects.$subjectSlug.$unitSlug.tsx  # one category's table of contents (path map)
    learn.$.tsx             # lesson player (ssr: false)
  content/lessons/physics/*.mdx   # lessons (simple-harmonic-motion, newtons-second-law, projectile-motion)
  components/mdx/           # Lesson/Step engine + Quiz, Scene3D, Formula, Figure, ...
  components/three/         # PendulumScene / ForceBlockScene / ProjectileScene (R3F) + GradientBackground (GLSL)
  components/ui/            # SubjectCard, CategoryCard, PathMap, LessonNode, ...
  lib/                      # deviceId (anonymous identity), lessonModules (MDX glob)
public/lessons/<subject>/<slug>/   # lesson images/video (served at /lessons/...)
```

## Curriculum model

`subjects → units → lessons`. A **unit is a navigable category** (e.g. "Forces &
Motion") with its own table of contents, ordered Beginner → Advanced. Each lesson
carries a `level` (`beginner|intermediate|advanced`) and a `format`:

- **`core`** — the default: 5–8 `<Step>`s, ~800–1,500 words, one visual per step.
- **`deepdive`** — a longer 2–4k-word narrative (8–12 steps) for marquee topics,
  with multiple interactives and media.

Lessons with `isPublished: false` appear in a category's path as greyed
"coming soon" nodes (the visible roadmap) and aren't playable until flipped on.

## Authoring a lesson

Add `src/content/lessons/<subject>/<slug>.mdx` with frontmatter, then a row in
`convex/seed.ts` (or a future admin tool) whose `contentSlug` points at it:

```mdx
---
title: Your Lesson
subject: physics
contentSlug: physics/your-slug
order: 2
estimatedMinutes: 5
level: beginner          # beginner | intermediate | advanced
format: core             # core | deepdive
---

<Lesson>
  <Step title="Intro" kind="explain"> ... <Formula tex="E = mc^2" /> </Step>
  <Step title="Explore" kind="interactive"> <Scene3D component="pendulum" /> </Step>
  <Step title="Check" kind="quiz">
    <Quiz prompt="…" options={["a","b"]} correctIndex={0} explanation="…" />
  </Step>
</Lesson>
```

The `<Lesson>` engine paginates the `<Step>`s, shows progress, gates quizzes,
and writes XP / streak / progress to Convex on completion. Keep the seed row's
`level`/`format` in sync with the frontmatter.

**Math** is component-based (`<Formula tex="…" block />`) — there is no inline
`$…$` / `\( … \)` support, so wrap every formula in `<Formula>`.

**Images & video** live in `public/lessons/<subject>/<slug>/` and are referenced
by absolute path (Vite serves `public/` at the web root). Prefer `.webp`/`.svg`
for stills and `.mp4` (with a `poster`) for clips:

```mdx
<Figure src="/lessons/physics/your-slug/diagram.svg" alt="…" caption="…" />
<Video src="/lessons/physics/your-slug/clip.mp4"
       poster="/lessons/physics/your-slug/clip-poster.svg" caption="…" />
```

**New 3D scene?** Add a component under `src/components/three/` (wrap `<Canvas>`
in `<ClientOnly>`, model it on `PendulumScene`) and register its key in
`src/components/mdx/Scene3D.tsx`, then use `<Scene3D component="your-key" />`.

## Notes

- **Auth is deferred.** Identity is an anonymous `deviceId` (localStorage). The
  `users` table has an `authId` slot for a frictionless Better Auth migration later.
- **3D is client-only.** `<Canvas>` is wrapped in `<ClientOnly>` and the lesson
  route is `ssr: false`, so WebGL never runs during SSR.
- **MDX is web-only.** For the future mobile app, lessons are intended to be
  reused via a WebView; the lesson list/progress/gamification live in Convex and
  are fully portable.

## Deploying

Built on Nitro (`npm run build` → self-contained Node server in `dist/`). Point
the production deployment at a Convex production deployment via `VITE_CONVEX_URL`.
See https://docs.convex.dev/production for promoting the backend.
