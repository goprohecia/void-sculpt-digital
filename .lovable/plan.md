

# Plan — Modules pré-sélectionnés Bible + wizard

## Constat

1. `ALL_MODULE_KEYS` ne contient pas `"signature"` ni `"abonnement"` → il faut les ajouter.
2. `DEFAULT_SECTOR_RECOMMENDATIONS` doit être mis à jour avec les 6 modules Bible par secteur.
3. Le wizard `ClientSignup.tsx` utilise déjà `sectorRecommendations` pour pré-cocher — la logique est en place, mais le visuel "Recommandé pour [secteur]" sur chaque module recommandé mérite un léger renforcement (contour vert + label).

## Modifications

### 1. `src/contexts/DemoPlanContext.tsx`
- Ajouter `"signature"` et `"abonnement"` à `ALL_MODULE_KEYS`
- Remplacer le contenu de `DEFAULT_SECTOR_RECOMMENDATIONS` par les 24 listes de 6 modules de la Bible (copie exacte fournie par l'utilisateur)

### 2. `src/data/sectorModules.ts`
- Ajouter les labels dans `GENERIC_MODULE_LABELS` :
  - `"signature"` → `"Signature"` 
  - `"abonnement"` → `"Abonnements"`

### 3. `src/pages/admin/ClientSignup.tsx`
- Sur chaque module recommandé (qu'il soit coché ou non), afficher un petit badge "Recommandé" avec contour vert — actuellement le sparkle n'apparaît que si non sélectionné, le rendre visible aussi quand sélectionné.

**Aucune migration DB.** Uniquement des labels et listes statiques.

## Fichiers impactés

| Fichier | Action |
|---|---|
| `src/contexts/DemoPlanContext.tsx` | Ajouter 2 module keys + remplacer recommandations |
| `src/data/sectorModules.ts` | Labels pour signature/abonnement |
| `src/pages/admin/ClientSignup.tsx` | Badge "Recommandé" visible toujours sur modules recommandés |

