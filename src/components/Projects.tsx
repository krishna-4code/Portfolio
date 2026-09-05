"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Project {
  key: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  year: string;
  accentColor: string;
  link: string;
}

const FEATURED: Project[] = [
  {
    key: "eco-sankalan",
    title: "EcoSankalan",
    category: "Full-Stack · PWA · AI",
    description:
      "A sustainability platform connecting eco-conscious communities. Gemini AI integration, real-time push via Firebase FCM, OpenStreetMap geo-features, and a Material Design 3 interface.",
    tags: ["React", "Node.js", "MongoDB Atlas", "Gemini AI", "Tailwind"],
    year: "2024",
    accentColor: "#4ade80",
    link: "https://github.com/krishna-4code",
  },
  {
    key: "awaraa",
    title: "Awaraa's Culture",
    category: "Creative Frontend · E-Commerce",
    description:
      "A culturally inspired modern web experience featuring fluid motion design, custom typography, and responsive micro-interactions.",
    tags: ["TypeScript", "Next.js", "Tailwind", "Framer Motion"],
    year: "2024",
    accentColor: "#38bdf8",
    link: "https://github.com/krishna-4code/Awaraa-s-Culture",
  },
  {
    key: "jarvis",
    title: "Jarvis AI",
    category: "AI · Voice Automation",
    description:
      "Voice-activated intelligent desktop assistant supporting NLP command execution, system automation, and web intelligence retrieval.",
    tags: ["Python", "Speech Recognition", "Automation", "AI"],
    year: "2024",
    accentColor: "#2dd4bf",
    link: "https://github.com/krishna-4code/Jarvis-AI-Assistant",
  },
];

function FeatureCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 90 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 90 }}
      whileHover={{ y: -8 }}
      transition={{
        duration: 0.85,
        delay: index * 0.16,
        ease: [0.16, 1, 0.3, 1],
        y: {
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      className="group relative flex flex-col rounded-3xl p-8 overflow-hidden
                 bg-[#121216] border border-white/10
                 hover:bg-[#18181d] hover:border-white/25 transition-colors duration-400
                 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_16px_48px_-16px_rgba(0,0,0,0.85)]
                 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_24px_64px_-16px_rgba(0,0,0,0.95)]"
    >
      {/* Specular top edge — solid, premium finish */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px
                   bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      {/* Top index and category header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <span
            className="font-mono text-[11px] px-2.5 py-0.5 rounded-full border bg-[#1b1b21]"
            style={{
              borderColor: `${project.accentColor}40`,
              color: project.accentColor,
            }}
          >
            0{index + 1}
          </span>
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40">
            {project.category}
          </span>
        </div>
        <span className="font-mono text-xs text-white/25 shrink-0 ml-3">{project.year}</span>
      </div>

      {/* Title */}
      <h3
        className="font-display font-bold text-3xl md:text-4xl leading-tight tracking-tight mb-3"
        style={{ color: project.accentColor }}
      >
        {project.title}
      </h3>

      {/* Subtle accent divider */}
      <div
        className="h-px w-full my-4 opacity-25 group-hover:opacity-75 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, ${project.accentColor}, rgba(255,255,255,0.06) 60%, transparent)`,
        }}
      />

      {/* Description */}
      <p className="text-white/55 text-sm leading-relaxed font-body flex-1">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-6">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 font-mono text-[10px] tracking-wide rounded-full
                       border border-white/10 bg-[#1b1b21] text-white/45
                       group-hover:border-white/25 group-hover:text-white/75 transition-colors duration-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between">
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 group/link py-1"
        >
          <span
            className="font-mono text-xs tracking-widest uppercase font-medium"
            style={{ color: project.accentColor }}
          >
            View project
          </span>
          <span
            className="text-sm font-bold transition-transform duration-300 group-hover/link:translate-x-1.5 inline-block"
            style={{ color: project.accentColor }}
          >
            →
          </span>
        </a>
        <div className="flex gap-1.5 items-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                background:
                  i === index
                    ? project.accentColor
                    : "rgba(255,255,255,0.15)",
                transform: i === index ? "scale(1.25)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom accent glow bar */}
      <div
        className="absolute bottom-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${project.accentColor}, transparent)`,
        }}
      />
    </motion.article>
  );
}

export default function Projects() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="work" className="relative bg-black py-28 md:py-40">
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-14 lg:px-20">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-20"
        >
          <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#e8ff3e] block mb-4">
            Selected Work
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-display font-bold leading-none tracking-tight text-white text-[clamp(3rem,6vw,6rem)]">
              Signature
              <span className="text-[#e8ff3e]"> projects.</span>
            </h2>
            <p className="text-white/40 text-sm font-body max-w-xs leading-relaxed md:text-right">
              Three builds where design, engineering, and intelligence meet.
            </p>
          </div>
        </motion.div>

        {/* Three cards grid - clean, flat, smooth swipe from bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {FEATURED.map((project, i) => (
            <FeatureCard key={project.key} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}