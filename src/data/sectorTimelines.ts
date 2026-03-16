export type PresetCategory = "vente" | "location" | "service" | "projet" | "suivi" | "événement" | "formation" | "réparation" | "production" | "gestion";

export const PRESET_CATEGORY_LABELS: Record<PresetCategory, string> = {
  vente: "🏷️ Vente",
  location: "🏠 Location",
  service: "⚡ Service / Prestation",
  projet: "📐 Projet",
  suivi: "📋 Suivi client",
  événement: "🎉 Événement",
  formation: "📚 Formation",
  réparation: "🔧 Réparation",
  production: "🏭 Production / Commande",
  gestion: "📂 Gestion",
};

export interface TimelinePreset {
  name: string;
  steps: string[];
  category: PresetCategory;
}

export const SECTOR_TIMELINE_PRESETS: Record<string, TimelinePreset[]> = {
  generic: [
    {
      name: "Par défaut",
      category: "projet",
      steps: ["Demande reçue", "Rendez-vous", "Cahier des charges", "Devis envoyé", "Devis accepté", "En cours", "Livraison", "Terminé"],
    },
  ],

  immobilier: [
    {
      name: "Suivi mandat client",
      category: "vente",
      steps: ["Mandat signé", "Photos / Annonce", "Visites en cours", "Offre reçue", "Compromis", "Acte finalisé"],
    },
    {
      name: "Mandat de vente",
      category: "vente",
      steps: ["Demande reçue", "Premier contact", "Estimation du bien", "Signature du mandat", "Prise de photos", "Diffusion annonce", "Visites", "Offre d'achat", "Négociation", "Signature du compromis", "Délai de rétractation", "Obtention du prêt", "Signature chez le notaire", "Remise des clés"],
    },
    {
      name: "Location",
      category: "location",
      steps: ["Demande reçue", "Visite du bien", "Constitution du dossier", "Vérification du dossier", "Validation du dossier", "Signature du bail", "État des lieux d'entrée", "Remise des clés"],
    },
    {
      name: "Gestion locative",
      category: "gestion",
      steps: ["Prise en charge", "Diagnostic technique", "Mise en conformité", "Recherche locataire", "Sélection candidat", "Signature bail", "Suivi loyers", "Régularisation charges", "Renouvellement bail"],
    },
  ],

  btp: [
    {
      name: "Suivi chantier client",
      category: "projet",
      steps: ["Devis envoyé", "Devis accepté", "Planification", "Chantier en cours", "Fin de chantier", "Facture envoyée", "Solde réglé"],
    },
    {
      name: "Chantier neuf",
      category: "projet",
      steps: ["Appel d'offres", "Étude technique", "Chiffrage", "Devis envoyé", "Signature contrat", "Demande de permis", "Terrassement", "Fondations", "Gros œuvre", "Charpente / Toiture", "Second œuvre", "Finitions", "Nettoyage chantier", "Réception travaux", "Levée de réserves", "Clôture dossier"],
    },
    {
      name: "Rénovation",
      category: "projet",
      steps: ["Visite technique", "Diagnostic", "Devis", "Accord client", "Dépose / Démolition", "Travaux", "Finitions", "Nettoyage", "Réception", "Garantie"],
    },
    {
      name: "Dépannage / Urgence",
      category: "réparation",
      steps: ["Appel client", "Diagnostic téléphonique", "Intervention", "Réparation", "Vérification", "Facturation", "Clôture"],
    },
  ],

  coiffure: [
    {
      name: "Suivi prestation",
      category: "service",
      steps: ["RDV pris", "Acompte payé", "Client arrivé", "Prestation en cours", "Terminé", "Avis demandé"],
    },
    {
      name: "Prestation salon",
      category: "service",
      steps: ["Prise de rendez-vous", "Accueil client", "Diagnostic capillaire", "Proposition soin", "Réalisation", "Coiffage final", "Encaissement", "Prise RDV suivant"],
    },
    {
      name: "Coloration complète",
      category: "service",
      steps: ["Consultation couleur", "Test allergie", "Préparation mélange", "Application", "Temps de pose", "Rinçage", "Soin post-coloration", "Coupe / Brushing", "Encaissement"],
    },
  ],

  photographe: [
    {
      name: "Séance photo",
      category: "projet",
      steps: ["Réservation", "Acompte reçu", "Séance réalisée", "Sélection en cours", "Retouches", "Galerie livrée", "Solde"],
    },
    {
      name: "Reportage événement",
      category: "événement",
      steps: ["Premier contact", "Visite des lieux", "Devis", "Confirmation", "Préparation", "Couverture événement", "Post-production", "Livraison aperçu", "Retouches finales", "Livraison complète", "Archivage"],
    },
  ],

  consultant: [
    {
      name: "Mission de conseil",
      category: "projet",
      steps: ["Mission qualifiée", "Proposition envoyée", "Contrat signé", "Mission en cours", "Livrable intermédiaire", "Livrable final", "Clôturée"],
    },
    {
      name: "Formation sur mesure",
      category: "formation",
      steps: ["Recueil des besoins", "Conception programme", "Devis", "Validation", "Préparation supports", "Animation", "Évaluation", "Remise attestation", "Suivi post-formation"],
    },
  ],

  conciergerie: [
    {
      name: "Suivi séjour",
      category: "location",
      steps: ["Réservation confirmée", "Préparation logement", "Check-in effectué", "Séjour en cours", "Check-out", "Ménage fait", "Bilan propriétaire"],
    },
    {
      name: "Gestion locative saisonnière",
      category: "location",
      steps: ["Prise en charge du bien", "Shooting photos", "Création annonce", "Publication plateformes", "Réservation reçue", "Préparation du logement", "Check-in voyageur", "Suivi séjour", "Check-out", "Ménage", "Bilan propriétaire"],
    },
    {
      name: "Service ponctuel",
      category: "service",
      steps: ["Demande reçue", "Évaluation", "Devis", "Confirmation", "Intervention", "Contrôle qualité", "Facturation"],
    },
  ],

  boutique: [
    {
      name: "Commande client",
      category: "vente",
      steps: ["Commande reçue", "Paiement validé", "Préparation", "Expédié / Prêt", "Récupéré / Livré", "Terminé"],
    },
    {
      name: "Commande fournisseur",
      category: "production",
      steps: ["Analyse des besoins", "Sélection fournisseur", "Commande passée", "Confirmation fournisseur", "Expédition", "Réception", "Contrôle qualité", "Mise en rayon"],
    },
  ],


  cabinets: [
    {
      name: "Dossier juridique",
      category: "gestion",
      steps: ["Consultation initiale", "Analyse du dossier", "Recherche juridique", "Rédaction acte", "Relecture", "Signature", "Enregistrement", "Suivi exécution", "Archivage"],
    },
    {
      name: "Dossier comptable",
      category: "gestion",
      steps: ["Réception pièces", "Saisie comptable", "Rapprochement bancaire", "Déclarations fiscales", "Bilan", "Présentation au client", "Dépôt officiel", "Archivage"],
    },
  ],

  "coach-sportif": [
    {
      name: "Suivi membre",
      category: "suivi",
      steps: ["Inscription", "Abonnement actif", "Bilan initial", "Programme en cours", "Bilan intermédiaire", "Renouvellement", "Terminé"],
    },
    {
      name: "Stage / Bootcamp",
      category: "formation",
      steps: ["Inscription", "Questionnaire santé", "Confirmation", "Envoi programme", "Jour 1", "Suivi quotidien", "Dernier jour", "Bilan", "Programme de continuité"],
    },
  ],

  "community-manager": [
    {
      name: "Mission client",
      category: "gestion",
      steps: ["Brief reçu", "Stratégie validée", "Contenus créés", "Validation client", "Planifié", "Publié", "Rapport envoyé"],
    },
    {
      name: "Campagne sponsorisée",
      category: "projet",
      steps: ["Définition objectif", "Ciblage audience", "Création visuel", "Rédaction copy", "Validation", "Mise en ligne", "Optimisation", "Rapport de performance"],
    },
  ],

  designer: [
    {
      name: "Projet design",
      category: "projet",
      steps: ["Brief reçu", "Moodboard validé", "Première proposition", "Retours client", "Corrections", "BAT validé", "Fichiers livrés"],
    },
    {
      name: "Identité visuelle",
      category: "projet",
      steps: ["Brief", "Benchmark concurrence", "Propositions logo", "Sélection direction", "Déclinaisons", "Charte graphique", "Validation", "Livraison fichiers sources"],
    },
  ],

  developpeur: [
    {
      name: "Projet web / app",
      category: "projet",
      steps: ["Cahier des charges", "Devis signé", "Maquettes validées", "Dev en cours", "Recette client", "Corrections", "Mise en prod", "Clôturé"],
    },
    {
      name: "Mission freelance",
      category: "projet",
      steps: ["Premier contact", "Évaluation technique", "Proposition", "Démarrage", "Sprints", "Démo", "Ajustements", "Livraison", "Documentation", "Clôture"],
    },
  ],

  "dj-animateur": [
    {
      name: "Prestation événement",
      category: "événement",
      steps: ["Demande reçue", "Devis envoyé", "Contrat signé", "Acompte reçu", "Événement confirmé", "Prestation réalisée", "Solde"],
    },
  ],

  evenementiel: [
    {
      name: "Organisation événement",
      category: "événement",
      steps: ["Brief reçu", "Proposition envoyée", "Contrat signé", "Prestataires confirmés", "J-7 brief final", "Événement réalisé", "Bilan client", "Clôturé"],
    },
    {
      name: "Salon / Conférence",
      category: "événement",
      steps: ["Appel à conférenciers", "Sélection intervenants", "Programme", "Billetterie", "Signalétique", "Accueil", "Conférences", "Networking", "Clôture", "Suivi post-événement"],
    },
  ],

  formateur: [
    {
      name: "Session de formation",
      category: "formation",
      steps: ["Inscription reçue", "Convention signée", "Acompte reçu", "Formation en cours", "Évaluation finale", "Attestation émise", "Solde"],
    },
    {
      name: "Formation en ligne",
      category: "formation",
      steps: ["Recueil des besoins", "Script / Storyboard", "Enregistrement modules", "Montage", "Mise en ligne plateforme", "Inscription apprenants", "Suivi progression", "Quiz / Évaluation", "Certification", "Bilan"],
    },
  ],

  garages: [
    {
      name: "Suivi véhicule client",
      category: "réparation",
      steps: ["Véhicule reçu", "Diagnostic", "Devis envoyé", "Devis accepté", "En réparation", "Prêt à récupérer", "Terminé"],
    },
    {
      name: "Réparation véhicule",
      category: "réparation",
      steps: ["Accueil client", "Diagnostic", "Devis", "Accord client", "Commande pièces", "Réception pièces", "Réparation", "Contrôle qualité", "Essai route", "Restitution véhicule", "Facturation"],
    },
    {
      name: "Entretien / Révision",
      category: "suivi",
      steps: ["Prise de rendez-vous", "Réception véhicule", "Points de contrôle", "Vidange / Filtres", "Freins / Pneus", "Contrôle général", "Compte rendu", "Restitution", "Planification prochain entretien"],
    },
  ],

  mariage: [
    {
      name: "Commande robe de mariée",
      category: "vente",
      steps: ["RDV Pris", "Mesures Prises", "En Confection", "Essayage Intermédiaire", "Essayage Final", "Arrivée Boutique", "Prête à Récupérer", "Terminée"],
    },
    {
      name: "Organisation mariage",
      category: "événement",
      steps: ["Premier rendez-vous", "Définition budget", "Sélection lieu", "Choix prestataires", "Envoi faire-part", "Gestion RSVPs", "Planning jour J", "Essayage", "Répétition", "Jour J – Installation", "Cérémonie", "Réception", "Bilan & album"],
    },
    {
      name: "Prestation mariage (photo/DJ/traiteur)",
      category: "service",
      steps: ["Demande reçue", "Rendez-vous couple", "Devis personnalisé", "Réservation", "Repérage lieu", "Préparation", "Jour J", "Post-production", "Livraison", "Retour client"],
    },
  ],

  nettoyage: [
    {
      name: "Contrat récurrent",
      category: "gestion",
      steps: ["Devis envoyé", "Contrat signé", "Planifié", "Intervention en cours", "Intervention terminée", "Rapport envoyé", "Facturé"],
    },
    {
      name: "Intervention ponctuelle",
      category: "service",
      steps: ["Demande reçue", "Évaluation", "Devis rapide", "Confirmation", "Intervention", "Vérification", "Facturation"],
    },
  ],

  reparateur: [
    {
      name: "Réparation appareil",
      category: "réparation",
      steps: ["Appareil reçu", "Diagnostic", "Devis envoyé", "Devis accepté", "En réparation", "Tests effectués", "Prêt à récupérer", "Terminé"],
    },
    {
      name: "Intervention à domicile",
      category: "réparation",
      steps: ["Appel client", "Pré-diagnostic", "Planification", "Déplacement", "Diagnostic sur place", "Réparation", "Vérification", "Facturation", "Suivi"],
    },
  ],

  traiteur: [
    {
      name: "Événement traiteur",
      category: "événement",
      steps: ["Demande reçue", "Devis envoyé", "Menu validé", "Contrat signé", "Acompte reçu", "Préparation", "Livraison / Service", "Solde"],
    },
    {
      name: "Commande emporter / livraison",
      category: "production",
      steps: ["Commande reçue", "Vérification stock", "Préparation", "Conditionnement", "Livraison / Retrait", "Confirmation réception"],
    },
  ],

  "cabinet-recrutement": [
    {
      name: "Mission de recrutement",
      category: "projet",
      steps: ["Mission ouverte", "Sourcing", "Entretien cabinet", "Candidat présenté", "Entretien client", "Offre faite", "Intégré"],
    },
    {
      name: "Chasse de tête",
      category: "projet",
      steps: ["Brief client", "Mapping marché", "Approche directe", "Entretien qualification", "Présentation shortlist", "Entretiens client", "Négociation", "Offre", "Intégration", "Suivi période d'essai"],
    },
  ],

  "auto-ecole": [
    {
      name: "Parcours élève permis B",
      category: "formation",
      steps: ["Inscription", "Dossier NEPH", "Code en cours", "Heures de conduite", "Examen blanc", "Passage code", "Passage conduite", "Diplômé"],
    },
    {
      name: "Parcours conduite accompagnée",
      category: "formation",
      steps: ["Inscription", "Dossier NEPH", "Code en cours", "20h de conduite", "RDV pédagogique 1", "Conduite accompagnée", "RDV pédagogique 2", "Passage conduite", "Diplômé"],
    },
  ],

  "cabinet-avocats": [
    {
      name: "Affaire contentieuse",
      category: "gestion",
      steps: ["Consultation initiale", "Mandat signé", "Instruction du dossier", "Échanges adverses", "Audience", "Délibéré", "Décision rendue", "Clôturé"],
    },
    {
      name: "Procédure amiable",
      category: "gestion",
      steps: ["Consultation initiale", "Mandat signé", "Analyse du dossier", "Mise en demeure", "Négociation", "Protocole d'accord", "Exécution", "Clôturé"],
    },
  ],

  "expert-comptable": [
    {
      name: "Mission comptable annuelle",
      category: "gestion",
      steps: ["Dossier ouvert", "Pièces collectées", "Saisie comptable", "Révision", "Déclaration préparée", "Validée client", "Envoyée aux impôts"],
    },
    {
      name: "Déclaration fiscale",
      category: "gestion",
      steps: ["Collecte pièces", "Saisie", "Contrôle", "Préparation déclaration", "Validation client", "Télétransmission", "Accusé de réception", "Archivage"],
    },
  ],

  "centre-islamique": [
    {
      name: "Parcours élève Coran",
      category: "formation",
      steps: ["Inscription", "Évaluation initiale", "Niveau placé", "Cours en cours", "Évaluation périodique", "Progression validée", "Diplôme / Ijaza"],
    },
  ],

  "association-sportive": [
    {
      name: "Adhésion membre",
      category: "suivi",
      steps: ["Demande adhésion", "Licence validée", "Cotisation payée", "Membre actif", "Renouvellement", "Membre renouvelé"],
    },
  ],
};

/** Get presets for a given sector key, falling back to generic */
export function getPresetsForSector(sectorKey: string | null): TimelinePreset[] {
  if (!sectorKey) return SECTOR_TIMELINE_PRESETS.generic;
  return SECTOR_TIMELINE_PRESETS[sectorKey] || SECTOR_TIMELINE_PRESETS.generic;
}

/** Get all available presets across all sectors (for browsing) */
export function getAllSectorPresets(): { sectorKey: string; sectorLabel: string; presets: TimelinePreset[] }[] {
  const sectorLabels: Record<string, string> = {
    generic: "Générique",
    immobilier: "Immobilier",
    btp: "BTP",
    coiffure: "Coiffure",
    photographe: "Photographe",
    consultant: "Consultant",
    conciergerie: "Conciergerie",
    boutique: "Boutique",
    cabinets: "Cabinets",
    "coach-sportif": "Coach sportif",
    "community-manager": "Community Manager",
    designer: "Designer",
    developpeur: "Développeur",
    "dj-animateur": "DJ / Animateur",
    evenementiel: "Événementiel",
    formateur: "Formateur",
    garages: "Garages",
    mariage: "Mariage",
    nettoyage: "Nettoyage",
    reparateur: "Réparateur",
    traiteur: "Traiteur",
    "cabinet-recrutement": "Cabinet de Recrutement",
    "auto-ecole": "Auto-École",
    "cabinet-avocats": "Cabinet d'Avocats",
    "expert-comptable": "Expert-Comptable",
    "centre-islamique": "Centre islamique",
    "association-sportive": "Association sportive",
  };

  return Object.entries(SECTOR_TIMELINE_PRESETS).map(([key, presets]) => ({
    sectorKey: key,
    sectorLabel: sectorLabels[key] || key,
    presets,
  }));
}

/** Get all unique categories used across all presets */
export function getAllCategories(): PresetCategory[] {
  const cats = new Set<PresetCategory>();
  Object.values(SECTOR_TIMELINE_PRESETS).forEach((presets) =>
    presets.forEach((p) => cats.add(p.category))
  );
  return Array.from(cats).sort();
}
