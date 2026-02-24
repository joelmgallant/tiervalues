'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { VALUES_BY_ID } from '@/lib/values';

function hashColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 50%, 35%)`;
}

interface ValueCardProps {
  valueId: string;
}

export function ValueCard({ valueId }: ValueCardProps) {
  const value = VALUES_BY_ID[valueId];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: valueId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: value ? hashColor(value.id) : '#333',
    opacity: isDragging ? 0.3 : 1,
  };

  if (!value) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex items-center justify-center w-[80px] h-[80px] rounded text-white text-xs font-bold select-none cursor-grab overflow-hidden touch-none"
      title={`${value.name}: ${value.description}`}
      {...attributes}
      {...listeners}
    >
      {value.isTopPick && (
        <div className="absolute inset-0 rounded ring-2 ring-yellow-400 pointer-events-none" />
      )}
      <span className="text-center leading-tight px-1 text-[11px]">
        {value.name}
      </span>
    </div>
  );
}
