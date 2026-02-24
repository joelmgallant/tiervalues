'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useTierStore } from '@/store/tier-store';
import { TierLabel } from './tier-label';
import { ValueCard } from './value-card';
import { TierRowSettings } from './tier-row-settings';

interface TierRowProps {
  tierId: string;
}

export function TierRow({ tierId }: TierRowProps) {
  const tier = useTierStore((s) => s.tiers.find((t) => t.id === tierId));
  const valueIds = useTierStore((s) => s.assignments[tierId] ?? []);

  const { setNodeRef, isOver } = useDroppable({ id: tierId });

  if (!tier) return null;

  return (
    <div className="flex border-b border-neutral-800 group">
      <TierLabel tier={tier} />
      <SortableContext items={valueIds} strategy={rectSortingStrategy}>
        <div
          ref={setNodeRef}
          className="flex flex-wrap items-start gap-1 p-1 flex-1 min-h-[80px] transition-colors"
          style={{
            backgroundColor: isOver
              ? 'rgba(255,255,255,0.05)'
              : 'var(--bg-tier-row)',
          }}
        >
          {valueIds.map((id) => (
            <ValueCard key={id} valueId={id} />
          ))}
        </div>
      </SortableContext>
      <TierRowSettings tierId={tierId} />
    </div>
  );
}
