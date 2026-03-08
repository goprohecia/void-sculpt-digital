

## Plan : Analytiques par secteur d'activite dans le Super Admin

### Constat

Le flow d'inscription avec choix de secteur est deja implemente dans `ClientSignup.tsx` (etape 2). Les secteurs sont definis dans `DemoPlanContext.tsx` (20 secteurs). Les mock enterprises dans `SuperAdminEntreprises.tsx` ont deja un champ `sector`. Ce qui manque : des analytiques par secteur dans le dashboard Super Admin et un filtre secteur dans la liste des entreprises.

### Modifications

#### 1. `SuperAdminEntreprises.tsx` — Ajouter un filtre par secteur

- Ajouter un `Select` "Tous les secteurs" a cote du filtre plan existant
- Filtrer les entreprises par secteur en plus du plan et de la recherche

#### 2. `SuperAdminDashboard.tsx` — Ajouter des analytiques par secteur

- Ajouter les mock enterprises avec leur champ `sector` dans le dashboard
- Ajouter un graphique **"Repartition par secteur"** (BarChart horizontal ou PieChart) montrant combien d'entreprises par secteur
- Ajouter un graphique **"Secteurs par plan"** (BarChart empile) montrant la distribution des plans par secteur d'activite
- Ajouter une section "Top secteurs" avec MRR par secteur
- Enrichir les mock `MOCK_ENTERPRISES` du dashboard avec un champ `sector` pour alimenter ces graphiques

#### 3. `SuperAdminStats.tsx` — Verifier s'il existe et enrichir

- Si cette page existe, y ajouter aussi une vue detaillee par secteur

### Fichiers impactes

| Action | Fichier |
|--------|---------|
| Modifier | `src/pages/superadmin/SuperAdminEntreprises.tsx` — filtre par secteur |
| Modifier | `src/pages/superadmin/SuperAdminDashboard.tsx` — graphiques par secteur + enrichir mocks |

