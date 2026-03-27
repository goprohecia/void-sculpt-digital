// [MBA] Restructuration conciergerie — catégories secteurs pour l'onboarding
import type { SectorKey } from "@/contexts/DemoPlanContext";

export interface SectorCategoryItem {
  key: SectorKey;
  icon: string;
  label: string;
  roles: string; // "employé / client" display
}

export interface SectorCategory {
  title: string;
  emoji: string;
  sectors: SectorCategoryItem[];
}

export const SECTOR_CATEGORIES: SectorCategory[] = [
  {
    title: "Réparation & Technique",
    emoji: "🔧",
    sectors: [
      { key: "garages", icon: "🔧", label: "Garage / Carrosserie", roles: "Mécanicien / Client" },
      { key: "reparateur", icon: "📱", label: "Réparateur", roles: "Technicien / Client" },
      { key: "btp", icon: "🏗️", label: "BTP / Artisan", roles: "Ouvrier / Client" },
    ],
  },
  {
    title: "Accompagnement & Conseil",
    emoji: "🧠",
    sectors: [
      { key: "consultant", icon: "🧠", label: "Consultant", roles: "Consultant / Client" },
      { key: "coach-sportif", icon: "💪", label: "Coach sportif", roles: "Coach / Membre" },
      { key: "cabinet-recrutement", icon: "🤝", label: "Cabinet de Recrutement", roles: "Chargé de recrutement / Client" },
      { key: "formateur", icon: "📚", label: "Formateur", roles: "Formateur / Client" },
      { key: "expert-comptable", icon: "📊", label: "Expert-Comptable", roles: "Collaborateur comptable / Client" },
    ],
  },
  {
    title: "Créatif & Événementiel",
    emoji: "🎨",
    sectors: [
      { key: "designer", icon: "🎨", label: "Designer", roles: "Designer / Client" },
      { key: "photographe", icon: "📷", label: "Photographe", roles: "Photographe / Client" },
      { key: "dj-animateur", icon: "🎤", label: "DJ / Animateur", roles: "Régisseur / Client" },
      { key: "evenementiel", icon: "🎉", label: "Événementiel", roles: "Chef de projet / Client" },
      { key: "community-manager", icon: "📱", label: "Community Manager", roles: "Chargé de compte / Client" },
    ],
  },
  {
    // [MBA] Restructuration conciergerie — conciergerie et nettoyage retirés, remplacés par la nouvelle catégorie
    title: "Commerce & Services",
    emoji: "🛍️",
    sectors: [
      { key: "boutique", icon: "🛍️", label: "Magasin / Boutique", roles: "Vendeur / Client" },
      { key: "traiteur", icon: "🍽️", label: "Traiteur", roles: "Cuisinier / Client" },
      { key: "coiffure", icon: "✂️", label: "Salon de Coiffure / Beauté", roles: "Praticien / Client" },
    ],
  },
  // [MBA] Restructuration conciergerie — nouvelle catégorie avec 3 métiers distincts
  {
    title: "Conciergerie & Gestion de biens",
    emoji: "🏠",
    sectors: [
      { key: "conciergerie-immo", icon: "🏠", label: "Conciergerie immobilière", roles: "Gestionnaire / Propriétaire" },
      { key: "conciergerie-nettoyage", icon: "🧹", label: "Conciergerie de nettoyage", roles: "Responsable / Agent d'entretien" },
      { key: "conciergerie-auto", icon: "🚗", label: "Conciergerie automobile", roles: "Gestionnaire / Chauffeur-Livreur" },
    ],
  },
  {
    title: "Juridique & Administratif",
    emoji: "⚖️",
    sectors: [
      { key: "cabinet-avocats", icon: "⚖️", label: "Cabinet d'Avocats", roles: "Collaborateur / Client" },
      { key: "immobilier", icon: "🏠", label: "Agence Immobilière", roles: "Agent / Client" },
      { key: "developpeur", icon: "💻", label: "Développeur / Studio digital", roles: "Développeur / Client" },
    ],
  },
  {
    title: "Éducation & Formation",
    emoji: "📚",
    sectors: [
      { key: "auto-ecole", icon: "🚗", label: "Auto-école", roles: "Moniteur / Élève" },
      { key: "centre-islamique", icon: "🕌", label: "Centre islamique", roles: "Professeur / Élève" },
      { key: "association-sportive", icon: "⚽", label: "Association sportive", roles: "Entraîneur / Membre" },
    ],
  },
  {
    title: "Mariage & Haute Couture",
    emoji: "👗",
    sectors: [
      { key: "mariage", icon: "👗", label: "Robe de Mariée / Haute Couture", roles: "Conseillère + Retoucheuse / Mariée" },
    ],
  },
];
