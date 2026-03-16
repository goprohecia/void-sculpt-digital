
# AUDIT COMPLET MBA — Bible Produit v3 vs. Code Existant

Date : 2026-03-16

---

## ARCHITECTURE GLOBALE

### Structure du projet

```
src/
├── App.tsx                          # QueryClient + Providers (DemoAuth, DemoData, DemoPlan, WhiteLabel)
├── components/
│   ├── admin/                       # AdminSidebar, AdminLayout, DossierTimeline, etc. (38 fichiers)
│   ├── onboarding/OnboardingWizard.tsx  # Wizard 4 étapes actuel
│   ├── client/                      # SwapWarningScreen, ModuleSwapWizard, etc.
│   ├── ui/                          # shadcn/ui composants
│   └── [22 dossiers par secteur]    # Composants landing page par secteur
├── contexts/
│   ├── DemoAuthContext.tsx           # Auth démo (sessionStorage, 4 comptes mock)
│   ├── DemoDataContext.tsx           # Données mock en mémoire
│   └── DemoPlanContext.tsx           # Plans, secteurs, prix, module overrides, recommendations
├── data/
│   ├── sectorModules.ts             # 544 lignes — overrides labels/descriptions par secteur (24 secteurs)
│   ├── sectorTimelines.ts           # Presets de timeline par secteur (430 lignes, 25 secteurs)
│   ├── onboardingRoles.ts           # Rôles employés par secteur pour onboarding (24 secteurs)
│   ├── stepNotificationTemplates.ts # Templates de notification par étape
│   └── mock*.ts                     # 25 fichiers de données démo par secteur
├── hooks/                           # 43 hooks (supabase, démo, permissions, etc.)
├── pages/
│   ├── admin/                       # 28 pages admin
│   ├── client/                      # 13 pages client
│   ├── employee/                    # 13 pages employé
│   ├── superadmin/                  # 7 pages super admin
│   └── secteurs/                    # 22 pages landing par secteur
└── integrations/supabase/           # Client + types auto-générés
```

### Backend (Supabase / Lovable Cloud)

- **Tables** : 36+ tables avec isolation multi-tenant (`compte_id`)
- **Edge Functions** : 16 fonctions déployées
- **Auth** : Email/password avec `user_roles` (admin, employee, client)
- **Storage** : 4 buckets (email-assets, cdc-attachments, email-attachments, messagerie-medias)
- **RLS** : Politiques sur toutes les tables avec `get_user_compte_id()` et `has_role()`

### Providers (App.tsx)

```
QueryClientProvider → TooltipProvider → DemoAuthProvider → DemoDataProvider → DemoPlanProvider → WhiteLabelProvider
```

---

## 1. VISION GLOBALE — Tronc commun

| Point Bible | État | Fichiers concernés |
|---|---|---|
| Tronc commun unique (pas de code dupliqué par métier) | **OK** | Architecture commune, seuls les labels changent |
| Toute fonctionnalité s'applique à tous les secteurs | **OK** | `sectorModules.ts` gère les overrides de labels |

---

## 2. LES TROIS OFFRES

### Existant

**Fichier** : `src/contexts/DemoPlanContext.tsx`
```ts
DEFAULT_PLAN_PRICES = { starter: 150, business: 250, enterprise: 500 }
DEFAULT_PLAN_MODULES = {
  starter: ["clients", "dossiers", "facturation"],          // 3 modules
  business: ["clients", "dossiers", "facturation", "messagerie", "relances", "support"], // 6 modules
  enterprise: "all"
}
```

**Fichier** : `src/hooks/use-subscription.ts`
```ts
PLAN_LIMITS = { starter: 3, business: 6, enterprise: null }
PLAN_MODULES = { // Dupliqué de DemoPlanContext !
  starter: ["clients", "dossiers", "facturation"],
  business: ["clients", "dossiers", "facturation", "messagerie", "relances", "support"],
  enterprise: "all"
}
```

**Fichier** : `src/components/admin/AdminModulesSection.tsx`
```ts
ALWAYS_INCLUDED = ["overview", "parametres", "analyse"]  // Hors quota
SYSTEM_MODULES = ["overview", "parametres"]
```

### Écarts

| Point Bible | État | Détail |
|---|---|---|
| Prix Starter 150€ / Business 250€ / Enterprise 500€ | **OK** | Conforme |
| Socle fixe = Clients & Dossiers + Analyse (hors quota) | **PARTIEL** | `analyse` est dans ALWAYS_INCLUDED, mais `clients` et `dossiers` sont comptés dans le quota des plans Starter/Business au lieu d'être socle fixe |
| Starter = socle + 3 modules au choix | **NON CONFORME** | Actuellement `["clients", "dossiers", "facturation"]` = 3 mais clients/dossiers devraient être socle + 3 *autres* |
| Business = socle + 6 modules au choix | **NON CONFORME** | Même problème |
| Enterprise = tous les modules | **OK** | `"all"` |
| Module fusionné « Clients & Dossiers » | **MANQUANT** | `clients` et `dossiers` sont 2 modules distincts partout |
| Modules verrouillés = grisés + badge offre requise + modal upsell au clic | **PARTIEL** | `AdminModulesSection.tsx` a un système d'upsell mais la sidebar ne grise pas les modules verrouillés |
| Duplication PLAN_MODULES | **BUG** | Défini dans `DemoPlanContext` ET `use-subscription.ts` — source de vérité incohérente |

### À corriger
1. Ajouter `clients` et `dossiers` dans `ALWAYS_INCLUDED` (socle fixe hors quota)
2. Changer Starter à 3 modules *additionnels* au choix (ex: facturation + 2 autres)
3. Changer Business à 6 modules *additionnels* au choix
4. Fusionner `clients` et `dossiers` en un seul toggle/module dans la sidebar
5. Supprimer la duplication `PLAN_MODULES` dans `use-subscription.ts`
6. Griser les modules verrouillés dans `AdminSidebar.tsx` avec icône cadenas et tooltip

---

## 3. ONBOARDING — Tunnel d'inscription

### Existant

**Fichier** : `src/components/onboarding/OnboardingWizard.tsx` (330 lignes)

Wizard actuel en 4 étapes :
1. **Étape 0** : Choix du secteur (grille plate de 24 secteurs, sans catégories)
2. **Étape 1** : Taille de l'équipe (Solo / Petite / Moyenne / Structure)
3. **Étape 2** : Sélection des rôles employés (checkboxes)
4. **Étape 3** : Récapitulatif (secteur + taille + rôles) → bouton « Valider et démarrer »

**Action finale** : Appel Edge Function `generate-account-structure` qui :
- Crée les rôles avec permissions
- Insère le vocabulaire métier
- Sauvegarde le secteur dans `app_settings`
- Marque `onboarding_complete = true`

### Écarts vs Bible

| Point Bible | État | Fichier(s) |
|---|---|---|
| Étape 1 = Choix de la formule (Starter/Business/Enterprise) | **MANQUANT** | Aucune sélection de plan dans l'onboarding |
| Étape 2 = Secteur par catégorie (7 catégories avec headers) | **NON CONFORME** | Grille plate sans catégories dans `OnboardingWizard.tsx` |
| 7 catégories : Réparation & Technique, Accompagnement & Conseil, Commerce & Vente, Création & Communication, Services à la personne, Éducation & Formation, Juridique & Finance | **MANQUANT** | Pas de regroupement |
| Étape 3 = Sélection des modules (socle fixe visible, modules au choix selon quota) | **MANQUANT** | Pas de sélection de modules dans l'onboarding |
| Modules pré-cochés par secteur | **PARTIEL** | `DEFAULT_SECTOR_RECOMMENDATIONS` existe dans `DemoPlanContext.tsx` (lignes 64-89) mais n'est pas utilisé dans le wizard |
| Étape 4 = Création du compte (nom, prénom, email, mot de passe, nom entreprise) | **MANQUANT** | L'onboarding est post-connexion (page `/signup` séparée) |
| Secteurs manquants : centre-islamique, association-sportive | **MANQUANT** | `SECTORS` dans `DemoPlanContext.tsx` a 24 secteurs, il en manque 2-3 |
| Noms employé/client par secteur | **PARTIEL** | `SECTOR_ROLE_LABELS` dans `sectorModules.ts` (lignes 519-544) a les labels admin/employee/client mais pas utilisés dans l'onboarding |
| Emojis Bible vs code | **PARTIEL** | Quelques différences (ex: Boutique = 🛍️ dans le code vs possiblement différent dans la Bible) |

### À refaire
1. Refondre le wizard en 4 étapes Bible : Formule → Secteur (catégories) → Modules → Compte
2. Ajouter les 7 catégories avec headers visuels
3. Ajouter 2-3 secteurs manquants
4. Intégrer la sélection de modules avec pré-cochage par secteur
5. Fusionner la création de compte dans le wizard

---

## 4. SECTEURS & VOCABULAIRE

### Secteurs existants (24)

**Fichier** : `src/contexts/DemoPlanContext.tsx` lignes 34-59

```
auto-ecole, conciergerie, btp, boutique, cabinets, coach-sportif, coiffure,
community-manager, consultant, designer, developpeur, dj-animateur,
evenementiel, formateur, garages, immobilier, mariage, nettoyage,
photographe, reparateur, traiteur, cabinet-recrutement, cabinet-avocats,
expert-comptable
```

### Secteurs manquants (Bible)

| Secteur | Clé suggérée | Catégorie Bible |
|---|---|---|
| Centre islamique | `centre-islamique` | Éducation & Formation |
| Association sportive | `association-sportive` | Services à la personne |
| Salle de sport (distinct de coach-sportif) | `salle-de-sport` | Services à la personne |

### Labels par secteur (SECTOR_ROLE_LABELS)

**Fichier** : `src/data/sectorModules.ts` lignes 519-544

Existant (20 secteurs mappés sur 24) :
```ts
garages:     { admin: "Réceptionniste", employee: "Mécanicien", client: "Client" }
btp:         { admin: "Dirigeant", employee: "Ouvrier / Technicien", client: "Client" }
coiffure:    { admin: "Gérant", employee: "Coiffeur / Praticien", client: "Client" }
auto-ecole:  { admin: "Directeur", employee: "Moniteur", client: "Élève" }
conciergerie:{ admin: "Conciergerie", employee: "Agent d'entretien", client: "Propriétaire" }
mariage:     { admin: "Admin Boutique", employee: "Conseillère / Retoucheuse", client: "Mariée" }
coach-sportif:{ admin: "Gérant", employee: "Coach", client: "Membre" }
// ... etc.
```

### Vocabulaire métier (dossier/dossiers)

**Fichier** : `src/hooks/use-metier-vocabulaire.ts`
- STATIC_MAP avec 24 secteurs : dossier → label personnalisé (Véhicule, Mandat, Chantier, etc.)
- Requête DB `metier_vocabulaire` pour overrides personnalisés

**Fichier** : `src/data/sectorModules.ts`
- Module overrides : labels personnalisés pour TOUS les modules (dossiers, taches, stock, etc.) par secteur
- 24 configurations sectorielles complètes

### Écarts

| Point Bible | État | Détail |
|---|---|---|
| Nom employé par secteur (Mécanicien, Moniteur, Coach, etc.) | **PARTIEL** | `SECTOR_ROLE_LABELS` existe mais pas pour tous les secteurs et pas utilisé systématiquement dans l'UI |
| Nom client par secteur (Élève, Mariée, Propriétaire, Membre) | **PARTIEL** | Existe pour ~20 secteurs, manque les 3-4 nouveaux |
| Labels modules par secteur (28 modules × 24 secteurs) | **OK** | `sectorModules.ts` très complet |
| Étapes de timeline par secteur | **OK** | `sectorTimelines.ts` avec 2-4 presets par secteur |

---

## 5. MODULES EXISTANTS

### Catalogue actuel

**Fichier** : `src/contexts/DemoPlanContext.tsx` (ALL_MODULE_KEYS)
```ts
ALL_MODULE_KEYS = [
  "overview", "clients", "employees", "dossiers", "pipeline",
  "facturation", "relances", "stock", "messagerie", "emails",
  "rendez-vous", "agenda", "taches", "support", "notes",
  "analyse", "rapports", "documents", "temps", "automatisations",
  "ia", "parametres"
]  // 22 modules
```

**Fichier** : `src/hooks/use-app-settings.ts` (ALL_ADMIN_MODULES)
```ts
ALL_ADMIN_MODULES = [
  overview, clients, employees, dossiers, messagerie, facturation,
  relances, emails, rendez-vous, support, stock, analyse, taches,
  agenda, rapports, documents, temps, automatisations, notes,
  pipeline, ia, parametres
]  // 22 modules + fournisseurs (dans sidebar mais pas dans ALL_MODULE_KEYS)
```

### Modules dans la sidebar Admin

**Fichier** : `src/components/admin/AdminSidebar.tsx`
- Groupes : **Principal** (overview, clients, employees, dossiers), **Commercial** (pipeline, facturation, relances, stock, fournisseurs), **Outils** (messagerie, emails, rendez-vous, agenda, taches, support, notes), **Gestion** (analyse, rapports, documents, temps, automatisations, ia, parametres)
- + Section « Espaces personnalisés » (Enterprise uniquement)

### Pages Admin existantes (28)

```
AdminDashboard, AdminClients, AdminDossiers, AdminDossierDetail,
AdminMessaging, AdminBilling, AdminReminders, AdminEmails,
AdminSupport, AdminRendezVous, AdminEmployees, AdminStock,
AdminTaches, AdminAgenda, AdminRapports, AdminDocuments,
AdminTemps, AdminAutomatisations, AdminNotes, AdminPipeline,
AdminIA, AdminFournisseurs, AdminAnnonces, AdminSettings,
AdminUpgrade, AdminAnalytics, ClientSignup, AdminLogin
```

### Pages Client existantes (13)

```
ClientDashboard, ClientDossiers, ClientDossierDetail, ClientDemandes,
ClientDevis, ClientFactures, ClientMessaging, ClientProfile,
ClientSupport, ClientPaiement, ClientSettings, ClientRendezVous,
ClientUpgrade (non routé)
```

### Pages Employé existantes (13)

```
EmployeeDashboard, EmployeeClients, EmployeeDossiers, EmployeeCalendrier,
EmployeeMessaging, EmployeeFacturation, EmployeeRelances, EmployeeEmails,
EmployeeRendezVous, EmployeeSupport, EmployeeStock, EmployeeAnalyse,
EmployeeProfile
```

### Modules manquants (Bible vs code)

| Module Bible | Existe ? | Détail |
|---|---|---|
| Facturation jalons | **PARTIEL** | Le label existe dans les overrides dev mais pas de logique spécifique |
| Messagerie groupée | **MANQUANT** | La messagerie existe mais pas le mode groupé (employé → multiples) |
| Signature électronique | **PARTIEL** | `SignaturePad.tsx` existe mais pas un module complet |
| Formulaires | **MANQUANT** | Pas de module dédié |
| Avis client auto | **MANQUANT** | Pas de module d'avis automatiques |
| Abonnement récurrent | **MANQUANT** | Pas de gestion d'abonnements clients |
| Livrables | **PARTIEL** | Label existe dans overrides, pas de page dédiée |
| Sprints & Tickets | **PARTIEL** | Label existe pour dev, pas de page dédiée |
| Time Tracking | **OK** | Page `AdminTemps` existe |
| Dashboard métier | **OK** | L'analyse s'adapte via overrides |
| White Label | **OK** | `useWhiteLabel` hook + settings |
| Intelligence IA | **OK** | Page `AdminIA` avec conversations AI |

---

## 6. FICHE DOSSIER DÉTAIL

### Existant

**Fichier** : `src/pages/admin/AdminDossierDetail.tsx` (607 lignes)

#### Sections présentes :
1. **En-tête** : Référence, type prestation, client, statut (select), bouton annulation, résumé IA
2. **Info cards** : Montant, date création, échéance, client (grille 4 colonnes)
3. **Équipe assignée** : Panel avec Avatar, rôle (Responsable/Renfort), étoile, retirer
4. **DossierTeamPanel** : Panel N-to-N (table `dossier_employe`)
5. **Progression** : Stepper horizontal 8 étapes codées en dur (Demande → Terminé)
6. **DossierTimeline** : Timeline personnalisable avec templates (`use-timeline.ts`)
7. **Cahier des charges** : CahierDesChargesView (si lié à une demande)
8. **Preview Link** : URL de preview + historique des visites
9. **Devis associés** : Liste des devis liés
10. **Factures associées** : Liste des factures liées

#### Onglets présents : **AUCUN** (pas de système d'onglets, tout est en scroll vertical)

### Écarts Bible (8 onglets obligatoires)

| Onglet Bible | État | Détail |
|---|---|---|
| Résumé | **PARTIEL** | Infos et progression sont là mais pas dans un onglet |
| RDV | **MANQUANT** | Pas d'onglet RDV dans la fiche dossier |
| Paiements | **PARTIEL** | Factures/devis listés mais pas dans un onglet dédié |
| Documents | **MANQUANT** | Pas d'onglet documents dans la fiche |
| Photos | **MANQUANT** | Pas d'onglet photos |
| Mesures | **MANQUANT** | Pas d'onglet mesures (mensurations, dimensions, etc.) |
| Messages | **MANQUANT** | Pas de messagerie intégrée dans la fiche |
| Notes | **MANQUANT** | Pas d'onglet notes dans la fiche |

### À créer
1. Refondre la fiche avec un système de Tabs (8 onglets)
2. Créer les onglets manquants : RDV, Documents, Photos, Mesures, Messages, Notes
3. Regrouper les infos existantes dans les onglets appropriés

---

## 7. TIMELINE PAR SECTEUR

### Existant

**Fichier** : `src/data/sectorTimelines.ts` (430 lignes)

25 secteurs configurés avec 1-4 presets chacun :

| Secteur | Nb presets | Premier preset (steps) |
|---|---|---|
| generic | 1 | 8 étapes (Demande reçue → Terminé) |
| garages | 3 | 7 (Véhicule reçu → Terminé), 11, 9 |
| btp | 4 | 7 (Devis envoyé → Solde réglé), 16, 10, 7 |
| immobilier | 4 | 6, 14, 8, 9 |
| coiffure | 3 | 6, 8, 9 |
| mariage | 3 | 8 (RDV Pris → Terminée), 13, 10 |
| auto-ecole | 2 | 8 (Inscription → Diplômé), 9 |
| cabinet-avocats | 2 | 8 (Consultation → Clôturé), 8 |
| expert-comptable | 2 | 8, 8 |
| ... | | |

### Concordance Bible

Le premier preset de chaque secteur est généralement la timeline « client-facing » (visible dans l'espace client). Les presets supplémentaires sont des variantes détaillées.

**⚠ À vérifier** : Comparer étape par étape avec les timelines exactes de la Bible pour chaque secteur.

---

## 8. MODULES PRÉ-SÉLECTIONNÉS PAR SECTEUR

### Existant

**Fichier** : `src/contexts/DemoPlanContext.tsx` lignes 64-89

```ts
DEFAULT_SECTOR_RECOMMENDATIONS = {
  "auto-ecole": ["clients", "rendez-vous", "dossiers", "facturation", "stock", "relances", "analyse", "employees"],
  garages: ["clients", "dossiers", "facturation", "stock", "rendez-vous", "relances", "support", "taches"],
  btp: ["dossiers", "clients", "facturation", "stock", "relances", "taches", "documents", "temps"],
  // ... 24 secteurs avec 8 modules recommandés chacun
}
```

### Écarts
- La Bible demande **6 modules** recommandés par secteur (pour Business), le code en liste **8**
- Certains modules recommandés dans la Bible (ex: « Signature électronique ») n'existent pas dans le code
- Les recommandations ne sont pas utilisées dans le wizard d'onboarding actuel

---

## 9. ESPACES (Admin / Employé / Client)

### Espace Admin

**Sidebar** : `src/components/admin/AdminSidebar.tsx` (279 lignes)
- 4 groupes : Principal, Commercial, Outils, Gestion
- Sélecteur de secteur démo (dropdown)
- Plan badge en footer
- Espaces personnalisés (Enterprise)

**Fonctionnalités Admin** :
- CRUD complet sur clients, dossiers, factures, devis, relances
- Messagerie, emails (V1+V2), support/tickets
- IA (conversations avec modèles), automatisations
- Stock/produits, fournisseurs, bons de commande
- Analytics, rapports, documents, notes, agenda, tâches
- Gestion employés, rôles & permissions (F-03)
- Timeline personnalisable, annonces
- Pipeline CRM, rendez-vous (Calendly intégré)

### Espace Employé

**Sidebar** : `src/components/admin/EmployeeSidebar.tsx` (121 lignes)
- Navigation plate (pas de groupes)
- 13 modules : overview, clients, dossiers, calendrier, messagerie, facturation, relances, emails, rendez-vous, support, stock, analyse, profil

**Restrictions actuelles** :
- Accès filtré par `employeeVisibleModules` (app_settings)
- Modules cachés via `isModuleHidden`
- Permissions granulaires via `check_permission` RPC

**Restrictions manquantes (Bible)** :
- ❌ Avancer timeline seulement sur plan Business/Enterprise
- ❌ Pas de restriction « voir uniquement ses propres dossiers » systématique

### Espace Client

**Sidebar** : `src/components/admin/ClientSidebar.tsx` (127 lignes)
- 10 modules : overview, dossiers, demandes, devis, factures, messagerie, rendez-vous, support, profil, paramètres

**Restrictions actuelles** :
- Accès filtré par `clientVisibleModules`
- RLS : `client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())`

**Restrictions manquantes (Bible)** :
- ❌ Messagerie : client ne peut écrire qu'à l'admin (pas aux employés)
- ❌ Timeline : lecture seule (pas d'avancement)

### Espace SuperAdmin

**Routes** : 7 pages
- Dashboard, Entreprises (liste + détail), Abonnements, Formules, Stats, Secteurs

---

## 10. AUTHENTIFICATION & RÔLES

### Existant

**Table** : `user_roles` avec enum `app_role` (admin, employee, client)
**Fonctions DB** :
- `has_role(_user_id, _role)` — vérifie le rôle
- `check_permission(_user_id, _permission_code)` — vérifie permission granulaire
- `get_user_compte_id()` — résout le tenant (admin → self, employee/client → compte_id)
- `handle_new_user()` — trigger : crée profil + rôle client + fiche client automatiquement

**Mode démo** : `DemoAuthContext.tsx`
- 4 comptes mock (admin, client, employee, superadmin) avec mot de passe `demo2026`
- `useIsDemo()` hook pour distinguer démo vs Supabase auth

### Edge Functions Auth

| Fonction | Rôle |
|---|---|
| `create-client-account` | Créer un compte client (signup) |
| `create-employee-account` | Créer un compte employé (admin action) |
| `generate-account-structure` | Onboarding : créer rôles + vocabulaire |
| `send-password-reset` | Réinitialisation mot de passe |
| `send-signup-confirmation` | Confirmation d'inscription |

---

## 11. PERMISSIONS GRANULAIRES (F-03)

### Existant

**Tables** : `permissions` (11 permissions), `roles`, `role_permissions`, `employe_role`, `audit_permissions`

**Permissions** :
```
voir_analytique_complete, assigner_dossiers, modifier_roles,
gerer_facturation, gerer_employes, exporter_donnees,
+ 5 autres définies dans la table permissions
```

**Hook** : `src/hooks/use-permission.ts`
- `usePermission(code)` — vérifie une permission
- `usePermissions(codes[])` — vérifie plusieurs permissions

**UI** : `src/components/admin/RolesPermissionsSettings.tsx` — interface de gestion des rôles et droits

### Écarts
- ❌ Pas de mapping module → droits par rôle (la Bible demande des droits spécifiques Admin/Salarié/Client par module)
- ❌ Pas de restriction par plan (ex: « avancer timeline = Business+ pour salarié »)

---

## 12. MULTI-TENANT

### Existant

- **Colonne `compte_id`** sur 36+ tables
- **Trigger `set_compte_id_on_insert`** sur toutes les tables
- **RLS restrictive** : `(compte_id IS NULL) OR (compte_id = get_user_compte_id())`
- **Hook `useCompteId`** : résolution côté frontend

**Status** : ✅ Conforme

---

## 13. EMAILS & CAMPAGNES

### Existant

**Tables** : `email_templates`, `email_logs`, `campagnes_email`, `emails_planifies`, `email_events`

**Edge Functions** :
- `send-bulk-email` — envoi de masse
- `send-campaign-email` — envoi de campagne
- `process-scheduled-emails` — CRON pour emails planifiés
- `suggest-email` — suggestion IA
- `brevo-webhook` — réception webhooks Brevo

**UI** : `AdminEmails.tsx` avec onglets Composer, Planifiés, Historique + filtres avancés (V2)

**Filtres V2** :
- Statut (prospect, actif, inactif, archivé)
- Inactivité (slider jours)
- Montant facturé (min/max)
- Tags

**Status** : ✅ Module V2 complet

---

## 14. DONNÉES DE DÉMONSTRATION

### Existant

25 fichiers mock dans `src/data/` :
```
mockAutoEcoleData, mockAvocatData, mockBTPData, mockBoutiqueData,
mockCMData, mockCoiffureData, mockComptableData, mockConciergerieData,
mockConsultantData, mockDJData, mockData (générique), mockDesignerData,
mockDevData, mockEnterprises, mockEvenementielData, mockFormateurData,
mockGarageData, mockImmobilierData, mockMariageData, mockNettoyageData,
mockPhotographeData, mockRecrutementData, mockReparateurData,
mockSportData, mockTraiteurData
```

**DemoDataContext** : Gère les données mock en mémoire avec CRUD

### Écarts
- ❌ Les données ne sont pas systématiquement cohérentes avec les noms métier (ex: client s'appelle « Dupont » dans tous les secteurs)
- ❌ Pas de données démo pour les secteurs manquants (centre-islamique, association-sportive)

---

## 15. COMPORTEMENTS UI

### Existant
- **Toasts** : Sonner (confirmation, erreur, info)
- **Modals** : AlertDialog pour actions destructrices
- **Loading** : LoadingScreen au démarrage
- **Responsive** : `MobileBottomNav` + sidebar collapsible
- **Animations** : Framer Motion (page transitions, stagger animations)
- **Design system** : Glass cards, gradient noise, couleurs HSL dans index.css

### Écarts
| Point Bible | État |
|---|---|
| États vides avec message + bouton d'action | **PARTIEL** — `AdminEmptyState.tsx` existe mais pas utilisé partout |
| Tout lien cliquable et fonctionnel | **PARTIEL** — Quelques liens « mock » sans navigation |
| Confirmation sur actions destructrices | **OK** |

---

## 16. ESPACES PERSONNALISÉS

### Existant

**Table** : `custom_spaces` (id, name, user_id, base_role, enabled_modules, sort_order, compte_id)
**Hook** : `src/hooks/use-custom-spaces.ts`
**UI** : Section dans AdminSidebar (Enterprise uniquement)

### Écarts
- ❌ Pas de pré-configuration d'espaces recommandés par secteur (Bible : Conseillère, Retoucheuse pour mariage, etc.)
- ❌ Pas d'espace personnalisé pour le plan Business (Bible : Business et Enterprise)

---

## 17. WHITE LABEL

### Existant
- **Hook** : `src/hooks/use-white-label.tsx` avec `WhiteLabelProvider`
- **Settings** : Nom de marque, logo, couleurs
- **Preview** : `WhiteLabelPreview.tsx`
- **Restriction** : Enterprise uniquement (`canWhiteLabel: plan === "enterprise"`)

**Status** : ✅ Conforme

---

## 18. EDGE FUNCTIONS DÉPLOYÉES

| Fonction | Description | Status |
|---|---|---|
| `ai-chat` | Conversations IA (multi-modèles) | ✅ |
| `brevo-webhook` | Webhooks Brevo (email events) | ✅ |
| `calendly-events` | Sync événements Calendly | ✅ |
| `create-client-account` | Création compte client | ✅ |
| `create-employee-account` | Création compte employé | ✅ |
| `generate-account-structure` | Onboarding structure | ✅ |
| `process-scheduled-emails` | CRON emails planifiés | ✅ |
| `send-bulk-email` | Envoi email de masse | ✅ |
| `send-campaign-email` | Envoi campagne | ✅ |
| `send-demande-reception` | Email réception demande | ✅ |
| `send-demande-statut` | Email changement statut | ✅ |
| `send-devis` | Envoi devis par email | ✅ |
| `send-paiement` | Email confirmation paiement | ✅ |
| `send-password-reset` | Reset mot de passe | ✅ |
| `send-relance` | Email de relance | ✅ |
| `send-signup-confirmation` | Confirmation inscription | ✅ |
| `suggest-email` | Suggestion email IA | ✅ |

---

## 19. TABLES SUPABASE (RÉSUMÉ)

### Tables métier (avec compte_id + RLS)

| Table | Description | Nb colonnes |
|---|---|---|
| `clients` | Fiches clients | 20 |
| `dossiers` | Dossiers/projets | 16 |
| `factures` | Factures | 15 |
| `devis` | Devis | 17 |
| `relances` | Relances impayés | 12 |
| `employees` | Fiches employés | 14 |
| `conversations` | Conversations messagerie | 9 |
| `messages` | Messages (dans conversations) | 11 |
| `notifications` | Notifications | 12 |
| `evenements_calendrier` | Événements calendrier | 11 |
| `events_manuels` | Événements manuels | 11 |
| `produits` | Produits/stock | 15 |
| `product_categories` | Catégories produits | 7 |
| `fournisseurs` | Fournisseurs | 12 |
| `bons_commande` | Bons de commande | 11 |
| `bon_commande_lignes` | Lignes de BC | 7 |
| `stock_mouvements` | Mouvements de stock | 9 |
| `demandes` | Demandes clients | 14 |
| `cahiers_des_charges` | CDC liés aux demandes | 21 |
| `cdc_historique` | Historique CDC | 7 |
| `service_categories` | Catégories de services | 7 |
| `email_templates` | Templates email | 8 |
| `email_logs` | Logs d'envoi email | 9 |
| `campagnes_email` | Campagnes email | 9 |
| `emails_planifies` | Emails programmés | 12 |
| `email_events` | Events email (webhook) | 8 |
| `donnees_mensuelles` | KPIs mensuels | 13 |
| `objectifs_mensuels` | Objectifs CA | 5 |
| `tags` | Tags pour clients | 5 |
| `client_tags` | Association client-tag | 5 |
| `client_dossier` | Association client-dossier | 5 |
| `dossier_employe` | Association dossier-employé | 6 |
| `dossier_timeline` | Timeline de suivi | 9 |
| `employe_role` | Association employé-rôle | 5 |
| `annonces` | Annonces internes | 11 |
| `annonce_lecture` | Lectures d'annonces | 3 |
| `send_logs` | Logs d'envoi docs | 6 |
| `preview_visits` | Visites de preview | 5 |
| `demandes_indisponibilite` | Congés employés | 10 |
| `ai_conversations` | Conversations IA | 7 |
| `ai_messages` | Messages IA | 6 |
| `metier_vocabulaire` | Vocabulaire métier | 6 |
| `custom_spaces` | Espaces personnalisés | 8 |

### Tables système

| Table | Description |
|---|---|
| `app_settings` | Paramètres (modules activés, onboarding, etc.) |
| `profiles` | Profils utilisateurs (nom, tel) |
| `subscriptions` | Abonnements (plan, modules, secteur) |
| `roles` | Rôles personnalisés |
| `permissions` | Permissions système |
| `role_permissions` | Matrice rôle-permission |
| `audit_permissions` | Historique modifications permissions |
| `user_roles` | Rôles auth (admin, employee, client) |
| `timeline_templates` | Templates de timeline (si existant en DB) |

---

## 20. RÉCAPITULATIF DES PRIORITÉS

### 🔴 Critiques (non conformes à la Bible)

1. **Onboarding** : Refondre en 4 étapes Bible (Formule → Secteur catégorisé → Modules → Compte)
2. **Socle fixe** : Clients & Dossiers + Analyse hors quota
3. **Fiche dossier** : Ajouter les 8 onglets obligatoires
4. **Secteurs manquants** : 2-3 secteurs à ajouter
5. **Modules verrouillés** : UI grisée + modal upsell dans sidebar

### 🟡 Importants (partiellement conformes)

6. **Vocabulaire nom employé/client** : Compléter et utiliser systématiquement
7. **Messagerie** : Restrictions par rôle (client → admin uniquement)
8. **Timeline Business+** : Restriction avancer étapes pour employés
9. **Modules pré-sélectionnés** : Aligner avec les 6 recommandations Bible
10. **États vides** : Systématiser les empty states avec actions

### 🟢 Conformes

11. Architecture multi-tenant ✅
12. Permissions granulaires F-03 ✅
13. Prix des 3 offres ✅
14. Labels modules par secteur ✅
15. Timeline presets par secteur ✅
16. Emails V2 (programmation + filtres + historique) ✅
17. Responsive mobile ✅
18. White Label (Enterprise) ✅
19. IA intégrée ✅
20. Système de swap de modules ✅

---

Ce document est la référence complète de l'état du projet MBA. Il peut être partagé avec Claude ou tout autre assistant pour guider les prochaines implémentations.
