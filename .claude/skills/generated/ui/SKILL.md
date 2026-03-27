---
name: ui
description: "Skill for the Ui area of void-sculpt-digital. 48 symbols across 35 files."
---

# Ui

48 symbols | 35 files | Cohesion: 92%

## When to Use

- Working with code in `src/`
- Understanding how cn, ImageWithSkeleton, AdminRapports work
- Modifying ui-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/ui/pagination.tsx` | Pagination, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis |
| `src/pages/admin/AdminRapports.tsx` | AdminRapports, handleGenerate |
| `src/components/ui/sheet.tsx` | SheetHeader, SheetFooter |
| `src/components/ui/resizable.tsx` | ResizablePanelGroup, ResizableHandle |
| `src/components/ui/drawer.tsx` | DrawerHeader, DrawerFooter |
| `src/components/ui/dialog.tsx` | DialogHeader, DialogFooter |
| `src/components/ui/breadcrumb.tsx` | BreadcrumbSeparator, BreadcrumbEllipsis |
| `src/components/ui/alert-dialog.tsx` | AlertDialogHeader, AlertDialogFooter |
| `src/components/booking/BookingCountdown.tsx` | BookingCountdown, tick |
| `src/components/admin/MobileBottomNav.tsx` | MobileBottomNav, isActive |

## Entry Points

Start here when exploring this area:

- **`cn`** (Function) — `src/lib/utils.ts:3`
- **`ImageWithSkeleton`** (Function) — `src/components/ImageWithSkeleton.tsx:11`
- **`AdminRapports`** (Function) — `src/pages/admin/AdminRapports.tsx:31`
- **`handleGenerate`** (Function) — `src/pages/admin/AdminRapports.tsx:44`
- **`SportStepper`** (Function) — `src/components/sport/SportStepper.tsx:10`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `cn` | Function | `src/lib/utils.ts` | 3 |
| `ImageWithSkeleton` | Function | `src/components/ImageWithSkeleton.tsx` | 11 |
| `AdminRapports` | Function | `src/pages/admin/AdminRapports.tsx` | 31 |
| `handleGenerate` | Function | `src/pages/admin/AdminRapports.tsx` | 44 |
| `SportStepper` | Function | `src/components/sport/SportStepper.tsx` | 10 |
| `GarageVehicleStepper` | Function | `src/components/garage/GarageVehicleStepper.tsx` | 15 |
| `ImmobilierMandatStepper` | Function | `src/components/immobilier/ImmobilierMandatStepper.tsx` | 15 |
| `ConsultantStepper` | Function | `src/components/consultant/ConsultantStepper.tsx` | 8 |
| `DesignerStepper` | Function | `src/components/designer/DesignerStepper.tsx` | 8 |
| `DevStepper` | Function | `src/components/dev/DevStepper.tsx` | 8 |
| `DevDevView` | Function | `src/components/dev/DevDevView.tsx` | 14 |
| `DJStepper` | Function | `src/components/dj/DJStepper.tsx` | 8 |
| `BTPChantierStepper` | Function | `src/components/btp/BTPChantierStepper.tsx` | 15 |
| `CMStepper` | Function | `src/components/cm/CMStepper.tsx` | 10 |
| `BoutiqueStepper` | Function | `src/components/boutique/BoutiqueStepper.tsx` | 10 |
| `BookingStepper` | Function | `src/components/booking/BookingStepper.tsx` | 15 |
| `BookingStepSlot` | Function | `src/components/booking/BookingStepSlot.tsx` | 94 |
| `BookingCountdown` | Function | `src/components/booking/BookingCountdown.tsx` | 12 |
| `tick` | Function | `src/components/booking/BookingCountdown.tsx` | 18 |
| `StatusBadge` | Function | `src/components/admin/StatusBadge.tsx` | 52 |

## How to Explore

1. `gitnexus_context({name: "cn"})` — see callers and callees
2. `gitnexus_query({query: "ui"})` — find related execution flows
3. Read key files listed above for implementation details
