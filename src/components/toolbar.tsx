'use client';

import { useCallback, useState } from 'react';
import { useTierStore } from '@/store/tier-store';
import { TIER_COLOR_PRESETS } from '@/lib/default-tiers';
import { ConfirmDialog } from './confirm-dialog';

function getNextTierLabel(existingLabels: string[]): string {
  const letters = 'SABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  for (const letter of letters) {
    if (!existingLabels.includes(letter)) return letter;
  }
  return `T${existingLabels.length + 1}`;
}

function getRandomPresetColor(): string {
  return TIER_COLOR_PRESETS[Math.floor(Math.random() * TIER_COLOR_PRESETS.length)];
}

interface ToolbarProps {
  onExport: () => void;
}

export function Toolbar({ onExport }: ToolbarProps) {
  const resetAll = useTierStore((s) => s.resetAll);
  const addTier = useTierStore((s) => s.addTier);
  const tiers = useTierStore((s) => s.tiers);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleAddRow = useCallback(() => {
    const existingLabels = tiers.map((t) => t.label);
    const label = getNextTierLabel(existingLabels);
    const color = getRandomPresetColor();
    addTier(label, color);
  }, [tiers, addTier]);

  return (
    <>
      <div className="flex gap-2 mt-4">
        <button
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-sm font-medium transition-colors"
          onClick={onExport}
        >
          Download as PNG
        </button>
        <button
          className="px-4 py-2 bg-red-900/60 hover:bg-red-800/60 text-red-200 rounded text-sm font-medium transition-colors"
          onClick={() => setShowResetConfirm(true)}
        >
          Reset All
        </button>
        <button
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-sm font-medium transition-colors"
          onClick={handleAddRow}
        >
          + Add Row
        </button>
      </div>

      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset All?"
        message="This will reset all tiers and values back to their default positions. This cannot be undone."
        confirmLabel="Reset All"
        onConfirm={() => {
          resetAll();
          setShowResetConfirm(false);
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </>
  );
}
