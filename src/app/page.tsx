'use client';

import { TierList } from '@/components/tier-list';
import { useHydratedStore } from '@/hooks/use-hydrated-store';

const SKELETON_CARD_COUNTS = [5, 9, 9, 8, 9, 8];

function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-4 animate-pulse">
      <div className="h-8 w-48 bg-neutral-800 rounded mb-4" />
      <div className="rounded overflow-hidden border border-neutral-800">
        {SKELETON_CARD_COUNTS.map((cardCount, i) => (
          <div key={i} className="flex border-b border-neutral-800">
            <div className="w-12 md:w-[60px] lg:w-20 min-h-[64px] md:min-h-[72px] lg:min-h-[80px] bg-neutral-700" />
            <div className="flex-1 min-h-[64px] md:min-h-[72px] lg:min-h-[80px] bg-neutral-900 p-1 flex gap-1 flex-wrap">
              {Array.from({ length: cardCount }).map((_, j) => (
                <div
                  key={j}
                  className="w-[64px] h-[64px] md:w-[72px] md:h-[72px] lg:w-[80px] lg:h-[80px] bg-neutral-800 rounded"
                />
              ))}
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
