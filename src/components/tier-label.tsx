'use client';

import { useState, useRef, useEffect } from 'react';
import { Tier } from '@/types';
import { useTierStore } from '@/store/tier-store';

interface TierLabelProps {
  tier: Tier;
}

export function TierLabel({ tier }: TierLabelProps) {
  const [editing, setEditing] = useState(false);
  const [labelValue, setLabelValue] = useState(tier.label);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateTierLabel = useTierStore((s) => s.updateTierLabel);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  function commitLabel() {
    const trimmed = labelValue.trim();
    if (trimmed && trimmed !== tier.label) {
      updateTierLabel(tier.id, trimmed);
    }
    setLabelValue(trimmed || tier.label);
    setEditing(false);
  }

  return (
    <div
      className="w-12 md:w-20 min-h-[64px] md:min-h-[80px] flex items-center justify-center text-lg md:text-2xl font-bold shrink-0 cursor-pointer"
      style={{ backgroundColor: tier.color, color: '#1a1a1a' }}
      onClick={() => {
        if (!editing) {
          setLabelValue(tier.label);
          setEditing(true);
        }
      }}
      title="Click to edit label"
    >
      {editing ? (
        <input
          ref={inputRef}
          className="w-full h-full bg-transparent text-center text-2xl font-bold outline-none"
          style={{ color: '#1a1a1a' }}
          value={labelValue}
          onChange={(e) => setLabelValue(e.target.value)}
          onBlur={commitLabel}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitLabel();
            if (e.key === 'Escape') {
              setLabelValue(tier.label);
              setEditing(false);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          maxLength={10}
        />
      ) : (
        tier.label
      )}
    </div>
  );
}
