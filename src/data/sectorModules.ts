// ── Sector Module Overrides ──
// Each sector can override generic module labels, descriptions, icons,
// or hide modules that aren't relevant to that industry.
// The underlying routes / pages stay the same — only the UI adapts.

import type { SectorKey } from "@/contexts/DemoPlanContext";

export interface SectorModuleOverride {
  label: string;
  icon?: string; // lucide icon name (for future use)
  description?: string;
  hidden?: boolean; // true = module is hidden for this sector
}

export type SectorModulesConfig = Partial<Record<string, SectorModuleOverride>>;

// ── Default generic labels (fallback) ──
export const GENERIC_MODULE_LABELS: Record<string, string> = {
  overview: "Vue d'ensemble",
  "clients-dossiers": "Clients & Dossiers",
  clients: "Clients",
  employees: "Salariés",
  dossiers: "Dossiers",
  pipeline: "Pipeline CRM",
  facturation: "Facturation",
  relances: "Relances",
  stock: "Stock",
  messagerie: "Messagerie",
  emails: "Emails",
  "rendez-vous": "Rendez-vous",
  agenda: "Agenda",
  taches: "Tâches",
  support: "Support",
  notes: "Notes",
  analyse: "Analyse",
  rapports: "Rapports",
  documents: "Documents",
  temps: "Suivi du temps",
  automatisations: "Automatisations",
  ia: "Intelligence IA",
  parametres: "Paramètres",
  fournisseurs: "Fournisseurs",
};

// ── Sector-specific overrides ──
// Only keys that differ from generic need to be listed.

const DEVELOPPEUR_OVERRIDES: SectorModulesConfig = {
  "clients-dossiers": { label: "Clients & Projets", description: "Portefeuille clients et suivi de projets tech" },
  dossiers: { label: "Projets", description: "Suivi de projets tech, sprints et repos" },
  clients: { label: "Clients", description: "Portefeuille clients du studio" },
  employees: { label: "Développeurs", description: "Équipe de développeurs" },
  taches: { label: "Sprints & Tickets", description: "Organisation par sprints et kanban" },
  temps: { label: "Time Tracking", description: "Suivi horaire par projet et client" },
  documents: { label: "Livrables", description: "Fichiers et livrables clients" },
  pipeline: { label: "Pipeline Projets", description: "Funnel de prospection et projets dev" },
  analyse: { label: "Dashboard Studio", description: "KPIs dev : taux horaire, projets livrés, CA" },
  support: { label: "Tickets Support", description: "Support technique et maintenance" },
  notes: { label: "Notes techniques", description: "Documentation interne et snippets" },
  stock: { label: "Stock", hidden: true },
  facturation: { label: "Facturation jalons", description: "Facturation par jalon de projet" },
};

const PHOTOGRAPHE_OVERRIDES: SectorModulesConfig = {
  "clients-dossiers": { label: "Clients & Commandes", description: "Portefeuille clients et commandes photo" },
  dossiers: { label: "Commandes", description: "Commandes et séances photo" },
  employees: { label: "Photographes", description: "Photographes et retoucheurs" },
  clients: { label: "Clients", description: "Portefeuille clients du studio" },
  taches: { label: "Retouche & Post-prod", description: "Suivi des retouches, éditions et traitements" },
  documents: { label: "Galeries & Livraisons", description: "Galeries clients, livraison de photos HD" },
  pipeline: { label: "Pipeline Bookings", description: "Funnel de réservations et prospects" },
  analyse: { label: "Dashboard Photo", description: "KPIs : séances réalisées, CA par type, taux de conversion" },
  temps: { label: "Temps par séance", description: "Suivi du temps passé par shooting et retouche" },
  stock: { label: "Matériel", description: "Inventaire matériel photo (boîtiers, objectifs, éclairages)" },
  notes: { label: "Mood boards", description: "Notes créatives et références visuelles" },
  support: { label: "SAV Client", description: "Demandes de retouches supplémentaires, réclamations" },
  "rendez-vous": { label: "Réservations", description: "Créneaux de shooting et rendez-vous clients" },
  facturation: { label: "Acomptes & Facturation", description: "Acomptes, soldes et facturation" },
};

const COACH_SPORTIF_OVERRIDES: SectorModulesConfig = {
  "clients-dossiers": { label: "Membres & Dossiers", description: "Fichier membres et suivi d'entraînement" },
  dossiers: { label: "Suivi membre", description: "Programmes d'entraînement et suivi par membre" },
  clients: { label: "Membres", description: "Fichier membres avec abonnement et objectifs" },
  employees: { label: "Coachs", description: "Équipe de coaching et planning" },
  taches: { label: "Séances & Exercices", description: "Planification des séances et exercices" },
  documents: { label: "Suivi corporel", description: "Bilans corporels, mensurations, photos avant/après" },
  pipeline: { label: "Pipeline Clients", description: "Prospects et conversion en abonnements" },
  analyse: { label: "Dashboard Salle", description: "KPIs : membres actifs, séances réalisées, rétention" },
  temps: { label: "Durée séances", description: "Temps passé par client et par séance" },
  "rendez-vous": { label: "Planning séances", description: "Créneaux d'entraînement individuels et collectifs" },
  notes: { label: "Notes coaching", description: "Observations, objectifs et progression des clients" },
  stock: { label: "Équipement", description: "Matériel sportif et compléments" },
  support: { label: "Suivi client", description: "Questions nutrition, récupération et bien-être" },
  emails: { label: "Emails & Motivation", description: "Rappels de séances et messages de motivation" },
  relances: { label: "Relances abonnement", description: "Renouvellements et réengagement clients" },
  facturation: { label: "Abonnements & Facturation", description: "Gestion des abonnements et paiements" },
};

const BTP_OVERRIDES: SectorModulesConfig = {
  "clients-dossiers": { label: "Clients & Chantiers", description: "Portefeuille clients et suivi de chantiers" },
  dossiers: { label: "Chantiers", description: "Suivi de chantiers, phases et avancement" },
  taches: { label: "Planning chantier", description: "Tâches par lot, sous-traitants et jalons" },
  documents: { label: "Plans & Documents", description: "Plans techniques, permis, CCTP et PV de réception" },
  pipeline: { label: "Devis techniques", description: "Pipeline de devis et appels d'offres" },
  analyse: { label: "Dashboard BTP", description: "KPIs : marge par chantier, avancement, délais" },
  temps: { label: "Heures chantier", description: "Pointage et suivi horaire par chantier et ouvrier" },
  stock: { label: "Matériaux", description: "Stock de matériaux, commandes fournisseurs" },
  notes: { label: "Journal de chantier", description: "Observations terrain, incidents et comptes-rendus" },
  support: { label: "SAV & Garanties", description: "Garanties décennales, levées de réserves" },
  "rendez-vous": { label: "Visites chantier", description: "Planification des visites et réunions de chantier" },
  relances: { label: "Relances situations", description: "Relances des situations de travaux impayées" },
  employees: { label: "Ouvriers & Techniciens", description: "Gestion des équipes terrain et sous-traitants" },
  facturation: { label: "Facturation & Situations", description: "Situations de travaux et facturation" },
};

const COIFFURE_OVERRIDES: SectorModulesConfig = {
  "clients-dossiers": { label: "Clients & Prestations", description: "Clients et historique des prestations" },
  dossiers: { label: "Réservations / Prestations", description: "Historique des prestations et réservations par client" },
  taches: { label: "Tâches salon", description: "Organisation quotidienne du salon" },
  documents: { label: "Fiches client", description: "Fiches techniques, colorations et préférences" },
  pipeline: { label: "Fidélité clients", description: "Suivi fidélité, parrainage et réengagement" },
  analyse: { label: "Dashboard Salon", description: "KPIs : CA par coiffeur, panier moyen, fréquentation" },
  temps: { label: "Durée prestations", description: "Temps moyen par prestation et par coiffeur" },
  stock: { label: "Produits capillaires", description: "Stock produits, colorations et revente" },
  "rendez-vous": { label: "Rendez-vous salon", description: "Créneaux de réservation en ligne et au salon" },
  notes: { label: "Notes coiffeur", description: "Préférences client, formules coloration" },
  support: { label: "Réclamations", description: "Retouches et insatisfactions clients" },
  emails: { label: "Emails & Promos", description: "Promotions saisonnières et rappels rendez-vous" },
  relances: { label: "Relances clients", description: "Clients inactifs et rappels de visite" },
  employees: { label: "Coiffeurs / Praticiens", description: "Équipe du salon et planning" },
  facturation: { label: "Facturation & Acomptes", description: "Encaissements et acomptes en ligne" },
};

const BOUTIQUE_OVERRIDES: SectorModulesConfig = {
  "clients-dossiers": { label: "Clients & Commandes", description: "Portefeuille clients et commandes" },
  dossiers: { label: "Commandes", description: "Suivi des commandes clients et fournisseurs" },
  taches: { label: "Tâches boutique", description: "Organisation quotidienne de la boutique" },
  stock: { label: "Inventaire", description: "Gestion des produits en rayon et en réserve" },
  documents: { label: "Bons & Factures", description: "Bons de livraison, factures fournisseurs" },
  pipeline: { label: "Pipeline ventes", description: "Suivi des ventes et opportunités" },
  analyse: { label: "Dashboard Boutique", description: "KPIs : CA, panier moyen, rotation stock" },
  "rendez-vous": { label: "RDV fournisseurs", description: "Rendez-vous avec fournisseurs et représentants" },
  notes: { label: "Notes produits", description: "Fiches produits et tendances" },
  support: { label: "SAV", description: "Service après-vente et retours" },
  relances: { label: "Relances clients", description: "Fidélisation et relances promotionnelles" },
  emails: { label: "Emails & Promos", description: "Newsletters et promotions saisonnières" },
};

const CABINETS_OVERRIDES: SectorModulesConfig = {
  "clients-dossiers": { label: "Clients & Affaires", description: "Portefeuille clients et dossiers juridiques" },
  dossiers: { label: "Affaires", description: "Suivi des affaires et dossiers juridiques" },
  taches: { label: "Échéances", description: "Délais légaux, audiences et deadlines" },
  stock: { label: "Stock", hidden: true },
  documents: { label: "Pièces juridiques", description: "Conclusions, contrats, actes notariés" },
  pipeline: { label: "Pipeline affaires", description: "Prospects et nouvelles affaires" },
  analyse: { label: "Dashboard Cabinet", description: "KPIs : affaires gagnées, honoraires, taux de réussite" },
  "rendez-vous": { label: "Consultations", description: "Rendez-vous clients et audiences" },
  notes: { label: "Notes juridiques", description: "Recherches juridiques et jurisprudence" },
  support: { label: "Litiges", description: "Réclamations et contentieux" },
  employees: { label: "Collaborateurs", description: "Avocats, associés et assistants" },
  temps: { label: "Heures facturables", description: "Suivi du temps par affaire et collaborateur" },
};

const COMMUNITY_MANAGER_OVERRIDES: SectorModulesConfig = {
  "clients-dossiers": { label: "Comptes & Missions", description: "Comptes clients et missions social media" },
  dossiers: { label: "Missions", description: "Missions et comptes clients social media" },
  clients: { label: "Comptes clients", description: "Portefeuille de comptes clients" },
  employees: { label: "CM / Chargés de compte", description: "Équipe de community managers" },
  taches: { label: "Planning éditorial", description: "Calendrier de publications et contenus" },
  stock: { label: "Stock", hidden: true },
  documents: { label: "Contenus & Visuels", description: "Assets graphiques, vidéos et templates" },
  pipeline: { label: "Pipeline prospects", description: "Prospects et nouveaux contrats" },
  analyse: { label: "Dashboard CM", description: "KPIs : engagement, reach, croissance abonnés" },
  "rendez-vous": { label: "Appels clients", description: "Points stratégiques et briefs clients" },
  notes: { label: "Notes créatives", description: "Idées de contenus et veille concurrentielle" },
  support: { label: "Support client", description: "Demandes et ajustements de stratégie" },
  temps: { label: "Temps par client", description: "Suivi du temps passé par compte client" },
  emails: { label: "Emails & Rapports", description: "Reportings mensuels et communications" },
  facturation: { label: "Facturation missions", description: "Honoraires et forfaits mensuels" },
};

const CONSULTANT_OVERRIDES: SectorModulesConfig = {
  "clients-dossiers": { label: "Clients & Missions", description: "Portefeuille clients et missions de conseil" },
  dossiers: { label: "Missions", description: "Suivi des missions de conseil en cours" },
  clients: { label: "Portefeuille clients", description: "Clients et contacts du cabinet" },
  employees: { label: "Consultants", description: "Équipe de consultants" },
  taches: { label: "Livrables & Tâches", description: "Tâches et jalons par mission" },
  stock: { label: "Stock", hidden: true },
  documents: { label: "Rapports & Études", description: "Livrables, études de marché, audits" },
  pipeline: { label: "Pipeline missions", description: "Propositions commerciales et appels d'offres" },
  analyse: { label: "Dashboard Direction", description: "KPIs : TJM, taux d'occupation, CA par mission" },
  "rendez-vous": { label: "Réunions", description: "Réunions clients et comités de pilotage" },
  notes: { label: "Notes de mission", description: "Comptes-rendus et recommandations" },
  support: { label: "Support client", description: "Suivi post-mission et questions" },
  temps: { label: "Temps par mission", description: "Suivi horaire et facturation au temps passé" },
  facturation: { label: "Honoraires", description: "Facturation par jalon ou forfait" },
};

const DESIGNER_OVERRIDES: SectorModulesConfig = {
  "clients-dossiers": { label: "Clients & Projets", description: "Portefeuille clients et projets design" },
  dossiers: { label: "Projets", description: "Projets de design (branding, UI/UX, print)" },
  clients: { label: "Clients", description: "Portefeuille clients du studio" },
  employees: { label: "Designers", description: "Équipe de designers" },
  taches: { label: "Sprints créatifs", description: "Itérations et livrables créatifs" },
  stock: { label: "Stock", hidden: true },
  documents: { label: "Maquettes & Assets", description: "Fichiers sources, exports et guidelines" },
  pipeline: { label: "Pipeline créatif", description: "Demandes et propositions créatives" },
  analyse: { label: "Dashboard Studio", description: "KPIs : projets livrés, satisfaction client, CA" },
  "rendez-vous": { label: "Présentations", description: "Présentations clients et revues créatives" },
  notes: { label: "Inspirations", description: "Mood boards, références et veille design" },
  support: { label: "Retours clients", description: "Demandes de modifications et itérations" },
  temps: { label: "Temps par projet", description: "Suivi horaire par projet créatif" },
  facturation: { label: "Facturation", description: "Acomptes et soldes par projet" },
};

const DJ_ANIMATEUR_OVERRIDES: SectorModulesConfig = {
  "clients-dossiers": { label: "Clients & Prestations", description: "Portefeuille clients et prestations événementielles" },
  dossiers: { label: "Prestations", description: "Soirées, mariages, festivals et animations" },
  clients: { label: "Clients", description: "Portefeuille clients événementiel" },
  employees: { label: "Assistants / Régisseurs", description: "Équipe technique et régisseurs" },
  taches: { label: "Préparation technique", description: "Check-lists techniques et logistique" },
  stock: { label: "Matériel sono", description: "Enceintes, platines, éclairages et câbles" },
  documents: { label: "Playlists & Riders", description: "Playlists, fiches techniques et riders" },
  pipeline: { label: "Pipeline bookings", description: "Réservations et demandes de prestation" },
  analyse: { label: "Dashboard DJ", description: "KPIs : événements réalisés, CA, satisfaction" },
  "rendez-vous": { label: "Réservations", description: "Créneaux de prestation et repérages" },
  notes: { label: "Notes événement", description: "Préférences musicales et ambiance souhaitée" },
  support: { label: "Réclamations", description: "Retours et ajustements post-événement" },
  facturation: { label: "Cachets & Factures", description: "Facturation des prestations et cachets" },
};

const EVENEMENTIEL_OVERRIDES: SectorModulesConfig = {
  "clients-dossiers": { label: "Clients & Événements", description: "Portefeuille clients et organisation d'événements" },
  dossiers: { label: "Événements", description: "Organisation d'événements (congrès, galas, séminaires)" },
  employees: { label: "Chefs de projet", description: "Équipe de chefs de projet événementiel" },
  taches: { label: "Planning événement", description: "Rétroplanning et coordination des prestataires" },
  stock: { label: "Matériel & Déco", description: "Mobilier, décoration et matériel événementiel" },
  documents: { label: "Documents événement", description: "Contrats prestataires, plans de salle, briefs" },
  pipeline: { label: "Pipeline événements", description: "Demandes d'événements et devis en cours" },
  analyse: { label: "Dashboard Événementiel", description: "KPIs : événements livrés, budget vs réel, NPS" },
  "rendez-vous": { label: "RDV prestataires", description: "Rendez-vous avec prestataires et clients" },
  notes: { label: "Notes organisation", description: "Notes logistiques et retours d'expérience" },
  support: { label: "Réclamations", description: "Gestion des imprévus et réclamations" },
  fournisseurs: { label: "Prestataires", description: "Traiteurs, DJ, photographes, lieux et services" },
};

const FORMATEUR_OVERRIDES: SectorModulesConfig = {
  "clients-dossiers": { label: "Stagiaires & Sessions", description: "Stagiaires et sessions de formation" },
  dossiers: { label: "Sessions", description: "Sessions de formation et dossiers stagiaires" },
  employees: { label: "Formateurs", description: "Équipe de formateurs" },
  clients: { label: "Stagiaires", description: "Stagiaires et organismes clients" },
  taches: { label: "Modules & Cours", description: "Préparation des modules et supports de cours" },
  stock: { label: "Supports pédagogiques", description: "Manuels, kits et matériel de formation" },
  documents: { label: "Ressources pédagogiques", description: "Supports PDF, vidéos et exercices" },
  pipeline: { label: "Pipeline inscriptions", description: "Inscriptions et demandes de formation" },
  analyse: { label: "Dashboard Formateur", description: "KPIs : apprenants formés, taux de complétion, évaluations" },
  "rendez-vous": { label: "Sessions", description: "Sessions de formation planifiées" },
  notes: { label: "Notes formateur", description: "Observations pédagogiques et améliorations" },
  support: { label: "Support apprenant", description: "Questions et accompagnement post-formation" },
  temps: { label: "Heures de formation", description: "Suivi du temps par session et module" },
};

const GARAGES_OVERRIDES: SectorModulesConfig = {
  dossiers: { label: "Véhicules", description: "Suivi des véhicules en atelier" },
  taches: { label: "Ordres de réparation", description: "Tâches mécaniques et diagnostics" },
  stock: { label: "Pièces détachées", description: "Stock de pièces et consommables auto" },
  documents: { label: "Fiches techniques", description: "Carnets d'entretien et rapports de contrôle" },
  pipeline: { label: "Pipeline devis", description: "Devis en attente et réparations à planifier" },
  analyse: { label: "Dashboard Garage", description: "KPIs : interventions/jour, panier moyen, rotation pièces" },
  "rendez-vous": { label: "RDV atelier", description: "Créneaux de dépôt et restitution véhicule" },
  notes: { label: "Notes mécanicien", description: "Observations techniques et historique véhicule" },
  support: { label: "Garanties", description: "Garanties pièces et main d'œuvre" },
  "clients-dossiers": { label: "Clients & Véhicules", description: "Fiches clients et suivi des véhicules" },
  clients: { label: "Clients & Véhicules", description: "Fiches clients avec parc automobile" },
  employees: { label: "Mécaniciens", description: "Équipe de mécaniciens et techniciens" },
};

const IMMOBILIER_OVERRIDES: SectorModulesConfig = {
  "clients-dossiers": { label: "Acquéreurs & Mandats", description: "Fichier clients et portefeuille de mandats" },
  dossiers: { label: "Mandats", description: "Portefeuille de mandats de vente et location" },
  taches: { label: "Visites & Tâches", description: "Organisation des visites et tâches administratives" },
  stock: { label: "Stock", hidden: true },
  documents: { label: "Mandats & Actes", description: "Mandats, compromis et actes notariés" },
  pipeline: { label: "Pipeline mandats", description: "Estimations et mandats en négociation" },
  analyse: { label: "Dashboard Immobilier", description: "KPIs : biens vendus, délai moyen, commissions" },
  "rendez-vous": { label: "Visites", description: "Visites de biens et rendez-vous notaire" },
  notes: { label: "Notes terrain", description: "Observations sur les biens et le quartier" },
  support: { label: "Litiges", description: "Réclamations et litiges acquéreurs/vendeurs" },
  clients: { label: "Acquéreurs & Vendeurs", description: "Fichier clients acheteurs et vendeurs" },
  relances: { label: "Relances mandats", description: "Suivi des mandats arrivant à échéance" },
  employees: { label: "Agents", description: "Agents immobiliers de l'agence" },
  facturation: { label: "Commissions & Facturation", description: "Commissions agents et facturation" },
};

const MARIAGE_OVERRIDES: SectorModulesConfig = {
  "clients-dossiers": { label: "Mariées & Dossiers", description: "Fiches mariées et dossiers de commande" },
  dossiers: { label: "Commandes robes", description: "Dossiers mariées, mensurations, modèle choisi" },
  taches: { label: "Retouches & Préparation", description: "Retouches et préparation des robes" },
  stock: { label: "Robes & Accessoires", description: "Robes, voiles, accessoires et bijoux" },
  documents: { label: "Documents", description: "Contrats et bons de commande" },
  pipeline: { label: "Pipeline prospects", description: "Demandes de devis et prospects mariées" },
  analyse: { label: "Dashboard Mariage", description: "KPIs : ventes, panier moyen, essayages" },
  "rendez-vous": { label: "Planning essayages", description: "Essayages, retouches et livraisons" },
  notes: { label: "Notes mariées", description: "Préférences de style et historique" },
  support: { label: "Support", description: "Questions et ajustements" },
  clients: { label: "Mariées", description: "Fiches mariées et coordonnées" },
  employees: { label: "Conseillères & Retoucheuses", description: "Équipe boutique" },
  facturation: { label: "Acomptes & Facturation", description: "Acomptes versés, soldes et facturation" },
};

const NETTOYAGE_OVERRIDES: SectorModulesConfig = {
  "clients-dossiers": { label: "Clients & Contrats", description: "Portefeuille clients et contrats de nettoyage" },
  dossiers: { label: "Contrats", description: "Contrats de nettoyage et interventions" },
  employees: { label: "Agents", description: "Équipes de nettoyage et responsables de site" },
  clients: { label: "Clients", description: "Clients B2B et syndics" },
  taches: { label: "Planning interventions", description: "Tournées et planning des équipes" },
  stock: { label: "Produits", description: "Produits d'entretien et consommables" },
  documents: { label: "Fiches intervention", description: "Fiches de passage et cahiers des charges" },
  pipeline: { label: "Pipeline contrats", description: "Appels d'offres et nouveaux contrats" },
  analyse: { label: "Dashboard Nettoyage", description: "KPIs : sites couverts, heures/site, marge" },
  "rendez-vous": { label: "Interventions", description: "Planification des passages et contrôles qualité" },
  notes: { label: "Notes terrain", description: "Observations et incidents sur site" },
  support: { label: "Réclamations", description: "Réclamations clients et non-conformités" },
};

const REPARATEUR_OVERRIDES: SectorModulesConfig = {
  "clients-dossiers": { label: "Clients & Réparations", description: "Fiches clients et réparations en atelier" },
  dossiers: { label: "Réparations", description: "Fiches appareils en réparation avec diagnostic et statut" },
  employees: { label: "Techniciens", description: "Techniciens de l'atelier" },
  clients: { label: "Clients & Appareils", description: "Historique complet par client : appareils réparés, devis, factures" },
  taches: { label: "Ordres de réparation", description: "Diagnostic, réparation et tests par appareil" },
  stock: { label: "Pièces détachées", description: "Stock de pièces de rechange et composants" },
  documents: { label: "Fiches techniques", description: "Fiches de diagnostic et rapports d'intervention" },
  pipeline: { label: "Pipeline demandes", description: "Demandes de réparation entrantes" },
  analyse: { label: "Dashboard Atelier", description: "KPIs : réparations/jour, taux de réussite, délai moyen" },
  "rendez-vous": { label: "RDV atelier", description: "Créneaux de dépôt et récupération d'appareils" },
  notes: { label: "Notes techniques", description: "Observations et solutions appliquées" },
  support: { label: "Garanties", description: "Garanties sur les réparations effectuées" },
  facturation: { label: "Devis & Facturation", description: "Devis transformés en factures" },
};

const TRAITEUR_OVERRIDES: SectorModulesConfig = {
  "clients-dossiers": { label: "Clients & Commandes", description: "Portefeuille clients et commandes traiteur" },
  dossiers: { label: "Commandes", description: "Commandes événementielles et prestations traiteur" },
  employees: { label: "Équipe / Brigade", description: "Cuisiniers, serveurs et logistique" },
  clients: { label: "Clients", description: "Particuliers et entreprises" },
  taches: { label: "Préparation & Menus", description: "Préparation culinaire et élaboration des menus" },
  stock: { label: "Matières premières", description: "Ingrédients, boissons et consommables" },
  documents: { label: "Menus & Contrats", description: "Propositions de menus et contrats clients" },
  pipeline: { label: "Pipeline événements", description: "Demandes de devis et réservations" },
  analyse: { label: "Dashboard Traiteur", description: "KPIs : événements livrés, coût matière, marge" },
  "rendez-vous": { label: "RDV dégustation", description: "Dégustations et rendez-vous de planification" },
  notes: { label: "Notes cuisine", description: "Recettes, allergies et préférences clients" },
  support: { label: "Réclamations", description: "Retours qualité et ajustements" },
  facturation: { label: "Devis & Facturation", description: "Devis interactifs, acomptes et facturation" },
};

const CABINET_RECRUTEMENT_OVERRIDES: SectorModulesConfig = {
  dossiers: { label: "Missions", description: "Portefeuille de missions de recrutement" },
  taches: { label: "Pipeline candidats", description: "Suivi des candidats par étape" },
  stock: { label: "Stock", hidden: true },
  documents: { label: "CV & Documents", description: "CV, lettres de motivation et références" },
  pipeline: { label: "Pipeline missions", description: "Missions en cours et prospection" },
  analyse: { label: "Dashboard Recrutement", description: "KPIs : taux de transformation, délai placement, CA" },
  "rendez-vous": { label: "Entretiens", description: "Entretiens cabinet et client" },
  notes: { label: "Notes candidats", description: "Notes d'entretien et évaluations" },
  support: { label: "Suivi intégration", description: "Suivi post-placement et période d'essai" },
  clients: { label: "Clients entreprises", description: "Entreprises clientes et contacts" },
  employees: { label: "Chargés de recrutement", description: "Équipe de consultants recrutement" },
  facturation: { label: "Honoraires", description: "Facturation des missions de recrutement" },
  relances: { label: "Relances missions", description: "Suivi des missions et relances clients" },
  temps: { label: "Temps par mission", description: "Suivi du temps investi par mission" },
};

const CONCIERGERIE_OVERRIDES: SectorModulesConfig = {
  dossiers: { label: "Séjours / Réservations", description: "Gestion des séjours et réservations voyageurs" },
  taches: { label: "Interventions", description: "Ménage, check-in/out, maintenance" },
  stock: { label: "Fournitures", description: "Linge, produits d'accueil et consommables" },
  documents: { label: "Documents propriétaires", description: "Contrats de gestion et inventaires" },
  pipeline: { label: "Pipeline prospects", description: "Nouveaux propriétaires et biens à gérer" },
  analyse: { label: "Dashboard Conciergerie", description: "KPIs : taux d'occupation, revenus, satisfaction voyageurs" },
  "rendez-vous": { label: "RDV propriétaires", description: "Rendez-vous propriétaires et états des lieux" },
  notes: { label: "Notes logements", description: "Spécificités des logements et consignes" },
  support: { label: "Réclamations", description: "Réclamations voyageurs et propriétaires" },
  clients: { label: "Propriétaires", description: "Propriétaires de biens gérés" },
  employees: { label: "Agents d'entretien", description: "Équipe d'entretien et agents terrain" },
  relances: { label: "Relances propriétaires", description: "Renouvellements de contrats de gestion" },
  facturation: { label: "Facturation propriétaires", description: "Facturation et commissions propriétaires" },
};

// ── Master map — add new sectors here ──
export const SECTOR_MODULE_OVERRIDES: Record<string, SectorModulesConfig> = {
  developpeur: DEVELOPPEUR_OVERRIDES,
  photographe: PHOTOGRAPHE_OVERRIDES,
  "coach-sportif": COACH_SPORTIF_OVERRIDES,
  btp: BTP_OVERRIDES,
  coiffure: COIFFURE_OVERRIDES,
  boutique: BOUTIQUE_OVERRIDES,
  cabinets: CABINETS_OVERRIDES,
  "community-manager": COMMUNITY_MANAGER_OVERRIDES,
  consultant: CONSULTANT_OVERRIDES,
  designer: DESIGNER_OVERRIDES,
  "dj-animateur": DJ_ANIMATEUR_OVERRIDES,
  evenementiel: EVENEMENTIEL_OVERRIDES,
  formateur: FORMATEUR_OVERRIDES,
  garages: GARAGES_OVERRIDES,
  immobilier: IMMOBILIER_OVERRIDES,
  mariage: MARIAGE_OVERRIDES,
  nettoyage: NETTOYAGE_OVERRIDES,
  reparateur: REPARATEUR_OVERRIDES,
  traiteur: TRAITEUR_OVERRIDES,
  conciergerie: CONCIERGERIE_OVERRIDES,
  "cabinet-recrutement": CABINET_RECRUTEMENT_OVERRIDES,
  "auto-ecole": {
    dossiers: { label: "Dossiers élèves", description: "Fiches élèves, progression et heures de conduite" },
    taches: { label: "Leçons & Examens", description: "Planification des leçons et inscriptions aux examens" },
    stock: { label: "Véhicules", description: "Flotte de véhicules, entretiens et affectations" },
    employees: { label: "Moniteurs", description: "Gestion des moniteurs et leurs plannings" },
    "rendez-vous": { label: "Planning conduite", description: "Créneaux de leçons de conduite" },
    documents: { label: "Documents admin", description: "Contrats, CERFA, attestations et conventions" },
    analyse: { label: "Dashboard Auto-École", description: "KPIs : taux de réussite, heures planifiées, CA" },
    notes: { label: "Notes moniteur", description: "Observations et évaluations des élèves" },
    pipeline: { label: "Pipeline Inscriptions", description: "Prospects et conversions en inscriptions" },
    relances: { label: "Relances paiements", description: "Suivi des paiements échelonnés et relances" },
    support: { label: "Support élèves", description: "Questions et assistance des élèves" },
  } as SectorModulesConfig,
  "cabinet-avocats": {
    dossiers: { label: "Affaires", description: "Suivi des affaires judiciaires et contentieux" },
    taches: { label: "Échéances & Délais", description: "Délais de procédure, audiences et deadlines" },
    stock: { label: "Stock", hidden: true },
    documents: { label: "Pièces & Conclusions", description: "Conclusions, assignations, contrats, actes" },
    pipeline: { label: "Nouvelles affaires", description: "Consultations et prospects" },
    analyse: { label: "Dashboard Cabinet", description: "KPIs : affaires, honoraires, taux de succès" },
    "rendez-vous": { label: "Audiences & Consultations", description: "Audiences, consultations et rendez-vous" },
    notes: { label: "Notes juridiques", description: "Recherches, jurisprudence et stratégie" },
    support: { label: "Support clients", description: "Questions et demandes clients" },
    clients: { label: "Clients", description: "Personnes physiques et morales" },
    employees: { label: "Avocats & Collaborateurs", description: "Associés, collaborateurs et assistants" },
    facturation: { label: "Honoraires", description: "Provisions, notes d'honoraires et suivi" },
    temps: { label: "Heures facturables", description: "Suivi du temps par affaire" },
  } as SectorModulesConfig,
  "expert-comptable": {
    dossiers: { label: "Missions comptables", description: "Tenue comptable, bilans et déclarations fiscales" },
    taches: { label: "Échéances fiscales", description: "TVA, IS, IR, CFE et autres obligations" },
    stock: { label: "Stock", hidden: true },
    documents: { label: "Pièces comptables", description: "Relevés, factures, bulletins de paie, bilans" },
    pipeline: { label: "Prospects", description: "Nouveaux clients et demandes de devis" },
    analyse: { label: "Dashboard Cabinet", description: "KPIs : missions, déclarations, honoraires" },
    "rendez-vous": { label: "Rendez-vous clients", description: "Bilans annuels et points trimestriels" },
    notes: { label: "Notes techniques", description: "Notes comptables et fiscales" },
    support: { label: "Support", description: "Questions clients" },
    clients: { label: "Portefeuille clients", description: "Entreprises clientes et contacts" },
    employees: { label: "Collaborateurs", description: "Comptables, fiscalistes et assistants" },
    facturation: { label: "Honoraires", description: "Forfaits mensuels et notes d'honoraires" },
    temps: { label: "Heures facturables", description: "Suivi du temps par mission" },
  } as SectorModulesConfig,
};

// ── Helpers ──

/**
 * Get the display label for a module, respecting sector overrides.
 * Falls back to the generic label.
 */
export function getModuleLabel(moduleKey: string, sectorKey?: string | null): string {
  if (sectorKey) {
    const override = SECTOR_MODULE_OVERRIDES[sectorKey]?.[moduleKey];
    if (override && !override.hidden) return override.label;
  }
  return GENERIC_MODULE_LABELS[moduleKey] || moduleKey;
}

/**
 * Get the description for a module (sector-specific or undefined).
 */
export function getModuleDescription(moduleKey: string, sectorKey?: string | null): string | undefined {
  if (sectorKey) {
    return SECTOR_MODULE_OVERRIDES[sectorKey]?.[moduleKey]?.description;
  }
  return undefined;
}

/**
 * Check if a module should be hidden for a given sector.
 */
export function isModuleHidden(moduleKey: string, sectorKey?: string | null): boolean {
  if (!sectorKey) return false;
  return SECTOR_MODULE_OVERRIDES[sectorKey]?.[moduleKey]?.hidden === true;
}

/**
 * Get all overrides for a given sector (for the SuperAdmin editor).
 */
export function getSectorOverrides(sectorKey: string): SectorModulesConfig {
  return SECTOR_MODULE_OVERRIDES[sectorKey] || {};
}

// ── Assignation config per sector ──
// Only sectors with team structures have assignation enabled.
// Métiers concernés : Garage, BTP/Artisan, Conciergerie, Agence Immobilière,
// Salle de Sport, Expert-Comptable, Cabinet d'Avocats, Magasin, Auto-École
const ASSIGNATION_SECTORS = [
  "garages",        // Garage
  "btp",            // BTP / Artisan
  "conciergerie",   // Conciergerie
  "immobilier",     // Agence Immobilière
  "coach-sportif",  // Salle de Sport
  "cabinets",       // Expert-Comptable / Cabinet d'Avocats
  "boutique",       // Magasin
  "auto-ecole",     // Auto-École
  "cabinet-avocats", // Cabinet d'Avocats
  "cabinet-recrutement", // Cabinet de Recrutement
  "expert-comptable", // Expert-Comptable
];

export function isAssignationEnabled(sectorKey?: string | null): boolean {
  if (!sectorKey) return true;
  return ASSIGNATION_SECTORS.includes(sectorKey);
}

// ── Booking config per sector ──
// Sectors purely project-based (no appointments) have booking disabled.
const NO_BOOKING_SECTORS = ["developpeur", "designer", "community-manager", "consultant"];

export function isBookingEnabled(sectorKey?: string | null): boolean {
  if (!sectorKey) return true; // default: enabled
  return !NO_BOOKING_SECTORS.includes(sectorKey);
}

// ── Role labels per sector ──
// Adapts sidebar subtitles per role (admin / employee / client)
export interface SectorRoleLabels {
  admin: string;
  employee: string;
  client: string;
}

export const SECTOR_ROLE_LABELS: Record<string, SectorRoleLabels> = {
  garages: { admin: "Réceptionniste", employee: "Mécanicien", client: "Client" },
  btp: { admin: "Dirigeant", employee: "Ouvrier / Technicien", client: "Client" },
  coiffure: { admin: "Gérant", employee: "Coiffeur / Praticien", client: "Client" },
  "auto-ecole": { admin: "Directeur", employee: "Moniteur", client: "Élève" },
  conciergerie: { admin: "Conciergerie", employee: "Agent d'entretien", client: "Propriétaire" },
  cabinets: { admin: "Associé", employee: "Collaborateur", client: "Client" },
  immobilier: { admin: "Direction", employee: "Agent", client: "Client" },
  boutique: { admin: "Gérant", employee: "Vendeur", client: "Client" },
  "coach-sportif": { admin: "Gérant", employee: "Coach", client: "Membre" },
  "community-manager": { admin: "Direction", employee: "CM / Chargé de compte", client: "Client" },
  consultant: { admin: "Direction", employee: "Consultant", client: "Client" },
  designer: { admin: "Studio / Gérant", employee: "Designer", client: "Client" },
  developpeur: { admin: "Studio / Gérant", employee: "Développeur", client: "Client" },
  "dj-animateur": { admin: "Gérant / Artiste", employee: "Assistant / Régisseur", client: "Client" },

  "cabinet-recrutement": { admin: "Direction", employee: "Chargé de recrutement", client: "Client / Candidat" },
  mariage: { admin: "Admin Boutique", employee: "Conseillère / Retoucheuse", client: "Mariée" },
  "cabinet-avocats": { admin: "Cabinet", employee: "Avocat / Collaborateur", client: "Client" },
  "expert-comptable": { admin: "Cabinet", employee: "Collaborateur comptable", client: "Client Entreprise" },
};

export function getSectorRoleLabel(sectorKey: string | null | undefined, role: "admin" | "employee" | "client"): string | null {
  if (!sectorKey) return null;
  return SECTOR_ROLE_LABELS[sectorKey]?.[role] ?? null;
}
