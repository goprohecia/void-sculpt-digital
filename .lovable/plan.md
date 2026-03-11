

## Plan: White theme for Contact, Fonctionnalites, Demo + logo replacement

### Changes needed

**1. Contact.tsx — White theme**
- Replace dark glass styling with white bg, gray borders, light inputs
- Hero: `text-gray-900` headings, `text-gray-600` subtitles
- Cards: `bg-gray-50 border border-gray-200` instead of `bg-white/[0.02] border-white/5`
- Form: `bg-gray-50` inputs with `border-gray-200`, dark text
- Submit button: green gradient (already good)
- Calendly section: same light treatment

**2. Fonctionnalites.tsx — White theme + real screenshots**
- Hero: white bg, dark text
- Module sections: remove colored gradient backgrounds, use `bg-white` / alternating `bg-gray-50`
- Cards/screenshots: `border-gray-200 shadow-lg` instead of `border-white/10`
- Replace violet accent colors with green (`text-[#22c55e]`) for all module icons and checkmarks
- Bottom CTA: `bg-gray-50` card with dark text instead of glass
- Screenshots already import from `@/assets/screenshots/` — these are the real app screenshots, keep them

**3. DemoTour.tsx — White theme + real screenshots**
- Start screen: `bg-white`, dark text, green accents instead of violet
- Top bar: `bg-white border-gray-200` instead of dark glass
- Step nav buttons: green active states instead of violet
- Icon containers: `bg-[#22c55e]/10` with `text-[#22c55e]` instead of violet
- Highlight callout: green tint instead of violet
- Progress bar: green gradient
- Browser chrome: light gray (`bg-gray-100`) instead of dark glass
- Screenshot border: `border-gray-200` instead of `border-white/10`
- Navigation buttons: dark text on white, green primary button
- Screenshots already use real app images from `@/assets/screenshots/`

**4. Logo replacement across the site**
- Header.tsx: already uses `logo-hero.png` — replace with `logo-mba.png`
- Footer.tsx: add logo image import (`logo-mba.png`) in brand section
- DemoTour.tsx: add logo in top bar
- Legal pages (MentionsLegales, PolitiqueConfidentialite): replace `logo-hero.png` with `logo-mba.png`

### Files to modify
1. `src/pages/Contact.tsx`
2. `src/pages/Fonctionnalites.tsx`
3. `src/pages/DemoTour.tsx`
4. `src/components/Header.tsx` — swap logo import
5. `src/components/Footer.tsx` — add logo image
6. `src/pages/legal/MentionsLegales.tsx` — swap logo
7. `src/pages/legal/PolitiqueConfidentialite.tsx` — swap logo

