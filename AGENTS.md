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

## Hero animation (ScrollyCanvas.tsx)

- Lenis-driven HTML5 `<canvas>` scrollytelling using 240 extracted WebP frames of `hero.mp4`:
  - `public/hero-frames/frame_0001.webp` through `frame_0240.webp` (~10MB total).
- High-performance features for maximum smoothness:
  - **Lenis synchronization**: Directly hooks into Lenis's smoothed virtual scroll via `useLenis`.
  - **Off-thread decoding**: Images are decoded off the main thread with `img.decode()` before rendering, preventing frame drops.
  - **Sub-frame crossfade blending**: Temporal interpolation between adjacent frames eliminates discrete frame stepping, giving liquid 60/120fps motion.
  - **Prioritized loading**: Frame 0 decodes first for instant paint, followed by distributed keyframes, then concurrent batch workers.
  - **Nearest-frame fallback**: If a frame is loading during rapid scrubbing, the nearest loaded frame is rendered instantly, preventing blank flashes.
- `Overlay.tsx` renders the text beats wired to a **spring-smoothed** progress.

### Regenerating frames (requires ffmpeg)

```bash
# Extract 240 high-quality WebP frames at 24fps from hero.mp4:
ffmpeg -i public/hero.mp4 -c:v libwebp -quality 80 -preset photo public/hero-frames/frame_%04d.webp -y
```

## Projects (Projects.tsx)

- Data is fetched live from GitHub (`src/lib/github.ts`, username in
  `src/lib/site.ts`) and merged with curated metadata in `Projects.tsx`.
- Rendered as a responsive card grid with glassmorphism styling, ambient glow
  effects, category tags, and direct GitHub links.

## Navbar (Navbar.tsx)

Floating top nav. Transparent over the 500vh hero; gains a blurred dark
background + elevation once `window.scrollY > innerHeight * 5`. Includes a
mobile full-screen menu. If replacing with a React Bits Pro block, it requires
a license key + `@reactbits-pro` registry configured (not currently set up).

## Public assets

- `public/hero-frames/frame_*.webp` — 240 extracted WebP frames used by `ScrollyCanvas.tsx`.
- `public/hero.mp4` — source hero video.
- `public/hero-fwd-key.mp4`, `public/hero-reverse.mp4` — previous scrub clips (kept for reference).
- `public/sequence/*.png` — legacy low-fps PNG export (kept for reference).

## Gotchas

- This repo has no `components.json` and no React Bits Pro license — don't
  attempt `npx shadcn add @reactbits-pro/*`; it will fail without the key.
- Respect the grain overlay and custom cursor (`cursor: none` on desktop) —
  global CSS handles them; don't remove.
