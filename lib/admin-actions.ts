"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  educationEntrySchema,
  experienceEntrySchema,
  formDataToObject,
  projectSchema,
  siteContentSchema
} from "@/lib/validations";
import { fetchGitHubRepo, listGitHubRepos, type GithubRepoPrefill } from "@/lib/github";
import {
  educationDefaultsView,
  experienceDefaultsView,
  siteContentDefaults
} from "@/lib/site-content";

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

async function getValidatedImageFile(formData: FormData, fieldName: string, label: string) {
  const file = formData.get(fieldName);
  if (!(file instanceof File) || file.size === 0) {
    throw new Error(`Please choose an image file for the ${label}.`);
  }

  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
  if (!allowedTypes.has(file.type)) {
    throw new Error(`${label} must be a JPG, PNG, or WebP image.`);
  }

  const maxBytes = 4 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`${label} must be smaller than 4MB.`);
  }

  return {
    file,
    bytes: new Uint8Array(await file.arrayBuffer())
  };
}

async function getValidatedPdfFile(formData: FormData, fieldName: string, label: string) {
  const file = formData.get(fieldName);
  if (!(file instanceof File) || file.size === 0) {
    throw new Error(`Please choose a PDF file for the ${label}.`);
  }

  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    throw new Error(`${label} must be a PDF file.`);
  }

  const maxBytes = 9 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`${label} must be smaller than 9MB.`);
  }

  return {
    file,
    bytes: new Uint8Array(await file.arrayBuffer())
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function humanizeRepoName(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function listGithubReposAction(): Promise<GithubRepoPrefill[]> {
  await assertAdmin();
  const repos = await listGitHubRepos("GregB712");

  return repos.map((repo) => ({
    repoName: repo.name,
    repoUrl: repo.html_url,
    title: humanizeRepoName(repo.name),
    slug: slugify(repo.name),
    description: repo.description ?? "",
    deploymentUrl: repo.homepage ?? "",
    primaryLanguage: repo.language ?? "",
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    tags: repo.topics ?? [],
    pushedAt: repo.pushed_at
  }));
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

export async function uploadProfilePhotoAction(formData: FormData) {
  await assertAdmin();

  const { file, bytes } = await getValidatedImageFile(formData, "photo", "CV profile photo");

  await prisma.profilePhoto.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      imageBytes: bytes,
      mimeType: file.type,
      fileName: file.name || null
    },
    update: {
      imageBytes: bytes,
      mimeType: file.type,
      fileName: file.name || null
    }
  });

  revalidatePath("/cv");
  revalidatePath("/admin/settings");
}

export async function deleteProfilePhotoAction() {
  await assertAdmin();

  await prisma.profilePhoto.deleteMany({
    where: { id: "main" }
  });

  revalidatePath("/cv");
  revalidatePath("/admin/settings");
}

export async function uploadLandingAvatarAction(formData: FormData) {
  await assertAdmin();

  const { file, bytes } = await getValidatedImageFile(formData, "avatar", "landing page avatar");

  await prisma.landingAvatar.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      imageBytes: bytes,
      mimeType: file.type,
      fileName: file.name || null
    },
    update: {
      imageBytes: bytes,
      mimeType: file.type,
      fileName: file.name || null
    }
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function deleteLandingAvatarAction() {
  await assertAdmin();

  await prisma.landingAvatar.deleteMany({
    where: { id: "main" }
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function uploadCvDocumentAction(formData: FormData) {
  await assertAdmin();

  const { file, bytes } = await getValidatedPdfFile(formData, "cv", "CV document");

  await prisma.cvDocument.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      pdfBytes: bytes,
      mimeType: "application/pdf",
      fileName: file.name || "Gregory_Barmpas_CV.pdf"
    },
    update: {
      pdfBytes: bytes,
      mimeType: "application/pdf",
      fileName: file.name || "Gregory_Barmpas_CV.pdf"
    }
  });

  revalidatePath("/cv");
  revalidatePath("/admin/settings");
}

export async function deleteCvDocumentAction() {
  await assertAdmin();

  await prisma.cvDocument.deleteMany({
    where: { id: "main" }
  });

  revalidatePath("/cv");
  revalidatePath("/admin/settings");
}

function revalidateContent() {
  revalidatePath("/");
  revalidatePath("/cv");
  revalidatePath("/admin/content");
}

export async function updateSiteContentAction(formData: FormData) {
  await assertAdmin();
  const data = siteContentSchema.parse(formDataToObject(formData));

  await prisma.siteContent.upsert({
    where: { id: "main" },
    create: { id: "main", ...data },
    update: data
  });

  revalidateContent();
}

export async function createExperienceAction(formData: FormData) {
  await assertAdmin();
  const data = experienceEntrySchema.parse(formDataToObject(formData));
  await prisma.experienceEntry.create({ data });
  revalidateContent();
}

export async function updateExperienceAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const data = experienceEntrySchema.parse(formDataToObject(formData));
  await prisma.experienceEntry.update({ where: { id }, data });
  revalidateContent();
}

export async function deleteExperienceAction(formData: FormData) {
  await assertAdmin();
  await prisma.experienceEntry.delete({ where: { id: String(formData.get("id")) } });
  revalidateContent();
}

export async function createEducationAction(formData: FormData) {
  await assertAdmin();
  const data = educationEntrySchema.parse(formDataToObject(formData));
  await prisma.educationEntry.create({ data });
  revalidateContent();
}

export async function updateEducationAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const data = educationEntrySchema.parse(formDataToObject(formData));
  await prisma.educationEntry.update({ where: { id }, data });
  revalidateContent();
}

export async function deleteEducationAction(formData: FormData) {
  await assertAdmin();
  await prisma.educationEntry.delete({ where: { id: String(formData.get("id")) } });
  revalidateContent();
}

export async function seedContentDefaultsAction() {
  await assertAdmin();

  const existingContent = await prisma.siteContent.findUnique({ where: { id: "main" } });
  if (!existingContent) {
    await prisma.siteContent.create({ data: { id: "main", ...siteContentDefaults } });
  }

  if ((await prisma.experienceEntry.count()) === 0) {
    await prisma.experienceEntry.createMany({
      data: experienceDefaultsView.map((item, index) => ({
        role: item.role,
        company: item.company,
        dates: item.dates,
        current: item.current,
        bullets: item.bullets,
        sortOrder: (index + 1) * 10
      }))
    });
  }

  if ((await prisma.educationEntry.count()) === 0) {
    await prisma.educationEntry.createMany({
      data: educationDefaultsView.map((item, index) => ({
        degree: item.degree,
        school: item.school,
        dates: item.dates,
        sortOrder: (index + 1) * 10
      }))
    });
  }

  revalidateContent();
}
