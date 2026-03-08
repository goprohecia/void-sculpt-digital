import SectorPage from "./SectorPage";
import { Wrench, Package, FileText, Receipt, Users, Car, BarChart3 } from "lucide-react";
import heroImg from "@/assets/sectors/garages.jpg";

export default function Garages() {
  return (
    <SectorPage
      sectorLabel="Garages & Carrosseries"
      title={<>MBA pour les <span className="font-medium text-gradient-neon">Garages & Carrosseries</span></>}
      subtitle="Gérez vos véhicules, devis de réparation, stock de pièces détachées et suivi d'atelier en un seul outil."
      heroImage={heroImg}
      useCases={[
        { icon: Car, title: "Gestion des véhicules", description: "Créez une fiche par véhicule avec immatriculation, historique des interventions, kilométrage et photos avant/après." },
        { icon: FileText, title: "Devis & ordres de réparation", description: "Établissez vos devis avec les pièces et la main-d'œuvre, puis convertissez-les en ordres de réparation en un clic." },
        { icon: Package, title: "Stock de pièces détachées", description: "Suivez votre inventaire en temps réel, configurez des alertes de seuil et gérez vos commandes fournisseurs directement depuis MBA." },
        { icon: Wrench, title: "Suivi d'atelier", description: "Planifiez les interventions, assignez les mécaniciens et suivez l'avancement de chaque réparation sur un calendrier visuel." },
      ]}
      modules={[
        { icon: Package, name: "Stock" },
        { icon: FileText, name: "Dossiers" },
        { icon: FileText, name: "Devis" },
        { icon: Receipt, name: "Facturation" },
        { icon: Users, name: "Clients" },
        { icon: BarChart3, name: "Analyse" },
      ]}
    />
  );
}
