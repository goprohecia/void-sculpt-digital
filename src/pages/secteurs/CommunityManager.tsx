import SectorPage from "./SectorPage";
import { Users, FolderOpen, Receipt, MessageSquare, CalendarDays, BarChart3 } from "lucide-react";
import heroImg from "@/assets/sectors/community-manager.jpg";

export default function CommunityManager() {
  return (
    <SectorPage
      sectorLabel="Community Manager"
      title={<>MBA pour les <span className="font-medium text-gradient-neon">Community Managers</span></>}
      subtitle="Gérez vos clients, plannings éditoriaux et reporting depuis un outil centralisé."
      heroImage={heroImg}
      useCases={[
        { icon: Users, title: "Gestion multi-clients", description: "Centralisez tous vos clients avec leurs accès, briefs et historiques de collaboration." },
        { icon: FolderOpen, title: "Suivi des prestations", description: "Un dossier par client avec le détail des missions, livrables et calendrier éditorial." },
        { icon: BarChart3, title: "Reporting", description: "Suivez vos performances par client, votre chiffre d'affaires et vos heures facturées." },
        { icon: Receipt, title: "Facturation récurrente", description: "Automatisez vos factures mensuelles, gérez les forfaits et suivez les paiements." },
      ]}
      modules={[
        { icon: FolderOpen, name: "Dossiers" },
        { icon: Users, name: "Clients" },
        { icon: Receipt, name: "Facturation" },
        { icon: MessageSquare, name: "Messagerie" },
        { icon: CalendarDays, name: "Rendez-vous" },
        { icon: BarChart3, name: "Analyse" },
      ]}
    />
  );
}
