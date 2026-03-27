---
name: traiteur
description: "Skill for the Traiteur area of void-sculpt-digital. 5 symbols across 2 files."
---

# Traiteur

5 symbols | 2 files | Cohesion: 100%

## When to Use

- Working with code in `src/`
- Understanding how TraiteurClientView, togglePosteValidation, updateQuantite work
- Modifying traiteur-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/traiteur/TraiteurClientView.tsx` | TraiteurClientView, togglePosteValidation, updateQuantite |
| `src/components/traiteur/TraiteurEquipeView.tsx` | TraiteurEquipeView, toggleCheck |

## Entry Points

Start here when exploring this area:

- **`TraiteurClientView`** (Function) — `src/components/traiteur/TraiteurClientView.tsx:10`
- **`togglePosteValidation`** (Function) — `src/components/traiteur/TraiteurClientView.tsx:19`
- **`updateQuantite`** (Function) — `src/components/traiteur/TraiteurClientView.tsx:23`
- **`TraiteurEquipeView`** (Function) — `src/components/traiteur/TraiteurEquipeView.tsx:11`
- **`toggleCheck`** (Function) — `src/components/traiteur/TraiteurEquipeView.tsx:21`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `TraiteurClientView` | Function | `src/components/traiteur/TraiteurClientView.tsx` | 10 |
| `togglePosteValidation` | Function | `src/components/traiteur/TraiteurClientView.tsx` | 19 |
| `updateQuantite` | Function | `src/components/traiteur/TraiteurClientView.tsx` | 23 |
| `TraiteurEquipeView` | Function | `src/components/traiteur/TraiteurEquipeView.tsx` | 11 |
| `toggleCheck` | Function | `src/components/traiteur/TraiteurEquipeView.tsx` | 21 |

## How to Explore

1. `gitnexus_context({name: "TraiteurClientView"})` — see callers and callees
2. `gitnexus_query({query: "traiteur"})` — find related execution flows
3. Read key files listed above for implementation details
