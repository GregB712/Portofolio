import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const download = url.searchParams.get("download") === "1";

  const document = await prisma.cvDocument.findUnique({
    where: { id: "main" }
  }).catch(() => null);

  if (!document) {
    return NextResponse.redirect(new URL("/Gregory_Barmpas_CV.pdf", request.url));
  }

  const fileName = document.fileName || "Gregory_Barmpas_CV.pdf";

  return new NextResponse(document.pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(document.pdfBytes.byteLength),
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${fileName.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
