import { motion } from "framer-motion";
import { LayoutDashboard, Users, UserCheck, FolderOpen, Receipt, MessageSquare, LifeBuoy, Package, BarChart3, CalendarDays, Bell, Mail } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants, SectionTransition, ParallaxBackground } from "@/components/animations";

const modules = [
  { icon: LayoutDashboard, title: "Vue d'ensemble", description: "Dashboard centralisé avec KPIs et vue globale de votre activité.", color: "text-white" },
  { icon: Users, title: "Gestion clients", description: "Fiches clients complètes, tags, segmentation et historique.", color: "text-neon-violet" },
  { icon: UserCheck, title: "Salariés", description: "Gestion des équipes, droits d'accès et assignation aux dossiers.", color: "text-indigo-400" },
  { icon: FolderOpen, title: "Dossiers", description: "Suivi des projets, échéances, assignation aux salariés.", color: "text-blue-400" },
  { icon: Receipt, title: "Facturation", description: "Devis, factures, relances automatiques et signature électronique.", color: "text-emerald-400" },
  { icon: MessageSquare, title: "Messagerie", description: "Communication centralisée entre admin, clients et équipes.", color: "text-amber-400" },
  { icon: CalendarDays, title: "Rendez-vous", description: "Prise de rendez-vous en ligne, synchronisation calendrier.", color: "text-sky-400" },
  { icon: Bell, title: "Relances", description: "Relances automatiques par email, suivi des échéances de paiement.", color: "text-orange-400" },
  { icon: Mail, title: "Emails", description: "Templates personnalisables, historique d'envois et logs.", color: "text-pink-400" },
  { icon: LifeBuoy, title: "Support", description: "Tickets de support avec suivi des priorités et résolutions.", color: "text-rose-400" },
  { icon: Package, title: "Stock", description: "Gestion des produits, fournisseurs, mouvements et alertes.", color: "text-cyan-400" },
  { icon: BarChart3, title: "Analyse", description: "Tableaux de bord, KPIs et rapports de performance.", color: "text-purple-400" },
];

export function RealisationsSection() {
  return (
    <section id="fonctionnalites">
      <SectionTransition className="py-24 md:py-32 relative" parallaxStrength={0.05}>
        <ParallaxBackground speed={0.2}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[180px]" />
        </ParallaxBackground>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
            <ScrollReveal variant="fadeInUp">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
                Fonctionnalités
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-light mb-6">
                Tous les outils pour{" "}
                <span className="font-medium text-gradient-neon">votre activité.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="text-muted-foreground font-light">
                Activez uniquement les modules dont vous avez besoin. Évoluez à votre rythme.
              </p>
            </ScrollReveal>
          </div>

          {/* Modules Grid */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto" staggerDelay={0.08} delayStart={0.3}>
            {modules.map((mod) => (
              <motion.div key={mod.title} variants={staggerItemVariants}>
                <div className="group h-full p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-500">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <mod.icon className={`h-5 w-5 ${mod.color}`} />
                  </div>
                  <h3 className="text-base font-medium mb-2">{mod.title}</h3>
                  <p className="text-sm text-muted-foreground">{mod.description}</p>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </SectionTransition>
    </section>
  );
}
