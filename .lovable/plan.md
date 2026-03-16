

# Plan P1 — Offres & Socle fixe : recalibrage du quota

## Résumé des changements

5 fichiers principaux à modifier, aucune table DB ou Edge Function touchée.

## 1. Fusionner "clients" + "dossiers" → "clients-dossiers"

**`src/contexts/DemoPlanContext.tsx`**
- Dans `ALL_MODULE_KEYS` : retirer `"clients"` et `"dossiers"`, ajouter `"clients-dossiers"` à leur place
- Créer une constante exportée `SOCLE_FIXE = ["overview", "parametres", "analyse", "clients-dossiers"]`
- Créer `QUOTA_LIMITS: Record<SubscriptionPlan, number | null> = { starter: 3, business: 6, enterprise: null }`
- Mettre à jour `DEFAULT_PLAN_MODULES` : les modules listés ne contiennent plus clients/dossiers (qui sont dans le socle), seulement les modules additionnels par défaut (starter: `["facturation", "relances", "messagerie"]`, business: `["facturation", "relances", "messagerie", "support", "emails", "rendez-vous"]`, enterprise: `"all"`)
- Mettre à jour `DEFAULT_SECTOR_RECOMMENDATIONS` : remplacer toutes les occurrences de `"clients"` et `"dossiers"` séparés — les retirer car ils sont dans le socle, garder uniquement les modules additionnels recommandés

**`src/data/sectorModules.ts`**
- Dans `GENERIC_MODULE_LABELS` : retirer les entrées `clients` et `dossiers`, ajouter `"clients-dossiers": "Clients & Dossiers"`
- Dans chaque `*_OVERRIDES` sectoriel : fusionner les overrides `clients` + `dossiers` en un seul `"clients-dossiers"` avec le label adapté au secteur (ex: Mariage → `"Mariées & Dossiers"`, Auto-école → `"Élèves & Dossiers"`, Conciergerie → `"Propriétaires & Dossiers"`)

## 2. Supprimer duplication PLAN_LIMITS

**`src/hooks/use-subscription.ts`**
- Supprimer `PLAN_LIMITS` et `PLAN_MODULES` locaux (lignes 15-31)
- Importer `QUOTA_LIMITS` et `SOCLE_FIXE` depuis `DemoPlanContext`
- Remplacer toutes les références `PLAN_LIMITS` → `QUOTA_LIMITS`
- Exporter `QUOTA_LIMITS` pour la rétrocompatibilité si nécessaire
- Dans le return : remplacer `PLAN_LIMITS` par `QUOTA_LIMITS`

## 3. Mettre à jour ALWAYS_INCLUDED partout

**`src/components/admin/AdminModulesSection.tsx`** (ligne 33)
- Changer `ALWAYS_INCLUDED` de `["overview", "parametres", "analyse"]` vers : importer `SOCLE_FIXE` depuis DemoPlanContext

**`src/pages/admin/ClientSignup.tsx`** (ligne 16)
- Remplacer `ALWAYS_INCLUDED = ["overview", "parametres"]` par import de `SOCLE_FIXE`
- `SELECTABLE_MODULES` filtre avec `SOCLE_FIXE`
- Dans l'étape 1 (plan selection) : afficher "Socle fixe inclus : Clients & Dossiers + Analyse" avec badge "Toujours inclus", puis "+ 3 modules au choix" / "+ 6 modules" / "+ Tous"
- Corriger `getModuleLimit` pour utiliser `QUOTA_LIMITS` au lieu de compter les modules du plan
- Corriger le compteur modules (ligne 281) pour ne compter que les modules hors socle

**`src/pages/superadmin/SuperAdminFormules.tsx`** (ligne 29)
- Remplacer `ALWAYS_INCLUDED` par import de `SOCLE_FIXE`

## 4. Mettre à jour les pages Upgrade

**`src/pages/admin/AdminUpgrade.tsx`** et **`src/pages/client/ClientUpgrade.tsx`**
- Afficher le socle fixe séparément avec badge "Toujours inclus"
- Afficher "+ X modules au choix" au lieu de "X modules inclus"
- Lister les modules en deux sections : socle fixe (grisé/badge) puis modules additionnels

## 5. Sidebar

**`src/components/admin/AdminSidebar.tsx`** (ligne 32)
- Remplacer `"clients"` et `"dossiers"` séparés dans `principalKeys` par `"clients-dossiers"`
- S'assurer que le routing pointe toujours vers les bonnes pages (le module fusionné renvoie vers la page clients qui contient les dossiers)

## 6. Mock data

**`src/data/mockEnterprises.ts`**
- Remplacer `"clients", "dossiers"` par `"clients-dossiers"` dans les arrays de modules

## Fichiers impactés (résumé)

| Fichier | Action |
|---|---|
| `src/contexts/DemoPlanContext.tsx` | Refonte ALL_MODULE_KEYS, ajout SOCLE_FIXE, QUOTA_LIMITS |
| `src/data/sectorModules.ts` | Fusion labels clients+dossiers par secteur |
| `src/hooks/use-subscription.ts` | Supprimer PLAN_LIMITS/PLAN_MODULES dupliqués |
| `src/components/admin/AdminModulesSection.tsx` | Import SOCLE_FIXE |
| `src/pages/admin/ClientSignup.tsx` | Socle fixe dans UI onboarding étape 1 |
| `src/pages/superadmin/SuperAdminFormules.tsx` | Import SOCLE_FIXE |
| `src/pages/admin/AdminUpgrade.tsx` | Affichage socle + quota |
| `src/pages/client/ClientUpgrade.tsx` | Affichage socle + quota |
| `src/components/admin/AdminSidebar.tsx` | Fusion dans principalKeys |
| `src/data/mockEnterprises.ts` | Remplacement modules mock |

