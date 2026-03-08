import SectorPage from "./SectorPage";
import { Heart, Users, ShoppingBag, CalendarDays, Receipt, FileText, MessageSquare } from "lucide-react";

export default function Mariage() {
  return (
    <SectorPage
      sectorLabel="Boutiques de mariage"
      title={<>MBA pour les <span className="font-medium text-gradient-neon">Boutiques de mariage</span></>}
      subtitle="Gérez vos mariées, essayages, stock de robes et accessoires, et facturez avec acomptes depuis une plateforme unique."
      useCases={[
        {
          icon: Users,
          title: "Fiches mariées personnalisées",
          description: "Créez un dossier par mariée avec mensurations, préférences de style, photos d'essayages et historique complet des échanges.",
        },
        {
          icon: ShoppingBag,
          title: "Stock robes & accessoires",
          description: "Suivez votre inventaire de robes, voiles, accessoires et bijoux en temps réel. Gérez les modèles en exposition et les commandes spéciales.",
        },
        {
          icon: CalendarDays,
          title: "Planning essayages & retouches",
          description: "Planifiez les rendez-vous d'essayage, les sessions de retouches et les livraisons finales sur un calendrier visuel partagé.",
        },
        {
          icon: Receipt,
          title: "Devis & facturation avec acomptes",
          description: "Générez des devis détaillés et gérez les paiements en plusieurs fois avec suivi des acomptes et soldes restants.",
        },
      ]}
      modules={[
        { icon: FileText, name: "Dossiers" },
        { icon: Users, name: "Clients" },
        { icon: ShoppingBag, name: "Stock" },
        { icon: CalendarDays, name: "Rendez-vous" },
        { icon: Receipt, name: "Facturation" },
        { icon: MessageSquare, name: "Messagerie" },
      ]}
    />
  );
}
