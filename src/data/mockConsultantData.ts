// ── Mock data for Consultant sector ──
import { getDefaultStepsForSector } from "./sectorTimelines";

export const CONSULTANT_STEPS = getDefaultStepsForSector("consultant");

export interface ConsultantMission {
  id: string;
  clientNom: string;
  consultantAssigne: string;
  objet: string;
  statut: string;
  etape: number;
  ca: number;
  prochaineFact: string;
  dateDebut: string;
  dateFin: string | null;
  objectifs: string[];
  livrables: ConsultantLivrable[];
}

export interface ConsultantLivrable {
  id: string;
  titre: string;
  description: string;
  statut: "en_cours" | "livre" | "valide";
  deadline: string;
}

export interface ConsultantCompteRendu {
  id: string;
  missionId: string;
  semaine: string;
  contenu: string;
  date: string;
}

export interface ConsultantReunion {
  id: string;
  missionId: string;
  clientNom: string;
  titre: string;
  date: string;
  heure: string;
  duree: string;
}

export const MOCK_CONSULTANT_MISSIONS: ConsultantMission[] = [
  {
    id: "mis1", clientNom: "Groupe Nexus", consultantAssigne: "Sophie Durand", objet: "Audit RH et plan de transformation", statut: "en_cours", etape: 3,
    ca: 18000, prochaineFact: "2026-03-31", dateDebut: "2026-01-15", dateFin: "2026-05-30",
    objectifs: ["Cartographier les compétences clés", "Proposer un plan de mobilité interne", "Accompagner le déploiement sur 3 mois"],
    livrables: [
      { id: "l1", titre: "Rapport d'audit initial", description: "Analyse complète de l'organisation RH actuelle", statut: "valide", deadline: "2026-02-15" },
      { id: "l2", titre: "Plan de transformation", description: "Recommandations et plan d'action détaillé", statut: "livre", deadline: "2026-03-15" },
      { id: "l3", titre: "Kit de déploiement", description: "Supports de formation et fiches outils", statut: "en_cours", deadline: "2026-04-30" },
    ],
  },
  {
    id: "mis2", clientNom: "StartupFlow", consultantAssigne: "Sophie Durand", objet: "Stratégie marketing digital", statut: "en_cours", etape: 4,
    ca: 9500, prochaineFact: "2026-04-15", dateDebut: "2026-02-01", dateFin: "2026-04-30",
    objectifs: ["Définir la stratégie d'acquisition", "Optimiser le tunnel de conversion"],
    livrables: [
      { id: "l4", titre: "Audit SEO + Ads", description: "Analyse des canaux existants et benchmark", statut: "valide", deadline: "2026-02-20" },
      { id: "l5", titre: "Roadmap acquisition", description: "Plan d'action trimestriel avec KPIs", statut: "en_cours", deadline: "2026-03-20" },
    ],
  },
  {
    id: "mis3", clientNom: "MaisonDuBois", consultantAssigne: "Thomas Petit", objet: "Refonte processus qualité", statut: "proposition", etape: 1,
    ca: 12000, prochaineFact: "-", dateDebut: "2026-04-01", dateFin: "2026-07-31",
    objectifs: ["Certification ISO 9001", "Digitalisation des contrôles qualité"],
    livrables: [
      { id: "l6", titre: "Diagnostic qualité", description: "État des lieux des processus existants", statut: "en_cours", deadline: "2026-04-30" },
    ],
  },
  {
    id: "mis4", clientNom: "LegalTech Pro", consultantAssigne: "Thomas Petit", objet: "Accompagnement levée de fonds", statut: "gagne", etape: 6,
    ca: 7500, prochaineFact: "Facturé", dateDebut: "2025-11-01", dateFin: "2026-02-28",
    objectifs: ["Préparer le pitch deck", "Identifier les investisseurs cibles", "Coaching pitch"],
    livrables: [
      { id: "l7", titre: "Pitch deck", description: "Présentation investisseurs complète", statut: "valide", deadline: "2025-12-15" },
      { id: "l8", titre: "Mémo financier", description: "Business plan et projections", statut: "valide", deadline: "2026-01-15" },
    ],
  },
];

export const MOCK_CONSULTANT_CR: ConsultantCompteRendu[] = [
  { id: "cr1", missionId: "mis1", semaine: "S10", contenu: "Entretiens individuels réalisés avec les 5 managers. Premières tendances : besoin fort en formation digitale. Prochaine étape : consolidation et restitution.", date: "2026-03-07" },
  { id: "cr2", missionId: "mis1", semaine: "S09", contenu: "Atelier collectif de cartographie des compétences. Bon engagement des équipes. Identification de 3 axes prioritaires.", date: "2026-02-28" },
  { id: "cr3", missionId: "mis2", semaine: "S10", contenu: "Lancement campagne test Google Ads. Budget alloué 500€. Premiers résultats attendus S11.", date: "2026-03-06" },
];

export const MOCK_CONSULTANT_REUNIONS: ConsultantReunion[] = [
  { id: "reu1", missionId: "mis1", clientNom: "Groupe Nexus", titre: "Comité de pilotage #3", date: "2026-03-12", heure: "10:00", duree: "1h30" },
  { id: "reu2", missionId: "mis1", clientNom: "Groupe Nexus", titre: "Point manager RH", date: "2026-03-14", heure: "14:00", duree: "45min" },
  { id: "reu3", missionId: "mis2", clientNom: "StartupFlow", titre: "Revue KPI acquisition", date: "2026-03-11", heure: "16:00", duree: "1h" },
  { id: "reu4", missionId: "mis2", clientNom: "StartupFlow", titre: "Atelier tunnel de conversion", date: "2026-03-18", heure: "09:30", duree: "2h" },
];

export const CONSULTANT_KPIS = {
  missionsActives: 2,
  propositionsEnCours: 1,
  caTotal: 47000,
  caMois: 9500,
  tauxOccupation: 78,
  missionsGagnees: 3,
  missionsPerdues: 1,
  consultantsActifs: 2,
};

export const MOCK_CONSULTANT_EQUIPE = [
  { id: "cons1", nom: "Sophie Durand", poste: "Consultante Senior", missionsActives: 2, tauxOccupation: 85, ca: 27500 },
  { id: "cons2", nom: "Thomas Petit", poste: "Consultant Junior", missionsActives: 1, tauxOccupation: 60, ca: 19500 },
];

export const MOCK_CONSULTANT_DOCUMENTS = [
  { id: "doc1", titre: "Contrat de mission — Groupe Nexus", type: "contrat", date: "2026-01-10" },
  { id: "doc2", titre: "Avenant n°1 — Extension périmètre", type: "avenant", date: "2026-02-20" },
  { id: "doc3", titre: "Contrat de mission — StartupFlow", type: "contrat", date: "2026-01-28" },
];
