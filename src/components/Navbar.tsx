"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const NAV_LINKS = ["Work", "About", "Process", "Contact"] as const;

// The hero scroll-video section is 500vh tall. Keep the navbar transparent
// while that animation is on screen, and only add the solid/blurred background
// once the user scrolls past it into the content below.
const HERO_SCROLL_HEIGHT_VH = 5;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Listen to scroll for bg change — activate after the hero section is passed
  useEffect(() => {
    const onScroll = () =>
      setScrolled(window.scrollY > window.innerHeight * HERO_SCROLL_HEIGHT_VH);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          background: scrolled ? "rgba(13,13,13,0.85)" : "transparent",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
          transition: "all 0.45s cubic-bezier(0.25, 0.1, 0, 1)",
        }}
      >
        <nav
          // Shrink to 85% of the base height once the bar's background appears.
          className={`max-w-7xl mx-auto px-6 md:px-14 flex items-center justify-between transition-all duration-500 ${
            scrolled ? "h-[3.4rem] md:h-[4.25rem]" : "h-16 md:h-20"
          }`}
        >
          {/* Logo */}
          <a
            href="/"
            className="font-display font-bold text-xl text-white tracking-tight select-none group"
          >
            Krishna
            <span
              className="text-[#e8ff3e] group-hover:text-white transition-colors duration-300"
            >
              .
            </span>
          </a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  className="font-mono text-xs tracking-[0.2em] uppercase text-white/40
                             hover:text-white transition-colors duration-200 relative group"
                >
                  {link}
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-px bg-[#e8ff3e]
                               group-hover:w-full transition-all duration-300"
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* CTA button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="mailto:hello@krishna.dev"
              className="relative px-5 py-2 font-mono text-xs tracking-wider rounded-full overflow-hidden group"
              style={{
                background: "rgba(232,255,62,0.1)",
                border: "1px solid rgba(232,255,62,0.3)",
                color: "#e8ff3e",
              }}
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-[#0d0d0d]">
                Let&apos;s talk →
              </span>
              <span
                className="absolute inset-0 bg-[#e8ff3e] scale-x-0 group-hover:scale-x-100
                           transition-transform duration-300 origin-left rounded-full"
              />
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
              className="block w-6 h-px bg-white origin-center"
              transition={{ duration: 0.3 }}
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
              className="block w-4 h-px bg-white/50"
              transition={{ duration: 0.2 }}
            />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
              className="block w-6 h-px bg-white origin-center"
              transition={{ duration: 0.3 }}
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 95% 2.5%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 95% 2.5%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 95% 2.5%)" }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
            className="fixed inset-0 z-40 md:hidden"
            style={{
              background: "rgba(13,13,13,0.97)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-10">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}
                  onClick={() => setMenuOpen(false)}
                  className="font-display font-bold text-4xl text-white/60 hover:text-[#e8ff3e] transition-colors"
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
