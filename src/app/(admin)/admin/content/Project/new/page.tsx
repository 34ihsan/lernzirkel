import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { saveModelRecord } from "@/actions/admin";
import ProjectForm from "@/components/admin/ProjectForm";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function NewProjectPage() {
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { name: 'asc' }
  });

  async function handleSave(formData: FormData) {
    "use server";
    
    // Checkboxes / Dates need special parsing
    let startDate = formData.get("startDate") as string;
    let endDate = formData.get("endDate") as string;
    
    const data: Record<string, any> = {
      title: formData.get("title") as string,
      slug: (formData.get("slug") as string) || null,
      status: formData.get("status") as string,
      description: formData.get("description") as string,
      goals: (formData.get("goals") as string) || null,
      targetGroup: (formData.get("targetGroup") as string) || null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      budget: (formData.get("budget") as string) || null,
      fundingSource: (formData.get("fundingSource") as string) || null,
      partners: (formData.get("partners") as string) || null,
      location: (formData.get("location") as string) || null,
      results: (formData.get("results") as string) || null,
      contactPersonId: (formData.get("contactPersonId") as string) || null,
      imageUrl: (formData.get("imageUrl") as string) || null,
    };

    // saveModelRecord redirects internally, so code after it won't execute
    await saveModelRecord("Project", null, data);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/content/Project" className="text-gray-500 hover:text-gray-900">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Yeni Proje Ekle</h1>
      </div>
      
      <ProjectForm action={handleSave} teamMembers={teamMembers} />
    </div>
  );
}
