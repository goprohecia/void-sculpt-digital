

## Problem

In the Settings → Modules tab, module names are displayed using hardcoded labels from `ALL_ADMIN_MODULES`, `ALL_CLIENT_MODULES`, and `ALL_EMPLOYEE_MODULES` (e.g., always "Clients", "Dossiers"). These labels don't adapt to the selected sector, unlike the sidebar which uses `getModuleLabel()` from `useDemoPlan()`.

## Solution

Import and use `useDemoPlan()` in `AdminSettings.tsx` to call `getModuleLabel(mod.key)` instead of `mod.label` in all three module lists (Admin, Client, Employee) and in the toast messages.

### Changes in `src/pages/admin/AdminSettings.tsx`

1. **Import `useDemoPlan`** from `@/contexts/DemoPlanContext`
2. **Call the hook** to get `getModuleLabel`
3. **Replace `mod.label`** with `getModuleLabel(mod.key)` in these locations:
   - Line 926: Admin modules list label
   - Line 941: Admin module toggle toast message
   - Line 972: Client modules list label
   - Line 1011: Employee modules list label
4. **Also update `AVAILABLE_MODULES_FOR_SPACES`** (line 29-48) — these hardcoded labels in the Custom Spaces manager should also use `getModuleLabel`. This requires a small refactor since it's a static array used inside a sub-component.

