import SectorPage from "./SectorPage";
import { Palette, FolderOpen, Users, Receipt, MessageSquare, CalendarDays } from "lucide-react";
import heroImg from "@/assets/sectors/designer.jpg";

export default function Designer() {
  return (
    <SectorPage
      sectorLabel="Designer / Motion"
      title={<>MBA pour les <span className="font-medium text-gradient-neon">Designers & Motion designers</span></>}
      subtitle="Organisez vos briefs clients, vos livrables créatifs et votre facturation dans un espace centralisé."
      heroImage={heroImg}
      useCases={[
        { icon: FolderOpen, title: "Gestion des briefs", description: "Centralisez les briefs créatifs, les moodboards et les retours clients dans un dossier unique par projet." },
        { icon: Users, title: "Relation client", description: "Partagez les avancements avec vos clients via leur espace dédié. Validations et feedbacks simplifiés." },
        { icon: Receipt, title: "Devis & Factures", description: "Créez des devis détaillés par prestation, suivez les acomptes et générez vos factures automatiquement." },
        { icon: CalendarDays, title: "Planning projets", description: "Visualisez vos deadlines, planifiez vos sessions créatives et gérez votre charge de travail." },
      ]}
      modules={[
        { icon: FolderOpen, name: "Dossiers" },
        { icon: Users, name: "Clients" },
        { icon: Receipt, name: "Facturation" },
        { icon: MessageSquare, name: "Messagerie" },
        { icon: CalendarDays, name: "Rendez-vous" },
      ]}
    />
  );
}
