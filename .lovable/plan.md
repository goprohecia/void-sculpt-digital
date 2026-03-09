

## Plan: Harmonisation visuelle du back-office — Palette verte cohérente

### Problèmes identifiés
- Les KPIs utilisent 4 couleurs différentes (emerald, blue, violet, amber) — manque de cohérence
- Les tendances en `emerald-400` sont trop pâles sur fond blanc
- Les actions rapides utilisent blue/violet/emerald/amber au lieu d'une palette unifiée
- Les points d'activité et événements calendrier utilisent des couleurs disparates
- Les valeurs numériques manquent de contraste (text `text-xl` trop petit, couleurs trop claires)

### Changements

#### 1. `src/components/admin/DashboardKPI.tsx`
- Remplacer le `colorMap` par des **variations de vert** : vert foncé, vert moyen, vert clair, vert-menthe
- Augmenter la taille des valeurs (`text-2xl sm:text-3xl`)
- Trend : utiliser `text-emerald-600` au lieu de `text-emerald-400` pour lisibilité sur blanc
- Ajouter la couleur du texte de valeur en vert foncé pour le KPI principal

#### 2. `src/pages/admin/AdminDashboard.tsx`
- **KPIs** : passer tous les `iconColor` en variations de vert (`emerald` pour tous, ou utiliser un nouveau système de nuances)
- **Quick actions** : harmoniser les 4 icônes avec des teintes vertes (vert foncé, vert moyen, vert clair, menthe)
- **Dossiers récents** : icône section en vert au lieu de `blue-400`
- **Emails** : icône en vert au lieu de `violet-400`
- **Activité récente** : remplacer les couleurs de points (blue, green, yellow, violet, red) par des nuances de vert
- **Répartition clients** : garder vert pour clients, utiliser un vert très clair/gris-vert pour prospects au lieu d'amber
- **Calendrier** : dots en 3 nuances de vert (foncé, moyen, clair) au lieu de blue/amber/rose
- **Messages non lus** : déjà en primary (vert), OK

#### 3. `src/components/admin/StatusBadge.tsx`
- Remplacer les couleurs blue par des **teintes vertes** : `en_cours` → vert moyen, `envoyee` → vert clair, `normale` → vert, `en_revue` → vert clair, `a_venir` → vert menthe
- Garder rouge pour les statuts négatifs (annulé, en retard, refusé, urgente)
- Garder amber uniquement pour "en attente" / "haute" (avertissement)
- Le vert `termine/payee/accepte` reste tel quel

#### 4. `src/components/admin/AdminSidebar.tsx`
- Icônes de section (FolderOpen, etc.) : s'assurer qu'elles utilisent `text-primary` (vert) au lieu de couleurs variées

### Aucune modification fonctionnelle
Purement esthétique — même données, même logique, même routes.

