

# Animations Framer Motion et responsive mobile pour le back-office admin

## 1. Animations d'entree sur les pages admin

### Approche
Creer un composant reutilisable `AdminPageTransition` qui encapsule le contenu de chaque page admin avec des animations fluides. Contrairement au site vitrine qui utilise des overlays lourds (`PageTransition3D`), les transitions admin seront plus legeres et professionnelles (fade + slide subtil).

### Composant `AdminPageTransition`
- Animation d'entree : fade-in + leger deplacement vertical (y: 20px vers 0) + blur subtil
- Duree : 0.4s avec easing premium
- Pas d'overlay de type "rideau" pour garder une navigation instantanee entre rubriques

### Animations des elements internes
- **KPI cards** : animation staggered (apparition en cascade avec 80ms de delai entre chaque carte)
- **Tableaux** : fade-in des lignes avec un leger delai progressif
- **Glass-cards** : apparition avec scale subtil (0.98 vers 1) + fade
- **Graphiques Recharts** : animation native deja en place, pas de modification necessaire

### Pages concernees (7 pages)
- `AdminDashboard.tsx` : KPIs en stagger, sparkline + activites en cascade
- `AdminClients.tsx` : header + filtres, puis tableau
- `AdminDossiers.tsx` : header + filtres, puis tableau
- `AdminMessaging.tsx` : liste conversations + zone detail
- `AdminBilling.tsx` : resume financier en stagger, puis tableau
- `AdminReminders.tsx` : prochaines relances + liste
- `AdminAnalytics.tsx` : KPIs en stagger, puis graphiques en cascade

---

## 2. Amelioration responsive mobile/tablette

### Problemes actuels identifies
- La messagerie utilise deja un systeme show/hide pour mobile, mais peut etre ameliore
- Les tableaux ont des colonnes `hidden md:table-cell` mais restent larges sur petits ecrans
- Les graphiques Recharts n'ont pas de tailles adaptees mobile
- Les filtres s'empilent deja sur mobile (`flex-col sm:flex-row`)
- Le header admin pourrait afficher plus d'informations utiles sur mobile

### Ameliorations prevues

**AdminLayout (header mobile)**
- Ajouter le nom de la rubrique active dans le header sur mobile
- Rendre le badge "Mode demo" plus compact sur mobile

**AdminDashboard**
- Grille KPI : passer de `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` (deja bon) - conserver
- Sparkline + activites : `grid-cols-1 lg:grid-cols-3` (deja bon) - conserver
- Tableau dossiers recents : ajouter un scroll horizontal plus visible avec indicateur

**AdminClients**
- Modal detail client : utiliser un `Drawer` (vaul, deja installe) en bottom-sheet sur mobile au lieu du modal centre
- Tableau : ameliorer la densite sur mobile

**AdminDossiers**
- Tableau : cartes empilees sur mobile (`< sm`) au lieu du tableau classique

**AdminMessaging**
- Deja adapte avec le systeme `showList` - ajouter une animation de transition entre liste et detail
- Ameliorer la hauteur sur mobile (utiliser `dvh` au lieu de `vh`)

**AdminBilling**
- Resume financier : grille `grid-cols-1 sm:grid-cols-3` (deja bon) - conserver
- Tableau : ameliorer l'affichage des montants sur petit ecran

**AdminReminders**
- Inverser l'ordre sur mobile : afficher d'abord les prochaines relances (partie importante) puis la liste filtrable

**AdminAnalytics**
- Graphiques : reduire la hauteur de `h-72` a `h-48` sur mobile
- Tableau tendances : rendre scrollable horizontalement avec un indicateur visuel
- Ajuster les tailles de police des axes Recharts pour mobile

---

## Details techniques

### Nouveaux fichiers
```text
src/components/admin/AdminPageTransition.tsx   -- Composant animation de page admin
```

### Fichiers modifies
```text
src/components/admin/AdminLayout.tsx           -- Header responsive ameliore
src/components/admin/DashboardKPI.tsx           -- Animation stagger integree
src/pages/admin/AdminDashboard.tsx              -- Animations + responsive
src/pages/admin/AdminClients.tsx                -- Drawer mobile + animations
src/pages/admin/AdminDossiers.tsx               -- Cards mobile + animations
src/pages/admin/AdminMessaging.tsx              -- Transition animation + dvh
src/pages/admin/AdminBilling.tsx                -- Animations + responsive
src/pages/admin/AdminReminders.tsx              -- Ordre mobile + animations
src/pages/admin/AdminAnalytics.tsx              -- Graphiques responsive + animations
```

### Pattern d'animation utilise dans chaque page

```text
<AdminPageTransition>
  <motion.div variants={staggerContainer}>
    <motion.div variants={staggerItem}>  -- titre
    <motion.div variants={staggerItem}>  -- filtres
    <motion.div variants={staggerItem}>  -- contenu principal
  </motion.div>
</AdminPageTransition>
```

### Librairies utilisees (toutes deja installees)
- `framer-motion` : animations d'entree et stagger
- `vaul` (Drawer) : bottom-sheet mobile pour les modales
- Composants Shadcn existants
- `useIsMobile()` hook existant pour la detection mobile

