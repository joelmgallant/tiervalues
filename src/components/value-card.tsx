'use client';

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
  if (!value) return null;

  const bgColor = hashColor(value.id);

  return (
    <div
      className="relative flex items-center justify-center w-[80px] h-[80px] rounded text-white text-xs font-bold select-none cursor-grab overflow-hidden"
      style={{ backgroundColor: bgColor }}
      title={`${value.name}: ${value.description}`}
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
