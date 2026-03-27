---
name: coiffure
description: "Skill for the Coiffure area of void-sculpt-digital. 6 symbols across 3 files."
---

# Coiffure

6 symbols | 3 files | Cohesion: 100%

## When to Use

- Working with code in `src/`
- Understanding how CoiffurePraticienView, advanceRdv, CoiffureDashboard work
- Modifying coiffure-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/coiffure/CoiffurePraticienView.tsx` | CoiffurePraticienView, advanceRdv |
| `src/components/coiffure/CoiffureDashboard.tsx` | CoiffureDashboard, advanceRdv |
| `src/components/coiffure/CoiffureClientView.tsx` | CoiffureClientView, payAcompte |

## Entry Points

Start here when exploring this area:

- **`CoiffurePraticienView`** (Function) — `src/components/coiffure/CoiffurePraticienView.tsx:20`
- **`advanceRdv`** (Function) — `src/components/coiffure/CoiffurePraticienView.tsx:27`
- **`CoiffureDashboard`** (Function) — `src/components/coiffure/CoiffureDashboard.tsx:17`
- **`advanceRdv`** (Function) — `src/components/coiffure/CoiffureDashboard.tsx:28`
- **`CoiffureClientView`** (Function) — `src/components/coiffure/CoiffureClientView.tsx:19`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `CoiffurePraticienView` | Function | `src/components/coiffure/CoiffurePraticienView.tsx` | 20 |
| `advanceRdv` | Function | `src/components/coiffure/CoiffurePraticienView.tsx` | 27 |
| `CoiffureDashboard` | Function | `src/components/coiffure/CoiffureDashboard.tsx` | 17 |
| `advanceRdv` | Function | `src/components/coiffure/CoiffureDashboard.tsx` | 28 |
| `CoiffureClientView` | Function | `src/components/coiffure/CoiffureClientView.tsx` | 19 |
| `payAcompte` | Function | `src/components/coiffure/CoiffureClientView.tsx` | 75 |

## How to Explore

1. `gitnexus_context({name: "CoiffurePraticienView"})` — see callers and callees
2. `gitnexus_query({query: "coiffure"})` — find related execution flows
3. Read key files listed above for implementation details
