'use client';

import { useCallback } from 'react';
import {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  UniqueIdentifier,
  CollisionDetection,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core';
import { useTierStore } from '@/store/tier-store';

/** Find which tier container a value belongs to (reads fresh state) */
function findContainer(
  assignments: Record<string, string[]>,
  valueId: string
): string | null {
  for (const [tierId, ids] of Object.entries(assignments)) {
    if (ids.includes(valueId)) return tierId;
  }
  return null;
}

/** Custom collision detection that checks containers first, then items */
export const multiContainerCollision: CollisionDetection = (args) => {
  // First try pointer-within for precise container detection
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) return pointerCollisions;

  // Fallback to rect intersection
  return rectIntersection(args);
};

/** Read the latest assignments directly from the store (avoids stale closures) */
function getAssignments() {
  return useTierStore.getState().assignments;
}

export function useTierDnd() {
  const moveValue = useTierStore((s) => s.moveValue);
  const reorderValue = useTierStore((s) => s.reorderValue);
  const setActiveValueId = useTierStore((s) => s.setActiveValueId);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveValueId(event.active.id as string);
    },
    [setActiveValueId]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;
      if (activeId === overId) return;

      // Always read fresh state to avoid stale closure issues during rapid drags
      const assignments = getAssignments();

      const activeContainer = findContainer(assignments, activeId);
      if (!activeContainer) return;

      // Determine if over is a container or a value
      const isOverContainer = assignments[overId] !== undefined;
      const overContainer = isOverContainer
        ? overId
        : findContainer(assignments, overId);

      if (!overContainer) return;

      if (activeContainer === overContainer) {
        // Same container: reorder in real-time so state matches visual transforms.
        // This prevents the snap-back glitch when drop resolves to the container
        // instead of an item.
        if (!isOverContainer) {
          const items = assignments[activeContainer];
          const fromIndex = items.indexOf(activeId);
          const toIndex = items.indexOf(overId);
          if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
            reorderValue(activeContainer, fromIndex, toIndex);
          }
        }
      } else {
        // Cross-container move
        const overItems = assignments[overContainer] ?? [];
        const overIndex = overItems.indexOf(overId);
        const newIndex = overIndex >= 0 ? overIndex : overItems.length;
        moveValue(activeId, activeContainer, overContainer, newIndex);
      }
    },
    [moveValue, reorderValue]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveValueId(null);
      // All moves and reorders are committed in real-time by onDragOver.
      // onDragEnd only needs to clear the active drag state.
    },
    [setActiveValueId]
  );

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    collisionDetection: multiContainerCollision,
  };
}
