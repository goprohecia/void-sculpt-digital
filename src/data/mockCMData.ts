// ── Mock data for Community Manager sector ──
import { getDefaultStepsForSector } from "./sectorTimelines";

export const CM_STEPS = getDefaultStepsForSector("community-manager");

export type CMContentStatus = "brouillon" | "a_valider" | "valide" | "publie";

export interface CMClient {
  id: string;
  nom: string;
  cmAssigne: string;
  postsMois: number;
  statutPaiement: "payé" | "en_attente" | "en_retard";
  etape: number;
  reseaux: string[];
}

export interface CMContenu {
  id: string;
  clientId: string;
  clientNom: string;
  titre: string;
  texte: string;
  reseau: "Instagram" | "Facebook" | "LinkedIn" | "TikTok" | "X";
  datePublication: string;
  statut: CMContentStatus;
  visuelUrl?: string;
}

export interface CMRapport {
  mois: string;
  reach: number;
  engagement: number;
  postsPublies: number;
  nouveauxAbonnes: number;
  topPost: string;
}

export const MOCK_CM_CLIENTS: CMClient[] = [
  { id: "cmc1", nom: "FreshFood", cmAssigne: "Léa Martin", postsMois: 18, statutPaiement: "payé", etape: 5, reseaux: ["Instagram", "Facebook", "TikTok"] },
  { id: "cmc2", nom: "TechStart", cmAssigne: "Léa Martin", postsMois: 12, statutPaiement: "en_attente", etape: 3, reseaux: ["LinkedIn", "X"] },
  { id: "cmc3", nom: "UrbanStyle", cmAssigne: "Hugo Renard", postsMois: 22, statutPaiement: "payé", etape: 6, reseaux: ["Instagram", "TikTok"] },
  { id: "cmc4", nom: "GreenGarden", cmAssigne: "Hugo Renard", postsMois: 8, statutPaiement: "en_retard", etape: 2, reseaux: ["Facebook", "Instagram"] },
];

export const MOCK_CM_CONTENUS: CMContenu[] = [
  { id: "cnt1", clientId: "cmc1", clientNom: "FreshFood", titre: "Recette smoothie bowl", texte: "🥤 Notre smoothie bowl du jour ! Parfait pour un boost d'énergie...", reseau: "Instagram", datePublication: "2026-03-11", statut: "a_valider" },
  { id: "cnt2", clientId: "cmc1", clientNom: "FreshFood", titre: "Offre spéciale weekend", texte: "-20% sur tous les jus ce weekend 🎉", reseau: "Facebook", datePublication: "2026-03-14", statut: "brouillon" },
  { id: "cnt3", clientId: "cmc1", clientNom: "FreshFood", titre: "Behind the scenes", texte: "Dans les coulisses de notre cuisine 🍳", reseau: "TikTok", datePublication: "2026-03-12", statut: "valide" },
  { id: "cnt4", clientId: "cmc2", clientNom: "TechStart", titre: "Lancement produit v2", texte: "Nous sommes fiers d'annoncer la v2 de notre plateforme...", reseau: "LinkedIn", datePublication: "2026-03-10", statut: "publie" },
  { id: "cnt5", clientId: "cmc2", clientNom: "TechStart", titre: "Thread tips productivité", texte: "5 conseils pour booster votre productivité 🚀", reseau: "X", datePublication: "2026-03-13", statut: "a_valider" },
  { id: "cnt6", clientId: "cmc3", clientNom: "UrbanStyle", titre: "Nouvelle collection été", texte: "☀️ La collection été 2026 est arrivée ! Découvrez nos pièces...", reseau: "Instagram", datePublication: "2026-03-10", statut: "publie" },
  { id: "cnt7", clientId: "cmc3", clientNom: "UrbanStyle", titre: "Lookbook vidéo", texte: "Découvrez le lookbook été en vidéo 🎬", reseau: "TikTok", datePublication: "2026-03-15", statut: "valide" },
  { id: "cnt8", clientId: "cmc4", clientNom: "GreenGarden", titre: "Conseils jardinage mars", texte: "🌱 Que planter en mars ? Nos 5 conseils...", reseau: "Facebook", datePublication: "2026-03-08", statut: "brouillon" },
  { id: "cnt9", clientId: "cmc4", clientNom: "GreenGarden", titre: "Promo outils de jardin", texte: "Profitez de -15% sur nos outils de jardin !", reseau: "Instagram", datePublication: "2026-03-16", statut: "a_valider" },
];

export const MOCK_CM_RAPPORTS: CMRapport[] = [
  { mois: "Février 2026", reach: 45200, engagement: 3.8, postsPublies: 16, nouveauxAbonnes: 320, topPost: "Recette du mois — 2.4k likes" },
  { mois: "Janvier 2026", reach: 38700, engagement: 3.2, postsPublies: 14, nouveauxAbonnes: 280, topPost: "Résolutions bien-être — 1.8k likes" },
];

export const MOCK_CM_CMS = [
  { id: "cm1", nom: "Léa Martin", poste: "CM Senior", clientsActifs: 2, postsTotal: 30, enRetard: 0 },
  { id: "cm2", nom: "Hugo Renard", poste: "CM Junior", clientsActifs: 2, postsTotal: 30, enRetard: 1 },
];

export const CM_KPIS = {
  clientsActifs: 4,
  postsPublies: 48,
  enAttenteValidation: 3,
  retards: 1,
  caMois: 4800,
};

export const RESEAU_COLORS: Record<string, string> = {
  Instagram: "bg-pink-500/15 text-pink-500",
  Facebook: "bg-blue-500/15 text-blue-500",
  LinkedIn: "bg-sky-600/15 text-sky-600",
  TikTok: "bg-foreground/10 text-foreground",
  X: "bg-foreground/10 text-foreground",
};
