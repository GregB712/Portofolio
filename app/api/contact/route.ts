import { NextResponse } from "next/server";
import { trackEvent, requestContext } from "@/lib/analytics";
import { forwardContactEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid contact form", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const context = await requestContext();
  const limited = rateLimit(`contact:${context.ipHash ?? parsed.data.email}`, 3, 60 * 60 * 1000);

  if (!limited.ok) {
    return NextResponse.json({ error: "Too many messages. Please try later." }, { status: 429 });
  }

  await prisma.contactSubmission.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company || null,
      subject: parsed.data.subject,
      message: parsed.data.message,
      sourcePage: parsed.data.sourcePage || null,
      ipHash: context.ipHash,
      userAgent: context.userAgent
    }
  });

  await forwardContactEmail(parsed.data);
  await trackEvent({
    eventName: "contact_submit",
    path: parsed.data.sourcePage || "/contact",
    metadata: { subject: parsed.data.subject }
  });

  return NextResponse.json({ ok: true });
}
