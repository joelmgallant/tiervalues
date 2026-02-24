/** A single value that can be placed in a tier */
export interface Value {
  id: string;              // kebab-case slug, e.g. "adventure"
  name: string;            // Display name, e.g. "Adventure"
  description: string;     // Full description
  imagePath: string;       // e.g. "/images/values/adventure.png"
  isTopPick: boolean;
}

/** A tier row definition */
export interface Tier {
  id: string;              // e.g. "tier-s", "tier-a"
  label: string;           // e.g. "S", "A"
  color: string;           // hex, e.g. "#ff7f7e"
}

/** Placement of values across tiers */
export interface TierAssignments {
  [tierId: string]: string[];  // tierId -> ordered array of value IDs
}

/** Complete store state */
export interface TierListState {
  tiers: Tier[];
  assignments: TierAssignments;
  topPicks: string[];
  activeValueId: string | null;
}

/** Store actions */
export interface TierListActions {
  moveValue: (valueId: string, fromTierId: string, toTierId: string, newIndex: number) => void;
  reorderValue: (tierId: string, fromIndex: number, toIndex: number) => void;
  setActiveValueId: (id: string | null) => void;
  toggleTopPick: (valueId: string) => void;
  addTier: (label: string, color: string) => void;
  removeTier: (tierId: string) => void;
  updateTierLabel: (tierId: string, label: string) => void;
  updateTierColor: (tierId: string, color: string) => void;
  moveTierUp: (tierId: string) => void;
  moveTierDown: (tierId: string) => void;
  clearTier: (tierId: string) => void;
  resetAll: () => void;
}
