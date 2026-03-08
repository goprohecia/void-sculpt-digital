import SectorPage from "./SectorPage";
import { ShoppingBag, FolderOpen, Users, Receipt, Package, MessageSquare, BarChart3 } from "lucide-react";
import heroImg from "@/assets/sectors/boutique.jpg";

export default function Boutique() {
  return (
    <SectorPage
      sectorLabel="Gérant de boutique"
      title={<>MBA pour les <span className="font-medium text-gradient-neon">Gérants de boutique</span></>}
      subtitle="Gérez votre stock, vos ventes, vos fiches clients et votre caisse depuis un outil tout-en-un."
      heroImage={heroImg}
      useCases={[
        { icon: Package, title: "Gestion du stock", description: "Suivez vos produits en temps réel, gérez les fournisseurs et les alertes de réapprovisionnement." },
        { icon: Users, title: "Fichier clients", description: "Historique d'achats, préférences, programme fidélité et communications personnalisées." },
        { icon: Receipt, title: "Ventes & Facturation", description: "Créez des factures, suivez les encaissements et analysez vos ventes par période." },
        { icon: BarChart3, title: "Analyse des ventes", description: "Tableaux de bord avec CA, meilleures ventes, marges et tendances." },
      ]}
      modules={[
        { icon: Users, name: "Clients" },
        { icon: Package, name: "Stock" },
        { icon: Receipt, name: "Facturation" },
        { icon: MessageSquare, name: "Messagerie" },
        { icon: BarChart3, name: "Analyse" },
      ]}
    />
  );
}
