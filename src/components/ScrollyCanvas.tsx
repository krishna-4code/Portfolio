"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useMotionValue, useSpring, useTransform, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import Overlay from "./Overlay";
import TechBackground from "./TechBackground";

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const TOTAL_FRAMES = 300;
const SCROLL_HEIGHT_DESKTOP = "500vh";
const SCROLL_HEIGHT_MOBILE = "300vh";
const FRAME_PREFIX = "/newframes/frame_";
const FRAME_EXT = ".webp";
const VIDEO_BG_COLOR = "#08070a";
const MOBILE_BREAKPOINT = 768;

function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function getScrollHeight(): string {
  return isMobile() ? SCROLL_HEIGHT_MOBILE : SCROLL_HEIGHT_DESKTOP;
}

/**
   * Generates the zero-padded file path for a given frame index (0..299).
   * E.g., index 0 -> "/newframes/frame_0001.webp"
   */
function getFramePath(index: number): string {
  const num = String(index + 1).padStart(4, "0");
  return `${FRAME_PREFIX}${num}${FRAME_EXT}`;
}

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES).fill(null)
  );

  const [isReady, setIsReady] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(getScrollHeight);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  // Motion values to synchronize Overlay beats and vignette with Lenis scroll
  const rawProgress = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 90,
    damping: 34,
    mass: 0.65,
  });

  const vignetteOpacity = useTransform(
    smoothProgress,
    [0, 0.1, 0.9, 1],
    [0.7, 0.3, 0.3, 0.8]
  );

  // Target and current progress references for 120Hz RAF render loop
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafRef = useRef<number>();

  /**
   * Helper to retrieve the nearest already-loaded frame if the exact requested
   * frame index hasn't completed loading yet. Guarantees zero blank flashes.
   */
  const getNearestImage = useCallback((index: number): HTMLImageElement | null => {
    const images = imagesRef.current;
    if (images[index]) return images[index];

    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const left = index - offset;
      if (left >= 0 && images[left]) return images[left];
      const right = index + offset;
      if (right < TOTAL_FRAMES && images[right]) return images[right];
    }
    return null;
  }, []);

  /**
   * Renders the current frame onto the canvas.
   * Uses dual-frame sub-frame interpolation (crossfading adjacent frames)
   * to eliminate discrete frame stepping, transforming 24fps video frames
   * into liquid, buttery smooth 60fps/120fps motion.
   */
  const renderFrame = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const exactFrame = progress * (TOTAL_FRAMES - 1);
      const frameA = Math.floor(exactFrame);
      const frameB = Math.min(frameA + 1, TOTAL_FRAMES - 1);
      const blend = exactFrame - frameA;

      const imgA = getNearestImage(frameA);
      if (!imgA) return;

      const cW = canvas.width;
      const cH = canvas.height;

      // Fill canvas backing with video background color to fill left and right leftover sections
      ctx.fillStyle = VIDEO_BG_COLOR;
      ctx.fillRect(0, 0, cW, cH);

      // Scale 720x720 square frame to fill the full viewport height, center horizontally
      const iW = imgA.naturalWidth || 720;
      const iH = imgA.naturalHeight || 720;
      const scale = cH / iH;
      const dW = iW * scale;
      const dH = cH;
      const dX = (cW - dW) * 0.5;
      const dY = 0;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw primary base frame
      ctx.globalAlpha = 1;
      ctx.drawImage(imgA, dX, dY, dW, dH);

      // Sub-frame crossfade blend with next frame
      if (blend > 0.002 && frameB !== frameA) {
        const imgB = getNearestImage(frameB);
        if (imgB && imgB !== imgA) {
          ctx.globalAlpha = blend;
          ctx.drawImage(imgB, dX, dY, dW, dH);
        }
      }
      ctx.globalAlpha = 1;

      // On wider screens (desktop/laptop), feather the left and right frame
      // borders to dissolve seamlessly into VIDEO_BG_COLOR
      if (dX > 0) {
        const featherWidth = Math.min(48, dW * 0.06);

        // Left edge feathering
        const gradLeft = ctx.createLinearGradient(dX, 0, dX + featherWidth, 0);
        gradLeft.addColorStop(0, VIDEO_BG_COLOR);
        gradLeft.addColorStop(1, "rgba(8, 7, 10, 0)");
        ctx.fillStyle = gradLeft;
        ctx.fillRect(dX, 0, featherWidth, dH);

        // Right edge feathering
        const gradRight = ctx.createLinearGradient(
          dX + dW - featherWidth,
          0,
          dX + dW,
          0
        );
        gradRight.addColorStop(0, "rgba(8, 7, 10, 0)");
        gradRight.addColorStop(1, VIDEO_BG_COLOR);
        ctx.fillStyle = gradRight;
        ctx.fillRect(dX + dW - featherWidth, 0, featherWidth, dH);
      }
    },
    [getNearestImage]
  );

  /**
   * Resize canvas backing store to match display size multiplied by devicePixelRatio.
   * Uses lower DPR cap on mobile to reduce GPU memory pressure.
   */
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Mobile: cap at 1.5 DPR, desktop: cap at 2 DPR
    const maxDpr = isMobile() ? 1.5 : 2;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const width = window.innerWidth;
    const height = window.innerHeight;

    const targetWidth = Math.round(width * dpr);
    const targetHeight = Math.round(height * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    renderFrame(currentProgressRef.current);
  }, [renderFrame]);

  // Debounced resize handler
  useEffect(() => {
    handleResize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setScrollHeight(getScrollHeight());
        handleResize();
      }, 150);
    };

    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, [handleResize]);

  // IntersectionObserver: pause RAF when hero spacer scrolls out of view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting || entry.intersectionRatio > 0);
      },
      { threshold: [0, 0.01] }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  /**
   * Lenis integration:
   * useLenis receives the smooth virtualized scroll position on every Lenis tick.
   */
  useLenis((lenis) => {
    const container = containerRef.current;
    if (!container) return;

    const totalScrollable = container.offsetHeight - window.innerHeight;
    if (totalScrollable <= 0) return;

    const scrollY = lenis.scroll;
    const p = Math.min(Math.max(scrollY / totalScrollable, 0), 1);

    targetProgressRef.current = p;
    rawProgress.set(p);
  });

  // Native scroll fallback in case Lenis is warming up or disabled
  useEffect(() => {
    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const totalScrollable = container.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;
      const p = Math.min(Math.max(window.scrollY / totalScrollable, 0), 1);
      targetProgressRef.current = p;
      rawProgress.set(p);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [rawProgress]);

  /**
   * Continuous RAF render loop:
   * Smoothly lerps currentProgress toward targetProgress for uninterrupted
   * buttery frame rendering. Pauses when hero is off-screen to save battery.
   */
  useEffect(() => {
    let lastRenderedProgress = -1;
    let lastFrameTime = -1;
    // Time constant of the exponential smoothing (≈80ms). Frame-rate
    // independent, so the glide feels identical on 60Hz / 120Hz / 144Hz
    // displays and stays liquid even with Lenis inertia.
    const SMOOTHING_TAU_MS = 80;

    const tick = (now: number) => {
      // Skip rendering when hero is scrolled off-screen
      if (!isHeroVisible) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // Normalize smoothing factor against the actual frame delta
      if (lastFrameTime === -1) lastFrameTime = now;
      const dt = Math.min(now - lastFrameTime, 50); // clamp tab-switch gaps
      lastFrameTime = now;
      const alpha = 1 - Math.exp(-dt / SMOOTHING_TAU_MS);

      const target = targetProgressRef.current;
      let curr = currentProgressRef.current;

      // Frame-rate independent micro-lerp for liquid inertia transitions
      const diff = target - curr;
      if (Math.abs(diff) > 0.00002) {
        curr += diff * alpha;
      } else {
        curr = target;
      }
      currentProgressRef.current = curr;

      // Redraw whenever progress shifts
      if (Math.abs(curr - lastRenderedProgress) > 0.00001) {
        renderFrame(curr);
        lastRenderedProgress = curr;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [renderFrame, isHeroVisible]);

  /**
   * Preload and off-thread decode frames with priority scheduling:
   * 1. Frame 0 decodes immediately and renders first paint instantly.
   * 2. Keyframes distributed across the video timeline load next.
   * 3. Remaining frames load concurrently in worker batches.
   *    Mobile uses fewer workers to reduce memory/bandwidth pressure.
   */
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;
    const startTime = performance.now();
    const MIN_LOADER_MS = 800;

    const checkReady = () => {
      if (isCancelled) return;
      const pct = loadedCount / TOTAL_FRAMES;
      setLoadPct(pct);

      // Once all frames (or primary threshold + minimum display time) are ready
      if (loadedCount >= TOTAL_FRAMES || (loadedCount >= 60 && pct >= 0.8)) {
        const elapsed = performance.now() - startTime;
        const remaining = Math.max(0, MIN_LOADER_MS - elapsed);
        window.setTimeout(() => {
          if (!isCancelled) setIsReady(true);
        }, remaining);
      }
    };

    const loadSingleFrame = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFramePath(index);

        const onDecoded = () => {
          if (isCancelled) return;
          imagesRef.current[index] = img;
          loadedCount++;
          if (index === 0 && currentProgressRef.current === 0) {
            renderFrame(0);
          }
          checkReady();
          resolve();
        };

        // Prefer decode() for off-thread GPU bitmap decoding
        img
          .decode()
          .then(onDecoded)
          .catch(() => {
            img.onload = onDecoded;
            img.onerror = () => resolve();
          });
      });
    };

    // Load Frame 0 first
    loadSingleFrame(0).then(() => {
      if (isCancelled) return;

      // Priority Keyframes (every 6th frame across the sequence)
      const keyframes: number[] = [];
      for (let i = 6; i < TOTAL_FRAMES; i += 6) {
        keyframes.push(i);
      }

      // Remaining frames
      const remaining: number[] = [];
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        if (i % 6 !== 0) remaining.push(i);
      }

      const queue = [...keyframes, ...remaining];

      // Mobile: 4 concurrent workers, Desktop: 8
      const CONCURRENCY = isMobile() ? 4 : 8;
      let currentIndex = 0;

      const runWorker = async () => {
        while (currentIndex < queue.length && !isCancelled) {
          const frameIdx = queue[currentIndex++];
          await loadSingleFrame(frameIdx);
        }
      };

      for (let w = 0; w < CONCURRENCY; w++) {
        runWorker();
      }
    });

    // Safety fallback to never trap the user
    const fallbackTimer = window.setTimeout(() => {
      if (!isCancelled) setIsReady(true);
    }, 8000);

    return () => {
      isCancelled = true;
      window.clearTimeout(fallbackTimer);
    };
  }, [renderFrame]);

  return (
    <>
      {/* ── Fixed pinned canvas hero layer ── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#08070a]">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full"
        />

        {/* Radial vignette */}
        <motion.div
          style={{ opacity: vignetteOpacity }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(8,7,10,0.95) 100%)",
            }}
          />
        </motion.div>

        <TechBackground />

        {/* Text beats */}
        <div className="pointer-events-auto">
          <Overlay scrollYProgress={smoothProgress} />
        </div>

        {/* Sleek branded loading screen */}
        {!isReady && (
          <div className="absolute inset-0 z-50 bg-[#08070a] flex flex-col items-center justify-center gap-6 pointer-events-auto">
            {/* Logo mark */}
            <div className="font-display text-3xl font-bold text-white tracking-tight">
              Krishna<span className="text-[#e8ff3e]">.</span>
            </div>

            {/* Progress bar */}
            <div className="relative w-56 h-px bg-white/10 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-[#e8ff3e]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: Math.min(loadPct, 1) }}
                style={{ transformOrigin: "left" }}
                transition={{ ease: "linear", duration: 0.15 }}
              />
            </div>

            {/* Percentage */}
            <span className="font-mono text-xs tracking-[0.3em] text-white/30 uppercase">
              {Math.round(Math.min(loadPct, 1) * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* ── Scroll spacer — drives the Lenis scroll progress ── */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: scrollHeight }}
        aria-hidden="true"
      />
    </>
  );
}
