import SectorPage from "./SectorPage";
import { Dumbbell, FolderOpen, Users, Receipt, CalendarDays, MessageSquare } from "lucide-react";
import heroImg from "@/assets/sectors/coach-sportif.jpg";

export default function CoachSportif() {
  return (
    <SectorPage
      sectorLabel="Coach sportif / Personal trainer"
      title={<>MBA pour les <span className="font-medium text-gradient-neon">Coachs sportifs</span></>}
      subtitle="Planifiez vos séances, gérez vos clients et facturez vos prestations depuis un seul outil."
      heroImage={heroImg}
      useCases={[
        { icon: CalendarDays, title: "Planning des séances", description: "Gérez votre calendrier de séances, disponibilités et réservations en ligne pour vos clients." },
        { icon: Users, title: "Fiches clients", description: "Profils détaillés avec objectifs, historique des séances, programme personnalisé et suivi." },
        { icon: Receipt, title: "Forfaits & Facturation", description: "Créez des packs de séances, gérez les abonnements et facturez automatiquement." },
        { icon: MessageSquare, title: "Communication", description: "Échangez avec vos clients, envoyez des rappels de séances et partagez des programmes." },
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
