export type GitHubRepoMetadata = {
  name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  description: string | null;
};

export type GithubRepoPrefill = {
  repoName: string;
  repoUrl: string;
  title: string;
  slug: string;
  description: string;
  deploymentUrl: string;
  primaryLanguage: string;
  stars: number;
  forks: number;
  tags: string[];
  pushedAt: string;
};

export type GitHubRepoListItem = GitHubRepoMetadata & {
  homepage: string | null;
  topics: string[];
  fork: boolean;
  private: boolean;
  pushed_at: string;
};

export async function listGitHubRepos(owner: string) {
  const response = await fetch(
    `https://api.github.com/users/${owner}/repos?per_page=100&sort=updated&type=owner`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {})
      },
      next: { revalidate: 3600 }
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status} for ${owner}`);
  }

  const repos = (await response.json()) as GitHubRepoListItem[];
  return repos.filter((repo) => !repo.private);
}

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
