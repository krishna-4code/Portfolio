"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useSpring, useTransform, motion } from "framer-motion";
import Overlay from "./Overlay";

// ─────────────────────────────────────────────
// CONFIG — adjust to taste
// ─────────────────────────────────────────────
const VIDEO_PATH = "/hero.mp4";
const SCROLL_HEIGHT = "500vh"; // cinematic scroll distance

// hero.mp4 is 1280×720 H.264, 240 frames at 24fps (~10s).
const FPS = 24;
const FRAME_COUNT = 240;

/**
 * Main component.
 *
 * Renders hero.mp4 directly as a `<video>` and scrubs its playhead from the
 * beginning to the end in sync with the user's scroll progress (scroll-based
 * animation using frames). This is far more efficient than preloading the
 * ~90MB of PNG stills: the browser decodes the 3.6MB video on the GPU, so we
 * skip canvas drawing and image preloading entirely while keeping the exact
 * same cinematic section.
 */
export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(0);
  const lastFrameRef = useRef(-1);
  const isMountedRef = useRef(true);

  const [isReady, setIsReady] = useState(false);
  const [loadPct, setLoadPct] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth / ease the raw scroll value so the video playhead (and text
  // overlays) glide between frames instead of jumping with every scroll pixel.
  // A spring also gives a subtle trailing effect that feels cinematic and is
  // dramatically smoother than directly mapping raw scroll to video seeks.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.6,
  });

  // Subtle vignette opacity tied to scroll
  const vignetteOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0.7, 0.3, 0.3, 0.8]);

  // ─── Seek the video to the frame matching scroll progress ───────────────
  // We quantize to discrete frame indices (frame / FPS) and only seek when the
  // target frame actually changes. We also drop a seek while the decoder is
  // already seeking — the next rAF will pick up the correct target — so fast
  // scrolls don't overload the decoder. Seeking a video is expensive (the
  // decoder must jump to a keyframe and decode forward), so this removes most
  // of the lag.
  const seekToProgress = useCallback(
    (progress: number) => {
      const video = videoRef.current;
      if (!video || !durationRef.current) return;

      // Skip while the decoder is still busy so it never queues up back-to-back
      // expensive seeks. The next tick re-seeks to the true target from progress.
      if (video.seeking) return;

      const clamped = Math.min(Math.max(progress, 0), 1);
      let frame = Math.round(clamped * (FRAME_COUNT - 1));
      frame = Math.min(Math.max(frame, 0), FRAME_COUNT - 1);

      if (frame === lastFrameRef.current) return;
      lastFrameRef.current = frame;

      const targetTime = Math.min(frame / FPS, durationRef.current);
      if (Math.abs(video.currentTime - targetTime) > 1 / FPS / 2) {
        video.currentTime = targetTime;
      }
    },
    []
  );

  // ─── Force the browser to start loading the video and wire events ───────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let revealed = false;
    const MIN_LOADER_MS = 900; // ensure the loader is visible for a beat
    const startTime = performance.now();

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      const elapsed = performance.now() - startTime;
      const wait = Math.max(0, MIN_LOADER_MS - elapsed);
      window.setTimeout(() => {
        if (isMountedRef.current) setIsReady(true);
      }, wait);
    };

    // Drive the bar from real buffered progress so it fills meaningfully
    // instead of jumping to 100% the instant metadata loads.
    const onProgress = () => {
      if (!isMountedRef.current || revealed) return;
      if (video.buffered.length > 0 && video.duration) {
        const buffered = video.buffered.end(video.buffered.length - 1);
        setLoadPct(Math.min(buffered / video.duration, 1));
      }
    };

    const onReady = () => {
      if (!durationRef.current) durationRef.current = video.duration || 0;
      // Show the very first frame as soon as it can be decoded.
      if (durationRef.current) video.currentTime = 0;
      reveal();
    };

    // Reveal once enough of the clip is buffered (or it can play through).
    const onBufferedEnough = () => {
      if (video.buffered.length > 0 && video.duration) {
        const buffered = video.buffered.end(video.buffered.length - 1);
        setLoadPct(Math.min(buffered / video.duration, 1));
        if (buffered / video.duration >= 0.9 || video.readyState >= 3) {
          reveal();
        }
      }
    };

    video.addEventListener("loadedmetadata", onReady, { once: true });
    video.addEventListener("canplaythrough", onBufferedEnough, { once: true });
    video.addEventListener("progress", onProgress, { passive: true });

    // Explicitly start fetching — required for hidden/paused videos on some
    // browsers so `loadedmetadata`/`progress` reliably fire.
    video.load();

    // Safety net: never trap the user on the loading screen.
    const fallback = window.setTimeout(reveal, 8000);

    return () => {
      window.clearTimeout(fallback);
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("canplaythrough", onBufferedEnough);
      video.removeEventListener("progress", onProgress);
    };
  }, []);

  // ─── Scroll-linked playhead updates ─────────────────────────────────────
  useEffect(() => {
    let rafRef: number | null = null;

    const unsubscribe = smoothProgress.on("change", (progress) => {
      if (rafRef !== null) cancelAnimationFrame(rafRef);
      rafRef = requestAnimationFrame(() => seekToProgress(progress));
    });

    return () => {
      unsubscribe();
      if (rafRef !== null) cancelAnimationFrame(rafRef);
    };
  }, [smoothProgress, seekToProgress]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Pinned hero layer — stays fixed on screen behind everything ── */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Video layer — scroll-scrubbed hero */}
        <video
          ref={videoRef}
          aria-hidden="true"
          muted
          playsInline
          preload="auto"
          src={VIDEO_PATH}
          className="absolute inset-0 w-full h-full object-cover"
        ></video>

        {/* Vignette */}
        <motion.div
          style={{ opacity: vignetteOpacity }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(13,13,13,0.95) 100%)",
            }}
          />
        </motion.div>

        {/* Text overlays */}
        <Overlay scrollYProgress={smoothProgress} />

        {/* Loading screen */}
        {!isReady && (
          <div className="absolute inset-0 z-50 bg-[#0d0d0d] flex flex-col items-center justify-center gap-6">
            {/* Logo mark */}
            <div className="font-display text-3xl font-bold text-white tracking-tight">
              Krishna<span className="text-[#e8ff3e]">.</span>
            </div>

            {/* Progress bar */}
            <div className="relative w-56 h-px bg-white/10 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-[#e8ff3e]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: loadPct }}
                style={{ transformOrigin: "left" }}
                transition={{ ease: "linear" }}
              />
            </div>

            {/* Label */}
            <span className="font-mono text-xs tracking-[0.3em] text-white/30 uppercase">
              {Math.round(loadPct * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* ── Scroll spacer — drives the animation progress ── */}
      <div ref={containerRef} className="relative" style={{ height: SCROLL_HEIGHT }} aria-hidden="true" />
    </>
  );
}
