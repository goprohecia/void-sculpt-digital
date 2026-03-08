import SectorPage from "./SectorPage";
import { PartyPopper, Users, FileText, CalendarDays, Receipt, MessageSquare, BarChart3 } from "lucide-react";
import heroImg from "@/assets/sectors/evenementiel.jpg";

export default function Evenementiel() {
  return (
    <SectorPage
      sectorLabel="Agences événementielles"
      title={<>MBA pour les <span className="font-medium text-gradient-neon">Agences événementielles</span></>}
      subtitle="Pilotez vos événements, prestataires, devis et planning d'équipe depuis un outil centralisé."
      heroImage={heroImg}
      useCases={[
        { icon: PartyPopper, title: "Gestion de projets événementiels", description: "Créez un dossier par événement avec brief client, budget, checklist, timeline et documents associés." },
        { icon: Users, title: "Gestion des prestataires", description: "Centralisez votre carnet de prestataires (traiteurs, photographes, lieux…), comparez les devis et suivez les confirmations." },
        { icon: CalendarDays, title: "Planning & coordination", description: "Planifiez chaque étape de l'événement, assignez les tâches à votre équipe et suivez l'avancement en temps réel." },
        { icon: Receipt, title: "Devis & facturation clients", description: "Établissez des devis détaillés par poste, gérez les acomptes et facturez vos clients automatiquement à chaque jalon." },
      ]}
      modules={[
        { icon: FileText, name: "Dossiers" },
        { icon: Users, name: "Clients" },
        { icon: CalendarDays, name: "Calendrier" },
        { icon: Receipt, name: "Facturation" },
        { icon: MessageSquare, name: "Messagerie" },
        { icon: BarChart3, name: "Analyse" },
      ]}
    />
  );
}
