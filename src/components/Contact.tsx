"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SOCIAL_LINKS, SITE } from "@/lib/site";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="contact"
      className="relative bg-[#0d0d0d] py-28 md:py-40 px-6 md:px-14 lg:px-20"
    >
      {/* Subtle top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
          className="mb-16 md:mb-20"
        >
          <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#e8ff3e] block mb-4">
            Get in touch
          </span>
          <h2 className="font-display font-bold leading-none tracking-tight text-white text-[clamp(3rem,6vw,6rem)]">
            Let&apos;s work
            <span
              className="text-[#e8ff3e]"
              style={{
                WebkitTextStroke: "1px rgba(232,255,62,0.6)",
                color: "transparent",
              }}
            >
              together.
            </span>
          </h2>
        </motion.div>

        {/* Link grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {SOCIAL_LINKS.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.1 + i * 0.08,
                ease: [0.25, 0.1, 0, 1],
              }}
              whileHover={{ y: -4 }}
              className="group relative rounded-2xl p-7 md:p-9 overflow-hidden
                         bg-white/[0.025] border border-white/[0.06]
                         backdrop-blur-xl transition-colors duration-500
                         hover:border-white/12 hover:bg-white/[0.045]"
            >
              {/* Accent corner */}
              <div
                aria-hidden="true"
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#e8ff3e] blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
              />

              <div className="relative z-10 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#e8ff3e]">
                  {link.label}
                </span>
                <motion.span
                  animate={{ x: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="text-white/30 group-hover:text-[#e8ff3e] text-lg"
                >
                  ↗
                </motion.span>
              </div>

              <div className="relative z-10 mt-8">
                <span className="font-display font-bold text-xl md:text-2xl text-white/70 group-hover:text-white transition-colors duration-300 break-all">
                  {link.label === "Email"
                    ? SITE.email
                    : link.href.replace(/^https?:\/\/(www\.)?/, "")}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
