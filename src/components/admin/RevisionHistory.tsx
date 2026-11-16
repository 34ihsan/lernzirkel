'use client';

import { useState, useTransition } from 'react';
import { History, RotateCcw, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { restoreRevision } from '@/actions/admin';

interface Revision {
  id: string;
  createdAt: Date;
  label: string | null;
}

export default function RevisionHistory({ revisions }: { revisions: Revision[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [restoringId, setRestoringId] = useState<string | null>(null);

  if (revisions.length === 0) return null;

  const handleRestore = (id: string) => {
    if (!confirm('Bu sürümü geri yüklemek istediğinize emin misiniz? Mevcut hali de geçmişe kaydedilecek, isterseniz tekrar geri alabilirsiniz.')) {
      return;
    }
    setRestoringId(id);
    startTransition(async () => {
      await restoreRevision(id);
      window.location.reload();
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
      >
        <span className="flex items-center gap-2">
          <History size={16} />
          Değişiklik Geçmişi ({revisions.length})
        </span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <ul className="divide-y divide-gray-100 border-t border-gray-100">
          {revisions.map((rev) => (
            <li key={rev.id} className="flex items-center justify-between px-4 py-2.5 text-xs">
              <span className="text-gray-600">
                {new Date(rev.createdAt).toLocaleString('de-DE', {
                  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </span>
              <button
                onClick={() => handleRestore(rev.id)}
                disabled={isPending}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-800 font-medium transition disabled:opacity-50"
              >
                {isPending && restoringId === rev.id ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <RotateCcw size={12} />
                )}
                Bu sürüme dön
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
