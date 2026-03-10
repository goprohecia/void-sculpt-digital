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
      name: "Shooting photo",
      category: "projet",
      steps: ["Demande reçue", "Brief créatif", "Devis envoyé", "Repérage", "Préparation matériel", "Shooting", "Tri & sélection", "Retouche", "Livraison galerie", "Validation client", "Livraison finale"],
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
      steps: ["Premier contact", "Analyse du besoin", "Proposition commerciale", "Négociation", "Signature contrat", "Cadrage mission", "Audit / Diagnostic", "Recommandations", "Plan d'action", "Accompagnement", "Bilan de mission", "Clôture"],
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
      steps: ["Commande reçue", "Vérification stock", "Préparation", "Emballage", "Expédition", "Suivi livraison", "Livré", "Retour éventuel"],
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
      name: "Suivi client",
      category: "suivi",
      steps: ["Premier contact", "Bilan forme", "Définition objectifs", "Programme personnalisé", "Séance découverte", "Suivi régulier", "Bilan intermédiaire", "Ajustement programme", "Bilan final"],
    },
    {
      name: "Stage / Bootcamp",
      category: "formation",
      steps: ["Inscription", "Questionnaire santé", "Confirmation", "Envoi programme", "Jour 1", "Suivi quotidien", "Dernier jour", "Bilan", "Programme de continuité"],
    },
  ],

  "community-manager": [
    {
      name: "Gestion réseaux sociaux",
      category: "gestion",
      steps: ["Brief client", "Audit réseaux existants", "Stratégie éditoriale", "Création calendrier", "Production contenu", "Validation client", "Programmation", "Publication", "Community management", "Reporting mensuel"],
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
      steps: ["Brief créatif", "Recherche & inspiration", "Moodboard", "Wireframes", "Maquette V1", "Retours client", "Maquette V2", "Validation finale", "Export fichiers", "Livraison", "Guide d'utilisation"],
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
      steps: ["Recueil des besoins", "Cahier des charges", "Architecture technique", "Devis", "Maquettes", "Développement", "Tests", "Recette client", "Corrections", "Mise en production", "Formation", "Maintenance"],
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
      steps: ["Demande reçue", "Appel découverte", "Devis", "Confirmation", "Playlist personnalisée", "Repérage salle", "Installation matériel", "Prestation", "Démontage", "Facturation", "Demande avis"],
    },
  ],

  evenementiel: [
    {
      name: "Organisation événement",
      category: "événement",
      steps: ["Brief client", "Concept créatif", "Budget prévisionnel", "Validation concept", "Recherche prestataires", "Réservation lieu", "Logistique", "Communication", "Répétition générale", "Jour J – Installation", "Événement", "Démontage", "Bilan & reporting"],
    },
    {
      name: "Salon / Conférence",
      category: "événement",
      steps: ["Appel à conférenciers", "Sélection intervenants", "Programme", "Billetterie", "Signalétique", "Accueil", "Conférences", "Networking", "Clôture", "Suivi post-événement"],
    },
  ],

  formateur: [
    {
      name: "Formation présentielle",
      category: "formation",
      steps: ["Analyse des besoins", "Conception programme", "Devis / Convention", "Convocations", "Préparation supports", "Jour de formation", "Évaluation à chaud", "Remise attestation", "Évaluation à froid", "Bilan"],
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
      steps: ["Demande reçue", "Visite des locaux", "Cahier des charges", "Devis", "Signature contrat", "Planification équipes", "Première intervention", "Contrôle qualité", "Suivi mensuel", "Renouvellement"],
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
      steps: ["Réception appareil", "Diagnostic", "Devis", "Accord client", "Commande pièces", "Réparation", "Tests", "Notification client", "Restitution", "Garantie réparation"],
    },
    {
      name: "Intervention à domicile",
      category: "réparation",
      steps: ["Appel client", "Pré-diagnostic", "Planification", "Déplacement", "Diagnostic sur place", "Réparation", "Vérification", "Facturation", "Suivi"],
    },
  ],

  traiteur: [
    {
      name: "Prestation traiteur",
      category: "événement",
      steps: ["Demande reçue", "Rendez-vous découverte", "Proposition menu", "Dégustation", "Devis final", "Confirmation", "Commande fournisseurs", "Préparation", "Livraison / Installation", "Service", "Démontage", "Facturation"],
    },
    {
      name: "Commande emporter / livraison",
      category: "production",
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

/** Get all unique categories used across all presets */
export function getAllCategories(): PresetCategory[] {
  const cats = new Set<PresetCategory>();
  Object.values(SECTOR_TIMELINE_PRESETS).forEach((presets) =>
    presets.forEach((p) => cats.add(p.category))
  );
  return Array.from(cats).sort();
}
