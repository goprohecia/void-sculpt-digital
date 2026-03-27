# CLAUDE.md — MBA (My Business Assistant)
## Fichier de configuration Claude Code — Impartial Games 2026

---

## 🎯 CONTEXTE DU PROJET

MBA — My Business Assistant est un SaaS de gestion métier configurable destiné aux indépendants, TPE et PME. Ce n'est pas un outil comptable. C'est un assistant business qui comprend le vocabulaire, les étapes de travail et les besoins spécifiques de chaque secteur d'activité.

**Repo :** `goprohecia/void-sculpt-digital`
**Stack :** React + TypeScript + Vite + Tailwind CSS + shadcn/ui + Supabase
**Déploiement :** Lovable (front) + Supabase (back)

**Approche :** On part du repo existant, on refactorise les éléments précis identifiés (pas de réécriture complète), on s'appuie sur ce qui est déjà solide (Fabien back-end, contexts, data), et on avance vite vers un MVP vendable.

**Référence produit absolue :** `docs/MBA_Bible_Produit_v3.md` — En cas de conflit entre ce fichier et la Bible v3, la Bible v3 prime toujours.

**Audit :** 72/72 points conformes — validé le 26 Mars 2026.

---

## 🏗️ ARCHITECTURE TECHNIQUE

### Stack complète
- **Framework :** React + TypeScript (98.6% TS)
- **Build :** Vite
- **Styling :** Tailwind CSS + shadcn/ui (thème MBA vert)
- **Design :** Minimaliste, sobre — icônes Lucide React uniquement, pas d'emojis comme icônes UI
- **Base de données :** Supabase (PostgreSQL, multi-tenant, RLS activé)
- **Auth :** Supabase Auth (rôles : admin, employé, client)
- **Emails :** Brevo via Edge Functions
- **Calendrier :** Calendly via Edge Function
- **State :** React Context (3 providers principaux)

### Structure des dossiers
```
src/
  assets/          — Images et assets statiques
  components/      — Composants UI (génériques avec props — jamais spécifiques à un secteur)
  contexts/        — 3 providers React
  data/            — Fichiers mock + config secteurs/modules/timelines
  hooks/           — Hooks React réutilisables
  integrations/    — Intégrations tierces
  lib/             — Utilitaires
  pages/
    admin/         — Pages espace Admin (30+ fichiers)
    client/        — Pages espace Client
    employee/      — Pages espace Employé
    onboarding/    — Tunnel d'inscription (4 étapes)
    secteurs/      — Pages publiques par secteur
  App.tsx
  main.tsx

supabase/
  functions/       — Edge Functions (15+ fonctions — géré par Fabien)
  migrations/      — Migrations SQL (40+ — géré par Fabien)
  config.toml

docs/
  MBA_Bible_Produit_v3.md  — Bible produit (référence absolue)
  bmad/                     — PRD, architecture, user stories
```

### Fichiers clés

| Fichier | Rôle | Statut |
|---|---|---|
| `src/contexts/DemoPlanContext.tsx` | Secteur actif, modules, offres — SOURCE DE VÉRITÉ | CRITIQUE — ne pas casser |
| `src/contexts/DemoDataContext.tsx` | Données clients, dossiers, factures — connecté au secteur actif | ✅ Fonctionnel |
| `src/contexts/DemoAuthContext.tsx` | Authentification et rôles | Ne pas toucher |
| `src/data/sectorCategories.ts` | Regroupement secteurs par catégorie — aligné bible v3 | BON — ne pas toucher |
| `src/data/sectorTimelines.ts` | Timelines par secteur — aligné bible v3 | BON — ne pas toucher |
| `src/data/sectorModules.ts` | Labels et config modules par secteur | BON |
| `src/pages/admin/AdminDossierDetail.tsx` | Fiche dossier — 8 onglets, boutons, blocs financiers, droits par rôle | ✅ Fonctionnel |
| `src/pages/admin/ClientSignup.tsx` | Onboarding 4 étapes avec dropdown secteur | ✅ Fonctionnel |

---

## 🚨 RÈGLES ABSOLUES — LIRE AVANT TOUTE MODIFICATION

### Ce que tu NE DOIS PAS faire

- ❌ Ne jamais créer un composant spécifique à un secteur (ex: `GarageClientCard.tsx`, `MariageTimeline.tsx`). Utiliser les composants génériques avec props.
- ❌ Ne jamais dupliquer une fonctionnalité existante. Vérifier si elle existe avant d'en créer une nouvelle.
- ❌ Ne jamais modifier les fichiers Supabase gérés par Fabien : `supabase/migrations/`, `supabase/functions/`, fichiers d'auth.
- ❌ Ne jamais casser le système multi-tenant Supabase.
- ❌ Ne jamais supprimer `sectorCategories.ts` ou `sectorTimelines.ts` — alignés bible v3.
- ❌ Ne jamais hardcoder un nom de secteur, un label ou une étape dans un composant. Toujours utiliser `getModuleLabel()` du DemoPlanContext.
- ❌ Ne jamais ajouter un nouveau calendrier, nouveau système de RDV ou nouveau composant de messagerie. Un seul de chaque existe.
- ❌ Ne jamais ajouter par-dessus du code existant. Remplacer proprement.
- ❌ Ne jamais utiliser d'emojis comme icônes dans l'UI. Utiliser exclusivement des icônes Lucide React.

### Ce que tu DOIS toujours faire

- ✅ Lire le fichier concerné entièrement avant de le modifier.
- ✅ Utiliser `useDemoPlan()` pour accéder au secteur actif et aux labels de modules.
- ✅ Utiliser `useDemoData()` pour accéder aux données clients, dossiers, factures.
- ✅ Toujours remplacer le code existant proprement — pas d'ajout par-dessus.
- ✅ Vérifier que la modification fonctionne pour TOUS les secteurs, pas seulement le secteur test.
- ✅ Respecter le vocabulaire de la bible v3 pour les labels affichés à l'écran.
- ✅ Commenter les blocs modifiés avec `// [MBA]` pour tracer les changements.
- ✅ Tester que les 3 espaces (Admin, Salarié, Client) fonctionnent après chaque modification.
- ✅ Consulter `docs/MBA_Bible_Produit_v3.md` pour toute question sur le comportement produit.
- ✅ Respecter le design minimaliste : fond blanc/gris clair, accent vert MBA, icônes Lucide React, ombres subtiles, transitions douces.

---

## 📊 ÉTAT D'AVANCEMENT — MVP

### ✅ ÉTAPE 1 — Démo présentable (TERMINÉE)
- [x] DemoDataContext connecté au secteur actif — mocks dynamiques
- [x] Mocks nettoyés pour les 4 secteurs prioritaires
- [x] Vocabulaire correct affiché selon le secteur
- [x] Timelines correspondant au secteur

### ✅ ÉTAPE 2 — Nœuds Lovable retirés (TERMINÉE)
- [x] Composants dupliqués fusionnés en génériques
- [x] Un seul calendrier, une seule messagerie
- [x] Imports inutilisés supprimés

### ✅ ÉTAPE 3 — Tronc commun fonctionnel (TERMINÉE)
- [x] Fiche dossier enrichie — 8 onglets, boutons, blocs financiers, droits par rôle
- [x] 8 onglets toujours visibles pour tous les rôles (accès restreint = message "Accès réservé")
- [x] Onboarding 4 étapes : Formule → Secteur (dropdown) → Modules → Compte
- [x] Droits par rôle (admin/employé/client) et par offre (starter/business/enterprise)
- [x] Messagerie groupée fonctionnelle
- [x] Module Dossiers & Demandes intégré au socle fixe universel

### ✅ ÉTAPE 4 — Corps de métier prioritaires (TERMINÉE)
- [x] Conciergerie / Ménage — vocabulaire Propriétaire, timeline, mock propre
- [x] Réparateur — vocabulaire Technicien, timeline, mock propre
- [x] Association sportive + Centre islamique — Membre/Élève, messagerie groupée, cotisations
- [x] Coach sportif — vocabulaire Coach, abonnement récurrent, timeline

### 🔄 PHASE ACTUELLE — Améliorations et polish
Le MVP est fonctionnel. Les prochaines tâches concernent les améliorations UX, les fonctionnalités secondaires et les cahiers des charges métier détaillés.

---

## 🎨 DESIGN SYSTEM — PRINCIPES

Le design MBA est **minimaliste et applicatif**. Pas de style "généré par IA".

### Palette
- Fond : blanc (#FFFFFF) ou gris très léger (#FAFAFA)
- Texte : noir/gris foncé pour le contenu, text-muted-foreground pour les descriptions
- Accent : vert MBA uniquement pour les CTA, sélections actives et badges de statut
- Pas de couleurs criardes ni de fonds colorés sur les cartes

### Composants
- Cards : fond blanc, border subtile (border-gray-100), shadow-sm au repos, shadow-md au hover
- Boutons CTA : fond vert MBA, texte blanc, full-width quand approprié
- Icônes : exclusivement Lucide React — jamais d'emojis dans l'UI
- Badges : discrets, texte petit, fond léger
- Transitions : transition-all duration-200 partout

### Responsive
- Desktop : 3 colonnes pour les grilles
- Tablette : 2 colonnes
- Mobile : 1 colonne, sidebar collapsible, boutons confortables

---

## 📐 SOCLE FIXE UNIVERSEL

Le module **Dossiers & Demandes** fait partie du socle fixe inclus d'office dans TOUTES les offres et TOUS les secteurs. Il ne peut pas être désactivé.

### Format du tableau Dossiers (standard pour tous les secteurs)
- Colonnes : Référence | Client | Prestation | Montant | Assigné à | Statut | Actions
- Filtres : Tous | En cours | Terminés | En attente | Annulés | Archivés
- Onglets : Dossiers (count) | Demandes (count) | Clients (count)
- La colonne "Client" s'adapte au vocabulaire du secteur (Propriétaire, Membre, Élève, Mariée)
- La colonne "Prestation" affiche le contexte métier du secteur
- Les statuts correspondent aux étapes de la timeline du secteur

### Droits sur le module Dossiers
- Admin : voit tous les dossiers, tous les montants, peut créer/modifier
- Salarié : voit uniquement SES dossiers assignés, pas les montants globaux
- Client : ne voit PAS cette page (il voit son propre dossier depuis son espace)

---

## 📐 SPÉCIFICATION FICHE DOSSIER

Structure technique de AdminDossierDetail.tsx basée sur bible v3 section 5.

```
AdminDossierDetail.tsx
  ├── En-tête (sticky)
  │     ├── Nom client + badge type dossier
  │     ├── Email (cliquable) + Tél (cliquable)
  │     ├── Info contextuelle (éditable)
  │     ├── Employé assigné (cliquable → réassigner)
  │     └── Boutons : Étape précédente | Notifier | Contacter | Dossier terminé
  ├── Timeline des étapes (horizontale, cliquable)
  ├── Blocs financiers (4 blocs : Total | Encaissé | Restant dû | Employé) — admin uniquement
  └── Onglets (8 — toujours visibles pour tous les rôles)
        ├── Résumé │ RDV │ Paiements │ Documents
        └── Photos │ Mesures │ Messages │ Notes
```

### Règles
- 8 onglets TOUJOURS visibles pour tous les rôles
- Rôle sans accès → onglet présent mais contenu = "Accès réservé à l'administrateur"
- Onglet vide → message + bouton d'action (ex : « Aucun RDV — Programmer un RDV »)
- Blocs financiers visibles admin uniquement
- Actions directes sans changer de page (message, photo, RDV, paiement, note, document)

---

## 📐 SPÉCIFICATION ONBOARDING

Tunnel d'inscription en **4 étapes** avec design minimaliste.

### Étape 1 — Formule
- 3 cartes : Starter, Business (mise en avant "RECOMMANDÉE"), Enterprise
- Socle fixe mentionné : "Clients & Dossiers et Analyse inclus dans toutes les offres"

### Étape 2 — Secteur + Métier (même page)
- **Dropdown** shadcn/ui Select pour choisir la catégorie (7 catégories avec icône Lucide React)
- Après sélection du dropdown, les cartes des métiers de cette catégorie apparaissent en dessous
- Le dropdown reste visible — l'utilisateur peut changer de catégorie à tout moment
- Carte métier : icône Lucide React + nom + rôle employé/client en texte muted

### Étape 3 — Modules
- Socle fixe affiché séparément comme "Toujours inclus"
- Modules pré-sélectionnés selon DEFAULT_SECTOR_RECOMMENDATIONS
- Modules indisponibles : opacity-50 + icône cadenas + badge offre requise
- Clic sur module grisé → modal d'upsell

### Étape 4 — Compte
- Formulaire centré (max-w-md) : nom, prénom, email, mot de passe, entreprise

### Navigation
- Indicateur de progression 4 barres fines (h-1) avec labels
- Bouton Retour fonctionnel à chaque étape

---

## 📋 VOCABULAIRE PAR SECTEUR

### Réparation & Technique
```
Garage:       Rendez-vous pris → Véhicule reçu → Diagnostic → Devis envoyé → Devis accepté → En réparation → Contrôle qualité → Prêt à récupérer → Terminé
Réparateur:   Appareil reçu → Diagnostic → Devis envoyé → Devis accepté → En réparation → Tests effectués → Prêt à récupérer → Terminé
BTP:          Demande reçue → Visite technique → Devis envoyé → Devis signé → Travaux planifiés → En cours → Réception chantier → Facturé → Clôturé
```

### Accompagnement & Conseil
```
Consultant:   Premier contact → Analyse du besoin → Proposition envoyée → Mission signée → En cours → Livrables envoyés → Bilan final → Clôturé
Coach sportif: Inscription → Abonnement actif → Bilan initial → Programme en cours → Bilan intermédiaire → Renouvellement → Terminé
Formateur:    Inscription → Prérequis validés → Formation en cours → Évaluation → Attestation délivrée → Clôturé
```

### Créatif & Événementiel
```
Designer:     Brief reçu → Moodboard validé → Première proposition → Retours client → Corrections → BAT validé → Fichiers livrés
Photographe:  Réservation → Acompte reçu → Séance réalisée → Sélection en cours → Retouches → Galerie livrée → Soldé
DJ:           Demande reçue → Devis envoyé → Contrat signé → Acompte reçu → Événement confirmé → Prestation réalisée → Soldé
Événementiel: Brief reçu → Proposition envoyée → Contrat signé → Prestataires confirmés → J-7 brief final → Événement réalisé → Bilan client → Clôturé
```

### Commerce & Services
```
Magasin:      Commande reçue → Paiement validé → Préparation → Expédié/Prêt → Récupéré/Livré → Terminé
Conciergerie: Réservation confirmée → Préparation logement → Check-in effectué → Séjour en cours → Check-out → Ménage fait → Bilan propriétaire
Nettoyage:    Devis envoyé → Contrat signé → Planifié → Intervention en cours → Intervention terminée → Rapport envoyé → Facturé
Traiteur:     Demande reçue → Devis envoyé → Menu validé → Contrat signé → Acompte reçu → Préparation → Livraison/Service → Soldé
Coiffure:     RDV pris → Acompte payé → Client arrivé → Prestation en cours → Terminé → Avis demandé
```

### Juridique & Administratif
```
Avocats:      Consultation initiale → Mandat signé → Instruction dossier → Échanges adverses → Audience → Délibéré → Décision rendue → Clôturé
Immobilier:   Mandat signé → Photos/Annonce → Visites en cours → Offre reçue → Compromis → Acte finalisé
Développeur:  Cahier des charges → Devis signé → Maquettes validées → Dev en cours → Recette client → Corrections → Mise en prod → Clôturé
```

### Éducation & Formation
```
Auto-école:       Inscription → Dossier NEPH → Code en cours → Heures de conduite → Examen blanc → Passage code → Passage conduite → Diplômé
Centre islamique: Inscription → Évaluation initiale → Niveau placé → Cours en cours → Évaluation périodique → Progression validée → Diplôme/Ijaza
Asso sportive:    Demande adhésion → Licence validée → Cotisation payée → Membre actif → Renouvellement → Membre renouvelé
```

### Mariage
```
Mariage: RDV Pris → Mesures Prises → En Confection → Essayage Intermédiaire → Essayage Final → Arrivée Boutique → Prête à Récupérer → Terminée
```

---

## 🔧 MODULES PRÉ-SÉLECTIONNÉS PAR SECTEUR

```typescript
// Ces valeurs sont dans DemoPlanContext.tsx — ne pas modifier sans raison
"auto-ecole":          ["rendez-vous", "agenda", "facturation", "messagerie", "relances", "abonnement"],
"conciergerie":        ["agenda", "employees", "facturation", "messagerie", "relances", "abonnement"],
"btp":                 ["facturation", "relances", "stock", "agenda", "messagerie", "signature"],
"boutique":            ["stock", "facturation", "messagerie", "relances", "employees", "emails"],
"cabinets":            ["signature", "messagerie", "agenda", "facturation", "relances", "emails"],
"coach-sportif":       ["rendez-vous", "agenda", "abonnement", "facturation", "messagerie", "emails"],
"coiffure":            ["rendez-vous", "agenda", "facturation", "stock", "messagerie", "relances"],
"community-manager":   ["agenda", "messagerie", "facturation", "relances", "emails", "taches"],
"consultant":          ["signature", "messagerie", "facturation", "agenda", "relances", "emails"],
"designer":            ["messagerie", "agenda", "facturation", "relances", "signature", "taches"],
"developpeur":         ["signature", "facturation", "messagerie", "agenda", "taches", "temps"],
"dj-animateur":        ["signature", "facturation", "agenda", "messagerie", "relances", "emails"],
"evenementiel":        ["signature", "agenda", "facturation", "messagerie", "relances", "emails"],
"formateur":           ["signature", "agenda", "facturation", "messagerie", "relances", "emails"],
"garages":             ["rendez-vous", "facturation", "stock", "messagerie", "relances", "emails"],
"immobilier":          ["agenda", "messagerie", "signature", "facturation", "relances", "emails"],
"mariage":             ["rendez-vous", "facturation", "messagerie", "agenda", "relances", "signature"],
"nettoyage":           ["agenda", "facturation", "messagerie", "relances", "employees", "abonnement"],
"photographe":         ["rendez-vous", "agenda", "facturation", "messagerie", "relances", "emails"],
"reparateur":          ["facturation", "stock", "support", "relances", "rendez-vous", "taches"],
"traiteur":            ["signature", "facturation", "agenda", "messagerie", "relances", "emails"],
"cabinet-recrutement": ["messagerie", "agenda", "facturation", "signature", "relances", "emails"],
"cabinet-avocats":     ["signature", "messagerie", "agenda", "facturation", "relances", "emails"],
"expert-comptable":    ["messagerie", "signature", "facturation", "relances", "emails", "support"],
"centre-islamique":    ["agenda", "facturation", "messagerie-groupee", "abonnement", "documents", "relances"],
"association-sportive":["agenda", "facturation", "messagerie-groupee", "abonnement", "documents", "relances"],
```

---

## 📝 RÈGLES DONNÉES MOCK

### Règle absolue
Les données mock doivent être 100% cohérentes avec le secteur affiché. Jamais de mélange entre secteurs.

### Exemples corrects vs interdits

| Secteur | ✅ Correct | ❌ Interdit |
|---|---|---|
| Mariage | Émilie Laurent — Mariage le 21 juin 2026 | Marie Dupont / TechSolutions |
| Garage | M. Dupont — Renault Clio 2019 | FoodLab / DigitalMind |
| Conciergerie | Propriétaire Benali — Appartement Marseille | GreenLeaf Bio |
| Réparateur | iPhone 14 cassé — Technicien Kevin | Luxe & Mode |

### Employés mock — doivent correspondre au rôle du secteur
```
Mariage:      Isabelle Delacroix (Conseillère), Françoise Mercier (Retoucheuse)
Garage:       Kevin M. (Mécanicien), Thomas D. (Mécanicien)
Conciergerie: Fatima B. (Agent d'entretien), Karim L. (Agent d'entretien)
Coach:        Sophie M. (Coach), Alexandre D. (Coach)
```

---

## 🚫 FICHIERS GÉRÉS PAR FABIEN — NE PAS TOUCHER

```
supabase/migrations/    — Toutes les migrations SQL
supabase/functions/     — Toutes les Edge Functions
  ├── _shared/          — Utilitaires partagés
  ├── ai-chat/          — Module IA (Gemini)
  ├── brevo-webhook/    — Webhooks Brevo
  ├── calendly-events/  — Intégration Calendly
  ├── create-client-account/
  ├── create-employee-account/
  ├── generate-account-structure/
  ├── process-scheduled-emails/
  ├── send-bulk-email/
  ├── send-campaign-email/
  └── (autres fonctions email/paiement)
```

**En cas de doute sur une interaction avec Supabase ou le back-end, consulter Fabien avant de modifier.**

---

## ✅ CONVENTIONS DE CODE

```typescript
// Toujours utiliser les hooks de contexte
const { demoSector, getModuleLabel } = useDemoPlan();
const { clients, dossiers } = useDemoData();

// Toujours commenter les modifications Claude Code
// [MBA] Correction bug mock non connecté au secteur
// [MBA] Ajout onglet Photos dans AdminDossierDetail

// Nommage des composants génériques (pas spécifiques à un secteur)
// ✅ DossierCard.tsx
// ✅ ClientRow.tsx
// ✅ TimelineStep.tsx
// ❌ MariageDossierCard.tsx
// ❌ GarageClientRow.tsx

// Utiliser getModuleLabel pour tous les labels affichés
const label = getModuleLabel('clients-dossiers'); // → "Mariées & Dossiers" si secteur mariage

// Vérifier les droits avant d'afficher une action
const canAdvanceTimeline = 
  role === 'admin' || 
  (role === 'employee' && plan !== 'starter');
```

---

## 📚 DOCUMENTS DE RÉFÉRENCE

- **`docs/MBA_Bible_Produit_v3.md`** — Référence absolue pour le vocabulaire, les offres, les espaces, les modules et les comportements UI
- **Bible v3 section 3** — Onboarding complet
- **Bible v3 section 4** — Structure des 3 espaces + droits + messagerie
- **Bible v3 section 5** — Fiche dossier (cœur du produit)
- **Bible v3 section 6** — Vocabulaire et étapes par corps de métier
- **Bible v3 section 7** — Modules pré-sélectionnés par secteur
- **Bible v3 section 10** — Comportements UI obligatoires

**En cas de conflit entre ce fichier et la Bible Produit v3, la Bible Produit v3 prime toujours.**

---

*MBA — My Business Assistant — Impartial Games 2026 — Confidentiel*
*CLAUDE.md v3 — Mis à jour le 26 Mars 2026 — Audit 72/72 conforme*
