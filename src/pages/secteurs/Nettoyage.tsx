import SectorPage from "./SectorPage";
import { SprayCan, Users, FileText, CalendarDays, Receipt, Package, MessageSquare } from "lucide-react";

export default function Nettoyage() {
  return (
    <SectorPage
      sectorLabel="Entreprises de nettoyage & propreté"
      title={<>MBA pour les <span className="font-medium text-gradient-neon">Entreprises de nettoyage</span></>}
      subtitle="Gérez vos contrats récurrents, planifiez les interventions, suivez votre stock et facturez automatiquement."
      useCases={[
        {
          icon: FileText,
          title: "Contrats récurrents",
          description: "Créez et suivez vos contrats de prestation avec fréquence d'intervention, sites concernés et conditions tarifaires.",
        },
        {
          icon: CalendarDays,
          title: "Planification des interventions",
          description: "Organisez le planning de vos équipes par site et par jour, gérez les remplacements et suivez les heures effectuées.",
        },
        {
          icon: Package,
          title: "Stock produits & matériel",
          description: "Suivez vos consommables (produits d'entretien, matériel) par site, anticipez les réapprovisionnements et maîtrisez vos coûts.",
        },
        {
          icon: Receipt,
          title: "Facturation automatique",
          description: "Générez automatiquement les factures mensuelles selon les contrats en cours, avec détail des interventions réalisées.",
        },
      ]}
      modules={[
        { icon: FileText, name: "Dossiers" },
        { icon: Users, name: "Clients" },
        { icon: CalendarDays, name: "Calendrier" },
        { icon: Package, name: "Stock" },
        { icon: Receipt, name: "Facturation" },
        { icon: MessageSquare, name: "Messagerie" },
      ]}
    />
  );
}
