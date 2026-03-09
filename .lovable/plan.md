

## Plan: Refonte UI — Thème clair avec accents verts (style Donezo)

### Objectif
Transformer l'interface admin d'un thème sombre glassmorphism vers un thème clair, fond blanc, avec des accents verts — fidèle à la capture partagée. Aucune modification fonctionnelle.

### Fichiers à modifier

#### 1. `src/index.css` — Variables CSS du thème
Ajouter un jeu de variables CSS pour le mode admin clair :
- `--background`: blanc (`0 0% 100%`)
- `--foreground`: noir/gris foncé (`220 15% 15%`)
- `--card`: blanc (`0 0% 100%`)
- `--primary`: vert (`145 65% 42%`) — inspiré du vert Donezo
- `--muted`: gris clair (`220 14% 96%`)
- `--border`: gris subtil (`220 13% 91%`)
- Refactorer les `.glass-card` pour que dans le contexte admin clair, ils deviennent des cartes blanches avec `border` légère et `box-shadow` douce (pas de blur/glassmorphism)

#### 2. `src/components/admin/AdminLayout.tsx`
- Ajouter une classe racine (ex: `admin-light-theme`) sur le wrapper principal pour scoper le thème clair à l'admin uniquement
- Fond blanc au lieu de `bg-background` sombre
- Header : fond blanc, bordure légère grise, pas de glassmorphism

#### 3. `src/components/admin/AdminSidebar.tsx`
- Fond blanc avec bordure grise subtile à droite
- Liens actifs : fond vert clair avec texte vert foncé
- Textes en gris foncé/noir
- Footer : avatar et texte en couleurs sombres

#### 4. `src/components/admin/DashboardKPI.tsx`
- Cartes blanches avec bordure légère et ombre douce
- Icônes dans des cercles colorés (vert pour le premier KPI, comme la capture)
- Textes en noir, sous-titres en gris

#### 5. `src/pages/admin/AdminDashboard.tsx`
- Remplacer les classes `glass-card` par des classes de cartes blanches avec bordures
- Couleurs des accents : vert au lieu de bleu/violet
- Table des dossiers : fond blanc, lignes séparées par des bordures fines
- Calendrier : style clair
- Sparkline/graphiques : teintes vertes

#### 6. `src/components/admin/StatusBadge.tsx`
- Adapter les badges pour contraste sur fond blanc

### Approche technique
- Créer une classe `.admin-light-theme` qui override les variables CSS au niveau du wrapper admin, permettant de garder le thème sombre pour le site vitrine
- Les composants existants (`glass-card`, etc.) s'adapteront via les variables CSS sans changer leur markup
- Le site public (Index, Contact, etc.) reste inchangé en mode sombre

### Ce qui ne change PAS
- Aucune fonctionnalité
- Aucune route
- Le site vitrine public garde son thème sombre actuel

