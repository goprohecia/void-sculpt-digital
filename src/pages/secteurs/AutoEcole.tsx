import SectorPage from "./SectorPage";
import { Car, Users, Receipt, CalendarDays, FileText, BarChart3 } from "lucide-react";
import heroImg from "@/assets/sectors/auto-ecole.jpg";

export default function AutoEcole() {
  return (
    <SectorPage
      sectorLabel="Auto-École"
      title={<>MBA pour les <span className="font-medium text-gradient-neon">Auto-Écoles</span></>}
      subtitle="Gérez vos élèves, plannings de conduite, examens et facturation dans un seul outil adapté à votre métier."
      heroImage={heroImg}
      useCases={[
        { icon: Users, title: "Gestion des élèves", description: "Fiches élèves complètes avec progression, heures de conduite effectuées, résultats d'examens et documents administratifs." },
        { icon: CalendarDays, title: "Planning de conduite", description: "Planifiez les leçons de conduite, gérez les disponibilités des moniteurs et optimisez l'utilisation des véhicules." },
        { icon: Car, title: "Suivi des véhicules", description: "Gérez votre flotte : kilométrage, entretiens, contrôles techniques et affectation des véhicules aux moniteurs." },
        { icon: FileText, title: "Examens & Résultats", description: "Suivez les inscriptions aux examens (code et conduite), les résultats et le taux de réussite de votre auto-école." },
      ]}
      modules={[
        { icon: Users, name: "Clients" },
        { icon: CalendarDays, name: "Rendez-vous" },
        { icon: FileText, name: "Dossiers" },
        { icon: Receipt, name: "Facturation" },
        { icon: BarChart3, name: "Analyse" },
        { icon: Car, name: "Stock" },
      ]}
    />
  );
}
