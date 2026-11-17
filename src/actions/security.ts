"use server";

import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-server";
import { SECURITY_EVENT_NAMES } from "@/lib/security-log";

export interface SecurityOverview {
  counts24h: Record<string, number>;
  counts7d: Record<string, number>;
  recent: {
    id: string;
    eventName: string;
    url: string;
    createdAt: Date;
    metadata: unknown;
  }[];
}

/** Admin "Güvenlik" sayfası için: son 24 saat/7 gün özet sayıları + en son olaylar. */
export async function getSecurityOverview(): Promise<SecurityOverview> {
  await requireAdminSession();

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const eventNames = [...SECURITY_EVENT_NAMES];

  const [grouped24h, grouped7d, recent] = await Promise.all([
    prisma.eventLog.groupBy({
      by: ["eventName"],
      where: { eventName: { in: eventNames }, createdAt: { gte: since24h } },
      _count: { _all: true },
    }),
    prisma.eventLog.groupBy({
      by: ["eventName"],
      where: { eventName: { in: eventNames }, createdAt: { gte: since7d } },
      _count: { _all: true },
    }),
    prisma.eventLog.findMany({
      where: { eventName: { in: eventNames } },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, eventName: true, url: true, createdAt: true, metadata: true },
    }),
  ]);

  const toRecord = (rows: { eventName: string; _count: { _all: number } }[]) => {
    const record: Record<string, number> = {};
    for (const name of eventNames) record[name] = 0;
    for (const row of rows) record[row.eventName] = row._count._all;
    return record;
  };

  return {
    counts24h: toRecord(grouped24h),
    counts7d: toRecord(grouped7d),
    recent,
  };
}
