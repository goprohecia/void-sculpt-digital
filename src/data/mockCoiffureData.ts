// ── Mock data for Salon de Coiffure / Beauté sector ──
import { getDefaultStepsForSector } from "./sectorTimelines";

export const COIFFURE_STEPS = getDefaultStepsForSector("coiffure");

export const COIFFURE_STEP_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-green-600",
  "bg-rose-500",
];

export interface CoiffurePraticien {
  id: string;
  prenom: string;
  nom: string;
  specialite: string;
  couleur: string; // for calendar display
}

export interface CoiffurePrestation {
  id: string;
  nom: string;
  duree: number; // minutes
  prix: number;
  categorie: "coupe" | "coloration" | "soin" | "coiffage" | "barbe";
}

export interface CoiffureRDV {
  id: string;
  clientNom: string;
  clientId: string;
  praticienId: string;
  praticienNom: string;
  prestationNom: string;
  duree: number;
  prix: number;
  date: string;
  heure: string;
  etape: number; // 0-5
  acomptePaye: boolean;
  montantAcompte: number;
  notes?: string;
}

export interface CoiffureFicheClient {
  clientId: string;
  clientNom: string;
  couleurHabituelle: string;
  typeCheveux: string;
  allergies: string;
  derniereVisite: string;
  notes: string;
  historique: { date: string; prestation: string; praticien: string; notes: string }[];
}

export interface CoiffureProduit {
  id: string;
  nom: string;
  categorie: string;
  quantite: number;
  seuil: number;
  prix: number;
}

export const MOCK_COIFFURE_PRATICIENS: CoiffurePraticien[] = [
  { id: "coif-1", prenom: "Marie", nom: "Duval", specialite: "Coloration & Balayage", couleur: "bg-rose-500" },
  { id: "coif-2", prenom: "Julien", nom: "Morel", specialite: "Coupe homme & Barbe", couleur: "bg-blue-500" },
  { id: "coif-3", prenom: "Léa", nom: "Martin", specialite: "Coiffage & Chignons", couleur: "bg-violet-500" },
];

export const MOCK_COIFFURE_PRESTATIONS: CoiffurePrestation[] = [
  { id: "prest-1", nom: "Coupe femme", duree: 45, prix: 38, categorie: "coupe" },
  { id: "prest-2", nom: "Coupe homme", duree: 30, prix: 25, categorie: "coupe" },
  { id: "prest-3", nom: "Coloration complète", duree: 90, prix: 65, categorie: "coloration" },
  { id: "prest-4", nom: "Balayage", duree: 120, prix: 85, categorie: "coloration" },
  { id: "prest-5", nom: "Brushing", duree: 30, prix: 22, categorie: "coiffage" },
  { id: "prest-6", nom: "Soin kératine", duree: 60, prix: 55, categorie: "soin" },
  { id: "prest-7", nom: "Taille de barbe", duree: 20, prix: 15, categorie: "barbe" },
  { id: "prest-8", nom: "Chignon mariage", duree: 90, prix: 95, categorie: "coiffage" },
];

export const MOCK_COIFFURE_RDV: CoiffureRDV[] = [
  // Aujourd'hui (2026-03-10)
  { id: "rdv-1", clientNom: "Sophie Laurent", clientId: "cl-1", praticienId: "coif-1", praticienNom: "Marie Duval", prestationNom: "Coloration complète", duree: 90, prix: 65, date: "2026-03-10", heure: "09:00", etape: 4, acomptePaye: true, montantAcompte: 15, notes: "Blond vénitien, formule 7.4 + 8.3" },
  { id: "rdv-2", clientNom: "Marc Petit", clientId: "cl-2", praticienId: "coif-2", praticienNom: "Julien Morel", prestationNom: "Coupe homme", duree: 30, prix: 25, date: "2026-03-10", heure: "09:30", etape: 3, acomptePaye: false, montantAcompte: 0 },
  { id: "rdv-3", clientNom: "Emma Dubois", clientId: "cl-3", praticienId: "coif-3", praticienNom: "Léa Martin", prestationNom: "Brushing", duree: 30, prix: 22, date: "2026-03-10", heure: "10:00", etape: 2, acomptePaye: true, montantAcompte: 5 },
  { id: "rdv-4", clientNom: "Claire Bernard", clientId: "cl-4", praticienId: "coif-1", praticienNom: "Marie Duval", prestationNom: "Balayage", duree: 120, prix: 85, date: "2026-03-10", heure: "11:00", etape: 1, acomptePaye: true, montantAcompte: 20 },
  { id: "rdv-5", clientNom: "Thomas Martin", clientId: "cl-5", praticienId: "coif-2", praticienNom: "Julien Morel", prestationNom: "Coupe homme + Barbe", duree: 50, prix: 40, date: "2026-03-10", heure: "10:30", etape: 0, acomptePaye: false, montantAcompte: 0 },
  { id: "rdv-6", clientNom: "Julie Roux", clientId: "cl-6", praticienId: "coif-3", praticienNom: "Léa Martin", prestationNom: "Chignon mariage", duree: 90, prix: 95, date: "2026-03-10", heure: "14:00", etape: 0, acomptePaye: true, montantAcompte: 30 },
  { id: "rdv-7", clientNom: "Nathalie Leroy", clientId: "cl-7", praticienId: "coif-1", praticienNom: "Marie Duval", prestationNom: "Soin kératine", duree: 60, prix: 55, date: "2026-03-10", heure: "14:30", etape: 0, acomptePaye: false, montantAcompte: 0 },
  // Semaine
  { id: "rdv-8", clientNom: "Pierre Gagnon", clientId: "cl-8", praticienId: "coif-2", praticienNom: "Julien Morel", prestationNom: "Coupe homme", duree: 30, prix: 25, date: "2026-03-11", heure: "09:00", etape: 0, acomptePaye: false, montantAcompte: 0 },
  { id: "rdv-9", clientNom: "Isabelle Faure", clientId: "cl-9", praticienId: "coif-1", praticienNom: "Marie Duval", prestationNom: "Coupe femme", duree: 45, prix: 38, date: "2026-03-11", heure: "10:00", etape: 0, acomptePaye: true, montantAcompte: 10 },
  { id: "rdv-10", clientNom: "Lucas Morin", clientId: "cl-10", praticienId: "coif-2", praticienNom: "Julien Morel", prestationNom: "Taille de barbe", duree: 20, prix: 15, date: "2026-03-12", heure: "11:00", etape: 0, acomptePaye: false, montantAcompte: 0 },
];

export const MOCK_COIFFURE_FICHES: CoiffureFicheClient[] = [
  {
    clientId: "cl-1", clientNom: "Sophie Laurent",
    couleurHabituelle: "Blond vénitien (7.4 + 8.3)", typeCheveux: "Fins, ondulés", allergies: "Aucune",
    derniereVisite: "2026-02-15", notes: "Préfère les tons chauds. Racines toutes les 6 semaines.",
    historique: [
      { date: "2026-02-15", prestation: "Coloration + Coupe", praticien: "Marie Duval", notes: "Formule 7.4/8.3 ratio 1:2, temps de pose 35min" },
      { date: "2026-01-10", prestation: "Balayage", praticien: "Marie Duval", notes: "Mèches sur le devant, ton miel" },
      { date: "2025-12-05", prestation: "Coupe + Brushing", praticien: "Léa Martin", notes: "Carré plongeant, brushing lisse" },
    ],
  },
  {
    clientId: "cl-2", clientNom: "Marc Petit",
    couleurHabituelle: "Naturel", typeCheveux: "Épais, droits", allergies: "Aucune",
    derniereVisite: "2026-02-28", notes: "Coupe classique courte, dégradé américain.",
    historique: [
      { date: "2026-02-28", prestation: "Coupe homme", praticien: "Julien Morel", notes: "Dégradé haut, 3mm côtés" },
      { date: "2026-01-25", prestation: "Coupe homme + Barbe", praticien: "Julien Morel", notes: "Barbe structurée" },
    ],
  },
];

export const MOCK_COIFFURE_STOCK: CoiffureProduit[] = [
  { id: "prod-1", nom: "Shampooing Kérastase 1L", categorie: "Shampooing", quantite: 8, seuil: 5, prix: 32 },
  { id: "prod-2", nom: "Coloration L'Oréal Majirel 7.4", categorie: "Coloration", quantite: 3, seuil: 4, prix: 8.5 },
  { id: "prod-3", nom: "Oxydant 20 vol 1L", categorie: "Coloration", quantite: 12, seuil: 5, prix: 6 },
  { id: "prod-4", nom: "Masque Olaplex n°3", categorie: "Soin", quantite: 2, seuil: 3, prix: 28 },
  { id: "prod-5", nom: "Laque Elnett 500ml", categorie: "Coiffage", quantite: 15, seuil: 5, prix: 5.5 },
  { id: "prod-6", nom: "Huile d'argan 100ml", categorie: "Soin", quantite: 6, seuil: 3, prix: 12 },
  { id: "prod-7", nom: "Papier aluminium (rouleau)", categorie: "Technique", quantite: 1, seuil: 2, prix: 4 },
  { id: "prod-8", nom: "Serviettes jetables (x100)", categorie: "Consommable", quantite: 0, seuil: 2, prix: 15 },
];

// No-shows cette semaine (mock)
export const MOCK_COIFFURE_NOSHOWS = 2;

// Créneaux disponibles mock pour réservation client
export const MOCK_COIFFURE_CRENEAUX = [
  { date: "2026-03-11", heure: "14:00", praticienId: "coif-1", praticienNom: "Marie Duval" },
  { date: "2026-03-11", heure: "15:00", praticienId: "coif-2", praticienNom: "Julien Morel" },
  { date: "2026-03-11", heure: "16:00", praticienId: "coif-3", praticienNom: "Léa Martin" },
  { date: "2026-03-12", heure: "09:00", praticienId: "coif-1", praticienNom: "Marie Duval" },
  { date: "2026-03-12", heure: "10:00", praticienId: "coif-1", praticienNom: "Marie Duval" },
  { date: "2026-03-12", heure: "09:30", praticienId: "coif-3", praticienNom: "Léa Martin" },
  { date: "2026-03-12", heure: "14:00", praticienId: "coif-2", praticienNom: "Julien Morel" },
  { date: "2026-03-13", heure: "09:00", praticienId: "coif-2", praticienNom: "Julien Morel" },
  { date: "2026-03-13", heure: "11:00", praticienId: "coif-3", praticienNom: "Léa Martin" },
];
