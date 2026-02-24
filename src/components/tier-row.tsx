'use client';

import { useTierStore } from '@/store/tier-store';
import { TierLabel } from './tier-label';
import { ValueCard } from './value-card';

interface TierRowProps {
  tierId: string;
}

export function TierRow({ tierId }: TierRowProps) {
  const tier = useTierStore((s) => s.tiers.find((t) => t.id === tierId));
  const valueIds = useTierStore((s) => s.assignments[tierId] ?? []);

  if (!tier) return null;

  return (
    <div className="flex border-b border-neutral-800">
      <TierLabel tier={tier} />
      <div
        className="flex flex-wrap items-start gap-1 p-1 flex-1 min-h-[80px]"
        style={{ backgroundColor: 'var(--bg-tier-row)' }}
      >
        {valueIds.map((id) => (
          <ValueCard key={id} valueId={id} />
        ))}
      </div>
    </div>
  );
}
