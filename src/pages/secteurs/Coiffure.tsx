import SectorPage from "./SectorPage";
import { Scissors, Users, CalendarDays, Package, Receipt, BarChart3 } from "lucide-react";

export default function Coiffure() {
  return (
    <SectorPage
      sectorLabel="Salons de coiffure & Instituts de beauté"
      title={<>MBA pour les <span className="font-medium text-gradient-neon">Salons & Instituts de beauté</span></>}
      subtitle="Gérez vos rendez-vous, fiches clients avec préférences, stock produits et facturation au quotidien."
      useCases={[
        {
          icon: CalendarDays,
          title: "Gestion des rendez-vous",
          description: "Planifiez les créneaux de chaque collaborateur, évitez les chevauchements et envoyez des rappels automatiques à vos clients.",
        },
        {
          icon: Users,
          title: "Fiches clients & préférences",
          description: "Conservez l'historique des prestations, couleurs utilisées, préférences et allergies de chaque client pour un service personnalisé.",
        },
        {
          icon: Package,
          title: "Stock produits",
          description: "Suivez vos produits capillaires et cosmétiques en temps réel, configurez des alertes de réapprovisionnement et gérez vos fournisseurs.",
        },
        {
          icon: Receipt,
          title: "Facturation & encaissements",
          description: "Éditez vos factures en un clic, suivez les encaissements et analysez votre chiffre d'affaires par prestation ou collaborateur.",
        },
      ]}
      modules={[
        { icon: CalendarDays, name: "Rendez-vous" },
        { icon: Users, name: "Clients" },
        { icon: Package, name: "Stock" },
        { icon: Receipt, name: "Facturation" },
        { icon: BarChart3, name: "Analyse" },
      ]}
    />
  );
}
