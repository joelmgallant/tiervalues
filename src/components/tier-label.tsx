'use client';

import { Tier } from '@/types';

interface TierLabelProps {
  tier: Tier;
}

export function TierLabel({ tier }: TierLabelProps) {
  return (
    <div
      className="w-20 min-h-[80px] flex items-center justify-center text-2xl font-bold shrink-0"
      style={{ backgroundColor: tier.color, color: '#1a1a1a' }}
    >
      {tier.label}
    </div>
  );
}
