

# Back-Office Admin -- Plan de developpement

## Vue d'ensemble

Creation d'un espace back-office complet avec un systeme d'acces demo, integre au design system existant (glassmorphism, violet neon). Le back-office sera accessible via `/admin` et completement separe du site vitrine public.

---

## Phase 1 : Infrastructure et acces demo

### 1.1 Page de connexion demo (`/admin/login`)
- Page de login stylisee avec le design glassmorphism existant
- Deux comptes demo pre-configures :
  - **Admin** : `admin@impartial.demo` / `demo2026`
  - **Client** : `client@impartial.demo` / `demo2026`
- Stockage de la session demo en `sessionStorage` (pas de vrai auth pour la phase demo)
- Redirection vers le dashboard admin ou client selon le role choisi

### 1.2 Layout Admin (`AdminLayout`)
- Sidebar laterale avec navigation (composant `SidebarProvider` existant)
- Header avec nom de l'utilisateur, role, et bouton de deconnexion
- Zone de contenu principale responsive
- Design glassmorphism coherent avec le site vitrine

---

## Phase 2 : Espace Admin -- 6 rubriques

### 2.1 Vue d'ensemble (`/admin`)
Tableau de bord avec widgets KPI :
- Chiffre d'affaires du mois
- Nombre de dossiers actifs
- Nouveaux clients ce mois
- Factures en attente
- Mini-graphique de tendance CA (sparkline)
- Liste des dernieres activites (timeline)
- Dossiers recents avec statut

### 2.2 Clients (`/admin/clients`)
- Tableau listant tous les clients (nom, email, telephone, nombre de dossiers, statut)
- Barre de recherche et filtres (statut : actif/inactif)
- Vue detail d'un client avec ses dossiers associes
- Actions : voir, modifier, archiver

### 2.3 Dossiers (`/admin/dossiers`)  
- Tableau des dossiers avec colonnes : reference, client, type de prestation, montant, statut, date
- Filtres par statut (en cours, termine, en attente, annule)
- Badges de statut colores
- Actions rapides

### 2.4 Messagerie (`/admin/messagerie`)
- Interface type boite de reception avec liste de conversations a gauche et detail a droite
- Conversations groupees par client
- Indicateur de messages non lus
- Zone de reponse avec textarea

### 2.5 Facturation (`/admin/facturation`)
- Liste des factures avec reference, client, montant, statut (payee, en attente, en retard), date
- Filtres par statut de paiement
- Indicateurs visuels : pastilles couleur (vert = payee, orange = en attente, rouge = en retard)
- Resume en haut : total facture, total encaisse, en attente

### 2.6 Relances (`/admin/relances`)
- Liste des relances programmees et effectuees
- Statut : a envoyer, envoyee, reponse recue
- Lien vers la facture et le client concernes
- Calendrier des prochaines relances

### 2.7 Analyse (`/admin/analyse`)
Section analytique complete avec les graphiques suivants (utilisant Recharts, deja installe) :

**KPIs principaux :**
- Chiffre d'affaires total
- Encaissements
- Nouveaux dossiers
- Nouveaux clients

**Tendances Mensuelles 2026 (tableau) :**
- Objectif mensuel
- CA Total
- Encaissements
- Dossiers
- Panier Moyen

**Graphiques :**
- Evolution du CA (graphique en courbes, mois par mois)
- Analyse quantitative des ventes : Qte dossiers, CA total, Panier moyen, Conversion (graphique en barres)
- Evolution du panier moyen et taux de conversion (graphique double axe)

---

## Phase 3 : Donnees de demo

Toutes les pages utiliseront des donnees fictives realistes pour permettre la visualisation :
- 12 clients fictifs avec des noms credibles
- 25 dossiers repartis sur les clients
- 15 factures avec differents statuts
- 8 relances avec differents etats
- 10 conversations de messagerie
- Donnees analytiques mensuelles janvier-decembre 2026

---

## Details techniques

### Nouveaux fichiers a creer

```text
src/
  contexts/
    DemoAuthContext.tsx          -- Contexte d'authentification demo
  pages/
    admin/
      AdminLogin.tsx             -- Page de connexion demo
      AdminDashboard.tsx         -- Vue d'ensemble
      AdminClients.tsx           -- Gestion clients
      AdminDossiers.tsx          -- Gestion dossiers
      AdminMessaging.tsx         -- Messagerie
      AdminBilling.tsx           -- Facturation
      AdminReminders.tsx         -- Relances
      AdminAnalytics.tsx         -- Section analyse
  components/
    admin/
      AdminLayout.tsx            -- Layout avec sidebar
      AdminSidebar.tsx           -- Navigation laterale
      DashboardKPI.tsx           -- Widgets KPI reutilisables
      StatusBadge.tsx            -- Badges de statut
  data/
    mockData.ts                  -- Donnees fictives centralisees
```

### Fichiers existants a modifier

- `src/components/AnimatedRoutes.tsx` -- Ajout des routes `/admin/*`
- `src/App.tsx` -- Ajout du `DemoAuthProvider`

### Librairies utilisees (deja installees)
- `recharts` pour les graphiques analytiques
- `lucide-react` pour les icones
- `framer-motion` pour les animations
- Composants UI Shadcn existants (Table, Card, Badge, Tabs, etc.)
- `SidebarProvider` / `Sidebar` existants

### Design
- Meme design system glassmorphism que le site vitrine
- Palette de couleurs coherente (violet neon, fond sombre)
- Cards en `glass-card` / `glass-surface`
- Typographie Montserrat coherente
- Responsive (desktop-first pour le back-office, fonctionnel sur tablette/mobile)

### Securite
- Phase demo : pas de connexion reelle a la base de donnees
- Session stockee en `sessionStorage` (supprimee a la fermeture du navigateur)
- Protection des routes admin via un composant `ProtectedRoute`
- Les tables de base de donnees seront creees dans une phase ulterieure quand les demos seront validees

