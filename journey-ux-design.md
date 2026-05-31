# Academy — Journey UX Design Spec

> Design-only spec for the gamified "journey" UX. **No code yet** — build begins
> after the in-browser QA pass (needs the Convex login). Authored 2026-05-30.
> Companion to `tasks.md`. Three layers: **Progress Chrome**, **Category Trail**,
> **Overworld Map**.

---

## 0. Design language (shared)

**Tokens (already in the app — reuse, don't invent):**
- Colors via CSS vars: `--color-ink` (text), `--color-muted`, `--color-border`,
  `--color-surface`, `--color-surface-2`, `--color-accent` (#6C5CE7-ish),
  `--color-accent-2`, `--color-success` (green), `--color-warn` (amber),
  `--color-danger` (red). Tailwind: `text-ink`, `bg-surface`, `border-border`, etc.
- **Per-unit accent**: every unit row has `accentColor` (e.g. scientific-working
  `#00B894`, energy `#FDCB6E`, relativity `#74B9FF`…). The journey is **colour-coded
  by category** — each station/trail uses its own accent, so progress reads as a
  rainbow ribbon across physics.
- **Icons**: lucide via `<Icon name=… size=… />`. Unit icons already set in seed
  (`Microscope`, `Zap`, `Move`, `Waves`, `Sun`, `CircuitBoard`, `Magnet`,
  `Thermometer`, `Atom`, `Orbit`, `Telescope`, `Sparkles`).
- **Level chips**: beginner→success, intermediate→warn, advanced→danger (existing).

**Motion principles (motion/react, already a dep):**
- Entrance: nodes fade+rise (`opacity 0→1`, `y 8→0`), staggered ~40ms down the path.
- `current` node: gentle pulse (existing `animate-pulse` or a scale 1↔1.06 loop).
- Hover on interactive nodes: `scale 1.06`, never on locked/soon.
- Completion: one-shot celebration (confetti already vendored —
  `canvas-confetti` is in the bundle) + a card slide-up.
- Respect `prefers-reduced-motion`: drop loops/parallax, keep instant states.

**State vocabulary (already defined in `LessonNode.tsx`, keep it):**
`locked · available · current · complete · soon`. Reuse verbatim across all layers
so the visual grammar is consistent (lock / play / check / clock / dashed).

---

## 1. Progress Chrome  *(build order: A — smallest, do first)*

**Goal:** make the gamification that already exists *visible* on every screen —
level, XP-to-next bar, streak, badge count — plus a "Continue" entry point home.

**Data:** the user row already stores `totalXP, level, currentStreak, longestStreak,
lastActivityDate, badges[]` — but **no query exposes them yet**. Add a tiny
`api.progress.getUserStats({ deviceId })` that returns those fields (or `null` for a
new device). ~6 lines, no schema change, but needs `npm run convex` to regenerate
`_generated`. (`xpToNextLevel(totalXP)` in `gamification.ts` gives `{ into, needed }`
for the bar — import it client-side.)

### 1a. Persistent stat bar

Lives in `__root.tsx` so it's on every page. Slim, sticky top, ~52px.

```
┌────────────────────────────────────────────────────────────────┐
│  ⚛ Academy        Lv.7  ▓▓▓▓▓▓▓░░░  40/100 XP      🔥 5    🏅 3  │
└────────────────────────────────────────────────────────────────┘
        logo/home        level + xp bar            streak   badges
```

- **Level pill**: `Lv.N`, accent-2 text on `surface-2`.
- **XP bar**: thin rounded track (`bg-surface-2`), fill `bg-accent` width =
  `into/needed`. Tooltip/label `into/needed XP`. Animate width on change.
- **Streak**: 🔥 + number; greyed when `streak===0`. (Day logic already in
  `streakTransition`.)
- **Badges**: 🏅 + count; click → future badges page (stub for now).
- **Logged-out / new device** (`getUserStats===null`): show `Lv.1 · 0 XP · no
  streak yet` rather than hiding — gives a target.
- **Hide on the lesson player** (`/learn/$`) to keep the lesson immersive, OR show
  a minimal variant. Recommendation: hide there.

**New files:** `src/components/ui/StatBar.tsx`. **Edits:** `__root.tsx` (mount it).

### 1b. Home "Continue" card

Top of `index.tsx`, above the subject grid, when the user has any progress.

```
┌──────────────────────────────────────────────┐
│  CONTINUE YOUR PATH                            │
│  Light & Optics · Lesson 3                     │
│  Refraction — Bending Light          [ ▶ Go ] │
└──────────────────────────────────────────────┘
```

- Needs a "resume point" = the user's `current` lesson (first incomplete published
  lesson, by subject/unit/lesson order). **Two options:**
  - (a) compute client-side from `getProgressForUser` + a catalog list (no backend), or
  - (b) add a tiny `api.catalog.getResumePoint({ deviceId })` query (cleaner, 1
    function). **Recommend (b)** — also reused by the overworld's "current" marker.
- Empty state (no progress): a "Start with Scientific Working" nudge instead.

**New files:** `src/components/ui/ContinueCard.tsx` (+ optional `getResumePoint` in
`catalog.ts`). **Edits:** `index.tsx`.

---

## 2. Category Trail  *(build order: B — most visible upgrade)*

**Goal:** turn the straight vertical `PathMap` spine into a **winding trail** that
*feels* like a journey, with deep-dive capstones as milestone "boss" nodes and a
celebration when the category is finished.

**Data:** unchanged — `getCategoryPath` + `getProgressForUser`, gating already
computed in `subjects.$subjectSlug.$unitSlug.tsx` (keep that logic). **One small
addition:** thread `format` ('core' | 'deepdive') into `LessonNodeData` so the trail
can render deep-dives as milestones (the field already exists on the lesson row).

### Layout — the winding trail

Replace the straight spine with a gentle **S-curve**: nodes alternate left ↔ right of
a centre line, connected by a smooth curved path. Circular nodes (not card+dot rows).

```
            ┌─────── unit header (icon, name, level range) ───────┐

                    (1)━━━━┓            1 = core lesson, complete ✓
                          ┃
                 ┏━━━━━(2)             current ● (pulsing accent-2)
                 ┃
                (3)━━━━┓               available (accent ring)
                       ┃
                 ┏━━(4)🔒              locked
                 ┃
              ╔═(5)═╗━━┓               ← deep-dive = LARGER milestone
              ║ 🏆  ║                    (trophy, double ring, glow)
              ╚═════╝
```

- **Node geometry (spec for impl):** centre `cx`, vertical spacing `~96px`, nodes at
  `x = cx ± amplitude` (amplitude ~70px), alternating by index parity. Connect
  consecutive nodes with a cubic Bézier (control points pulled vertically) so the
  path reads as a smooth trail. Render the path as one `<svg>` behind the nodes
  (stroke = unit accent at low opacity for the *completed* prefix, `--color-border`
  for the rest — a "progress fill" along the trail).
- **Core node**: 56px circle, ring colour by state (reuse current palette).
- **Deep-dive node**: ~80px, double ring + faint accent glow, `Trophy` icon,
  label "Capstone". Always the last node in a category (they're the 8th/last lesson).
- **Node label**: title + `min · XP` on a small chip beside the circle (alternating
  side so text never overlaps the curve). Level chip retained.
- **Progress ribbon**: the trail segment up to the `current` node is drawn in the
  unit accent; beyond it, muted. Gives an at-a-glance "how far in."
- **Mobile**: collapse amplitude → near-straight but keep curve + circular nodes.

### Category-complete celebration

When the last published lesson flips to complete (all done), show a one-shot card +
confetti (`canvas-confetti`). Reuse/extend `LessonCompleteCard` pattern.

```
        ✦ CATEGORY COMPLETE ✦
     Light & Optics — 7/7 lessons
        +350 XP · 🏅 Optics Adept
     [ Back to map ]   [ Next: Electricity → ]
```

- "Next" deep-links to the next unit's trail (needs next-unit slug — available from
  `getSubjectOverview` order, or pass via the overworld).

**New files:** `src/components/ui/TrailMap.tsx`, `TrailNode.tsx` (supersede
`PathMap`/`LessonNode`, or refactor them in place), `CategoryCompleteCard.tsx`.
**Edits:** `subjects.$subjectSlug.$unitSlug.tsx` (swap `PathMap`→`TrailMap`, pass
`format`), `LessonNode.tsx` type (`+ format`).

---

## 3. Overworld Map  *(build order: C — headline, biggest)*

**Goal:** replace the category **grid** (`subjects.$subjectSlug.index.tsx`) with one
continuous **winding path of 12 stations** in curriculum order — the "expedition
through physics" view. This is the signature screen.

**Data:** `getSubjectOverview({ subjectSlug })` already returns `units[]` with
`lessonIds`, `lessonCount`, and card metadata; combined with `getProgressForUser` we
compute per-unit `done/total`. Derive station state client-side:
- `complete` if `done === total` (published), `current` if it's the first
  not-complete unit, `available` if a prior unit unlocked it, else `locked`.
- **Optional polish:** a `getJourney({ deviceId })` query that returns each unit's
  `{done,total,state}` + the global resume pointer in one call (avoids client
  recompute; reuses `getResumePoint`). Nice-to-have, not required.

### Layout — hand-placed meandering map  *(decided: free map, not serpentine)*

A path that snakes down the page; each **station** is a large circular emblem in its
unit accent, with the unit icon, a **progress ring** (done/total), and the name.

```
   ╔══ PHYSICS ════════════ Lv.7 · 1,240 XP · 🔥5 ══╗   (uses the StatBar)

        ⬤ Scientific ✓
        Microscope, green ring full
          ╲
           ⬤ Forces ✓ ─────── ⬤ Energy ✓
           Move, full          Zap, full
                                  ╲
        ⬤ Light ● ──────────── ⬤ Oscillations ✓
        Sun, ring 3/7, PULSE   Waves, full
          ╲
           ⬤ Electricity 🔒 ── ⬤ Magnetism 🔒
                                  ╲
              … continues … ⬤ Frontiers 🏁 (locked, flag)
```

- **Station node**: ~72px circle, fill = `accent + '22'`, border = accent. Unit
  `Icon` centred. A **progress ring** (SVG circle stroke-dasharray) around it shows
  `done/total` in the accent; full ring + check when complete. `current` station
  pulses; `locked` stations are desaturated with a small lock.
- **Path**: a single **hand-authored meandering trail**. Station positions live in a
  per-subject coordinates array (`{ unitSlug, x, y }[]` in a viewBox, authored by
  hand for a characterful, organic route — not auto-laid-out). The connecting path is
  a smooth Bézier threaded through those points, drawn in accent for the completed
  prefix and muted ahead. Authoring coords by hand is the agreed trade (more art
  effort, more character).
- **Final station (Frontiers)**: a "summit/flag" treatment to signal the end of the
  path — a reward beat for finishing all of physics.
- **Click**: a station → its category Trail (layer 2). Locked → a tooltip "Finish
  *Electricity* to unlock."
- **Header**: subject name + the StatBar's level/XP/streak (or a subject-scoped
  progress bar "62/98 lessons").
- **Background**: a **per-subject backdrop motif** (decided: yes). Physics =
  constellations/space; chemistry = molecules; biology = cells; etc. Implemented as a
  layered SVG behind the map with subtle parallax drift on scroll (cheap 2.5D depth).
  Static under `prefers-reduced-motion`. See §7 for the asset spec.

**New files:** `src/components/ui/Overworld.tsx`, `StationNode.tsx` (+ optional
`getJourney` in `catalog.ts`). **Edits:** `subjects.$subjectSlug.index.tsx` (swap the
grid for `<Overworld>`). Keep `CategoryCard` around (handy for a future "list view"
toggle / accessibility fallback).

---

## 4. Backend summary (how little is needed)

| Layer | Existing query | New backend? |
|---|---|---|
| Progress chrome (bar) | user row has the fields | **1 tiny query** `getUserStats` (no schema change) |
| Continue card | `getProgressForUser` (+ optional `getResumePoint`) | tiny (1 fn) optional |
| Category trail | `getCategoryPath`, `getProgressForUser` | **none** (just pass `format` on FE) |
| Category-complete | derive from progress | **none** |
| Overworld | `getSubjectOverview`, `getProgressForUser` | optional `getJourney` rollup |

The whole journey ships with **zero schema changes**. Backend work is just one small
required query (`getUserStats` — the data's already on the user row) plus a couple of
optional convenience rollups. Everything else is a frontend redesign over existing
data. (Any new Convex function needs `npm run convex` running to regenerate
`_generated/` before the frontend can resolve it.)

## 5. Recommended build sequence (after QA)

1. **A — StatBar** in `__root.tsx` (instant visible payoff; pure FE + existing query).
2. **A — Continue card** on home (+ `getResumePoint`).
3. **B — TrailMap/TrailNode** (winding trail + deep-dive milestones) and swap into
   the category page; thread `format`.
4. **B — Category-complete celebration** (confetti + card + "next category").
5. **C — Overworld** (serpentine stations) replacing the grid; optional `getJourney`.
6. Polish pass: parallax, reduced-motion, mobile amplitudes, empty/locked states.
7. *Later, selectively:* real 3D accents (e.g. a tilt/parallax station emblem or an
   R3F summit) only where it earns the cost.

## 6. Decisions (resolved 2026-05-30)
- **Overworld shape:** ✅ free **meandering map with hand-placed stations** (not
  serpentine). Coords authored per subject (§3).
- **Per-subject backdrop motif:** ✅ yes — each subject gets its own themed backdrop
  (§7).
- **Streak rule:** ✅ confirmed — completing ≥1 lesson/day keeps the streak
  (`streakTransition` via `completeLesson`).
- **Per-category badges:** ✅ surface now — full scheme below.

## 7. Assets & art

> The app is **code-driven SVG/rAF** by convention. Default to vector. For every
> asset slot below I'll build a **code-rendered fallback** so the system works before
> any art lands — art is an upgrade, never a blocker. **Not needed yet:** 3D models
> and video (those are for later in-lesson "wow", not the journey). The two
> high-leverage asks are **(1) per-category badges** and **(2) the physics backdrop**.

**Global art constraints (so assets drop straight in):**
- **Transparent background** (everything sits on a dark `--color-surface`).
- **SVG preferred** (scalable, recolourable, animatable); 512×512 transparent PNG
  acceptable if an illustration is too organic for clean SVG.
- Flat-modern style, subtle glow welcome (the "visual science" vibe). Each asset uses
  its category **accent colour** as the dominant hue.
- Locked/greyed states are derived in **CSS** (`grayscale + opacity`) — only supply
  the *unlocked/full-colour* version.

### 7a. Per-category badges (12 for Physics) — **highest value**

One collectible medal per category, awarded on **category completion** (all published
lessons done). Circular medal/emblem, ~512×512, transparent, accent-dominant.

| # | unitSlug | Badge name | Motif idea | Accent |
|---|---|---|---|---|
| 1 | `scientific-working` | Method Master | microscope + ruler / checkmark flask | `#00B894` |
| 2 | `forces-and-motion` | Force Adept | falling apple + motion arrow | `#6C5CE7` |
| 3 | `energy` | Energy Adept | lightning bolt in a gear/battery | `#FDCB6E` |
| 4 | `oscillations` | Wave Rider | sine wave / swinging pendulum | `#00CEC9` |
| 5 | `light-and-optics` | Optics Adept | prism splitting a white ray to rainbow | `#FAB1A0` |
| 6 | `electricity` | Circuit Master | bolt inside a closed circuit loop | `#E17055` |
| 7 | `magnetism` | Field Master | horseshoe magnet + field lines | `#D63031` |
| 8 | `matter` | Matter Master | three states (ice/drop/vapour) or thermometer | `#0984E3` |
| 9 | `atoms-and-quantum` | Quantum Adept | atom with an orbital haze | `#A29BFE` |
| 10 | `relativity` | Spacetime Adept | clock warped on a grid / light cone | `#74B9FF` |
| 11 | `astronomy` | Cosmic Voyager | ringed planet + galaxy swirl | `#4834D4` |
| 12 | `frontiers` | Frontier Pioneer | glowing crystal / flag on a summit | `#E84393` |

- **Badge key:** `unit-<unitSlug>` (e.g. `unit-light-and-optics`). **Asset path:**
  `public/badges/physics/<unitSlug>.svg`.
- **Backend to award them:** extend `completeLesson` — after marking a lesson
  complete, check whether all *published* lessons in its unit are now complete; if so
  `award(\`unit-${unitSlug}\`)`. (Small mutation change; needs `npm run convex`.)
  This supersedes the "none" backend note for badges in §4.
- **Generation prompt template** (per row — swap in name/motif/accent):
  > "A flat, modern circular achievement medal for a science learning app, on a
  > transparent background. Subject: **{motif}**. Dominant colour **{accent}** with a
  > soft outer glow and a subtle metallic rim. Clean vector style, centred, no text,
  > 512×512, suitable to sit on a dark UI. Minimal, iconic, not cluttered."

  You can supply a few to start; any missing badge falls back to a code-rendered
  `Icon`-in-an-accent-ring medal, so partial delivery is fine.

### 7b. Per-subject overworld backdrop (start: Physics) — **second priority**

A wide, dark, **seamless/loosely-tileable** SVG that sits behind the meandering map
and parallax-drifts on scroll.
- **Physics:** a deep-space field — faint stars, a few constellation lines, a soft
  nebula wash in `#6C5CE7`/`#74B9FF`. Very low contrast (it's a *background* — the
  stations and path must pop in front of it).
- Spec: ~1600×1200 SVG (or PNG), transparent or very-dark fill, elements grouped into
  2–3 depth layers (far stars / mid constellations / near wisps) so I can parallax
  them at different rates.
- **Prompt:**
  > "A subtle, dark deep-space background for a UI, very low contrast. Scattered faint
  > stars, a few thin constellation lines, and a soft purple-blue nebula wash
  > (#6C5CE7, #74B9FF) in the corners. Mostly empty dark space in the middle so
  > foreground UI stays readable. Flat vector, seamless, no text, no planets in the
  > centre."
- Fallback: I can generate a deterministic star-field in code (à la `CosmicScale`),
  so this is a nice-to-have richness upgrade.

### 7c. Station emblems (optional, low priority)

Stations use the existing lucide unit icons by default (`Microscope`, `Zap`, `Move`,
…). Custom illustrated emblems per category would be a polish upgrade but are **not
needed** for v1 — skip unless you're keen.
