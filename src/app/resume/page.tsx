"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import CustomCursor from "@/components/CustomCursor";

const RESUME_PDF = "/Krishna_ResumeT.pdf";

const EDUCATION = [
  {
    degree: "B.Tech in Computer Science and Engineering",
    institution: "Netaji Subhas University of Technology (NSUT), New Delhi",
    period: "2024 – 2028",
    score: "8.1 CGPA",
    badge: "Premier Govt Institute",
    highlight: "Secured admission through JEE Main (99.71 percentile, AIR 4,698)",
  },
  {
    degree: "DBSE Senior Secondary (Class XII)",
    institution: "DBRA School of Specialized Excellence, Dwarka",
    period: "2024",
    score: "97.0%",
    badge: "Top 1%",
    highlight: "Specialized STEM curriculum with physics, chemistry & mathematics",
  },
  {
    degree: "CBSE Secondary Examination (Class X)",
    institution: "GBSSS Mahipalpur, New Delhi",
    period: "2022",
    score: "90.0%",
    badge: "Distinction",
    highlight: "Academic distinction across mathematics and computer science",
  },
];

const ACHIEVEMENTS = [
  {
    title: "JEE Main 2024",
    stat: "99.71 %ile",
    rank: "AIR 4,698",
    detail: "Among 1.4+ Million candidates nationwide",
    color: "#e8ff3e",
  },
  {
    title: "JEE Advanced 2024",
    stat: "Qualified",
    rank: "AIR 12,183",
    detail: "Top tier among national engineering aspirants",
    color: "#38bdf8",
  },
  {
    title: "LeetCode Milestone",
    stat: "253+ Solved",
    rank: "3 Badges",
    detail: "Extensive problem solving in Graphs, Trees, DP & Backtracking",
    color: "#4ade80",
  },
  {
    title: "Smart India Hackathon",
    stat: "SIH Participant",
    rank: "Cross-functional",
    detail: "Collaborated on nationwide real-world civic technology solutions",
    color: "#a78bfa",
  },
];

const SKILL_GROUPS = [
  {
    category: "Languages",
    skills: ["C++", "Python", "TypeScript", "JavaScript", "HTML5", "CSS3 / Modern CSS"],
    accent: "#e8ff3e",
  },
  {
    category: "Backend & Databases",
    skills: ["FastAPI", "Node.js", "Express", "MongoDB", "Motor (Async)", "Pydantic", "PostgreSQL"],
    accent: "#38bdf8",
  },
  {
    category: "Frontend & UI/UX",
    skills: ["React", "Next.js", "Vite", "Tailwind CSS", "Framer Motion", "Figma", "Glassmorphism"],
    accent: "#4ade80",
  },
  {
    category: "Tools & Cloud",
    skills: ["Git", "GitHub", "Firebase (FCM)", "REST APIs", "Docker", "Vercel", "n8n Automation"],
    accent: "#f472b6",
  },
  {
    category: "Core Computer Science",
    skills: ["Data Structures & Algorithms", "Object-Oriented Programming (OOP)", "DBMS", "Operating Systems", "Computer Networks"],
    accent: "#a78bfa",
  },
];

const PROJECTS = [
  {
    title: "EcoSankalan",
    subtitle: "Civic-Tech Waste Management PWA",
    tech: ["React", "Vite", "Node.js", "MongoDB", "Firebase FCM", "Gemini AI"],
    points: [
      "Solo-architected 8+ screens for 3+ waste categories, leading Frontend & UI/UX targeting 10,000+ citizens.",
      "Built 10+ reusable glassmorphic components integrating Firebase FCM push notifications and OpenStreetMap geo-tracking.",
      "Embedded Gemini AI to automate classification and cut manual waste sorting by ~60% with zero downtime offline-first PWA.",
      "Authored complete SRS with 4+ UML diagrams, JWT authentication, and live production deployment on Vercel.",
    ],
    accent: "#4ade80",
    link: "https://github.com/krishna-4code",
  },
  {
    title: "Task Manager API",
    subtitle: "High-Performance RESTful Microservice",
    tech: ["Python", "FastAPI", "MongoDB", "Motor", "Pydantic"],
    points: [
      "Engineered an asynchronous RESTful API with 5 CRUD endpoints utilizing FastAPI and non-blocking Motor driver.",
      "Implemented strict Pydantic validation across 3+ request/response states in a clean 3-layer architecture.",
      "Ensured 100% modular, self-documenting endpoints with automated Swagger / OpenAPI integration.",
    ],
    accent: "#38bdf8",
    link: "https://github.com/krishna-4code",
  },
  {
    title: "JARVIS",
    subtitle: "Voice-Controlled Intelligent Assistant",
    tech: ["Python", "SpeechRecognition", "pyttsx3", "REST APIs", "Automation"],
    points: [
      "Built a voice-driven desktop assistant with 5+ modules (speech recognition, TTS, news retrieval, OS automation).",
      "Achieved 95% command accuracy and automated live news scraping via REST APIs, saving ~5 minutes/day hands-free.",
      "Reduced system task completion time by ~40% versus manual operation, running completely on 0 paid APIs.",
    ],
    accent: "#e8ff3e",
    link: "https://github.com/krishna-4code",
  },
];

const LEADERSHIP = [
  {
    role: "PR Head",
    organization: "Ashwamedh – Dramatics Society, NSUT",
    period: "2024 – Present",
    highlights: [
      "Spearheaded public relations across 5+ digital platforms for 2+ major theatrical productions, boosting YoY engagement by ~35%.",
      "Performed in 30+ street plays with 50+ member casts and successfully pitched to 10+ corporate sponsors.",
      "Managed a 3-member PR sub-team delivering zero-delay promotional execution across 4+ college events per semester.",
    ],
  },
];

export default function ResumePage() {
  const [viewMode, setViewMode] = useState<"interactive" | "pdf">("interactive");
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("krishnachoudhary131326@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white selection:bg-[#e8ff3e] selection:text-[#0d0d0d] relative font-body">
      <CustomCursor />

      {/* Ambient background glow accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-[#e8ff3e]/[0.025] blur-[150px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-[#38bdf8]/[0.02] blur-[140px]" />
      </div>

      {/* ── Sticky Top Bar ── */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#0d0d0d]/85 border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 font-mono text-xs tracking-widest uppercase text-white/50 hover:text-[#e8ff3e] transition-colors duration-200 group"
          >
            <span className="text-sm transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>
            <span>Back to Portfolio</span>
          </Link>

          {/* View Mode Toggle Pill */}
          <div className="inline-flex items-center p-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <button
              onClick={() => setViewMode("interactive")}
              className={`px-3.5 py-1.5 rounded-full font-mono text-xs tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 ${
                viewMode === "interactive"
                  ? "bg-[#e8ff3e] text-[#0d0d0d] font-semibold shadow-md shadow-[#e8ff3e]/20"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <span>✦</span> Interactive View
            </button>
            <button
              onClick={() => setViewMode("pdf")}
              className={`px-3.5 py-1.5 rounded-full font-mono text-xs tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 ${
                viewMode === "pdf"
                  ? "bg-[#e8ff3e] text-[#0d0d0d] font-semibold shadow-md shadow-[#e8ff3e]/20"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <span>📄</span> Original PDF
            </button>
          </div>

          {/* Download Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={RESUME_PDF}
              download="Krishna_ResumeT.pdf"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.06] hover:bg-[#e8ff3e] text-white hover:text-[#0d0d0d] border border-white/10 hover:border-transparent font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-300"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download PDF</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── Main Container ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-16">
        <AnimatePresence mode="wait">
          {viewMode === "interactive" ? (
            <motion.div
              key="interactive"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="space-y-16"
            >
              {/* ── Header Bio & Contact Card ── */}
              <div className="relative rounded-3xl p-8 md:p-12 bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] backdrop-blur-xl overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] animate-pulse" />
                      <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#4ade80]">
                        NSUT CSE Undergrad · 2024–28
                      </span>
                    </div>

                    <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none">
                      Krishna<span className="text-[#e8ff3e]">.</span>
                    </h1>

                    <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl font-light">
                      Computer Science undergraduate at NSUT Delhi building high-performance web systems, full-stack microservices, and AI-powered interactions.
                    </p>
                  </div>

                  {/* Contact Badges */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
                    {/* Copy Email Button */}
                    <button
                      onClick={copyEmail}
                      className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-[#e8ff3e]/40 bg-white/[0.02] hover:bg-[#e8ff3e]/5 text-left font-mono text-xs text-white/70 hover:text-white transition-all duration-200 flex items-center justify-between gap-3 group"
                    >
                      <span className="truncate">krishnachoudhary131326@gmail.com</span>
                      <span className="text-[10px] uppercase tracking-wider text-[#e8ff3e] font-semibold shrink-0">
                        {copied ? "Copied! ✓" : "Copy"}
                      </span>
                    </button>

                    {/* GitHub Link */}
                    <a
                      href="https://github.com/krishna-4code"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.06] font-mono text-xs text-white/70 hover:text-white transition-all duration-200 flex items-center justify-between gap-3"
                    >
                      <span>github.com/krishna-4code</span>
                      <span className="text-white/40">↗</span>
                    </a>

                    {/* LinkedIn Link */}
                    <a
                      href="https://www.linkedin.com/in/krishnachoudharyy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.06] font-mono text-xs text-white/70 hover:text-white transition-all duration-200 flex items-center justify-between gap-3"
                    >
                      <span>linkedin.com/in/krishnachoudharyy</span>
                      <span className="text-white/40">↗</span>
                    </a>

                    <div className="px-4 py-2 font-mono text-[11px] text-white/30 flex items-center gap-2">
                      <span>📍 New Delhi, India</span>
                      <span>•</span>
                      <span>📞 +91-9958695901</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Key Academic Milestones (Bento Grid) ── */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e8ff3e]" />
                  <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-white/50">
                    Competitive & Academic Achievements
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {ACHIEVEMENTS.map((item) => (
                    <div
                      key={item.title}
                      className="p-6 rounded-2xl bg-white/[0.025] border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300 relative overflow-hidden group"
                    >
                      <div
                        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-25 transition-opacity"
                        style={{ background: item.color }}
                      />
                      <span className="font-mono text-[11px] uppercase tracking-widest text-white/40 block mb-2">
                        {item.title}
                      </span>
                      <div
                        className="font-display font-bold text-3xl mb-1 tracking-tight"
                        style={{ color: item.color }}
                      >
                        {item.stat}
                      </div>
                      <div className="font-mono text-xs text-white/80 font-medium mb-2">
                        {item.rank}
                      </div>
                      <p className="text-white/40 text-xs leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Education Timeline ── */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                  <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-white/50">
                    Education History
                  </h2>
                </div>

                <div className="space-y-4">
                  {EDUCATION.map((edu, i) => (
                    <div
                      key={i}
                      className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="font-display font-bold text-lg md:text-xl text-white">
                            {edu.degree}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] font-mono text-[10px] tracking-wider text-white/60">
                            {edu.badge}
                          </span>
                        </div>
                        <p className="text-white/50 text-sm">{edu.institution}</p>
                        <p className="text-white/35 text-xs pt-1">{edu.highlight}</p>
                      </div>

                      <div className="text-left md:text-right shrink-0">
                        <div className="font-mono text-base font-bold text-[#e8ff3e]">
                          {edu.score}
                        </div>
                        <div className="font-mono text-xs text-white/30">{edu.period}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Technical Skills Matrix ── */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                  <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-white/50">
                    Technical Arsenal
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {SKILL_GROUPS.map((group) => (
                    <div
                      key={group.category}
                      className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-mono text-xs uppercase tracking-widest text-white/80 font-semibold">
                          {group.category}
                        </h3>
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ background: group.accent }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:border-white/20 font-mono text-xs text-white/70 hover:text-white transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Featured Projects ── */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f472b6]" />
                  <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-white/50">
                    Highlighted Engineering Projects
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {PROJECTS.map((proj) => (
                    <div
                      key={proj.title}
                      className="p-7 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.2] transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3
                              className="font-display font-bold text-2xl text-white group-hover:text-[#e8ff3e] transition-colors"
                            >
                              {proj.title}
                            </h3>
                            <span className="font-mono text-[11px] text-white/40 uppercase tracking-wider block mt-1">
                              {proj.subtitle}
                            </span>
                          </div>
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                            style={{ background: proj.accent }}
                          />
                        </div>

                        <ul className="space-y-2.5 pt-2">
                          {proj.points.map((pt, idx) => (
                            <li
                              key={idx}
                              className="text-white/50 text-xs leading-relaxed flex items-start gap-2"
                            >
                              <span className="text-[#e8ff3e] mt-0.5 shrink-0">›</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-6 mt-6 border-t border-white/[0.06] space-y-4">
                        <div className="flex flex-wrap gap-1.5">
                          {proj.tech.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded font-mono text-[10px] text-white/40 bg-white/[0.02] border border-white/[0.05]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-mono text-xs text-[#e8ff3e] hover:underline"
                        >
                          <span>Explore on GitHub</span>
                          <span>→</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Positions of Responsibility ── */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]" />
                  <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-white/50">
                    Positions of Responsibility
                  </h2>
                </div>

                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                  {LEADERSHIP.map((item, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className="font-display font-bold text-xl text-white">
                          {item.role} · <span className="text-white/60">{item.organization}</span>
                        </h3>
                        <span className="font-mono text-xs text-white/30">{item.period}</span>
                      </div>
                      <ul className="space-y-2 pt-2">
                        {item.highlights.map((h, idx) => (
                          <li key={idx} className="text-white/50 text-xs md:text-sm leading-relaxed flex items-start gap-2.5">
                            <span className="text-[#a78bfa] mt-1 shrink-0">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* ── Clean PDF Document Viewer ── */
            <motion.div
              key="pdf"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {/* PDF Toolbar Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#e8ff3e]" />
                  <div>
                    <span className="font-mono text-xs text-white font-medium block">
                      Krishna_ResumeT.pdf
                    </span>
                    <span className="font-mono text-[11px] text-white/40">
                      Standard One-Page Resume · 121 KB
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={RESUME_PDF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.08] font-mono text-xs text-white/70 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span>Open in New Tab</span>
                    <span>↗</span>
                  </a>

                  <a
                    href={RESUME_PDF}
                    download="Krishna_ResumeT.pdf"
                    className="px-5 py-2 rounded-xl bg-[#e8ff3e] text-[#0d0d0d] font-mono text-xs font-semibold hover:bg-[#d8ef2e] transition-colors flex items-center gap-2 shadow-lg shadow-[#e8ff3e]/20"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>

              {/* Clean Framed Viewer */}
              <div className="w-full rounded-2xl border border-white/10 bg-[#141414] overflow-hidden shadow-2xl">
                <iframe
                  src={`${RESUME_PDF}#view=FitH&toolbar=0`}
                  className="w-full h-[85vh] border-0"
                  title="Krishna Resume PDF"
                />
              </div>

              {/* Mobile notice */}
              <div className="text-center sm:hidden">
                <a
                  href={RESUME_PDF}
                  download="Krishna_ResumeT.pdf"
                  className="font-mono text-xs text-[#e8ff3e] underline"
                >
                  Download PDF if preview does not load on mobile
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Sticky Bottom Action Bar ── */}
      <aside aria-label="Resume quick actions" className="sticky bottom-6 z-30 pointer-events-none flex justify-center px-4">
        <div className="pointer-events-auto p-2 rounded-full bg-[#161616]/90 border border-white/15 backdrop-blur-2xl shadow-2xl flex items-center gap-2">
          <a
            href={RESUME_PDF}
            download="Krishna_ResumeT.pdf"
            className="px-5 py-2.5 rounded-full bg-[#e8ff3e] text-[#0d0d0d] font-mono text-xs font-semibold tracking-wider uppercase hover:bg-[#d8ef2e] transition-colors flex items-center gap-2 shadow-lg shadow-[#e8ff3e]/20"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download PDF</span>
          </a>

          <button
            onClick={copyEmail}
            className="px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 font-mono text-xs text-white/80 hover:text-white transition-colors"
          >
            {copied ? "Email Copied! ✓" : "Contact Krishna"}
          </button>
        </div>
      </aside>

      {/* Footer */}
      <footer className="py-10 border-t border-white/[0.06] text-center font-mono text-xs text-white/25">
        © {new Date().getFullYear()} Krishna · Crafted with intention.
      </footer>
    </main>
  );
}
