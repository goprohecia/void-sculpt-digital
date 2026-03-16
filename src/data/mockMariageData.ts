// Mock data for Robe de Mariée / Haute Couture sector
import { getDefaultStepsForSector } from "./sectorTimelines";

export const MARIAGE_STEPS = getDefaultStepsForSector("mariage");

export const MARIAGE_STEP_MESSAGES: Record<number, string> = {
  1: "Bienvenue ! Votre premier rendez-vous est confirmé. Nous avons hâte de vous accompagner dans le choix de votre robe de rêve.",
  2: "Vos mesures ont été prises avec soin. La confection de votre robe peut commencer !",
  3: "Votre robe est en cours de confection par nos artisans. Chaque détail est travaillé avec amour.",
  4: "Votre essayage intermédiaire approche ! C'est le moment de vérifier l'ajustement et les finitions.",
  5: "Essayage final prévu ! Votre robe est presque prête, place aux derniers ajustements.",
  6: "Votre robe est arrivée en boutique. Elle n'attend plus que vous !",
  7: "Votre robe est prête à être récupérée. Le grand jour approche !",
  8: "Félicitations ! Nous espérons que vous avez vécu un moment inoubliable. Merci de nous avoir fait confiance.",
};

export interface MariageDossier {
  id: string;
  reference: string;
  marieeNom: string;
  marieePrenom: string;
  email: string;
  telephone: string;
  dateMariage: string;
  modeleChoisi: string;
  taille: string;
  mensurations: { tour_poitrine: string; tour_taille: string; tour_hanches: string; longueur_dos: string };
  notesStyle: string;
  etape: number;
  conseillereId: string;
  retoucheuseId: string | null;
  acompteVerse: number;
  prixTotal: number;
  resteDu: number;
  dateLimitePaiement: string;
}

export interface MariageConseillere {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  specialite: string;
}

export interface MariageRetoucheuse {
  id: string;
  nom: string;
  prenom: string;
  specialite: string;
}

export interface MariageEssayage {
  id: string;
  dossierId: string;
  marieeNom: string;
  date: string;
  heure: string;
  type: "decouverte" | "intermediaire" | "final" | "recuperation";
  conseillereId: string;
}

export interface MariageRetouche {
  id: string;
  dossierId: string;
  marieeNom: string;
  modele: string;
  specifications: string;
  priorite: "haute" | "normale" | "basse";
  delai: string;
  notesRetouche: string;
  statut: "a_faire" | "en_cours" | "termine";
  retoucheuseId: string;
}

export interface MariageRobeStock {
  id: string;
  modele: string;
  taille: string;
  couleur: string;
  prix: number;
  statut: "disponible" | "reserve" | "vendu";
}

export const MOCK_CONSEILLERES: MariageConseillere[] = [
  { id: "cons-1", nom: "Delacroix", prenom: "Isabelle", telephone: "06 10 20 30 40", specialite: "Robes princesse & Haute couture" },
  { id: "cons-2", nom: "Fontaine", prenom: "Claire", telephone: "06 50 60 70 80", specialite: "Robes bohème & Accessoires" },
];

export const MOCK_RETOUCHEUSES: MariageRetoucheuse[] = [
  { id: "ret-1", nom: "Mercier", prenom: "Françoise", specialite: "Ajustements bustier & traîne" },
  { id: "ret-2", nom: "Petit", prenom: "Nadia", specialite: "Broderies & dentelles" },
];

export const MOCK_DOSSIERS_MARIEE: MariageDossier[] = [
  {
    id: "dm-1", reference: "MAR-2026-001", marieeNom: "Laurent", marieePrenom: "Émilie",
    email: "emilie.laurent@email.com", telephone: "06 11 22 33 44", dateMariage: "2026-06-21",
    modeleChoisi: "Éternelle — Robe princesse en tulle ivoire", taille: "38",
    mensurations: { tour_poitrine: "88 cm", tour_taille: "68 cm", tour_hanches: "94 cm", longueur_dos: "42 cm" },
    notesStyle: "Souhaite un décolleté en V, traîne cathédrale. Voile long assorti.", etape: 5,
    conseillereId: "cons-1", retoucheuseId: "ret-1", acompteVerse: 1200, prixTotal: 3200, resteDu: 2000,
    dateLimitePaiement: "2026-05-15",
  },
  {
    id: "dm-2", reference: "MAR-2026-002", marieeNom: "Moreau", marieePrenom: "Chloé",
    email: "chloe.moreau@email.com", telephone: "06 55 66 77 88", dateMariage: "2026-09-12",
    modeleChoisi: "Bohème Dream — Robe fluide en dentelle champagne", taille: "36",
    mensurations: { tour_poitrine: "84 cm", tour_taille: "64 cm", tour_hanches: "90 cm", longueur_dos: "40 cm" },
    notesStyle: "Style bohème-chic, manches longues en dentelle. Couronne de fleurs souhaitée.", etape: 3,
    conseillereId: "cons-2", retoucheuseId: null, acompteVerse: 800, prixTotal: 2800, resteDu: 2000,
    dateLimitePaiement: "2026-08-01",
  },
  {
    id: "dm-3", reference: "MAR-2026-003", marieeNom: "Duval", marieePrenom: "Camille",
    email: "camille.duval@email.com", telephone: "06 99 88 77 66", dateMariage: "2026-07-05",
    modeleChoisi: "Royale — Robe sirène en satin blanc", taille: "40",
    mensurations: { tour_poitrine: "92 cm", tour_taille: "72 cm", tour_hanches: "98 cm", longueur_dos: "44 cm" },
    notesStyle: "Silhouette sirène ajustée, dos nu. Ceinture bijou en cristal.", etape: 7,
    conseillereId: "cons-1", retoucheuseId: "ret-2", acompteVerse: 2500, prixTotal: 3800, resteDu: 1300,
    dateLimitePaiement: "2026-06-01",
  },
  {
    id: "dm-4", reference: "MAR-2026-004", marieeNom: "Bernard", marieePrenom: "Léa",
    email: "lea.bernard@email.com", telephone: "06 22 33 44 55", dateMariage: "2026-11-15",
    modeleChoisi: "Classique — Robe en mikado ivoire", taille: "42",
    mensurations: { tour_poitrine: "96 cm", tour_taille: "76 cm", tour_hanches: "102 cm", longueur_dos: "43 cm" },
    notesStyle: "Robe structurée et épurée. Noeud dans le dos. Voile court.", etape: 1,
    conseillereId: "cons-2", retoucheuseId: null, acompteVerse: 500, prixTotal: 2600, resteDu: 2100,
    dateLimitePaiement: "2026-10-01",
  },
];

export const MOCK_ESSAYAGES: MariageEssayage[] = [
  { id: "ess-1", dossierId: "dm-1", marieeNom: "Émilie Laurent", date: "2026-03-15", heure: "10:00", type: "final", conseillereId: "cons-1" },
  { id: "ess-2", dossierId: "dm-2", marieeNom: "Chloé Moreau", date: "2026-03-18", heure: "14:00", type: "intermediaire", conseillereId: "cons-2" },
  { id: "ess-3", dossierId: "dm-3", marieeNom: "Camille Duval", date: "2026-03-12", heure: "11:00", type: "recuperation", conseillereId: "cons-1" },
  { id: "ess-4", dossierId: "dm-4", marieeNom: "Léa Bernard", date: "2026-03-20", heure: "15:00", type: "decouverte", conseillereId: "cons-2" },
];

export const MOCK_RETOUCHES: MariageRetouche[] = [
  {
    id: "rtc-1", dossierId: "dm-1", marieeNom: "Émilie Laurent", modele: "Éternelle",
    specifications: "Ajuster bustier -1cm poitrine, raccourcir traîne de 5cm, consolider fermeture dos",
    priorite: "haute", delai: "2026-03-14", notesRetouche: "Bustier ajusté. Traîne en cours.",
    statut: "en_cours", retoucheuseId: "ret-1",
  },
  {
    id: "rtc-2", dossierId: "dm-3", marieeNom: "Camille Duval", modele: "Royale",
    specifications: "Resserrer taille -2cm, ajouter cristaux sur ceinture, ourlet +1cm",
    priorite: "normale", delai: "2026-03-11", notesRetouche: "Terminée, robe prête.",
    statut: "termine", retoucheuseId: "ret-2",
  },
  {
    id: "rtc-3", dossierId: "dm-2", marieeNom: "Chloé Moreau", modele: "Bohème Dream",
    specifications: "Ajuster emmanchures, ajouter doublure dos, raccourcir manches 2cm",
    priorite: "basse", delai: "2026-04-01", notesRetouche: "",
    statut: "a_faire", retoucheuseId: "ret-1",
  },
];

export const MOCK_ROBES_STOCK: MariageRobeStock[] = [
  { id: "rs-1", modele: "Éternelle", taille: "36", couleur: "Ivoire", prix: 3200, statut: "disponible" },
  { id: "rs-2", modele: "Éternelle", taille: "38", couleur: "Ivoire", prix: 3200, statut: "reserve" },
  { id: "rs-3", modele: "Bohème Dream", taille: "36", couleur: "Champagne", prix: 2800, statut: "disponible" },
  { id: "rs-4", modele: "Bohème Dream", taille: "40", couleur: "Champagne", prix: 2800, statut: "disponible" },
  { id: "rs-5", modele: "Royale", taille: "38", couleur: "Blanc", prix: 3800, statut: "vendu" },
  { id: "rs-6", modele: "Royale", taille: "40", couleur: "Blanc", prix: 3800, statut: "reserve" },
  { id: "rs-7", modele: "Classique", taille: "38", couleur: "Ivoire", prix: 2600, statut: "disponible" },
  { id: "rs-8", modele: "Classique", taille: "42", couleur: "Ivoire", prix: 2600, statut: "reserve" },
];

export const MARIAGE_KPIS = {
  commandesEnCours: 3,
  commandesTerminees: 1,
  essayagesCetteSemaine: 4,
  caTotal: 12400,
  acomptesRecus: 5000,
  soldesRestants: 7400,
  robesEnStock: 8,
};
