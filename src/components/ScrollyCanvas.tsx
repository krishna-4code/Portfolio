"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useTransform, motion } from "framer-motion";
import Overlay from "./Overlay";

// ─────────────────────────────────────────────
// CONFIG — adjust to taste
// ─────────────────────────────────────────────
// Both clips are encoded with `keyint=1` (every frame a keyframe) so that
// seeking to any exact position is a cheap, independent decode — this keeps
// direction switches smooth and keeps the standby video cheap to pre-sync.
const FORWARD_PATH = "/hero-fwd-key.mp4";   // all-keyframe forward clip
const REVERSE_PATH = "/hero-reverse.mp4";   // pre-reversed, all-keyframe copy
const SCROLL_HEIGHT = "500vh"; // cinematic scroll distance

// Rate-based playback tuning knobs:
const MIN_RATE = 0.1;        // slowest forward playback rate
const MAX_RATE = 4;          // fastest forward catch-up rate
const BASE_RATE = 1;         // "neutral" rate when drift is small
const CORRECTION_GAIN = 2.5; // how aggressively drift gets pulled back
const DRIFT_EPSILON = 0.02;  // seconds — below this, treat as "in sync"
const SWITCH_HYSTERESIS = 0.005; // prevents flicker when diff hovers near 0
const STANDBY_SYNC_EVERY = 3;    // frames between standby re-syncs (throttle)

/**
 * Main component.
 *
 * Dual-clip rate-based scrub model. HTML5 video has no native reverse-decode,
 * so instead of positional `currentTime` stepping (which stutters on every
 * seek), we pre-reverse a copy of the clip and play BOTH directions through
 * the browser's native forward-playback pipeline:
 *   - Scrolling down  → plays the forward clip with `playbackRate` control.
 *   - Scrolling up    → plays the reversed clip forward (backward in the
 *                       original timeline) with the same logic.
 * Both clips are encoded with `keyint=1` (all keyframes) so any exact seek is
 * an independent, cheap decode. The inactive clip is continuously parked at
 * its matching timestamp while paused, so a direction switch is just a short
 * opacity crossfade over two already-aligned, decoded frames — no visible seek
 * stutter. The decorative text overlay keeps the spring-smoothed progress.
 */
export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const forwardRef = useRef<HTMLVideoElement>(null);
  const reverseRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>();
  const modeRef = useRef<"forward" | "backward">("forward");
  const [activeMode, setActiveMode] = useState<"forward" | "backward">("forward");
  const [isReady, setIsReady] = useState(false);
  const [loadPct, setLoadPct] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth / ease the raw scroll value for the DECORATIVE layers (text overlay
  // + vignette) so they glide rather than jump. The video playhead deliberately
  // does NOT use this spring — it tracks raw scroll for lockstep concurrency.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.6,
  });

  // Subtle vignette opacity tied to scroll
  const vignetteOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0.7, 0.3, 0.3, 0.8]);

  // Rate-based native-forward tracking — reused for both clips.
  const trackForward = (video: HTMLVideoElement, targetTime: number) => {
    const diff = targetTime - video.currentTime;
    if (Math.abs(diff) < DRIFT_EPSILON) {
      if (!video.paused) video.pause();
      return;
    }
    if (diff > 0) {
      const rate = Math.min(
        Math.max(BASE_RATE + diff * CORRECTION_GAIN, MIN_RATE),
        MAX_RATE
      );
      video.playbackRate = rate;
      if (video.paused && !video.seeking) {
        video.play().catch(() => {}); // ignore autoplay-policy rejections
      }
    } else {
      // Fell ahead of target (e.g. right after a direction-switch seek) — pause
      // and let the target catch up.
      if (!video.paused) video.pause();
    }
  };

  // ─── Rate-based playhead control ────────────────────────────────────────
  useEffect(() => {
    const fwd = forwardRef.current;
    const rev = reverseRef.current;
    if (!fwd || !rev) return;

    let frameCount = 0;

    const tick = () => {
      const duration = fwd.duration;
      if (!duration || isNaN(duration)) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min(Math.max(scrollYProgress.get(), 0), 1);
      const expectedTime = progress * duration;
      const currentActiveTime =
        modeRef.current === "forward" ? fwd.currentTime : duration - rev.currentTime;
      const diff = expectedTime - currentActiveTime;

      // Direction switch — with hysteresis so tiny scroll jitter doesn't flip constantly
      const wantsMode: "forward" | "backward" =
        diff > SWITCH_HYSTERESIS
          ? "forward"
          : diff < -SWITCH_HYSTERESIS
          ? "backward"
          : modeRef.current;

      if (wantsMode !== modeRef.current) {
        modeRef.current = wantsMode;
        setActiveMode(wantsMode);
        // The standby was continuously pre-synced below, so both clips are
        // already at the matching timestamp — just pause the outgoing one.
        if (wantsMode === "forward") {
          rev.pause();
        } else {
          fwd.pause();
        }
      }

      if (modeRef.current === "forward") {
        trackForward(fwd, expectedTime);
      } else {
        trackForward(rev, duration - expectedTime);
      }

      // ── Keep the INACTIVE (standby) video parked at its mirror position ──
      // Both clips are all-keyframe, so setting currentTime while paused is a
      // cheap independent frame decode. Doing this continuously means a
      // direction switch is just an opacity flip over two already-aligned,
      // decoded frames — no visible seek. Throttled to a few frames apart.
      if (++frameCount % STANDBY_SYNC_EVERY === 0) {
        const standbyTarget =
          modeRef.current === "forward"
            ? duration - expectedTime // rev (reverse timeline)
            : expectedTime;           // fwd
        const standby = modeRef.current === "forward" ? rev : fwd;
        if (standby.paused && !standby.seeking) {
          const clamped = Math.min(Math.max(standbyTarget, 0), duration);
          if (Math.abs(standby.currentTime - clamped) > 1 / 24 / 2) {
            standby.currentTime = clamped;
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollYProgress]);

  // ─── Force the browser to start loading the videos and wire events ──────
  useEffect(() => {
    const fwd = forwardRef.current;
    if (!fwd) return;

    let revealed = false;
    const MIN_LOADER_MS = 900; // ensure the loader is visible for a beat
    const startTime = performance.now();

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      const elapsed = performance.now() - startTime;
      const wait = Math.max(0, MIN_LOADER_MS - elapsed);
      window.setTimeout(() => setIsReady(true), wait);
    };

    // Drive the bar from real buffered progress so it fills meaningfully
    // instead of jumping to 100% the instant metadata loads.
    const onProgress = () => {
      if (revealed) return;
      if (fwd.buffered.length > 0 && fwd.duration) {
        const buffered = fwd.buffered.end(fwd.buffered.length - 1);
        setLoadPct(Math.min(buffered / fwd.duration, 1));
      }
    };

    const onReady = () => {
      // Show the very first frame as soon as it can be decoded.
      if (fwd.duration) fwd.currentTime = 0;
      reveal();
    };

    // Reveal once enough of the clip is buffered (or it can play through).
    const onBufferedEnough = () => {
      if (fwd.buffered.length > 0 && fwd.duration) {
        const buffered = fwd.buffered.end(fwd.buffered.length - 1);
        setLoadPct(Math.min(buffered / fwd.duration, 1));
        if (buffered / fwd.duration >= 0.9 || fwd.readyState >= 3) {
          reveal();
        }
      }
    };

    fwd.addEventListener("loadedmetadata", onReady, { once: true });
    fwd.addEventListener("canplaythrough", onBufferedEnough, { once: true });
    fwd.addEventListener("progress", onProgress, { passive: true });

    // Explicitly start fetching — required for hidden/paused videos on some
    // browsers so `loadedmetadata`/`progress` reliably fire.
    fwd.load();

    // Safety net: never trap the user on the loading screen.
    const fallback = window.setTimeout(reveal, 8000);

    return () => {
      window.clearTimeout(fallback);
      fwd.removeEventListener("loadedmetadata", onReady);
      fwd.removeEventListener("canplaythrough", onBufferedEnough);
      fwd.removeEventListener("progress", onProgress);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Pinned hero layer — stays fixed on screen behind everything ── */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Forward clip — scrub-ready */}
        <video
          ref={forwardRef}
          aria-hidden="true"
          muted
          playsInline
          preload="auto"
          src={FORWARD_PATH}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: activeMode === "forward" ? 1 : 0,
            transition: "opacity 120ms linear",
          }}
        ></video>

        {/* Reverse clip — plays forward to scrub backward */}
        <video
          ref={reverseRef}
          aria-hidden="true"
          muted
          playsInline
          preload="auto"
          src={REVERSE_PATH}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: activeMode === "backward" ? 1 : 0,
            transition: "opacity 120ms linear",
          }}
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
