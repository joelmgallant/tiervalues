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

/** Find which tier container a value belongs to */
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

export function useTierDnd() {
  const { assignments, moveValue, reorderValue, setActiveValueId } =
    useTierStore();

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

      const activeContainer = findContainer(assignments, activeId);
      if (!activeContainer) return;

      // Check if over is a container (tier) or a value
      let overContainer: string | null = null;

      // If overId matches a tier/container key, that's the container
      if (assignments[overId] !== undefined) {
        overContainer = overId;
      } else {
        overContainer = findContainer(assignments, overId);
      }

      if (!overContainer || activeContainer === overContainer) return;

      // Move to new container
      const overItems = assignments[overContainer] ?? [];
      const overIndex = overItems.indexOf(overId);
      const newIndex = overIndex >= 0 ? overIndex : overItems.length;

      moveValue(activeId, activeContainer, overContainer, newIndex);
    },
    [assignments, moveValue]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveValueId(null);

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      const activeContainer = findContainer(assignments, activeId);
      if (!activeContainer) return;

      // If over is a container and active is already in it, no-op
      if (overId === activeContainer) return;

      // Check if over is in the same container (reorder)
      const overContainer =
        assignments[overId] !== undefined
          ? overId
          : findContainer(assignments, overId);

      if (!overContainer) return;

      if (activeContainer === overContainer) {
        // Reorder within same container
        const items = assignments[activeContainer];
        const fromIndex = items.indexOf(activeId);
        const toIndex = items.indexOf(overId);
        if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
          reorderValue(activeContainer, fromIndex, toIndex);
        }
      } else {
        // Cross-container move (should have been handled in dragOver,
        // but handle final placement)
        const overItems = assignments[overContainer] ?? [];
        const overIndex = overItems.indexOf(overId);
        const newIndex = overIndex >= 0 ? overIndex : overItems.length;
        moveValue(activeId, activeContainer, overContainer, newIndex);
      }
    },
    [assignments, moveValue, reorderValue, setActiveValueId]
  );

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    collisionDetection: multiContainerCollision,
  };
}
