"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SOCIAL_LINKS, SITE } from "@/lib/site";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <footer
      ref={ref}
      className="relative bg-[#0d0d0d]/75 overflow-hidden"
    >
      {/* Top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)",
        }}
      />

      {/* Background number */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center overflow-hidden select-none pointer-events-none"
      >
        <span
          className="font-display font-bold text-[30vw] leading-none text-white"
          style={{ opacity: 0.02 }}
        >
          HI
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-14 pt-24 pb-10">
        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1] }}
          className="flex items-center gap-3 mb-10"
        >
          <span
            className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"
            style={{ boxShadow: "0 0 8px #4ade80" }}
          />
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#4ade80]">
            Available for projects in 2025
          </span>
        </motion.div>

        {/* Big headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 0.1, 0, 1] }}
          className="mb-16"
        >
          <h2 className="font-display font-bold leading-none tracking-tight text-white/80
                         text-[clamp(3.5rem,9vw,9rem)]">
            Let&apos;s build
          </h2>
          <h2 className="font-display font-bold leading-none tracking-tight
                         text-[clamp(3.5rem,9vw,9rem)]"
            style={{
              WebkitTextStroke: "1px rgba(232,255,62,0.5)",
              color: "transparent",
            }}
          >
            something great.
          </h2>
        </motion.div>

        {/* CTA */}
        <motion.a
          href={`mailto:${SITE.email}`}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0, 1] }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-4 mb-20 group"
        >
          <span
            className="font-display font-bold text-2xl md:text-3xl text-white/50
                       group-hover:text-[#e8ff3e] transition-colors duration-300"
          >
{SITE.email}
          </span>
          <motion.span
            animate={{ x: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="text-[#e8ff3e] text-2xl"
          >
            →
          </motion.span>
        </motion.a>

        {/* Bottom row */}
        <div
          className="pt-8 flex flex-col md:flex-row items-start md:items-center
                     justify-between gap-6 border-t border-white/5"
        >
          {/* Logo */}
          <span className="font-display font-bold text-white/20 text-lg tracking-tight">
            Krishna<span className="text-[#e8ff3e]/30">.</span>
          </span>

          {/* Copyright */}
          <span className="font-mono text-xs text-white/15 order-last md:order-none">
            © {new Date().getFullYear()} Krishna. Crafted with intention.
          </span>

          {/* Social links */}
          <div className="flex gap-6">
            {SOCIAL_LINKS.map(({ label, href, external }) => (
              <a
                key={label}
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="font-mono text-xs text-white/25 hover:text-white/70
                           transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
