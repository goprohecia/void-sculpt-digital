// Mock data for Auto-École sector

export const AUTO_ECOLE_STEPS = [
  "Inscription",
  "Dossier NEPH",
  "Code en cours",
  "Heures de conduite",
  "Examen blanc",
  "Passage code",
  "Passage conduite",
  "Diplômé",
];

export interface AutoEcoleEleve {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateInscription: string;
  forfait: string;
  forfaitMontant: number;
  acomptePaye: number;
  resteDu: number;
  heuresForfait: number;
  heuresEffectuees: number;
  etape: number;
  nephStatut: "en_attente" | "valide" | "en_cours";
  nephDate: string | null;
  dateExamenCode: string | null;
  dateExamenConduite: string | null;
  moniteurId: string;
  notesConduite: string;
  progression: "debutant" | "intermediaire" | "avance" | "pret";
}

export interface AutoEcoleMoniteur {
  id: string;
  nom: string;
  prenom: string;
  vehicule: string;
  telephone: string;
  statut: "actif" | "conge";
}

export interface AutoEcoleLecon {
  id: string;
  eleveId: string;
  eleveNom: string;
  moniteurId: string;
  date: string;
  heure: string;
  duree: number; // minutes
  type: "conduite" | "code" | "examen_blanc" | "examen";
  axeTravaille: string;
  commentaire: string;
  statut: "planifie" | "effectue";
}

export interface AutoEcoleRdv {
  id: string;
  eleveNom: string;
  moniteurId: string;
  date: string;
  heure: string;
  type: string;
}

export const MOCK_MONITEURS: AutoEcoleMoniteur[] = [
  { id: "mon-1", nom: "Dupont", prenom: "Marc", vehicule: "Clio V — AB-123-CD", telephone: "06 10 20 30 40", statut: "actif" },
  { id: "mon-2", nom: "Garcia", prenom: "Nathalie", vehicule: "208 — EF-456-GH", telephone: "06 50 60 70 80", statut: "actif" },
  { id: "mon-3", nom: "Lefèvre", prenom: "Antoine", vehicule: "Yaris — IJ-789-KL", telephone: "06 90 80 70 60", statut: "conge" },
];

export const MOCK_ELEVES: AutoEcoleEleve[] = [
  {
    id: "elv-1", nom: "Martin", prenom: "Léa", email: "lea.martin@email.com", telephone: "06 11 22 33 44",
    dateInscription: "2025-11-15", forfait: "Forfait B — 20h", forfaitMontant: 1200, acomptePaye: 800, resteDu: 400,
    heuresForfait: 20, heuresEffectuees: 14, etape: 4, nephStatut: "valide", nephDate: "2025-12-01",
    dateExamenCode: "2026-02-15", dateExamenConduite: "2026-04-10", moniteurId: "mon-1",
    notesConduite: "Bonne maîtrise des manœuvres, à travailler : insertion autoroute et créneaux en descente.",
    progression: "avance",
  },
  {
    id: "elv-2", nom: "Dubois", prenom: "Hugo", email: "hugo.dubois@email.com", telephone: "06 55 66 77 88",
    dateInscription: "2026-01-10", forfait: "Forfait B — 30h", forfaitMontant: 1600, acomptePaye: 500, resteDu: 1100,
    heuresForfait: 30, heuresEffectuees: 6, etape: 3, nephStatut: "valide", nephDate: "2026-01-25",
    dateExamenCode: null, dateExamenConduite: null, moniteurId: "mon-1",
    notesConduite: "Progression lente sur les priorités à droite. Motivation en hausse.",
    progression: "debutant",
  },
  {
    id: "elv-3", nom: "Petit", prenom: "Camille", email: "camille.petit@email.com", telephone: "06 99 88 77 66",
    dateInscription: "2025-09-01", forfait: "Forfait B — 20h", forfaitMontant: 1200, acomptePaye: 1200, resteDu: 0,
    heuresForfait: 20, heuresEffectuees: 20, etape: 7, nephStatut: "valide", nephDate: "2025-09-20",
    dateExamenCode: "2025-12-10", dateExamenConduite: "2026-03-20", moniteurId: "mon-2",
    notesConduite: "Prête pour l'examen. Très à l'aise en conduite autonome.",
    progression: "pret",
  },
  {
    id: "elv-4", nom: "Roux", prenom: "Emma", email: "emma.roux@email.com", telephone: "06 22 33 44 55",
    dateInscription: "2026-02-20", forfait: "Forfait B — 20h", forfaitMontant: 1200, acomptePaye: 300, resteDu: 900,
    heuresForfait: 20, heuresEffectuees: 0, etape: 1, nephStatut: "en_attente", nephDate: null,
    dateExamenCode: null, dateExamenConduite: null, moniteurId: "mon-2",
    notesConduite: "",
    progression: "debutant",
  },
  {
    id: "elv-5", nom: "Bernard", prenom: "Lucas", email: "lucas.bernard@email.com", telephone: "06 33 44 55 66",
    dateInscription: "2026-01-05", forfait: "Forfait B — 20h", forfaitMontant: 1200, acomptePaye: 600, resteDu: 600,
    heuresForfait: 20, heuresEffectuees: 10, etape: 4, nephStatut: "valide", nephDate: "2026-01-20",
    dateExamenCode: null, dateExamenConduite: null, moniteurId: "mon-1",
    notesConduite: "Bon potentiel, doit travailler la gestion du stress.",
    progression: "intermediaire",
  },
];

export const MOCK_LECONS: AutoEcoleLecon[] = [
  { id: "lec-1", eleveId: "elv-1", eleveNom: "Léa Martin", moniteurId: "mon-1", date: "2026-03-10", heure: "08:00", duree: 60, type: "conduite", axeTravaille: "Insertion autoroute", commentaire: "Bon progrès, à revoir les rétros avant insertion", statut: "planifie" },
  { id: "lec-2", eleveId: "elv-2", eleveNom: "Hugo Dubois", moniteurId: "mon-1", date: "2026-03-10", heure: "09:30", duree: 60, type: "conduite", axeTravaille: "Priorités à droite", commentaire: "", statut: "planifie" },
  { id: "lec-3", eleveId: "elv-5", eleveNom: "Lucas Bernard", moniteurId: "mon-1", date: "2026-03-10", heure: "11:00", duree: 60, type: "conduite", axeTravaille: "Créneaux", commentaire: "", statut: "planifie" },
  { id: "lec-4", eleveId: "elv-3", eleveNom: "Camille Petit", moniteurId: "mon-2", date: "2026-03-10", heure: "08:00", duree: 90, type: "examen_blanc", axeTravaille: "Parcours examen complet", commentaire: "Très bien, prête", statut: "planifie" },
  { id: "lec-5", eleveId: "elv-1", eleveNom: "Léa Martin", moniteurId: "mon-1", date: "2026-03-11", heure: "14:00", duree: 60, type: "conduite", axeTravaille: "Conduite de nuit", commentaire: "", statut: "planifie" },
  { id: "lec-6", eleveId: "elv-2", eleveNom: "Hugo Dubois", moniteurId: "mon-1", date: "2026-03-12", heure: "10:00", duree: 60, type: "conduite", axeTravaille: "Rond-points complexes", commentaire: "", statut: "planifie" },
];

// KPIs
export const AUTO_ECOLE_KPIS = {
  elevesActifs: 4,
  tauxReussiteCode: 85,
  tauxReussiteConduite: 72,
  caMensuel: 4800,
  heuresRestantesAVendre: 46,
  dossiersNephEnAttente: 1,
};
