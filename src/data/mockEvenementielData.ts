// ── Mock data for Événementiel sector ──
import { getDefaultStepsForSector } from "./sectorTimelines";

export const EVENEMENTIEL_STEPS = getDefaultStepsForSector("evenementiel");

export interface EvenementielPrestataire {
  id: string;
  nom: string;
  type: "traiteur" | "salle" | "technique" | "decoration" | "photo" | "animation";
  statut: "confirmé" | "en_attente" | "refusé";
  montant: number;
  contact: string;
}

export interface EvenementielBudgetPoste {
  id: string;
  poste: string;
  prevu: number;
  reel: number;
  valideClient: boolean;
}

export interface EvenementielJalon {
  id: string;
  label: string;
  date: string;
  fait: boolean;
  alerte?: "J-30" | "J-7" | "J-1";
}

export interface EvenementielEvenement {
  id: string;
  nom: string;
  client: string;
  chefDeProjet: string;
  date: string;
  lieu: string;
  type: string;
  budget: number;
  step: number;
  statut: "en_cours" | "termine" | "annule";
  prestataires: EvenementielPrestataire[];
  budgetPostes: EvenementielBudgetPoste[];
  jalons: EvenementielJalon[];
  programme: string[];
  contratSigne: boolean;
  briefFinalComplete: boolean;
}

export interface EvenementielChefDeProjet {
  id: string;
  nom: string;
  evenementsActifs: number;
  charge: number; // 0-100
}

export const MOCK_CHEFS_DE_PROJET: EvenementielChefDeProjet[] = [
  { id: "cdp-1", nom: "Claire Dupont", evenementsActifs: 3, charge: 85 },
  { id: "cdp-2", nom: "Julien Morel", evenementsActifs: 2, charge: 55 },
  { id: "cdp-3", nom: "Sophie Martin", evenementsActifs: 1, charge: 30 },
];

export const MOCK_EVENEMENTS: EvenementielEvenement[] = [
  {
    id: "evt-1",
    nom: "Gala annuel TechCorp",
    client: "TechCorp SA",
    chefDeProjet: "Claire Dupont",
    date: "2026-03-28",
    lieu: "Palais des Congrès, Paris",
    type: "Gala d'entreprise",
    budget: 45000,
    step: 4,
    statut: "en_cours",
    contratSigne: true,
    briefFinalComplete: false,
    prestataires: [
      { id: "p1", nom: "Le Grand Buffet", type: "traiteur", statut: "confirmé", montant: 12000, contact: "chef@grandbuffet.fr" },
      { id: "p2", nom: "Palais des Congrès", type: "salle", statut: "confirmé", montant: 8000, contact: "reservation@palais.fr" },
      { id: "p3", nom: "SonoLux", type: "technique", statut: "confirmé", montant: 5500, contact: "contact@sonolux.fr" },
      { id: "p4", nom: "Fleurs & Lumières", type: "decoration", statut: "en_attente", montant: 4000, contact: "info@fleursetlumieres.fr" },
      { id: "p5", nom: "Studio Photo Pro", type: "photo", statut: "confirmé", montant: 2500, contact: "booking@photopro.fr" },
    ],
    budgetPostes: [
      { id: "bp1", poste: "Traiteur", prevu: 12000, reel: 12000, valideClient: true },
      { id: "bp2", poste: "Location salle", prevu: 8000, reel: 8000, valideClient: true },
      { id: "bp3", poste: "Son & Lumière", prevu: 6000, reel: 5500, valideClient: true },
      { id: "bp4", poste: "Décoration florale", prevu: 4500, reel: 4000, valideClient: false },
      { id: "bp5", poste: "Photographie", prevu: 3000, reel: 2500, valideClient: true },
      { id: "bp6", poste: "Communication", prevu: 2000, reel: 1800, valideClient: false },
    ],
    jalons: [
      { id: "j1", label: "Envoi invitations", date: "2026-02-28", fait: true },
      { id: "j2", label: "Deadline RSVP", date: "2026-03-14", fait: true },
      { id: "j3", label: "Brief final client", date: "2026-03-21", fait: false, alerte: "J-7" },
      { id: "j4", label: "Installation technique", date: "2026-03-27", fait: false, alerte: "J-1" },
      { id: "j5", label: "Jour J", date: "2026-03-28", fait: false },
    ],
    programme: [
      "18h00 — Accueil cocktail",
      "19h00 — Discours du PDG",
      "19h30 — Remise des prix",
      "20h00 — Dîner assis",
      "22h00 — Soirée dansante",
      "00h00 — Fin de soirée",
    ],
  },
  {
    id: "evt-2",
    nom: "Séminaire leadership 2026",
    client: "Groupe Avenir",
    chefDeProjet: "Julien Morel",
    date: "2026-04-15",
    lieu: "Château de Versailles, Versailles",
    type: "Séminaire d'entreprise",
    budget: 28000,
    step: 2,
    statut: "en_cours",
    contratSigne: false,
    briefFinalComplete: false,
    prestataires: [
      { id: "p6", nom: "Traiteur Royal", type: "traiteur", statut: "en_attente", montant: 8000, contact: "royal@traiteur.fr" },
      { id: "p7", nom: "Château de Versailles", type: "salle", statut: "confirmé", montant: 12000, contact: "events@versailles.fr" },
      { id: "p8", nom: "AV Expert", type: "technique", statut: "en_attente", montant: 3500, contact: "info@avexpert.fr" },
    ],
    budgetPostes: [
      { id: "bp7", poste: "Traiteur", prevu: 8000, reel: 0, valideClient: false },
      { id: "bp8", poste: "Location salle", prevu: 12000, reel: 12000, valideClient: true },
      { id: "bp9", poste: "Audiovisuel", prevu: 4000, reel: 0, valideClient: false },
      { id: "bp10", poste: "Intervenants", prevu: 4000, reel: 0, valideClient: false },
    ],
    jalons: [
      { id: "j6", label: "Validation programme", date: "2026-03-15", fait: false, alerte: "J-30" },
      { id: "j7", label: "Envoi convocations", date: "2026-03-25", fait: false },
      { id: "j8", label: "Brief final", date: "2026-04-08", fait: false, alerte: "J-7" },
      { id: "j9", label: "Jour J", date: "2026-04-15", fait: false },
    ],
    programme: [
      "09h00 — Accueil petit-déjeuner",
      "09h30 — Keynote : Vision 2026",
      "10h30 — Ateliers collaboratifs",
      "12h30 — Déjeuner networking",
      "14h00 — Tables rondes",
      "16h00 — Clôture et cocktail",
    ],
  },
  {
    id: "evt-3",
    nom: "Soirée lancement Produit X",
    client: "StartApp Inc.",
    chefDeProjet: "Sophie Martin",
    date: "2026-02-10",
    lieu: "Le Loft Bastille, Paris",
    type: "Lancement produit",
    budget: 18000,
    step: 7,
    statut: "termine",
    contratSigne: true,
    briefFinalComplete: true,
    prestataires: [
      { id: "p9", nom: "Cocktail Factory", type: "traiteur", statut: "confirmé", montant: 4500, contact: "info@cocktailfactory.fr" },
      { id: "p10", nom: "Le Loft Bastille", type: "salle", statut: "confirmé", montant: 3000, contact: "events@loftbastille.fr" },
      { id: "p11", nom: "DJ Marco", type: "animation", statut: "confirmé", montant: 1200, contact: "marco@djmarco.fr" },
    ],
    budgetPostes: [
      { id: "bp11", poste: "Traiteur", prevu: 5000, reel: 4500, valideClient: true },
      { id: "bp12", poste: "Location salle", prevu: 3000, reel: 3000, valideClient: true },
      { id: "bp13", poste: "DJ & Animation", prevu: 1500, reel: 1200, valideClient: true },
      { id: "bp14", poste: "Décoration", prevu: 2500, reel: 2300, valideClient: true },
    ],
    jalons: [
      { id: "j10", label: "Validation concept", date: "2026-01-10", fait: true },
      { id: "j11", label: "Invitations envoyées", date: "2026-01-25", fait: true },
      { id: "j12", label: "Jour J", date: "2026-02-10", fait: true },
      { id: "j13", label: "Bilan envoyé", date: "2026-02-15", fait: true },
    ],
    programme: [
      "19h00 — Accueil & cocktail",
      "20h00 — Présentation Produit X",
      "20h30 — Démonstrations live",
      "21h00 — Soirée libre & DJ set",
      "23h00 — Fin",
    ],
  },
];

export const EVENEMENTIEL_KPI = {
  caEnCours: 73000,
  evenementsCeMois: 1,
  tauxMarge: 32,
  evenementsTotal: 3,
};
