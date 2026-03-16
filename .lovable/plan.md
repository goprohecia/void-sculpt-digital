

# Plan — Espaces personnalisés : ouvrir au Business + templates secteur

## Modifications

### 1. `src/hooks/use-subscription.ts`
- Changer `canCustomizeSpaces: plan === "enterprise"` → `canCustomizeSpaces: plan === "business" || plan === "enterprise"`

### 2. `src/components/admin/AdminSidebar.tsx` (ligne 296)
- Changer `isEnterprise && spaces.length > 0` → `(isEnterprise || isBusiness) && spaces.length > 0`
- Ajouter `isBusiness` dans le destructuring de `useSubscription()`

### 3. `src/components/admin/AdminModulesSection.tsx` (ligne 330)
- Changer le `requiredPlan` de l'UpgradeBanner de `"enterprise"` à `"business"`

### 4. `src/hooks/use-custom-spaces.ts`
- Ajouter l'objet `SECTOR_SPACE_TEMPLATES` avec les 5 secteurs définis (mariage, btp, conciergerie, centre-islamique, association-sportive)
- Exporter ce dictionnaire

### 5. `src/pages/admin/AdminSettings.tsx` — `CustomSpacesManager`
- Importer `SECTOR_SPACE_TEMPLATES` et `demoSector`
- Avant le formulaire de création, si `demoSector` a des templates correspondants :
  - Afficher une section "Espaces recommandés pour [secteur]" avec des cartes cliquables
  - Au clic sur une carte : pré-remplir `newName`, `newBaseRole: "employee"`, `newModules` avec les modules du template
  - L'admin peut modifier avant de valider (le formulaire reste éditable)

## Fichiers impactés

| Fichier | Action |
|---|---|
| `src/hooks/use-subscription.ts` | `canCustomizeSpaces` → Business + Enterprise |
| `src/components/admin/AdminSidebar.tsx` | Condition sidebar → Business + Enterprise |
| `src/components/admin/AdminModulesSection.tsx` | UpgradeBanner requiredPlan → business |
| `src/hooks/use-custom-spaces.ts` | Ajouter `SECTOR_SPACE_TEMPLATES` |
| `src/pages/admin/AdminSettings.tsx` | Templates secteur dans `CustomSpacesManager` |

Pas de migration DB.

