# Scrollytelling Portfolio — Setup & Architecture

A high-end scrollytelling portfolio with Canvas image-sequence animation,
parallax text overlays, glassmorphism project cards, and a custom cursor.

---

## Stack

| Layer      | Tech                                            |
|------------|-------------------------------------------------|
| Framework  | Next.js 14 (App Router)                         |
| Language   | TypeScript                                      |
| Styling    | Tailwind CSS + CSS custom properties            |
| Animation  | Framer Motion                                   |
| Rendering  | HTML5 Canvas (image sequence, DPR-aware)        |
| Fonts      | Syne (display) · DM Sans (body) · DM Mono      |

---

## Quick Start

```bash
# 1. Install dependencies
npm install framer-motion

# 2. Place your WebP frames in /public/sequence/
#    Names must match: frame_00_delay-0.067s.webp ... frame_89_delay-0.067s.webp

# 3. Run dev server
npm run dev
```

---

## Directory Structure

```
├── app/
│   ├── globals.css        # Global reset, CSS vars, grain overlay
│   ├── layout.tsx         # Root layout, Google Fonts
│   └── page.tsx           # Page composition
│
├── components/
│   ├── ScrollyCanvas.tsx  # ★ Core: 500vh container + sticky canvas
│   ├── Overlay.tsx        # Parallax text sections (3 scroll beats)
│   ├── Projects.tsx       # Glassmorphism project cards
│   ├── Navbar.tsx         # Floating nav, mobile menu
│   ├── CustomCursor.tsx   # Magnetic dot + trailing ring cursor
│   └── Footer.tsx         # Big-type CTA + social links
│
├── public/
│   └── sequence/          # ← DROP YOUR WEBP FRAMES HERE
│       ├── frame_00_delay-0.067s.webp
│       ├── frame_01_delay-0.067s.webp
│       └── ...
│
├── next.config.js         # Image cache headers
└── tailwind.config.ts     # Custom fonts, colors, animations
```

---

## Frame Naming Convention

If your files are named differently, edit `getFramePath` in `ScrollyCanvas.tsx`:

```ts
// Default — matches your export from any GIF-to-WebP converter
const getFramePath = (index: number) =>
  `/sequence/frame_${String(index).padStart(2, "0")}_delay-0.067s.webp`;

// Example: if your files are frame-001.webp, frame-002.webp ...
const getFramePath = (index: number) =>
  `/sequence/frame-${String(index + 1).padStart(3, "0")}.webp`;
```

Also update `TOTAL_FRAMES` (default: 90) to match your actual frame count.

---

## Canvas Rendering Details

- **DPR-aware**: Physical canvas pixels = `window.innerWidth * devicePixelRatio`.
  CSS `width: 100%` + `height: 100%` handles the display scaling.
- **Object-fit: cover**: Computed manually — scales to fill the viewport while
  preserving aspect ratio, centered.
- **rAF debounce**: Scroll events are debounced to `requestAnimationFrame`
  so the GPU never gets more work than it can handle.
- **Preloading**: All frames load in the background. The UI unlocks once
  20 % of frames are cached (configurable). A progress bar fills as images arrive.

---

## Scroll Beats (Overlay)

| Beat | Scroll %  | Copy                          | Layout |
|------|-----------|-------------------------------|--------|
| 1    |  0 – 30 % | "Your Name. Creative Dev."    | Center |
| 2    | 30 – 62 % | "I build digital experiences."| Left   |
| 3    | 62 – 94 % | "Bridging design & engineering"| Right |

Adjust `opacityRange` and `yScrollRange` inside `Overlay.tsx` to retune timing.

---

## Customisation Checklist

- [ ] Replace `YN.` logo text in `Navbar.tsx` and `Footer.tsx`
- [ ] Update project data in `Projects.tsx → PROJECTS[]`
- [ ] Set `TOTAL_FRAMES` in `ScrollyCanvas.tsx` to your actual count
- [ ] Update `getFramePath()` if your naming convention differs
- [ ] Swap the background `#0d0d0d` to match your video frame background exactly
- [ ] Update `mailto:` link in `Footer.tsx` and `Navbar.tsx`

---

## Performance Tips

- Convert frames with `cwebp -q 75 frame_*.png -o frame_*.webp` for best size/quality.
- Keep frames ≤ 1920 × 1080 — they're upscaled by the cover logic anyway.
- Host under a CDN (Vercel, Cloudflare) so the immutable Cache-Control headers
  in `next.config.js` eliminate repeat downloads after first load.

---

## License

MIT — use freely for personal and commercial projects.
