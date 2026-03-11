

## Plan: Apply white/light theme to SectorPage.tsx

Only one file needs to change — `src/pages/secteurs/SectorPage.tsx` — since all sector pages (Garages, Boutique, BTP, etc.) use this shared component.

### Changes

**Hero section (lines 32-87)**
- Remove `bg-gradient-to-b from-violet-500/5` → no gradient overlay
- Image border: `border-white/10` → `border-gray-200`
- Remove violet glow div (line 82): `bg-gradient-to-tr from-violet-500/20...`
- Bottom separator: `via-white/10` → `via-gray-200`

**Use Cases cards (lines 100-114)**
- Card: `border-white/5 bg-white/[0.02] hover:border-white/10` → `border-gray-200 bg-gray-50 hover:border-gray-300`
- Icon container: `bg-violet-500/10` → `bg-[#22c55e]/10`
- Icon color: `text-violet-400` → `text-[#22c55e]`
- Card title: add `text-gray-900`
- Card description: `text-muted-foreground` → `text-gray-600`

**Modules chips (lines 130-137)**
- Chip: `border-white/5 bg-white/[0.02] hover:border-violet-500/30` → `border-gray-200 bg-gray-50 hover:border-[#22c55e]/30`
- Icon: `text-violet-400` → `text-[#22c55e]`
- Text: add `text-gray-900`

**CTA section (lines 142-167)**
- Button: replace violet gradient with green → `from-[#22c55e] to-[#16a34a]`
- Button text/arrow: `text-background` → `text-gray-900`
- Description: add `text-gray-600`

**Section headings throughout**
- Add `text-gray-900` to h2 elements
- Subtitle labels: `text-muted-foreground` → `text-gray-500`

### Files to modify
1. `src/pages/secteurs/SectorPage.tsx`

