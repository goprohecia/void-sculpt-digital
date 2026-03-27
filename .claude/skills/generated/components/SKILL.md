---
name: components
description: "Skill for the Components area of void-sculpt-digital. 35 symbols across 8 files."
---

# Components

35 symbols | 8 files | Cohesion: 92%

## When to Use

- Working with code in `src/`
- Understanding how createShootingStar, drawBackground, drawNebula work
- Modifying components-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/SpaceBackground.tsx` | createShootingStar, drawBackground, drawNebula, drawGalaxy, drawAurora (+5) |
| `src/components/FloatingParticles.tsx` | prefersReducedMotion, FloatingParticles, resize, createParticles, handleResize (+5) |
| `src/components/CookieBanner.tsx` | CookieBanner, closeBanner, savePreferences, rejectAll |
| `src/components/Testimonials.tsx` | Testimonials, onSelect, scrollNext |
| `src/components/SignaturePad.tsx` | getPos, startDraw, draw |
| `src/components/AnimatedRoutes.tsx` | AnimatedRoutes, getRouteKey |
| `src/components/Header.tsx` | Header, isActive |
| `src/hooks/use-scroll-to-top.tsx` | useScrollToTop |

## Entry Points

Start here when exploring this area:

- **`createShootingStar`** (Function) — `src/components/SpaceBackground.tsx:185`
- **`drawBackground`** (Function) — `src/components/SpaceBackground.tsx:197`
- **`drawNebula`** (Function) — `src/components/SpaceBackground.tsx:230`
- **`drawGalaxy`** (Function) — `src/components/SpaceBackground.tsx:248`
- **`drawAurora`** (Function) — `src/components/SpaceBackground.tsx:286`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `createShootingStar` | Function | `src/components/SpaceBackground.tsx` | 185 |
| `drawBackground` | Function | `src/components/SpaceBackground.tsx` | 197 |
| `drawNebula` | Function | `src/components/SpaceBackground.tsx` | 230 |
| `drawGalaxy` | Function | `src/components/SpaceBackground.tsx` | 248 |
| `drawAurora` | Function | `src/components/SpaceBackground.tsx` | 286 |
| `animate` | Function | `src/components/SpaceBackground.tsx` | 311 |
| `FloatingParticles` | Function | `src/components/FloatingParticles.tsx` | 24 |
| `resize` | Function | `src/components/FloatingParticles.tsx` | 52 |
| `createParticles` | Function | `src/components/FloatingParticles.tsx` | 57 |
| `handleResize` | Function | `src/components/FloatingParticles.tsx` | 148 |
| `drawParticle` | Function | `src/components/FloatingParticles.tsx` | 81 |
| `connectParticles` | Function | `src/components/FloatingParticles.tsx` | 96 |
| `animate` | Function | `src/components/FloatingParticles.tsx` | 122 |
| `handleVisibilityChange` | Function | `src/components/FloatingParticles.tsx` | 163 |
| `SpaceBackground` | Function | `src/components/SpaceBackground.tsx` | 53 |
| `checkDark` | Function | `src/components/SpaceBackground.tsx` | 65 |
| `resizeCanvas` | Function | `src/components/SpaceBackground.tsx` | 94 |
| `initElements` | Function | `src/components/SpaceBackground.tsx` | 108 |
| `CookieBanner` | Function | `src/components/CookieBanner.tsx` | 11 |
| `closeBanner` | Function | `src/components/CookieBanner.tsx` | 30 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `FloatingParticles → IsMobile` | cross_community | 4 |
| `HandleVisibilityChange → IsMobile` | intra_community | 4 |
| `SpaceBackground → InitElements` | intra_community | 3 |
| `SpaceBackground → DrawBackground` | cross_community | 3 |
| `SpaceBackground → DrawNebula` | cross_community | 3 |
| `SpaceBackground → DrawGalaxy` | cross_community | 3 |
| `SpaceBackground → DrawAurora` | cross_community | 3 |
| `HandleResize → IsMobile` | cross_community | 3 |
| `CookieBanner → CloseBanner` | intra_community | 3 |

## How to Explore

1. `gitnexus_context({name: "createShootingStar"})` — see callers and callees
2. `gitnexus_query({query: "components"})` — find related execution flows
3. Read key files listed above for implementation details
