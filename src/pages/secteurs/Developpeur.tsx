import SectorPage from "./SectorPage";
import { Code, FolderOpen, Users, Receipt, MessageSquare, CalendarDays, BarChart3 } from "lucide-react";
import heroImg from "@/assets/sectors/developpeur.jpg";

export default function Developpeur() {
  return (
    <SectorPage
      sectorLabel="Développeur freelance"
      title={<>MBA pour les <span className="font-medium text-gradient-neon">Développeurs freelance</span></>}
      subtitle="Gérez vos projets clients, vos devis et votre facturation depuis un seul outil pensé pour les indépendants du digital."
      heroImage={heroImg}
      useCases={[
        { icon: FolderOpen, title: "Suivi de projets", description: "Créez un dossier par client ou par mission. Suivez l'avancement, les livrables et les échéances depuis un tableau de bord clair." },
        { icon: Receipt, title: "Devis & Facturation", description: "Générez vos devis en quelques clics, convertissez-les en factures et suivez les paiements avec relances automatiques." },
        { icon: Users, title: "Espace client dédié", description: "Vos clients accèdent à leur espace pour suivre l'avancement, valider les devis et consulter leurs factures." },
        { icon: BarChart3, title: "Analyse de performance", description: "Suivez votre chiffre d'affaires, vos projets en cours et votre taux de conversion devis/factures." },
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
