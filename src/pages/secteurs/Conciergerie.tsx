import SectorPage from "./SectorPage";
import { Home, Users, FileText, MessageSquare, HeadphonesIcon, Wrench, CalendarDays, Receipt } from "lucide-react";
import heroImg from "@/assets/sectors/conciergerie.jpg";

export default function Conciergerie() {
  return (
    <SectorPage
      sectorLabel="Conciergerie & Gestion locative"
      title={<>MBA pour la <span className="font-medium text-gradient-neon">Conciergerie & Gestion locative</span></>}
      subtitle="Centralisez la gestion de vos biens, locataires et interventions dans une plateforme unique et intuitive."
      heroImage={heroImg}
      useCases={[
        { icon: Home, title: "Gestion des biens", description: "Suivez chaque propriété avec ses caractéristiques, documents et historique d'interventions. Organisez votre parc immobilier en quelques clics." },
        { icon: Users, title: "Suivi des locataires", description: "Centralisez les informations de vos locataires, contrats de bail, états des lieux et communications dans un dossier unique." },
        { icon: Wrench, title: "Gestion des interventions", description: "Créez et assignez des interventions techniques, suivez leur avancement et gardez un historique complet pour chaque bien." },
        { icon: Receipt, title: "Facturation propriétaires", description: "Générez automatiquement les factures pour vos propriétaires avec le détail des prestations, commissions et charges refacturées." },
      ]}
      modules={[
        { icon: FileText, name: "Dossiers" },
        { icon: Users, name: "Clients" },
        { icon: Receipt, name: "Facturation" },
        { icon: MessageSquare, name: "Messagerie" },
        { icon: HeadphonesIcon, name: "Support" },
        { icon: CalendarDays, name: "Rendez-vous" },
      ]}
    />
  );
}
