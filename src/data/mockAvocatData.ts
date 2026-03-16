// Mock data for Cabinet d'Avocats sector
import { getDefaultStepsForSector } from "./sectorTimelines";

export const AVOCAT_STEPS = getDefaultStepsForSector("cabinet-avocats");

export interface AvocatAffaire {
  id: string;
  reference: string;
  clientNom: string;
  clientPrenom: string;
  email: string;
  telephone: string;
  typeLitige: string;
  description: string;
  etape: number;
  avocatId: string;
  dateOuverture: string;
  prochaineEcheance: string;
  prochaineAudience: string | null;
  honorairesProvision: number;
  honorairesFactures: number;
  honorairesPaies: number;
  documentsPartages: string[];
  documentsConfidentiels: string[];
}

export interface AvocatCollaborateur {
  id: string;
  nom: string;
  prenom: string;
  specialite: string;
  barreau: string;
  telephone: string;
}

export interface AvocatTache {
  id: string;
  affaireId: string;
  titre: string;
  echeance: string;
  statut: "a_faire" | "en_cours" | "fait";
  priorite: "haute" | "normale" | "basse";
}

export interface AvocatAudience {
  id: string;
  affaireId: string;
  clientNom: string;
  juridiction: string;
  date: string;
  heure: string;
  type: string;
  avocatId: string;
}

export const MOCK_COLLABORATEURS: AvocatCollaborateur[] = [
  { id: "av-1", nom: "Marchand", prenom: "Maître Stéphane", specialite: "Droit des affaires & Commercial", barreau: "Paris", telephone: "01 40 50 60 70" },
  { id: "av-2", nom: "Martin", prenom: "Maître Sophie", specialite: "Droit du travail & Social", barreau: "Paris", telephone: "01 40 50 60 71" },
  { id: "av-3", nom: "Lefèvre", prenom: "Maître Thomas", specialite: "Droit pénal", barreau: "Versailles", telephone: "01 40 50 60 72" },
];

export const MOCK_AFFAIRES: AvocatAffaire[] = [
  {
    id: "aff-1", reference: "AFF-2026-001", clientNom: "Durand", clientPrenom: "Jean-Pierre",
    email: "jp.durand@email.com", telephone: "06 11 22 33 44",
    typeLitige: "Contentieux commercial", description: "Litige avec fournisseur — rupture abusive de contrat commercial. Enjeu : 85 000 €.",
    etape: 5, avocatId: "av-1", dateOuverture: "2025-11-15", prochaineEcheance: "2026-03-20",
    prochaineAudience: "2026-03-20", honorairesProvision: 5000, honorairesFactures: 3500, honorairesPaies: 3500,
    documentsPartages: ["Mandat signé", "Assignation", "Conclusions n°1", "Pièces adverses"],
    documentsConfidentiels: ["Stratégie de défense", "Notes internes", "Évaluation risques"],
  },
  {
    id: "aff-2", reference: "AFF-2026-002", clientNom: "Moreau", clientPrenom: "Catherine",
    email: "c.moreau@email.com", telephone: "06 55 66 77 88",
    typeLitige: "Licenciement abusif", description: "Contestation licenciement pour faute grave. Demande de dommages-intérêts et rappel de salaire.",
    etape: 3, avocatId: "av-2", dateOuverture: "2026-01-08", prochaineEcheance: "2026-03-25",
    prochaineAudience: null, honorairesProvision: 3000, honorairesFactures: 1500, honorairesPaies: 1000,
    documentsPartages: ["Mandat signé", "Contrat de travail", "Lettre de licenciement"],
    documentsConfidentiels: ["Analyse juridique", "Jurisprudence collectée"],
  },
  {
    id: "aff-3", reference: "AFF-2026-003", clientNom: "Bernard", clientPrenom: "Société SARL",
    email: "contact@bernard-sarl.com", telephone: "01 44 55 66 77",
    typeLitige: "Recouvrement de créances", description: "Recouvrement factures impayées pour un montant total de 42 000 € auprès de 3 débiteurs.",
    etape: 4, avocatId: "av-1", dateOuverture: "2025-09-20", prochaineEcheance: "2026-04-02",
    prochaineAudience: "2026-04-02", honorairesProvision: 4000, honorairesFactures: 4000, honorairesPaies: 2800,
    documentsPartages: ["Mandat signé", "Mises en demeure", "Requête en injonction de payer"],
    documentsConfidentiels: ["Analyse solvabilité débiteurs"],
  },
  {
    id: "aff-4", reference: "AFF-2026-004", clientNom: "Petit", clientPrenom: "Marie",
    email: "m.petit@email.com", telephone: "06 99 88 77 66",
    typeLitige: "Droit de la famille", description: "Procédure de divorce contentieux avec partage de biens immobiliers.",
    etape: 7, avocatId: "av-2", dateOuverture: "2025-06-12", prochaineEcheance: "2026-03-10",
    prochaineAudience: null, honorairesProvision: 6000, honorairesFactures: 5500, honorairesPaies: 5500,
    documentsPartages: ["Mandat signé", "Requête en divorce", "Ordonnance de non-conciliation", "Jugement de divorce"],
    documentsConfidentiels: ["Inventaire patrimoine", "Stratégie partage"],
  },
  {
    id: "aff-5", reference: "AFF-2026-005", clientNom: "Garcia", clientPrenom: "Luis",
    email: "l.garcia@email.com", telephone: "06 22 33 44 55",
    typeLitige: "Infraction pénale", description: "Défense pénale pour infraction routière — conduite en état d'ivresse, audience correctionnelle prévue.",
    etape: 2, avocatId: "av-3", dateOuverture: "2026-02-20", prochaineEcheance: "2026-04-15",
    prochaineAudience: "2026-04-15", honorairesProvision: 2500, honorairesFactures: 1000, honorairesPaies: 1000,
    documentsPartages: ["Mandat signé"],
    documentsConfidentiels: ["PV d'interpellation", "Notes de stratégie"],
  },
];

export const MOCK_AUDIENCES: AvocatAudience[] = [
  { id: "aud-1", affaireId: "aff-1", clientNom: "JP Durand", juridiction: "Tribunal de Commerce Paris", date: "2026-03-20", heure: "09:30", type: "Plaidoirie", avocatId: "av-1" },
  { id: "aud-2", affaireId: "aff-3", clientNom: "SARL Bernard", juridiction: "TJ Paris — Juge de l'exécution", date: "2026-04-02", heure: "14:00", type: "Audience JEX", avocatId: "av-1" },
  { id: "aud-3", affaireId: "aff-5", clientNom: "Luis Garcia", juridiction: "Tribunal Correctionnel Versailles", date: "2026-04-15", heure: "10:00", type: "Audience correctionnelle", avocatId: "av-3" },
];

export const MOCK_TACHES: AvocatTache[] = [
  { id: "t-1", affaireId: "aff-1", titre: "Préparer conclusions récapitulatives", echeance: "2026-03-18", statut: "en_cours", priorite: "haute" },
  { id: "t-2", affaireId: "aff-1", titre: "Contacter expert-comptable pour chiffrage", echeance: "2026-03-15", statut: "fait", priorite: "normale" },
  { id: "t-3", affaireId: "aff-2", titre: "Demander attestations collègues", echeance: "2026-03-25", statut: "a_faire", priorite: "haute" },
  { id: "t-4", affaireId: "aff-2", titre: "Rédiger conclusions en demande", echeance: "2026-04-05", statut: "a_faire", priorite: "normale" },
  { id: "t-5", affaireId: "aff-3", titre: "Signifier injonction de payer", echeance: "2026-03-28", statut: "en_cours", priorite: "haute" },
  { id: "t-6", affaireId: "aff-5", titre: "Réunir pièces de moralité", echeance: "2026-04-10", statut: "a_faire", priorite: "normale" },
  { id: "t-7", affaireId: "aff-5", titre: "Préparer plaidoirie", echeance: "2026-04-14", statut: "a_faire", priorite: "haute" },
];

export const AVOCAT_KPIS = {
  affairesActives: 4,
  affairesClôturees: 1,
  audiencesCetteSemaine: 1,
  honorairesTotaux: 20500,
  honorairesEncaisses: 13800,
  honorairesRestants: 6700,
  tauxRecouvrement: 67,
};
