"use client";

import { MotionValue, motion, useTransform } from "framer-motion";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface OverlayProps {
  scrollYProgress: MotionValue<number>;
}

interface Section {
  id: number;
  eyebrow: string;
  lines: string[];
  align: "center" | "left" | "right";
  /** scroll progress range: [fadeIn_start, fadeIn_end, fadeOut_start, fadeOut_end] */
  opacityRange: [number, number, number, number];
  /** Y motion range: start Y offset → end Y offset (in px, parallax drift) */
  yRange: [number, number];
  /** scroll range for Y motion */
  yScrollRange: [number, number];
}

// ─────────────────────────────────────────────
// Data — three scroll-triggered sections
// ─────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    id: 1,
    eyebrow: "Hello, world",
    lines: ["Krishna.", "Creative Developer."],
    align: "center",
    opacityRange: [0.0, 0.06, 0.22, 0.30],
    yRange: [60, -20],
    yScrollRange: [0.0, 0.30],
  },
  {
    id: 2,
    eyebrow: "What I do",
    lines: ["I build", "digital experiences."],
    align: "left",
    opacityRange: [0.30, 0.38, 0.53, 0.62],
    yRange: [60, -20],
    yScrollRange: [0.30, 0.62],
  },
  {
    id: 3,
    eyebrow: "The craft",
    lines: ["Bridging design", "and engineering."],
    align: "right",
    opacityRange: [0.62, 0.70, 0.85, 0.94],
    yRange: [60, -20],
    yScrollRange: [0.62, 0.94],
  },
];

// Alignment helper
const alignClasses: Record<Section["align"], string> = {
  center: "items-center text-center px-5 sm:px-8",
  left:   "items-start text-left pl-5 pr-5 sm:pl-10 sm:pr-10 md:pl-20 lg:pl-28",
  right:  "items-end text-right pr-5 pl-5 sm:pr-10 sm:pl-10 md:pr-20 lg:pr-28",
};

// ─────────────────────────────────────────────
// Single section
// ─────────────────────────────────────────────
function TextSection({
  section,
  scrollYProgress,
}: {
  section: Section;
  scrollYProgress: MotionValue<number>;
}) {
  const [s0, s1, s2, s3] = section.opacityRange;
  const [ys, ye] = section.yScrollRange;

  const opacity = useTransform(scrollYProgress, [s0, s1, s2, s3], [0, 1, 1, 0]);
  const y       = useTransform(scrollYProgress, [ys, ye], section.yRange);
  const scale   = useTransform(scrollYProgress, [s0, s1, s2, s3], [0.96, 1, 1, 0.96]);

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute inset-0 flex flex-col justify-center pointer-events-none ${alignClasses[section.align]}`}
    >
      {/* Eyebrow */}
      <motion.span
        className="font-mono text-xs md:text-sm tracking-[0.25em] uppercase text-[#e8ff3e] mb-4 block"
      >
        {section.eyebrow}
      </motion.span>

      {/* Headline lines */}
      <motion.div style={{ scale }} className="flex flex-col gap-0">
        {section.lines.map((line, i) => (
          <h2
            key={i}
            className="font-display font-bold text-white leading-[0.9] tracking-tight
                       text-[clamp(3rem,8vw,7rem)]"
            style={{
              textShadow:
                "0 4px 40px rgba(0,0,0,0.6), 0 0 80px rgba(0,0,0,0.4)",
              // Accent highlight on first line
              ...(i === 0 && section.id === 1
                ? { color: "#ffffff" }
                : {}),
            }}
          >
            {i === section.lines.length - 1 && section.id === 1 ? (
              <>
                <span className="text-white/90">{line.split(" ")[0]} </span>
                <span
                  className="relative inline-block"
                  style={{
                    WebkitTextStroke: "1px rgba(232,255,62,0.6)",
                    color: "transparent",
                  }}
                >
                  {line.split(" ").slice(1).join(" ")}
                </span>
              </>
            ) : (
              line
            )}
          </h2>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Scroll indicator (shown at the very top)
// ─────────────────────────────────────────────
function ScrollIndicator({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [0, 0.04, 0.08], [1, 1, 0]);
  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
    >
      <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/30">
        Scroll
      </span>
      <div className="relative w-px h-10 overflow-hidden">
        <motion.div
          className="absolute inset-x-0 bg-gradient-to-b from-[#e8ff3e] to-transparent"
          animate={{ y: ["0%", "100%"] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          style={{ height: "60%" }}
        />
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Progress strip (right edge)
// ─────────────────────────────────────────────
function ProgressStrip({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <div className="absolute right-6 top-1/4 bottom-1/4 w-px bg-white/10 pointer-events-none hidden md:block">
      <motion.div
        style={{ scaleY, transformOrigin: "top" }}
        className="absolute inset-0 bg-[#e8ff3e]"
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────
export default function Overlay({ scrollYProgress }: OverlayProps) {
  return (
    <div className="absolute inset-0 z-10" aria-live="polite">
      {SECTIONS.map((section) => (
        <TextSection
          key={section.id}
          section={section}
          scrollYProgress={scrollYProgress}
        />
      ))}
      <ScrollIndicator scrollYProgress={scrollYProgress} />
      <ProgressStrip scrollYProgress={scrollYProgress} />
    </div>
  );
}
