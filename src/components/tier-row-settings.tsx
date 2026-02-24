'use client';

import { useState, useRef, useEffect } from 'react';
import { useTierStore } from '@/store/tier-store';
import { ColorPicker } from './color-picker';

interface TierRowSettingsProps {
  tierId: string;
}

export function TierRowSettings({ tierId }: TierRowSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const tier = useTierStore((s) => s.tiers.find((t) => t.id === tierId));
  const tiers = useTierStore((s) => s.tiers);
  const updateTierLabel = useTierStore((s) => s.updateTierLabel);
  const updateTierColor = useTierStore((s) => s.updateTierColor);
  const moveTierUp = useTierStore((s) => s.moveTierUp);
  const moveTierDown = useTierStore((s) => s.moveTierDown);
  const clearTier = useTierStore((s) => s.clearTier);
  const removeTier = useTierStore((s) => s.removeTier);

  const tierIndex = tiers.findIndex((t) => t.id === tierId);
  const isFirst = tierIndex === 0;
  const isLast = tierIndex === tiers.length - 1;

  // Close popover on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setEditingLabel(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  // Focus input when editing
  useEffect(() => {
    if (editingLabel && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingLabel]);

  if (!tier) return null;

  function startEditLabel() {
    setLabelValue(tier!.label);
    setEditingLabel(true);
  }

  function commitLabel() {
    if (labelValue.trim()) {
      updateTierLabel(tierId, labelValue.trim());
    }
    setEditingLabel(false);
  }

  return (
    <div className="relative flex items-center">
      <button
        className="w-8 h-full flex items-center justify-center text-neutral-600 hover:text-neutral-300 transition-colors opacity-0 group-hover:opacity-100"
        onClick={() => setIsOpen(!isOpen)}
        title="Tier settings"
      >
        &#x22EE;
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute right-0 top-0 z-50 w-56 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl p-3 space-y-3"
          style={{ transform: 'translateX(100%)' }}
        >
          {/* Label editing */}
          <div>
            <div className="text-xs text-neutral-500 mb-1">Label</div>
            {editingLabel ? (
              <input
                ref={inputRef}
                className="w-full bg-neutral-800 text-white text-sm px-2 py-1 rounded border border-neutral-600 focus:border-neutral-400 outline-none"
                value={labelValue}
                onChange={(e) => setLabelValue(e.target.value)}
                onBlur={commitLabel}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitLabel();
                  if (e.key === 'Escape') setEditingLabel(false);
                }}
                maxLength={10}
              />
            ) : (
              <button
                className="text-sm text-white hover:text-neutral-300 transition-colors"
                onClick={startEditLabel}
              >
                {tier.label} (click to edit)
              </button>
            )}
          </div>

          {/* Color picker */}
          <div>
            <div className="text-xs text-neutral-500 mb-1">Color</div>
            <ColorPicker
              value={tier.color}
              onChange={(color) => updateTierColor(tierId, color)}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1 pt-1 border-t border-neutral-700">
            <button
              className="text-sm text-left px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300 disabled:text-neutral-600 disabled:hover:bg-transparent"
              onClick={() => { moveTierUp(tierId); }}
              disabled={isFirst}
            >
              Move Up
            </button>
            <button
              className="text-sm text-left px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300 disabled:text-neutral-600 disabled:hover:bg-transparent"
              onClick={() => { moveTierDown(tierId); }}
              disabled={isLast}
            >
              Move Down
            </button>
            <button
              className="text-sm text-left px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300"
              onClick={() => { clearTier(tierId); }}
            >
              Clear Tier
            </button>
            <button
              className="text-sm text-left px-2 py-1 rounded hover:bg-red-900/40 text-red-400"
              onClick={() => { removeTier(tierId); setIsOpen(false); }}
            >
              Delete Tier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
