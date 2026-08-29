"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { fetchGitHubRepos, GitHubRepo } from "@/lib/github";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Project {
  id: number;
  name: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  year: string;
  glowColor: string;
  accentColor: string;
  featured?: boolean;
  link?: string;
}

// Curated metadata keyed by GitHub repo name. When a repo fetched from GitHub
// matches one of these keys we use this richer presentation (description,
// tags, accent colors); otherwise we fall back to the raw repo data.
const CURATED: Record<string, Omit<Project, "id" | "name">> = {
  "eco-sankalan": {
    title: "EcoSankalan",
    category: "Full-Stack · PWA · AI",
    description:
      "A sustainability platform connecting eco-conscious communities. Gemini AI integration, real-time push via Firebase FCM, OpenStreetMap geo-features, and a Material Design 3 interface.",
    tags: ["React", "Node.js", "MongoDB Atlas", "Gemini AI", "Tailwind"],
    year: "2024",
    glowColor: "#4ade80",
    accentColor: "#4ade80",
    featured: true,
  },
  "spatial-interface": {
    title: "Spatial Interface",
    category: "Interaction Design · WebGL",
    description:
      "An immersive 3D UI experiment pushing the limits of web-based spatial interaction, with custom GLSL shaders and post-processing effects.",
    tags: ["Three.js", "GLSL", "WebGL", "Next.js", "Framer Motion"],
    year: "2024",
    glowColor: "#e8ff3e",
    accentColor: "#e8ff3e",
    featured: true,
  },
  "neural-commerce": {
    title: "Neural Commerce",
    category: "E-Commerce · AI",
    description:
      "AI-powered shopping platform with real-time personalization, predictive search, and TensorFlow.js inference running entirely in the browser.",
    tags: ["Next.js", "TensorFlow.js", "Stripe", "TypeScript"],
    year: "2023",
    glowColor: "#f87171",
    accentColor: "#f87171",
  },
  "campus-event-manager": {
    title: "Campus Event Manager",
    category: "Full-Stack · System Design",
    description:
      "End-to-end event management system with role-based access, real-time notifications, and UML-documented architecture for Student, Visitor, Coordinator entities.",
    tags: ["React", "Express", "PostgreSQL", "Socket.io", "Docker"],
    year: "2024",
    glowColor: "#a78bfa",
    accentColor: "#a78bfa",
  },
};

// Palette assigned to repos without curated metadata (cycled through).
const FALLBACK_COLORS = ["#e8ff3e", "#4ade80", "#f87171", "#a78bfa", "#38bdf8"];

function titleCase(name: string): string {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Build the final project list: merge GitHub data with curated metadata.
function buildProjects(repos: GitHubRepo[]): Project[] {  return repos.map((repo, i) => {
    const curated = CURATED[repo.name];
    const accent = FALLBACK_COLORS[i % FALLBACK_COLORS.length];
    const year = repo.created_at ? repo.created_at.slice(0, 4) : "";
    return {
      id: repo.id,
      name: repo.name,
      title: curated?.title ?? titleCase(repo.name),
      category: curated?.category ?? (repo.language ?? "Open Source"),
      description:
        curated?.description ??
        (repo.description || "An open-source project on GitHub."),
      tags: curated?.tags ?? (repo.language ? [repo.language] : []),
      year: curated?.year ?? year,
      glowColor: curated?.glowColor ?? accent,
      accentColor: curated?.accentColor ?? accent,
      featured: curated?.featured,
      link: repo.html_url,
    };
  });
}

// ─────────────────────────────────────────────
// Single Card
// ─────────────────────────────────────────────
function ProjectCard({ project, index }: { project: Project; index: number }) {

  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 64 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay: (index % 2) * 0.12,
        ease: [0.25, 0.1, 0, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative rounded-2xl p-7 md:p-9 overflow-hidden transition-all duration-500
        ${project.featured ? "md:col-span-1" : ""}`}
      style={{
        background: hovered
          ? "rgba(255,255,255,0.045)"
          : "rgba(255,255,255,0.025)",
        border: hovered
          ? `1px solid rgba(255,255,255,0.12)`
          : "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: hovered
          ? `0 0 0 1px ${project.glowColor}18, 0 8px 60px ${project.glowColor}12, 0 24px 80px rgba(0,0,0,0.4)`
          : "0 4px 24px rgba(0,0,0,0.3)",
        transition:
          "background 0.4s ease, border 0.4s ease, box-shadow 0.5s ease",
      }}
    >
      {/* Ambient glow blob */}
      <motion.div
        aria-hidden="true"
        animate={{
          opacity: hovered ? 0.18 : 0,
          scale: hovered ? 1 : 0.7,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: project.glowColor }}
      />

      {/* Top row */}
      <div className="relative z-10 flex items-start justify-between mb-6 gap-4">
        <div className="flex-1 min-w-0">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-2">
            {project.category}
          </span>
          <h3
            className="font-display font-bold text-2xl md:text-3xl text-white leading-tight tracking-tight
                       transition-colors duration-300"
            style={{ color: hovered ? project.accentColor : "#ffffff" }}
          >
            {project.title}
          </h3>
        </div>
        <span className="font-mono text-xs text-white/15 shrink-0 mt-1">
          {project.year}
        </span>
      </div>

      {/* Description */}
      <p className="relative z-10 text-white/40 text-sm leading-relaxed mb-7 font-body">
        {project.description}
      </p>

      {/* Tags */}
      <div className="relative z-10 flex flex-wrap gap-2 mb-8">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 font-mono text-[10px] tracking-wide rounded-full transition-all duration-300"
            style={{
              background: hovered ? `${project.glowColor}10` : "rgba(255,255,255,0.04)",
              border: hovered
                ? `1px solid ${project.glowColor}30`
                : "1px solid rgba(255,255,255,0.08)",
              color: hovered ? project.accentColor : "rgba(255,255,255,0.35)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 inline-flex items-center gap-2"
      >
        <motion.span
          className="font-mono text-xs tracking-widest uppercase"
          animate={{ color: hovered ? project.accentColor : "rgba(255,255,255,0.25)" }}
          transition={{ duration: 0.3 }}
        >
          View on GitHub
        </motion.span>
        <motion.span
          animate={{ x: hovered ? 6 : 0, opacity: hovered ? 1 : 0.3 }}
          transition={{ duration: 0.3 }}
          style={{ color: project.accentColor }}
          className="text-sm"
        >
          →
        </motion.span>
      </a>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        style={{ background: `linear-gradient(90deg, transparent, ${project.glowColor}60, transparent)`, transformOrigin: "center" }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Section header
// ─────────────────────────────────────────────
function SectionHeader() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
      className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
    >
      <div>
        <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#e8ff3e] block mb-4">
          Selected Work
        </span>
        <h2 className="font-display font-bold leading-none tracking-tight text-white text-[clamp(3.5rem,7vw,6.5rem)]">
          Projects
        </h2>
      </div>
      <p className="text-white/30 text-sm font-body max-w-xs leading-relaxed md:text-right">
        A curated selection of work spanning full-stack development,
        creative interactions, and AI-powered experiences.
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────
export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchGitHubRepos()
      .then((repos) => {
        if (!cancelled) setProjects(buildProjects(repos));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="work"
      className="relative bg-[#0d0d0d] py-28 md:py-40"
    >
      {/* Subtle top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-14 lg:px-20">
        <SectionHeader />

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-white/30 font-mono text-xs tracking-[0.2em] uppercase">
            {error
              ? "Couldn't load projects from GitHub right now."
              : "Loading projects from GitHub…"}
          </p>
        )}
      </div>
    </section>
  );
}
