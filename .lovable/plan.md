

## Module Immobilier — Onboarding métier

### État actuel

**Déjà en place :**
- `IMMOBILIER_OVERRIDES` dans `sectorModules.ts` : dossiers → "Biens", pipeline → "Pipeline mandats", clients → "Acquéreurs & Vendeurs", etc.
- `SECTOR_ROLE_LABELS` : admin = "Directeur agence", employee = "Agent immobilier", client = "Client"
- `sectorTimelines.ts` : 3 presets immobilier (Mandat de vente 14 étapes, Location 8 étapes, Gestion locative 9 étapes) — ne correspond pas au stepper 6 étapes demandé
- `DEFAULT_SECTOR_RECOMMENDATIONS` : clients, dossiers, facturation, rendez-vous, pipeline, messagerie, emails, documents
- Assignation enabled pour immobilier
- Aucune vue spécifique immobilier (pas de composants conditionnels comme pour garages)
- Aucun mock data immobilier dédié

**À construire :**
- Stepper 6 étapes spécifique : Mandat signé → Photos / Annonce → Visites en cours → Offre reçue → Compromis → Acte finalisé
- Mock data : biens immobiliers avec adresse, prix, type (vente/location), agent, propriétaire, acheteur
- Dashboard Direction (admin) : mandats actifs par statut, performance agents, CA, pipeline kanban
- Vue Agent (employee) : liste mandats filtrée, carte bien, calendrier visites
- Vue Propriétaire (client) : suivi étape, visites, documents, messagerie
- Vue Acheteur/Locataire (client) : checklist documents, statut candidature, notifications
- Bandeau recommandation Business 250€ avec modules spécifiques
- Mise à jour terminologie : "Dossier" → "Mandat" dans les overrides

### Plan d'implémentation

#### 1. Mettre à jour la terminologie (`sectorModules.ts`)

Modifier `IMMOBILIER_OVERRIDES` :
- `dossiers` → label **"Mandats"** (au lieu de "Biens") pour coller au vocabulaire demandé
- `employees` → label **"Agents"**
- Ajouter `facturation` → label "Commissions & Facturation"

Mettre à jour `SECTOR_ROLE_LABELS.immobilier` :
- admin → **"Direction"** (au lieu de "Directeur agence")
- employee → **"Agent"**

#### 2. Ajouter le stepper 6 étapes (`sectorTimelines.ts`)

Ajouter un nouveau preset immobilier "Suivi mandat client" avec 6 étapes :
`["Mandat signé", "Photos / Annonce", "Visites en cours", "Offre reçue", "Compromis", "Acte finalisé"]`

Catégorie : `vente`.

#### 3. Créer les données mock (`src/data/mockImmobilierData.ts`)

- 6-8 biens avec : id, adresse, ville, prix, type (vente/location), surface, pièces, étape (0-5), agentId, agentNom, proprietaireNom, proprietaireId, acheteurNom, acheteurId, dateMandat, photo placeholder, nbVisites, dernierRetour
- 2 agents mock
- Messages d'étape personnalisés pour propriétaire et acheteur
- Checklist documents acheteur (pièce d'identité, justificatif domicile, bulletins salaire, avis imposition, attestation employeur, simulation prêt)
- Quelques RDV visites mock

#### 4. Créer le composant stepper immobilier (`src/components/immobilier/ImmobilierMandatStepper.tsx`)

Stepper 6 étapes avec icônes adaptées (FileSignature, Camera, Users, HandCoins, FileCheck, Flag).
Même pattern que `GarageVehicleStepper` : actif en surbrillance, passé grisé + coche, dates, agent responsable, bouton "Avancer l'étape" si `isEditable`.

#### 5. Dashboard Direction (`src/components/immobilier/ImmobilierDashboard.tsx`)

- KPIs : mandats actifs, biens en visite, offres reçues, CA commissions en cours
- Performance agents : nb mandats, taux de conversion (mini tableau)
- Pipeline kanban simplifié : colonnes par étape, cartes biens
- Bandeau recommandation en haut

#### 6. Liste mandats / pipeline Agent (`src/components/immobilier/ImmobilierAgentView.tsx`)

- Liste des mandats filtrée sur l'agent connecté
- Filtres par type (vente/location), statut, ville
- Carte bien : adresse, prix, surface, étape, prochaine action
- Calendrier visites avec créneaux (mock)
- Bouton "Avancer l'étape" avec toast

#### 7. Vue Propriétaire (`src/components/immobilier/ImmobilierProprietaireView.tsx`)

- Stepper visuel + message d'étape personnalisé
- Section "Mes informations" : bien, date de mandat, agent en charge
- Nombre de visites effectuées, derniers retours (mock)
- Section "Mes documents" : mandat signé, photos publiées, offres reçues (simulés avec badges)
- Messagerie avec l'agent (lien vers messagerie existante)

#### 8. Vue Acheteur/Locataire (`src/components/immobilier/ImmobilierAcheteurView.tsx`)

- Dossier de candidature avec checklist documents cochables en local (state)
- Statut de la candidature sur le bien visé + stepper
- Notification simulée à chaque étape franchie (toast au mount si étape >= seuil)

#### 9. Bandeau recommandation (`src/components/immobilier/ImmobilierOnboardingBanner.tsx`)

- Recommandation Business 250€
- Modules pré-cochés : Clients & Dossiers, Calendrier RDV, Messagerie, Signature électronique, Facturation, Relances automatiques
- Message : "La signature électronique + dossiers + espace propriétaire éliminent 80% des allers-retours."

#### 10. Intégrations conditionnelles

- `AdminDashboard.tsx` : `demoSector === "immobilier"` → `<ImmobilierDashboard />`
- `AdminDossiers.tsx` : `demoSector === "immobilier"` → `<ImmobilierDashboard />` (pipeline view already embedded)
- `EmployeeDossiers.tsx` : `demoSector === "immobilier"` → `<ImmobilierAgentView />`
- `ClientDossiers.tsx` : `demoSector === "immobilier"` → render propriétaire or acheteur view (toggle or tabs)
- Sidebars : déjà gérées par `SECTOR_ROLE_LABELS` (juste mettre à jour les labels)

### Fichiers

| Fichier | Action |
|---|---|
| `src/data/sectorModules.ts` | Modifier — IMMOBILIER_OVERRIDES + role labels |
| `src/data/sectorTimelines.ts` | Modifier — ajouter preset 6 étapes |
| `src/data/mockImmobilierData.ts` | Créer — biens, agents, messages, checklist |
| `src/components/immobilier/ImmobilierMandatStepper.tsx` | Créer — stepper 6 étapes |
| `src/components/immobilier/ImmobilierDashboard.tsx` | Créer — dashboard Direction |
| `src/components/immobilier/ImmobilierAgentView.tsx` | Créer — vue Agent filtrée |
| `src/components/immobilier/ImmobilierProprietaireView.tsx` | Créer — vue Propriétaire |
| `src/components/immobilier/ImmobilierAcheteurView.tsx` | Créer — vue Acheteur/Locataire |
| `src/components/immobilier/ImmobilierOnboardingBanner.tsx` | Créer — bandeau Business 250€ |
| `src/pages/admin/AdminDashboard.tsx` | Modifier — conditionnel immobilier |
| `src/pages/admin/AdminDossiers.tsx` | Modifier — conditionnel immobilier |
| `src/pages/employee/EmployeeDossiers.tsx` | Modifier — conditionnel immobilier |
| `src/pages/client/ClientDossiers.tsx` | Modifier — conditionnel immobilier |

