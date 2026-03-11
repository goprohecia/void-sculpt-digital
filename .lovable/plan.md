

## Plan: Fix pop-up design, Settings nav, and darken background

### Issues identified

1. **All dialogs/pop-ups** have `bg-background` which resolves to dark green (`#14532d`). Labels, text, and form elements are nearly invisible. Same issue on Sheet component.
2. **Settings page sidebar nav** sits directly on the dark green background with `text-muted-foreground` — barely visible.
3. **Background not dark enough** — user wants an even darker green.

### Implementation

**1. Darken the app background** — `src/index.css`
- Change `--background` and `--bg-app` from `144 57% 20%` (#14532d) to `144 57% 12%` (~#082b16), a much darker green.
- Update `--bg-app-deep` accordingly.

**2. Fix Dialog component** — `src/components/ui/dialog.tsx`
- Replace `bg-background` with `bg-white` on `DialogContent` so all pop-ups render on a white surface with dark text.
- Add `text-[#1a2318]` to force dark text inside dialogs.
- Style the close button with visible dark color.

**3. Fix AlertDialog component** — `src/components/ui/alert-dialog.tsx`
- Same fix: `bg-background` → `bg-white text-[#1a2318]`.

**4. Fix Sheet component** — `src/components/ui/sheet.tsx`
- Same fix on `sheetVariants`: `bg-background` → `bg-white text-[#1a2318]`.

**5. Fix Settings sidebar nav** — `src/pages/admin/AdminSettings.tsx`
- Wrap the `<nav>` content in a white rounded card (`bg-white rounded-xl border border-[#e4e8df] p-4 shadow-sm`) so the navigation items are clearly visible against a white surface.
- Update active/inactive button colors to work on white (active: `bg-[#f0fdf4] text-[#16a34a]`, inactive: `text-[#6b7280] hover:bg-[#f7f8f5]`).
- Group labels: use `text-[#9ca3af]` instead of `text-muted-foreground`.

**6. Global CSS: dialog label fix** — `src/index.css`
- Add rule: `.mba-app [role="dialog"]` forces white bg, dark text, and proper label colors inside all dialogs/modals/sheets, as a safety net.

### Files to modify
- `src/index.css` — darker background + dialog CSS overrides
- `src/components/ui/dialog.tsx` — white bg
- `src/components/ui/alert-dialog.tsx` — white bg
- `src/components/ui/sheet.tsx` — white bg
- `src/pages/admin/AdminSettings.tsx` — settings nav styling

