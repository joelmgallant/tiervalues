'use client';

import { useRef, useCallback, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useTierStore } from '@/store/tier-store';
import { useTierDnd, multiContainerCollision } from '@/hooks/use-tier-dnd';
import { TierRow } from './tier-row';
import { UnrankedPool } from './unranked-pool';
import { Toolbar } from './toolbar';
import { DragOverlayCard } from './drag-overlay-card';
import { ExportDialog } from './export-dialog';
import { exportTierListAsPng } from '@/lib/export-image';

export function TierList() {
  const tiers = useTierStore((s) => s.tiers);
  const activeValueId = useTierStore((s) => s.activeValueId);
  const exportRef = useRef<HTMLDivElement>(null);
  const [showExport, setShowExport] = useState(false);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 5 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 5 },
  });
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const { handleDragStart, handleDragOver, handleDragEnd } = useTierDnd();
  const setActiveValueId = useTierStore((s) => s.setActiveValueId);

  const handleExport = useCallback(async () => {
    if (exportRef.current) {
      await exportTierListAsPng(exportRef.current);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-neutral-100">
        Tier Values
      </h1>
      <DndContext
        sensors={sensors}
        collisionDetection={multiContainerCollision}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveValueId(null)}
      >
        <div ref={exportRef}>
          <div className="rounded overflow-hidden border border-neutral-800">
            {tiers.map((tier) => (
              <TierRow key={tier.id} tierId={tier.id} />
            ))}
          </div>
          <UnrankedPool />
        </div>

        <DragOverlay dropAnimation={null}>
          {activeValueId ? (
            <DragOverlayCard valueId={activeValueId} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <Toolbar onExport={() => setShowExport(true)} />

      <ExportDialog
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        onExport={handleExport}
      />
    </div>
  );
}
