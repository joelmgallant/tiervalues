import { Value } from '@/types';
import valuesData from '../../data/values.json';

function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

interface RawValue {
  value: string;
  tier: number | null;
  topPick: boolean;
  customDescription: string | null;
}

export const VALUES: Value[] = (valuesData.values as RawValue[])
  .filter((v) => v.tier !== null)
  .map((v) => {
    const [name, ...descParts] = v.value.split(':');
    const trimmedName = name.trim();
    const description = descParts.join(':').trim();
    const id = toKebabCase(trimmedName);
    return {
      id,
      name: trimmedName,
      description,
      imagePath: `/images/values/${id}.png`,
      isTopPick: v.topPick,
    };
  });

export const VALUES_BY_ID: Record<string, Value> = Object.fromEntries(
  VALUES.map((v) => [v.id, v])
);
