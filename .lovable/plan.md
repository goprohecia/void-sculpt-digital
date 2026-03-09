

## Plan : Refonte UI complète — Style Donezo + Typographie unifiée + Lisibilité maximale

### Analyse de l'image de référence

L'image "Donezo" révèle :
- **Typographie** : Police sans-serif moderne (ressemble à Inter/SF Pro), hiérarchie claire (titres larges, sous-titres légers, labels en capitales réduites)
- **Chiffres** : Extra-larges (56px+), très gras, couleur foncée (noir pur sur blanc)
- **Espacement** : Généreux, beaucoup de respiration (padding 20-32px dans les cards)
- **Couleurs** : Palette verte monochrome (vert foncé #2F7454, vert moyen #4ADE80, vert clair #D1FAE5) + gris neutres
- **Cards** : Fond blanc pur, ombres douces (0 2px 8px rgba(0,0,0,0.06)), coins ronds (12-16px)
- **Team section** : Avatars avec noms en dessous, statut en badge coloré
- **Graphiques** : Barres vertes avec textures hachurées, circular progress vert
- **Boutons** : Verts solides (#16A34A), texte blanc, corners ronds (8px)
- **Filtres/Tags** : Fond clair (bg-muted), texte sombre, active = vert avec texte blanc

### Problèmes identifiés actuellement

1. **Typographie** : Montserrat utilisée partout, pas assez de contraste dans les graisses
2. **Chiffres/KPIs** : Trop petits (`text-2xl`), pas assez gras
3. **Couleurs** : Multiples teintes vertes incohérentes, manque de hiérarchie
4. **Textes sur fond clair** : Labels gris trop clairs (`text-muted-foreground` = `220 10% 46%`), peu lisible
5. **Boutons** : Transparents/ghost non visibles sur fond blanc (ex: filtres, "Ajouter")
6. **Tableaux** : Références/clients en `text-muted-foreground` → invisibles
7. **Dialogs/Modals** : Fond noir (`bg-background`), pas adapté au thème clair
8. **Status badges** : Certains encore bleus/violets au lieu de verts
9. **Filtres** : Boutons en `.glass-button` (transparent) → illisibles sur blanc
10. **Team section** : Absente du dashboard admin

### Changements requis

#### 1. **Typographie unifiée** (`src/index.css`)
- Modifier la stack de fonts : remplacer Montserrat par **Inter** (plus proche de Donezo)
- Import Google Fonts : `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');`
- Définir les classes typographiques :
  ```css
  .admin-light-theme {
    --font-sans: 'Inter', sans-serif;
  }
  .admin-light-theme .dashboard-number {
    font-size: 2.5rem; /* 40px */
    font-weight: 800;
    line-height: 1;
    color: hsl(220, 15%, 10%); /* Noir pur */
  }
  .admin-light-theme .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: hsl(220, 15%, 15%);
  }
  ```

#### 2. **Variables couleurs affinées** (`src/index.css`)
- Redéfinir `--muted-foreground` plus foncé : `220 15% 30%` (au lieu de `46%`)
- Créer des variables dédiées :
  ```css
  .admin-light-theme {
    --text-primary: 220 15% 10%;
    --text-secondary: 220 15% 30%;
    --text-tertiary: 220 10% 50%;
    --green-dark: 145 60% 28%;
    --green-medium: 145 63% 42%;
    --green-light: 145 60% 92%;
  }
  ```

#### 3. **Composants UI — Boutons** (`src/components/ui/button.tsx`)
- Renforcer le variant `default` pour fond vert solide :
  ```tsx
  default: "bg-primary text-white hover:bg-primary/90 font-semibold shadow-sm"
  ```
- Variant `outline` pour filtres actifs :
  ```tsx
  outline: "border-2 border-primary bg-white text-primary hover:bg-primary hover:text-white font-medium"
  ```
- Variant `ghost` pour filtres inactifs :
  ```tsx
  ghost: "bg-muted/50 text-foreground hover:bg-muted font-medium"
  ```

#### 4. **Composants UI — Inputs** (`src/components/ui/input.tsx`)
- Retirer `.glass-input`, utiliser styles solides :
  ```tsx
  className="border-2 border-border bg-white text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
  ```

#### 5. **Composants UI — Tabs** (`src/components/ui/tabs.tsx`)
- Active tab : fond blanc, ombre légère
  ```tsx
  data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:shadow-sm
  ```

#### 6. **Composants UI — Dialog** (`src/components/ui/dialog.tsx`)
- Remplacer fond noir par blanc :
  ```tsx
  className="bg-white border border-border shadow-2xl"
  ```
- Overlay plus léger :
  ```tsx
  className="bg-black/40"
  ```

#### 7. **KPI Cards** (`src/components/admin/DashboardKPI.tsx`)
- Augmenter taille de la value : `text-4xl sm:text-5xl font-extrabold`
- Icônes plus grandes : `h-8 w-8`
- Padding plus généreux : `p-6 sm:p-8`
- Labels en `text-xs uppercase tracking-wider font-semibold text-muted-foreground`

#### 8. **Status Badges** (`src/components/admin/StatusBadge.tsx`)
- Augmenter le contraste :
  ```tsx
  en_cours: "bg-emerald-600 text-white font-semibold"
  termine: "bg-green-600 text-white font-semibold"
  en_attente: "bg-amber-500 text-white font-semibold"
  ```

#### 9. **Dashboard** (`src/pages/admin/AdminDashboard.tsx`)
- Remplacer sparkline par barres vertes hachurées (style Donezo)
- Ajouter une section "Team Collaboration" avec avatars + noms + badges de statut :
  ```tsx
  <div className="glass-card p-6">
    <h3 className="text-base font-bold mb-4">Équipe</h3>
    <div className="space-y-3">
      {team.map(member => (
        <div className="flex items-center gap-3">
          <Avatar />
          <div className="flex-1">
            <p className="font-semibold text-sm">{member.name}</p>
            <p className="text-xs text-muted-foreground">{member.role}</p>
          </div>
          <Badge variant="success">{member.status}</Badge>
        </div>
      ))}
    </div>
  </div>
  ```

#### 10. **Toutes les pages Admin** (AdminClients, AdminDossiers, AdminFactures, etc.)
- **Tableaux** :
  - Headers : `bg-muted/30 font-semibold text-foreground`
  - Cellules : `text-foreground` au lieu de `text-muted-foreground`
  - Hover rows : `hover:bg-emerald-50/50`
- **Filtres** :
  - Boutons actifs : `bg-primary text-white`
  - Boutons inactifs : `bg-muted/50 text-foreground hover:bg-muted`
- **Dialogs/Drawers** :
  - Fond blanc `bg-card`
  - Textes foncés
  - Boutons primaires verts
- **Recherche** :
  - Border solide, pas de glassmorphism
  - Placeholder plus foncé

#### 11. **Pages spécifiques** 
- **AdminSupport** : Filtres visibles, tableaux contrastés
- **AdminPipeline** : Cards en blanc, étapes en vert progressif
- **AdminFactures** : Montants en gras noir, statuts en badges verts/ambre/rouges
- **AdminRelances** : Tableau lisible, dates en noir
- **AdminRendezVous** : Récapitulatifs en cards blanches, chiffres larges

### Fichiers à modifier (par ordre de priorité)

**Phase 1 — Fondations**
1. `src/index.css` — Variables, typographie Inter, classes utilitaires
2. `src/components/ui/button.tsx` — Variants redesignés
3. `src/components/ui/input.tsx` — Suppression glassmorphism
4. `src/components/ui/dialog.tsx` — Fond blanc
5. `src/components/ui/tabs.tsx` — Styles actifs

**Phase 2 — Composants Admin**
6. `src/components/admin/DashboardKPI.tsx` — Chiffres XL, icônes grandes
7. `src/components/admin/StatusBadge.tsx` — Contraste maximal
8. `src/pages/admin/AdminDashboard.tsx` — Team section, graphiques repensés

**Phase 3 — Pages Admin (exemples critiques)**
9. `src/pages/admin/AdminClients.tsx` — Tableau, filtres, dialogs
10. `src/pages/admin/AdminDossiers.tsx` — Idem
11. `src/pages/admin/AdminFactures.tsx` — Montants, statuts
12. `src/pages/admin/AdminSupport.tsx` — Tickets, filtres

**Phase 4 — Autres pages** (AdminPipeline, AdminRelances, AdminRendezVous, AdminEmails, AdminStock, etc.)

### Approche technique

- **CSS Scoping** : Toutes les modifications restent dans `.admin-light-theme`, le site public reste inchangé
- **Composants shadcn** : Modifier les fichiers de base (button, input, dialog, etc.) avec des styles inline conditionnels si besoin
- **Aucun changement fonctionnel** : Purement esthétique, même logique métier
- **Typographie** : Appliquer Inter globalement dans `.admin-light-theme`, fallback Montserrat pour le public

