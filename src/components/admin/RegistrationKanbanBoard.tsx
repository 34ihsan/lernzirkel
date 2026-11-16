'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Clock, CheckCircle2, PhoneCall, XCircle, User, Mail, GripVertical, type LucideIcon } from 'lucide-react';
import type { RegistrationItem } from '@/app/(admin)/admin/registrations/RegistrationsClient';

type RegistrationStatus = 'PENDING' | 'APPROVED' | 'CONTACTED' | 'REJECTED';

const COLUMNS: { id: RegistrationStatus; label: string; icon: LucideIcon; color: string }[] = [
  { id: 'PENDING', label: 'Onay Bekliyor', icon: Clock, color: 'amber' },
  { id: 'APPROVED', label: 'Onaylandı', icon: CheckCircle2, color: 'emerald' },
  { id: 'CONTACTED', label: 'İletişime Geçildi', icon: PhoneCall, color: 'blue' },
  { id: 'REJECTED', label: 'Reddedildi', icon: XCircle, color: 'red' },
];

function RegistrationCard({ item, assignedToName }: { item: RegistrationItem; assignedToName: string | null }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-gray-200 rounded-xl p-3 shadow-sm space-y-2 ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            {...attributes}
            {...listeners}
            className="shrink-0 text-gray-300 hover:text-gray-500 cursor-grab touch-none"
            title="Sürükle"
          >
            <GripVertical size={14} />
          </button>
          <span className="font-bold text-sm text-gray-900 truncate">{item.name}</span>
        </div>
        {item.isWaitlisted && (
          <span className="shrink-0 text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Liste</span>
        )}
      </div>
      <div className="text-[11px] text-gray-500 flex items-center gap-1 truncate">
        <Mail size={11} className="shrink-0" />
        <span className="truncate">{item.email}</span>
      </div>
      <div className="text-[11px] font-medium text-sky-700 bg-sky-50 inline-block px-2 py-0.5 rounded truncate max-w-full">
        {item.courseTitle}
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <span className="text-[10px] text-gray-400">
          {new Date(item.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-gray-600">
          <User size={11} />
          {assignedToName || 'Atanmadı'}
        </span>
      </div>
    </div>
  );
}

// Tailwind JIT, şablon string ile üretilen sınıfları (border-${color}-400 vb.) algılayamaz;
// bu yüzden sabit, tam sınıf isimleriyle bir eşleme tablosu kullanılıyor.
const OVER_CLASSES: Record<string, string> = {
  amber: 'border-amber-400 bg-amber-50/40',
  emerald: 'border-emerald-400 bg-emerald-50/40',
  blue: 'border-blue-400 bg-blue-50/40',
  red: 'border-red-400 bg-red-50/40',
};

function Column({
  id,
  label,
  icon: Icon,
  color,
  items,
  getAssignedName,
}: {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  items: RegistrationItem[];
  getAssignedName: (r: RegistrationItem) => string | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[260px] rounded-2xl border p-3 space-y-3 transition ${
        isOver ? OVER_CLASSES[color] : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">
          <Icon size={14} />
          <span>{label}</span>
        </div>
        <span className="text-xs font-bold bg-white border border-gray-200 rounded-full px-2 py-0.5 text-gray-600">
          {items.length}
        </span>
      </div>
      <div className="space-y-2 min-h-[80px]">
        {items.map((item) => (
          <RegistrationCard key={item.id} item={item} assignedToName={getAssignedName(item)} />
        ))}
        {items.length === 0 && (
          <div className="text-center text-[11px] text-gray-400 py-6">Boş</div>
        )}
      </div>
    </div>
  );
}

export default function RegistrationKanbanBoard({
  registrations,
  onStatusChange,
}: {
  registrations: RegistrationItem[];
  onStatusChange: (id: string, status: RegistrationStatus) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragStart = (e: DragStartEvent) => setActiveId(e.active.id as string);

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const newStatus = over.id as RegistrationStatus;
    const item = registrations.find((r) => r.id === active.id);
    if (item && item.status !== newStatus) {
      onStatusChange(item.id, newStatus);
    }
  };

  const activeItem = registrations.find((r) => r.id === activeId);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            label={col.label}
            icon={col.icon}
            color={col.color}
            items={registrations.filter((r) => r.status === col.id)}
            getAssignedName={(r) => r.assignedToName ?? null}
          />
        ))}
      </div>
      <DragOverlay>
        {activeItem ? <RegistrationCard item={activeItem} assignedToName={activeItem.assignedToName ?? null} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
