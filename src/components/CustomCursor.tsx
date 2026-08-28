"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const trailX = useMotionValue(-100);
  const trailY = useMotionValue(-100);

  const isHoveringRef = useRef(false);
  const hoverScale = useMotionValue(1);

  // Main dot — snappy
  const dotX = useSpring(mouseX, { stiffness: 800, damping: 50, mass: 0.3 });
  const dotY = useSpring(mouseY, { stiffness: 800, damping: 50, mass: 0.3 });

  // Trail ring — lagged
  const ringX = useSpring(trailX, { stiffness: 180, damping: 22, mass: 0.6 });
  const ringY = useSpring(trailY, { stiffness: 180, damping: 22, mass: 0.6 });
  const ringScale = useSpring(hoverScale, { stiffness: 300, damping: 28 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 4);
      mouseY.set(e.clientY - 4);
      trailX.set(e.clientX - 20);
      trailY.set(e.clientY - 20);
    };

    const onEnterLink = () => {
      isHoveringRef.current = true;
      hoverScale.set(2.2);
    };

    const onLeaveLink = () => {
      isHoveringRef.current = false;
      hoverScale.set(1);
    };

    window.addEventListener("mousemove", onMove, { passive: true });

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
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeaveLink);
      });
      observer.disconnect();
    };
  }, [mouseX, mouseY, trailX, trailY, hoverScale]);

  return (
    // Hidden on touch devices
    <div className="hidden lg:block" aria-hidden="true">
      {/* Trailing ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          scale: ringScale,
          border: "1px solid rgba(232, 255, 62, 0.35)",
          mixBlendMode: "difference",
        }}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999]"
      />

      {/* Core dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          background: "#e8ff3e",
          mixBlendMode: "difference",
        }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999]"
      />
    </div>
  );
}
