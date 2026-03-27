---
name: animations
description: "Skill for the Animations area of void-sculpt-digital. 5 symbols across 2 files."
---

# Animations

5 symbols | 2 files | Cohesion: 100%

## When to Use

- Working with code in `src/`
- Understanding how ScrollReveal, getEasing, HorizontalScrollSection work
- Modifying animations-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/animations/ScrollReveal.tsx` | createVariants, ScrollReveal, getEasing |
| `src/components/animations/HorizontalScrollSection.tsx` | HorizontalScrollSection, checkMobile |

## Entry Points

Start here when exploring this area:

- **`ScrollReveal`** (Function) — `src/components/animations/ScrollReveal.tsx:113`
- **`getEasing`** (Function) — `src/components/animations/ScrollReveal.tsx:136`
- **`HorizontalScrollSection`** (Function) — `src/components/animations/HorizontalScrollSection.tsx:11`
- **`checkMobile`** (Function) — `src/components/animations/HorizontalScrollSection.tsx:24`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `ScrollReveal` | Function | `src/components/animations/ScrollReveal.tsx` | 113 |
| `getEasing` | Function | `src/components/animations/ScrollReveal.tsx` | 136 |
| `HorizontalScrollSection` | Function | `src/components/animations/HorizontalScrollSection.tsx` | 11 |
| `checkMobile` | Function | `src/components/animations/HorizontalScrollSection.tsx` | 24 |
| `createVariants` | Function | `src/components/animations/ScrollReveal.tsx` | 34 |

## How to Explore

1. `gitnexus_context({name: "ScrollReveal"})` — see callers and callees
2. `gitnexus_query({query: "animations"})` — find related execution flows
3. Read key files listed above for implementation details
