'use client';

import { useState } from 'react';
import Image from 'next/image';
import { VALUES_BY_ID } from '@/lib/values';

function hashColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 50%, 35%)`;
}

interface DragOverlayCardProps {
  valueId: string;
}

export function DragOverlayCard({ valueId }: DragOverlayCardProps) {
  const value = VALUES_BY_ID[valueId];
  const [imgError, setImgError] = useState(false);

  if (!value) return null;

  const bgColor = hashColor(value.id);

  return (
    <div
      className={`relative flex items-center justify-center w-[64px] h-[64px] md:w-[80px] md:h-[80px] rounded text-white text-xs font-bold select-none shadow-xl scale-105 cursor-grabbing overflow-hidden ${
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
  );
}
