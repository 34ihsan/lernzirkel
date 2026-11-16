'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle, ClipboardCheck, ArrowRight, Loader2 } from 'lucide-react';
import { updateRegistrationStatus } from '@/actions/register';

export interface InboxItem {
  id: string;
  name: string;
  subtitle: string; // kurs adı
  createdAt: Date;
}

export default function QuickApprovalInbox({ items }: { items: InboxItem[] }) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleDecision = (item: InboxItem, approve: boolean) => {
    setBusyId(item.id);
    startTransition(async () => {
      await updateRegistrationStatus(item.id, approve ? 'APPROVED' : 'REJECTED');
      setHidden((prev) => new Set(prev).add(item.id));
    });
  };

  const visibleItems = items.filter((i) => !hidden.has(i.id));

  if (visibleItems.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-sm text-gray-500">
        🎉 Onay bekleyen yeni kurs kaydı yok.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <ClipboardCheck size={16} className="text-amber-600" />
          Hızlı Onay Kutusu
        </h3>
        <span className="text-xs text-gray-400">En yeni {visibleItems.length} kayıt</span>
      </div>
      <ul className="divide-y divide-gray-100">
        {visibleItems.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="shrink-0 p-1.5 rounded-lg bg-indigo-50 text-indigo-700" title="Kurs Kaydı">
                <ClipboardCheck size={14} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleDecision(item, true)}
                disabled={isPending}
                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition disabled:opacity-50"
                title="Onayla"
              >
                {isPending && busyId === item.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              </button>
              <button
                onClick={() => handleDecision(item, false)}
                disabled={isPending}
                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                title="Reddet"
              >
                <XCircle size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-end gap-4 px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-xs font-semibold">
        <Link href="/admin/registrations" className="text-indigo-700 hover:text-indigo-900 flex items-center gap-1">
          Tüm Kurs Kayıtları <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
