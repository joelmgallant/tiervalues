'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { VALUES_BY_ID } from '@/lib/values';
import { useTierStore } from '@/store/tier-store';

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
  const isTopPick = useTierStore((s) => s.topPicks.includes(valueId));
  const toggleTopPick = useTierStore((s) => s.toggleTopPick);
  const [imgError, setImgError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleDoubleClick = useCallback(() => {
    toggleTopPick(valueId);
  }, [toggleTopPick, valueId]);

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
      onMouseMove={handleMouseMove}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className={`relative flex items-center justify-center w-[64px] h-[64px] md:w-[72px] md:h-[72px] lg:w-[80px] lg:h-[80px] rounded text-white text-xs font-bold select-none cursor-grab overflow-hidden touch-none ${
          isTopPick ? 'ring-2 ring-amber-400' : ''
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

      {/* Mouse-following tooltip rendered via portal to avoid clipping */}
      {showTooltip && !isDragging && (
        <div
          className="fixed z-50 px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl text-xs w-[280px] pointer-events-none whitespace-normal"
          style={{
            left: mousePos.x + 16,
            top: mousePos.y + 16,
          }}
        >
          <div className="font-bold text-white mb-1">{value.name}</div>
          <div className="text-neutral-400 leading-snug">{value.description}</div>
          {isTopPick && (
            <div className="text-amber-400 mt-1.5 text-[10px] font-semibold">
              ★ Top Pick
            </div>
          )}
        </div>
      )}
    </div>
  );
}
