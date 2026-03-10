// ── Mock data for Nettoyage / Entreprise de propreté ──

export const NETTOYAGE_STEPS = [
  "Devis envoyé",
  "Contrat signé",
  "Planifié",
  "Intervention en cours",
  "Intervention terminée",
  "Rapport envoyé",
  "Facturé",
];

export interface NettoyageChecklistItem {
  id: string;
  label: string;
  fait: boolean;
}

export interface NettoyageIntervention {
  id: string;
  client: string;
  adresse: string;
  date: string;
  heure: string;
  duree: string;
  type: string;
  agent: string;
  step: number;
  statut: "planifie" | "en_cours" | "termine";
  codeAcces: string;
  contactSurPlace: string;
  instructions: string;
  checklist: NettoyageChecklistItem[];
  rapportSoumis: boolean;
  rapportValide: boolean;
}

export interface NettoyageContrat {
  id: string;
  client: string;
  frequence: string;
  prochainPassage: string;
  montantMensuel: number;
  factureStatut: "payee" | "en_attente" | "impayee";
}

export interface NettoyageAgent {
  id: string;
  nom: string;
  interventionsJour: number;
  heuresSemaine: number;
}

export const MOCK_AGENTS: NettoyageAgent[] = [
  { id: "ag-1", nom: "Fatou Diallo", interventionsJour: 3, heuresSemaine: 35 },
  { id: "ag-2", nom: "Karim Bensaid", interventionsJour: 2, heuresSemaine: 28 },
  { id: "ag-3", nom: "Maria Santos", interventionsJour: 4, heuresSemaine: 38 },
];

export const MOCK_CONTRATS: NettoyageContrat[] = [
  { id: "ct-1", client: "Immeuble Haussmann", frequence: "3x / semaine", prochainPassage: "2026-03-11", montantMensuel: 2400, factureStatut: "payee" },
  { id: "ct-2", client: "Cabinet Dupont Avocats", frequence: "2x / semaine", prochainPassage: "2026-03-12", montantMensuel: 1200, factureStatut: "en_attente" },
  { id: "ct-3", client: "Centre médical Pasteur", frequence: "Quotidien", prochainPassage: "2026-03-11", montantMensuel: 3800, factureStatut: "payee" },
  { id: "ct-4", client: "Boutique Élégance", frequence: "1x / semaine", prochainPassage: "2026-03-14", montantMensuel: 600, factureStatut: "impayee" },
];

const defaultChecklist: NettoyageChecklistItem[] = [
  { id: "ck1", label: "Sols aspirés et lavés", fait: false },
  { id: "ck2", label: "Bureaux et surfaces dépoussiérés", fait: false },
  { id: "ck3", label: "Sanitaires nettoyés et désinfectés", fait: false },
  { id: "ck4", label: "Poubelles vidées", fait: false },
  { id: "ck5", label: "Vitres intérieures nettoyées", fait: false },
  { id: "ck6", label: "Réapprovisionnement consommables", fait: false },
];

export const MOCK_INTERVENTIONS: NettoyageIntervention[] = [
  {
    id: "int-1",
    client: "Immeuble Haussmann",
    adresse: "45 boulevard Haussmann, 75009 Paris",
    date: "2026-03-11",
    heure: "06:00",
    duree: "3h",
    type: "Nettoyage parties communes",
    agent: "Fatou Diallo",
    step: 3,
    statut: "en_cours",
    codeAcces: "A45B — Porte 2, code 4589#",
    contactSurPlace: "Gardien M. Leroy — 06 12 34 56 78",
    instructions: "Commencer par le hall d'entrée. Ne pas utiliser de javel sur le marbre. Ascenseur en panne — prendre l'escalier.",
    checklist: defaultChecklist.map((c) => ({ ...c })),
    rapportSoumis: false,
    rapportValide: false,
  },
  {
    id: "int-2",
    client: "Cabinet Dupont Avocats",
    adresse: "12 rue de Rivoli, 75004 Paris",
    date: "2026-03-11",
    heure: "09:30",
    duree: "2h",
    type: "Nettoyage bureaux",
    agent: "Fatou Diallo",
    step: 2,
    statut: "planifie",
    codeAcces: "Badge A12 — Entrée latérale",
    contactSurPlace: "Secrétariat — 01 42 00 00 00",
    instructions: "Bureaux individuels + salle de réunion. Attention : ne pas déplacer les dossiers sur les bureaux.",
    checklist: defaultChecklist.map((c) => ({ ...c })),
    rapportSoumis: false,
    rapportValide: false,
  },
  {
    id: "int-3",
    client: "Centre médical Pasteur",
    adresse: "8 avenue Pasteur, 75015 Paris",
    date: "2026-03-11",
    heure: "18:00",
    duree: "4h",
    type: "Désinfection & nettoyage médical",
    agent: "Maria Santos",
    step: 3,
    statut: "en_cours",
    codeAcces: "Code 7721 — Entrée arrière bâtiment B",
    contactSurPlace: "Infirmière de garde — 01 45 00 00 00",
    instructions: "Protocole médical strict. Gants et surblouse obligatoires. Désinfection renforcée salles de consultation.",
    checklist: [
      ...defaultChecklist.map((c) => ({ ...c })),
      { id: "ck7", label: "Désinfection surfaces médicales", fait: false },
      { id: "ck8", label: "Élimination déchets DASRI", fait: false },
    ],
    rapportSoumis: false,
    rapportValide: false,
  },
  {
    id: "int-4",
    client: "Immeuble Haussmann",
    adresse: "45 boulevard Haussmann, 75009 Paris",
    date: "2026-03-09",
    heure: "06:00",
    duree: "3h",
    type: "Nettoyage parties communes",
    agent: "Fatou Diallo",
    step: 5,
    statut: "termine",
    codeAcces: "A45B — Porte 2, code 4589#",
    contactSurPlace: "Gardien M. Leroy — 06 12 34 56 78",
    instructions: "",
    checklist: defaultChecklist.map((c) => ({ ...c, fait: true })),
    rapportSoumis: true,
    rapportValide: true,
  },
  {
    id: "int-5",
    client: "Boutique Élégance",
    adresse: "22 rue du Faubourg Saint-Honoré, 75008 Paris",
    date: "2026-03-10",
    heure: "07:00",
    duree: "1h30",
    type: "Nettoyage boutique",
    agent: "Karim Bensaid",
    step: 4,
    statut: "termine",
    codeAcces: "Clé déposée chez le voisin (fleuriste)",
    contactSurPlace: "Gérante Mme Blanc — 06 98 76 54 32",
    instructions: "Vitrine à nettoyer. Aspirateur uniquement sur le parquet (pas de serpillère).",
    checklist: defaultChecklist.map((c) => ({ ...c, fait: true })),
    rapportSoumis: true,
    rapportValide: false,
  },
];

export const NETTOYAGE_KPI = {
  contratsActifs: 4,
  interventionsCeMois: 48,
  caRecurrent: 8000,
  alertes: 2,
};

// Planning hebdo mock (lundi-vendredi)
export const MOCK_PLANNING_HEBDO = [
  { jour: "Lundi", interventions: [
    { heure: "06:00", client: "Immeuble Haussmann", agent: "Fatou Diallo", couleur: "bg-blue-500/20 text-blue-300" },
    { heure: "09:30", client: "Cabinet Dupont", agent: "Fatou Diallo", couleur: "bg-violet-500/20 text-violet-300" },
    { heure: "07:00", client: "Centre médical", agent: "Maria Santos", couleur: "bg-emerald-500/20 text-emerald-300" },
    { heure: "18:00", client: "Centre médical", agent: "Maria Santos", couleur: "bg-emerald-500/20 text-emerald-300" },
  ]},
  { jour: "Mardi", interventions: [
    { heure: "06:00", client: "Immeuble Haussmann", agent: "Fatou Diallo", couleur: "bg-blue-500/20 text-blue-300" },
    { heure: "07:00", client: "Centre médical", agent: "Maria Santos", couleur: "bg-emerald-500/20 text-emerald-300" },
    { heure: "14:00", client: "Boutique Élégance", agent: "Karim Bensaid", couleur: "bg-amber-500/20 text-amber-300" },
  ]},
  { jour: "Mercredi", interventions: [
    { heure: "06:00", client: "Immeuble Haussmann", agent: "Fatou Diallo", couleur: "bg-blue-500/20 text-blue-300" },
    { heure: "09:30", client: "Cabinet Dupont", agent: "Fatou Diallo", couleur: "bg-violet-500/20 text-violet-300" },
    { heure: "07:00", client: "Centre médical", agent: "Maria Santos", couleur: "bg-emerald-500/20 text-emerald-300" },
  ]},
  { jour: "Jeudi", interventions: [
    { heure: "07:00", client: "Centre médical", agent: "Maria Santos", couleur: "bg-emerald-500/20 text-emerald-300" },
    { heure: "10:00", client: "Cabinet Dupont", agent: "Karim Bensaid", couleur: "bg-violet-500/20 text-violet-300" },
  ]},
  { jour: "Vendredi", interventions: [
    { heure: "06:00", client: "Immeuble Haussmann", agent: "Fatou Diallo", couleur: "bg-blue-500/20 text-blue-300" },
    { heure: "07:00", client: "Centre médical", agent: "Maria Santos", couleur: "bg-emerald-500/20 text-emerald-300" },
    { heure: "09:30", client: "Cabinet Dupont", agent: "Fatou Diallo", couleur: "bg-violet-500/20 text-violet-300" },
    { heure: "14:00", client: "Boutique Élégance", agent: "Karim Bensaid", couleur: "bg-amber-500/20 text-amber-300" },
  ]},
];
