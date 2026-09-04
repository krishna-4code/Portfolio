"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const trailX = useMotionValue(-100);
  const trailY = useMotionValue(-100);
  const cursorOpacity = useMotionValue(0);

  const isHoveringRef = useRef(false);
  const hasMovedRef = useRef(false);
  const hoverScale = useMotionValue(1);

  // Core dot tracks mouse coordinates directly with 0ms lag and 0 overshoot.
  // Trail ring follows closely with high stiffness and balanced damping to eliminate overshoot.
  const ringX = useSpring(trailX, { stiffness: 750, damping: 24, mass: 0.1 });
  const ringY = useSpring(trailY, { stiffness: 750, damping: 24, mass: 0.1 });
  const ringScale = useSpring(hoverScale, { stiffness: 400, damping: 30 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorOpacity.set(1);
      mouseX.set(e.clientX - 4);
      mouseY.set(e.clientY - 4);
      trailX.set(e.clientX - 20);
      trailY.set(e.clientY - 20);

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        ringX.jump(e.clientX - 20);
        ringY.jump(e.clientY - 20);
      }
    };

    const onEnterLink = () => {
      isHoveringRef.current = true;
      hoverScale.set(2.2);
    };

    const onLeaveLink = () => {
      isHoveringRef.current = false;
      hoverScale.set(1);
    };

    const onLeaveWindow = () => {
      cursorOpacity.set(0);
    };

    const onEnterWindow = () => {
      cursorOpacity.set(1);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    document.documentElement.addEventListener("mouseenter", onEnterWindow);

    // Attach to all interactive elements
    const interactives = document.querySelectorAll("a, button, [data-cursor]");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    // MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(() => {
      const els = document.querySelectorAll("a:not([data-cursor-bound]), button:not([data-cursor-bound])");
      els.forEach((el) => {
        el.addEventListener("mouseenter", onEnterLink);
        el.addEventListener("mouseleave", onLeaveLink);
        el.setAttribute("data-cursor-bound", "true");
      });
    });

    observer.observe(document.body, { subtree: true, childList: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      document.documentElement.removeEventListener("mouseenter", onEnterWindow);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeaveLink);
      });
      observer.disconnect();
    };
  }, [mouseX, mouseY, trailX, trailY, ringX, ringY, hoverScale, cursorOpacity]);

  return (
    // Hidden on touch devices
    <div className="hidden lg:block" aria-hidden="true">
      {/* Trailing ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          scale: ringScale,
          opacity: cursorOpacity,
          border: "1px solid rgba(232, 255, 62, 0.35)",
          mixBlendMode: "difference",
        }}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999]"
      />

      {/* Core dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          opacity: cursorOpacity,
          background: "#e8ff3e",
          mixBlendMode: "difference",
        }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999]"
      />
    </div>
  );
}
