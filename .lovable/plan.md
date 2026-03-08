

## Plan: Graphiques Super Admin + Filtrage sidebar par plan

### 1. Graphiques recharts dans SuperAdminDashboard

**Fichier: `src/pages/superadmin/SuperAdminDashboard.tsx`**
- Ajouter un graphique **AreaChart** pour l'evolution du MRR (6 derniers mois) avec gradient
- Ajouter un **BarChart** pour les inscriptions vs churns par mois
- Utiliser les composants `ChartContainer`, `ChartTooltip` deja disponibles dans le projet
- Placer les 2 graphiques côte à côte sous les KPIs, au-dessus du tableau

**Fichier: `src/pages/superadmin/SuperAdminStats.tsx`**
- Ajouter egalement un LineChart MRR + BarChart inscriptions/churns pour remplacer/completer le tableau existant

### 2. Modules distincts par plan dans la sidebar

**Fichier: `src/components/admin/AdminSidebar.tsx`**
- Remplacer la logique de filtrage par index (les N premiers) par une liste explicite de modules par plan :
  - **Starter (3 modules)** : `overview`, `clients`, `dossiers`, `parametres` (overview + parametres toujours inclus + 3 modules = clients, dossiers, facturation)
  - **Business (6 modules)** : Starter + `messagerie`, `facturation`, `relances`, `support`, `emails`, `rendez-vous`
  - **Enterprise** : Tous les modules sans restriction
- Cela garantit que chaque plan a un back-office visuellement distinct avec des fonctionnalites coherentes

**Fichier: `src/hooks/use-subscription.ts`**
- Ajouter une constante `PLAN_MODULES` exportee qui definit les moduleKeys autorises par plan pour centraliser la logique

### Fichiers impactes

| Action | Fichier |
|--------|---------|
| Modifier | `SuperAdminDashboard.tsx` — ajout AreaChart MRR + BarChart inscriptions |
| Modifier | `SuperAdminStats.tsx` — ajout graphiques recharts |
| Modifier | `use-subscription.ts` — ajout PLAN_MODULES constant |
| Modifier | `AdminSidebar.tsx` — filtrage par liste de modules explicite par plan |

