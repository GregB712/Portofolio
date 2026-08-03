import { prisma } from "@/lib/prisma";

const fallbackAvatarUrl = "https://github.com/GregB712.png";

type GitHubUser = {
  avatar_url: string;
  updated_at: string;
};

export async function getGitHubAvatarUrl(username = "GregB712") {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {})
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) return fallbackAvatarUrl;

    const user = (await response.json()) as GitHubUser;
    const avatarUrl = new URL(user.avatar_url);
    avatarUrl.searchParams.set("profile_updated", String(Date.parse(user.updated_at)));

    return avatarUrl.toString();
  } catch {
    return fallbackAvatarUrl;
  }
}

export async function getLandingAvatarUrl() {
  const uploadedAvatar = await prisma.landingAvatar.findUnique({
    where: { id: "main" },
    select: { updatedAt: true }
  }).catch(() => null);

  if (uploadedAvatar) {
    return `/api/landing-avatar?updated=${uploadedAvatar.updatedAt.getTime()}`;
  }

  return getGitHubAvatarUrl();
}
