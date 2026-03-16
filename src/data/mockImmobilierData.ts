import { getDefaultStepsForSector } from "./sectorTimelines";

export const IMMO_STEPS = getDefaultStepsForSector("immobilier");

export const IMMO_STEP_ICONS_NAMES = [
  "FileSignature",
  "Camera",
  "Users",
  "HandCoins",
  "FileCheck",
  "Flag",
] as const;

export interface ImmoBien {
  id: string;
  adresse: string;
  ville: string;
  prix: number;
  type: "vente" | "location";
  surface: number;
  pieces: number;
  etape: number;
  agentId: string;
  agentNom: string;
  proprietaireNom: string;
  proprietaireId: string;
  acheteurNom: string | null;
  acheteurId: string | null;
  dateMandat: string;
  nbVisites: number;
  dernierRetour: string | null;
  stepDates: (string | null)[];
}

export const MOCK_AGENTS = [
  { id: "agent-1", nom: "Sophie Martin", nbMandats: 5, tauxConversion: 72 },
  { id: "agent-2", nom: "Thomas Durand", nbMandats: 3, tauxConversion: 65 },
];

export const MOCK_BIENS: ImmoBien[] = [
  {
    id: "bien-1",
    adresse: "12 rue de la Paix",
    ville: "Paris 2e",
    prix: 485000,
    type: "vente",
    surface: 65,
    pieces: 3,
    etape: 4,
    agentId: "agent-1",
    agentNom: "Sophie Martin",
    proprietaireNom: "Marie Lefèvre",
    proprietaireId: "prop-1",
    acheteurNom: "Jean Dupont",
    acheteurId: "ach-1",
    dateMandat: "2026-01-15",
    nbVisites: 8,
    dernierRetour: "Très intéressé, offre en préparation",
    stepDates: ["2026-01-15", "2026-01-20", "2026-02-01", "2026-02-28", "2026-03-05", null],
  },
  {
    id: "bien-2",
    adresse: "45 avenue Victor Hugo",
    ville: "Lyon 6e",
    prix: 320000,
    type: "vente",
    surface: 52,
    pieces: 2,
    etape: 2,
    agentId: "agent-1",
    agentNom: "Sophie Martin",
    proprietaireNom: "Pierre Moreau",
    proprietaireId: "prop-2",
    acheteurNom: null,
    acheteurId: null,
    dateMandat: "2026-02-10",
    nbVisites: 3,
    dernierRetour: "Un couple intéressé, demande 2e visite",
    stepDates: ["2026-02-10", "2026-02-15", "2026-02-20", null, null, null],
  },
  {
    id: "bien-3",
    adresse: "8 boulevard Gambetta",
    ville: "Nice",
    prix: 1200,
    type: "location",
    surface: 40,
    pieces: 2,
    etape: 3,
    agentId: "agent-2",
    agentNom: "Thomas Durand",
    proprietaireNom: "Claire Bernard",
    proprietaireId: "prop-3",
    acheteurNom: "Lucas Petit",
    acheteurId: "ach-2",
    dateMandat: "2026-02-01",
    nbVisites: 5,
    dernierRetour: "Dossier solide, revenus stables",
    stepDates: ["2026-02-01", "2026-02-05", "2026-02-10", "2026-03-01", null, null],
  },
  {
    id: "bien-4",
    adresse: "22 rue des Lilas",
    ville: "Bordeaux",
    prix: 395000,
    type: "vente",
    surface: 80,
    pieces: 4,
    etape: 1,
    agentId: "agent-2",
    agentNom: "Thomas Durand",
    proprietaireNom: "François Girard",
    proprietaireId: "prop-4",
    acheteurNom: null,
    acheteurId: null,
    dateMandat: "2026-03-01",
    nbVisites: 0,
    dernierRetour: null,
    stepDates: ["2026-03-01", "2026-03-08", null, null, null, null],
  },
  {
    id: "bien-5",
    adresse: "5 place Bellecour",
    ville: "Lyon 2e",
    prix: 550000,
    type: "vente",
    surface: 95,
    pieces: 4,
    etape: 5,
    agentId: "agent-1",
    agentNom: "Sophie Martin",
    proprietaireNom: "Anne Rousseau",
    proprietaireId: "prop-5",
    acheteurNom: "Marc Leroy",
    acheteurId: "ach-3",
    dateMandat: "2025-11-20",
    nbVisites: 12,
    dernierRetour: "Vente finalisée, acte signé",
    stepDates: ["2025-11-20", "2025-11-25", "2025-12-10", "2026-01-05", "2026-01-20", "2026-03-02"],
  },
  {
    id: "bien-6",
    adresse: "17 rue du Commerce",
    ville: "Nantes",
    prix: 950,
    type: "location",
    surface: 35,
    pieces: 1,
    etape: 0,
    agentId: "agent-2",
    agentNom: "Thomas Durand",
    proprietaireNom: "Henri Blanc",
    proprietaireId: "prop-6",
    acheteurNom: null,
    acheteurId: null,
    dateMandat: "2026-03-08",
    nbVisites: 0,
    dernierRetour: null,
    stepDates: ["2026-03-08", null, null, null, null, null],
  },
];

export const IMMO_STEP_MESSAGES_PROPRIETAIRE: Record<number, string> = {
  0: "Votre mandat a été signé. Nous préparons la mise en valeur de votre bien.",
  1: "Les photos sont en cours et l'annonce sera bientôt publiée.",
  2: "Les visites sont en cours. Nous vous informerons des retours.",
  3: "Une offre a été reçue ! Nous l'analysons avec vous.",
  4: "Le compromis est en cours de signature. Bientôt finalisé !",
  5: "L'acte est signé ! La transaction est finalisée. Félicitations !",
};

export const IMMO_STEP_MESSAGES_ACHETEUR: Record<number, string> = {
  0: "Le bien est en cours de préparation pour la mise en vente.",
  1: "L'annonce est en préparation, vous serez bientôt informé.",
  2: "Les visites sont ouvertes, votre créneau est réservé.",
  3: "Votre offre a été transmise au propriétaire.",
  4: "Le compromis est en cours de rédaction.",
  5: "L'acte définitif est signé. Bienvenue chez vous !",
};

export interface ImmoDocument {
  id: string;
  nom: string;
  type: "mandat" | "photos" | "offre" | "compromis" | "acte";
  statut: "disponible" | "en_attente";
  date: string | null;
}

export const MOCK_DOCUMENTS_PROPRIETAIRE: ImmoDocument[] = [
  { id: "doc-1", nom: "Mandat de vente signé", type: "mandat", statut: "disponible", date: "2026-01-15" },
  { id: "doc-2", nom: "Photos du bien (12 photos)", type: "photos", statut: "disponible", date: "2026-01-20" },
  { id: "doc-3", nom: "Offre d'achat — Jean Dupont", type: "offre", statut: "disponible", date: "2026-02-28" },
  { id: "doc-4", nom: "Compromis de vente", type: "compromis", statut: "disponible", date: "2026-03-05" },
  { id: "doc-5", nom: "Acte authentique", type: "acte", statut: "en_attente", date: null },
];

export interface AcheteurCheckItem {
  id: string;
  label: string;
  required: boolean;
}

export const ACHETEUR_CHECKLIST: AcheteurCheckItem[] = [
  { id: "ck-1", label: "Pièce d'identité", required: true },
  { id: "ck-2", label: "Justificatif de domicile", required: true },
  { id: "ck-3", label: "3 derniers bulletins de salaire", required: true },
  { id: "ck-4", label: "Dernier avis d'imposition", required: true },
  { id: "ck-5", label: "Attestation employeur", required: false },
  { id: "ck-6", label: "Simulation de prêt immobilier", required: false },
];

export const MOCK_VISITES_RDV = [
  { date: "2026-03-10", heure: "10:00", bienId: "bien-2", clientNom: "M. et Mme Garnier", adresse: "45 avenue Victor Hugo, Lyon 6e" },
  { date: "2026-03-10", heure: "14:30", bienId: "bien-4", clientNom: "Julie Mercier", adresse: "22 rue des Lilas, Bordeaux" },
  { date: "2026-03-10", heure: "16:00", bienId: "bien-6", clientNom: "Karim Benali", adresse: "17 rue du Commerce, Nantes" },
  { date: "2026-03-11", heure: "09:30", bienId: "bien-2", clientNom: "Paul Fabre", adresse: "45 avenue Victor Hugo, Lyon 6e" },
  { date: "2026-03-11", heure: "11:00", bienId: "bien-4", clientNom: "Émilie Roux", adresse: "22 rue des Lilas, Bordeaux" },
];
