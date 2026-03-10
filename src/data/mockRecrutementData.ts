// Mock data for Cabinet de Recrutement sector

export interface RecrutementMission {
  id: string;
  reference: string;
  clientEntreprise: string;
  poste: string;
  salaireFourchette: string;
  typeContrat: string;
  honoraires: number;
  honorairesType: "pourcentage" | "forfait";
  nbCandidats: number;
  etapeMoyenne: number;
  statut: "active" | "pourvue" | "annulee";
  dateOuverture: string;
  chargeRecrutement: string;
}

export interface RecrutementCandidat {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  posteActuel: string;
  entrepriseActuelle: string;
  experience: string;
  pretentionsSalariales: string;
  disponibilite: string;
  scoring: number;
  notesEntretien: string;
  cvUrl: string;
  missionId: string;
  etape: number;
  retourClient: "positif" | "negatif" | null;
  documentsChecklist: { label: string; fourni: boolean }[];
  prochaineAction: string;
  messagePersonnalise: string;
}

export interface RecrutementEntretien {
  id: string;
  candidatId: string;
  candidatNom: string;
  missionId: string;
  missionPoste: string;
  date: string;
  heure: string;
  type: "cabinet" | "client";
  lieu: string;
}

export const RECRUTEMENT_STEPS = [
  "Mission ouverte",
  "Sourcing",
  "Entretien cabinet",
  "Candidat présenté",
  "Entretien client",
  "Offre faite",
  "Intégré",
];

export const MOCK_MISSIONS: RecrutementMission[] = [
  {
    id: "mis-1",
    reference: "MIS-2026-001",
    clientEntreprise: "TechVision SAS",
    poste: "Directeur Technique",
    salaireFourchette: "85 000 – 100 000 €",
    typeContrat: "CDI",
    honoraires: 18000,
    honorairesType: "pourcentage",
    nbCandidats: 6,
    etapeMoyenne: 3.2,
    statut: "active",
    dateOuverture: "2026-01-15",
    chargeRecrutement: "demo-emp-1",
  },
  {
    id: "mis-2",
    reference: "MIS-2026-002",
    clientEntreprise: "GreenLogistics",
    poste: "Responsable Supply Chain",
    salaireFourchette: "55 000 – 65 000 €",
    typeContrat: "CDI",
    honoraires: 12000,
    honorairesType: "forfait",
    nbCandidats: 8,
    etapeMoyenne: 2.5,
    statut: "active",
    dateOuverture: "2026-02-01",
    chargeRecrutement: "demo-emp-1",
  },
  {
    id: "mis-3",
    reference: "MIS-2026-003",
    clientEntreprise: "FinBank Group",
    poste: "Analyste Financier Senior",
    salaireFourchette: "60 000 – 75 000 €",
    typeContrat: "CDI",
    honoraires: 15000,
    honorairesType: "pourcentage",
    nbCandidats: 4,
    etapeMoyenne: 4.5,
    statut: "active",
    dateOuverture: "2026-01-20",
    chargeRecrutement: "demo-emp-2",
  },
  {
    id: "mis-4",
    reference: "MIS-2026-004",
    clientEntreprise: "StartupLab",
    poste: "Product Manager",
    salaireFourchette: "50 000 – 60 000 €",
    typeContrat: "CDI",
    honoraires: 10000,
    honorairesType: "forfait",
    nbCandidats: 3,
    etapeMoyenne: 6,
    statut: "pourvue",
    dateOuverture: "2025-12-01",
    chargeRecrutement: "demo-emp-1",
  },
];

export const MOCK_CANDIDATS: RecrutementCandidat[] = [
  {
    id: "cand-1", nom: "Martin", prenom: "Sophie", email: "sophie.martin@email.com", telephone: "06 12 34 56 78",
    posteActuel: "Lead Developer", entrepriseActuelle: "WebCorp", experience: "8 ans en développement, 3 ans en management technique",
    pretentionsSalariales: "90 000 €", disponibilite: "Préavis 3 mois", scoring: 92,
    notesEntretien: "Excellente candidate, leadership naturel, vision technique solide. Souhaite évoluer vers un rôle stratégique.",
    cvUrl: "#", missionId: "mis-1", etape: 5, retourClient: "positif",
    documentsChecklist: [
      { label: "CV à jour", fourni: true }, { label: "Lettre de motivation", fourni: true },
      { label: "Références", fourni: true }, { label: "Diplômes", fourni: false },
    ],
    prochaineAction: "Entretien final avec le DG prévu le 15/03",
    messagePersonnalise: "Votre candidature avance très bien ! L'entreprise souhaite vous rencontrer une dernière fois.",
  },
  {
    id: "cand-2", nom: "Durand", prenom: "Thomas", email: "thomas.durand@email.com", telephone: "06 98 76 54 32",
    posteActuel: "CTO", entrepriseActuelle: "DataStart", experience: "12 ans, dont 5 en direction technique",
    pretentionsSalariales: "95 000 €", disponibilite: "Immédiat", scoring: 88,
    notesEntretien: "Profil senior, bonne culture tech. Un peu cher par rapport au budget client.",
    cvUrl: "#", missionId: "mis-1", etape: 4, retourClient: null,
    documentsChecklist: [
      { label: "CV à jour", fourni: true }, { label: "Lettre de motivation", fourni: false },
      { label: "Références", fourni: true }, { label: "Diplômes", fourni: true },
    ],
    prochaineAction: "En attente du retour client après présentation du dossier",
    messagePersonnalise: "Votre dossier a été transmis à l'entreprise. Nous attendons leur retour.",
  },
  {
    id: "cand-3", nom: "Lefebvre", prenom: "Julie", email: "julie.lefebvre@email.com", telephone: "06 55 44 33 22",
    posteActuel: "Chef de projet logistique", entrepriseActuelle: "TransEuro", experience: "6 ans en supply chain",
    pretentionsSalariales: "58 000 €", disponibilite: "Préavis 2 mois", scoring: 85,
    notesEntretien: "Profil dynamique, connaissance secteur. Anglais courant.",
    cvUrl: "#", missionId: "mis-2", etape: 3, retourClient: null,
    documentsChecklist: [
      { label: "CV à jour", fourni: true }, { label: "Lettre de motivation", fourni: true },
      { label: "Références", fourni: false }, { label: "Diplômes", fourni: true },
    ],
    prochaineAction: "Entretien cabinet prévu le 10/03 à 14h",
    messagePersonnalise: "Votre entretien avec notre cabinet est confirmé pour le 10 mars.",
  },
  {
    id: "cand-4", nom: "Moreau", prenom: "Pierre", email: "pierre.moreau@email.com", telephone: "06 11 22 33 44",
    posteActuel: "Responsable logistique", entrepriseActuelle: "LogiPrime", experience: "10 ans en logistique",
    pretentionsSalariales: "62 000 €", disponibilite: "Préavis 3 mois", scoring: 78,
    notesEntretien: "Bon profil opérationnel, moins stratégique. À confirmer avec le client.",
    cvUrl: "#", missionId: "mis-2", etape: 2, retourClient: null,
    documentsChecklist: [
      { label: "CV à jour", fourni: true }, { label: "Lettre de motivation", fourni: false },
      { label: "Références", fourni: false }, { label: "Diplômes", fourni: true },
    ],
    prochaineAction: "Sourcing en cours — pré-qualification téléphonique à planifier",
    messagePersonnalise: "Nous avons bien reçu votre candidature. Un premier échange téléphonique sera planifié prochainement.",
  },
  {
    id: "cand-5", nom: "Bernard", prenom: "Alice", email: "alice.bernard@email.com", telephone: "06 77 88 99 00",
    posteActuel: "Analyste financier", entrepriseActuelle: "BankStar", experience: "5 ans en analyse financière",
    pretentionsSalariales: "65 000 €", disponibilite: "Préavis 1 mois", scoring: 90,
    notesEntretien: "Très bon profil, excellente maîtrise des outils. Présentation au client en cours.",
    cvUrl: "#", missionId: "mis-3", etape: 5, retourClient: "positif",
    documentsChecklist: [
      { label: "CV à jour", fourni: true }, { label: "Lettre de motivation", fourni: true },
      { label: "Références", fourni: true }, { label: "Diplômes", fourni: true },
    ],
    prochaineAction: "Offre en cours de rédaction par le client",
    messagePersonnalise: "Excellente nouvelle ! L'entreprise prépare une proposition pour vous.",
  },
  {
    id: "cand-6", nom: "Petit", prenom: "Luc", email: "luc.petit@email.com", telephone: "06 66 55 44 33",
    posteActuel: "Product Owner", entrepriseActuelle: "AppFactory", experience: "7 ans en product management",
    pretentionsSalariales: "55 000 €", disponibilite: "Immédiat", scoring: 95,
    notesEntretien: "Candidat idéal, a rejoint le poste avec succès.",
    cvUrl: "#", missionId: "mis-4", etape: 7, retourClient: "positif",
    documentsChecklist: [
      { label: "CV à jour", fourni: true }, { label: "Lettre de motivation", fourni: true },
      { label: "Références", fourni: true }, { label: "Diplômes", fourni: true },
    ],
    prochaineAction: "Intégration réussie — mission clôturée",
    messagePersonnalise: "Félicitations ! Vous avez intégré l'entreprise avec succès. Bonne continuation !",
  },
];

export const MOCK_ENTRETIENS: RecrutementEntretien[] = [
  { id: "ent-1", candidatId: "cand-1", candidatNom: "Sophie Martin", missionId: "mis-1", missionPoste: "Directeur Technique", date: "2026-03-15", heure: "10:00", type: "client", lieu: "Bureaux TechVision, Paris 8e" },
  { id: "ent-2", candidatId: "cand-3", candidatNom: "Julie Lefebvre", missionId: "mis-2", missionPoste: "Resp. Supply Chain", date: "2026-03-10", heure: "14:00", type: "cabinet", lieu: "Cabinet — Salle Vinci" },
  { id: "ent-3", candidatId: "cand-4", candidatNom: "Pierre Moreau", missionId: "mis-2", missionPoste: "Resp. Supply Chain", date: "2026-03-12", heure: "09:30", type: "cabinet", lieu: "Cabinet — Salle Vinci" },
];

// KPIs
export const RECRUTEMENT_KPIS = {
  missionsActives: 3,
  missionsPourvues: 1,
  tauxTransformation: 25,
  delaiMoyenPlacement: 42,
  caPotentiel: 45000,
  caRealise: 10000,
};
