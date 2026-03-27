---
name: dossier
description: "Skill for the Dossier area of void-sculpt-digital. 9 symbols across 4 files."
---

# Dossier

9 symbols | 4 files | Cohesion: 100%

## When to Use

- Working with code in `src/`
- Understanding how DossierRDV, openEdit, statutBadge work
- Modifying dossier-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/dossier/DossierRDV.tsx` | DossierRDV, openEdit, statutBadge |
| `src/components/dossier/DossierPaiements.tsx` | DossierPaiements, statutIcon |
| `src/components/dossier/DossierMesures.tsx` | DossierMesures, openEdit |
| `src/components/dossier/DossierMessages.tsx` | DossierMessages, send |

## Entry Points

Start here when exploring this area:

- **`DossierRDV`** (Function) — `src/components/dossier/DossierRDV.tsx:23`
- **`openEdit`** (Function) — `src/components/dossier/DossierRDV.tsx:41`
- **`statutBadge`** (Function) — `src/components/dossier/DossierRDV.tsx:58`
- **`DossierPaiements`** (Function) — `src/components/dossier/DossierPaiements.tsx:14`
- **`statutIcon`** (Function) — `src/components/dossier/DossierPaiements.tsx:18`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `DossierRDV` | Function | `src/components/dossier/DossierRDV.tsx` | 23 |
| `openEdit` | Function | `src/components/dossier/DossierRDV.tsx` | 41 |
| `statutBadge` | Function | `src/components/dossier/DossierRDV.tsx` | 58 |
| `DossierPaiements` | Function | `src/components/dossier/DossierPaiements.tsx` | 14 |
| `statutIcon` | Function | `src/components/dossier/DossierPaiements.tsx` | 18 |
| `DossierMesures` | Function | `src/components/dossier/DossierMesures.tsx` | 48 |
| `openEdit` | Function | `src/components/dossier/DossierMesures.tsx` | 68 |
| `DossierMessages` | Function | `src/components/dossier/DossierMessages.tsx` | 18 |
| `send` | Function | `src/components/dossier/DossierMessages.tsx` | 22 |

## How to Explore

1. `gitnexus_context({name: "DossierRDV"})` — see callers and callees
2. `gitnexus_query({query: "dossier"})` — find related execution flows
3. Read key files listed above for implementation details
