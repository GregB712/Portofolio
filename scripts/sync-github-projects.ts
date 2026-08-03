import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const owner = "GregB712";

async function fetchRepo(repo: string) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {})
    }
  });

  if (!response.ok) {
    throw new Error(`${repo}: GitHub returned ${response.status}`);
  }

  return (await response.json()) as {
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    updated_at: string;
    description: string | null;
  };
}

async function main() {
  const force = process.argv.includes("--force");
  const repoArg = process.argv.find((arg) => arg.startsWith("--repo="))?.split("=")[1];
  const projects = await prisma.project.findMany({
    where: repoArg ? { repoName: repoArg } : undefined,
    orderBy: { repoName: "asc" }
  });

  for (const project of projects) {
    const metadata = await fetchRepo(project.repoName);
    await prisma.project.update({
      where: { id: project.id },
      data: {
        repoUrl: project.repoUrl || metadata.html_url,
        description: force && metadata.description ? metadata.description : project.description,
        stars: metadata.stargazers_count,
        forks: metadata.forks_count,
        primaryLanguage: metadata.language,
        githubUpdatedAt: new Date(metadata.updated_at)
      }
    });
    console.log(`Synced ${project.repoName}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
