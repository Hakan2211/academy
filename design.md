# Academy — Visual Design & Architecture Plan

> The plan for taking the app to a top-tier ("Brilliant × a premium sci-fi game") look.
> Started 2026-05-31. Companion to `journey-ux-design.md` (UX/IA) and
> `tasks.md` (build state). Reference renders: see **§7**.

---

## 1. Vision

One cohesive **science universe** you travel through. It must feel premium, alive, and
immersive — full-bleed, atmospheric, with real depth and motion — not a flat list of cards.
Benchmark: Brilliant's clarity × a AAA game's "world map" × Apple-keynote polish.

The earlier built journey UI (flat SVG circles on a gradient, boxed in a narrow column) was
functional but read as a *toy*. This plan replaces that look wholesale.

## 2. The core technique — "Lit Illustration" (3 layers per screen)

Every signature screen is composed of three stacked layers. This is how award-winning sites
get render-farm visuals that still feel interactive — and it **scales**.

1. **Base art** — high-quality pre-rendered images (AI-generated, then optimized). The "art".
   Generated as **clean plates**: art only, *no baked UI text/labels/HUD*.
2. **Atmosphere (WebGL / Canvas, R3F)** — parallax on scroll + mouse, drifting particles,
   bloom on bright spots, subtle shader "breathing"/godrays, grain + vignette, hover-light.
   Makes the static art feel 2.5D and alive. Static under `prefers-reduced-motion`.
3. **Interactive overlay (DOM / SVG)** — the clickable nodes/hotspots + **all dynamic,
   data-driven state**: progress rings, locked/current/complete, XP, hover tooltips, crisp
   real text. This layer is real DOM so it stays legible, accessible, and live.

Plus a tiny **config** per screen: `{ key, x%, y%, scale, depth }[]` mapping hotspots onto
the art. New content = one image + one config row.

Why this wins: art quality of a render at the cost of a PNG; still alive via the FX layer;
dynamic data stays crisp DOM (not baked); and it scales without a 3D-modeling pipeline.

## 3. The hybrid metaphor (decided 2026-05-31)

Two layouts, **one universe** — and the difference is *meaningful*, not inconsistent:

| Layout | Used for | Why | Mockup |
|---|---|---|---|
| **Islands** (floating worlds) | **Subjects** (Physics, Biology, Chemistry, Math, CS, Psychology) | Subjects are *parallel, independent* worlds — "choose a universe". No order between them. | `1.5B` (+ glass cards/HUD from `1.5A`) |
| **Path** (winding trail) | **Categories within a subject** (the 12 physics units) + the lessons within a category | Categories are an *ordered, gated journey* — a path reads as progress + locks. | `1A` overworld, `Category Trail` |

**Unified by:** the same deep-space cosmos, the same **glass chrome** (HUD bar, cards,
buttons — the `1.5A`/`2.6` language), the same glow/bloom/particles, the same type +
per-accent colour system. Connective tissue = a **"zoom into the island"** transition:
pick the Physics island on the hub → camera dives in → you're on the Physics category path.

> We keep BOTH things the owner loved: islands (1.5B) as the base art + glass cards/HUD
> (1.5A) as the overlay chrome.

## 4. Asset strategy — MODULAR, per-island (decided 2026-05-31)

**Generate each island / emblem as its own clean-plate specimen, not one combined scene.**

- **Expandable:** add a subject = generate 1 island PNG + 1 config row. Never re-render the
  world or re-author all coords.
- **Live per-island:** independent float-bob, glow, hover, and dynamic locked/progress state.
- **Composed in code:** we control arrangement, responsive reflow, per-island parallax depth,
  and reuse (same island on hub / headers / loaders).
- **Consistency:** generate every island with the **same style reference** (Midjourney
  `--sref` + a fixed `--seed`) and a fixed camera angle + lighting direction so they sit
  together. Transparent (or easily-keyed dark) background.
- **Trade-off:** composition + inter-island lighting is now our job → solved with a layout
  config, WebGL light-bridges/particles between islands, and consistent prompt lighting.

Same idea one level down: the **category path** = individual emblem/orb specimens positioned
on a path drawn in code (not one baked path image).

### Asset inventory (clean plates to generate)
- 6 **subject islands** (transparent): physics, biology, chemistry, mathematics,
  computer-science, psychology.
- 12 **category emblem-orbs** (physics units) — already specced in
  `journey-ux-design.md` §7a + the prompts file §3.3.
- 12 **category emblem-orbs (station planets)** — **DONE** (owner-generated, 2026-05-31):
  luminous accent planet-spheres (some with Saturn rings), 500–1024px transparent, at
  `public/orbs/physics/<slug>.png`. These are the overworld **orb art** (wired into
  `OrbStation` via `ORB_IMAGE`).
- 12 **badge medals** — **DONE** (owner-generated, 2026-05-31): glossy chrome-rimmed
  accent coins, 500×500 transparent, at `public/badges/physics/<slug>.png`. The *reward*
  medals for the future `/badges` collection (NOT the overworld orbs).
- 1–2 **cosmos backdrops** (wide + portrait) — prompts file §3.1 (`3.1` render done).

## 5. Routes → screens → assets

| Route | Screen | Metaphor | Base art | Status |
|---|---|---|---|---|
| `/` | Subjects hub | Islands | 6 subject islands on a cosmos backdrop | **BUILT** (modular islands + WebGL nebula) |
| `/subjects/$subject` | Category overworld | Path | cosmos + 12 emblem-orbs | **BUILT** (`CategoryOverworld`, real medal orbs + shine; mockup `1A`) |
| `/subjects/$subject/$unit` | Category trail (lessons) | Path | cosmos + lesson orbs | **BUILT** (`LessonTrail` + `LessonOrb`, mockup `Category Trail`) |
| `/learn/$` | Lesson player | — | per-lesson 3D viz + glass panel | **BUILT** (`LessonShell` adaptive two-pane/single-column, mockup `2.3`) |
| (lesson end) | Lesson complete | — | glass card + confetti + medal | **BUILT** (`LessonCompleteCard`, mockup `2.4`) |
| `/badges` | Badge collection | constellation | cosmos + medals | **BUILT** (`BadgeConstellation`, mockup `2.5`) |
| global | Stat bar / HUD | — | glass bar | **BUILT** (glass HUD pill, mockup `2.6`) |

## 6. Gotchas (and how we handle them)

- **Clean plates:** production base art must be generated *without* baked UI text/HUD —
  all text/UI is real DOM on top. (Mockups bake UI; that was great for deciding the look.)
- **Responsive:** fixed-aspect base art needs care on portrait/mobile. Hotspots are
  %-of-image; we letterbox or use a portrait variant + safe margins. No object-cover crop
  on the hotspot layer (it would break alignment).
- **Hotspot alignment:** coords are authored once per finalized image; regenerating the art
  shifts coords → re-author. Treat each approved plate as a fixed asset.
- **Weight:** big files → serve optimized webp/avif at responsive sizes, lazy-load.
- **Accessibility:** base art is decorative (alt=""); hotspots are real focusable buttons
  with labels; FX layer respects `prefers-reduced-motion`.

## 7. Reference renders (owner-generated)

Folder: `C:\Users\User\OneDrive\Desktop\Academy Design`
(working copies land in `public/` as we wire them in)

| File | Screen | Notes |
|---|---|---|
| `Cosmic Glass 1A .jpg` | Category overworld (path) | the path/orbs gold standard |
| `Luminous Low Poly 1B.jpg` | (overworld, island variant) | reference for island look |
| `Painterly Cosmos 1C.jpg` | (overworld, painterly variant) | atmosphere reference |
| `Cosmic Glass 1.5A.jpg` | Subjects hub (cards) | glass card + HUD language |
| `Luminous Low Poly 1.5B.jpg` | **Subjects hub (islands)** | **POC base art** |
| `Painterly Cosmos 1.5C.jpg` | Subjects hub (painterly) | atmosphere reference |
| `Category Trail.jpg` | Category trail | lesson path + capstone |
| `Lesson Player ... 2.3.jpg` | Lesson player | glass panel + 3D viz |
| `Lesson Complete 2.4.jpg` | Lesson complete | reward burst |
| `Badges trophy room 2.5.jpg` | Badges | medal constellation |
| `Top HUD stat bar 2.6.jpg` | StatBar | glass HUD bar |
| `Deep space backdrop 3.1.jpg` | backdrop | cosmos plate |
| `Badge 1 Method Mater.png` | badge sample | per-category medal |

## 8. Build sequence

1. **POC — Subjects hub** (this step): prove the lit-illustration technique live in the app
   using `1.5B` as a stand-in base (parallax + particle FX + glowing DOM island hotspots +
   glass HUD, wired to Convex). Validates the architecture before mass-generating assets.
2. Generate **clean-plate assets** (per-island specimens + backdrop), per the prompts file.
3. Rebuild the hub on real modular islands + add R3F bloom/shader polish. ✅
4. ✅ **Build the category overworld** (path + emblem-orbs) on the same stack —
   `src/components/ui/CategoryOverworld.tsx` + `OrbStation.tsx`, wired into
   `subjects.$subjectSlug.index.tsx` (replaced the boxed old `Overworld`). Reuses
   `CosmosCanvas` (nebula tinted by category accents) + a 2D-canvas winding path
   (golden completed prefix w/ flow + pulses, dim locked remainder) + procedural
   lit planet-orbs (stand-in for §3.3 orb plates) with strict gating + parallax.
   Typecheck + build clean. **Not yet run in-browser** (needs Convex login QA).
5. Re-skin the remaining screens to the mockups:
   - ✅ **Category trail** (lessons within a category) — `src/components/ui/LessonTrail.tsx`
     + `LessonOrb.tsx`, wired into `subjects.$subjectSlug.$unitSlug.tsx` (replaced the
     boxed `TrailMap`). Same lit-illustration stack as the overworld, one level down:
     fixed `CosmosCanvas` nebula (accent-tinted) + a 2D-canvas winding S-path (accent
     "completed" prefix w/ flow + pulses, dim remainder, orb bloom) + DOM glass lesson
     orbs (procedural; state-driven; deep-dive = centred capstone w/ crown + godray) +
     glass label cards + glass hero header + persistent back pill. Scrollable for any
     lesson count. Reuses `CategoryCompleteCard` (shown centred when 100%). Typecheck +
     build clean. **Not yet run in-browser** (needs Convex login QA). `TrailMap`/
     `TrailNode` now orphaned (kept as list-view fallback).
   - ✅ **Lesson player** (`2.3`) — `src/components/lesson/LessonShell.tsx` (immersive
     Cosmic Glass chrome: exit pill, frosted-glass step panel, gradient Continue, bottom
     step-dots) + `LessonBackdrop.tsx` (calm CSS cosmos) + `heroTypes.ts` (lazy hero
     allowlist from the MDX registry). `Lesson.tsx` rewritten as the controller: it
     splits each step into one hero visual + the rest and the shell lays it out
     **adaptively** — one hero → two-pane (visual left, glass text panel right, the
     mockup); zero or several → single centred glass column. Generic across all 98
     lessons; validated on the pendulum. Route `learn.$.tsx` now full-bleed (dropped the
     boxed `max-w-3xl` + exit button → moved into the shell). `StepShell`/`ProgressDots`/
     `NextBackBar` orphaned. Accent defaults to violet→cyan (per-category accent threading
     is a follow-up — needs `getLessonMeta` to also return the unit accent + a Convex
     push). Typecheck + build clean. **Not yet run in-browser** (needs Convex login QA).
   - ✅ **Badges** (`2.5`) — `src/components/ui/BadgeConstellation.tsx`: full-bleed cosmos
     (`CosmosCanvas`) + a constellation of medal coins (real PNG for `unit-*`, procedural
     otherwise) joined by nearest-neighbour lines (SVG, `preserveAspectRatio=none`),
     earned=lit / locked=desaturated+lock, header (`n of N earned`) + earned/locked legend;
     dropped the mockup's left nav rail (our IA = top HUD). Wired into `routes/badges.tsx`
     (full-bleed; replaced the boxed grid). `BadgeMedal` now orphaned.
   - ✅ **HUD / StatBar** (`2.6`) — `StatBar.tsx` re-skinned to a floating glass pill
     (glowing azure rim, section dividers, glowing atom/flame/medal icons, Lv chip, XP bar);
     keeps the 52px reserved height so the full-bleed pages' `calc(100vh-52px)` stays aligned.
   - **§8 step 5 COMPLETE** — every signature screen now re-skinned to the mockups.
   - ✅ **Lesson complete** (`2.4`) — `LessonCompleteCard.tsx` rewritten as a frosted
     Cosmic Glass celebration: floating emblem, big gold **+XP**, level bar (accent→green→
     gold) with a **LEVEL UP!** pill, the new badge as a glowing coin (real medal PNG for
     `unit-*` keys, else a procedural accent coin) over a rotating burst, and a **streak
     row** of flames; glows in the lesson's category accent; confetti (reduced-motion
     aware). Adaptive: two-column when a badge is earned, single centred column otherwise.
   - ✅ all of step 5 done — see the per-screen entries above. ← NEXT is step 6 (polish).
6. Polish: transitions ("zoom into island"), reduced-motion, responsive/portrait, perf.
   (Overworld + trail mobile/portrait still desktop-first; orb clean-plate swap-in pending.)

## 9. Decisions log
- 2026-05-31 — Direction: **Cosmic Glass system** + islands(subjects)/path(categories) hybrid,
  one universe. Tech: **lit illustration** (image + WebGL + DOM). Assets: **modular per-island**.
- Open: category gating strict vs loose (see `tasks.md`); whether the category overworld
  becomes a "landed-on island" vista later vs the cosmic path.
