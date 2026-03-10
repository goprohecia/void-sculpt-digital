// ── Mock data for DJ / Animateur sector ──

export const DJ_STEPS = [
  "Demande reçue",
  "Devis envoyé",
  "Contrat signé",
  "Acompte reçu",
  "Événement confirmé",
  "Prestation réalisée",
  "Solde réglé",
];

export interface DJPrestation {
  id: string;
  clientNom: string;
  artisteAssigne: string;
  typeAnimation: string;
  date: string;
  lieu: string;
  adresse: string;
  duree: string;
  etape: number;
  montant: number;
  acompte: number;
  solde: number;
  acompteRecu: boolean;
  options: string[];
  contacts: { nom: string; tel: string; role: string }[];
  setupTechnique: string;
  deroulement: DJDeroulement[];
}

export interface DJDeroulement {
  heure: string;
  description: string;
}

export interface DJMateriel {
  id: string;
  nom: string;
  checked: boolean;
}

export const MOCK_DJ_PRESTATIONS: DJPrestation[] = [
  {
    id: "dj1", clientNom: "Sophie & Julien", artisteAssigne: "DJ Max", typeAnimation: "Mariage",
    date: "2026-04-18", lieu: "Château de Versailles", adresse: "Parc du Château, 78000 Versailles",
    duree: "6h (20h-02h)", etape: 4, montant: 2800, acompte: 1400, solde: 1400, acompteRecu: true,
    options: ["Sono 2000W", "Éclairage LED", "Machine à fumée", "Micro HF"],
    contacts: [
      { nom: "Sophie Martin", tel: "06 12 34 56 78", role: "Mariée" },
      { nom: "Pierre (régisseur château)", tel: "06 98 76 54 32", role: "Contact lieu" },
    ],
    setupTechnique: "Accès par entrée de service. Installation à partir de 17h. Puissance dispo : 32A. Espace DJ : 4m x 3m côté piste.",
    deroulement: [
      { heure: "20:00", description: "Accueil cocktail — musique lounge" },
      { heure: "21:00", description: "Entrée des mariés — morceau choisi" },
      { heure: "21:30", description: "Dîner — playlist douce" },
      { heure: "23:00", description: "Ouverture de bal" },
      { heure: "23:15", description: "Set dancefloor — mix progressif" },
      { heure: "01:30", description: "Dernière danse + slow final" },
      { heure: "02:00", description: "Fin de prestation" },
    ],
  },
  {
    id: "dj2", clientNom: "TechCorp", artisteAssigne: "DJ Max", typeAnimation: "Soirée entreprise",
    date: "2026-03-28", lieu: "Loft Bastille", adresse: "12 rue de la Roquette, 75011 Paris",
    duree: "4h (19h-23h)", etape: 2, montant: 1500, acompte: 750, solde: 750, acompteRecu: false,
    options: ["Sono 1000W", "Éclairage ambiance"],
    contacts: [
      { nom: "Laura Dupuis", tel: "06 55 44 33 22", role: "Event Manager" },
    ],
    setupTechnique: "Accès par monte-charge. Installation à partir de 16h. Espace au fond de la salle principale.",
    deroulement: [
      { heure: "19:00", description: "Cocktail — deep house" },
      { heure: "20:30", description: "Discours direction" },
      { heure: "21:00", description: "Set dancefloor" },
      { heure: "22:45", description: "Fin progressive" },
    ],
  },
  {
    id: "dj3", clientNom: "Festival Groove", artisteAssigne: "Animateur Léo", typeAnimation: "Festival",
    date: "2026-06-15", lieu: "Parc des Expositions", adresse: "Avenue de la Liberté, 69000 Lyon",
    duree: "3h (16h-19h)", etape: 1, montant: 2000, acompte: 1000, solde: 1000, acompteRecu: false,
    options: ["Sono fournie par le festival", "Micro HF x2"],
    contacts: [
      { nom: "Marc Leroy", tel: "06 77 88 99 00", role: "Directeur artistique" },
    ],
    setupTechnique: "Scène B — accès backstage par parking P2. Soundcheck à 14h.",
    deroulement: [
      { heure: "16:00", description: "Intro + warm-up" },
      { heure: "17:00", description: "Set principal" },
      { heure: "18:30", description: "Closing set" },
    ],
  },
  {
    id: "dj4", clientNom: "Famille Benoit", artisteAssigne: "Animateur Léo", typeAnimation: "Anniversaire 50 ans",
    date: "2026-03-08", lieu: "Salle des fêtes Montmartre", adresse: "5 rue Lepic, 75018 Paris",
    duree: "5h (19h-00h)", etape: 6, montant: 1200, acompte: 600, solde: 600, acompteRecu: true,
    options: ["Sono 500W", "Jeux animés", "Karaoké"],
    contacts: [
      { nom: "Claire Benoit", tel: "06 11 22 33 44", role: "Organisatrice" },
    ],
    setupTechnique: "Accès direct par la porte principale. Prise 16A disponible.",
    deroulement: [
      { heure: "19:00", description: "Apéritif musical" },
      { heure: "20:00", description: "Animation jeux + quiz" },
      { heure: "21:30", description: "Karaoké" },
      { heure: "22:30", description: "Set dansant" },
      { heure: "23:45", description: "Fin" },
    ],
  },
];

export const MOCK_DJ_MATERIEL: DJMateriel[] = [
  { id: "m1", nom: "Contrôleur DJ Pioneer DDJ-1000", checked: false },
  { id: "m2", nom: "Enceintes QSC K12.2 (x2)", checked: false },
  { id: "m3", nom: "Caisson de basses QSC KS118", checked: false },
  { id: "m4", nom: "Table de mixage Allen & Heath", checked: false },
  { id: "m5", nom: "Micro Shure SM58", checked: false },
  { id: "m6", nom: "Micro HF Sennheiser", checked: false },
  { id: "m7", nom: "Éclairage LED par (x4)", checked: false },
  { id: "m8", nom: "Machine à fumée", checked: false },
  { id: "m9", nom: "Câbles XLR (lot)", checked: false },
  { id: "m10", nom: "Multiprise + rallonges", checked: false },
  { id: "m11", nom: "Laptop + sauvegarde USB", checked: false },
  { id: "m12", nom: "Pieds d'enceintes (x2)", checked: false },
];

export const DJ_KPIS = {
  prestationsAVenir: 2,
  prestationsRealisees: 1,
  caTotal: 7500,
  acomptesRecus: 2000,
  soldesEnAttente: 3150,
  devisEnAttente: 1,
};

export const MOCK_DJ_EQUIPE = [
  { id: "art1", nom: "DJ Max", specialite: "Mariages & soirées privées", prestations: 2 },
  { id: "art2", nom: "Animateur Léo", specialite: "Festivals & anniversaires", prestations: 2 },
];
