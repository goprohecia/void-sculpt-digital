import SectorPage from "./SectorPage";
import { Briefcase, FolderOpen, Users, Receipt, MessageSquare, CalendarDays, BarChart3 } from "lucide-react";
import heroImg from "@/assets/sectors/consultant.jpg";

export default function Consultant() {
  return (
    <SectorPage
      sectorLabel="Consultant (marketing, RH)"
      title={<>MBA pour les <span className="font-medium text-gradient-neon">Consultants</span></>}
      subtitle="Gérez vos missions, propositions commerciales et suivi client depuis une plateforme pensée pour le conseil."
      heroImage={heroImg}
      useCases={[
        { icon: FolderOpen, title: "Gestion des missions", description: "Un dossier par mission avec le brief, les livrables, l'avancement et les échéances." },
        { icon: Receipt, title: "Propositions commerciales", description: "Créez des devis professionnels, suivez les signatures et convertissez en factures." },
        { icon: Users, title: "Portefeuille clients", description: "Centralisez vos contacts, historiques de missions et communications par client." },
        { icon: BarChart3, title: "Pilotage d'activité", description: "Tableau de bord avec CA, missions en cours, taux de conversion et prévisionnel." },
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
