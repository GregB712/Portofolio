export type GitHubRepoMetadata = {
  name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  description: string | null;
};

export async function fetchGitHubRepo(owner: string, repo: string) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {})
    },
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status} for ${owner}/${repo}`);
  }

  return (await response.json()) as GitHubRepoMetadata;
}
