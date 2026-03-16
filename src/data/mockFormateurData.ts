// ── Mock data for Formateur / Organisme de formation ──
import { getDefaultStepsForSector } from "./sectorTimelines";

export const FORMATEUR_STEPS = getDefaultStepsForSector("formateur");

export interface FormateurModule {
  id: string;
  titre: string;
  duree: string; // e.g. "3h"
  date: string;
  formateur: string;
}

export interface FormateurStagiaire {
  id: string;
  nom: string;
  email: string;
  conventionSignee: boolean;
  emargement: Record<string, { matin: boolean; apresMidi: boolean }>; // key = date
  note: number | null; // /20
  attestationEmise: boolean;
}

export interface FormateurSession {
  id: string;
  intitule: string;
  formateur: string;
  dateDebut: string;
  dateFin: string;
  lieu: string;
  nbStagiaires: number;
  step: number;
  statut: "en_cours" | "terminee" | "a_venir";
  heuresTotal: number;
  heuresEffectuees: number;
  modules: FormateurModule[];
  stagiaires: FormateurStagiaire[];
  qualiopiChecklist: { id: string; label: string; fait: boolean }[];
}

export const MOCK_FORMATEURS = [
  { id: "f-1", nom: "Marie Laurent", specialite: "Management", sessionsActives: 2 },
  { id: "f-2", nom: "Thomas Bernard", specialite: "Digital", sessionsActives: 1 },
  { id: "f-3", nom: "Nadia Khelifi", specialite: "Comptabilité", sessionsActives: 1 },
];

const emargementDates = ["2026-03-02", "2026-03-03", "2026-03-04"];

export const MOCK_SESSIONS: FormateurSession[] = [
  {
    id: "sess-1",
    intitule: "Management d'équipe — Niveau 1",
    formateur: "Marie Laurent",
    dateDebut: "2026-03-02",
    dateFin: "2026-03-06",
    lieu: "Paris — Salle Haussmann",
    nbStagiaires: 8,
    step: 3,
    statut: "en_cours",
    heuresTotal: 35,
    heuresEffectuees: 21,
    modules: [
      { id: "m1", titre: "Les fondamentaux du management", duree: "7h", date: "2026-03-02", formateur: "Marie Laurent" },
      { id: "m2", titre: "Communication et leadership", duree: "7h", date: "2026-03-03", formateur: "Marie Laurent" },
      { id: "m3", titre: "Gestion des conflits", duree: "7h", date: "2026-03-04", formateur: "Marie Laurent" },
      { id: "m4", titre: "Délégation et motivation", duree: "7h", date: "2026-03-05", formateur: "Marie Laurent" },
      { id: "m5", titre: "Évaluation et plan d'action", duree: "7h", date: "2026-03-06", formateur: "Marie Laurent" },
    ],
    stagiaires: [
      { id: "st-1", nom: "Lucas Moreau", email: "lucas@corp.fr", conventionSignee: true, emargement: { "2026-03-02": { matin: true, apresMidi: true }, "2026-03-03": { matin: true, apresMidi: true }, "2026-03-04": { matin: true, apresMidi: false } }, note: null, attestationEmise: false },
      { id: "st-2", nom: "Emma Petit", email: "emma@corp.fr", conventionSignee: true, emargement: { "2026-03-02": { matin: true, apresMidi: true }, "2026-03-03": { matin: true, apresMidi: true }, "2026-03-04": { matin: true, apresMidi: true } }, note: null, attestationEmise: false },
      { id: "st-3", nom: "Hugo Durand", email: "hugo@corp.fr", conventionSignee: true, emargement: { "2026-03-02": { matin: true, apresMidi: false }, "2026-03-03": { matin: true, apresMidi: true }, "2026-03-04": { matin: false, apresMidi: false } }, note: null, attestationEmise: false },
      { id: "st-4", nom: "Léa Martin", email: "lea@corp.fr", conventionSignee: false, emargement: {}, note: null, attestationEmise: false },
    ],
    qualiopiChecklist: [
      { id: "q1", label: "Programme de formation diffusé", fait: true },
      { id: "q2", label: "Convention de formation signée", fait: true },
      { id: "q3", label: "Convocations envoyées", fait: true },
      { id: "q4", label: "Feuilles d'émargement prêtes", fait: true },
      { id: "q5", label: "Évaluation pré-formation", fait: false },
      { id: "q6", label: "Supports pédagogiques distribués", fait: true },
      { id: "q7", label: "Évaluation à chaud", fait: false },
      { id: "q8", label: "Attestation de fin de formation", fait: false },
      { id: "q9", label: "Bilan de formation transmis", fait: false },
    ],
  },
  {
    id: "sess-2",
    intitule: "Marketing Digital — Initiation",
    formateur: "Thomas Bernard",
    dateDebut: "2026-03-16",
    dateFin: "2026-03-18",
    lieu: "Lyon — Centre de formation",
    nbStagiaires: 12,
    step: 1,
    statut: "a_venir",
    heuresTotal: 21,
    heuresEffectuees: 0,
    modules: [
      { id: "m6", titre: "Fondamentaux du marketing digital", duree: "7h", date: "2026-03-16", formateur: "Thomas Bernard" },
      { id: "m7", titre: "Réseaux sociaux et content marketing", duree: "7h", date: "2026-03-17", formateur: "Thomas Bernard" },
      { id: "m8", titre: "SEO, Analytics et plan d'action", duree: "7h", date: "2026-03-18", formateur: "Thomas Bernard" },
    ],
    stagiaires: [
      { id: "st-5", nom: "Camille Roux", email: "camille@pme.fr", conventionSignee: true, emargement: {}, note: null, attestationEmise: false },
      { id: "st-6", nom: "Antoine Leroy", email: "antoine@pme.fr", conventionSignee: false, emargement: {}, note: null, attestationEmise: false },
    ],
    qualiopiChecklist: [
      { id: "q10", label: "Programme de formation diffusé", fait: true },
      { id: "q11", label: "Convention de formation signée", fait: false },
      { id: "q12", label: "Convocations envoyées", fait: false },
      { id: "q13", label: "Feuilles d'émargement prêtes", fait: false },
      { id: "q14", label: "Supports pédagogiques distribués", fait: false },
    ],
  },
  {
    id: "sess-3",
    intitule: "Comptabilité pour non-financiers",
    formateur: "Nadia Khelifi",
    dateDebut: "2026-02-10",
    dateFin: "2026-02-12",
    lieu: "Bordeaux — Hôtel Mercure",
    nbStagiaires: 6,
    step: 6,
    statut: "terminee",
    heuresTotal: 21,
    heuresEffectuees: 21,
    modules: [
      { id: "m9", titre: "Lire un bilan et un compte de résultat", duree: "7h", date: "2026-02-10", formateur: "Nadia Khelifi" },
      { id: "m10", titre: "Analyse financière", duree: "7h", date: "2026-02-11", formateur: "Nadia Khelifi" },
      { id: "m11", titre: "Budget prévisionnel et cash-flow", duree: "7h", date: "2026-02-12", formateur: "Nadia Khelifi" },
    ],
    stagiaires: [
      { id: "st-7", nom: "Sophie Blanc", email: "sophie@asso.fr", conventionSignee: true, emargement: { "2026-02-10": { matin: true, apresMidi: true }, "2026-02-11": { matin: true, apresMidi: true }, "2026-02-12": { matin: true, apresMidi: true } }, note: 16, attestationEmise: true },
      { id: "st-8", nom: "Marc Dupuis", email: "marc@asso.fr", conventionSignee: true, emargement: { "2026-02-10": { matin: true, apresMidi: true }, "2026-02-11": { matin: true, apresMidi: true }, "2026-02-12": { matin: true, apresMidi: true } }, note: 14, attestationEmise: true },
    ],
    qualiopiChecklist: [
      { id: "q15", label: "Programme de formation diffusé", fait: true },
      { id: "q16", label: "Convention de formation signée", fait: true },
      { id: "q17", label: "Feuilles d'émargement prêtes", fait: true },
      { id: "q18", label: "Évaluation à chaud", fait: true },
      { id: "q19", label: "Attestation de fin de formation", fait: true },
      { id: "q20", label: "Bilan de formation transmis", fait: true },
    ],
  },
];

export const FORMATEUR_KPI = {
  sessionsActives: 1,
  sessionsTotal: 3,
  stagiairesFormes: 14,
  heuresDispensees: 42,
  tauxCompletion: 78,
};
