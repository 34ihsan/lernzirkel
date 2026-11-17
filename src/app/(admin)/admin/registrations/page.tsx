import prisma from "@/lib/prisma";
import RegistrationsClient, { RegistrationItem } from "./RegistrationsClient";

export const metadata = {
  title: "Kayıtlar & Onay | Lernzirkel Admin",
  description: "Kurs anmeldung, bekleme listesi ve onay yönetimi.",
};

export default async function RegistrationsPage() {
  const [raw, teamMembers] = await Promise.all([
    prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        course: { select: { id: true, title: true, capacity: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    }),
    prisma.teamMember.findMany({
      select: { id: true, name: true, role: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const registrations: RegistrationItem[] = raw.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    message: r.message,
    language: r.language,
    status: r.status,
    isWaitlisted: r.isWaitlisted,
    createdAt: r.createdAt,
    courseId: r.courseId,
    courseTitle: r.course?.title ?? "Silinmiş Kurs",
    courseCapacity: r.course?.capacity ?? null,
    assignedToId: r.assignedToId,
    assignedToName: r.assignedTo?.name ?? null,
    lastContactedAt: r.lastContactedAt,
    source: r.source,
  }));

  return <RegistrationsClient initialRegistrations={registrations} teamMembers={teamMembers} />;
}
