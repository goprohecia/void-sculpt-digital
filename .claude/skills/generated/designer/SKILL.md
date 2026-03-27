---
name: designer
description: "Skill for the Designer area of void-sculpt-digital. 12 symbols across 7 files."
---

# Designer

12 symbols | 7 files | Cohesion: 76%

## When to Use

- Working with code in `src/`
- Understanding how handleSubmit, handleSave, saveConfig work
- Modifying designer-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/designer/DesignerClientView.tsx` | DesignerClientView, handleValidate, handleRequestCorrections |
| `src/components/cm/CMClientView.tsx` | CMClientView, handleApprove, handleReject |
| `src/hooks/use-toast.ts` | genId, toast |
| `src/pages/Contact.tsx` | handleSubmit |
| `src/components/Newsletter.tsx` | handleSubmit |
| `src/pages/superadmin/SuperAdminFormules.tsx` | handleSave |
| `src/pages/admin/AdminIA.tsx` | saveConfig |

## Entry Points

Start here when exploring this area:

- **`handleSubmit`** (Function) — `src/components/Newsletter.tsx:14`
- **`handleSave`** (Function) — `src/pages/superadmin/SuperAdminFormules.tsx:106`
- **`saveConfig`** (Function) — `src/pages/admin/AdminIA.tsx:97`
- **`DesignerClientView`** (Function) — `src/components/designer/DesignerClientView.tsx:23`
- **`handleValidate`** (Function) — `src/components/designer/DesignerClientView.tsx:30`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `handleSubmit` | Function | `src/components/Newsletter.tsx` | 14 |
| `handleSave` | Function | `src/pages/superadmin/SuperAdminFormules.tsx` | 106 |
| `saveConfig` | Function | `src/pages/admin/AdminIA.tsx` | 97 |
| `DesignerClientView` | Function | `src/components/designer/DesignerClientView.tsx` | 23 |
| `handleValidate` | Function | `src/components/designer/DesignerClientView.tsx` | 30 |
| `handleRequestCorrections` | Function | `src/components/designer/DesignerClientView.tsx` | 35 |
| `CMClientView` | Function | `src/components/cm/CMClientView.tsx` | 23 |
| `handleApprove` | Function | `src/components/cm/CMClientView.tsx` | 32 |
| `handleReject` | Function | `src/components/cm/CMClientView.tsx` | 37 |
| `genId` | Function | `src/hooks/use-toast.ts` | 23 |
| `toast` | Function | `src/hooks/use-toast.ts` | 136 |
| `handleSubmit` | Function | `src/pages/Contact.tsx` | 64 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `DevClientView → GenId` | cross_community | 4 |
| `DevClientView → Dispatch` | cross_community | 4 |
| `AIContextButton → GenId` | cross_community | 4 |
| `AIContextButton → Dispatch` | cross_community | 4 |
| `DesignerClientView → GenId` | intra_community | 4 |
| `DesignerClientView → Dispatch` | cross_community | 4 |
| `CMClientView → GenId` | intra_community | 4 |
| `CMClientView → Dispatch` | cross_community | 4 |
| `AdminFournisseurs → GenId` | cross_community | 3 |
| `BookingPage → GenId` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Hooks | 1 calls |

## How to Explore

1. `gitnexus_context({name: "handleSubmit"})` — see callers and callees
2. `gitnexus_query({query: "designer"})` — find related execution flows
3. Read key files listed above for implementation details
