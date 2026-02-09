
# Optimisation responsive tablette et mobile -- Espaces admin et client

## Contexte
L'application back-office (admin + client) utilise deja certaines bases responsives (sidebar collapsible via SidebarProvider, quelques classes `hidden sm:block` / `sm:hidden`). Cependant, plusieurs pages et composants ne sont pas optimises pour les formats tablette (768-1024px) et mobile (<768px).

## Pages et composants a optimiser

### 1. AdminClients -- Tableau clients (priorite haute)
- Le tableau avec 8 colonnes (Client, Email, Tel, SIRET, Ville, Dossiers, Statut, Actions) deborde sur tablette
- **Solution** : Ajouter une vue mobile en cards (comme deja fait dans AdminDossiers et ClientDossiers) avec `sm:hidden` / `hidden sm:block`
- Ajuster la visibilite des colonnes : Email visible a `md:`, Tel a `lg:`, SIRET et Ville a `xl:` (deja fait)

### 2. AdminBilling -- Facturation (priorite haute)
- Les tableaux factures et devis n'ont pas de vue mobile en cards
- Les boutons "Facture" et "Devis" + filtres s'empilent mal sur mobile
- **Solution** : Ajouter des vues mobile en cards pour les deux tableaux, ajuster le layout des boutons d'action

### 3. AdminReminders -- Relances (priorite moyenne)
- La grille `lg:grid-cols-3` passe directement en colonne unique, pas de vue mobile pour le tableau de relances
- **Solution** : Ajouter une vue cards mobile pour le tableau des relances

### 4. AdminDashboard -- Vue d'ensemble (priorite moyenne)
- Le calendrier des echeances : la legende (Dossiers/Factures/Relances) est trop compacte sur mobile
- Le tableau dossiers recents est deja responsive
- **Solution** : Empiler la legende du calendrier sous le titre sur mobile, ajuster le padding

### 5. AdminAnalytics -- Analyse (priorite moyenne)
- Les boutons d'export (PDF, Factures CSV, Demandes CSV, Clients CSV) s'empilent mal sur petit ecran
- Le tableau des tendances mensuelles a deja un scroll horizontal
- **Solution** : Ajuster les boutons d'export en grille flexible, reduire la taille du texte sur mobile

### 6. AdminSupport -- Support (priorite basse)
- La zone de filtre avec le select client peut deborder
- **Solution** : Passer les filtres en colonne sur mobile

### 7. DashboardKPI -- Composant KPI (priorite moyenne)
- Le padding `p-6` est trop genereux sur mobile
- La taille du texte `text-2xl` est trop grande sur petit ecran pour les KPI en grille 2 colonnes
- **Solution** : Reduire le padding a `p-4 sm:p-6`, ajuster la taille de la valeur a `text-xl sm:text-2xl`

### 8. ClientDossierDetail et AdminDossierDetail (priorite basse)
- Verifier que les details s'affichent bien en colonne sur mobile

## Details techniques

### AdminClients -- Ajout vue mobile cards
- Ajouter `hidden sm:block` sur la `glass-card` contenant le tableau
- Ajouter un bloc `sm:hidden` avec des cards iterant sur `filtered`, affichant nom, entreprise, statut, nombre de dossiers, et un bouton "Voir"

### AdminBilling -- Vue mobile
- Meme pattern : `hidden sm:block` sur les tables, `sm:hidden` avec cards pour factures et devis
- Ajuster la zone de boutons avec `flex flex-wrap gap-2`
- Les cards factures montreront : reference, montant, statut, bouton PDF et bouton Payer si applicable

### AdminReminders -- Vue mobile
- Ajouter `hidden sm:block` sur le tableau des relances
- Ajouter des cards mobile avec reference, client, montant, statut, bouton envoyer

### DashboardKPI -- Responsive
- Changer `p-6` en `p-4 sm:p-6`
- Changer `text-2xl` en `text-xl sm:text-2xl`
- Reduire la taille de l'icone container sur mobile

### AdminDashboard -- Calendrier
- Rendre la legende du calendrier responsive : flex-wrap + affichage sous le titre sur mobile
- Ajuster les grilles de KPI deja en `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` (deja OK)

### AdminAnalytics -- Export buttons
- Les boutons d'export sont deja en `flex flex-wrap gap-2`, s'assurer que le texte se reduit correctement
- Sur mobile : masquer le texte des boutons CSV et ne garder que l'icone + label court

### AdminSupport -- Filtres
- Passer les filtres et le select client en `flex flex-col sm:flex-row` pour un empilement propre

## Fichiers impactes
1. `src/components/admin/DashboardKPI.tsx` -- padding et taille responsive
2. `src/pages/admin/AdminClients.tsx` -- vue mobile cards
3. `src/pages/admin/AdminBilling.tsx` -- vue mobile cards factures et devis
4. `src/pages/admin/AdminReminders.tsx` -- vue mobile cards relances
5. `src/pages/admin/AdminDashboard.tsx` -- legende calendrier responsive
6. `src/pages/admin/AdminAnalytics.tsx` -- boutons export responsive
7. `src/pages/admin/AdminSupport.tsx` -- filtres responsive

## Ce qui est deja bien fait (pas de changement necessaire)
- ClientDashboard : grille KPI responsive, cards dossiers/demandes/devis OK
- ClientDossiers, ClientFactures, ClientDevis : vue mobile en cards deja implementee
- ClientMessaging, AdminMessaging : layout split-view mobile deja gere avec `showList`
- ClientProfile, ClientSettings, AdminSettings : formulaires avec `grid-cols-1 sm:grid-cols-2` deja OK
- ClientPaiement : layout `max-w-xl mx-auto` deja responsive
- ClientSupport : deja responsive
- ClientDemandes : deja en cards responsive
- Sidebar : deja collapsible via SidebarProvider avec SidebarTrigger
