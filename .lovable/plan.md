

## Plan : Remplacer le logo MBA partout par le nouveau logo uploadé

### 1. Copier le nouveau logo

- Copier `user-uploads://Design_sans_titre_6.png` vers `src/assets/logo-mba.png` (écrase l'ancien)
- Copier aussi vers `public/pwa-192x192.png` et `public/pwa-512x512.png` (icônes PWA)
- Copier vers `public/favicon.ico` (ou `.png`) et mettre à jour `index.html` avec un `<link rel="icon">`

### 2. Aucun changement de code nécessaire pour les composants React

Les 17 fichiers qui importent `logo-mba.png` (Header, Footer, sidebars, login, signup, loading screen, hero, legal pages, demo tour, layouts) référencent tous `@/assets/logo-mba.png`. En écrasant ce fichier, tous les composants utiliseront automatiquement le nouveau logo sans modification de code.

### 3. Favicon

- Ajouter `<link rel="icon" href="/favicon.png" type="image/png">` dans `index.html`
- Copier le logo vers `public/favicon.png`

### 4. Edge functions (emails)

Les 10 edge functions utilisent un `LOGO_URL` pointant vers un storage externe (`logo-impartial.png`). Ce logo est hébergé en externe — il faudrait uploader le nouveau logo sur le storage et mettre à jour l'URL dans les 10 fonctions. Cependant, l'URL actuelle pointe vers un autre projet Supabase, donc on ne peut pas modifier le fichier distant. On peut néanmoins mettre à jour les fonctions pour pointer vers une nouvelle URL si le logo est uploadé dans le storage du projet actuel.

### Fichiers à modifier
- `src/assets/logo-mba.png` — remplacer par le nouveau logo
- `public/pwa-192x192.png` — remplacer par le nouveau logo
- `public/pwa-512x512.png` — remplacer par le nouveau logo  
- `public/favicon.png` — nouveau fichier
- `index.html` — ajouter lien favicon

