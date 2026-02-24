'use client';

import { useTierStore } from '@/store/tier-store';

interface ToolbarProps {
  onExport: () => void;
}

export function Toolbar({ onExport }: ToolbarProps) {
  const resetAll = useTierStore((s) => s.resetAll);
  const addTier = useTierStore((s) => s.addTier);

  return (
    <div className="flex gap-2 mt-4">
      <button
        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-sm font-medium transition-colors"
        onClick={onExport}
      >
        Download as PNG
      </button>
      <button
        className="px-4 py-2 bg-red-900/60 hover:bg-red-800/60 text-red-200 rounded text-sm font-medium transition-colors"
        onClick={resetAll}
      >
        Reset All
      </button>
      <button
        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-sm font-medium transition-colors"
        onClick={() => addTier('New', '#858585')}
      >
        + Add Row
      </button>
    </div>
  );
}
