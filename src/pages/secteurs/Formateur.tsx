import SectorPage from "./SectorPage";
import { GraduationCap, FolderOpen, Users, Receipt, CalendarDays, MessageSquare } from "lucide-react";
import heroImg from "@/assets/sectors/formateur.jpg";

export default function Formateur() {
  return (
    <SectorPage
      sectorLabel="Formateur indépendant"
      title={<>MBA pour les <span className="font-medium text-gradient-neon">Formateurs indépendants</span></>}
      subtitle="Gérez vos sessions de formation, inscriptions, conventions et facturation depuis un outil centralisé."
      heroImage={heroImg}
      useCases={[
        { icon: FolderOpen, title: "Sessions de formation", description: "Créez et gérez vos sessions avec les détails : programme, dates, lieu, nombre de participants." },
        { icon: Users, title: "Gestion des stagiaires", description: "Inscriptions, conventions de formation, attestations et suivi par participant." },
        { icon: Receipt, title: "Facturation & Conventions", description: "Générez conventions, devis et factures. Suivez les paiements OPCO et directs." },
        { icon: CalendarDays, title: "Planning formations", description: "Calendrier de vos sessions, disponibilités et gestion multi-sites." },
      ]}
      modules={[
        { icon: FolderOpen, name: "Dossiers" },
        { icon: Users, name: "Clients" },
        { icon: Receipt, name: "Facturation" },
        { icon: CalendarDays, name: "Rendez-vous" },
        { icon: MessageSquare, name: "Messagerie" },
      ]}
    />
  );
}
