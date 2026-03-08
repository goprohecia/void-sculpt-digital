import SectorPage from "./SectorPage";
import { HardHat, FileText, Package, Receipt, CalendarDays, MessageSquare, Users, MapPin } from "lucide-react";

export default function BTP() {
  return (
    <SectorPage
      sectorLabel="BTP & Artisans"
      title={<>MBA pour le <span className="font-medium text-gradient-neon">BTP & les Artisans</span></>}
      subtitle="Pilotez vos chantiers, devis, factures et équipes terrain depuis une plateforme pensée pour le terrain."
      useCases={[
        {
          icon: MapPin,
          title: "Gestion des chantiers",
          description: "Créez un dossier par chantier avec planning, budget, documents et suivi d'avancement. Gardez une vision claire de tous vos projets en cours.",
        },
        {
          icon: FileText,
          title: "Devis & factures",
          description: "Établissez des devis détaillés avec lots et postes, puis transformez-les en factures automatiquement à chaque étape du chantier.",
        },
        {
          icon: Users,
          title: "Gestion des équipes terrain",
          description: "Assignez vos collaborateurs aux chantiers, planifiez les interventions et suivez la charge de travail de chaque équipe.",
        },
        {
          icon: Package,
          title: "Stock de matériaux",
          description: "Gérez votre inventaire de matériaux et consommables, suivez les sorties par chantier et anticipez vos réapprovisionnements.",
        },
      ]}
      modules={[
        { icon: FileText, name: "Dossiers" },
        { icon: Package, name: "Stock" },
        { icon: Receipt, name: "Facturation" },
        { icon: CalendarDays, name: "Calendrier" },
        { icon: MessageSquare, name: "Messagerie" },
        { icon: Users, name: "Clients" },
      ]}
    />
  );
}
