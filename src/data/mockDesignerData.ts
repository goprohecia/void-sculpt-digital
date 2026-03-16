// ── Mock data for Designer sector ──
import { getDefaultStepsForSector } from "./sectorTimelines";

export const DESIGNER_STEPS = getDefaultStepsForSector("designer");

export type DesignerVersionStatus = "soumise" | "validee" | "corrections";

export interface DesignerProjet {
  id: string;
  clientNom: string;
  designerAssigne: string;
  typeCreation: string;
  brief: string;
  etape: number;
  deadline: string;
  montant: number;
  acompte: number;
  solde: number;
  moodboardImages: string[];
  versions: DesignerVersion[];
}

export interface DesignerVersion {
  id: string;
  numero: number;
  description: string;
  lienFichier: string;
  dateUpload: string;
  statut: DesignerVersionStatus;
  commentaireClient?: string;
}

export interface DesignerEquipe {
  id: string;
  nom: string;
  specialite: string;
  projetsActifs: number;
  chargeSemaine: number; // %
  disponible: boolean;
}

export const MOCK_DESIGNER_PROJETS: DesignerProjet[] = [
  {
    id: "dp1", clientNom: "CaféNova", designerAssigne: "Léa Fontaine", typeCreation: "Identité visuelle",
    brief: "Refonte complète de l'identité visuelle : logo, charte graphique, déclinaisons print et digital. Univers chaleureux, artisanal, moderne.",
    etape: 3, deadline: "2026-04-15", montant: 4500, acompte: 2250, solde: 2250,
    moodboardImages: ["Tons terre cuite & vert olive", "Typographie serif élégante", "Illustrations minimalistes café"],
    versions: [
      { id: "v1", numero: 1, description: "Proposition logo v1 — 3 pistes créatives", lienFichier: "logo_cafenova_v1.pdf", dateUpload: "2026-03-05", statut: "corrections", commentaireClient: "J'aime la piste 2 mais le vert est trop foncé. Peut-on tester un vert olive plus clair ?" },
      { id: "v2", numero: 2, description: "Logo v2 — piste 2 affinée avec vert olive clair", lienFichier: "logo_cafenova_v2.pdf", dateUpload: "2026-03-09", statut: "soumise" },
    ],
  },
  {
    id: "dp2", clientNom: "FitPulse", designerAssigne: "Léa Fontaine", typeCreation: "UI/UX App mobile",
    brief: "Design de l'application mobile de coaching sportif. Interface énergique, couleurs vives, navigation fluide. Cible : 25-40 ans urbains.",
    etape: 4, deadline: "2026-03-28", montant: 6000, acompte: 3000, solde: 3000,
    moodboardImages: ["Gradients néon orange/violet", "Cards arrondies avec ombres douces", "Iconographie sportive line-art"],
    versions: [
      { id: "v3", numero: 1, description: "Wireframes des 5 écrans principaux", lienFichier: "fitpulse_wireframes.pdf", dateUpload: "2026-02-20", statut: "validee" },
      { id: "v4", numero: 2, description: "Maquettes HD — écran accueil + profil", lienFichier: "fitpulse_maquettes_v1.pdf", dateUpload: "2026-03-01", statut: "corrections", commentaireClient: "Le bouton CTA n'est pas assez visible. Augmenter le contraste." },
      { id: "v5", numero: 3, description: "Maquettes HD corrigées — CTA + navigation", lienFichier: "fitpulse_maquettes_v2.pdf", dateUpload: "2026-03-08", statut: "soumise" },
    ],
  },
  {
    id: "dp3", clientNom: "MaisonBlanc", designerAssigne: "Yann Mercier", typeCreation: "Branding print",
    brief: "Création d'un catalogue produits 32 pages pour salon professionnel. Élégant, luxe discret, photos produits à intégrer.",
    etape: 5, deadline: "2026-03-20", montant: 3200, acompte: 1600, solde: 1600,
    moodboardImages: ["Blanc cassé & or", "Mise en page aérée magazine", "Typo sans-serif fine"],
    versions: [
      { id: "v6", numero: 1, description: "Gabarit 4 pages types", lienFichier: "maison_gabarit_v1.pdf", dateUpload: "2026-02-25", statut: "validee" },
      { id: "v7", numero: 2, description: "Catalogue complet 32 pages — BAT", lienFichier: "maison_catalogue_bat.pdf", dateUpload: "2026-03-10", statut: "soumise" },
    ],
  },
  {
    id: "dp4", clientNom: "UrbanRoots", designerAssigne: "Yann Mercier", typeCreation: "Packaging",
    brief: "Design packaging gamme de 4 bières artisanales. Street art, urbain, audacieux. Format canette 33cl.",
    etape: 6, deadline: "2026-03-05", montant: 2800, acompte: 1400, solde: 1400,
    moodboardImages: ["Graffiti tags colorés", "Typo bold display", "Illustrations urbaines vectorielles"],
    versions: [
      { id: "v8", numero: 1, description: "Propositions packaging — 2 directions", lienFichier: "urban_pack_v1.pdf", dateUpload: "2026-02-10", statut: "validee" },
      { id: "v9", numero: 2, description: "Déclinaisons 4 bières + mockups 3D", lienFichier: "urban_pack_final.pdf", dateUpload: "2026-02-25", statut: "validee" },
    ],
  },
];

export const MOCK_DESIGNER_EQUIPE: DesignerEquipe[] = [
  { id: "des1", nom: "Léa Fontaine", specialite: "Branding & UI/UX", projetsActifs: 2, chargeSemaine: 90, disponible: false },
  { id: "des2", nom: "Yann Mercier", specialite: "Print & Packaging", projetsActifs: 2, chargeSemaine: 70, disponible: true },
];

export const DESIGNER_KPIS = {
  projetsEnCours: 3,
  projetsLivres: 1,
  caTotal: 16500,
  caMois: 6700,
  acomptesRecus: 8250,
  soldesEnAttente: 8250,
};
