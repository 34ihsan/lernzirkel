"use client";

import { Trash2 } from "lucide-react";
import { deleteAnnouncement } from "@/actions/admin";

export default function DeleteButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (confirm("Bu duyuruyu silmek istediğinize emin misiniz?")) {
      await deleteAnnouncement(id);
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-600 hover:text-red-900 transition-colors">
      <Trash2 size={18} />
    </button>
  );
}
