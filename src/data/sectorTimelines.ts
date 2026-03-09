export interface TimelinePreset {
  name: string;
  steps: string[];
}

export const SECTOR_TIMELINE_PRESETS: Record<string, TimelinePreset[]> = {
  generic: [
    {
      name: "Par défaut",
      steps: ["Demande reçue", "Rendez-vous", "Cahier des charges", "Devis envoyé", "Devis accepté", "En cours", "Livraison", "Terminé"],
    },
  ],

  immobilier: [
    {
      name: "Mandat de vente",
      steps: ["Demande reçue", "Premier contact", "Estimation du bien", "Signature du mandat", "Prise de photos", "Diffusion annonce", "Visites", "Offre d'achat", "Négociation", "Signature du compromis", "Délai de rétractation", "Obtention du prêt", "Signature chez le notaire", "Remise des clés"],
    },
    {
      name: "Location",
      steps: ["Demande reçue", "Visite du bien", "Constitution du dossier", "Vérification du dossier", "Validation du dossier", "Signature du bail", "État des lieux d'entrée", "Remise des clés"],
    },
    {
      name: "Gestion locative",
      steps: ["Prise en charge", "Diagnostic technique", "Mise en conformité", "Recherche locataire", "Sélection candidat", "Signature bail", "Suivi loyers", "Régularisation charges", "Renouvellement bail"],
    },
  ],

  btp: [
    {
      name: "Chantier neuf",
      steps: ["Appel d'offres", "Étude technique", "Chiffrage", "Devis envoyé", "Signature contrat", "Demande de permis", "Terrassement", "Fondations", "Gros œuvre", "Charpente / Toiture", "Second œuvre", "Finitions", "Nettoyage chantier", "Réception travaux", "Levée de réserves", "Clôture dossier"],
    },
    {
      name: "Rénovation",
      steps: ["Visite technique", "Diagnostic", "Devis", "Accord client", "Dépose / Démolition", "Travaux", "Finitions", "Nettoyage", "Réception", "Garantie"],
    },
    {
      name: "Dépannage / Urgence",
      steps: ["Appel client", "Diagnostic téléphonique", "Intervention", "Réparation", "Vérification", "Facturation", "Clôture"],
    },
  ],

  coiffure: [
    {
      name: "Prestation salon",
      steps: ["Prise de rendez-vous", "Accueil client", "Diagnostic capillaire", "Proposition soin", "Réalisation", "Coiffage final", "Encaissement", "Prise RDV suivant"],
    },
    {
      name: "Coloration complète",
      steps: ["Consultation couleur", "Test allergie", "Préparation mélange", "Application", "Temps de pose", "Rinçage", "Soin post-coloration", "Coupe / Brushing", "Encaissement"],
    },
  ],

  photographe: [
    {
      name: "Shooting photo",
      steps: ["Demande reçue", "Brief créatif", "Devis envoyé", "Repérage", "Préparation matériel", "Shooting", "Tri & sélection", "Retouche", "Livraison galerie", "Validation client", "Livraison finale"],
    },
    {
      name: "Reportage événement",
      steps: ["Premier contact", "Visite des lieux", "Devis", "Confirmation", "Préparation", "Couverture événement", "Post-production", "Livraison aperçu", "Retouches finales", "Livraison complète", "Archivage"],
    },
  ],

  consultant: [
    {
      name: "Mission de conseil",
      steps: ["Premier contact", "Analyse du besoin", "Proposition commerciale", "Négociation", "Signature contrat", "Cadrage mission", "Audit / Diagnostic", "Recommandations", "Plan d'action", "Accompagnement", "Bilan de mission", "Clôture"],
    },
    {
      name: "Formation sur mesure",
      steps: ["Recueil des besoins", "Conception programme", "Devis", "Validation", "Préparation supports", "Animation", "Évaluation", "Remise attestation", "Suivi post-formation"],
    },
  ],

  conciergerie: [
    {
      name: "Gestion locative saisonnière",
      steps: ["Prise en charge du bien", "Shooting photos", "Création annonce", "Publication plateformes", "Réservation reçue", "Préparation du logement", "Check-in voyageur", "Suivi séjour", "Check-out", "Ménage", "Bilan propriétaire"],
    },
    {
      name: "Service ponctuel",
      steps: ["Demande reçue", "Évaluation", "Devis", "Confirmation", "Intervention", "Contrôle qualité", "Facturation"],
    },
  ],

  boutique: [
    {
      name: "Commande client",
      steps: ["Commande reçue", "Vérification stock", "Préparation", "Emballage", "Expédition", "Suivi livraison", "Livré", "Retour éventuel"],
    },
    {
      name: "Commande fournisseur",
      steps: ["Analyse des besoins", "Sélection fournisseur", "Commande passée", "Confirmation fournisseur", "Expédition", "Réception", "Contrôle qualité", "Mise en rayon"],
    },
  ],

  cabinets: [
    {
      name: "Dossier juridique",
      steps: ["Consultation initiale", "Analyse du dossier", "Recherche juridique", "Rédaction acte", "Relecture", "Signature", "Enregistrement", "Suivi exécution", "Archivage"],
    },
    {
      name: "Dossier comptable",
      steps: ["Réception pièces", "Saisie comptable", "Rapprochement bancaire", "Déclarations fiscales", "Bilan", "Présentation au client", "Dépôt officiel", "Archivage"],
    },
  ],

  "coach-sportif": [
    {
      name: "Suivi client",
      steps: ["Premier contact", "Bilan forme", "Définition objectifs", "Programme personnalisé", "Séance découverte", "Suivi régulier", "Bilan intermédiaire", "Ajustement programme", "Bilan final"],
    },
    {
      name: "Stage / Bootcamp",
      steps: ["Inscription", "Questionnaire santé", "Confirmation", "Envoi programme", "Jour 1", "Suivi quotidien", "Dernier jour", "Bilan", "Programme de continuité"],
    },
  ],

  "community-manager": [
    {
      name: "Gestion réseaux sociaux",
      steps: ["Brief client", "Audit réseaux existants", "Stratégie éditoriale", "Création calendrier", "Production contenu", "Validation client", "Programmation", "Publication", "Community management", "Reporting mensuel"],
    },
    {
      name: "Campagne sponsorisée",
      steps: ["Définition objectif", "Ciblage audience", "Création visuel", "Rédaction copy", "Validation", "Mise en ligne", "Optimisation", "Rapport de performance"],
    },
  ],

  designer: [
    {
      name: "Projet design",
      steps: ["Brief créatif", "Recherche & inspiration", "Moodboard", "Wireframes", "Maquette V1", "Retours client", "Maquette V2", "Validation finale", "Export fichiers", "Livraison", "Guide d'utilisation"],
    },
    {
      name: "Identité visuelle",
      steps: ["Brief", "Benchmark concurrence", "Propositions logo", "Sélection direction", "Déclinaisons", "Charte graphique", "Validation", "Livraison fichiers sources"],
    },
  ],

  developpeur: [
    {
      name: "Projet web / app",
      steps: ["Recueil des besoins", "Cahier des charges", "Architecture technique", "Devis", "Maquettes", "Développement", "Tests", "Recette client", "Corrections", "Mise en production", "Formation", "Maintenance"],
    },
    {
      name: "Mission freelance",
      steps: ["Premier contact", "Évaluation technique", "Proposition", "Démarrage", "Sprints", "Démo", "Ajustements", "Livraison", "Documentation", "Clôture"],
    },
  ],

  "dj-animateur": [
    {
      name: "Prestation événement",
      steps: ["Demande reçue", "Appel découverte", "Devis", "Confirmation", "Playlist personnalisée", "Repérage salle", "Installation matériel", "Prestation", "Démontage", "Facturation", "Demande avis"],
    },
  ],

  evenementiel: [
    {
      name: "Organisation événement",
      steps: ["Brief client", "Concept créatif", "Budget prévisionnel", "Validation concept", "Recherche prestataires", "Réservation lieu", "Logistique", "Communication", "Répétition générale", "Jour J – Installation", "Événement", "Démontage", "Bilan & reporting"],
    },
    {
      name: "Salon / Conférence",
      steps: ["Appel à conférenciers", "Sélection intervenants", "Programme", "Billetterie", "Signalétique", "Accueil", "Conférences", "Networking", "Clôture", "Suivi post-événement"],
    },
  ],

  formateur: [
    {
      name: "Formation présentielle",
      steps: ["Analyse des besoins", "Conception programme", "Devis / Convention", "Convocations", "Préparation supports", "Jour de formation", "Évaluation à chaud", "Remise attestation", "Évaluation à froid", "Bilan"],
    },
    {
      name: "Formation en ligne",
      steps: ["Recueil des besoins", "Script / Storyboard", "Enregistrement modules", "Montage", "Mise en ligne plateforme", "Inscription apprenants", "Suivi progression", "Quiz / Évaluation", "Certification", "Bilan"],
    },
  ],

  garages: [
    {
      name: "Réparation véhicule",
      steps: ["Accueil client", "Diagnostic", "Devis", "Accord client", "Commande pièces", "Réception pièces", "Réparation", "Contrôle qualité", "Essai route", "Restitution véhicule", "Facturation"],
    },
    {
      name: "Entretien / Révision",
      steps: ["Prise de rendez-vous", "Réception véhicule", "Points de contrôle", "Vidange / Filtres", "Freins / Pneus", "Contrôle général", "Compte rendu", "Restitution", "Planification prochain entretien"],
    },
  ],

  mariage: [
    {
      name: "Organisation mariage",
      steps: ["Premier rendez-vous", "Définition budget", "Sélection lieu", "Choix prestataires", "Envoi faire-part", "Gestion RSVPs", "Planning jour J", "Essayage", "Répétition", "Jour J – Installation", "Cérémonie", "Réception", "Bilan & album"],
    },
    {
      name: "Prestation mariage (photo/DJ/traiteur)",
      steps: ["Demande reçue", "Rendez-vous couple", "Devis personnalisé", "Réservation", "Repérage lieu", "Préparation", "Jour J", "Post-production", "Livraison", "Retour client"],
    },
  ],

  nettoyage: [
    {
      name: "Contrat récurrent",
      steps: ["Demande reçue", "Visite des locaux", "Cahier des charges", "Devis", "Signature contrat", "Planification équipes", "Première intervention", "Contrôle qualité", "Suivi mensuel", "Renouvellement"],
    },
    {
      name: "Intervention ponctuelle",
      steps: ["Demande reçue", "Évaluation", "Devis rapide", "Confirmation", "Intervention", "Vérification", "Facturation"],
    },
  ],

  reparateur: [
    {
      name: "Réparation appareil",
      steps: ["Réception appareil", "Diagnostic", "Devis", "Accord client", "Commande pièces", "Réparation", "Tests", "Notification client", "Restitution", "Garantie réparation"],
    },
    {
      name: "Intervention à domicile",
      steps: ["Appel client", "Pré-diagnostic", "Planification", "Déplacement", "Diagnostic sur place", "Réparation", "Vérification", "Facturation", "Suivi"],
    },
  ],

  traiteur: [
    {
      name: "Prestation traiteur",
      steps: ["Demande reçue", "Rendez-vous découverte", "Proposition menu", "Dégustation", "Devis final", "Confirmation", "Commande fournisseurs", "Préparation", "Livraison / Installation", "Service", "Démontage", "Facturation"],
    },
    {
      name: "Commande emporter / livraison",
      steps: ["Commande reçue", "Vérification stock", "Préparation", "Conditionnement", "Livraison / Retrait", "Confirmation réception"],
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
  };

  return Object.entries(SECTOR_TIMELINE_PRESETS).map(([key, presets]) => ({
    sectorKey: key,
    sectorLabel: sectorLabels[key] || key,
    presets,
  }));
}
