

## Plan: Move swap module system from Client space to Admin space

### Problem
The module swap system (swap counter, swap wizard, upgrade banner, upgrade page) is currently placed in the **client space** (`/client/parametres` → ModulesTab, `/client/upgrade`). But the "client" here is the end-customer of the business. 

The swap system should be for the **business admin** (MBA's customer) who manages their subscription and chooses which modules to activate within their plan quota. End-customers of those businesses should not see or manage module swaps.

### What needs to change

**1. Move ModulesTab swap functionality into AdminSettings.tsx**
- In the existing "modules" case of `AdminSettings` (line ~847), integrate the swap system:
  - Add swap counter (2/month, reset 1st of month)
  - Add "Swaper un module" button (only for starter/business plans)
  - Import and use `SwapWarningScreen` and `ModuleSwapWizard`
  - Show `SwapUpgradeBanner` adapted for admin context
- The existing toggle switches in AdminSettings already show modules — the swap replaces the simple toggle for plans with limits

**2. Move upgrade page from `/client/upgrade` to `/admin/upgrade`**
- Create `src/pages/admin/AdminUpgrade.tsx` (copy logic from `ClientUpgrade.tsx` but use `AdminLayout`)
- Update route in `AnimatedRoutes.tsx`: remove `/client/upgrade`, add `/admin/upgrade`
- Update all links pointing to `/client/upgrade` → `/admin/upgrade`

**3. Remove swap from Client space**
- `ClientSettings.tsx`: Remove the "Mes modules" tab entirely (clients don't manage modules)
- Change `TabsList` from `grid-cols-4` to `grid-cols-3`
- Remove `ModulesTab` import

**4. Adapt SwapUpgradeBanner links**
- `SwapUpgradeBanner.tsx`: Change link from `/client/upgrade` to `/admin/upgrade`

**5. Move component files (optional rename)**
- Keep components in `src/components/client/` but they'll now be used from admin context — or move to `src/components/admin/` for clarity:
  - `ModuleSwapWizard.tsx` → used from `AdminSettings`
  - `SwapWarningScreen.tsx` → used from `AdminSettings`
  - `SwapUpgradeBanner.tsx` → link updated to `/admin/upgrade`

### Files to modify
1. **`src/pages/admin/AdminSettings.tsx`** — Integrate swap counter, warning screen, wizard into the "modules" tab
2. **`src/pages/admin/AdminUpgrade.tsx`** — New file, upgrade page with `AdminLayout`
3. **`src/pages/client/ClientSettings.tsx`** — Remove "Mes modules" tab
4. **`src/components/client/SwapUpgradeBanner.tsx`** — Update link to `/admin/upgrade`
5. **`src/components/AnimatedRoutes.tsx`** — Move route from `/client/upgrade` to `/admin/upgrade`
6. **`src/pages/client/ClientUpgrade.tsx`** — Delete or repurpose (replaced by AdminUpgrade)

### Logic preserved
- Swap quota: 2/month for starter & business, unlimited (no swap needed) for enterprise
- SwapWarningScreen with data loss acknowledgment
- 3-step ModuleSwapWizard (remove → add → confirm)
- SuperAdmin deblocage system stays unchanged (already correctly targets enterprises)

