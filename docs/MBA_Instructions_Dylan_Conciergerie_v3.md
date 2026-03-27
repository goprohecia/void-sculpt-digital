# MBA — Instructions Front-End Dylan — Conciergerie
## Réponses cadrage + Instructions implémentation — Impartial Games 2026

> Ce document couvre uniquement la partie front-end (Dylan). La partie back-end et BDD est gérée par Hamza. En cas de doute sur un point BDD, consulter Hamza avant de coder.

---

Réponses aux questions de cadrage + Instructions d’implémentation
 
Ce document s’utilise conjointement avec le CLAUDE.md (racine du repo), la MBA Bible Produit v3 et le CDC Conciergerie/Ménage v1.


## 1. RÉPONSES AUX QUESTIONS DE CADRAGE


### Question 1 — Scope MVP vs complet (phases)

Réponse : Phase 1 uniquement pour l’instant.
 
Implémenter uniquement l’import manuel des réservations (date check-in/check-out, logement, nombre de voyageurs)
L’UI doit être production-ready — pas juste une démo
Phase 2 (iCal) et Phase 3 (API Airbnb/Booking) sont prévues pour la v2 — ne pas coder maintenant
Prévoir des emplacements visuels pour les phases futures (ex : bouton « Synchroniser Airbnb » grisé avec badge « Bientôt disponible »)
 

### Question 2 — 4ème rôle Prestataire

Réponse : Utiliser employee existant + space_key pour distinguer les sous-types.
 
La table users (Hamza) a déjà un champ space_key prévu pour exactement ce cas. Ne pas créer de nouveaux rôles dans DemoAuthContext.
 
 
Tous les employés partagent le MÊMe espace Employé. Ce qui change c’est le niveau de droits et de visibilité dans cet espace selon leur niveau (agent / manager / director).
 
Mapping offres → espaces disponibles
 
Niveaux employé — visibilité dans l’espace Employé
 
Implémentation front — affichage conditionnel selon niveau
Lire le niveau depuis le contexte auth pour adapter la vue dans l’espace Employé
Pas de composant séparé par niveau — un seul EmployeeDashboard avec affichage conditionnel
L’espace Prestataire (Enterprise) est le SEUL espace personnalisé pour la conciergerie
const { role, employeeLevel } = useAuth();
// employeeLevel = 'agent' | 'manager' | 'director'
 
// Dans EmployeeDashboard — adapter la vue selon le niveau
const showTeamView = employeeLevel === 'manager' || employeeLevel === 'director';
const showAllDossiers = employeeLevel === 'director';
 
// Espace Prestataire — Enterprise uniquement
const { demoPlan } = useDemoPlan();
const isEnterprise = demoPlan === 'enterprise';
if (role === 'employee' && spaceKey === 'prestataire' && isEnterprise)
  return <PrestataireDashboard />;
 
Superadmin — ne pas toucher
Le Superadmin est l’espace interne de l’équipe MBA pour gérer les clients et tickets
Il existe dans src/pages/superadmin/ — Dylan ne touche pas à ce dossier
 

### Question 3 — Données démo vs vraie persistance

Réponse : MVP = vraie persistance Supabase. On n’est plus en mode démo.
 
Toutes les données passent par Supabase — plus de mock data pour les nouvelles fonctionnalités
Les fichiers mockConciergerieData.ts et mockNettoyageData.ts restent pour l’onboarding demo uniquement
Les logements, missions, check-lists, photos — tout est persisté en BDD (Hamza crée les tables)
Attendre la confirmation de Hamza sur le schéma des tables avant de coder les écrans de données
NE PAS commencer les écrans qui consomment des données Supabase avant que Hamza confirme les tables prêtes. Commencer par les écrans statiques (layouts, navigation, composants UI).
 

### Question 4 — Composants génériques vs sector registry

Réponse : Utiliser le sector registry existant (src/components/sector/registry.tsx).
 
Le sector registry est le bon pattern — il lazy-load des composants par secteur proprement
C’est le pattern déjà utilisé pour les 23 autres secteurs — rester cohérent
Enregistrer les nouveaux composants conciergerie dans le registry existant
La règle du CLAUDE.md (pas de composants standalone spécifiques à un secteur) s’applique aux composants orphelins, pas aux composants enregistrés proprement dans le registry
 
Pattern à suivre
// Dans sector/registry.tsx — ajouter l’entrée conciergerie
conciergerie: {
  dashboard: lazy(() => import('./conciergerie/ConciergerieDashboard')),
  clientView: lazy(() => import('./conciergerie/ProprietaireView')),
  employeeView: lazy(() => import('./conciergerie/PrestataireDashboard')),
}
 

### Question 5 — Priorité d’implémentation

Réponse : Dans cet ordre strict.
 


## 2. ARCHITECTURE FRONT — CE QUE DYLAN CONTRÔLE

Dylan ne touche pas aux fichiers Supabase (migrations, Edge Functions, config). Ces fichiers sont gérés exclusivement par Hamza et Fabien.
 

### 2.1 Fichiers front à créer ou modifier

 

### 2.2 Fichiers à NE PAS toucher

supabase/ — tout ce dossier est pour Hamza et Fabien
src/contexts/DemoAuthContext.tsx — ne pas ajouter de nouveaux rôles
src/data/sectorCategories.ts — déjà correct
src/data/sectorTimelines.ts — déjà correct
src/contexts/DemoPlanContext.tsx — ne pas modifier sans raison validée


## 3. LES 4 ESPACES — SPÉC FRONT


### 3.1 Espace Admin — ConciergerieDashboard.tsx

Layout
Sidebar gauche standard MBA (inchangée)
Zone principale avec cards KPI en haut
Section commandes/missions en cours par étape
Planning essayages / interventions du jour
Section employés / agents disponibles
Alertes paiements en retard
 
Cards KPI à afficher
 
Section missions en cours
Liste des missions actives avec : nom propriétaire, nom logement, type de ménage, agent assigné, heure prévue
Code couleur statut : En attente = orange, Assignée = bleu, En cours = vert, Terminée = gris, Problème = rouge
Chaque mission cliquable → ouvre la fiche dossier
 

### 3.2 Espace Propriétaire — ProprietaireView.tsx

Le client s’appelle Propriétaire ici. C’est l’espace client adapté pour ce secteur.
 
Ce que le propriétaire voit
Liste de ses logements avec statut (disponible / réservé / en ménage)
Calendrier des réservations par logement
Historique des interventions ménage avec photos et rapport
Ses factures et échéances
Messagerie avec l’Admin uniquement
 
Vue rapport ménage (clé différenciante)
Après chaque intervention : carte rapport avec heure début/fin, nom agent, photos horodatées
Bouton télécharger rapport PDF
Photos organisées en grille avec horodatage visible sur chaque photo
 

### 3.3 Espace Prestataire — PrestataireDashboard.tsx

Cet espace doit être optimisé mobile en priorité. C’est l’espace utilisé sur le terrain.
 
Layout mobile-first
Navigation bas d’écran (tab bar) : Missions | Historique | Messages | Profil
Pas de sidebar — interface plein écran
Boutons larges et accessibles au pouce
Lisible en plein soleil (contraste élevé)
 
Vue principale — Mes missions
Missions du jour en haut, missions à venir en dessous
Chaque mission : heure, adresse, type de ménage, nom logement
Bouton démarrer la mission — déclenche horodatage automatique
Pendant la mission : check-list interactive + bouton uploader photos
Bouton terminer la mission — horodatage automatique + validation
 
Upload photos — PhotoUpload.tsx
Accès caméra natif (input type=file accept=image/*)
Chaque photo reçoit automatiquement : timestamp (new Date().toISOString()), coordonnées GPS (navigator.geolocation)
Photos affichées en grille avec horodatage visible
Minimum 1 photo obligatoire pour valider la mission
Envoi automatique à Supabase Storage via le hook fourni par Hamza
 
Check-list — ChecklistMenage.tsx
Tâches pré-configurées par logement (définies par l’admin)
Chaque tâche = checkbox interactive
Progression visible : X/Y tâches complétées
Impossible de terminer une mission si check-list < 100%
 

### 3.4 Niveau Manager dans l’Espace Employé

Il n’y a PAS d’espace Manager séparé. Le manager utilise le même espace Employé qu’un agent standard, avec une visibilité élargie selon son niveau.
 
Ce que le manager voit en plus d’un agent standard
Toutes les missions de son équipe ou région (pas seulement les siennes)
Liste de ses agents avec statut disponible / en mission
Ses statistiques de performance régionales
Ses commissions du mois
 
Ce que le manager peut faire en plus
Assigner un agent à une mission non assignée
Valider ou rejeter une mission terminée
Envoyer un message groupé à ses agents
Voir les photos et rapports de chaque mission de son équipe
 
Implémentation
Pas de composant séparé — dans EmployeeDashboard.tsx, afficher les sections supplémentaires si employeeLevel === manager
Section Mon équipe visible uniquement si manager ou director
Section Mes commissions visible uniquement si manager ou director


## 4. RÈGLES COMPOSANTS ET CODE


### 4.1 Conventions de nommage

 

### 4.2 Hooks à utiliser

// Contextes existants — toujours utiliser ces hooks
const { demoSector, getModuleLabel } = useDemoPlan();
const { clients, dossiers } = useDemoData();
const { role, spaceKey } = useAuth();
 
// Vérifier le sous-type employé pour l’affichage conditionnel
const isManager = role === 'employee' && spaceKey === 'manager';
const isPrestataire = role === 'employee' && spaceKey === 'prestataire';
 

### 4.3 Gestion des états de chargement et erreurs

Toujours afficher un skeleton loader pendant le chargement des données Supabase
Toujours afficher un message d’erreur clair si la requête échoue
Toujours afficher un état vide avec bouton d’action si la liste est vide
// Pattern standard état vide
if (missions.length === 0) return (
  <EmptyState
    icon={<Calendar />}
    message='Aucune mission aujourd’hui'
    action={{ label: 'Créer une mission', onClick: handleCreate }}
  />
);
 

### 4.4 Mobile-first pour l’espace prestataire

Utiliser les breakpoints Tailwind : base = mobile, md = tablet, lg = desktop
Tab bar en bas sur mobile : fixed bottom-0 + padding-bottom pour safe area iOS
Boutons minimum 44px de hauteur (standard Apple HIG)
Pas de hover states comme seule interaction — toujours un tap state aussi
// Tab bar mobile
<nav className='fixed bottom-0 left-0 right-0 bg-white border-t md:hidden'>
  <div className='flex justify-around py-2 pb-safe'>
    <TabItem icon={<Briefcase />} label='Missions' />
    <TabItem icon={<History />} label='Historique' />
    <TabItem icon={<MessageSquare />} label='Messages' />
    <TabItem icon={<User />} label='Profil' />
  </div>
</nav>


## 5. FICHE DOSSIER — SPÉCIFICITÉS CONCIERGERIE

En plus des 8 onglets standard (définis dans CLAUDE.md section FICHE DOSSIER), la fiche dossier conciergerie a des contenus spécifiques.
 

### 5.1 En-tête spécifique

Nom du propriétaire + nom du logement (pas juste le nom client)
Type de ménage : badge visible (Standard / Départ / Grand ménage)
Date et heure de la mission
Agent assigné avec indicateur statut (disponible / en route / sur place)
 

### 5.2 Onglet Photos — enrichi pour conciergerie

Deux sections : Avant intervention / Après intervention
Chaque photo affiche : timestamp exact + icône géolocalisation verte si GPS confirmé
Bouton « Envoyer le rapport au propriétaire » — visible admin et manager uniquement
Le propriétaire voit les photos après ménage dans son espace (lecture seule)
 

### 5.3 Onglet Check-list — nouveau onglet pour ce secteur

Cet onglet s’ajoute aux 8 onglets standard uniquement pour les secteurs conciergerie et nettoyage. C’est une exception sectorielle validée.
 
Tâches pré-configurées par logement par l’admin
Checkboxes interactives pour l’agent (espace prestataire)
Lecture seule pour l’admin et le propriétaire
Progression visible : barre de progression X/Y tâches
Exemples de tâches par défaut : Aspirateur salon, Laver sol cuisine, Changer draps, Vérifier équipements, Sortir poubelles, Nettoyer salle de bain


## 6. CALENDRIER MISSIONS — CalendrierMissions.tsx

Composant calendrier dédié aux missions de la conciergerie. Distinct du composant Agenda générique existant.
 

### 6.1 Vues disponibles

Vue Jour : toutes les missions du jour par logement et par heure
Vue Semaine : planning hebdomadaire avec missions par créneau
Vue Mois : vue macro avec indicateurs par jour (nombre de missions)
 

### 6.2 Code couleur statut

 

### 6.3 Interactions

Clic sur une mission → ouvre la fiche dossier
Bouton « + Nouvelle mission » toujours visible
Filtre par agent (admin et manager)
Filtre par logement (admin)


## 7. DONNÉES MOCK — RÈGLES DE NETTOYAGE

Les fichiers mockConciergerieData.ts et mockNettoyageData.ts doivent être nettoyés et alignés. Ces mocks servent uniquement pour l’onboarding démo. Les vraies données viennent de Supabase.
 

### 7.1 mockConciergerieData.ts

 

### 7.2 mockNettoyageData.ts



## 8. POINTS DE SYNCHRONISATION AVEC HAMZA

Ces points doivent être validés avec Hamza avant de commencer le code qui consomme des données Supabase.
 

### 8.1 Tables à confirmer avant de coder

 

### 8.2 Ce que Dylan peut commencer SANS attendre Hamza

Layouts et navigation des 4 espaces (structure visuelle sans données réelles)
Composants UI statiques : MissionCard, LogementFiche, ChecklistMenage (avec props mockupées)
Espace Prestataire mobile-first (layout + navigation)
Nettoyage des fichiers mockConciergerieData.ts et mockNettoyageData.ts
Entrée dans le sector registry pour conciergerie
 

### 8.3 Ce que Dylan doit attendre de Hamza

Confirmation du schéma des tables logements et missions
Hooks Supabase pour l’upload photos (Supabase Storage)
Edge Function pour la génération du rapport PDF ménage
Confirmation que le champ space_key est bien dans la table users et lisible via le context auth
 
MBA — Instructions front-end Dylan
Impartial Games — 2026 — Confidentiel — Utiliser avec CLAUDE.md + Bible v3 + CDC Conciergerie v1

---

*MBA — Instructions front-end Dylan — Impartial Games 2026 — Confidentiel*
