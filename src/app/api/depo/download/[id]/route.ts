import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { requireDepotAccess } from "@/lib/depot-auth";
import { getDepotDir } from "@/lib/depot-storage";
import prisma from "@/lib/prisma";
import { AdminAuthError } from "@/lib/auth-server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireDepotAccess("download");
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: err instanceof Error ? err.message : "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const doc = await prisma.depotDocument.findUnique({ where: { id } });
    if (!doc) {
      return NextResponse.json({ error: "Doküman bulunamadı." }, { status: 404 });
    }

    const filePath = join(getDepotDir(), doc.storedFileName);
    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(doc.fileName)}"`,
        "Content-Length": String(doc.fileSize),
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Depot download error:", error);
    return NextResponse.json({ error: "Dosya okunamadı." }, { status: 500 });
  }
}
