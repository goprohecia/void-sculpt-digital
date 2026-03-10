// ── Mock data for Conciergerie / Airbnb sector ──

export const CONCIERGERIE_STEPS = [
  "Réservation confirmée",
  "Préparation logement",
  "Check-in effectué",
  "Séjour en cours",
  "Check-out",
  "Ménage fait",
  "Bilan propriétaire",
];

export interface ConciergerieBien {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  type: "appartement" | "maison" | "studio";
  proprietaireId: string;
  proprietaireNom: string;
  capacite: number;
  photo: string;
  tauxOccupation: number; // %
  revenuMensuel: number;
  commissionConciergerie: number;
}

export interface ConciergerieReservation {
  id: string;
  bienId: string;
  bienNom: string;
  voyageurNom: string;
  dateArrivee: string;
  dateDepart: string;
  etape: number; // 0-6
  agentId: string;
  agentNom: string;
  proprietaireId: string;
  montantSejour: number;
  plateforme: "Airbnb" | "Booking" | "Direct";
}

export interface ConciergerieIntervention {
  id: string;
  reservationId: string;
  bienId: string;
  bienNom: string;
  adresse: string;
  type: "ménage" | "check-in" | "check-out" | "maintenance";
  date: string;
  heure: string;
  agentId: string;
  agentNom: string;
  statut: "à_faire" | "en_cours" | "terminé";
  checklist: { label: string; done: boolean }[];
}

export interface ConciergerieAgent {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  interventionsJour: number;
}

export const MOCK_CONCIERGERIE_AGENTS: ConciergerieAgent[] = [
  { id: "conc-agent-1", nom: "Petit", prenom: "Claire", telephone: "06 12 34 56 78", interventionsJour: 4 },
  { id: "conc-agent-2", nom: "Garcia", prenom: "Luis", telephone: "06 98 76 54 32", interventionsJour: 3 },
];

export const MOCK_CONCIERGERIE_BIENS: ConciergerieBien[] = [
  { id: "bien-1", nom: "Studio Bastille", adresse: "12 rue de la Roquette", ville: "Paris", type: "studio", proprietaireId: "prop-1", proprietaireNom: "M. Dupont", capacite: 2, photo: "/placeholder.svg", tauxOccupation: 78, revenuMensuel: 2400, commissionConciergerie: 480 },
  { id: "bien-2", nom: "Appt Marais", adresse: "8 rue des Francs-Bourgeois", ville: "Paris", type: "appartement", proprietaireId: "prop-1", proprietaireNom: "M. Dupont", capacite: 4, photo: "/placeholder.svg", tauxOccupation: 85, revenuMensuel: 3800, commissionConciergerie: 760 },
  { id: "bien-3", nom: "Maison Montmartre", adresse: "45 rue Lepic", ville: "Paris", type: "maison", proprietaireId: "prop-2", proprietaireNom: "Mme Bernard", capacite: 6, photo: "/placeholder.svg", tauxOccupation: 62, revenuMensuel: 4200, commissionConciergerie: 840 },
  { id: "bien-4", nom: "Studio Nation", adresse: "3 avenue du Trône", ville: "Paris", type: "studio", proprietaireId: "prop-2", proprietaireNom: "Mme Bernard", capacite: 2, photo: "/placeholder.svg", tauxOccupation: 91, revenuMensuel: 2100, commissionConciergerie: 420 },
  { id: "bien-5", nom: "Appt Oberkampf", adresse: "22 rue Oberkampf", ville: "Paris", type: "appartement", proprietaireId: "prop-3", proprietaireNom: "M. Lefèvre", capacite: 3, photo: "/placeholder.svg", tauxOccupation: 70, revenuMensuel: 2900, commissionConciergerie: 580 },
  { id: "bien-6", nom: "Loft Belleville", adresse: "10 rue de Belleville", ville: "Paris", type: "appartement", proprietaireId: "prop-3", proprietaireNom: "M. Lefèvre", capacite: 5, photo: "/placeholder.svg", tauxOccupation: 55, revenuMensuel: 3200, commissionConciergerie: 640 },
];

export const MOCK_CONCIERGERIE_RESERVATIONS: ConciergerieReservation[] = [
  { id: "resa-1", bienId: "bien-1", bienNom: "Studio Bastille", voyageurNom: "John Smith", dateArrivee: "2026-03-10", dateDepart: "2026-03-14", etape: 3, agentId: "conc-agent-1", agentNom: "Claire Petit", proprietaireId: "prop-1", montantSejour: 480, plateforme: "Airbnb" },
  { id: "resa-2", bienId: "bien-2", bienNom: "Appt Marais", voyageurNom: "Anna Müller", dateArrivee: "2026-03-08", dateDepart: "2026-03-12", etape: 4, agentId: "conc-agent-1", agentNom: "Claire Petit", proprietaireId: "prop-1", montantSejour: 720, plateforme: "Booking" },
  { id: "resa-3", bienId: "bien-3", bienNom: "Maison Montmartre", voyageurNom: "Carlos López", dateArrivee: "2026-03-12", dateDepart: "2026-03-18", etape: 1, agentId: "conc-agent-2", agentNom: "Luis Garcia", proprietaireId: "prop-2", montantSejour: 1200, plateforme: "Direct" },
  { id: "resa-4", bienId: "bien-4", bienNom: "Studio Nation", voyageurNom: "Sophie Martin", dateArrivee: "2026-03-05", dateDepart: "2026-03-09", etape: 6, agentId: "conc-agent-2", agentNom: "Luis Garcia", proprietaireId: "prop-2", montantSejour: 360, plateforme: "Airbnb" },
  { id: "resa-5", bienId: "bien-5", bienNom: "Appt Oberkampf", voyageurNom: "Yuki Tanaka", dateArrivee: "2026-03-11", dateDepart: "2026-03-15", etape: 2, agentId: "conc-agent-1", agentNom: "Claire Petit", proprietaireId: "prop-3", montantSejour: 560, plateforme: "Airbnb" },
  { id: "resa-6", bienId: "bien-1", bienNom: "Studio Bastille", voyageurNom: "Emma Wilson", dateArrivee: "2026-03-15", dateDepart: "2026-03-19", etape: 0, agentId: "conc-agent-1", agentNom: "Claire Petit", proprietaireId: "prop-1", montantSejour: 500, plateforme: "Booking" },
  { id: "resa-7", bienId: "bien-6", bienNom: "Loft Belleville", voyageurNom: "Pierre Durand", dateArrivee: "2026-03-06", dateDepart: "2026-03-10", etape: 5, agentId: "conc-agent-2", agentNom: "Luis Garcia", proprietaireId: "prop-3", montantSejour: 640, plateforme: "Direct" },
];

export const MOCK_CONCIERGERIE_INTERVENTIONS: ConciergerieIntervention[] = [
  {
    id: "int-1", reservationId: "resa-3", bienId: "bien-3", bienNom: "Maison Montmartre", adresse: "45 rue Lepic, Paris",
    type: "ménage", date: "2026-03-10", heure: "09:00", agentId: "conc-agent-2", agentNom: "Luis Garcia", statut: "à_faire",
    checklist: [
      { label: "Draps changés", done: false }, { label: "Serviettes propres", done: false },
      { label: "Cuisine nettoyée", done: false }, { label: "Salle de bain nettoyée", done: false },
      { label: "Aspirateur passé", done: false }, { label: "Poubelles vidées", done: false },
      { label: "Produits d'accueil rechargés", done: false }, { label: "Photos état des lieux", done: false },
    ],
  },
  {
    id: "int-2", reservationId: "resa-5", bienId: "bien-5", bienNom: "Appt Oberkampf", adresse: "22 rue Oberkampf, Paris",
    type: "check-in", date: "2026-03-10", heure: "15:00", agentId: "conc-agent-1", agentNom: "Claire Petit", statut: "à_faire",
    checklist: [
      { label: "Clés remises", done: false }, { label: "Fonctionnement expliqué", done: false },
      { label: "Wifi communiqué", done: false }, { label: "Guide local remis", done: false },
      { label: "État des lieux signé", done: false },
    ],
  },
  {
    id: "int-3", reservationId: "resa-2", bienId: "bien-2", bienNom: "Appt Marais", adresse: "8 rue des Francs-Bourgeois, Paris",
    type: "check-out", date: "2026-03-10", heure: "11:00", agentId: "conc-agent-1", agentNom: "Claire Petit", statut: "en_cours",
    checklist: [
      { label: "Clés récupérées", done: true }, { label: "État des lieux sortie", done: true },
      { label: "Vérification dégâts", done: false }, { label: "Relevé compteurs", done: false },
    ],
  },
  {
    id: "int-4", reservationId: "resa-7", bienId: "bien-6", bienNom: "Loft Belleville", adresse: "10 rue de Belleville, Paris",
    type: "ménage", date: "2026-03-10", heure: "12:00", agentId: "conc-agent-2", agentNom: "Luis Garcia", statut: "terminé",
    checklist: [
      { label: "Draps changés", done: true }, { label: "Serviettes propres", done: true },
      { label: "Cuisine nettoyée", done: true }, { label: "Salle de bain nettoyée", done: true },
      { label: "Aspirateur passé", done: true }, { label: "Poubelles vidées", done: true },
      { label: "Produits d'accueil rechargés", done: true }, { label: "Photos état des lieux", done: true },
    ],
  },
];

// Historique interventions pour propriétaire
export const MOCK_CONCIERGERIE_HISTORIQUE = [
  { date: "2026-03-01", agentNom: "Claire Petit", type: "check-in", bienNom: "Studio Bastille", rapport: "Check-in fluide, voyageur satisfait." },
  { date: "2026-03-04", agentNom: "Luis Garcia", type: "ménage", bienNom: "Studio Bastille", rapport: "Ménage complet, remplacement ampoule salon." },
  { date: "2026-03-05", agentNom: "Claire Petit", type: "check-out", bienNom: "Studio Bastille", rapport: "RAS, aucun dégât constaté." },
  { date: "2026-03-06", agentNom: "Claire Petit", type: "check-in", bienNom: "Appt Marais", rapport: "Accueil 2 voyageurs, clés boîte à code." },
  { date: "2026-03-08", agentNom: "Luis Garcia", type: "maintenance", bienNom: "Loft Belleville", rapport: "Remplacement joint robinet cuisine." },
];

// Revenus propriétaire mock (prop-1)
export const MOCK_PROPRIETAIRE_REVENUS = {
  proprietaireId: "prop-1",
  mois: "Mars 2026",
  loyersPercus: 6200,
  commissionConciergerie: 1240,
  fraisEntretien: 180,
  soldeNet: 4780,
  biensGeres: 2,
  tauxOccupationMoyen: 82,
  nbReservations: 5,
};

export const CONCIERGERIE_STEP_COLORS = [
  "bg-blue-500",      // Réservation confirmée
  "bg-amber-500",     // Préparation logement
  "bg-emerald-500",   // Check-in effectué
  "bg-purple-500",    // Séjour en cours
  "bg-orange-500",    // Check-out
  "bg-teal-500",      // Ménage fait
  "bg-green-600",     // Bilan propriétaire
];
