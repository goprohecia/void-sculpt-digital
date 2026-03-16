import { getDefaultStepsForSector } from "./sectorTimelines";

export const PHOTOGRAPHE_STEPS = getDefaultStepsForSector("photographe");

export interface PhotographeSeance {
  id: string;
  client: string;
  type: string;
  lieu: string;
  date: string;
  duree: string;
  photographe: string;
  step: number;
  statut: "a_venir" | "en_cours" | "terminee";
  brief: string;
  nbPhotos: number;
  nbRetouchees: number;
  tempsRetouche: string;
  acompte: number;
  total: number;
  soldePaye: boolean;
  galerieLivree: boolean;
}

export const MOCK_SEANCES: PhotographeSeance[] = [
  {
    id: "ph-1", client: "Sophie & Thomas", type: "Mariage", lieu: "Château de Chantilly", date: "2026-03-22",
    duree: "8h", photographe: "Maxime Leroy", step: 2, statut: "a_venir",
    brief: "Mariage champêtre. Ambiance douce et lumineuse. 400 photos minimum. Références : style éditorial, film grain. Moments clés : préparatifs, cérémonie laïque, cocktail, ouverture de bal.",
    nbPhotos: 0, nbRetouchees: 0, tempsRetouche: "—", acompte: 800, total: 2400, soldePaye: false, galerieLivree: false,
  },
  {
    id: "ph-2", client: "Cabinet Nexus", type: "Corporate", lieu: "Bureaux Nexus, La Défense", date: "2026-03-14",
    duree: "3h", photographe: "Maxime Leroy", step: 4, statut: "en_cours",
    brief: "Portraits corporate pour le site web. Fond neutre + in-situ. 15 collaborateurs. Style pro, sobre et moderne.",
    nbPhotos: 220, nbRetouchees: 45, tempsRetouche: "6h", acompte: 400, total: 1200, soldePaye: false, galerieLivree: false,
  },
  {
    id: "ph-3", client: "Emma Petit", type: "Portrait famille", lieu: "Parc Monceau, Paris", date: "2026-02-20",
    duree: "1h30", photographe: "Clara Martin", step: 6, statut: "terminee",
    brief: "Séance famille en extérieur. 2 enfants (3 et 6 ans). Ambiance naturelle et joyeuse. 80 photos retouchées.",
    nbPhotos: 180, nbRetouchees: 80, tempsRetouche: "4h", acompte: 150, total: 450, soldePaye: true, galerieLivree: true,
  },
];

export const MOCK_PHOTOGRAPHES = [
  { id: "pg-1", nom: "Maxime Leroy", seancesActives: 2, specialite: "Mariage & Corporate" },
  { id: "pg-2", nom: "Clara Martin", seancesActives: 1, specialite: "Portrait & Lifestyle" },
];

export const PHOTOGRAPHE_KPI = {
  seancesCeMois: 3,
  enAttentelivraison: 1,
  delaiMoyenJours: 12,
  caEnCours: 3600,
};

// Mock gallery images (placeholder URLs)
export const MOCK_GALLERY_IMAGES = Array.from({ length: 12 }, (_, i) => ({
  id: `img-${i + 1}`,
  url: `/placeholder.svg`,
  label: `Photo ${i + 1}`,
}));
