'use client';

import { useTierStore } from '@/store/tier-store';
import { ValueCard } from './value-card';

export function UnrankedPool() {
  const valueIds = useTierStore((s) => s.assignments.unranked ?? []);

  if (valueIds.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="text-sm text-neutral-500 mb-2 font-semibold uppercase tracking-wider">
        Unranked
      </div>
      <div
        className="flex flex-wrap gap-1 p-2 rounded min-h-[80px]"
        style={{ backgroundColor: 'var(--bg-unranked)' }}
      >
        {valueIds.map((id) => (
          <ValueCard key={id} valueId={id} />
        ))}
      </div>
    </div>
  );
}
