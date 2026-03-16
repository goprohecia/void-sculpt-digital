// ── Mock data for Salle de Sport / Coach Sportif sector ──
import { getDefaultStepsForSector } from "./sectorTimelines";

export const SPORT_STEPS = getDefaultStepsForSector("coach-sportif");

export interface SportMembre {
  id: string;
  nom: string;
  email: string;
  abonnement: "mensuel" | "trimestriel" | "annuel";
  dateDebut: string;
  dateFin: string;
  renouvellementAuto: boolean;
  statut: "actif" | "expire" | "suspendu";
  coachId: string;
  etape: number;
  poids: number[];
  mensurations: { date: string; tour_bras: number; tour_taille: number; tour_cuisses: number }[];
  objectifs: string[];
  derniereSeance: string;
}

export interface SportCoach {
  id: string;
  nom: string;
  specialite: string;
  membresAssignes: number;
  seancesSemaine: number;
}

export interface SportCours {
  id: string;
  nom: string;
  coach: string;
  jour: string;
  heure: string;
  duree: number;
  capacite: number;
  inscrits: number;
}

export interface SportSeance {
  id: string;
  membreNom: string;
  date: string;
  heure: string;
  type: string;
  duree: number;
  notes: string;
}

export const MOCK_SPORT_COACHS: SportCoach[] = [
  { id: "sc1", nom: "Kevin Rousseau", specialite: "Musculation & HIIT", membresAssignes: 12, seancesSemaine: 18 },
  { id: "sc2", nom: "Sarah Lemoine", specialite: "Yoga & Pilates", membresAssignes: 15, seancesSemaine: 14 },
  { id: "sc3", nom: "Maxime Torres", specialite: "CrossFit & Cardio", membresAssignes: 10, seancesSemaine: 16 },
];

export const MOCK_SPORT_MEMBRES: SportMembre[] = [
  {
    id: "sm1", nom: "Julie Moreau", email: "julie@email.com", abonnement: "annuel",
    dateDebut: "2025-09-01", dateFin: "2026-08-31", renouvellementAuto: true, statut: "actif",
    coachId: "sc1", etape: 3,
    poids: [72, 71.5, 70.8, 70.2, 69.5, 69.0],
    mensurations: [
      { date: "2025-09-15", tour_bras: 30, tour_taille: 78, tour_cuisses: 56 },
      { date: "2026-01-10", tour_bras: 29, tour_taille: 74, tour_cuisses: 54 },
    ],
    objectifs: ["Perte de poids -5kg", "Tonification"], derniereSeance: "2026-03-08",
  },
  {
    id: "sm2", nom: "Thomas Bernard", email: "thomas@email.com", abonnement: "mensuel",
    dateDebut: "2026-02-01", dateFin: "2026-03-01", renouvellementAuto: false, statut: "expire",
    coachId: "sc1", etape: 5,
    poids: [85, 84, 83.5],
    mensurations: [{ date: "2026-02-05", tour_bras: 35, tour_taille: 90, tour_cuisses: 60 }],
    objectifs: ["Prise de masse", "Endurance"], derniereSeance: "2026-02-25",
  },
  {
    id: "sm3", nom: "Claire Petit", email: "claire@email.com", abonnement: "trimestriel",
    dateDebut: "2026-01-15", dateFin: "2026-04-15", renouvellementAuto: true, statut: "actif",
    coachId: "sc2", etape: 3,
    poids: [62, 61.5, 61],
    mensurations: [{ date: "2026-01-20", tour_bras: 26, tour_taille: 68, tour_cuisses: 50 }],
    objectifs: ["Souplesse", "Bien-être"], derniereSeance: "2026-03-09",
  },
  {
    id: "sm4", nom: "Antoine Lefevre", email: "antoine@email.com", abonnement: "annuel",
    dateDebut: "2025-06-01", dateFin: "2026-05-31", renouvellementAuto: true, statut: "actif",
    coachId: "sc3", etape: 4,
    poids: [78, 77, 76.5, 76, 75.5],
    mensurations: [
      { date: "2025-06-10", tour_bras: 32, tour_taille: 84, tour_cuisses: 55 },
      { date: "2025-12-15", tour_bras: 33, tour_taille: 80, tour_cuisses: 56 },
    ],
    objectifs: ["Condition physique générale", "Prépa marathon"], derniereSeance: "2026-03-07",
  },
  {
    id: "sm5", nom: "Emma Rousseau", email: "emma@email.com", abonnement: "mensuel",
    dateDebut: "2026-03-01", dateFin: "2026-03-31", renouvellementAuto: true, statut: "actif",
    coachId: "sc2", etape: 1,
    poids: [58],
    mensurations: [],
    objectifs: ["Découverte yoga"], derniereSeance: "",
  },
];

export const MOCK_SPORT_COURS: SportCours[] = [
  { id: "cc1", nom: "HIIT Express", coach: "Kevin Rousseau", jour: "Lundi", heure: "12:00", duree: 45, capacite: 20, inscrits: 18 },
  { id: "cc2", nom: "Yoga Flow", coach: "Sarah Lemoine", jour: "Mardi", heure: "18:00", duree: 60, capacite: 15, inscrits: 12 },
  { id: "cc3", nom: "CrossFit WOD", coach: "Maxime Torres", jour: "Mercredi", heure: "07:00", duree: 60, capacite: 12, inscrits: 12 },
  { id: "cc4", nom: "Pilates Doux", coach: "Sarah Lemoine", jour: "Jeudi", heure: "10:00", duree: 50, capacite: 15, inscrits: 8 },
  { id: "cc5", nom: "Cardio Boxing", coach: "Maxime Torres", jour: "Vendredi", heure: "18:30", duree: 45, capacite: 20, inscrits: 16 },
  { id: "cc6", nom: "Full Body", coach: "Kevin Rousseau", jour: "Samedi", heure: "10:00", duree: 60, capacite: 20, inscrits: 14 },
];

export const MOCK_SPORT_SEANCES_COACH: SportSeance[] = [
  { id: "ss1", membreNom: "Julie Moreau", date: "2026-03-10", heure: "09:00", type: "Musculation", duree: 60, notes: "Travail haut du corps" },
  { id: "ss2", membreNom: "Antoine Lefevre", date: "2026-03-10", heure: "10:30", type: "CrossFit", duree: 45, notes: "WOD endurance" },
  { id: "ss3", membreNom: "Thomas Bernard", date: "2026-03-11", heure: "14:00", type: "Musculation", duree: 60, notes: "Jambes + abdos" },
  { id: "ss4", membreNom: "Claire Petit", date: "2026-03-11", heure: "16:00", type: "Yoga", duree: 60, notes: "Séance souplesse" },
  { id: "ss5", membreNom: "Julie Moreau", date: "2026-03-12", heure: "09:00", type: "HIIT", duree: 30, notes: "Intervalle haute intensité" },
];

export const SPORT_KPIS = {
  membresActifs: 87,
  revenusAbonnements: 14250,
  tauxRetention: 82,
  coachsActifs: 3,
  coursCollectifsSemaine: 6,
  seancesPersoSemaine: 48,
};

// For the client/member view
export const MOCK_SPORT_MEMBER_SEANCES = [
  { date: "2026-03-08", type: "Musculation", coach: "Kevin Rousseau", duree: 60, notes: "Haut du corps — PR développé couché 70kg" },
  { date: "2026-03-05", type: "HIIT", coach: "Kevin Rousseau", duree: 30, notes: "Circuit 5 rounds" },
  { date: "2026-03-03", type: "Musculation", coach: "Kevin Rousseau", duree: 60, notes: "Dos + biceps" },
  { date: "2026-02-28", type: "Cardio", coach: "Kevin Rousseau", duree: 45, notes: "Rameur + vélo" },
];
