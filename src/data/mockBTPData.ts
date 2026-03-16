import { getDefaultStepsForSector } from "./sectorTimelines";

export const BTP_STEPS = getDefaultStepsForSector("btp");

export interface BTPChantier {
  id: string;
  clientNom: string;
  clientId: string;
  adresse: string;
  ville: string;
  description: string;
  etape: number;
  montantHT: number;
  montantTTC: number;
  ouvrierId: string;
  ouvrierNom: string;
  dateDebut: string;
  dateFin: string | null;
  stepDates: (string | null)[];
  taches: BTPTache[];
  avancement: number; // 0-100
}

export interface BTPTache {
  id: string;
  label: string;
  done: boolean;
}

export interface BTPDevisLigne {
  poste: string;
  type: "main_oeuvre" | "materiaux";
  quantite: number;
  unite: string;
  prixUnitaire: number;
}

export const MOCK_OUVRIERS = [
  { id: "ouv-1", nom: "Marc Lefort" },
  { id: "ouv-2", nom: "Karim Bensaid" },
];

export const MOCK_CHANTIERS: BTPChantier[] = [
  {
    id: "ch-1",
    clientNom: "M. et Mme Durand",
    clientId: "cli-btp-1",
    adresse: "15 rue des Acacias",
    ville: "Toulouse",
    description: "Extension maison — création d'une véranda 25m²",
    etape: 3,
    montantHT: 18500,
    montantTTC: 22200,
    ouvrierId: "ouv-1",
    ouvrierNom: "Marc Lefort",
    dateDebut: "2026-02-10",
    dateFin: null,
    stepDates: ["2026-01-20", "2026-01-28", "2026-02-05", "2026-02-10", null, null, null],
    taches: [
      { id: "t1-1", label: "Coulage dalle béton", done: true },
      { id: "t1-2", label: "Montage structure aluminium", done: true },
      { id: "t1-3", label: "Pose vitrages", done: false },
      { id: "t1-4", label: "Étanchéité toiture", done: false },
      { id: "t1-5", label: "Finitions intérieures", done: false },
    ],
    avancement: 45,
  },
  {
    id: "ch-2",
    clientNom: "SCI Les Oliviers",
    clientId: "cli-btp-2",
    adresse: "Zone artisanale Les Pins",
    ville: "Montpellier",
    description: "Rénovation façade immeuble — ravalement + isolation",
    etape: 4,
    montantHT: 42000,
    montantTTC: 50400,
    ouvrierId: "ouv-2",
    ouvrierNom: "Karim Bensaid",
    dateDebut: "2026-01-15",
    dateFin: "2026-03-05",
    stepDates: ["2025-12-10", "2025-12-20", "2026-01-08", "2026-01-15", "2026-03-05", null, null],
    taches: [
      { id: "t2-1", label: "Échafaudage", done: true },
      { id: "t2-2", label: "Piquage ancien enduit", done: true },
      { id: "t2-3", label: "Pose isolant", done: true },
      { id: "t2-4", label: "Enduit de finition", done: true },
      { id: "t2-5", label: "Nettoyage chantier", done: true },
    ],
    avancement: 100,
  },
  {
    id: "ch-3",
    clientNom: "Pierre Martin",
    clientId: "cli-btp-3",
    adresse: "8 chemin du Lac",
    ville: "Annecy",
    description: "Salle de bain complète — démolition + création",
    etape: 1,
    montantHT: 9800,
    montantTTC: 11760,
    ouvrierId: "ouv-1",
    ouvrierNom: "Marc Lefort",
    dateDebut: "2026-03-15",
    dateFin: null,
    stepDates: ["2026-02-25", "2026-03-05", null, null, null, null, null],
    taches: [
      { id: "t3-1", label: "Démolition existant", done: false },
      { id: "t3-2", label: "Plomberie", done: false },
      { id: "t3-3", label: "Carrelage sol + murs", done: false },
      { id: "t3-4", label: "Pose sanitaires", done: false },
      { id: "t3-5", label: "Peinture", done: false },
    ],
    avancement: 0,
  },
  {
    id: "ch-4",
    clientNom: "Restaurant Le Bistrot",
    clientId: "cli-btp-4",
    adresse: "3 place de la Mairie",
    ville: "Lyon 2e",
    description: "Aménagement terrasse couverte — structure bois",
    etape: 0,
    montantHT: 15200,
    montantTTC: 18240,
    ouvrierId: "ouv-2",
    ouvrierNom: "Karim Bensaid",
    dateDebut: "2026-04-01",
    dateFin: null,
    stepDates: ["2026-03-01", null, null, null, null, null, null],
    taches: [
      { id: "t4-1", label: "Fondations plots béton", done: false },
      { id: "t4-2", label: "Structure bois lamellé-collé", done: false },
      { id: "t4-3", label: "Couverture polycarbonate", done: false },
      { id: "t4-4", label: "Éclairage", done: false },
    ],
    avancement: 0,
  },
  {
    id: "ch-5",
    clientNom: "Mme Lefèvre",
    clientId: "cli-btp-5",
    adresse: "22 avenue Jean Jaurès",
    ville: "Bordeaux",
    description: "Réfection toiture — tuiles + charpente",
    etape: 5,
    montantHT: 28000,
    montantTTC: 33600,
    ouvrierId: "ouv-1",
    ouvrierNom: "Marc Lefort",
    dateDebut: "2025-11-15",
    dateFin: "2026-01-30",
    stepDates: ["2025-10-20", "2025-10-28", "2025-11-05", "2025-11-15", "2026-01-30", "2026-02-05", null],
    taches: [
      { id: "t5-1", label: "Dépose tuiles", done: true },
      { id: "t5-2", label: "Renfort charpente", done: true },
      { id: "t5-3", label: "Pose écran sous-toiture", done: true },
      { id: "t5-4", label: "Pose tuiles neuves", done: true },
      { id: "t5-5", label: "Zinguerie", done: true },
    ],
    avancement: 100,
  },
  {
    id: "ch-6",
    clientNom: "Copropriété Résidence Azur",
    clientId: "cli-btp-6",
    adresse: "Résidence Azur, Bât. B",
    ville: "Nice",
    description: "Mise aux normes électriques parties communes",
    etape: 6,
    montantHT: 12500,
    montantTTC: 15000,
    ouvrierId: "ouv-2",
    ouvrierNom: "Karim Bensaid",
    dateDebut: "2025-09-01",
    dateFin: "2025-11-15",
    stepDates: ["2025-07-15", "2025-07-25", "2025-08-20", "2025-09-01", "2025-11-15", "2025-11-20", "2025-12-15"],
    taches: [
      { id: "t6-1", label: "Diagnostic électrique", done: true },
      { id: "t6-2", label: "Remplacement tableau", done: true },
      { id: "t6-3", label: "Câblage neuf", done: true },
      { id: "t6-4", label: "Test conformité", done: true },
    ],
    avancement: 100,
  },
];

export const BTP_STEP_MESSAGES: Record<number, string> = {
  0: "Le devis a été envoyé. Nous attendons votre retour.",
  1: "Devis accepté ! Nous planifions le démarrage des travaux.",
  2: "La planification est en cours. L'équipe sera bientôt mobilisée.",
  3: "Les travaux sont en cours sur votre chantier.",
  4: "Les travaux sont terminés ! La facture sera émise prochainement.",
  5: "La facture a été envoyée. En attente du règlement.",
  6: "Le solde est réglé. Chantier clôturé. Merci pour votre confiance !",
};

export interface BTPDocument {
  id: string;
  nom: string;
  type: "devis" | "photo" | "facture";
  statut: "disponible" | "en_attente";
  date: string | null;
}

export const MOCK_DOCUMENTS_CLIENT: BTPDocument[] = [
  { id: "doc-b1", nom: "Devis n°DEV-2026-012 — Accepté", type: "devis", statut: "disponible", date: "2026-01-28" },
  { id: "doc-b2", nom: "Photos de chantier (8 photos)", type: "photo", statut: "disponible", date: "2026-02-20" },
  { id: "doc-b3", nom: "Facture n°FA-2026-034", type: "facture", statut: "en_attente", date: null },
];

export const MOCK_PLANNING_SEMAINE = [
  { jour: "Lundi 10/03", chantiers: [{ id: "ch-1", label: "Véranda Durand — Pose vitrages", heure: "08:00 – 17:00", equipe: "Marc Lefort + 1 aide" }] },
  { jour: "Mardi 11/03", chantiers: [{ id: "ch-1", label: "Véranda Durand — Pose vitrages (suite)", heure: "08:00 – 17:00", equipe: "Marc Lefort + 1 aide" }] },
  { jour: "Mercredi 12/03", chantiers: [{ id: "ch-3", label: "SDB Martin — Préparation matériaux", heure: "08:00 – 12:00", equipe: "Marc Lefort" }, { id: "ch-4", label: "Terrasse Bistrot — Repérage", heure: "14:00 – 16:00", equipe: "Karim Bensaid" }] },
  { jour: "Jeudi 13/03", chantiers: [{ id: "ch-1", label: "Véranda Durand — Étanchéité", heure: "08:00 – 17:00", equipe: "Marc Lefort + 1 aide" }] },
  { jour: "Vendredi 14/03", chantiers: [{ id: "ch-1", label: "Véranda Durand — Finitions", heure: "08:00 – 12:00", equipe: "Marc Lefort" }] },
];
