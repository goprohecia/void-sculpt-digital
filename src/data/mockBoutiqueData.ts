// ── Mock data for Boutique / Commerce sector ──

export const BOUTIQUE_STEPS = [
  "Commande reçue",
  "Paiement validé",
  "Préparation",
  "Expédié / Prêt",
  "Récupéré / Livré",
  "Terminé",
];

export interface BoutiqueProduit {
  id: string;
  reference: string;
  nom: string;
  categorie: string;
  prixAchat: number;
  prixVente: number;
  stock: number;
  seuilAlerte: number;
}

export interface BoutiqueCommande {
  id: string;
  reference: string;
  clientNom: string;
  articles: { produit: string; quantite: number; prixUnit: number }[];
  total: number;
  etape: number;
  date: string;
  vendeur: string;
}

export interface BoutiqueVendeur {
  id: string;
  nom: string;
  poste: string;
  ventesJour: number;
  ca: number;
}

export interface BoutiqueCommandeFournisseur {
  id: string;
  fournisseur: string;
  reference: string;
  montant: number;
  dateCommande: string;
  dateLivraisonPrevue: string;
  statut: "en_cours" | "expediee" | "livree";
}

export const MOCK_BOUTIQUE_PRODUITS: BoutiqueProduit[] = [
  { id: "bp1", reference: "TEE-001", nom: "T-shirt basique blanc", categorie: "Vêtements", prixAchat: 8, prixVente: 24.90, stock: 45, seuilAlerte: 10 },
  { id: "bp2", reference: "JEA-002", nom: "Jean slim noir", categorie: "Vêtements", prixAchat: 22, prixVente: 59.90, stock: 18, seuilAlerte: 5 },
  { id: "bp3", reference: "SAC-003", nom: "Sac bandoulière cuir", categorie: "Accessoires", prixAchat: 35, prixVente: 89.90, stock: 7, seuilAlerte: 3 },
  { id: "bp4", reference: "BIJ-004", nom: "Bracelet argent", categorie: "Bijoux", prixAchat: 12, prixVente: 34.90, stock: 2, seuilAlerte: 5 },
  { id: "bp5", reference: "CHA-005", nom: "Chapeau panama", categorie: "Accessoires", prixAchat: 15, prixVente: 42.00, stock: 12, seuilAlerte: 4 },
  { id: "bp6", reference: "ROB-006", nom: "Robe d'été fleurie", categorie: "Vêtements", prixAchat: 18, prixVente: 54.90, stock: 23, seuilAlerte: 8 },
  { id: "bp7", reference: "CHE-007", nom: "Chemise lin beige", categorie: "Vêtements", prixAchat: 20, prixVente: 64.90, stock: 9, seuilAlerte: 5 },
  { id: "bp8", reference: "LUN-008", nom: "Lunettes de soleil", categorie: "Accessoires", prixAchat: 10, prixVente: 29.90, stock: 31, seuilAlerte: 8 },
];

export const MOCK_BOUTIQUE_COMMANDES: BoutiqueCommande[] = [
  { id: "bc1", reference: "CMD-2026-001", clientNom: "Marie Dupont", articles: [{ produit: "T-shirt basique blanc", quantite: 2, prixUnit: 24.90 }, { produit: "Jean slim noir", quantite: 1, prixUnit: 59.90 }], total: 109.70, etape: 3, date: "2026-03-08", vendeur: "Sophie M." },
  { id: "bc2", reference: "CMD-2026-002", clientNom: "Lucas Bernard", articles: [{ produit: "Sac bandoulière cuir", quantite: 1, prixUnit: 89.90 }], total: 89.90, etape: 5, date: "2026-03-05", vendeur: "Thomas R." },
  { id: "bc3", reference: "CMD-2026-003", clientNom: "Claire Martin", articles: [{ produit: "Robe d'été fleurie", quantite: 1, prixUnit: 54.90 }, { produit: "Chapeau panama", quantite: 1, prixUnit: 42.00 }], total: 96.90, etape: 1, date: "2026-03-10", vendeur: "Sophie M." },
  { id: "bc4", reference: "CMD-2026-004", clientNom: "Antoine Lefevre", articles: [{ produit: "Chemise lin beige", quantite: 2, prixUnit: 64.90 }, { produit: "Lunettes de soleil", quantite: 1, prixUnit: 29.90 }], total: 159.70, etape: 2, date: "2026-03-09", vendeur: "Thomas R." },
  { id: "bc5", reference: "CMD-2026-005", clientNom: "Julie Moreau", articles: [{ produit: "Bracelet argent", quantite: 3, prixUnit: 34.90 }], total: 104.70, etape: 4, date: "2026-03-07", vendeur: "Sophie M." },
];

export const MOCK_BOUTIQUE_VENDEURS: BoutiqueVendeur[] = [
  { id: "bv1", nom: "Sophie M.", poste: "Vendeuse senior", ventesJour: 8, ca: 487.50 },
  { id: "bv2", nom: "Thomas R.", poste: "Vendeur", ventesJour: 5, ca: 312.30 },
  { id: "bv3", nom: "Léa D.", poste: "Vendeuse", ventesJour: 6, ca: 389.00 },
];

export const MOCK_BOUTIQUE_COMMANDES_FOURNISSEURS: BoutiqueCommandeFournisseur[] = [
  { id: "bcf1", fournisseur: "TextilePro", reference: "CF-2026-010", montant: 1250, dateCommande: "2026-03-01", dateLivraisonPrevue: "2026-03-15", statut: "en_cours" },
  { id: "bcf2", fournisseur: "AccessMode", reference: "CF-2026-011", montant: 780, dateCommande: "2026-02-25", dateLivraisonPrevue: "2026-03-10", statut: "expediee" },
  { id: "bcf3", fournisseur: "BijouxFactory", reference: "CF-2026-012", montant: 450, dateCommande: "2026-02-20", dateLivraisonPrevue: "2026-03-05", statut: "livree" },
];

export const BOUTIQUE_KPIS = {
  caJour: 1188.80,
  caSemaine: 6420.50,
  caMois: 24850.00,
  nbCommandesJour: 19,
  nbCommandesSemaine: 87,
  panierMoyen: 62.55,
  alertesStock: 2,
  produitsEnStock: 147,
};

export const MOCK_BOUTIQUE_CLIENT_COMMANDES = [
  { id: "bcc1", reference: "CMD-2026-001", date: "2026-03-08", articles: ["T-shirt basique blanc x2", "Jean slim noir x1"], total: 109.70, etape: 3 },
  { id: "bcc2", reference: "CMD-2025-089", date: "2025-12-20", articles: ["Sac bandoulière cuir x1"], total: 89.90, etape: 5 },
  { id: "bcc3", reference: "CMD-2025-072", date: "2025-11-14", articles: ["Robe d'été fleurie x1", "Bracelet argent x1"], total: 89.80, etape: 5 },
];

export const MOCK_BOUTIQUE_FIDELITE = {
  points: 342,
  palier: "Silver",
  prochainPalier: "Gold",
  pointsProchain: 500,
  historique: [
    { date: "2026-03-08", description: "Achat CMD-2026-001", points: 110 },
    { date: "2025-12-20", description: "Achat CMD-2025-089", points: 90 },
    { date: "2025-11-14", description: "Achat CMD-2025-072", points: 90 },
    { date: "2025-09-05", description: "Bonus parrainage", points: 52 },
  ],
};
