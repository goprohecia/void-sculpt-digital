

## Aligner les timelines sur la Bible Produit v3 (section 6)

### Constat

Le fichier `src/data/sectorTimelines.ts` contient deja les etapes correctes pour les 26 secteurs. Il y a cependant :

1. **Quelques ecarts de wording** avec la Bible :
   - "Solde regle" → "Solde" (photographe, DJ, traiteur, formateur)
   - Expert-Comptable : etape "Cloturee" en trop (la Bible s'arrete a "Envoyee aux impots")
   - Traiteur : "Preparation" → "Preparation en cours" (selon la Bible mais l'image dit "Preparation" — on garde le code actuel)

2. **Duplication massive** : 26 fichiers mock (`mockGarageData.ts`, `mockDJData.ts`, etc.) re-declarent chacun un tableau `*_STEPS` identique. Les composants Stepper importent depuis ces mocks au lieu de `sectorTimelines.ts`.

### Plan

#### 1. Corriger les ecarts de wording dans `sectorTimelines.ts`

- photographe : "Solde regle" → "Solde"
- dj-animateur : "Solde regle" → "Solde"
- traiteur : "Solde regle" → "Solde"
- formateur : "Solde regle" → "Solde"
- expert-comptable : supprimer l'etape "Cloturee" (7 etapes au lieu de 8)

#### 2. Ajouter un helper pour obtenir les steps du premier preset par secteur

Dans `sectorTimelines.ts`, ajouter :
```ts
export function getDefaultStepsForSector(sectorKey: string): string[] {
  const presets = SECTOR_TIMELINE_PRESETS[sectorKey];
  return presets?.[0]?.steps || SECTOR_TIMELINE_PRESETS.generic[0].steps;
}
```

#### 3. Remplacer les `*_STEPS` dans les 26 fichiers mock

Chaque fichier mock (ex: `mockDJData.ts`) remplacera son export `DJ_STEPS` par un re-export depuis `sectorTimelines.ts` :
```ts
import { getDefaultStepsForSector } from "./sectorTimelines";
export const DJ_STEPS = getDefaultStepsForSector("dj-animateur");
```

Cela conserve la compatibilite avec tous les imports existants (Steppers, Dashboards) sans modifier les composants.

#### 4. Appliquer la meme correction dans `use-timeline.ts`

Le `DEFAULT_TIMELINE_STEPS` utilise des etapes generiques codees en dur. Le remplacer par `getDefaultStepsForSector("generic")`.

### Fichiers impactes

| Fichier | Modification |
|---|---|
| `src/data/sectorTimelines.ts` | Corrections wording + ajout helper |
| 26 fichiers `src/data/mock*Data.ts` | Re-export depuis sectorTimelines |
| `src/hooks/use-timeline.ts` | Utiliser le helper centralise |

Aucune migration DB necessaire. Aucun changement UI visible — les composants Stepper et Dashboard continueront de fonctionner identiquement via les memes exports.

