'use client';

import { TIER_COLOR_PRESETS } from '@/lib/default-tiers';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {TIER_COLOR_PRESETS.map((color) => (
        <button
          key={color}
          className="w-7 h-7 rounded border-2 transition-transform hover:scale-110"
          style={{
            backgroundColor: color,
            borderColor: value === color ? '#fff' : 'transparent',
          }}
          onClick={() => onChange(color)}
          title={color}
        />
      ))}
    </div>
  );
}
