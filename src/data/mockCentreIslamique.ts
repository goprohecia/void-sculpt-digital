// ── Mock data for Centre Islamique sector ──
import { getDefaultStepsForSector } from "./sectorTimelines";

export const CENTRE_ISLAMIQUE_STEPS = getDefaultStepsForSector("centre-islamique");

export interface CentreProfesseur {
  id: string;
  nom: string;
  specialite: string;
  elevesAssignes: number;
}

export interface CentreEleve {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  professeurId: string;
  professeurNom: string;
  etape: number;
  dateInscription: string;
  niveauCoran: string;
  progression: string;
  cotisationMensuelle: number;
  cotisationStatut: "payee" | "en_attente" | "retard";
  notes: string;
  stepDates: (string | null)[];
}

export const MOCK_PROFESSEURS: CentreProfesseur[] = [
  { id: "prof-1", nom: "Sheikh Abdallah Idris", specialite: "Mémorisation du Coran & Tajwid", elevesAssignes: 18 },
  { id: "prof-2", nom: "Ustadha Fatima Zahra", specialite: "Langue arabe & Sciences islamiques", elevesAssignes: 14 },
];

export const MOCK_ELEVES: CentreEleve[] = [
  {
    id: "elv-1",
    nom: "Yusuf Al-Rashid",
    email: "yusuf.alrashid@email.com",
    telephone: "06 12 34 56 78",
    professeurId: "prof-1",
    professeurNom: "Sheikh Abdallah Idris",
    etape: 3,
    dateInscription: "2025-09-15",
    niveauCoran: "Hizb 12 — Sourate Al-Kahf",
    progression: "Mémorisation en cours — 12 Hizb validés sur 60",
    cotisationMensuelle: 80,
    cotisationStatut: "payee",
    notes: "Excellent en Tajwid, rythme régulier de mémorisation",
    stepDates: ["2025-09-15", "2025-09-20", "2025-09-25", "2025-10-01", null, null, null],
  },
  {
    id: "elv-2",
    nom: "Amina Benali",
    email: "amina.benali@email.com",
    telephone: "06 23 45 67 89",
    professeurId: "prof-2",
    professeurNom: "Ustadha Fatima Zahra",
    etape: 4,
    dateInscription: "2025-06-01",
    niveauCoran: "Jouz 3 — Sourate Al-Baqara (fin)",
    progression: "Révision intensive Jouz 1 à 3",
    cotisationMensuelle: 80,
    cotisationStatut: "payee",
    notes: "Bonne prononciation, travaille la fluidité de lecture",
    stepDates: ["2025-06-01", "2025-06-05", "2025-06-10", "2025-06-20", "2026-02-15", null, null],
  },
  {
    id: "elv-3",
    nom: "Ibrahim Konate",
    email: "ibrahim.konate@email.com",
    telephone: "06 34 56 78 90",
    professeurId: "prof-1",
    professeurNom: "Sheikh Abdallah Idris",
    etape: 1,
    dateInscription: "2026-03-01",
    niveauCoran: "Débutant — Jouz Amma",
    progression: "En cours d'évaluation initiale",
    cotisationMensuelle: 80,
    cotisationStatut: "en_attente",
    notes: "Nouvel élève, première inscription, niveau à déterminer",
    stepDates: ["2026-03-01", "2026-03-10", null, null, null, null, null],
  },
  {
    id: "elv-4",
    nom: "Sara Mansouri",
    email: "sara.mansouri@email.com",
    telephone: "06 45 67 89 01",
    professeurId: "prof-2",
    professeurNom: "Ustadha Fatima Zahra",
    etape: 5,
    dateInscription: "2024-09-01",
    niveauCoran: "Hizb 30 — Mi-parcours",
    progression: "15 Jouz mémorisés — évaluation périodique réussie",
    cotisationMensuelle: 80,
    cotisationStatut: "payee",
    notes: "Élève assidue, objectif Ijaza d'ici 2 ans",
    stepDates: ["2024-09-01", "2024-09-05", "2024-09-10", "2024-09-20", "2026-01-15", "2026-03-01", null],
  },
];

export const MOCK_CENTRE_RDV = [
  { heure: "09:00", clientNom: "Yusuf Al-Rashid", motif: "Cours de Tajwid", professeur: "Sheikh Abdallah Idris" },
  { heure: "10:30", clientNom: "Ibrahim Konate", motif: "Évaluation initiale", professeur: "Sheikh Abdallah Idris" },
  { heure: "14:00", clientNom: "Sara Mansouri", motif: "Séance de révision", professeur: "Ustadha Fatima Zahra" },
  { heure: "16:00", clientNom: "Amina Benali", motif: "Cours de langue arabe", professeur: "Ustadha Fatima Zahra" },
];

export const CENTRE_ISLAMIQUE_KPIS = {
  elevesActifs: 32,
  elevesTotal: 38,
  cotisationsMensuelles: 2560,
  cotisationsImpayees: 320,
  tauxAssiduite: 89,
  professeurs: 2,
  coursParSemaine: 12,
  inscriptionsMois: 160,
};
