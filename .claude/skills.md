# Orbisle — Development Playbook (skills)

Practical recipes for building this app. See `VISION.md` for the why,
`README.md` for setup. This file is reference material for development sessions.

## Stack (one line)

TanStack Start (RC, Vite 8, React 19, SSR) · Convex · MDX (`@mdx-js/rollup`) ·
React Three Fiber + drei + GLSL (`vite-plugin-glsl`) · `motion` · Tailwind v4 · KaTeX.

## Run it

Three terminals (all from `C:\Users\User\academy`):

```sh
npm run convex     # 1. Convex backend (watch + sync). First run = browser login.
npm run seed       # 2. once: seeds the catalog (npx convex run seed:run)
npm run dev        # 3. web app -> http://localhost:3000
```

`VITE_CONVEX_URL` lives in `.env.local` (written by `convex dev`). Dashboard:
https://dashboard.convex.dev/t/hakan-bilgic/academy

## Mental model

- **Catalog = metadata in Convex** (`subjects`, `units`, `lessons`); **content =
  MDX** files addressed by `contentSlug`. A `lessons` row points at the MDX.
- A **lesson** is one `.mdx` file: `<Lesson>` wraps `<Step>`s. The `<Lesson>`
  engine paginates steps, shows progress, gates quizzes, and calls a
  **`LessonRuntime`** for navigation + completion.
- The lesson UI is **backend-agnostic** — the lesson _route_ supplies the
  Convex-backed `LessonRuntime`. (This is what lets a future mobile WebView host
  the same lesson with different callbacks.)
- **Identity** = anonymous `deviceId` (localStorage), threaded to Convex as an
  arg. `users.authId` is reserved for a future Better Auth migration.

## Recipe: add a lesson

1. Create `src/content/lessons/<subject>/<slug>.mdx`:
   ```mdx
   ---
   title: My Lesson
   subject: physics
   contentSlug: physics/my-slug          # MUST match the file path under lessons/
   order: 2
   estimatedMinutes: 5
   ---

   <Lesson>
     <Step title="Idea" kind="explain"> text… <Formula tex="F = ma" /> </Step>
     <Step title="Play" kind="interactive"> <Scene3D component="pendulum" /> </Step>
     <Step title="Check" kind="quiz">
       <Quiz prompt="…" options={["a","b","c"]} correctIndex={1} explanation="…" />
     </Step>
     <Step title="Recap" kind="recap"> takeaway… </Step>
   </Lesson>
   ```
   `kind` is one of `explain | interactive | quiz | recap`. Quiz steps block
   "Next/Complete" until answered correctly.
2. Add a `lessons` row in Convex pointing `contentSlug` at the file (see the
   **catalog seeding gotcha** below).
3. Done — `src/lib/lessonModules.ts` finds the MDX by `contentSlug` via `import.meta.glob`.

## Recipe: add an interactive 3D scene

1. Create `src/components/three/MyScene.tsx` (R3F). Wrap the `<Canvas>` in
   `<ClientOnly>` (see `PendulumScene.tsx` as the template).
2. Register it in `src/components/mdx/Scene3D.tsx`:
   ```ts
   const registry = { pendulum: PendulumScene, myScene: MyScene } as const
   ```
3. Use `<Scene3D component="myScene" />` in MDX.

Custom GLSL: see `GradientBackground.tsx` — `.glsl` files in `src/shaders/`,
imported as strings, used via drei `shaderMaterial` + `extend`.

## Recipe: add an MDX component (e.g. a new widget)

1. Build it in `src/components/mdx/`.
2. Add it to the `mdxComponents` map in `src/components/mdx/MdxComponents.tsx`.
3. Use it (capitalized) in any `.mdx` — it resolves via `MDXProvider` (set in `__root.tsx`).

## Recipe: add a subject

Add an entry to `subjectsData` in `convex/seed.ts` (`slug, name, description,
color, icon` [lucide name], `order`, `isPublished`). Set `isPublished: true`
when its first lesson exists.

## Gamification model

- Curve & streak logic: **`convex/gamification.ts`** (pure). `levelForXp =
  floor(totalXP / 100) + 1`; streak transitions by local date.
- Award logic: **`convex/progress.ts` → `completeLesson`** (idempotent: XP is
  granted once per lesson via `userProgress.xpEarned`). Returns deltas
  (`xpAwarded, totalXP, level, leveledUp, currentStreak, newBadges`) for the
  reward card.
- Client mirror for instant UI: **`src/lib/xp.ts`** — keep it in sync with
  `gamification.ts` if you change the curve.
- Badges: defined in `src/lib/badges.ts`; granted in `completeLesson`.

## Convex patterns

- **Read (SSR-prefetched):** in a route `loader`,
  `context.queryClient.ensureQueryData(convexQuery(api.x.y, args))`, then in the
  component `useSuspenseQuery(convexQuery(api.x.y, args))`. (Home & path routes.)
- **Read (client-only / device-scoped):**
  `useQuery({ ...convexQuery(api.x.y, { deviceId }), enabled: Boolean(deviceId) })`.
- **Write:** `const fn = useMutation(api.x.y)` then `await fn(args)` (from `convex/react`).
- Import generated API with a relative path from routes: `../../convex/_generated/api`.

## SSR gotchas

- 3D/WebGL must not SSR: lesson route is **`ssr: false`** and `<Canvas>` is in
  **`<ClientOnly>`**. Keep both for anything touching `window`/WebGL/`localStorage`.
- `deviceId` is `undefined` during SSR/first render — gate device-scoped queries
  on it; never read `localStorage` during render.

## Known gotchas / footguns

- **Catalog seeding:** `convex/seed.ts` is guarded to run only when there are no
  subjects yet, so it won't add new lessons to an already-seeded DB. To add
  content later, either (a) insert via the Convex **dashboard**, (b) write a small
  `addLesson` mutation and `npx convex run` it, or (c) make `seed.ts` upsert by
  `contentSlug`. _(Improving seed into an idempotent upsert is a good early task.)_
- **`npx convex run` args on Windows:** PowerShell mangles embedded quotes — run
  it from **bash** with single-quoted JSON: `npx convex run fn:name '{"k":"v"}'`.
- **Tailwind v4 renamed gradients:** `bg-gradient-to-r` → `bg-linear-to-r`. Use
  the new name or an inline `linear-gradient(...)` (XPBar uses inline).
- **Vite plugin order:** MDX plugin must be `enforce: 'pre'` and before
  `@vitejs/plugin-react` (see `vite.config.ts`). Don't reorder casually.
- **`verbatimModuleSyntax` is on:** import types with `import type { … }`.
- **Lesson URLs are a splat route** (`learn.$.tsx`): link with
  `<Link to="/learn/$" params={{ _splat: contentSlug }} />`.
- **TanStack Start is RC:** APIs (`getRouter`, `Wrap`, `shellComponent`,
  `ssr:false`) may drift between versions — reconcile against generated files.

## Key files

```
convex/schema.ts          data model
convex/{catalog,users,progress}.ts   queries + mutations
convex/gamification.ts    pure XP/level/streak helpers
convex/seed.ts            catalog seed (see gotcha)
src/router.tsx            Convex + react-query + router wiring
src/routes/__root.tsx     MDXProvider, DeviceIdProvider, EnsureUser
src/routes/index.tsx                 home (subject grid)
src/routes/subjects.$subjectSlug.tsx path map
src/routes/learn.$.tsx               lesson player (ssr:false)
src/components/mdx/Lesson.tsx        the step engine
src/components/lesson/context.tsx    LessonRuntime + step-gate contexts
src/components/three/                R3F scenes + GLSL
src/lib/lessonModules.ts             MDX glob registry
src/lib/deviceId*                    anonymous identity
```

## Toward mobile (later)

The lesson UI already talks only to `LessonRuntime` (no direct Convex). For the
Expo app: extract `convex/` into a shared workspace package, build native
navigation + path + gamification against Convex, and host the existing lessons in
a WebView that injects an HTTP/native-backed `LessonRuntime`.

---

> Note: this file is **reference**, not auto-loaded instructions. If you want
> Claude Code to load project conventions automatically each session, add a
> `CLAUDE.md` (or run `/init`) that links to this playbook and `VISION.md`.
