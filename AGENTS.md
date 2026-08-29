# AGENTS.md

Guidance for opencode (and other AI agents) working in this portfolio codebase.

## Project overview

Next.js 14 (App Router) + TypeScript scrollytelling portfolio for Krishna.
Dark theme (`#0d0d0d`) with a lime accent (`#e8ff3e`). Animations via
**Framer Motion**; smooth scrolling via **Lenis** (`src/components/SmoothScroll.tsx`).

## Commands

```bash
npm run dev        # dev server
npm run build      # production build
npm run lint       # eslint (run before finishing any task)
npx tsc --noEmit   # typecheck
```

Always run both `npx tsc --noEmit` and `npx next lint` after touching `.ts/.tsx`
code. Don't fix with `--fix` silently; confirm rules match repo style.

## Key conventions

- Components are client components: start file with `"use client";` if it uses
  hooks/state/effects (most do).
- Tailwind utility classes; CSS variables in `src/app/globals.css`
  (`--bg`, `--accent`, `--text`, ...). Use `font-display` / `font-mono` /
  `font-body` for the custom Google Fonts (declared in `src/app/layout.tsx`).
- Color idioms: `bg-[#0d0d0d]`, accent `text-[#e8ff3e]` / `bg-[#e8ff3e]`,
  muted text `text-white/40`, borders `border-white/10`.
- `@/` path alias maps to `src/`.

## Page composition (`src/app/page.tsx`)

`Navbar` → `ScrollyCanvas` (hero) → `Projects` → `Contact` → `Footer`, wrapped in
`CustomCursor` and (in the layout) `SmoothScroll`.

## Hero video (ScrollyCanvas.tsx)

- Dual-clip, rate-based scroll scrub. Two all-keyframe videos:
  - `public/hero-fwd-key.mp4` — forward clip
  - `public/hero-reverse.mp4` — reversed copy (in `hero-fwd-key.mp4` timeline)
- Forward scroll plays the fwd clip; backward plays the reverse clip forward.
  Both are `keyint=1` (every frame a keyframe) so seeks are cheap and the
  standby clip is kept parked at its mirror position for instant crossfades.
- Tuning knobs are at the top of the file (`MAX_RATE`, `CORRECTION_GAIN`,
  `SWITCH_HYSTERESIS`, etc.).
- `Overlay.tsx` renders the text beats wired to a **spring-smoothed** progress.

### Regenerating the clips (requires ffmpeg)

```bash
# from a normal GOP source (e.g. original hero.mp4):
ffmpeg -i hero.mp4 -c:v libx264 -x264-params keyint=1:min-keyint=1:scenecut=0 -crf 20 -an -pix_fmt yuv420p hero-fwd-key.mp4
ffmpeg -i hero.mp4 -vf reverse -c:v libx264 -x264-params keyint=1:min-keyint=1:scenecut=0 -crf 20 -an -pix_fmt yuv420p hero-reverse.mp4
```

## Projects (Projects.tsx)

- Data is fetched live from GitHub (`src/lib/github.ts`, username in
  `src/lib/site.ts`) and merged with curated metadata in `Projects.tsx`.
- Rendered as a responsive card grid (no full-bleed galleries; the earlier
  tilted reel and dome gallery views were removed at the user's request).

## Navbar (Navbar.tsx)

Floating top nav. Transparent over the 500vh hero; gains a blurred dark
background + elevation once `window.scrollY > innerHeight * 5`. Includes a
mobile full-screen menu. If replacing with a React Bits Pro block, it requires
a license key + `@reactbits-pro` registry configured (not currently set up).

## Public assets

- `public/hero-fwd-key.mp4`, `public/hero-reverse.mp4` — hero scrub clips.
- `public/sequence/*.png` — legacy frame export (no longer used by the hero;
  kept for reference). The video in `ScrollyCanvas.tsx` superseded these.

## Gotchas

- This repo has no `components.json` and no React Bits Pro license — don't
  attempt `npx shadcn add @reactbits-pro/*`; it will fail without the key.
- Respect the grain overlay and custom cursor (`cursor: none` on desktop) —
  global CSS handles them; don't remove.
