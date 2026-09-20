import prisma from "@/lib/prisma";
import ApplicationsClient, { LeadItem } from "./ApplicationsClient";

export const metadata = {
  title: "Başvurular & Onay Merkezi | Lernzirkel Admin",
  description: "Potansiyel kursiyer ve hibe başvurularını yönetin ve onaylayın.",
};

export default async function ApplicationsPage() {
  const rawLeads = await prisma.leadApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  const leads: LeadItem[] = rawLeads.map((l) => ({
    id: l.id,
    name: l.name,
    email: l.email,
    phone: l.phone,
    serviceType: l.serviceType,
    benefitType: l.benefitType,
    city: l.city,
    estimatedGrant: l.estimatedGrant,
    message: l.message,
    fileUrl: l.fileUrl,
    fileName: l.fileName,
    fileSize: l.fileSize,
    consentGiven: l.consentGiven,
    expiresAt: l.expiresAt,
    isPurged: l.isPurged,
    purgedAt: l.purgedAt,
    language: l.language,
    status: l.status,
    adminNote: l.adminNote,
    createdAt: l.createdAt,
  }));

  return <ApplicationsClient initialLeads={leads} />;
}
