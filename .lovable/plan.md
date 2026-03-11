

## Plan : Responsive mobile + Design pop-up pour les pages admin

### 1. Fix build error (PWA)

Add `maximumFileSizeToCacheInBytes: 4 * 1024 * 1024` in `vite.config.ts` workbox config to allow large JS bundles.

### 2. Pages admin — Responsive mobile

All pages share common patterns that break on mobile (390px viewport): horizontal `flex` headers with buttons that overflow, `grid-cols-2/3` forms in dialogs, fixed-width selects/inputs, etc.

**AdminClients.tsx:**
- Header: stack title and buttons vertically on mobile (`flex-col` on small screens)
- Filter bar: already has `sm:flex-row`, keep
- Dialog forms: `grid-cols-2` → `grid-cols-1 sm:grid-cols-2`, `grid-cols-3` → same
- Bulk email button: full-width on mobile

**AdminEmails.tsx:**
- Header row with tabs + buttons: stack on mobile
- Compose/template dialogs: responsive form grids

**AdminSupport.tsx:**
- Already mostly responsive. Ticket detail: improve the header flex for small screens

**AdminNotes.tsx:**
- Header: stack search + button below title on mobile
- Filters row: wrap with `flex-wrap`, reduce select widths to `w-full sm:w-40`

**AdminRapports.tsx:**
- Header: stack title/selects vertically on mobile
- Select row: `flex-col sm:flex-row` with full-width selects on mobile

**AdminDocuments.tsx:**
- Header: stack buttons below title on mobile
- Filter row: `flex-col sm:flex-row`
- File actions: always visible on mobile (no group-hover)

**AdminAutomatisations.tsx:**
- Header: stack on mobile
- Automation cards: stack icon/content/controls vertically on small screens
- `RuleFormFields`: already uses `sm:grid-cols-2`, good

**AdminIA.tsx:**
- Chat grid: already `grid-cols-1 lg:grid-cols-[280px_1fr]`
- Chat height: use `min-h-[60vh]` instead of `calc` for mobile
- Config cards: already responsive

### 3. SectorPage (Développeur) — Mobile responsive

- Hero grid: already `grid-cols-1 lg:grid-cols-2`
- Hero image height: `h-[240px] sm:h-[340px]`
- Title: smaller on mobile `text-2xl sm:text-3xl md:text-5xl`
- Section padding: `py-16 sm:py-24`
- Use case cards: `p-6 sm:p-8`

### 4. Pop-up / Dialog design improvement

Improve all `DialogContent` instances across these pages with:
- Mobile-first sizing: `max-w-[95vw] sm:max-w-lg` on mobile
- Max height constraint: `max-h-[85dvh] overflow-y-auto`
- Form grids: `grid-cols-1 sm:grid-cols-2`
- Footer buttons: `flex-col sm:flex-row` on mobile for stacked buttons
- Rounded corners + subtle shadow for a more polished feel
- Consistent padding patterns

### Files to modify
- `vite.config.ts` — fix PWA build error
- `src/pages/admin/AdminClients.tsx` — mobile responsive + dialog design
- `src/pages/admin/AdminEmails.tsx` — mobile responsive
- `src/pages/admin/AdminSupport.tsx` — minor mobile tweaks
- `src/pages/admin/AdminNotes.tsx` — mobile responsive
- `src/pages/admin/AdminRapports.tsx` — mobile responsive
- `src/pages/admin/AdminDocuments.tsx` — mobile responsive + dialog design
- `src/pages/admin/AdminAutomatisations.tsx` — mobile responsive
- `src/pages/admin/AdminIA.tsx` — mobile responsive
- `src/pages/secteurs/SectorPage.tsx` — mobile responsive

