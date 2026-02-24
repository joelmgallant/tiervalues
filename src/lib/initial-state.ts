import { TierAssignments } from '@/types';
import { DEFAULT_TIERS } from './default-tiers';
import valuesData from '../../data/values.json';

interface RawValue {
  value: string;
  tier: number | null;
  topPick: boolean;
  customDescription: string | null;
}

function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getValueId(raw: RawValue): string {
  const name = raw.value.split(':')[0].trim();
  return toKebabCase(name);
}

const rawValues = (valuesData.values as RawValue[]).filter((v) => v.tier !== null);

const tier1Values = rawValues.filter((v) => v.tier === 1).map(getValueId);
const tier2Values = rawValues.filter((v) => v.tier === 2).map(getValueId);
const tier3Values = rawValues.filter((v) => v.tier === 3).map(getValueId);

// Split tier 2 (33 values) roughly equally across A, B, C, D
function splitEvenly(arr: string[], chunks: number): string[][] {
  const result: string[][] = [];
  const chunkSize = Math.ceil(arr.length / chunks);
  for (let i = 0; i < chunks; i++) {
    result.push(arr.slice(i * chunkSize, (i + 1) * chunkSize));
  }
  return result;
}

const tier2Split = splitEvenly(tier2Values, 4);

export const INITIAL_ASSIGNMENTS: TierAssignments = {
  [DEFAULT_TIERS[0].id]: tier1Values,   // S tier
  [DEFAULT_TIERS[1].id]: tier2Split[0], // A tier
  [DEFAULT_TIERS[2].id]: tier2Split[1], // B tier
  [DEFAULT_TIERS[3].id]: tier2Split[2], // C tier
  [DEFAULT_TIERS[4].id]: tier2Split[3], // D tier
  [DEFAULT_TIERS[5].id]: tier3Values,   // F tier
  unranked: [],
};
