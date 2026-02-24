# TierMaker.com Feature Specification

Comprehensive feature analysis of [TierMaker.com](https://tiermaker.com/) for building a clone application.

---

## 1. Tier Structure

### Default Tiers

TierMaker uses a letter-grade ranking system with 7 default tier rows (top to bottom):

| Tier | Label | Hex Color    | Color Name        | Meaning              |
|------|-------|--------------|-------------------|----------------------|
| S    | S     | `#ff7f7e`    | Red / Coral        | Superb / S-Class     |
| A    | A     | `#ffbf7f`    | Orange             | Excellent            |
| B    | B     | `#ffdf80`    | Yellow-Orange      | Good                 |
| C    | C     | `#feff7f`    | Yellow             | Average              |
| D    | D     | `#beff7f`    | Yellow-Green       | Below Average        |
| E    | E     | `#7eff80`    | Light Green        | Poor (optional row)  |
| F    | F     | `#7fffff`    | Cyan / Electric Blue| Worst                |

The most common configuration uses **S, A, B, C, D, F** (6 rows), dropping the E tier. Some templates also include an **SS** tier above S.

### Extended Color Palette

TierMaker provides additional colors for custom rows:

| Hex        | Color Name          |
|------------|---------------------|
| `#7fbfff`  | Light Azure / Blue  |
| `#807fff`  | Violet / Purple     |
| `#ff7ffe`  | Fuchsia / Pink      |
| `#bf7fbe`  | African Violet      |
| `#3b3b3b`  | Dark Gray           |
| `#858585`  | Medium Gray         |
| `#cfcfcf`  | Light Gray / Silver |
| `#f7f7f7`  | Near White          |

### Tier Row Layout

Each tier row consists of:
- **Label column** (left side): Displays the tier letter on a colored background. The label is editable text.
- **Items area** (right side): A horizontal wrapping container where item cards are placed. Items flow left-to-right and wrap to new lines if the row gets full.

### Tier Row Management

Each tier row has a **gear/settings icon** that reveals options:
- Change the tier label color (color picker)
- Rename the tier label text
- Move the tier row up
- Move the tier row down
- Clear all items from this row (move them back to unranked)
- Delete the row entirely

Additional controls:
- **"+" button** to add a new tier row
- **Up/down arrow buttons** next to the gear icon for quick reordering

---

## 2. Drag and Drop

### Core Mechanism

- Items are dragged from the **unranked pool** (bottom) into **tier rows** or between tier rows.
- Uses a mouse-based drag on desktop and long-press + drag on touch/mobile devices.
- Items can be reordered within a tier row by dragging horizontally.
- Items can be moved between any two tier rows directly.
- Items can be dragged back to the unranked pool to "unrank" them.

### Visual Feedback During Drag

- **Ghost/preview image**: A semi-transparent copy of the item follows the cursor during drag.
- **Placeholder**: The original position shows an empty space or dimmed placeholder while dragging.
- **Drop zone highlighting**: The target tier row highlights (border glow or background color change) when a dragged item hovers over it, indicating a valid drop target.
- **Opacity change**: The item being dragged reduces opacity at its origin.
- **Cursor change**: Cursor changes to a "grab" hand when hovering over draggable items, and to "grabbing" while actively dragging.

### Drop Behavior

- On successful drop, the item snaps into position with a short animation (~100ms transition).
- Items in the target row shift to make room for the dropped item at the cursor position.
- If dropped outside any valid zone, the item returns to its original position (snap-back).

### Touch/Mobile Behavior

- **Long press** (~200-300ms) initiates drag on touch devices.
- Drag follows finger position.
- Same drop zone highlighting and feedback as desktop.
- The mobile app has an optimized "quick vote" format as a premium feature for faster ranking.

---

## 3. Item Display

### Item Cards

- Items are displayed as **square image thumbnails** by default.
- Default dimensions: approximately **80x80 pixels** for standard square items.
- Landscape-oriented items are cropped/displayed at **130w x 80h pixels**.
- Portrait-oriented items maintain their aspect ratio but are constrained to 80px height.
- Items can optionally display **text labels** below or overlaid on the image.
- Text-only items are supported (colored card with text, no image).

### Image Specifications

- **Accepted formats**: JPG, JPEG, PNG, WEBP
- **Maximum file size**: 50MB per upload batch
- **Maximum per upload**: 500 images at a time
- **Maximum per template**: 3,000 images total
- **Minimum requirement**: At least 2-5 images to create a template

### Item Interactions

- **Hover**: Subtle scale-up or border highlight effect on hoverable items.
- **Click/Tap**: Selects the item (some implementations show a detail view or options).
- **Drag**: Initiates the drag-and-drop operation.
- Items maintain their visual identity (image + optional label) regardless of which tier they are in.

---

## 4. Uncategorized / Unranked Pool

### Location and Layout

- Positioned **below all tier rows** at the bottom of the tier list.
- Acts as a **holding area** for all items that have not yet been ranked.
- When a template first loads, **all items start in the unranked pool**.

### Visual Design

- The pool has a distinct visual separator from the tier rows (typically a different background color or border).
- Items are arranged in a **wrapping horizontal grid** (flows left-to-right, wraps to new rows).
- The pool expands vertically to accommodate all unranked items.
- Labeled "Unranked" or simply left without a tier label.

### Behavior

- Items can be dragged from the pool into any tier row.
- Items can be dragged from tier rows back to the pool.
- "Reset" or "Clear All" actions move all items back to the unranked pool.
- The pool acts as both the starting state and a "parking lot" during ranking.

---

## 5. Sharing and Export

### Save/Download Flow

1. User clicks the **"Save/Download"** button (or "Next" button).
2. A dialog/screen appears to add a **title** and optional **description**.
3. The tier list is rendered as a **downloadable image** (PNG format).
4. The image includes:
   - All tier rows with their labels and colors
   - All items placed in their ranked positions
   - The unranked pool (if items remain)
   - A TierMaker watermark/logo (free tier) or clean image (premium)

### Image Export Details

- Standard resolution for free users; higher resolution for premium subscribers.
- The exported image captures the full tier list as a static screenshot.
- Technology: Uses canvas rendering (similar to `html2canvas` or `dom-to-image`) to convert the DOM to an image.

### Sharing Options

- **Download to device**: Primary method. Image is saved locally.
- **Share URL**: Some implementations support a stateful URL that encodes the tier list state (using URL compression like `lz-string`).
- **Social media sharing**: Users download the image and share it on their preferred platform.
- **Profile save**: Logged-in users can save tier lists to their TierMaker profile.

### Template Sharing (vs. Tier List Sharing)

- **Templates** are shared publicly so others can create their own rankings from the same set of items.
- **Completed tier lists** are shared as images or URLs showing one person's rankings.
- Templates get their own URL on TierMaker (e.g., `tiermaker.com/create/[template-slug]`).

---

## 6. Visual Design

### Overall Layout

```
+------------------------------------------------------------------+
| Header / Navigation Bar                                           |
+------------------------------------------------------------------+
| Template Title                                                    |
+------------------------------------------------------------------+
| [S] | [item] [item] [item] [item] [item] ...                    |
|-----|-------------------------------------------------------------|
| [A] | [item] [item] [item] ...                                   |
|-----|-------------------------------------------------------------|
| [B] | [item] [item] ...                                          |
|-----|-------------------------------------------------------------|
| [C] | [item] [item] [item] [item] ...                            |
|-----|-------------------------------------------------------------|
| [D] | [item] ...                                                  |
|-----|-------------------------------------------------------------|
| [F] | [item] [item] ...                                          |
+------------------------------------------------------------------+
| Unranked Pool                                                     |
| [item] [item] [item] [item] [item] [item] [item] [item] ...     |
| [item] [item] [item] [item] [item] ...                           |
+------------------------------------------------------------------+
| Toolbar: [Save/Download] [Reset] [Settings] [+ Add Row]          |
+------------------------------------------------------------------+
```

### Color Scheme

- **Background**: Dark/charcoal (`#131313` or similar dark gray).
- **Tier row background**: Slightly lighter dark gray (`#1a1a2e` or `#272727`).
- **Item area background**: Darker shade within each row to contrast with the colored label.
- **Text**: White or near-white (`#ffffff`, `#f0f0f0`) for readability on dark backgrounds.
- **Tier labels**: Bold, centered text on the colored background squares.
- **Links/accents**: Bright blue (`#00aef3`) for interactive elements.

### Typography

- **Tier labels**: Bold, large font (often uppercase). Sans-serif font family.
- **Item labels**: Smaller text, regular weight.
- **UI buttons**: Standard sans-serif, medium weight.
- General font stack: System fonts or common sans-serif (Arial, Helvetica, sans-serif).

### Responsive Behavior

- **Desktop (1024px+)**: Full-width tier list. Labels are wide (~60-80px). Items display at full size.
- **Tablet (768-1023px)**: Tier list scales down. Items may become slightly smaller. Labels narrow.
- **Mobile (<768px)**: Tier labels may collapse to smaller width or stack. Items shrink. The app provides a dedicated mobile layout optimized for touch. Long-press replaces click-drag.
- The tier list container is typically max-width constrained and centered on large screens.

---

## 7. Interactions

### Toolbar / Action Buttons

| Button          | Action                                                      |
|-----------------|-------------------------------------------------------------|
| Save/Download   | Opens save dialog, renders tier list as downloadable image  |
| Reset           | Moves all items back to the unranked pool                   |
| Settings / Gear | Opens tier row settings (per-row, on the row itself)        |
| + Add Row       | Adds a new tier row at the bottom (or at a chosen position) |
| Edit Labels     | Allows editing tier label text inline                       |

### Per-Row Interactions

- **Gear icon click**: Opens a dropdown/popover with row options (color, rename, move, clear, delete).
- **Up/Down arrows**: Reorder the tier row relative to adjacent rows.
- **Label click**: Enters inline edit mode for the tier label text.
- **Color picker**: Opens when changing tier label color from the gear menu.

### Item Interactions

- **Single click**: On some implementations, opens a detail view or toggles selection.
- **Drag**: Primary interaction -- moves item between tiers.
- **Right-click** (context menu): Some implementations offer a quick-move menu (e.g., "Move to S Tier", "Move to A Tier", etc.) as an alternative to drag-and-drop.
- **Double-click**: Some implementations allow editing item labels or viewing item details.

### Keyboard Navigation (Accessibility)

- **Tab**: Navigate between items and UI controls.
- **Arrow keys**: Move between items within a row or between rows.
- **Enter/Space**: Pick up or drop an item (keyboard-based drag-and-drop).
- **Escape**: Cancel a drag operation.

---

## 8. Template Creation

### Two Creation Paths

#### Path 1: Single-Use Tier List (Private)

1. User navigates to the single-use tier list page.
2. Uploads images directly in the browser.
3. Ranks items by dragging into tiers.
4. Downloads the finished tier list as an image.
5. **No URL is generated** -- the list is ephemeral.
6. Refreshing the page loses all progress.
7. Does not require an account.

#### Path 2: Public Template

1. User must create a TierMaker account (Google or Twitter/X login).
2. Navigates to the template creation page.
3. Enters a **title** for the template (should be broad/generic).
4. Uploads images (minimum 2-5, up to 3,000).
5. Optionally adds **text labels** to items.
6. Arranges the default order of items.
7. Submits the template.
8. Template publishes instantly (3-10 seconds for image processing).
9. Gets a shareable URL for others to use.

### Image Upload Process

1. Click the **Upload** button or drag files onto the upload zone.
2. Select images from device (supports multi-select).
3. Images are processed client-side:
   - Cropped to square (or landscape/portrait as appropriate).
   - Thumbnailed to display dimensions (~80px).
4. Images appear in the item pool.
5. User can reorder items, add labels, remove items.

### Template Editing (Post-Publish)

- Template creators can add additional images after publishing.
- Can hide or delete templates that didn't work out.
- Cannot fundamentally restructure a published template.

---

## 9. Animations and Transitions

### Drag-and-Drop Animations

- **Pickup**: Subtle scale-up (1.05x) and drop shadow when an item is grabbed.
- **Drag movement**: Item follows cursor/finger with transform-based positioning (GPU-accelerated, 60fps).
- **Drop zone enter**: Target row border or background color transitions (fade in ~150ms).
- **Drop placement**: Item animates into its final position with a short ease-out transition (~100-150ms).
- **Snap-back**: If dropped in an invalid area, item animates back to its original position (~200ms).

### Row Animations

- **Add row**: New row slides in or fades in from below (~200ms).
- **Delete row**: Row fades out and remaining rows slide up to fill the gap (~200ms).
- **Reorder rows**: Rows animate to their new positions (transform-based slide, ~200ms).

### UI Transitions

- **Settings dropdown**: Fades in/slides down from the gear icon (~150ms).
- **Color picker**: Pops in with a subtle scale animation.
- **Save dialog**: Modal overlay fades in (~200ms).
- **Button hover states**: Subtle color transitions (~100ms).

### Loading States

- **Template loading**: Items fade in progressively or appear with a skeleton loading state.
- **Image upload**: Progress indicators while images are being processed.
- **Save/Export**: Loading spinner while the image is being rendered.

---

## 10. Premium / Pro Features

TierMaker offers a paid subscription with these additional features:

| Feature                  | Free             | Premium/Pro           |
|--------------------------|------------------|-----------------------|
| Ad experience            | Ads present      | Ad-free               |
| Watermark                | TierMaker logo   | No watermark          |
| Image resolution         | Standard         | Higher definition     |
| Tier list width          | Standard         | Custom/wider lists    |
| Mobile quick-vote format | No               | Yes                   |
| Save/bookmark templates  | No               | Yes                   |
| Text-to-image items      | No               | Yes                   |

---

## 11. Technical Architecture Notes

### Client-Side Focus

- TierMaker operates primarily client-side for the tier list editor.
- Images are processed in the browser.
- The drag-and-drop editor does not require constant server communication.
- State can be encoded in URLs (using compression like `lz-string`) for sharing without a backend.

### Key Libraries Used in Clones

Open-source TierMaker clones commonly use:
- **Drag-and-drop**: `@dnd-kit`, `react-dnd`, `@hello-pangea/dnd`, or the native HTML5 Drag and Drop API.
- **Image export**: `html2canvas`, `dom-to-image`, or native Canvas API.
- **State management**: `zustand`, React Context, or simple `useState`.
- **URL state encoding**: `lz-string` for compressing tier list state into shareable URLs.
- **Frameworks**: React/Next.js (most common), or vanilla JS/HTML/CSS for minimal implementations.

### Data Model

```
Template {
  id: string
  title: string
  description: string
  items: Item[]
  createdAt: timestamp
  author: User
}

Item {
  id: string
  name: string
  imageUrl: string | null
}

TierList {
  templateId: string
  tiers: Tier[]
  unrankedItems: Item[]
}

Tier {
  id: string
  label: string         // "S", "A", "B", etc.
  color: string         // hex color code
  items: Item[]         // ordered array of items in this tier
  position: number      // row order (0 = top)
}
```

---

## 12. Summary of Key Features to Implement

### Must-Have (Core)

1. Tier rows with colored labels (S, A, B, C, D, F default).
2. Drag-and-drop items between tiers and within tiers.
3. Unranked item pool at the bottom.
4. Editable tier labels (text and color).
5. Add, remove, and reorder tier rows.
6. Image upload for items.
7. Export/download tier list as image.
8. Responsive layout (desktop + mobile).
9. Reset all items to unranked.
10. Clear individual tier rows.

### Nice-to-Have (Enhanced)

1. Right-click context menu for quick item placement.
2. Keyboard accessibility for drag-and-drop.
3. Shareable URL with encoded state.
4. Template system (create, browse, use templates).
5. User accounts and saved tier lists.
6. Text-only items (no image).
7. Smooth animations and transitions.
8. Touch-optimized mobile experience with long-press drag.
9. Item labels/tooltips on hover.
10. Undo/redo functionality.

### Stretch Goals

1. Social sharing integrations.
2. Community template gallery with search/browse.
3. Premium features (no watermark, high-res export).
4. Collaborative real-time editing.
5. Template categories and tags.
6. Voting/aggregation across multiple users' rankings.

---

## Sources

- [TierMaker.com](https://tiermaker.com/)
- [TierMaker Template Creation Guide](https://tiermaker.com/blog/support/10/tier-list-template-creation-guide-and-faqs)
- [TierMaker Image Limits](https://tiermaker.com/blog/support/18/image-limits)
- [TierMaker S Tier Meaning](https://tiermaker.com/blog/support/15/s-tier-meaning-what-does-s-tier-stand-for)
- [TierMaker Color Palette (ColorsWall)](https://colorswall.com/palette/3297)
- [Building a Modern Tier List App (DEV.to)](https://dev.to/blamsa0mine/building-a-modern-tier-list-app-architecture-and-logic-deep-dive-1c3k)
- [OpenTierBoy (GitHub)](https://github.com/infinia-yzl/opentierboy)
- [SuperFola/TierListMaker (GitHub)](https://github.com/SuperFola/TierListMaker)
- [MrEzequiel/tier-list (GitHub)](https://github.com/MrEzequiel/tier-list)
- [TierMaker Mobile App (App Store)](https://apps.apple.com/us/app/tiermaker-com/id6744654563)
- [TierMaker Mobile App (Google Play)](https://play.google.com/store/apps/details?id=com.tiermaker.app)
- [Tier List Wikipedia](https://en.wikipedia.org/wiki/Tier_list)
- [TierMaker Dark Theme (UserStyles)](https://userstyles.world/style/2655/tiermaker-dark-mode)
