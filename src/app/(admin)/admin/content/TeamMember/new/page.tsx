import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { saveModelRecord } from "@/actions/admin";
import TeamMemberForm from "@/components/admin/TeamMemberForm";

export default function NewTeamMemberPage() {
  async function handleSave(formData: FormData) {
    "use server";

    const areas = ["pages", "news", "courses", "team", "gallery", "projects", "design"] as const;
    const permissions = {
      ...Object.fromEntries(
        areas.map((area) => [
          area,
          {
            view: formData.get(`perm_${area}_view`) === "on",
            edit: formData.get(`perm_${area}_edit`) === "on",
          },
        ])
      ),
      depotDownload: formData.get("perm_depotDownload") === "on",
      depotUpload: formData.get("perm_depotUpload") === "on",
    };

    const adminRole = formData.get("adminRole") as string;

    const data: Record<string, any> = {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      bio: (formData.get("bio") as string) || null,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      photoUrl: (formData.get("photoUrl") as string) || null,
      adminRole: adminRole === "" ? null : adminRole,
      permissions: adminRole ? permissions : null,
    };

    await saveModelRecord("TeamMember", null, data);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/content/TeamMember" className="text-gray-500 hover:text-gray-900">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Yeni Ekip Üyesi Ekle</h1>
      </div>
      <TeamMemberForm action={handleSave} member={null} />
    </div>
  );
}
