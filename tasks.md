# Orbisle — Tasks & Handoff

> Pick-up note for the next session. Point Claude at this file to resume.
> Last worked: 2026-05-31. Project: gamified visual science app (Physics first).

---

## 🟢 Status (2026-05-31)

- **In-browser QA pass: DONE** (owner ran the Convex login + click-through and
  reported it clean). The QA checklist below is kept for reference/history.
- **Journey UX Layers A + B + C: ALL BUILT & verified** (typecheck clean except
  the 1 pre-existing `GradientBackground` `@ts-expect-error`; full `npm run build`
  green for all three). The gamified journey is feature-complete on Physics.
- **Per-category badges: BUILT & verified (2026-05-31).** What shipped:
  - `convex/progress.ts` `completeLesson` → now awards `unit-<unitSlug>` when every
    published lesson in the finished lesson's unit is complete (mutation change →
    **needs `npm run convex`** to push). Existing `first-lesson`/`oscillation-novice`
    awards untouched.
  - `src/lib/badges.ts` → 12 `unit-<slug>` entries (label/icon/color from design §7a;
    lucide icon fallbacks until real art lands at `public/badges/physics/<slug>.svg`).
  - `src/components/ui/CategoryCompleteCard.tsx` → emblem now uses the unit's badge
    icon + a "<Badge> earned" chip.
  - `src/components/ui/BadgeMedal.tsx` (new) + `src/routes/badges.tsx` (new `/badges`
    page) → collection grid, earned = colour medal, locked = greyed (CSS).
  - `src/components/ui/StatBar.tsx` → badge count is now a `<Link to="/badges">`.
  - Note: adding a route means `routeTree.gen.ts` must regenerate — the vite router
    plugin does it on `npm run build`/`dev`, NOT on bare `tsc`. So verify new routes
    with **build first, then tsc**.

### Layer C — Overworld Map (built 2026-05-31)
- `src/components/ui/SpaceBackdrop.tsx` → code-rendered deep-space backdrop
  (deterministic sin-hash star layers — no `Math.random`, so SSR/CSR match — +
  2 constellation lines + nebula wash in #6C5CE7/#74B9FF). Static; **scroll
  parallax deferred to polish** (spec §5 step 6). A real SVG asset can drop in later.
- `src/components/ui/StationNode.tsx` → ~84px station: accent emblem + SVG
  done/total progress ring; states = locked (desaturated + lock + tooltip) /
  available / current (pulse) / complete (check); summit (Frontiers) gets a flag.
  Links to the category trail.
- `src/components/ui/Overworld.tsx` → hand-placed meandering map of the 12
  stations. `STATION_X` (per-slug %) tuned for an organic left/right meander;
  y derived from curriculum index (can't drift out of order). Catmull-Rom spline
  path behind the stations (muted full + subject-accent completed prefix). Same
  viewBox alignment trick as TrailMap.
- `src/routes/subjects.$subjectSlug.index.tsx` → **grid replaced by `<Overworld>`**
  + a subject-progress header ("X/Y lessons across N categories"). `CategoryCard.tsx`
  now orphaned (kept for a future list-view toggle / a11y fallback).
- **⚠️ UX CHANGE — category gating is now STRICT.** A station unlocks only when the
  previous category is 100% complete (mirrors the lesson-level gating). So a fresh
  device sees station 1 = current, stations 2–12 = locked. This is per the design
  spec (locked stations + "Finish X to unlock" tooltips), but it's a real change
  from the old freely-clickable grid. The logic is `computeStates()` in
  `Overworld.tsx` — easy to loosen if you'd rather keep categories open (e.g. unlock
  on "previous started" or no gating at all). **Tell Claude if you want it looser.**

### Layer B — Category Trail (built 2026-05-31)
- `src/components/ui/TrailNode.tsx` → circular station, reuses LessonNode's state
  palette; deep-dive = larger (74px) Trophy node with double-ring + accent glow.
- `src/components/ui/TrailMap.tsx` → winding S-curve (nodes alternate L/R at
  viewBox x=34/66, ROW=116px). One SVG behind the nodes draws the full trail
  (muted) + a progress-ribbon prefix in the unit accent up to the `current` node.
  Side labels (outward, clear of the curve), staggered fade+rise entrance,
  `useReducedMotion`-aware. **Geometry trick:** `viewBox="0 0 100 {totalH}"` +
  `preserveAspectRatio="none"` so SVG x=0..100 ≡ width-% (matches HTML `left:%`)
  and y=px ≡ container height (matches HTML `top:px`); stroke kept crisp with
  `vectorEffect="non-scaling-stroke"`. Node centring uses a static
  `-translate-1/2` wrapper SEPARATE from the motion div (motion owns transform).
- `src/components/ui/CategoryCompleteCard.tsx` → shown at top of a 100%-complete
  category: Trophy, unit name, n/n, Back-to-map + Next-category links. Confetti
  once per session (sessionStorage `cat-celebrated:<subject>/<unit>` guard),
  reduced-motion aware. Mirrors `LessonCompleteCard`'s dynamic `canvas-confetti` import.
- `convex/catalog.ts` `getCategoryPath` → now also returns flat `nextUnitSlug` /
  `nextUnitName` (next category by order) for the "Next →" link.
- `src/routes/subjects.$subjectSlug.$unitSlug.tsx` → swapped `PathMap`→`TrailMap`,
  threads `format`, computes `allComplete`, renders the celebration card.
- **Known polish-later (spec §5 step 6):** mobile label width gets tight (~65px at
  360px viewport) because amplitude is a fixed viewBox %. `PathMap.tsx`/`LessonNode.tsx`
  are now orphaned (kept as a possible list-view fallback, not deleted).

### Layer A — Progress Chrome (built 2026-05-31). What shipped:
  - `convex/progress.ts` → new `getUserStats(deviceId)` query (Lv/XP/streak/badges
    off the user row; `null` for an unknown device). Has a `returns` validator.
  - `convex/catalog.ts` → new `getResumePoint(deviceId, subjectSlug)` query: first
    incomplete published lesson by unit→lesson order; returns
    `{ state:'start'|'continue'|'done', + flat lesson fields }` (see gotcha below).
  - `src/components/ui/StatBar.tsx` → sticky top chrome, mounted in `__root.tsx`
    (inside `DeviceIdProvider`). Hidden on `/learn/*`. New-device fallback = Lv.1/0XP.
  - `src/components/ui/ContinueCard.tsx` → home resume card, mounted at top of
    `index.tsx` (above the subject grid). start/continue/done states, accent-coloured.
- **⚠️ To see live data you MUST have `npm run convex` running** so the two NEW
  queries get pushed to the deployment. Until pushed they error → StatBar shows the
  Lv.1 fallback and ContinueCard renders nothing (graceful, no crash). Then `npm run dev`.
- **Convex gotcha learned (reuse for Layer B/C rollups):** a `v.object` nested
  inside a *union-typed field* (e.g. `lesson: v.union(v.null(), v.object({…}))`)
  gets DROPPED by the return-type inference the client sees — the field collapses
  to `never`/`null` even with a `returns` validator. **Fix: keep such fields FLAT**
  (top-level `v.union(v.string(), v.null())` etc.), not grouped under a nested
  nullable object. Also: don't assign the "found" var inside a `.forEach` closure
  (TS widened it to `never`); a plain `for` loop + truthiness narrowing works.
- **⚠️ Runtime note (still applies):** `getUserStats`, `getResumePoint`, and the
  modified `getCategoryPath` are new/changed Convex functions — keep `npm run convex`
  running so they push to the deployment, then `npm run dev`. Graceful fallback if not.
- **Next (journey + badges feature-complete — pick from polish/extensions):**
  1. ✅ DONE — Per-category badges (see status above).
  2. **Polish pass** (spec §5 step 6): backdrop scroll parallax; mobile amplitudes
     (TrailMap/StationNode labels get tight on narrow screens); reduced-motion sweep.
  3. **List-view toggle** on the overworld (reuse the orphaned `CategoryCard`) for
     a11y / free-roam — also the natural place to relax gating.
  4. Optional `getJourney` rollup query (replace client recompute) — apply the
     flatten-nested-objects Convex gotcha.
  5. Real art assets — drop badge SVGs into `public/badges/physics/<slug>.svg`
     (code-medal fallback works now) + a physics backdrop SVG (replaces the
     code starfield in `SpaceBackdrop.tsx`).
  6. Older backlog still open: exit-lesson → specific category TOC; "Next lesson"
     button on the lesson-complete screen.

---

## ▶️ First thing: get it running & QA what's built

These changes are mostly **Convex (schema/queries/seed) + new frontend components**, which
do **not** hot-reload on their own. Run, in three terminals:

```sh
npm run convex                 # 1) leave running — pushes schema + functions, regenerates _generated
npx convex run seed:reset      # 2) wipe old catalog (the seed guard no-ops otherwise)
npm run seed                   #    re-seed the new taxonomy
npm run dev                    # 3) http://localhost:3000
```

- [ ] **QA pass on Forces & Motion (14 lessons).** I authored 9 visual components but
  **could not run the app** (Convex needs the interactive browser login, which only you can
  do). Click through each lesson and flag anything that looks off — especially the untested
  animations: `Collision`, `OrbitLab`, `CircularMotion`, `ActionReaction`, `FreeFall`,
  `ForceDiagram`. (Low risk — they're self-contained SVG/rAF, so worst case is a visual
  glitch, not a crash.)
- [ ] Sanity-check the two **deep-dives**: Projectile Motion (lesson 11) and Orbits (14).
- [ ] Confirm the pendulum still works under **Oscillations & Waves** and still awards the
  `oscillation-novice` badge. (Badge logic is keyed on `physics/simple-harmonic-motion` in
  `convex/progress.ts` — untouched this session, so it should be fine.)
- [ ] **QA pass on Energy & Work (8 new lessons).** Built this session — also unrunnable here
  (needs the Convex login). Click through and flag anything off, especially the **5 brand-new
  untested visuals**: `EnergySkater` (KE↔PE↔heat ramp, friction slider), `WorkLab` (W = F·d
  area), `PowerRace` (two hoists), `ThermalJiggle` (particle box + temp slider), `EntropyBox`
  (diffusion + disorder meter). All self-contained SVG/rAF, so worst case is a visual glitch.
  The deep-dive **Entropy & the Second Law** (lesson 8) is the capstone — give it a close read.
- [ ] **QA pass on Oscillations & Waves (6 new lessons + the existing pendulum).** Built this
  session, also unrun. Flag anything off, especially the **6 brand-new untested visuals**:
  `WaveLab` (amplitude/wavelength/frequency sliders + v=fλ readout), `WaveType` (transverse vs
  longitudinal toggle), `PulseReflect` (fixed/free-end inversion), `Refraction` (wavefronts bend
  with a speed-ratio slider), `Superposition` (two waves + sum, phase & beats), `StandingWave`
  (nodes/antinodes, harmonic slider). The deep-dive **Interference & Standing Waves** (lesson 7)
  is the capstone. Also re-confirm the pendulum + its `oscillation-novice` badge still work.
- [ ] **QA pass on Light & Optics (7 new lessons).** Built this session, also unrun. Flag
  anything off, especially the **6 brand-new untested visuals**: `ShadowCast` (lamp + shadow),
  `MirrorReflect` (law of reflection slider), `LensRays` (convex/concave + focal slider),
  `PrismDispersion` (static rainbow fan), `SpectrumBar` (EM-spectrum slider with λ/f readouts),
  `DoubleSlit` (animated wavefronts + fringe pattern). Lesson 3 reuses `Refraction` and lesson 7
  reuses `Superposition` from the waves set. Deep-dive capstone = **Wave Optics** (lesson 7).
- [ ] **QA pass on Matter, Pressure & Heat (8 new lessons).** Built this session, also unrun
  (needs the Convex login). Flag anything off, especially the **7 brand-new untested visuals**:
  `StatesOfMatter` (solid/liquid/gas particle toggle), `BuoyancyTank` (density slider, float/sink),
  `PressureLab` (force ÷ area, contact-area slider), `FluidPressure` (three depth jets — rAF
  droplets), `GasPistonLab` (Boyle's law piston + particle box), `HeatTransfer` (conduction/
  convection/radiation mode toggle), `PhaseChange` (heating curve with melting/boiling plateaus).
  Lesson 8 reuses `ThermalJiggle` + `GasPistonLab`. Deep-dive capstone = **Kinetic Theory of
  Gases** (lesson 8).
- [ ] **QA pass on Electricity & Circuits (8 new lessons).** Built this session, also unrun. Flag
  anything off, especially the **4 brand-new untested visuals**: `ChargeLab` (attract/repel +
  Coulomb 1/d² slider), `CurrentFlow` (drifting charges, amps slider), `CircuitLab` (battery/bulb/
  resistor loop, V & R sliders → I = V/R, bulb brightness; **reused across lessons 3,4,5,7** — the
  power lesson passes `showPower`), `SeriesParallel` (series/parallel toggle + remove-a-bulb). Deep-
  dive capstone = **How a Circuit Really Works** (lesson 8, reuses `CircuitLab` + `CurrentFlow`).
- [ ] **QA pass on Magnetism & Electromagnetism (8 new lessons).** Built this session, also unrun
  (needs the Convex login). Flag anything off, especially the **8 brand-new untested visuals**:
  `MagnetField` (field-line compass-needle grid from a monopole-sum, attract/repel toggle —
  static), `WireField` (current end-on ⊙/⊗ + orbiting field markers, right-hand rule, amps slider),
  `Solenoid` (electromagnet, current/iron-core/reverse toggles — static), `MotorEffect` (wire
  slides under F=BIL, reverse-current/reverse-field toggles), `Induction` (magnet oscillates in/out
  of coil → galvanometer needle, speed slider), `Generator` (rotating loop → AC sine trace, speed
  slider), `Transformer` (turns-ratio slider → output V, circulating-flux rAF), `EMWave` (E⊥B
  propagating wave, wavelength slider). Lesson 8 also reuses `SpectrumBar`. Deep-dive capstone =
  **Maxwell's Unification & EM Waves** (lesson 8).
- [ ] **QA pass on the final FIVE categories — never run in-browser** (Atoms/Quantum, Relativity,
  Astronomy were built earlier but still un-QA'd; **Scientific Working & Frontiers were built this
  session**, completing all 12 categories). This session added:
  - **Scientific Working & Measurement (7 lessons, order 1 — the new foundational opener):**
    What Is Physics?, Measuring the World, Powers of Ten, Units/Prefixes & Conversion, Precision &
    Uncertainty, Graphs & Relationships, + deep-dive From Data to Laws. New visuals:
    `ScientificMethod` (cycling 5-stage wheel), `UnitExplorer` (7 SI base units), `PrefixLadder`
    (prefix log ladder), `AccuracyPrecision` (dartboard, 4 modes), `ProportionGraph` (drag the
    slope to fit y=kx). Reuses `CosmicScale`.
  - **Frontiers & Special Topics (7 lessons, order 12 — the advanced capstone):** The Crystalline
    World, Semiconductors, Superconductivity, Inside the Earth, Chaos & the Butterfly Effect, The
    Standard Model, + deep-dive The Edge of the Known. New visuals: `CrystalLattice`, `BandGap`,
    `Meissner` (Tc levitation), `EarthInterior` (P/S seismic waves + S-wave shadow zone),
    `DoublePendulum` (real RK4 chaos sim), `StandardModel` (particle chart). Deep-dive reuses
    `StandardModel` + `HubbleExpansion` + `SpacetimeWell`.
  - **Look closest at `DoublePendulum` and `EarthInterior`** — the most complex new visuals
    (an ODE integrator and analytic ray/circle intersections respectively). All self-contained
    SVG/rAF, so worst case is a visual glitch, not a crash. typecheck + `npm run build` clean.

---

## ✅ Done so far (this phase)

- 🎉 **ALL 12 PHYSICS CATEGORIES COMPLETE** (~98 lessons authored, published & build-clean).
  Built earlier: Forces & Motion, Energy & Work, Oscillations & Waves, Light & Optics, Matter,
  Electricity, Magnetism, Atoms/Quantum, Relativity, Astronomy. **Built this session (the last
  two): Scientific Working & Measurement (order 1) + Frontiers & Special Topics (order 12).**
  Physics Phase-1 *content* is done — what remains is the in-browser QA pass + UX polish.
- Curriculum architecture: **12 domain categories** (units), each with its own table of
  contents; subject page = category grid → per-category TOC route.
- Schema: optional `lessons.level` / `lessons.format`; `units` card fields
  (`description`/`icon`/`accentColor`/`levelRange`). Data-driven `seed.ts` + `seed:reset`.
- Catalog queries: `getSubjectOverview`, `getCategoryPath`.
- **Forces & Motion: all 14 lessons authored & published**, each with an interactive/animated
  visual. Pendulum re-homed to Oscillations & Waves.
- **Energy & Work: all 8 lessons authored & published** (`unitSlug: 'energy'`, orders 1–8):
  What Is Energy?, Kinetic & Potential Energy, Conservation of Energy, Work = Force × Distance,
  Power, Energy Transfer & Efficiency, Heat & Temperature, and the deep-dive **Entropy & the
  Second Law**. (typechecks + production build clean, not yet run in-browser.)
- **Oscillations & Waves: all 7 lessons authored & published** (`unitSlug: 'oscillations'`,
  orders 1–7): the existing pendulum, Frequency & Period, Waves & Wavelength, Wave Speed (v=fλ),
  Sound, Reflection & Refraction, and the deep-dive **Interference & Standing Waves**.
  (typechecks + production build clean, not yet run in-browser.)
- **Light & Optics: all 7 lessons authored & published** (`unitSlug: 'light-and-optics'`,
  orders 1–7): What Is Light?, Reflection & Mirrors, Refraction — Bending Light, Lenses & Images,
  Color & Dispersion, The Electromagnetic Spectrum, and the deep-dive **Wave Optics: Diffraction
  & Interference**. (typechecks + production build clean, not yet run in-browser.)
- **Matter, Pressure & Heat: all 8 lessons authored & published** (`unitSlug: 'matter'`,
  orders 1–8): States of Matter, Density, Pressure, Pressure in Fluids, The Gas Laws, Heat
  Transfer, Changes of State & Latent Heat, and the deep-dive **Kinetic Theory of Gases**.
  (typechecks + production build clean, not yet run in-browser.)
- **Electricity & Circuits: all 8 lessons authored & published** (`unitSlug: 'electricity'`,
  orders 1–8): Static Electricity, Electric Current, Voltage, Resistance, Ohm's Law, Series &
  Parallel Circuits, Electrical Power & Energy, and the deep-dive **How a Circuit Really Works**.
  (typechecks + production build clean, not yet run in-browser.)
- **Magnetism & Electromagnetism: all 8 lessons authored & published** (`unitSlug: 'magnetism'`,
  orders 1–8): Magnets & Magnetic Fields, Electric Currents Make Magnetism, Electromagnets, The
  Motor Effect, Electromagnetic Induction, Generators, Transformers & the Grid, and the deep-dive
  **Maxwell's Unification & EM Waves**. (typechecks + production build clean, not yet run in-browser.)
- Reusable visual library in `src/components/mdx/`: `DistanceTrack`, `SpeedCompare`,
  `KinematicsLab`, `ForceDiagram`, `ActionReaction`, `FreeFall`, `Collision`,
  `CircularMotion`, `OrbitLab`, `EnergySkater`, `WorkLab`, `PowerRace`, `ThermalJiggle`,
  `EntropyBox`, `WaveLab`, `WaveType`, `PulseReflect`, `Refraction`, `Superposition`,
  `StandingWave`, `ShadowCast`, `MirrorReflect`, `LensRays`, `PrismDispersion`, `SpectrumBar`,
  `DoubleSlit`, `StatesOfMatter`, `BuoyancyTank`, `PressureLab`, `FluidPressure`,
  `GasPistonLab`, `HeatTransfer`, `PhaseChange`, `ChargeLab`, `CurrentFlow`, `CircuitLab`,
  `SeriesParallel`, **`MagnetField`, `WireField`, `Solenoid`, `MotorEffect`, `Induction`,
  `Generator`, `Transformer`, `EMWave`** (+ 3D scenes `pendulum`/`force-block`/`projectile`).
  Reuse-heavy: `EnergySkater` (`friction` prop) spans 3 energy lessons; `WaveLab` spans 3 wave
  lessons; `Refraction` + `Superposition` carry over from waves into optics; `ThermalJiggle`
  carries into the kinetic-theory capstone; `CircuitLab` spans 4 electricity lessons
  (`showPower` prop); **`SpectrumBar` carries from optics into the Maxwell capstone**.

---

## 🎯 Next up (proposed, in priority order)

### 1. ✅ DONE — Build the second category: **Energy & Work** (`energy`)
All 8 lessons authored, published, and registered (see "Done so far"). Built `EnergySkater`,
`WorkLab`, `PowerRace`, `ThermalJiggle`, `EntropyBox`. **Still needs the QA pass** (top of file)
— it has never been run in the browser.

### 2. ✅ DONE — Finish **Oscillations & Waves** (`oscillations`)
All 7 lessons authored, published, and registered (see "Done so far"). Built `WaveLab`,
`WaveType`, `PulseReflect`, `Refraction`, `Superposition`, `StandingWave`. **Still needs the QA
pass** (top of file) — never run in the browser.

### 3. ✅ DONE — All 12 categories built
Every physics category now has a full set of authored, published lessons (see "Done so far").
The big remaining work is the **in-browser QA pass** (top of file) — nothing has been run with a
live Convex backend yet — then UX/polish below. After that, the natural next move is a **second
subject** (Chemistry is `order: 2`, `isPublished: false` in `seed.ts`) using the same
MDX + visual-component workflow, or deepening Physics (media, more deep-dives, badges per unit).

### 4. UX / polish — 🎨 JOURNEY UX is the agreed next big direction
**Decided 2026-05-30:** after the in-browser QA pass, build the gamified "journey" UX
*on Physics* (deepen the flagship before adding more subjects). Full design spec —
3 layers (Progress Chrome → Category Trail → Overworld Map), build order, and the
"zero required backend changes" analysis — is in **`journey-ux-design.md`**. The
items below are subsumed by / feed into that work:
- [ ] **Exit-to-category**: leaving a lesson currently returns to the category *grid*, not
  the specific category TOC. Thread the unit slug through `/learn/$` (search param) and use it
  in `learn.$.tsx` `exit()`.
- [ ] **"Next lesson" button** on the lesson-complete screen.
- [ ] Surface overall subject progress / streak on the home or subject page.

### 5. Media
- [ ] Replace placeholder SVGs with richer art where wanted; drop a real
  `public/lessons/physics/projectile-motion/throw.mp4` (currently shows a poster placeholder).

---

## 🔑 Key conventions / pointers (so resume is fast)

- **Lessons** = MDX in `src/content/lessons/physics/<slug>.mdx` (keep flat — matched by
  `contentSlug` suffix in `src/lib/lessonModules.ts`). Frontmatter: `title, subject,
  contentSlug, order, estimatedMinutes, level, format`.
- **Two templates**: `core` (5–8 steps, one visual/step) and `deepdive` (8–12 steps, longer).
- **Catalog metadata** lives in `convex/seed.ts` — every lesson needs a row; `isPublished:
  true` to make it playable (false → greyed "coming soon" in the TOC).
- **Math is component-only**: `<Formula tex="…" block />`. No inline `$…$` / `\( … \)`.
- **Visuals**: 2D/interactive → `src/components/mdx/` + register in `MdxComponents.tsx`.
  3D → `src/components/three/` + register key in `src/components/mdx/Scene3D.tsx`. Wrap
  WebGL in `<ClientOnly>`. Animate via rAF + ref mutation (see existing components).
- **Re-seeding** after editing `seed.ts`: `npx convex run seed:reset` then `npm run seed`.
  Adding new Convex functions or schema fields requires `npm run convex` (dev) running to
  push + regenerate `convex/_generated/` — otherwise the frontend can't resolve `api.*`.
- Plan doc: `~/.claude/plans/so-we-started-with-vivid-bee.md`. Project memory captures the
  decisions (audience = both, foundations-first; the 12-category map).
