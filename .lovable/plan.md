

## Plan : Dismiss banniere + Sidebar reactive par plan + Super Admin gestion formules

### Probleme identifie (sidebar qui ne change pas)

La logique dans `AdminSidebar.tsx` est correcte (`PLAN_MODULES` filtre bien). Le probleme est que `useSubscription` utilise `react-query` avec `queryKey: ["subscription", isDemo ? demoPlan : "real"]`. Quand `demoPlan` change via `setDemoPlan`, la queryKey change et declenche un refetch, mais le composant `AdminSidebar` doit aussi re-render. Le hook `useSubscription` est appele dans `AdminSidebar` ET `AdminLayout` -- les deux partagent le meme `useState(demoPlan)` **localement** dans chaque appel du hook. C'est le bug : chaque appel de `useSubscription()` cree son propre `useState<SubscriptionPlan>("enterprise")`, donc le `demoPlan` de `AdminLayout` (qui fait le `mutate`) ne se propage pas a `AdminSidebar`.

**Solution** : Sortir `demoPlan` dans un contexte partage ou utiliser la queryKey correctement. La solution la plus simple : stocker le demoPlan dans `sessionStorage` et utiliser un evenement pour synchroniser, OU utiliser le queryClient cache directement. Meilleure approche : creer un petit contexte `DemoPlanContext`.

---

### 1. Banniere d'upgrade dismissable

**Fichier : `src/components/admin/AdminLayout.tsx`**
- Ajouter `const [showBanner, setShowBanner] = useState(true)`
- Conditionner l'affichage : `{plan !== "enterprise" && showBanner && (...)}`
- Ajouter un bouton X (lucide `X`) qui appelle `setShowBanner(false)`
- Reset `showBanner` a `true` quand le plan change (via `useEffect` sur `plan`)

### 2. Corriger la reactivite du plan demo (bug principal)

**Nouveau fichier : `src/contexts/DemoPlanContext.tsx`**
- Creer un contexte `DemoPlanProvider` avec `useState<SubscriptionPlan>("enterprise")`
- Exporter `useDemoPlan()` qui retourne `{ demoPlan, setDemoPlan }`
- Wrapper dans `App.tsx` (a l'interieur de `DemoAuthProvider`)

**Fichier : `src/hooks/use-subscription.ts`**
- Remplacer le `useState<SubscriptionPlan>` local par `useDemoPlan()` du contexte
- Ainsi tous les composants qui appellent `useSubscription()` partagent le meme `demoPlan`
- La queryKey `["subscription", demoPlan]` sera identique partout

**Fichier : `src/App.tsx`**
- Ajouter `<DemoPlanProvider>` dans l'arbre

### 3. Modules distincts par plan (deja en place mais maintenant reactif)

Les `PLAN_MODULES` sont deja definis :
- **Starter** : `clients`, `dossiers`, `facturation` (+ overview, parametres toujours)
- **Business** : + `messagerie`, `relances`, `support`, `emails`, `rendez-vous` (+ overview, parametres)
- **Enterprise** : tous

Avec le fix du contexte, changer le plan dans le Select de `AdminLayout` propagera immediatement a `AdminSidebar`.

### 4. Super Admin : gestion des formules

**Nouveau fichier : `src/pages/superadmin/SuperAdminFormules.tsx`**
- Page de gestion des 3 formules MBA (Starter, Business, Enterprise)
- Pour chaque formule : nom, prix, limite de modules, liste des modules inclus (checkboxes)
- Edition en place : cliquer sur une formule ouvre un panneau d'edition
- Les modifications sont stockees dans le `DemoPlanContext` (demo) ou en base (real)
- Affichage : 3 cards cote a cote avec nom, prix, nb modules, liste des modules coches
- Bouton "Enregistrer" qui met a jour `PLAN_MODULES` dynamiquement

**Fichier : `src/contexts/DemoPlanContext.tsx`** (extension)
- Ajouter un state `planModulesOverride` dans le contexte pour permettre au Super Admin de modifier les modules par plan
- Exporter `{ demoPlan, setDemoPlan, planModules, setPlanModules }`

**Fichier : `src/hooks/use-subscription.ts`**
- Lire `planModules` depuis le contexte au lieu de la constante statique `PLAN_MODULES`
- Exporter toujours `PLAN_MODULES` comme valeur par defaut

**Fichier : `src/components/admin/SuperAdminSidebar.tsx`**
- Ajouter l'item "Formules" dans la navigation (icone `Settings2` ou `Layers`)

**Fichier : `src/components/AnimatedRoutes.tsx`**
- Ajouter la route `/superadmin/formules` -> `SuperAdminFormules`

**Fichier : `src/pages/superadmin/SuperAdminEntreprises.tsx`**
- Ajouter une colonne "Modules choisis" dans la liste des entreprises
- Chaque entreprise mock affiche les modules qu'elle a selectionnes

### 5. Inscription back-office entreprise avec choix de formule

**Fichier : `src/pages/admin/ClientSignup.tsx`** (renommer conceptuellement en signup entreprise)
- Ajouter une etape de selection de formule (Starter/Business/Enterprise) avec cards visuelles
- Apres selection du plan, afficher les modules disponibles pour ce plan
- Permettre au client de choisir ses modules parmi ceux disponibles (dans la limite du plan)
- Stocker le plan et les modules choisis dans `subscriptions` + `custom_modules`

---

### Fichiers impactes

| Action | Fichier |
|--------|---------|
| Creer | `src/contexts/DemoPlanContext.tsx` -- contexte partage pour plan demo |
| Creer | `src/pages/superadmin/SuperAdminFormules.tsx` -- gestion formules |
| Modifier | `src/App.tsx` -- ajouter DemoPlanProvider |
| Modifier | `src/hooks/use-subscription.ts` -- utiliser contexte + planModules dynamique |
| Modifier | `src/components/admin/AdminLayout.tsx` -- dismiss banniere |
| Modifier | `src/components/admin/AdminSidebar.tsx` -- lire planModules du contexte |
| Modifier | `src/components/admin/SuperAdminSidebar.tsx` -- ajouter lien Formules |
| Modifier | `src/components/AnimatedRoutes.tsx` -- route formules |
| Modifier | `src/pages/admin/ClientSignup.tsx` -- choix formule + modules a l'inscription |
| Modifier | `src/pages/superadmin/SuperAdminEntreprises.tsx` -- colonne modules |

