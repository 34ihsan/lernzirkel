import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { requireDepotAccess } from "@/lib/depot-auth";
import { getDepotDir } from "@/lib/depot-storage";
import prisma from "@/lib/prisma";
import { AdminAuthError } from "@/lib/auth-server";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(request: Request) {
  let session;
  try {
    session = await requireDepotAccess("upload");
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: err instanceof Error ? err.message : "Forbidden" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || file?.name || "Doküman";
    const category = (formData.get("category") as string) || null;

    if (!file) {
      return NextResponse.json({ error: "Dosya seçilmedi." }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Geçersiz dosya formatı. Sadece PDF, Word, Excel ve PowerPoint dosyaları kabul edilir." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Dosya çok büyük (maksimum 20MB)." }, { status: 400 });
    }

    const depotDir = getDepotDir();
    await mkdir(depotDir, { recursive: true }).catch(() => {});

    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storedFileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${sanitizedOriginalName}`;
    const filePath = join(depotDir, storedFileName);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const doc = await prisma.depotDocument.create({
      data: {
        title,
        fileName: file.name,
        storedFileName,
        mimeType: file.type,
        fileSize: file.size,
        category,
        uploadedById: session.teamMemberId,
        uploadedByName: session.name,
      },
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (error) {
    console.error("Depot upload error:", error);
    return NextResponse.json({ error: "Dosya yüklenemedi." }, { status: 500 });
  }
}
