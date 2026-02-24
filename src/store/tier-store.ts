import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';
import { TierListState, TierListActions } from '@/types';
import { DEFAULT_TIERS } from '@/lib/default-tiers';
import { INITIAL_ASSIGNMENTS } from '@/lib/initial-state';
import { VALUES } from '@/lib/values';

const INITIAL_TOP_PICKS = VALUES.filter((v) => v.isTopPick).map((v) => v.id);

const initialState: TierListState = {
  tiers: DEFAULT_TIERS,
  assignments: INITIAL_ASSIGNMENTS,
  topPicks: INITIAL_TOP_PICKS,
  activeValueId: null,
};

export const useTierStore = create<TierListState & TierListActions>()(
  persist(
    (set) => ({
      ...initialState,

      moveValue: (valueId, fromTierId, toTierId, newIndex) =>
        set((state) => {
          const fromList = [...(state.assignments[fromTierId] ?? [])];
          const toList = fromTierId === toTierId ? fromList : [...(state.assignments[toTierId] ?? [])];

          const oldIndex = fromList.indexOf(valueId);
          if (oldIndex === -1) return state;

          fromList.splice(oldIndex, 1);

          if (fromTierId === toTierId) {
            fromList.splice(newIndex, 0, valueId);
            return {
              assignments: { ...state.assignments, [fromTierId]: fromList },
            };
          }

          toList.splice(newIndex, 0, valueId);
          return {
            assignments: {
              ...state.assignments,
              [fromTierId]: fromList,
              [toTierId]: toList,
            },
          };
        }),

      reorderValue: (tierId, fromIndex, toIndex) =>
        set((state) => {
          const list = state.assignments[tierId] ?? [];
          return {
            assignments: {
              ...state.assignments,
              [tierId]: arrayMove(list, fromIndex, toIndex),
            },
          };
        }),

      setActiveValueId: (id) => set({ activeValueId: id }),

      toggleTopPick: (valueId) =>
        set((state) => {
          const isCurrently = state.topPicks.includes(valueId);
          return {
            topPicks: isCurrently
              ? state.topPicks.filter((id) => id !== valueId)
              : [...state.topPicks, valueId],
          };
        }),

      addTier: (label, color) =>
        set((state) => {
          const newTier = { id: `tier-${nanoid(6)}`, label, color };
          return {
            tiers: [...state.tiers, newTier],
            assignments: { ...state.assignments, [newTier.id]: [] },
          };
        }),

      removeTier: (tierId) =>
        set((state) => {
          const valuesInTier = state.assignments[tierId] ?? [];
          const unranked = [...(state.assignments.unranked ?? []), ...valuesInTier];
          const { [tierId]: _removed, ...rest } = state.assignments;
          const newAssignments = { ...rest, unranked };
          return {
            tiers: state.tiers.filter((t) => t.id !== tierId),
            assignments: newAssignments,
          };
        }),

      updateTierLabel: (tierId, label) =>
        set((state) => ({
          tiers: state.tiers.map((t) => (t.id === tierId ? { ...t, label } : t)),
        })),

      updateTierColor: (tierId, color) =>
        set((state) => ({
          tiers: state.tiers.map((t) => (t.id === tierId ? { ...t, color } : t)),
        })),

      moveTierUp: (tierId) =>
        set((state) => {
          const index = state.tiers.findIndex((t) => t.id === tierId);
          if (index <= 0) return state;
          return { tiers: arrayMove(state.tiers, index, index - 1) };
        }),

      moveTierDown: (tierId) =>
        set((state) => {
          const index = state.tiers.findIndex((t) => t.id === tierId);
          if (index === -1 || index >= state.tiers.length - 1) return state;
          return { tiers: arrayMove(state.tiers, index, index + 1) };
        }),

      clearTier: (tierId) =>
        set((state) => {
          const valuesInTier = state.assignments[tierId] ?? [];
          const unranked = [...(state.assignments.unranked ?? []), ...valuesInTier];
          return {
            assignments: { ...state.assignments, [tierId]: [], unranked },
          };
        }),

      resetAll: () => set(initialState),
    }),
    {
      name: 'tier-values-storage',
      partialize: (state) => ({
        tiers: state.tiers,
        assignments: state.assignments,
        topPicks: state.topPicks,
      }),
    }
  )
);
