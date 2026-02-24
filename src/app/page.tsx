'use client';

import { TierList } from '@/components/tier-list';
import { useHydratedStore } from '@/hooks/use-hydrated-store';

function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-4 animate-pulse">
      <div className="h-8 w-48 bg-neutral-800 rounded mb-4" />
      <div className="rounded overflow-hidden border border-neutral-800">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex border-b border-neutral-800">
            <div className="w-20 min-h-[80px] bg-neutral-700" />
            <div className="flex-1 min-h-[80px] bg-neutral-900 p-1 flex gap-1 flex-wrap">
              {Array.from({ length: 4 + Math.floor(Math.random() * 6) }).map(
                (_, j) => (
                  <div
                    key={j}
                    className="w-[80px] h-[80px] bg-neutral-800 rounded"
                  />
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const hydrated = useHydratedStore();

  if (!hydrated) {
    return <LoadingSkeleton />;
  }

  return <TierList />;
}
