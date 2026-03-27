---
name: nettoyage
description: "Skill for the Nettoyage area of void-sculpt-digital. 5 symbols across 2 files."
---

# Nettoyage

5 symbols | 2 files | Cohesion: 100%

## When to Use

- Working with code in `src/`
- Understanding how NettoyageAgentView, toggleCheck, handleTerminer work
- Modifying nettoyage-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/nettoyage/NettoyageAgentView.tsx` | NettoyageAgentView, toggleCheck, handleTerminer |
| `src/components/nettoyage/NettoyageClientView.tsx` | NettoyageClientView, handleValider |

## Entry Points

Start here when exploring this area:

- **`NettoyageAgentView`** (Function) — `src/components/nettoyage/NettoyageAgentView.tsx:11`
- **`toggleCheck`** (Function) — `src/components/nettoyage/NettoyageAgentView.tsx:26`
- **`handleTerminer`** (Function) — `src/components/nettoyage/NettoyageAgentView.tsx:33`
- **`NettoyageClientView`** (Function) — `src/components/nettoyage/NettoyageClientView.tsx:9`
- **`handleValider`** (Function) — `src/components/nettoyage/NettoyageClientView.tsx:20`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `NettoyageAgentView` | Function | `src/components/nettoyage/NettoyageAgentView.tsx` | 11 |
| `toggleCheck` | Function | `src/components/nettoyage/NettoyageAgentView.tsx` | 26 |
| `handleTerminer` | Function | `src/components/nettoyage/NettoyageAgentView.tsx` | 33 |
| `NettoyageClientView` | Function | `src/components/nettoyage/NettoyageClientView.tsx` | 9 |
| `handleValider` | Function | `src/components/nettoyage/NettoyageClientView.tsx` | 20 |

## How to Explore

1. `gitnexus_context({name: "NettoyageAgentView"})` — see callers and callees
2. `gitnexus_query({query: "nettoyage"})` — find related execution flows
3. Read key files listed above for implementation details
