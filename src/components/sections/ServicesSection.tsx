import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Smartphone, Database, Layers, ArrowRight } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants, SectionTransition } from "@/components/animations";

const services = [
  {
    icon: Globe,
    title: "Sites Web",
    description: "De la vitrine épurée au e-commerce puissant.",
    href: "/services/web",
  },
  {
    icon: Smartphone,
    title: "Apps Mobiles",
    description: "Expériences natives iOS & Android.",
    href: "/services/mobile",
  },
  {
    icon: Database,
    title: "Backoffice",
    description: "Dashboards et outils sur-mesure.",
    href: "/services/backoffice",
  },
  {
    icon: Layers,
    title: "Écosystème 360°",
    description: "Solutions complètes multi-plateformes.",
    href: "/services/360",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <ScrollReveal variant="fadeInUp">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
              Services
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              Nos <span className="font-medium text-gradient-neon">expertises</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-muted-foreground font-light">
              Du concept à la production, nous maîtrisons l'ensemble de la chaîne digitale.
            </p>
          </ScrollReveal>
        </div>

        {/* Grid */}
        <StaggerContainer 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto" 
          staggerDelay={0.08}
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={staggerItemVariants}>
              <Link
                to={service.href}
                className="group block h-full p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="h-5 w-5 text-violet-400" />
                </div>
                
                <h3 className="text-lg font-medium mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                
                <div className="flex items-center gap-2 text-sm text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Découvrir</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
