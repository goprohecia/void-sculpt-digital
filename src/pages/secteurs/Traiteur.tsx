import SectorPage from "./SectorPage";
import { UtensilsCrossed, FolderOpen, Users, Receipt, Package, CalendarDays, MessageSquare } from "lucide-react";
import heroImg from "@/assets/sectors/traiteur.jpg";

export default function Traiteur() {
  return (
    <SectorPage
      sectorLabel="Traiteur indépendant"
      title={<>MBA pour les <span className="font-medium text-gradient-neon">Traiteurs indépendants</span></>}
      subtitle="Gérez vos commandes, menus, stock d'ingrédients et livraisons depuis une plateforme centralisée."
      heroImage={heroImg}
      useCases={[
        { icon: FolderOpen, title: "Gestion des commandes", description: "Un dossier par événement avec le menu choisi, le nombre de couverts, les allergies et le planning." },
        { icon: Package, title: "Stock ingrédients", description: "Suivez votre inventaire, planifiez les achats et gérez vos fournisseurs." },
        { icon: Receipt, title: "Devis & Facturation", description: "Établissez des devis par prestation, gérez les acomptes et facturez après l'événement." },
        { icon: CalendarDays, title: "Planning livraisons", description: "Calendrier des événements, préparations et livraisons avec assignation aux équipes." },
      ]}
      modules={[
        { icon: FolderOpen, name: "Dossiers" },
        { icon: Users, name: "Clients" },
        { icon: Receipt, name: "Facturation" },
        { icon: Package, name: "Stock" },
        { icon: CalendarDays, name: "Rendez-vous" },
        { icon: MessageSquare, name: "Messagerie" },
      ]}
    />
  );
}
