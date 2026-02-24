'use client';

import { useState } from 'react';
import Image from 'next/image';
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
  const [imgError, setImgError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

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
    transition: transition ?? 'transform 150ms ease-out',
    opacity: isDragging ? 0.3 : 1,
  };

  if (!value) return null;

  const bgColor = hashColor(value.id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group/card"
      {...attributes}
      {...listeners}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`relative flex items-center justify-center w-[64px] h-[64px] md:w-[80px] md:h-[80px] rounded text-white text-xs font-bold select-none cursor-grab overflow-hidden touch-none ${
          value.isTopPick ? 'ring-2 ring-amber-400' : ''
        }`}
        style={{ backgroundColor: imgError ? bgColor : 'transparent' }}
      >
        {!imgError ? (
          <Image
            src={value.imagePath}
            alt={value.name}
            fill
            className="object-cover rounded"
            sizes="80px"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-center leading-tight px-1 text-[11px]">
            {value.name}
          </span>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && !isDragging && (
        <div className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl text-xs max-w-[200px] pointer-events-none whitespace-normal">
          <div className="font-bold text-white mb-0.5">{value.name}</div>
          <div className="text-neutral-400 leading-snug">{value.description}</div>
          {value.isTopPick && (
            <div className="text-amber-400 mt-1 text-[10px] font-semibold">
              ★ Top Pick
            </div>
          )}
        </div>
      )}
    </div>
  );
}
