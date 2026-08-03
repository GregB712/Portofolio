import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const photo = await prisma.profilePhoto.findUnique({
    where: { id: "main" }
  }).catch(() => null);

  if (!photo) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(photo.imageBytes, {
    headers: {
      "Content-Type": photo.mimeType,
      "Content-Length": String(photo.imageBytes.byteLength),
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
