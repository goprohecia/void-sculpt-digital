

# Plan — Modules verrouillés grisés + modal upsell dans la sidebar

## Résumé

Modifier `AdminSidebar.tsx` pour afficher **tous** les modules (actifs ET verrouillés) au lieu de filtrer les verrouillés. Les modules verrouillés apparaissent grisés avec un badge plan requis. Un clic ouvre un Dialog upsell dédié.

## Modifications

### 1. `src/components/admin/AdminSidebar.tsx`

**Logique actuelle** (lignes 86-95) : `navItems` filtre les modules hors plan → ils disparaissent.

**Nouvelle logique** :
- Garder `enabledItems` (tous les modules activés côté settings, non cachés par secteur)
- Calculer `lockedItems` = modules dans `enabledItems` qui ne sont PAS dans le plan actif ni dans `SOCLE_FIXE`
- Ordre d'affichage par groupe : modules actifs d'abord, modules verrouillés ensuite
- Ajouter un état `upsellModule` pour le module cliqué (ouvre le Dialog)

**Rendu des items verrouillés** dans `renderItems` :
- `opacity-[0.45]`, `cursor-pointer`, pas de `<Link>` → `<button onClick>` qui ouvre le Dialog
- Badge inline à droite : déterminer le plan minimum requis (Business ou Enterprise) via `DEFAULT_PLAN_MODULES`
  - Business → fond `bg-amber-100 text-amber-700` taille `text-[10px]`
  - Enterprise → fond `bg-purple-100 text-purple-700` taille `text-[10px]`

**Dialog upsell** (nouveau, inline dans le composant) :
- Import `Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter` depuis `@/components/ui/dialog`
- Contenu : nom du module, description courte ("Ce module est disponible à partir de l'offre X"), bouton "Voir les offres" → `/admin/upgrade`, bouton "Fermer"
- Se ferme en remettant `upsellModule` à `null`

### 2. Helper pour déterminer le plan requis

Fonction locale `getRequiredPlan(moduleKey)` :
- Si le module est dans `DEFAULT_PLAN_MODULES.business` → retourne `"business"`
- Sinon → retourne `"enterprise"`

### 3. Descriptions courtes des modules (map statique locale)

Map `MODULE_DESCRIPTIONS` avec une ligne par module pour le contenu du Dialog (ex: "Gérez vos factures et devis", "Suivez vos relances automatiques", etc.).

## Fichiers impactés

| Fichier | Action |
|---|---|
| `src/components/admin/AdminSidebar.tsx` | Modifier : afficher modules verrouillés grisés + Dialog upsell |

Aucun autre fichier modifié. Pas de migration DB.

