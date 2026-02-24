import { Tier } from '@/types';

export const DEFAULT_TIERS: Tier[] = [
  { id: 'tier-s', label: 'S', color: '#ff7f7e' },
  { id: 'tier-a', label: 'A', color: '#ffbf7f' },
  { id: 'tier-b', label: 'B', color: '#ffdf80' },
  { id: 'tier-c', label: 'C', color: '#feff7f' },
  { id: 'tier-d', label: 'D', color: '#beff7f' },
  { id: 'tier-f', label: 'F', color: '#7fffff' },
];

export const TIER_COLOR_PRESETS = [
  '#ff7f7e', '#ffbf7f', '#ffdf80', '#feff7f', '#beff7f', '#7eff80', '#7fffff',
  '#7fbfff', '#807fff', '#ff7ffe', '#bf7fbe', '#3b3b3b', '#858585', '#cfcfcf', '#f7f7f7',
];
