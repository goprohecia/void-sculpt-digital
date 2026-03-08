import SectorPage from "./SectorPage";
import { Music, FolderOpen, Users, Receipt, CalendarDays, MessageSquare } from "lucide-react";
import heroImg from "@/assets/sectors/dj.jpg";

export default function DjAnimateur() {
  return (
    <SectorPage
      sectorLabel="DJ / Animateur"
      title={<>MBA pour les <span className="font-medium text-gradient-neon">DJ & Animateurs</span></>}
      subtitle="Gérez vos bookings, contrats, calendrier et facturation depuis un outil pensé pour les artistes indépendants."
      heroImage={heroImg}
      useCases={[
        { icon: CalendarDays, title: "Bookings & Calendrier", description: "Visualisez vos dates réservées, disponibilités et gérez les demandes de prestation." },
        { icon: FolderOpen, title: "Contrats & Riders", description: "Centralisez les contrats, riders techniques et détails de chaque prestation dans un dossier." },
        { icon: Receipt, title: "Devis & Facturation", description: "Envoyez des devis professionnels, gérez les acomptes et facturez automatiquement." },
        { icon: Users, title: "Carnet de contacts", description: "Historique complet par client : événements passés, préférences et communications." },
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
