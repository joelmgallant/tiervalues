'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useTierStore } from '@/store/tier-store';
import { ValueCard } from './value-card';

export function UnrankedPool() {
  const valueIds = useTierStore((s) => s.assignments.unranked ?? []);
  const { setNodeRef, isOver } = useDroppable({ id: 'unranked' });

  return (
    <div className="mt-4">
      <div className="text-sm text-neutral-500 mb-2 font-semibold uppercase tracking-wider">
        Unranked
      </div>
      <SortableContext items={valueIds} strategy={rectSortingStrategy}>
        <div
          ref={setNodeRef}
          className="flex flex-wrap gap-1 p-2 rounded min-h-[80px] transition-colors"
          style={{
            backgroundColor: isOver
              ? 'rgba(255,255,255,0.05)'
              : 'var(--bg-unranked)',
          }}
        >
          {valueIds.length === 0 && !isOver && (
            <div className="text-neutral-600 text-sm flex items-center px-2">
              Drag values here to unrank them
            </div>
          )}
          {valueIds.map((id) => (
            <ValueCard key={id} valueId={id} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
