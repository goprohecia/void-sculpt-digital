---
name: superadmin
description: "Skill for the Superadmin area of void-sculpt-digital. 11 symbols across 2 files."
---

# Superadmin

11 symbols | 2 files | Cohesion: 87%

## When to Use

- Working with code in `src/`
- Understanding how SuperAdminFormules, getModulesArray, toggleModule work
- Modifying superadmin-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/pages/superadmin/SuperAdminFormules.tsx` | SuperAdminFormules, getModulesArray, toggleModule, toggleSectorModule, moveSectorModule (+2) |
| `src/pages/superadmin/SuperAdminSecteurs.tsx` | SuperAdminSecteurs, getOverride, updateOverride, removeOverride |

## Entry Points

Start here when exploring this area:

- **`SuperAdminFormules`** (Function) — `src/pages/superadmin/SuperAdminFormules.tsx:31`
- **`getModulesArray`** (Function) — `src/pages/superadmin/SuperAdminFormules.tsx:49`
- **`toggleModule`** (Function) — `src/pages/superadmin/SuperAdminFormules.tsx:54`
- **`toggleSectorModule`** (Function) — `src/pages/superadmin/SuperAdminFormules.tsx:66`
- **`moveSectorModule`** (Function) — `src/pages/superadmin/SuperAdminFormules.tsx:75`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `SuperAdminFormules` | Function | `src/pages/superadmin/SuperAdminFormules.tsx` | 31 |
| `getModulesArray` | Function | `src/pages/superadmin/SuperAdminFormules.tsx` | 49 |
| `toggleModule` | Function | `src/pages/superadmin/SuperAdminFormules.tsx` | 54 |
| `toggleSectorModule` | Function | `src/pages/superadmin/SuperAdminFormules.tsx` | 66 |
| `moveSectorModule` | Function | `src/pages/superadmin/SuperAdminFormules.tsx` | 75 |
| `updateOverrideLabel` | Function | `src/pages/superadmin/SuperAdminFormules.tsx` | 85 |
| `toggleOverrideHidden` | Function | `src/pages/superadmin/SuperAdminFormules.tsx` | 93 |
| `SuperAdminSecteurs` | Function | `src/pages/superadmin/SuperAdminSecteurs.tsx` | 97 |
| `getOverride` | Function | `src/pages/superadmin/SuperAdminSecteurs.tsx` | 124 |
| `updateOverride` | Function | `src/pages/superadmin/SuperAdminSecteurs.tsx` | 128 |
| `removeOverride` | Function | `src/pages/superadmin/SuperAdminSecteurs.tsx` | 138 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `SuperAdminFormules → Dispatch` | cross_community | 3 |
| `SuperAdminFormules → GetModulesArray` | intra_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Admin | 3 calls |

## How to Explore

1. `gitnexus_context({name: "SuperAdminFormules"})` — see callers and callees
2. `gitnexus_query({query: "superadmin"})` — find related execution flows
3. Read key files listed above for implementation details
