

## Plan: Fix remaining visibility issues across all admin pages

### Problems identified from screenshots

1. **Pipeline CRM (AdminPipeline.tsx)**: Kanban column cards use `bg-muted/10` which resolves to a dark green tint on the dark green background — columns blend into the app background. Deal cards inside use `bg-background` which is also dark green.

2. **Tabs component (tabs.tsx)**: `TabsList` uses `bg-muted` and `TabsTrigger` active state uses `bg-background` — both resolve to dark green tones in the admin context, making tabs nearly invisible (visible in Emails page, Facturation tabs, Pipeline tabs).

3. **Table headers**: `TableHead` uses `text-muted-foreground` which gets overridden to white by the global CSS rule `.mba-app main > * .text-muted-foreground`, making headers white-on-white inside white table containers. The CSS specificity for restoring dark text inside cards is insufficient.

4. **Badge colors on Pipeline**: ETAPES badge colors use dark-mode patterns like `bg-slate-500/20 text-slate-400` — these are invisible on white cards.

5. **`bg-background` and `bg-muted` usage in admin pages**: Since `--background` is `#14532d`, any element using `bg-background` or `bg-muted` outside a white card shows as dark green — this includes deal cards, task cards, filter wrappers, and various panels.

### Implementation approach

**1. Fix Tabs component globally** — `src/components/ui/tabs.tsx`
- Change `TabsList` default: `bg-muted` → `bg-white border border-[#e4e8df]`
- Change `TabsTrigger` active: `data-[state=active]:bg-background` → `data-[state=active]:bg-[#22c55e] data-[state=active]:text-white`
- Inactive triggers: ensure visible text color

**2. Fix Table component** — `src/components/ui/table.tsx`  
- `TableHead`: Add explicit styling so headers are clearly readable inside white table wrappers
- `TableRow` hover: `hover:bg-muted/50` → `hover:bg-[#f0fdf4]`
- `TableFooter`: `bg-muted/50` → `bg-[#f9fafb]`

**3. Fix global CSS specificity** — `src/index.css`
- Strengthen the rule that restores dark text inside white cards/tables to override the page-level white text rules
- Add rules for `bg-muted` and `bg-background` within `.mba-app` to map to white

**4. Fix Pipeline page** — `src/pages/admin/AdminPipeline.tsx`
- Kanban columns: `bg-muted/10` → white background with border
- Deal cards: `bg-background` → `bg-[#f7f8f5]` (light surface inside white card)
- ETAPES badge colors: update to light-mode compatible colors

**5. Fix Badge component** — `src/components/ui/badge.tsx`
- Ensure default variant uses readable colors on white surfaces

**6. Broad CSS override in `index.css`** for `.mba-app` context:
- Override `bg-background` to white when used inside main content
- Override `bg-muted` to `#f7f8f5` when used inside main content
- This catches all pages at once (Taches, Documents, Settings, etc.)

### Files to modify
- `src/components/ui/tabs.tsx` — tab styling
- `src/components/ui/table.tsx` — table header/row styling
- `src/index.css` — global CSS overrides for `.mba-app`
- `src/pages/admin/AdminPipeline.tsx` — pipeline-specific colors (ETAPES badge colors, kanban layout)

