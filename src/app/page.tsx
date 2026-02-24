'use client';

import { TierList } from '@/components/tier-list';
import { useHydratedStore } from '@/hooks/use-hydrated-store';

export default function Home() {
  const hydrated = useHydratedStore();

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-neutral-500 text-lg">Loading...</div>
      </div>
    );
  }

  return <TierList />;
}
