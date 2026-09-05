"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";

/**
 * Lenis-powered smooth scrolling applied across the whole site.
 * Uses ReactLenis to provide root scroll virtualization and allow
 * child components (like ScrollyCanvas) to hook directly into scroll events.
 */
function AnchorScrollHandler() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: 0 });
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Touch stays native on mobile (no synthetic smoothing) and maps
        // 1:1 with the finger so the scrolly animation scrubs naturally.
        syncTouch: false,
        touchMultiplier: 1,
        wheelMultiplier: 1,
      }}
    >
      <AnchorScrollHandler />
      {children}
    </ReactLenis>
  );
}
