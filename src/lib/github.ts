import { SITE } from "./site";

// ─────────────────────────────────────────────
// GitHub API types
// ─────────────────────────────────────────────
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  forks_count?: number;
  stargazers_count?: number;
}

// ─────────────────────────────────────────────
// Fetch the user's public repos (most recently
// pushed first). Uses the unauthenticated GitHub
// API which allows 60 requests/hour per IP —
// more than enough for a portfolio page.
// ─────────────────────────────────────────────
export async function fetchGitHubRepos(perPage = 12): Promise<GitHubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${SITE.githubUsername}/repos?sort=updated&per_page=${perPage}`,
    {
      headers: { Accept: "application/vnd.github+json" },
      // Next.js fetch cache — refresh daily so newly pushed repos show up.
      next: { revalidate: 86400 },
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
