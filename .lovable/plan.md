

# Plan — Secteurs manquants + Données de démo

## État actuel

**Déjà fait** : `centre-islamique` et `association-sportive` sont présents dans :
- `DemoPlanContext.tsx` (SECTORS + DEFAULT_SECTOR_RECOMMENDATIONS)
- `sectorModules.ts` (SECTOR_MODULE_OVERRIDES — overrides complets)
- `onboardingRoles.ts` (rôles onboarding)
- `sectorCategories.ts` (catégorie Éducation & Formation)
- `DossierMesures.tsx` (templates mesures)

**Manquant** :
1. `SECTOR_ROLE_LABELS` dans `sectorModules.ts` — pas d'entrée pour ces 2 secteurs
2. `sectorTimelines.ts` — pas de timeline presets + pas dans `getAllSectorPresets()` labels
3. Fichiers mock démo : `mockCentreIslamique.ts` et `mockAssociationSportive.ts` inexistants
4. Noms "Dupont" dans : `mockGarageData.ts` (mécanicien Marc Dupont), `mockAvocatData.ts` (Maître Alexandre Dupont), `mockSportData.ts` (Kevin Dupont), `mockComptableData.ts` (SARL Dupont & Fils)

## Modifications

### 1. `src/data/sectorModules.ts`
Ajouter dans `SECTOR_ROLE_LABELS` :
- `"centre-islamique": { admin: "Direction", employee: "Professeur", client: "Élève" }`
- `"association-sportive": { admin: "Direction du club", employee: "Entraîneur", client: "Membre" }`

Ajouter ces 2 secteurs dans `ASSIGNATION_SECTORS`.

### 2. `src/data/sectorTimelines.ts`
Ajouter presets :
- `"centre-islamique"` : timeline 7 étapes (Inscription → Évaluation initiale → Niveau placé → Cours en cours → Évaluation périodique → Progression validée → Diplôme / Ijaza)
- `"association-sportive"` : timeline 6 étapes (Demande adhésion → Licence validée → Cotisation payée → Membre actif → Renouvellement → Membre renouvelé)

Ajouter dans `getAllSectorPresets()` labels map.

### 3. Créer `src/data/mockCentreIslamique.ts`
- Steps : 7 étapes Coran
- Professeurs : Sheikh Abdallah Idris, Ustadha Fatima Zahra
- Élèves : Yusuf Al-Rashid, Amina Benali, Ibrahim Konate, Sara Mansouri
- Dossiers avec niveaux Coran (Hizb, Jouz), cotisations 80€/mois, inscription 160€
- KPIs : élèves actifs, cotisations, assiduité

### 4. Créer `src/data/mockAssociationSportive.ts`
- Steps : 6 étapes adhésion
- Entraîneurs : Pierre Garnier (U15), Sophie Renard (Féminin)
- Membres : Lucas Moreau, Théo Bernard, Emma Lefevre, Mathis Dupuis
- Cotisations 150€/an, licences FFF, matchs planifiés
- KPIs : membres actifs, cotisations, matchs

### 5. Renommer "Dupont" dans les mocks existants

| Fichier | Ancien | Nouveau |
|---|---|---|
| `mockGarageData.ts` | Marc Dupont (mécanicien) | Mohamed Bensalem |
| `mockAvocatData.ts` | Maître Alexandre Dupont | Maître Stéphane Marchand |
| `mockSportData.ts` | Kevin Dupont (coach) | Kevin Rousseau |
| `mockComptableData.ts` | SARL Dupont & Fils / Pierre Dupont | SARL Girard & Fils / Patrick Girard |

Toutes les références internes (mecanicienNom, coach, entrepriseNom) seront mises à jour en cascade.

### 6. `mockData.ts` — client générique
Renommer `Dupont Marie` → un nom plus varié (ex: `Farid Belhaj`).

## Fichiers impactés

| Fichier | Action |
|---|---|
| `src/data/sectorModules.ts` | Ajouter SECTOR_ROLE_LABELS + ASSIGNATION |
| `src/data/sectorTimelines.ts` | Ajouter 2 timelines + labels |
| `src/data/mockCentreIslamique.ts` | Nouveau |
| `src/data/mockAssociationSportive.ts` | Nouveau |
| `src/data/mockGarageData.ts` | Renommer Dupont → Bensalem |
| `src/data/mockAvocatData.ts` | Renommer Dupont → Marchand |
| `src/data/mockSportData.ts` | Renommer Dupont → Rousseau |
| `src/data/mockComptableData.ts` | Renommer Dupont → Girard |
| `src/data/mockData.ts` | Renommer client Dupont |

