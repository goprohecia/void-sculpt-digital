

## Plan: Alternating green/white sections + Enterprise price update to 500€

### Current situation
The entire public website has a dark green background (`--background: 150 60% 10%`) for all sections, making everything blend together. The user wants alternating backgrounds: green section → white section → green section → white section, with text/card colors adapting logically for contrast.

### Section order and proposed background alternation

| # | Section | Background | Text/Cards adaptation |
|---|---------|-----------|----------------------|
| 1 | HeroPremium | **Dark green** (keep) | White text (keep) |
| 2 | ProofStrip | **Dark green** (keep, part of hero) | Green icons, white text (keep) |
| 3 | ConceptSection | **White** (#ffffff) | Dark text, cards with light gray bg + green borders |
| 4 | ServicesSection (Secteurs) | **Dark green** | White text, dark glass cards (keep) |
| 5 | RealisationsSection (Fonctionnalités) | **White** | Dark text, white cards with subtle borders |
| 6 | OffresSection | **Dark green** | Keep current style (glass cards on dark) |
| 7 | CiblesSection | **White** | Dark text, light cards |
| 8 | MethodeSection | **Dark green** | White text, dark cards |
| 9 | ArgumentsSection | **White** | Dark text, light borders |
| 10 | FAQ | **Dark green** | White text, glass cards |
| 11 | CTAFinal | **White** | Dark text, green accents |

### Adaptation rules for white sections
- Section wrapper: `bg-white`
- Headings: dark text (`text-gray-900`)
- Subtitle text: `text-gray-600` instead of `text-muted-foreground`
- Cards: `bg-[#f7f8f5]` or `bg-gray-50` with `border-gray-200`, no glass effects
- Green accents (`text-[#22c55e]`) remain for icons and highlights
- `text-gradient-neon` stays green (works on both backgrounds)

### Enterprise price update: 400 → 500€
Files to update:
- `src/components/sections/OffresSection.tsx`: `priceMonthly: 500`, `priceAnnual: 4200` (500×10 = 5000 or 500×12×0.83 = ~4980, keeping -2 months logic → 500×10 = 5000)
- `src/contexts/DemoPlanContext.tsx`: `enterprise: 500`
- `src/hooks/use-subscription.ts`: `enterprise: { ...price: 500 }`
- `src/pages/client/ClientUpgrade.tsx`: uses `DEFAULT_PLAN_PRICES` so auto-updates

### Files to modify
1. **ConceptSection.tsx** — white bg, dark text, light cards
2. **RealisationsSection.tsx** — white bg, dark text, light cards
3. **CiblesSection.tsx** — white bg, dark text, light cards
4. **ArgumentsSection.tsx** — white bg, dark text, light borders
5. **CTAFinal.tsx** — white bg, dark text
6. **ServicesSection.tsx** — keep dark, ensure contrast
7. **MethodeSection.tsx** — keep dark, ensure contrast
8. **FAQ.tsx** — keep dark green
9. **OffresSection.tsx** — keep dark, update Enterprise price to 500€
10. **DemoPlanContext.tsx** — enterprise price → 500
11. **use-subscription.ts** — enterprise price → 500

