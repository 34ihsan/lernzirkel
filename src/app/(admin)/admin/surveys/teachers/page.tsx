import prisma from "@/lib/prisma";
import { getTeacherComparison } from "@/lib/survey-reports";
import { siteConfig } from "@/lib/seo";
import TeachersClient from "./TeachersClient";

export const metadata = { title: "Eğitmen Karşılaştırma | Lernzirkel Admin" };

export default async function TeachersPage() {
  const [comparison, teamMembers] = await Promise.all([
    getTeacherComparison(),
    prisma.teamMember.findMany({
      where: { email: { not: null } },
      select: { id: true, name: true, email: true, teacherReportToken: true, teacherReportTokenAt: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <TeachersClient
      comparison={comparison}
      teamMembers={teamMembers.map((m) => ({
        ...m,
        teacherReportTokenAt: m.teacherReportTokenAt?.toISOString() ?? null,
      }))}
      baseUrl={siteConfig.url.replace(/\/$/, "")}
    />
  );
}
