import SectorPage from "./SectorPage";
import { Scale, Users, FileText, Receipt, CalendarDays, MessageSquare, BarChart3 } from "lucide-react";
import heroImg from "@/assets/sectors/cabinets.jpg";

export default function Cabinets() {
  return (
    <SectorPage
      sectorLabel="Cabinets comptables & juridiques"
      title={<>MBA pour les <span className="font-medium text-gradient-neon">Cabinets comptables & juridiques</span></>}
      subtitle="Centralisez vos dossiers clients, échéances légales, facturation récurrente et échanges sécurisés."
      heroImage={heroImg}
      useCases={[
        { icon: FileText, title: "Dossiers clients structurés", description: "Organisez chaque dossier avec les pièces justificatives, documents comptables ou juridiques, et un historique complet des actions menées." },
        { icon: CalendarDays, title: "Suivi des échéances", description: "Ne manquez plus aucune date limite : déclarations fiscales, dépôts de comptes, audiences. MBA vous alerte automatiquement." },
        { icon: Receipt, title: "Facturation récurrente", description: "Automatisez la facturation de vos honoraires mensuels ou trimestriels avec génération et envoi automatique des factures." },
        { icon: MessageSquare, title: "Messagerie sécurisée", description: "Échangez avec vos clients via une messagerie intégrée et sécurisée, avec pièces jointes et historique consultable à tout moment." },
      ]}
      modules={[
        { icon: Users, name: "Clients" },
        { icon: FileText, name: "Dossiers" },
        { icon: Receipt, name: "Facturation" },
        { icon: CalendarDays, name: "Calendrier" },
        { icon: MessageSquare, name: "Messagerie" },
        { icon: BarChart3, name: "Analyse" },
      ]}
    />
  );
}
