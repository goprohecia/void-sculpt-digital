

## Plan : Modules sectoriels — Développeur freelance

### Concept

Créer un système de **personnalisation sectorielle des modules** où chaque secteur définit des overrides (label, icône, description) pour les clés de modules génériques existantes. Le code sous-jacent reste le même (mêmes pages, mêmes routes), mais l'interface s'adapte au vocabulaire métier du secteur.

Pour le secteur **Développeur freelance**, voici les renommages et enrichissements :

| Module générique | Label secteur Dev | Détail |
|---|---|---|
| dossiers | Projets | Suivi de projets tech, stack, repo |
| taches | Sprints & Tâches | Organisation par sprints |
| temps | Time Tracking | Suivi horaire par projet |
| documents | Livrables | Fichiers livrés au client |
| pipeline | Pipeline Projets | Funnel de prospection dev |
| analyse | Dashboard Dev | KPIs dev (taux horaire, projets livrés) |
| support | Tickets Support | Support technique |
| notes | Notes techniques | Documentation interne |
| stock | *(masqué)* | Non pertinent pour un dev |
| relances | Relances paiement | Identique |

Les modules non listés gardent leur label par défaut.

### Architecture technique

#### 1. Nouveau fichier `src/data/sectorModules.ts`

Définir un type `SectorModuleOverride` et un dictionnaire par secteur :

```typescript
type SectorModuleOverride = {
  label: string;
  icon?: string; // lucide icon name
  description?: string;
  hidden?: boolean; // masquer pour ce secteur
};

type SectorModulesConfig = {
  sectorKey: string;
  overrides: Record<string, SectorModuleOverride>;
};
```

Commencer avec le secteur `developpeur`. Les autres secteurs seront ajoutés un par un dans les prochaines itérations.

#### 2. Modifier `DemoPlanContext.tsx`

- Ajouter un state `sectorModuleOverrides` stockant les configs sectorielles éditables par le SuperAdmin
- Exporter un helper `getModuleLabel(moduleKey, sectorKey)` et `isModuleHidden(moduleKey, sectorKey)`

#### 3. Modifier `AdminSidebar.tsx`

- Lire le secteur de l'entreprise connectée (depuis `subscriptions.sector` ou le contexte démo)
- Utiliser `getModuleLabel()` pour afficher les labels adaptés au secteur au lieu des labels statiques
- Filtrer les modules cachés via `isModuleHidden()`

#### 4. Modifier `SuperAdminFormules.tsx`

- Ajouter un onglet/section **"Modules par secteur"** permettant au SuperAdmin de :
  - Sélectionner un secteur
  - Pour chaque module générique : définir le label personnalisé, ou le masquer
  - Sauvegarder dans le contexte

#### 5. Modifier le flow d'inscription `ClientSignup.tsx`

- À l'étape "Modules", afficher les labels sectoriels au lieu des labels génériques
- Masquer les modules marqués `hidden` pour le secteur choisi

### Fichiers impactés

| Action | Fichier |
|---|---|
| Créer | `src/data/sectorModules.ts` — config des overrides par secteur |
| Modifier | `src/contexts/DemoPlanContext.tsx` — state sectorModuleOverrides + helpers |
| Modifier | `src/components/admin/AdminSidebar.tsx` — labels dynamiques par secteur |
| Modifier | `src/pages/superadmin/SuperAdminFormules.tsx` — gestion des modules sectoriels |
| Modifier | `src/pages/admin/ClientSignup.tsx` — labels sectoriels à l'inscription |
| Modifier | `src/hooks/use-app-settings.ts` — exporter les labels sectoriels si besoin |

### Prochaines étapes (hors scope)

Après validation de cette architecture avec le secteur Développeur, on pourra ajouter les autres secteurs un par un (Photographe, Coach sportif, BTP, etc.) en ajoutant simplement leurs overrides dans `sectorModules.ts`.

