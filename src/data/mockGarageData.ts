// ── Mock data for Garage / Carrosserie sector ──

export const GARAGE_STEPS = [
  "Véhicule reçu",
  "Diagnostic",
  "Devis envoyé",
  "Devis accepté",
  "En réparation",
  "Prêt à récupérer",
  "Terminé",
] as const;

export const GARAGE_STEP_ICONS = [
  "Car",        // Véhicule reçu
  "Search",     // Diagnostic
  "FileText",   // Devis envoyé
  "CheckCircle",// Devis accepté
  "Wrench",     // En réparation
  "Bell",       // Prêt à récupérer
  "Flag",       // Terminé
] as const;

export const GARAGE_CLIENT_MESSAGES: Record<number, string> = {
  0: "Votre véhicule a bien été réceptionné à l'atelier. Nous allons procéder au diagnostic.",
  1: "Le diagnostic de votre véhicule est en cours. Nous vous enverrons le devis prochainement.",
  2: "Le devis de réparation vous a été envoyé. Merci de nous confirmer votre accord.",
  3: "Votre accord a été reçu. La réparation va débuter prochainement.",
  4: "Votre véhicule est actuellement en cours de réparation par notre équipe.",
  5: "Bonne nouvelle ! Votre véhicule est prêt à être récupéré. Contactez-nous pour convenir d'un créneau.",
  6: "Votre véhicule a été restitué. Merci de votre confiance !",
};

export interface MockMecanicien {
  id: string;
  nom: string;
  prenom: string;
  specialite: string;
}

export const MOCK_MECANICIENS: MockMecanicien[] = [
  { id: "mec-1", nom: "Bensalem", prenom: "Mohamed", specialite: "Mécanique générale" },
  { id: "mec-2", nom: "Lefèvre", prenom: "Antoine", specialite: "Carrosserie & Peinture" },
];

export interface MockVehicule {
  id: string;
  clientNom: string;
  clientId: string;
  immatriculation: string;
  marque: string;
  modele: string;
  kilometrage: number;
  motifEntree: string;
  mecanicienId: string;
  mecanicienNom: string;
  etape: number; // 0-6
  dateDepot: string;
  notes: string;
  stepDates: (string | null)[];
}

export const MOCK_VEHICULES: MockVehicule[] = [
  {
    id: "veh-1",
    clientNom: "Jean Martin",
    clientId: "c1",
    immatriculation: "AB-123-CD",
    marque: "Renault",
    modele: "Clio V",
    kilometrage: 45200,
    motifEntree: "Bruit au freinage",
    mecanicienId: "mec-1",
    mecanicienNom: "Mohamed Bensalem",
    etape: 4,
    dateDepot: "2026-03-03",
    notes: "Plaquettes de frein usées, disques à vérifier",
    stepDates: ["2026-03-03", "2026-03-03", "2026-03-04", "2026-03-05", "2026-03-06", null, null],
  },
  {
    id: "veh-2",
    clientNom: "Sophie Leroy",
    clientId: "c2",
    immatriculation: "EF-456-GH",
    marque: "Peugeot",
    modele: "308",
    kilometrage: 78300,
    motifEntree: "Révision 80 000 km",
    mecanicienId: "mec-1",
    mecanicienNom: "Mohamed Bensalem",
    etape: 5,
    dateDepot: "2026-03-01",
    notes: "Courroie de distribution à remplacer",
    stepDates: ["2026-03-01", "2026-03-01", "2026-03-02", "2026-03-02", "2026-03-03", "2026-03-05", null],
  },
  {
    id: "veh-3",
    clientNom: "Pierre Dubois",
    clientId: "c3",
    immatriculation: "IJ-789-KL",
    marque: "Citroën",
    modele: "C3 Aircross",
    kilometrage: 32100,
    motifEntree: "Voyant moteur allumé",
    mecanicienId: "mec-2",
    mecanicienNom: "Antoine Lefèvre",
    etape: 2,
    dateDepot: "2026-03-07",
    notes: "Sonde lambda à diagnostiquer",
    stepDates: ["2026-03-07", "2026-03-08", "2026-03-09", null, null, null, null],
  },
  {
    id: "veh-4",
    clientNom: "Marie Petit",
    clientId: "c4",
    immatriculation: "MN-012-OP",
    marque: "Volkswagen",
    modele: "Golf 8",
    kilometrage: 15600,
    motifEntree: "Choc carrosserie avant droit",
    mecanicienId: "mec-2",
    mecanicienNom: "Antoine Lefèvre",
    etape: 1,
    dateDepot: "2026-03-09",
    notes: "Pare-choc + aile à reprendre, devis assurance",
    stepDates: ["2026-03-09", "2026-03-10", null, null, null, null, null],
  },
  {
    id: "veh-5",
    clientNom: "Lucas Bernard",
    clientId: "c5",
    immatriculation: "QR-345-ST",
    marque: "Toyota",
    modele: "Yaris",
    kilometrage: 62400,
    motifEntree: "Vidange + filtres",
    mecanicienId: "mec-1",
    mecanicienNom: "Mohamed Bensalem",
    etape: 6,
    dateDepot: "2026-02-25",
    notes: "Entretien courant, RAS",
    stepDates: ["2026-02-25", "2026-02-25", "2026-02-26", "2026-02-26", "2026-02-27", "2026-02-28", "2026-03-01"],
  },
  {
    id: "veh-6",
    clientNom: "Camille Moreau",
    clientId: "c6",
    immatriculation: "UV-678-WX",
    marque: "BMW",
    modele: "Série 3",
    kilometrage: 91200,
    motifEntree: "Embrayage patine",
    mecanicienId: "mec-2",
    mecanicienNom: "Antoine Lefèvre",
    etape: 0,
    dateDepot: "2026-03-10",
    notes: "",
    stepDates: ["2026-03-10", null, null, null, null, null, null],
  },
  {
    id: "veh-7",
    clientNom: "Thomas Roux",
    clientId: "c7",
    immatriculation: "YZ-901-AB",
    marque: "Ford",
    modele: "Focus",
    kilometrage: 54800,
    motifEntree: "Climatisation HS",
    mecanicienId: "mec-1",
    mecanicienNom: "Marc Dupont",
    etape: 3,
    dateDepot: "2026-03-05",
    notes: "Recharge gaz + vérification compresseur",
    stepDates: ["2026-03-05", "2026-03-05", "2026-03-06", "2026-03-07", null, null, null],
  },
];

/** Simulated today's appointments */
export const MOCK_GARAGE_RDV = [
  { heure: "08:30", clientNom: "Jean Martin", motif: "Restitution Clio V", immatriculation: "AB-123-CD" },
  { heure: "10:00", clientNom: "Nouveau client", motif: "Diagnostic bruit moteur", immatriculation: "CD-111-EF" },
  { heure: "14:00", clientNom: "Sophie Leroy", motif: "Récupération 308", immatriculation: "EF-456-GH" },
];
