import SectorPage from "./SectorPage";
import { Camera, FolderOpen, Users, Receipt, MessageSquare, CalendarDays } from "lucide-react";
import heroImg from "@/assets/sectors/photographe.jpg";

export default function Photographe() {
  return (
    <SectorPage
      sectorLabel="Photographe / Vidéaste"
      title={<>MBA pour les <span className="font-medium text-gradient-neon">Photographes & Vidéastes</span></>}
      subtitle="Gérez vos bookings, galeries clients, contrats et facturation depuis une plateforme unique."
      heroImage={heroImg}
      useCases={[
        { icon: CalendarDays, title: "Bookings & Planning", description: "Gérez vos réservations, séances photo/vidéo et disponibilités depuis un calendrier centralisé." },
        { icon: FolderOpen, title: "Galeries clients", description: "Créez un dossier par shooting avec les détails de la prestation, livrables et contrats signés." },
        { icon: Receipt, title: "Devis & Contrats", description: "Envoyez des devis avec signature électronique, gérez les acomptes et facturez automatiquement." },
        { icon: Users, title: "Espace client", description: "Vos clients suivent l'avancement de leur projet, valident les devis et consultent leurs factures." },
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
