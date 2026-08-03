import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { requestContext } from "@/lib/analytics";

const allowedEvents = new Set([
  "page_view",
  "project_view",
  "project_github_click",
  "project_demo_click",
  "cv_download",
  "contact_submit",
  "linkedin_click",
  "github_profile_click",
  "email_copy",
  "email_click"
]);

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    eventName?: string;
    path?: string;
    metadata?: Record<string, unknown>;
  } | null;

  if (!body?.eventName || !allowedEvents.has(body.eventName)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const context = await requestContext();
  const limited = rateLimit(
    `analytics:${context.ipHash ?? "anon"}`,
    120,
    60 * 1000
  );

  if (!limited.ok) {
    return NextResponse.json({ error: "Too many events" }, { status: 429 });
  }

  await prisma.analyticsEvent.create({
    data: {
      eventName: body.eventName,
      path: body.path || "/",
      metadata: body.metadata as Prisma.InputJsonValue | undefined,
      ipHash: context.ipHash,
      userAgent: context.userAgent
    }
  });

  if (body.eventName === "project_github_click" && body.metadata?.projectId) {
    await prisma.project.update({
      where: { id: String(body.metadata.projectId) },
      data: { githubClickCount: { increment: 1 } }
    });
  }

  if (body.eventName === "project_demo_click" && body.metadata?.projectId) {
    await prisma.project.update({
      where: { id: String(body.metadata.projectId) },
      data: { demoClickCount: { increment: 1 } }
    });
  }

  return NextResponse.json({ ok: true });
}
