"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formDataToObject, projectSchema } from "@/lib/validations";
import { fetchGitHubRepo } from "@/lib/github";

async function assertAdmin() {
  const session = await requireAdmin();
  if (!session) throw new Error("Unauthorized");
}

function normalizeProjectData(formData: FormData) {
  const parsed = projectSchema.parse(formDataToObject(formData));

  return {
    ...parsed,
    deploymentUrl: parsed.deploymentUrl || null,
    longDescription: parsed.longDescription || null,
    problemSolved: parsed.problemSolved || null,
    imageUrl: parsed.imageUrl || null,
    stars: parsed.stars === "" ? null : parsed.stars,
    forks: parsed.forks === "" ? null : parsed.forks,
    primaryLanguage: parsed.primaryLanguage || null
  };
}

export async function createProjectAction(formData: FormData) {
  await assertAdmin();
  const data = normalizeProjectData(formData);
  await prisma.project.create({ data });
  revalidatePath("/");
  revalidatePath("/projects");
  redirect("/admin/projects");
}

export async function updateProjectAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const data = normalizeProjectData(formData);

  await prisma.project.update({
    where: { id },
    data
  });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${data.slug}`);
  redirect("/admin/projects");
}

export async function deleteProjectAction(formData: FormData) {
  await assertAdmin();
  await prisma.project.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/");
  revalidatePath("/projects");
}

export async function toggleProjectFeaturedAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const featured = formData.get("featured") === "true";

  await prisma.project.update({
    where: { id },
    data: { featured: !featured, status: !featured ? "featured" : "active" }
  });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}

export async function setProjectStatusAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as
    | "featured"
    | "active"
    | "archived"
    | "hidden"
    | "in_progress";

  await prisma.project.update({
    where: { id },
    data: { status, featured: status === "featured" ? true : undefined }
  });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}

export async function reorderProjectAction(formData: FormData) {
  await assertAdmin();
  await prisma.project.update({
    where: { id: String(formData.get("id")) },
    data: { priority: Number(formData.get("priority")) }
  });
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}

export async function syncProjectGithubAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const project = await prisma.project.findUniqueOrThrow({ where: { id } });
  const metadata = await fetchGitHubRepo("GregB712", project.repoName);

  await prisma.project.update({
    where: { id },
    data: {
      repoUrl: project.repoUrl || metadata.html_url,
      stars: metadata.stargazers_count,
      forks: metadata.forks_count,
      primaryLanguage: metadata.language,
      githubUpdatedAt: new Date(metadata.updated_at),
      description: project.description || metadata.description || project.description
    }
  });

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/projects");
}

export async function setContactStatusAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as
    | "new"
    | "read"
    | "replied"
    | "archived"
    | "spam";

  await prisma.contactSubmission.update({
    where: { id },
    data: { status }
  });

  revalidatePath("/admin/contact");
}

export async function deleteContactAction(formData: FormData) {
  await assertAdmin();
  await prisma.contactSubmission.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/contact");
}
