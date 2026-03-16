import { getDefaultStepsForSector } from "./sectorTimelines";

export const TRAITEUR_STEPS = getDefaultStepsForSector("traiteur");

export interface TraiteurCommande {
  id: string;
  client: string;
  date: string;
  type: string;
  nbCouverts: number;
  step: number;
  lieu: string;
  heureLivraison: string;
  montantDevis: number;
  acompte: number;
  contratSigne: boolean;
  menu: TraiteurMenuPoste[];
  checklistPrep: string[];
}

export interface TraiteurMenuPoste {
  id: string;
  categorie: string;
  nom: string;
  quantite: number;
  prixUnitaire: number;
  valide: boolean;
}

export interface TraiteurFormule {
  id: string;
  nom: string;
  description: string;
  prixParCouvert: number;
  plats: string[];
}

export interface TraiteurMatiere {
  id: string;
  nom: string;
  quantite: number;
  unite: string;
  seuilAlerte: number;
  fournisseur: string;
}

export const MOCK_FORMULES: TraiteurFormule[] = [
  { id: "fm-1", nom: "Formule Prestige", description: "Cocktail + entrée + plat + dessert + mignardises", prixParCouvert: 85, plats: ["Verrines de saison", "Carpaccio Saint-Jacques", "Filet de bœuf Rossini", "Pièce montée artisanale", "Mignardises assorties"] },
  { id: "fm-2", nom: "Formule Élégance", description: "Cocktail + plat + dessert", prixParCouvert: 55, plats: ["Plateau cocktail 8 pièces", "Suprême de volaille aux morilles", "Dessert à l'assiette"] },
  { id: "fm-3", nom: "Formule Brunch", description: "Buffet salé + sucré + boissons", prixParCouvert: 35, plats: ["Viennoiseries", "Oeufs Bénédicte", "Salade composée", "Fruits frais", "Pancakes & Sirop d'érable"] },
];

export const MOCK_COMMANDES: TraiteurCommande[] = [
  {
    id: "tr-1", client: "Société Artemia", date: "2026-03-28", type: "Cocktail corporate", nbCouverts: 80,
    step: 5, lieu: "Hôtel Le Meurice, Paris", heureLivraison: "18:00", montantDevis: 4400, acompte: 2200, contratSigne: true,
    menu: [
      { id: "m1", categorie: "Cocktail", nom: "Plateau cocktail 8 pièces", quantite: 80, prixUnitaire: 18, valide: true },
      { id: "m2", categorie: "Plat", nom: "Mini burgers wagyu", quantite: 80, prixUnitaire: 12, valide: true },
      { id: "m3", categorie: "Dessert", nom: "Verrines passion-mangue", quantite: 80, prixUnitaire: 8, valide: true },
      { id: "m4", categorie: "Service", nom: "Service sur place (3 serveurs)", quantite: 1, prixUnitaire: 850, valide: true },
      { id: "m5", categorie: "Matériel", nom: "Vaisselle & nappage", quantite: 1, prixUnitaire: 350, valide: true },
    ],
    checklistPrep: ["Achats frais effectués", "Préparation cocktails", "Cuisson burgers", "Montage verrines", "Chargement camion", "Vérification matériel service"],
  },
  {
    id: "tr-2", client: "Marie & Julien", date: "2026-04-12", type: "Mariage", nbCouverts: 120,
    step: 3, lieu: "Domaine de la Vallée, Versailles", heureLivraison: "19:30", montantDevis: 10200, acompte: 0, contratSigne: false,
    menu: [
      { id: "m6", categorie: "Cocktail", nom: "Verrines de saison", quantite: 120, prixUnitaire: 6, valide: true },
      { id: "m7", categorie: "Entrée", nom: "Carpaccio Saint-Jacques", quantite: 120, prixUnitaire: 14, valide: false },
      { id: "m8", categorie: "Plat", nom: "Filet de bœuf Rossini", quantite: 120, prixUnitaire: 28, valide: true },
      { id: "m9", categorie: "Dessert", nom: "Pièce montée artisanale", quantite: 1, prixUnitaire: 650, valide: false },
      { id: "m10", categorie: "Service", nom: "Service complet (6 serveurs + chef)", quantite: 1, prixUnitaire: 2200, valide: true },
    ],
    checklistPrep: ["Menu finalisé", "Commande fournisseurs", "Réservation véhicule", "Préparation entrées", "Cuisson pièce principale", "Montage pièce montée", "Dressage assiettes", "Chargement"],
  },
  {
    id: "tr-3", client: "Start-up Nova", date: "2026-03-15", type: "Brunch d'équipe", nbCouverts: 30,
    step: 7, lieu: "Bureaux Nova, Boulogne", heureLivraison: "10:00", montantDevis: 1050, acompte: 525, contratSigne: true,
    menu: [
      { id: "m11", categorie: "Sucré", nom: "Viennoiseries", quantite: 30, prixUnitaire: 4, valide: true },
      { id: "m12", categorie: "Salé", nom: "Oeufs Bénédicte", quantite: 30, prixUnitaire: 8, valide: true },
      { id: "m13", categorie: "Boissons", nom: "Jus frais & café", quantite: 30, prixUnitaire: 5, valide: true },
    ],
    checklistPrep: ["Achats viennoiseries", "Préparation oeufs", "Pressage jus", "Emballage", "Livraison"],
  },
];

export const MOCK_MATIERES: TraiteurMatiere[] = [
  { id: "mt-1", nom: "Filet de bœuf", quantite: 8, unite: "kg", seuilAlerte: 5, fournisseur: "Boucherie Dupont" },
  { id: "mt-2", nom: "Saint-Jacques", quantite: 3, unite: "kg", seuilAlerte: 2, fournisseur: "Marée Fraîche" },
  { id: "mt-3", nom: "Beurre AOP", quantite: 12, unite: "kg", seuilAlerte: 5, fournisseur: "Crèmerie Morin" },
  { id: "mt-4", nom: "Farine T55", quantite: 25, unite: "kg", seuilAlerte: 10, fournisseur: "Moulin Lepage" },
  { id: "mt-5", nom: "Œufs bio", quantite: 48, unite: "pièces", seuilAlerte: 24, fournisseur: "Ferme du Val" },
  { id: "mt-6", nom: "Mangue", quantite: 4, unite: "kg", seuilAlerte: 3, fournisseur: "Fruits & Co" },
  { id: "mt-7", nom: "Chocolat noir 70%", quantite: 6, unite: "kg", seuilAlerte: 3, fournisseur: "Valrhona" },
];

export const TRAITEUR_KPI = {
  commandesCeMois: 3,
  couvertsTotaux: 230,
  caEnCours: 15650,
  enPreparation: 1,
};
