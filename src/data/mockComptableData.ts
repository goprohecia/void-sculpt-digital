// Mock data for Expert-Comptable sector

export const COMPTABLE_STEPS = [
  "Dossier ouvert",
  "Pièces collectées",
  "Saisie comptable",
  "Révision",
  "Déclaration préparée",
  "Validée client",
  "Envoyée aux impôts",
  "Clôturée",
];

export interface ComptableMission {
  id: string;
  reference: string;
  entrepriseNom: string;
  formeJuridique: string;
  siret: string;
  contactNom: string;
  email: string;
  telephone: string;
  typeMission: string;
  etape: number;
  collaborateurId: string;
  dateOuverture: string;
  prochaineEcheanceFiscale: string;
  echeanceType: string;
  honorairesMensuels: number;
  honorairesAnnuels: number;
  honorairesPaies: number;
  piecesRecues: string[];
  piecesManquantes: string[];
  dateDernieresPieces: string;
}

export interface ComptableCollaborateur {
  id: string;
  nom: string;
  prenom: string;
  specialite: string;
  telephone: string;
}

export interface ComptableDeclaration {
  id: string;
  missionId: string;
  entrepriseNom: string;
  type: string;
  periodicite: string;
  echeance: string;
  statut: "a_preparer" | "preparee" | "validee" | "envoyee";
  dateTransmission: string | null;
}

export interface ComptableTache {
  id: string;
  missionId: string;
  titre: string;
  echeance: string;
  statut: "a_faire" | "en_cours" | "fait";
  priorite: "haute" | "normale" | "basse";
}

export interface ComptableDocument {
  id: string;
  missionId: string;
  nom: string;
  type: "releve_bancaire" | "facture_achat" | "facture_vente" | "bulletin_paie" | "contrat" | "bilan" | "liasse" | "autre";
  dateDepot: string;
  statut: "recu" | "traite";
}

export const MOCK_COLLABORATEURS_COMPTABLES: ComptableCollaborateur[] = [
  { id: "cc-1", nom: "Rousseau", prenom: "Philippe", specialite: "Déclarations fiscales & TVA", telephone: "01 42 30 40 50" },
  { id: "cc-2", nom: "Lemaire", prenom: "Nathalie", specialite: "Bilans & Liasses fiscales", telephone: "01 42 30 40 51" },
  { id: "cc-3", nom: "Girard", prenom: "Antoine", specialite: "Social & Paie", telephone: "01 42 30 40 52" },
];

export const MOCK_MISSIONS: ComptableMission[] = [
  {
    id: "mc-1", reference: "MIS-2026-001", entrepriseNom: "SARL Girard & Fils",
    formeJuridique: "SARL", siret: "123 456 789 00012",
    contactNom: "Patrick Girard", email: "p.girard@girard-fils.fr", telephone: "06 11 22 33 44",
    typeMission: "Tenue comptable + Bilan", etape: 4, collaborateurId: "cc-1",
    dateOuverture: "2025-01-15", prochaineEcheanceFiscale: "2026-03-15", echeanceType: "TVA mensuelle",
    honorairesMensuels: 450, honorairesAnnuels: 5400, honorairesPaies: 4050,
    piecesRecues: ["Relevés bancaires janv.", "Relevés bancaires fév.", "Factures achats Q1", "Factures ventes Q1"],
    piecesManquantes: ["Relevés bancaires mars", "Notes de frais mars"],
    dateDernieresPieces: "2026-02-28",
  },
  {
    id: "mc-2", reference: "MIS-2026-002", entrepriseNom: "SAS TechInno",
    formeJuridique: "SAS", siret: "987 654 321 00034",
    contactNom: "Marie Leroy", email: "m.leroy@techinno.io", telephone: "06 55 66 77 88",
    typeMission: "Tenue comptable + Social", etape: 2, collaborateurId: "cc-3",
    dateOuverture: "2025-06-01", prochaineEcheanceFiscale: "2026-03-31", echeanceType: "TVA trimestrielle",
    honorairesMensuels: 680, honorairesAnnuels: 8160, honorairesPaies: 6120,
    piecesRecues: ["Relevés bancaires janv."],
    piecesManquantes: ["Relevés bancaires fév.", "Relevés bancaires mars", "Factures achats fév.-mars", "Bulletins de paie fév.-mars"],
    dateDernieresPieces: "2026-01-20",
  },
  {
    id: "mc-3", reference: "MIS-2026-003", entrepriseNom: "EI Martin Consulting",
    formeJuridique: "EI", siret: "456 789 123 00056",
    contactNom: "Julien Martin", email: "j.martin@martin-consulting.fr", telephone: "06 99 88 77 66",
    typeMission: "Déclaration de revenus BNC", etape: 6, collaborateurId: "cc-2",
    dateOuverture: "2025-04-10", prochaineEcheanceFiscale: "2026-05-15", echeanceType: "IR (liasse 2035)",
    honorairesMensuels: 200, honorairesAnnuels: 2400, honorairesPaies: 2400,
    piecesRecues: ["Relevés bancaires 2025", "Factures achats 2025", "Factures ventes 2025", "Tableau des immobilisations"],
    piecesManquantes: [],
    dateDernieresPieces: "2026-02-15",
  },
  {
    id: "mc-4", reference: "MIS-2026-004", entrepriseNom: "SARL Boulangerie Petit",
    formeJuridique: "SARL", siret: "321 654 987 00078",
    contactNom: "Sophie Petit", email: "s.petit@boulangerie-petit.fr", telephone: "06 22 33 44 55",
    typeMission: "Tenue comptable + Bilan + Social", etape: 7, collaborateurId: "cc-1",
    dateOuverture: "2024-09-01", prochaineEcheanceFiscale: "2026-04-30", echeanceType: "IS annuel",
    honorairesMensuels: 550, honorairesAnnuels: 6600, honorairesPaies: 5500,
    piecesRecues: ["Relevés bancaires 2025", "Factures 2025", "Bulletins de paie 2025", "Inventaire stock"],
    piecesManquantes: ["PV AG approbation comptes"],
    dateDernieresPieces: "2026-03-01",
  },
];

export const MOCK_DECLARATIONS: ComptableDeclaration[] = [
  { id: "dec-1", missionId: "mc-1", entrepriseNom: "SARL Girard & Fils", type: "TVA CA3", periodicite: "Mensuelle", echeance: "2026-03-15", statut: "preparee", dateTransmission: null },
  { id: "dec-2", missionId: "mc-2", entrepriseNom: "SAS TechInno", type: "TVA CA3", periodicite: "Trimestrielle", echeance: "2026-03-31", statut: "a_preparer", dateTransmission: null },
  { id: "dec-3", missionId: "mc-3", entrepriseNom: "EI Martin Consulting", type: "Liasse 2035 (BNC)", periodicite: "Annuelle", echeance: "2026-05-15", statut: "validee", dateTransmission: null },
  { id: "dec-4", missionId: "mc-4", entrepriseNom: "SARL Boulangerie Petit", type: "IS — Liasse 2065", periodicite: "Annuelle", echeance: "2026-04-30", statut: "envoyee", dateTransmission: "2026-03-05" },
  { id: "dec-5", missionId: "mc-4", entrepriseNom: "SARL Boulangerie Petit", type: "TVA CA3", periodicite: "Mensuelle", echeance: "2026-03-15", statut: "envoyee", dateTransmission: "2026-03-10" },
  { id: "dec-6", missionId: "mc-1", entrepriseNom: "SARL Dupont & Fils", type: "CFE", periodicite: "Annuelle", echeance: "2026-12-15", statut: "a_preparer", dateTransmission: null },
];

export const MOCK_TACHES_COMPTABLES: ComptableTache[] = [
  { id: "tc-1", missionId: "mc-1", titre: "Rapprochement bancaire février", echeance: "2026-03-12", statut: "fait", priorite: "normale" },
  { id: "tc-2", missionId: "mc-1", titre: "Saisir factures achats Q1", echeance: "2026-03-15", statut: "en_cours", priorite: "haute" },
  { id: "tc-3", missionId: "mc-1", titre: "Préparer déclaration TVA mars", echeance: "2026-03-14", statut: "en_cours", priorite: "haute" },
  { id: "tc-4", missionId: "mc-2", titre: "Relancer pièces manquantes", echeance: "2026-03-10", statut: "a_faire", priorite: "haute" },
  { id: "tc-5", missionId: "mc-2", titre: "Saisir bulletins de paie", echeance: "2026-03-20", statut: "a_faire", priorite: "normale" },
  { id: "tc-6", missionId: "mc-3", titre: "Finaliser liasse 2035", echeance: "2026-04-30", statut: "a_faire", priorite: "normale" },
  { id: "tc-7", missionId: "mc-4", titre: "Convoquer AG approbation comptes", echeance: "2026-06-30", statut: "a_faire", priorite: "basse" },
];

export const MOCK_DOCUMENTS_DEPOSES: ComptableDocument[] = [
  { id: "doc-1", missionId: "mc-1", nom: "Relevé bancaire janvier 2026.pdf", type: "releve_bancaire", dateDepot: "2026-02-05", statut: "traite" },
  { id: "doc-2", missionId: "mc-1", nom: "Relevé bancaire février 2026.pdf", type: "releve_bancaire", dateDepot: "2026-03-03", statut: "traite" },
  { id: "doc-3", missionId: "mc-1", nom: "Factures achats Q1 2026.zip", type: "facture_achat", dateDepot: "2026-03-05", statut: "recu" },
  { id: "doc-4", missionId: "mc-1", nom: "Factures ventes Q1 2026.zip", type: "facture_vente", dateDepot: "2026-03-05", statut: "recu" },
];

export const COMPTABLE_KPIS = {
  missionsActives: 4,
  declarationsAFaire: 2,
  declarationsCetteSemaine: 2,
  piecesManquantes: 7,
  honorairesTotaux: 22560,
  honorairesEncaisses: 18070,
  honorairesRestants: 4490,
};

export const CHECKLIST_PIECES = [
  "Relevés bancaires du mois",
  "Factures d'achats",
  "Factures de ventes",
  "Notes de frais",
  "Bulletins de paie",
  "Contrats en cours",
  "Tableau des immobilisations",
  "PV d'assemblée générale",
];
