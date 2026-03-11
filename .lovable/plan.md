

## Plan : Responsive mobile native-like + PWA avec logo MBA

### Contexte
- Pas de PWA configurée actuellement (pas de `vite-plugin-pwa`, pas de manifest)
- Le sidebar utilise déjà un Sheet mobile via le composant `sidebar.tsx` (breakpoint 768px)
- Les layouts admin/client/employee ont des paddings et headers pensés desktop (`px-8`, `p-7`, `h-16`)
- Le logo MBA existe déjà : `src/assets/logo-mba.png`

### 1. Installer et configurer PWA avec le logo MBA

- Installer `vite-plugin-pwa`
- Configurer dans `vite.config.ts` avec un manifest incluant :
  - `name`: "My Business Assistant"
  - `short_name`: "MBA"
  - `theme_color`: `#14532d`
  - `background_color`: `#ffffff`
  - `display`: "standalone"
  - `icons` : Créer des icônes PWA (192x192, 512x512) à partir du logo MBA dans `public/`
  - `navigateFallbackDenylist: [/^\/~oauth/]`
- Ajouter les meta tags PWA dans `index.html` :
  - `<meta name="apple-mobile-web-app-capable" content="yes">`
  - `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
  - `<meta name="theme-color" content="#14532d">`
  - `<link rel="apple-touch-icon" href="/pwa-192x192.png">`

### 2. Optimiser les layouts pour le mobile (rendu natif)

**AdminLayout, ClientLayout, EmployeeLayout, SuperAdminLayout** — appliquer les mêmes ajustements :

- **Header mobile** : Réduire la hauteur (`h-14` au lieu de `h-16`), padding réduit (`px-4` au lieu de `px-8`), afficher le logo MBA centré sur mobile
- **Main content** : `p-4 md:p-7` pour des marges adaptées mobile
- **Bottom navigation bar mobile** : Ajouter une barre de navigation fixe en bas (style app native) avec les 4-5 modules principaux (Dashboard, Clients, Messages, Support, Paramètres) visible uniquement sur mobile (`md:hidden`), avec le sidebar classique masqué par défaut
- **Safe areas** : Ajouter `env(safe-area-inset-*)` pour les appareils avec encoche

### 3. Barre de navigation mobile (bottom tab bar)

Créer un composant `MobileBottomNav.tsx` :
- Position fixe en bas, fond blanc, bordure top, shadow
- 4-5 icônes avec labels courts
- Indicateur actif (couleur verte `#22c55e`)
- Utilise `env(safe-area-inset-bottom)` pour le padding bas
- Intégré dans chaque layout avec `className="md:hidden"`

### 4. Améliorations tactiles

- Augmenter les zones tactiles des boutons sidebar (min 44px)
- Ajouter `touch-action: manipulation` sur les éléments interactifs
- Viewport meta déjà présent avec `width=device-width`

### Fichiers à modifier/créer
- `vite.config.ts` — config PWA
- `index.html` — meta tags PWA + apple icons
- `public/pwa-192x192.png`, `public/pwa-512x512.png` — icônes (copie du logo MBA)
- `src/components/admin/MobileBottomNav.tsx` — nouveau composant
- `src/components/admin/AdminLayout.tsx` — responsive mobile
- `src/components/admin/ClientLayout.tsx` — responsive mobile
- `src/components/admin/EmployeeLayout.tsx` — responsive mobile
- `src/components/admin/SuperAdminLayout.tsx` — responsive mobile

