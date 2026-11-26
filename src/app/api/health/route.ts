import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-server";

export async function GET() {
  let dbOk = true;
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbOk = false;
  }

  // Dış uptime monitörleri (public) sadece durum kodunu görür — heap/uptime/db gecikmesi
  // gibi iç detaylar sadece oturum açmış bir admin isterse döner (bilgi sızıntısını önler).
  let isAdmin = false;
  try {
    await requireAdminSession();
    isAdmin = true;
  } catch {
    // anonim istek, minimal yanıt yeterli
  }

  if (!isAdmin) {
    return NextResponse.json(
      { status: dbOk ? "healthy" : "unhealthy" },
      { status: dbOk ? 200 : 503, headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } }
    );
  }

  const startTime = Date.now();
  let dbLatencyMs = -1;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - startTime;
  } catch {
    dbLatencyMs = Date.now() - startTime;
  }

  const mem = process.memoryUsage();

  return NextResponse.json(
    {
      status: dbOk ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: { status: dbOk ? "connected" : "error", latencyMs: dbLatencyMs },
      memory: {
        heapUsedMB: Math.round((mem.heapUsed / 1024 / 1024) * 10) / 10,
        heapTotalMB: Math.round((mem.heapTotal / 1024 / 1024) * 10) / 10,
        rssMB: Math.round((mem.rss / 1024 / 1024) * 10) / 10,
      },
      environment: process.env.NODE_ENV || "development",
    },
    { status: dbOk ? 200 : 503, headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } }
  );
}
