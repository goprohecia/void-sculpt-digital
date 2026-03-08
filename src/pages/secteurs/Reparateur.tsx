import SectorPage from "./SectorPage";
import { Smartphone, FolderOpen, Users, Receipt, Package, MessageSquare } from "lucide-react";
import heroImg from "@/assets/sectors/reparateur.jpg";

export default function Reparateur() {
  return (
    <SectorPage
      sectorLabel="Réparateur de téléphones"
      title={<>MBA pour les <span className="font-medium text-gradient-neon">Réparateurs de téléphones</span></>}
      subtitle="Suivez vos réparations, gérez votre stock de pièces détachées et facturez vos clients en toute simplicité."
      heroImage={heroImg}
      useCases={[
        { icon: FolderOpen, title: "Suivi des réparations", description: "Créez un dossier par appareil avec le diagnostic, les pièces utilisées et le statut de la réparation." },
        { icon: Package, title: "Stock de pièces", description: "Gérez votre inventaire de pièces détachées, fournisseurs et alertes de réapprovisionnement." },
        { icon: Users, title: "Fiches clients", description: "Historique complet par client : appareils réparés, devis, factures et communications." },
        { icon: Receipt, title: "Devis & Facturation", description: "Établissez des devis rapides, convertissez en factures et encaissez via Stripe." },
      ]}
      modules={[
        { icon: FolderOpen, name: "Dossiers" },
        { icon: Users, name: "Clients" },
        { icon: Receipt, name: "Facturation" },
        { icon: Package, name: "Stock" },
        { icon: MessageSquare, name: "Messagerie" },
      ]}
    />
  );
}
