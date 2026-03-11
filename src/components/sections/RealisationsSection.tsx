import { motion } from "framer-motion";
import { LayoutDashboard, Users, UserCheck, FolderOpen, Receipt, MessageSquare, LifeBuoy, Package, BarChart3, CalendarDays, Bell, Mail } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants, SectionTransition } from "@/components/animations";

const modules = [
  { icon: LayoutDashboard, title: "Vue d'ensemble", description: "Dashboard centralisé avec KPIs et vue globale de votre activité.", color: "text-gray-900" },
  { icon: Users, title: "Gestion clients", description: "Fiches clients complètes, tags, segmentation et historique.", color: "text-[#22c55e]" },
  { icon: UserCheck, title: "Salariés", description: "Gestion des équipes, droits d'accès et assignation aux dossiers.", color: "text-[#16a34a]" },
  { icon: FolderOpen, title: "Dossiers", description: "Suivi des projets, échéances, assignation aux salariés.", color: "text-[#22c55e]" },
  { icon: Receipt, title: "Facturation", description: "Devis, factures, relances automatiques et signature électronique.", color: "text-[#22c55e]" },
  { icon: MessageSquare, title: "Messagerie", description: "Communication centralisée entre admin, clients et équipes.", color: "text-amber-500" },
  { icon: CalendarDays, title: "Rendez-vous", description: "Prise de rendez-vous en ligne, synchronisation calendrier.", color: "text-[#16a34a]" },
  { icon: Bell, title: "Relances", description: "Relances automatiques par email, suivi des échéances de paiement.", color: "text-orange-500" },
  { icon: Mail, title: "Emails", description: "Templates personnalisables, historique d'envois et logs.", color: "text-[#22c55e]" },
  { icon: LifeBuoy, title: "Support", description: "Tickets de support avec suivi des priorités et résolutions.", color: "text-rose-500" },
  { icon: Package, title: "Stock", description: "Gestion des produits, fournisseurs, mouvements et alertes.", color: "text-cyan-500" },
  { icon: BarChart3, title: "Analyse", description: "Tableaux de bord, KPIs et rapports de performance.", color: "text-[#22c55e]" },
];

export function RealisationsSection() {
  return (
    <section id="fonctionnalites" className="bg-white">
      <SectionTransition className="py-24 md:py-32 relative" parallaxStrength={0.05}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
            <ScrollReveal variant="fadeInUp">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6">
                Fonctionnalités
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-light mb-6 text-gray-900">
                Tous les outils pour{" "}
                <span className="font-medium text-gradient-neon">votre activité.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="text-gray-600 font-light">
                Activez uniquement les modules dont vous avez besoin. Évoluez à votre rythme.
              </p>
            </ScrollReveal>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto" staggerDelay={0.08} delayStart={0.3}>
            {modules.map((mod) => (
              <motion.div key={mod.title} variants={staggerItemVariants}>
                <div className="group h-full p-6 rounded-2xl border border-gray-200 bg-gray-50 hover:border-[#22c55e]/30 transition-all duration-500">
                  <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <mod.icon className={`h-5 w-5 ${mod.color}`} />
                  </div>
                  <h3 className="text-base font-medium mb-2 text-gray-900">{mod.title}</h3>
                  <p className="text-sm text-gray-600">{mod.description}</p>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </SectionTransition>
    </section>
  );
}
