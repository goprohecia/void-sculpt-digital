import SectorPage from "./SectorPage";
import { Building2, Users, FileText, Receipt, BarChart3, PenTool, Bell, CalendarDays } from "lucide-react";

export default function Immobilier() {
  return (
    <SectorPage
      sectorLabel="Agences immobilières"
      title={<>MBA pour les <span className="font-medium text-gradient-neon">Agences immobilières</span></>}
      subtitle="Pilotez vos mandats, dossiers acquéreurs et pipeline commercial depuis un tableau de bord centralisé."
      useCases={[
        {
          icon: Building2,
          title: "Suivi des mandats",
          description: "Gérez l'intégralité de vos mandats de vente et de location : statut, documents, visites et offres, tout au même endroit.",
        },
        {
          icon: Users,
          title: "Dossiers acquéreurs & vendeurs",
          description: "Constituez des dossiers complets pour chaque client avec pièces justificatives, historique des échanges et suivi personnalisé.",
        },
        {
          icon: PenTool,
          title: "Signature électronique",
          description: "Faites signer vos devis et compromis directement en ligne grâce à la signature électronique intégrée à MBA.",
        },
        {
          icon: Bell,
          title: "Relances automatiques",
          description: "Ne perdez plus aucun dossier : MBA vous alerte sur les échéances et relance automatiquement les factures impayées.",
        },
      ]}
      modules={[
        { icon: Users, name: "Clients" },
        { icon: FileText, name: "Dossiers" },
        { icon: PenTool, name: "Devis" },
        { icon: Receipt, name: "Facturation" },
        { icon: BarChart3, name: "Analyse" },
        { icon: CalendarDays, name: "Rendez-vous" },
      ]}
    />
  );
}
