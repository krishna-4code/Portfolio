// ─────────────────────────────────────────────
// Central site config — update these values to
// point at your real profiles / assets.
// ─────────────────────────────────────────────

export const SITE = {
  name: "Krishna",
  email: "krishnachoudhary131326@gmail.com",
  githubUsername: "krishna-4code",
} as const;

export const SOCIAL_LINKS = [
  {
    label: "Resume",
    href: "/resume",
    external: false,
    icon: "CV",
  },
  {
    label: "GitHub",
    href: `https://github.com/${SITE.githubUsername}`,
    external: true,
    icon: "GH",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/krishnachoudharyy/",
    external: true,
    icon: "IN",
  },
  {
    label: "Email",
    href: `mailto:${SITE.email}`,
    external: false,
    icon: "@",
  },
] as const;
