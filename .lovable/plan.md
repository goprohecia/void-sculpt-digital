
# My Business Assistant - Plan de transformation

## Vue d'ensemble

Transformation du back-office "Impartial" en une plateforme SaaS modulable **"My Business Assistant"** avec 3 espaces (Admin, Salarie, Client) et une navigation configurable par l'admin dans les parametres.

---

## Phase 1 : Rebranding et navigation configurable

### 1.1 Rebranding "Impartial" vers "My Business Assistant"
- Renommer toutes les references "Impartial" / "IM" dans `AdminSidebar.tsx`, `ClientSidebar.tsx`, `AdminSettings.tsx`, `DemoAuthContext.tsx`, `Header.tsx`, `Footer.tsx`
- Mettre a jour les comptes demo : `admin@mba.demo`, `client@mba.demo`
- Remplacer le logo "IM" par "MBA" dans les sidebars

### 1.2 Systeme de modules configurables (Settings)
- Ajouter un onglet **"Modules"** dans `AdminSettings.tsx` avec des switches pour activer/desactiver chaque section de navigation :
  - Vue d'ensemble, Clients, Produits/Services, Dossiers, Salaries, Facturation, Relances, Calendrier, Analyse, Emails, Messagerie, Support, Parametres
- Stocker la configuration dans une nouvelle table `app_settings` (cle/valeur JSON) en base de donnees
- Creer un hook `use-app-settings.ts` qui recupere les modules actifs
- Filtrer dynamiquement les `navItems` dans `AdminSidebar.tsx`, `ClientSidebar.tsx` et le futur `EmployeeSidebar.tsx` en fonction des modules actifs
- L'admin peut aussi configurer quels onglets apparaissent cote client et cote salarie

### Schema de la table :
```text
app_settings
  id         uuid (PK)
  key        text (unique) -- ex: "enabled_modules", "client_visible_modules", "employee_visible_modules"
  value      jsonb         -- ex: ["clients","dossiers","facturation",...]
  updated_at timestamptz
```

---

## Phase 2 : Espace Salarie (nouveau dashboard)

### 2.1 Table `employees` et role `employee`
- Ajouter le role `'employee'` au type enum `app_role`
- Creer la table `employees` :
```text
employees
  id              uuid (PK)
  user_id         uuid (ref auth.users)
  nom             text
  prenom          text
  email           text
  telephone       text
  poste           text
  date_embauche   timestamptz
  statut          text (actif/inactif)
  acces_modules   jsonb  -- modules auxquels le salarie a acces
  created_at      timestamptz
  updated_at      timestamptz
```
- Politiques RLS : admin full CRUD, employee lecture de son propre profil

### 2.2 Pages salarie
- `src/pages/employee/EmployeeDashboard.tsx` -- tableau de bord personnel
- `src/pages/employee/EmployeeDossiers.tsx` -- dossiers assignes
- `src/pages/employee/EmployeeCalendrier.tsx` -- planning/horaires
- `src/pages/employee/EmployeeMessaging.tsx` -- messagerie avec admin
- `src/pages/employee/EmployeeProfile.tsx` -- profil personnel
- `src/components/admin/EmployeeLayout.tsx` -- layout avec sidebar filtree
- `src/components/admin/EmployeeSidebar.tsx` -- navigation salarie

### 2.3 Gestion des salaries cote admin
- `src/pages/admin/AdminEmployees.tsx` -- liste, creation, edition, suppression des salaries
- Attribution des droits d'acces par salarie (quels modules il peut voir, quelles donnees d'activite)
- Possibilite d'inviter un salarie (creation de compte avec role employee)

### 2.4 Routes et auth
- Ajouter les routes `/employee/*` dans `AnimatedRoutes.tsx`
- Ajouter `"employee"` au type `DemoRole` dans `DemoAuthContext.tsx` + compte demo `employee@mba.demo`
- Fonction `handle_new_employee` ou mise a jour de `handle_new_user` pour gerer le role employee

---

## Phase 3 : Nouveaux modules metier

### 3.1 Produits / Services
- Table `products` :
```text
products
  id            uuid (PK)
  nom           text
  description   text
  categorie     text
  prix_achat    numeric
  prix_vente    numeric
  stock         integer (nullable)
  statut        text (actif/inactif)
  created_at    timestamptz
  updated_at    timestamptz
```
- Table `expenses` (depenses) :
```text
expenses
  id          uuid (PK)
  libelle     text
  montant     numeric
  categorie   text
  date        timestamptz
  created_at  timestamptz
```
- Page `AdminProducts.tsx` avec vue catalogue, marge calculee automatiquement (prix_vente - prix_achat)
- Route `/admin/produits`

### 3.2 Tags clients
- Table `client_tags` : `id`, `nom`, `couleur`
- Table `client_tag_assignments` : `client_id`, `tag_id`
- Ajout dans `AdminClients.tsx` : affichage des tags, filtrage par tag, attribution multi-tags
- Segmentation client/prospect via un champ `type` ("client" / "prospect") dans la table `clients`

### 3.3 Dossiers ameliores
- Ajouter `assigned_employee_id` (uuid, nullable) dans la table `dossiers` pour assigner un salarie
- Ajouter `product_id` (uuid, nullable) pour lier a un produit/service
- Filtres avances dans `AdminDossiers.tsx` : par tag client, statut, montant min/max, salarie assigne

### 3.4 Calendrier unifie
- Remplacer le simple calendrier d'echeances par un vrai calendrier :
  - Rendez-vous, evenements, planning employes
  - Vue mensuelle/hebdomadaire
- Table `calendar_events` : `id`, `titre`, `description`, `date_debut`, `date_fin`, `type` (rdv/evenement/planning), `employee_id`, `client_id`, `created_at`

### 3.5 Emails ameliores
- Table `email_templates` : `id`, `nom`, `sujet`, `contenu_html`, `created_at`
- Envoi de masse avec filtres (par tag, statut client, etc.)
- Programmation d'envoi differe (champ `scheduled_at` dans `email_logs`)
- Aide a la redaction IA via Lovable AI (Gemini)

### 3.6 Relances ameliorees
- Pop-up d'envoi avec editeur de mail integre
- Selection de template pre-enregistre
- Aide IA pour rediger la relance
- Facture jointe automatiquement

### 3.7 Facturation personnalisable
- Champ `logo_url` et `mentions_legales` dans `app_settings` pour customiser les factures
- Apercu PDF avec logo integre

---

## Phase 4 : Configuration des espaces client et salarie

### 4.1 Parametres admin pour les espaces
- Dans l'onglet "Modules" des parametres, l'admin definit :
  - Quels onglets apparaissent dans l'espace client
  - Quels onglets apparaissent dans l'espace salarie
- Chaque `EmployeeSidebar` et `ClientSidebar` filtre ses `navItems` en fonction de ces settings

---

## Ordre d'implementation recommande

Etant donne l'ampleur du projet, je recommande de proceder par **etapes incrementales** :

1. **Etape 1** : Rebranding + table `app_settings` + onglet Modules dans Parametres + filtrage dynamique de la navigation admin
2. **Etape 2** : Table `employees` + role employee + pages salarie + gestion salaries cote admin
3. **Etape 3** : Module Produits/Services + Tags clients + Dossiers ameliores
4. **Etape 4** : Calendrier unifie + Emails ameliores (templates, masse, IA) + Relances ameliorees
5. **Etape 5** : Configuration des espaces client/salarie depuis les parametres

---

## Details techniques

- **Migrations DB** : 4-5 migrations pour les nouvelles tables et modifications d'enum
- **Nouvelles pages** : environ 8-10 nouvelles pages React
- **Nouveaux hooks** : `use-app-settings`, `use-employees`, `use-products`, `use-expenses`, `use-client-tags`, `use-calendar-events`, `use-email-templates`
- **Edge functions** : mise a jour de `send-signup-confirmation` pour gerer le role employee, nouvelle function pour l'aide IA a la redaction
- **Securite** : RLS sur toutes les nouvelles tables, role employee dans `user_roles`

Souhaitez-vous approuver ce plan pour demarrer l'implementation par l'etape 1 (rebranding + modules configurables) ?
