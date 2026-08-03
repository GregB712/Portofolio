import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const avatar = await prisma.landingAvatar.findUnique({
    where: { id: "main" }
  }).catch(() => null);

  if (!avatar) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(avatar.imageBytes, {
    headers: {
      "Content-Type": avatar.mimeType,
      "Content-Length": String(avatar.imageBytes.byteLength),
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
