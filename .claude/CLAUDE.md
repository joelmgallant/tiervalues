# TierValues - Personal Values Tier List

## What This Is
A TierMaker-style interactive tier list for 58 personal values. Each value has an AI-generated icon. Users drag-and-drop values between S/A/B/C/D/F tiers, customize tier labels/colors, and export as PNG.

## Tech Stack
- Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- @dnd-kit/core + @dnd-kit/sortable for drag-and-drop
- zustand (with persist middleware) for state management
- html2canvas-pro for PNG export
- @fal-ai/client for image generation (scripts only, not runtime)

## Architecture

### Data Flow
- `data/values.json` — 58 values with name, description, tier (1/2/3), topPick flag
- `src/lib/values.ts` — Parses JSON into `Value[]` (static, NOT in store)
- `src/lib/initial-state.ts` — Maps spreadsheet tiers to S/A/B/C/D/F assignments
- `src/store/tier-store.ts` — Zustand store: mutable tier definitions + assignments
- State persisted to localStorage (key: `tier-values-storage`)

### Key Types (src/types/index.ts)
- `Value` — id, name, description, imagePath, isTopPick
- `Tier` — id (prefixed `tier-`), label, color
- `TierAssignments` — `Record<string, string[]>` (tierId → valueId[])
- `"unranked"` is a regular key in assignments (same DnD logic as tiers)

### Components (src/components/)
- `tier-list.tsx` — Orchestrator: DndContext + all tiers + pool + export ref
- `tier-row.tsx` — Single tier: TierLabel + SortableContext + droppable items area
- `tier-label.tsx` — Colored label cell, inline editable, gear icon for settings
- `tier-row-settings.tsx` — Popover: color picker, rename, move up/down, clear, delete
- `value-card.tsx` — 80x80 draggable card with useSortable, image, gold ring for top picks
- `drag-overlay-card.tsx` — Floating card during drag (1.05x scale + shadow)
- `unranked-pool.tsx` — Bottom holding area with SortableContext + useDroppable
- `toolbar.tsx` — Export, Reset All, Add Row buttons
- `export-dialog.tsx` — Modal for PNG download via html2canvas-pro
- `color-picker.tsx` — 15 preset color swatches grid
- `confirm-dialog.tsx` — Reusable confirmation modal

### Hooks
- `use-tier-dnd.ts` — All DnD logic: sensors, collision detection, onDragOver/onDragEnd
- `use-hydrated-store.ts` — SSR hydration guard

### Generated Assets
- `public/images/values/*.png` — 58 AI-generated icons (512x512, FLUX.1 schnell)
- `scripts/generate-icons.ts` — Batch generation script (idempotent)

## Dev Commands
- `npm run dev` — Start dev server at localhost:3000
- `npm run build` — Production build (must pass clean)
- `npx tsx scripts/generate-icons.ts` — Regenerate value icons via fal.ai
