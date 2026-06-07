# Orbisle — Vision, Goals & Roadmap

_Last updated: 2026-05-28_

## Mission

Make science genuinely **click** for people by teaching it **visually and
interactively** — text, 3D, 2D animation, shaders, images, and video woven into
short, playful, gamified lessons. Think **Brilliant** (interactive depth) ×
**Blinkist** (bite-sized) × **Mondly/Duolingo** (gamified paths & streaks),
focused on **science**.

## What we're building

A learning platform where a user:

1. Picks a **subject** (Physics, Chemistry, Biology, Math, Computer Science, Psychology),
2. Walks a **gamified path** of bite-sized **lessons**,
3. Learns each concept through a sequence of **steps** — explanation, an
   interactive visual (3D/animation), and a quick check — instead of walls of text,
4. Earns **XP, levels, streaks, and badges**, with progress that syncs across devices.

**Phase 1 is the web app, starting with Physics.** A mobile app comes later and
shares the same backend.

## Goals

- **Understanding over memorization.** Every concept should have a "play with
  it" moment (sliders, simulations) that produces an _aha_.
- **Visual-first.** Default to showing, not telling. 3D/animation/diagrams are
  the lesson, not decoration.
- **Bite-sized & finishable.** Lessons are ~5–7 minutes, 4–6 steps each.
- **Gamified & habit-forming.** XP, levels, daily streaks, badges — eventually
  daily goals and leaderboards.
- **Beautiful & cohesive.** A polished dark, depth-rich aesthetic with springy,
  tasteful motion.
- **Author-friendly.** Lessons are MDX files — writing content shouldn't require
  touching app plumbing.
- **Cross-platform-ready backend.** One Convex backend serves web now and mobile later.

## Current state (Phase 1 — foundation ✅)

Built and verified end-to-end:

- TanStack Start + Convex + MDX + React Three Fiber/GLSL + motion + Tailwind v4 + KaTeX.
- Home (subject grid), subject **path** (gamified lesson map), and the **lesson player**.
- The **step engine**: one MDX doc → paginated steps with progress, quiz gating,
  and a reward screen.
- **One complete Physics lesson** — _"Why a Pendulum Swings"_ — with an
  interactive 3D pendulum, an animated SVG, a GLSL shader background, a quiz, and
  the full XP/streak/badge completion flow.
- **Anonymous, device-based progress** (no login yet), persisted in Convex.

See `README.md` for setup and `.claude/skills.md` for how to extend it.

## Roadmap (what's next)

### Phase 2 — Physics curriculum & richer interactives
- Build out the real **Physics** curriculum (units → lessons) once topics are decided.
- More `Scene3D` interactives: waves, projectile motion, forces/Newton's laws,
  circuits, optics, etc.
- **AI image pipeline**: generate consistent educational illustrations with
  Gemini 2.5 Flash Image ("nano banana") / GPT-image; wire into `<Figure>`/`<Video>`.
  Decide storage (Convex file storage vs CDN) as volume grows.
- A lightweight **content/authoring workflow** (and maybe an admin tool) so lessons
  + their catalog rows stay in sync without hand-editing `seed.ts`.

### Phase 3 — Accounts & real gamification
- Add **Better Auth + Convex** (email/OAuth) — migrate the anonymous `deviceId`
  user to a real `authId` (the schema already reserves the slot).
- Cross-device sync, profile, daily goals, **leaderboards**, richer badges,
  hearts/lives, streak freezes.

### Phase 4 — Mobile app
- **Expo / React Native** app sharing the same Convex backend.
- Reuse lessons via a **WebView** (the lesson UI is intentionally backend-agnostic);
  native navigation/path/progress/gamification via Convex.
- Extract `convex/` into a shared workspace package (monorepo) at this point.

### Phase 5 — Scale to all subjects & smarter learning
- Roll out Chemistry, Biology, Math, CS, Psychology.
- Spaced repetition / review, adaptive difficulty, "mistake bank".
- Video lessons, richer media, social/sharing.

## Design principles & decisions

- **MDX-first content**, custom components injected (`<Lesson>/<Step>/<Quiz>/<Scene3D>/<Formula>/<Figure>/<Video>/<Callout>/<SineWave>`).
- **Lessons are backend-agnostic** — they talk to a `LessonRuntime` context, so a
  future mobile WebView can host the same lesson with different callbacks.
- **3D is client-only** (`<ClientOnly>` + `ssr:false`); WebGL never runs in SSR.
- **Catalog = metadata in Convex; content = MDX** addressed by `contentSlug`.
- **Auth deferred**; anonymous `deviceId` now, `authId` migration path reserved.
- **Single app now**, monorepo extraction deferred to the mobile phase.

## Open questions to revisit

- Final Physics curriculum (units & lesson list, ordering).
- Visual style guide for AI-generated images (palette, line weight, labeling) for consistency.
- When to introduce auth (does anonymous progress create friction?).
- Image storage strategy at scale (Convex storage vs Cloudflare/CDN).
- Pricing/free-tier model (out of scope for now).
