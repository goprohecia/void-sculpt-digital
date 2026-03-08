

## Plan: Sélecteur de plan demo + Espace Super Admin

### 1. Remplacer le badge "Mode démo" par un sélecteur de plan

**Fichier: `src/components/admin/AdminLayout.tsx`**
- Remplacer le badge statique "Mode démo" par un dropdown (Select) avec 3 options : Starter, Business, Enterprise
- Chaque option affiche le nom du plan + prix (150€, 250€, 400€)
- Au changement, appeler `updatePlan.mutate(newPlan)` du hook `useSubscription`
- Couleurs distinctes : Starter = gris, Business = bleu (recommandé), Enterprise = or/amber

**Fichier: `src/hooks/use-subscription.ts`**
- Modifier le `demoOverride` pour qu'il soit réactif (useState au lieu de useRef) afin que le changement de plan en démo provoque un re-render immédiat
- Ajouter les infos pricing dans les constantes :
  - Starter: 150€/mois, 3 modules, pas d'onboarding, pas de module sur mesure, mois par mois
  - Business: 250€/mois, 6 modules, appel inclus, mois par mois
  - Enterprise: 400€/mois, tous modules, appel dédié, module sur mesure, 6 mois minimum

**Fichier: `src/components/admin/AdminSidebar.tsx`**
- Filtrer les items de navigation en fonction du plan actif ET du `modulesLimit`
- Starter : afficher seulement les 3 premiers modules activés (overview toujours inclus + 2 au choix, ou les 3 premiers par défaut)
- Business : 6 modules max
- Enterprise : tous les modules
- Masquer les fonctionnalités Enterprise-only (espaces personnalisés, IA, etc.) pour Starter/Business

### 2. Créer l'espace Super Admin MBA

**Nouveau fichier: `src/pages/superadmin/SuperAdminDashboard.tsx`**
- Dashboard global MBA avec KPIs : nombre total d'entreprises inscrites, MRR, répartition par plan, taux de churn
- Liste de toutes les entreprises clientes avec leur plan, statut, date d'inscription
- Accès rapide pour voir le détail d'une entreprise

**Nouveau fichier: `src/pages/superadmin/SuperAdminEntreprises.tsx`**
- Liste complète des entreprises avec filtres (plan, statut, date)
- Détail d'une entreprise : infos, plan actif, modules activés, nombre d'utilisateurs

**Nouveau fichier: `src/components/admin/SuperAdminLayout.tsx`**
- Layout dédié avec sidebar spécifique Super Admin
- Navigation : Dashboard, Entreprises, Abonnements, Statistiques

**Nouveau fichier: `src/components/admin/SuperAdminSidebar.tsx`**
- Sidebar avec les sections : Vue d'ensemble, Entreprises, Abonnements, Statistiques globales, Paramètres MBA

**Fichier: `src/contexts/DemoAuthContext.tsx`**
- Ajouter un compte démo `superadmin@mba.demo` avec rôle `superadmin`
- Ajouter le type `superadmin` dans `DemoRole`

**Fichier: `src/components/AnimatedRoutes.tsx`**
- Ajouter les routes `/superadmin`, `/superadmin/entreprises`, `/superadmin/abonnements`, `/superadmin/stats`

**Fichier: `src/pages/admin/AdminLogin.tsx`**
- Ajouter un bouton démo "Super Admin" dans la grille des comptes démo

### Résumé des fichiers impactés

| Action | Fichier |
|--------|---------|
| Modifier | `AdminLayout.tsx` — sélecteur de plan |
| Modifier | `use-subscription.ts` — demo plan réactif + pricing |
| Modifier | `AdminSidebar.tsx` — filtrage modules par plan |
| Modifier | `DemoAuthContext.tsx` — ajout superadmin |
| Modifier | `AnimatedRoutes.tsx` — routes superadmin |
| Modifier | `AdminLogin.tsx` — bouton démo superadmin |
| Créer | `SuperAdminLayout.tsx` |
| Créer | `SuperAdminSidebar.tsx` |
| Créer | `SuperAdminDashboard.tsx` |
| Créer | `SuperAdminEntreprises.tsx` |

