// Mapping of sector → typical employee roles for onboarding
export const SECTOR_ONBOARDING_ROLES: Record<string, { key: string; label: string }[]> = {
  "auto-ecole": [
    { key: "directeur", label: "Directeur" },
    { key: "moniteur", label: "Moniteur" },
    { key: "secretaire", label: "Secrétaire" },
  ],
  conciergerie: [
    { key: "gestionnaire", label: "Gestionnaire" },
    { key: "agent-entretien", label: "Agent d'entretien" },
    { key: "accueil", label: "Agent d'accueil" },
  ],
  btp: [
    { key: "conducteur-travaux", label: "Conducteur de travaux" },
    { key: "chef-chantier", label: "Chef de chantier" },
    { key: "ouvrier", label: "Ouvrier" },
    { key: "metreur", label: "Métreur" },
  ],
  boutique: [
    { key: "gerant", label: "Gérant" },
    { key: "vendeur", label: "Vendeur" },
    { key: "caissier", label: "Caissier" },
  ],
  cabinets: [
    { key: "associe", label: "Associé" },
    { key: "collaborateur", label: "Collaborateur" },
    { key: "assistant-juridique", label: "Assistant juridique" },
  ],
  "coach-sportif": [
    { key: "coach-principal", label: "Coach principal" },
    { key: "coach-assistant", label: "Coach assistant" },
  ],
  coiffure: [
    { key: "gerant", label: "Gérant" },
    { key: "coiffeur", label: "Coiffeur / Praticien" },
    { key: "apprenti", label: "Apprenti" },
  ],
  "community-manager": [
    { key: "directeur-agence", label: "Directeur d'agence" },
    { key: "cm", label: "Community Manager" },
    { key: "charge-compte", label: "Chargé de compte" },
  ],
  consultant: [
    { key: "directeur", label: "Directeur" },
    { key: "consultant-senior", label: "Consultant senior" },
    { key: "consultant-junior", label: "Consultant junior" },
  ],
  designer: [
    { key: "directeur-artistique", label: "Directeur artistique" },
    { key: "designer", label: "Designer" },
    { key: "stagiaire", label: "Stagiaire" },
  ],
  developpeur: [
    { key: "lead-dev", label: "Lead développeur" },
    { key: "developpeur", label: "Développeur" },
    { key: "chef-projet", label: "Chef de projet" },
  ],
  "dj-animateur": [
    { key: "artiste", label: "Artiste / DJ" },
    { key: "regisseur", label: "Régisseur" },
    { key: "assistant", label: "Assistant" },
  ],
  evenementiel: [
    { key: "directeur-evenementiel", label: "Directeur événementiel" },
    { key: "chef-projet", label: "Chef de projet" },
    { key: "logisticien", label: "Logisticien" },
  ],
  formateur: [
    { key: "formateur-principal", label: "Formateur principal" },
    { key: "formateur", label: "Formateur" },
    { key: "assistant-formation", label: "Assistant formation" },
  ],
  garages: [
    { key: "receptionniste", label: "Réceptionniste" },
    { key: "mecanicien", label: "Mécanicien" },
    { key: "carrossier", label: "Carrossier" },
  ],
  immobilier: [
    { key: "directeur-agence", label: "Directeur d'agence" },
    { key: "agent-immobilier", label: "Agent immobilier" },
    { key: "negociateur", label: "Négociateur" },
  ],
  mariage: [
    { key: "responsable", label: "Responsable boutique" },
    { key: "conseillere", label: "Conseillère" },
    { key: "retoucheuse", label: "Retoucheuse" },
  ],
  nettoyage: [
    { key: "responsable", label: "Responsable d'exploitation" },
    { key: "chef-equipe", label: "Chef d'équipe" },
    { key: "agent-nettoyage", label: "Agent de nettoyage" },
  ],
  photographe: [
    { key: "photographe-principal", label: "Photographe principal" },
    { key: "assistant-photo", label: "Assistant photographe" },
    { key: "retoucheur", label: "Retoucheur" },
  ],
  reparateur: [
    { key: "gerant", label: "Gérant" },
    { key: "technicien", label: "Technicien" },
    { key: "accueil", label: "Agent d'accueil" },
  ],
  traiteur: [
    { key: "chef-cuisine", label: "Chef de cuisine" },
    { key: "cuisinier", label: "Cuisinier" },
    { key: "serveur", label: "Serveur / Livreur" },
  ],
  "cabinet-recrutement": [
    { key: "directeur", label: "Directeur" },
    { key: "charge-recrutement", label: "Chargé de recrutement" },
    { key: "charge-sourcing", label: "Chargé de sourcing" },
  ],
  "cabinet-avocats": [
    { key: "associe", label: "Associé" },
    { key: "avocat-collaborateur", label: "Avocat collaborateur" },
    { key: "clerc", label: "Clerc / Secrétaire juridique" },
  ],
  "expert-comptable": [
    { key: "expert-comptable", label: "Expert-comptable" },
    { key: "collaborateur-comptable", label: "Collaborateur comptable" },
    { key: "assistant-comptable", label: "Assistant comptable" },
  ],
};

// Extra roles added when team size is "structure" (20+)
export const STRUCTURE_EXTRA_ROLES = [
  { key: "directeur-general", label: "Directeur général" },
  { key: "manager", label: "Manager" },
  { key: "rh", label: "Responsable RH" },
  { key: "comptable", label: "Comptable" },
];

// Default permissions per role type
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  "directeur": ["voir_analytique_complete", "assigner_dossiers", "modifier_roles", "gerer_facturation", "gerer_employes", "exporter_donnees"],
  "directeur-general": ["voir_analytique_complete", "assigner_dossiers", "modifier_roles", "gerer_facturation", "gerer_employes", "exporter_donnees"],
  "manager": ["voir_analytique_complete", "assigner_dossiers", "gerer_facturation", "exporter_donnees"],
  "rh": ["gerer_employes", "voir_analytique_complete"],
  "comptable": ["gerer_facturation", "voir_analytique_complete", "exporter_donnees"],
  // Default for any other role
  "_default": ["assigner_dossiers"],
};
