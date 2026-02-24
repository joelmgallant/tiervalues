'use client';

import { useTierStore } from '@/store/tier-store';
import { TierRow } from './tier-row';
import { UnrankedPool } from './unranked-pool';
import { Toolbar } from './toolbar';

export function TierList() {
  const tiers = useTierStore((s) => s.tiers);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-neutral-100">
        Tier Values
      </h1>
      <div className="rounded overflow-hidden border border-neutral-800">
        {tiers.map((tier) => (
          <TierRow key={tier.id} tierId={tier.id} />
        ))}
      </div>
      <UnrankedPool />
      <Toolbar />
    </div>
  );
}
