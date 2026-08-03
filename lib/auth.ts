import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

function isAllowedAdmin(email?: string | null, githubLogin?: string | null) {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const adminGithub = (process.env.ADMIN_GITHUB_LOGIN ?? "GregB712").toLowerCase();

  if (adminEmail && email?.toLowerCase() === adminEmail) return true;
  if (adminGithub && githubLogin?.toLowerCase() === adminGithub) return true;

  return false;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  ],
  callbacks: {
    async signIn({ user, profile }) {
      const githubLogin =
        typeof profile === "object" && profile && "login" in profile
          ? String(profile.login)
          : null;

      return isAllowedAdmin(user.email, githubLogin);
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  }
});

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (adminEmail && session.user.email.toLowerCase() !== adminEmail) return null;

  return session;
}
