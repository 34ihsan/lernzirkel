"use server";

import prisma from "@/lib/prisma";

export async function getSystemHealthMetrics() {
  const startTime = Date.now();
  let dbLatency = -1;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - startTime;
  } catch (e) {
    dbLatency = -1;
  }

  const [auditLogs, totalLeads, totalEvents, totalCourses, totalPages] = await Promise.all([
    prisma.auditLog.findMany({
      take: 40,
      orderBy: { createdAt: "desc" },
    }),
    prisma.leadApplication.count(),
    prisma.eventLog.count(),
    prisma.course.count(),
    prisma.page.count(),
  ]);

  const mem = process.memoryUsage();

  return {
    dbLatency,
    uptimeSeconds: Math.floor(process.uptime()),
    memory: {
      heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
      rssMB: Math.round(mem.rss / 1024 / 1024),
    },
    counts: {
      auditLogs: auditLogs.length,
      totalLeads,
      totalEvents,
      totalCourses,
      totalPages,
    },
    auditLogs: auditLogs.map(a => ({
      id: a.id,
      action: a.action,
      adminUser: a.adminUser,
      details: a.details as any,
      createdAt: a.createdAt,
    })),
  };
}
