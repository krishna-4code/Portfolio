"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { SITE } from "@/lib/site";

const FlowingMenu = dynamic(() => import("@/components/FlowingMenu"), {
  ssr: false,
});

const CONTACT_ITEMS = [
  {
    link: `mailto:${SITE.email}`,
    text: "Email",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&h=400&fit=crop&auto=format",
  },
  {
    link: `https://github.com/${SITE.githubUsername}`,
    text: "GitHub",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&h=400&fit=crop&auto=format",
  },
  {
    link: "https://www.linkedin.com/in/krishnachoudharyy/",
    text: "LinkedIn",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&h=400&fit=crop&auto=format",
  },
  {
    link: "/resume",
    text: "Resume",
    image:
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&h=400&fit=crop&auto=format",
  },
];

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="contact"
      className="relative bg-[#0d0d0d]/75 py-28 md:py-40 px-6 md:px-14 lg:px-20"
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
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 md:mb-16"
        >
          <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#e8ff3e] block mb-4">
            Get in touch
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-display font-bold leading-none tracking-tight text-white text-[clamp(3rem,6vw,6rem)]">
              Let&apos;s work
              <span
                className="text-[#e8ff3e]"
                style={{
                  WebkitTextStroke: "1px rgba(232,255,62,0.6)",
                  color: "transparent",
                }}
              >
                {" "}together.
              </span>
            </h2>
            <p className="text-white/40 text-sm font-body max-w-xs leading-relaxed md:text-right">
              Have a project in mind or want to collaborate? Hover below or reach out directly at{" "}
              <a
                href={`mailto:${SITE.email}`}
                className="text-white underline underline-offset-4 decoration-[#e8ff3e]/40 hover:decoration-[#e8ff3e] transition-colors"
              >
                {SITE.email}
              </a>
            </p>
          </div>
        </motion.div>

        {/* Flowing Menu Interactive Component */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[480px] md:h-[540px] rounded-3xl border border-white/10 bg-[#111113]/80 backdrop-blur-xl overflow-hidden shadow-[0_24px_60px_-15px_rgba(0,0,0,0.85)]"
        >
          <FlowingMenu
            items={CONTACT_ITEMS}
            speed={14}
            textColor="#ffffff"
            bgColor="transparent"
            marqueeBgColor="#e8ff3e"
            marqueeTextColor="#0d0d0d"
            borderColor="rgba(255, 255, 255, 0.08)"
          />
        </motion.div>
      </div>
    </section>
  );
}

