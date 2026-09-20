"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CreateLeadPayload {
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  benefitType?: string;
  city?: string;
  estimatedGrant?: string;
  message?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  consentGiven?: boolean;
  consentText?: string;
  language?: string;
}

export async function submitLeadApplication(payload: CreateLeadPayload) {
  try {
    // 60-day legal retention period by default
    const retentionDays = 60;
    const expiresAt = new Date(Date.now() + retentionDays * 24 * 60 * 60 * 1000);

    const lead = await prisma.leadApplication.create({
      data: {
        name: payload.name.trim(),
        email: payload.email.trim(),
        phone: payload.phone?.trim() || null,
        serviceType: payload.serviceType,
        benefitType: payload.benefitType || "NONE",
        city: payload.city?.trim() || "Ludwigshafen",
        estimatedGrant: payload.estimatedGrant || "100% Kostenübernahme möglich (0€)",
        message: payload.message?.trim() || null,
        fileUrl: payload.fileUrl || null,
        fileName: payload.fileName || null,
        fileSize: payload.fileSize || null,
        consentGiven: payload.consentGiven ?? true,
        consentText: payload.consentText || "DSGVO-Einwilligung erteilt. Daten werden nach 60 Tagen automatisch gelöscht.",
        expiresAt: expiresAt,
        language: payload.language || "de",
        status: "PENDING", // Her yeni başvuru Admin Onayı Bekler
      },
    });

    // Otomatik denetim kaydı oluştur
    await prisma.auditLog.create({
      data: {
        action: "NEW_LEAD_SUBMISSION",
        adminUser: "System",
        details: {
          leadId: lead.id,
          name: lead.name,
          serviceType: lead.serviceType,
          benefitType: lead.benefitType,
        },
      },
    }).catch(() => null);

    revalidatePath("/admin/applications");
    return { success: true, id: lead.id };
  } catch (error) {
    console.error("Error creating lead application:", error);
    return { success: false, error: "Başvuru kaydedilirken bir hata oluştu." };
  }
}

export async function updateLeadStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "CONTACTED" | "REJECTED",
  adminNote?: string
) {
  try {
    const updated = await prisma.leadApplication.update({
      where: { id },
      data: {
        status,
        ...(adminNote !== undefined ? { adminNote } : {}),
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: `APPLICATION_${status}`,
        adminUser: "Admin",
        details: {
          leadId: id,
          applicantName: updated.name,
          newStatus: status,
          adminNote,
        },
      },
    }).catch(() => null);

    revalidatePath("/admin/applications");
    return { success: true };
  } catch (error) {
    console.error("Error updating lead status:", error);
    return { success: false, error: "Statü güncellenirken hata oluştu." };
  }
}

export async function deleteLeadApplication(id: string) {
  try {
    await prisma.leadApplication.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        action: "APPLICATION_DELETED",
        adminUser: "Admin",
        details: { leadId: id },
      },
    }).catch(() => null);

    revalidatePath("/admin/applications");
    return { success: true };
  } catch (error) {
    console.error("Error deleting lead application:", error);
    return { success: false, error: "Başvuru silinirken hata oluştu." };
  }
}

export async function getLeadStats() {
  const [total, pending, approved, contacted] = await Promise.all([
    prisma.leadApplication.count(),
    prisma.leadApplication.count({ where: { status: "PENDING" } }),
    prisma.leadApplication.count({ where: { status: "APPROVED" } }),
    prisma.leadApplication.count({ where: { status: "CONTACTED" } }),
  ]);

  return { total, pending, approved, contacted };
}
