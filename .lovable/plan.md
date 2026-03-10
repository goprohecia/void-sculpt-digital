

## Module Garage / Carrosserie — Onboarding métier

### État actuel

**Existant :**
- `GARAGES_OVERRIDES` dans `sectorModules.ts` : renomme dossiers → "Réparations" (pas "Véhicules"), stock → "Pièces détachées", etc.
- `sectorTimelines.ts` : 2 presets garage (Réparation véhicule 11 étapes, Entretien/Révision 9 étapes) — ne correspond pas au stepper 7 étapes demandé
- `DemoPlanContext` : recommandations garages déjà définies (clients, dossiers, facturation, stock, rendez-vous, relances, support, taches)
- Espaces admin/employee/client existants : génériques, pas de vue spécifique garage
- Pas de rôle "Réceptionniste" / "Mécanicien" — les sidebars affichent "Admin" / "Salarié" générique
- Pas de mock data véhicules

**À construire :**
- Terminologie "Véhicules" au lieu de "Réparations" pour les dossiers
- Rôle labels sectoriels (Réceptionniste, Mécanicien)
- Stepper 7 étapes spécifique garage
- Mock data véhicules avec immatriculation, marque/modèle, kilométrage
- Vues spécifiques sectorielles pour les 3 espaces
- Bandeau recommandation Business 250€

### Plan d'implémentation

#### 1. Mettre à jour la terminologie garage (`sectorModules.ts`)

Modifier `GARAGES_OVERRIDES` :
- `dossiers` → label "Véhicules" (au lieu de "Réparations")
- Ajouter `employees` → label "Mécaniciens"

Ajouter un nouveau export `SECTOR_ROLE_LABELS` : mapping `sectorKey → { admin, employee, client }` pour adapter les titres de sidebar/dashboard. Pour garages : `{ admin: "Réceptionniste", employee: "Mécanicien", client: "Client" }`.

#### 2. Ajouter le stepper 7 étapes garage (`sectorTimelines.ts`)

Ajouter un 3e preset garage nommé "Suivi véhicule client" avec exactement ces 7 étapes :
`["Véhicule reçu", "Diagnostic", "Devis envoyé", "Devis accepté", "En réparation", "Prêt à récupérer", "Terminé"]`

Catégorie : `réparation`.

#### 3. Créer les données mock garage (`src/data/mockGarageData.ts`)

Mock de 6-8 véhicules avec :
- `id`, `clientNom`, `immatriculation`, `marque`, `modele`, `kilometrage`, `motifEntree`, `mecanicienId`, `mecanicienNom`, `etape` (index 0-6), `dateDepot`, `notes`
- 2 mécaniciens mock
- Messages d'étape personnalisés pour l'espace client

#### 4. Créer le composant stepper garage (`src/components/garage/GarageVehicleStepper.tsx`)

Stepper visuel 7 étapes avec :
- Icônes adaptées par étape (Car, Search, FileText, CheckCircle, Wrench, Bell, Flag)
- État actif = surbrillance primary, passé = grisé + coche
- Date de passage + notes optionnelles
- Bouton "Avancer l'étape" (prop `isEditable`)

#### 5. Dashboard Réceptionniste (`src/components/garage/GarageDashboard.tsx`)

Composant rendu conditionnellement quand `demoSector === "garages"` dans `AdminDashboard.tsx` :
- KPI pastilles : véhicules par statut (reçus, en diagnostic, en réparation, prêts)
- RDV du jour (mock)
- Alertes devis > 48h
- Lien vers liste véhicules

#### 6. Liste véhicules Réceptionniste (`src/components/garage/GarageVehicleList.tsx`)

Tableau avec colonnes : immatriculation, client, modèle, étape en cours, mécanicien assigné, actions.
Bouton "Nouveau véhicule" → formulaire dialog (client, marque/modèle, immatriculation, kilométrage, motif).
Intégré dans `AdminDossiers.tsx` quand sector = garages.

#### 7. Vue Mécanicien (`src/components/garage/GarageMechanicView.tsx`)

Vue filtrée "Mes véhicules" : cartes véhicule avec immat, modèle, étape, notes réceptionniste.
Bouton "Avancer l'étape" avec toast confirmation.
Intégré dans `EmployeeDossiers.tsx` quand sector = garages.

#### 8. Vue Client garage (`src/components/garage/GarageClientView.tsx`)

Stepper visuel + message d'étape personnalisé + section "Mes informations" (véhicule, date dépôt, mécanicien).
Notification simulée "Votre véhicule est prêt" quand étape = 5.
Intégré dans `ClientDossiers.tsx` / `ClientDossierDetail.tsx` quand sector = garages.

#### 9. Bandeau recommandation offre (`src/components/garage/GarageOnboardingBanner.tsx`)

Affiché en haut du dashboard admin quand sector = garages :
- Recommandation Business 250€
- Modules pré-cochés : Clients & Dossiers, RDV + Acompte, Facturation, Stock/Pièces, Messagerie, Relances
- Message : "Ces 6 modules couvrent 90% des besoins d'un garage..."

#### 10. Intégrations conditionnelles dans les pages existantes

- `AdminDashboard.tsx` : si `demoSector === "garages"` → render `<GarageDashboard />` au lieu du dashboard générique
- `AdminDossiers.tsx` : si garages → render `<GarageVehicleList />`
- `EmployeeDossiers.tsx` : si garages → render `<GarageMechanicView />`
- `ClientDossiers.tsx` : si garages → render `<GarageClientView />`
- `AdminSidebar.tsx` / `EmployeeSidebar.tsx` : utiliser `SECTOR_ROLE_LABELS` pour adapter "Espace Admin" → "Espace Réceptionniste", "Espace Salarié" → "Espace Mécanicien"

### Fichiers

| Fichier | Action |
|---|---|
| `src/data/sectorModules.ts` | Modifier — GARAGES_OVERRIDES + SECTOR_ROLE_LABELS |
| `src/data/sectorTimelines.ts` | Modifier — ajouter preset 7 étapes |
| `src/data/mockGarageData.ts` | Créer — véhicules mock + mécaniciens |
| `src/components/garage/GarageVehicleStepper.tsx` | Créer — stepper 7 étapes |
| `src/components/garage/GarageDashboard.tsx` | Créer — dashboard réceptionniste |
| `src/components/garage/GarageVehicleList.tsx` | Créer — liste + formulaire nouveau véhicule |
| `src/components/garage/GarageMechanicView.tsx` | Créer — vue mécanicien filtrée |
| `src/components/garage/GarageClientView.tsx` | Créer — vue client suivi véhicule |
| `src/components/garage/GarageOnboardingBanner.tsx` | Créer — bandeau recommandation Business |
| `src/pages/admin/AdminDashboard.tsx` | Modifier — conditionnel garage |
| `src/pages/admin/AdminDossiers.tsx` | Modifier — conditionnel garage |
| `src/pages/employee/EmployeeDossiers.tsx` | Modifier — conditionnel garage |
| `src/pages/client/ClientDossiers.tsx` | Modifier — conditionnel garage |
| `src/components/admin/AdminSidebar.tsx` | Modifier — role labels sectoriels |
| `src/components/admin/EmployeeSidebar.tsx` | Modifier — role labels sectoriels |

