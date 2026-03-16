// ── Mock data for Association Sportive sector ──

export const ASSOCIATION_SPORTIVE_STEPS = [
  "Demande adhésion",
  "Licence validée",
  "Cotisation payée",
  "Membre actif",
  "Renouvellement",
  "Membre renouvelé",
] as const;

export interface AssociationEntraineur {
  id: string;
  nom: string;
  categorie: string;
  membresAssignes: number;
}

export interface AssociationMembre {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  categorie: string;
  entraineurId: string;
  entraineurNom: string;
  etape: number;
  dateAdhesion: string;
  licenceNumero: string;
  cotisationAnnuelle: number;
  cotisationStatut: "payee" | "en_attente" | "retard";
  certificatMedical: boolean;
  notes: string;
  stepDates: (string | null)[];
}

export interface AssociationMatch {
  id: string;
  date: string;
  heure: string;
  adversaire: string;
  lieu: "domicile" | "exterieur";
  categorie: string;
  resultat: string | null;
}

export const MOCK_ENTRAINEURS: AssociationEntraineur[] = [
  { id: "ent-1", nom: "Pierre Garnier", categorie: "U15 Masculin", membresAssignes: 18 },
  { id: "ent-2", nom: "Sophie Renard", categorie: "Sénior Féminin", membresAssignes: 16 },
];

export const MOCK_MEMBRES: AssociationMembre[] = [
  {
    id: "mbr-1",
    nom: "Lucas Moreau",
    email: "lucas.moreau@email.com",
    telephone: "06 11 22 33 44",
    categorie: "U15 Masculin",
    entraineurId: "ent-1",
    entraineurNom: "Pierre Garnier",
    etape: 3,
    dateAdhesion: "2025-09-01",
    licenceNumero: "FFF-2026-4521",
    cotisationAnnuelle: 150,
    cotisationStatut: "payee",
    certificatMedical: true,
    notes: "Milieu de terrain, bon potentiel technique",
    stepDates: ["2025-09-01", "2025-09-05", "2025-09-10", "2025-09-15", null, null],
  },
  {
    id: "mbr-2",
    nom: "Théo Bernard",
    email: "theo.bernard@email.com",
    telephone: "06 22 33 44 55",
    categorie: "U15 Masculin",
    entraineurId: "ent-1",
    entraineurNom: "Pierre Garnier",
    etape: 3,
    dateAdhesion: "2025-09-01",
    licenceNumero: "FFF-2026-4522",
    cotisationAnnuelle: 150,
    cotisationStatut: "payee",
    certificatMedical: true,
    notes: "Gardien de but, réflexes excellents",
    stepDates: ["2025-09-01", "2025-09-03", "2025-09-08", "2025-09-12", null, null],
  },
  {
    id: "mbr-3",
    nom: "Emma Lefevre",
    email: "emma.lefevre@email.com",
    telephone: "06 33 44 55 66",
    categorie: "Sénior Féminin",
    entraineurId: "ent-2",
    entraineurNom: "Sophie Renard",
    etape: 4,
    dateAdhesion: "2024-09-01",
    licenceNumero: "FFF-2026-3210",
    cotisationAnnuelle: 150,
    cotisationStatut: "en_attente",
    certificatMedical: true,
    notes: "Capitaine de l'équipe, attaquante",
    stepDates: ["2024-09-01", "2024-09-03", "2024-09-10", "2024-09-15", "2025-08-20", null],
  },
  {
    id: "mbr-4",
    nom: "Mathis Dupuis",
    email: "mathis.dupuis@email.com",
    telephone: "06 44 55 66 77",
    categorie: "U15 Masculin",
    entraineurId: "ent-1",
    entraineurNom: "Pierre Garnier",
    etape: 1,
    dateAdhesion: "2026-03-05",
    licenceNumero: "",
    cotisationAnnuelle: 150,
    cotisationStatut: "en_attente",
    certificatMedical: false,
    notes: "Nouvelle inscription, certificat médical en attente",
    stepDates: ["2026-03-05", null, null, null, null, null],
  },
];

export const MOCK_MATCHS: AssociationMatch[] = [
  { id: "m-1", date: "2026-03-15", heure: "15:00", adversaire: "FC Villepinte", lieu: "domicile", categorie: "U15 Masculin", resultat: null },
  { id: "m-2", date: "2026-03-22", heure: "14:00", adversaire: "AS Montreuil", lieu: "exterieur", categorie: "Sénior Féminin", resultat: null },
  { id: "m-3", date: "2026-03-08", heure: "15:00", adversaire: "US Créteil", lieu: "domicile", categorie: "U15 Masculin", resultat: "3-1" },
  { id: "m-4", date: "2026-03-01", heure: "14:30", adversaire: "FC Vincennes", lieu: "exterieur", categorie: "Sénior Féminin", resultat: "2-2" },
];

export const MOCK_ENTRAINEMENTS = [
  { jour: "Mardi", heure: "18:00", categorie: "U15 Masculin", lieu: "Stade Municipal", entraineur: "Pierre Garnier" },
  { jour: "Jeudi", heure: "18:00", categorie: "U15 Masculin", lieu: "Stade Municipal", entraineur: "Pierre Garnier" },
  { jour: "Mercredi", heure: "19:00", categorie: "Sénior Féminin", lieu: "Complexe Sportif", entraineur: "Sophie Renard" },
  { jour: "Vendredi", heure: "19:00", categorie: "Sénior Féminin", lieu: "Complexe Sportif", entraineur: "Sophie Renard" },
];

export const ASSOCIATION_SPORTIVE_KPIS = {
  membresActifs: 78,
  membresTotal: 92,
  cotisationsEncaissees: 11700,
  cotisationsAttendues: 13800,
  licenciesValides: 72,
  matchsJoues: 14,
  matchsAVenir: 8,
  entrainementsParSemaine: 4,
};
