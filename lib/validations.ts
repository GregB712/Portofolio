import { z } from "zod";

const listFromInput = z.preprocess((value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}, z.array(z.string().min(1)).default([]));

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(160),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  subject: z.string().trim().min(4, "Please add a subject.").max(180),
  message: z.string().trim().min(20, "Please add a little more detail.").max(4000),
  sourcePage: z.string().trim().max(300).optional().or(z.literal("")),
  website: z.string().optional()
});

export const projectSchema = z.object({
  repoName: z.string().trim().min(1).max(160),
  repoUrl: z.string().trim().url(),
  deploymentUrl: z.string().trim().url().optional().or(z.literal("")),
  title: z.string().trim().min(2).max(180),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a URL-safe slug."),
  description: z.string().trim().min(10).max(600),
  longDescription: z.string().trim().max(5000).optional().or(z.literal("")),
  problemSolved: z.string().trim().max(1000).optional().or(z.literal("")),
  technicalHighlights: listFromInput,
  tags: listFromInput,
  category: listFromInput,
  featured: z.preprocess((value) => value === "on" || value === true, z.boolean()),
  priority: z.coerce.number().int().min(0).max(9999).default(100),
  status: z.enum(["featured", "active", "archived", "hidden", "in_progress"]),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
  stars: z.coerce.number().int().min(0).optional().or(z.literal("")),
  forks: z.coerce.number().int().min(0).optional().or(z.literal("")),
  primaryLanguage: z.string().trim().max(80).optional().or(z.literal(""))
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;

export function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}
