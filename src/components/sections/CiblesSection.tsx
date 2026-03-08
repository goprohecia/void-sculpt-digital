import { motion } from "framer-motion";
import { Monitor, Briefcase, ShoppingBag } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants, SectionTransition, ParallaxBackground } from "@/components/animations";

const cibles = [
  {
    icon: Monitor,
    title: "Tech & Digital",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    metiers: ["Agences web", "Freelances dev/design", "SaaS B2B", "Startups tech", "Studios créatifs"],
  },
  {
    icon: Briefcase,
    title: "Services & Conseil",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    metiers: ["Cabinets conseil", "Comptables / RH", "Architectes", "Avocats", "Conciergeries"],
  },
  {
    icon: ShoppingBag,
    title: "Commerce & Événementiel",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    metiers: ["Wedding planners", "Salons de coiffure", "Garages auto", "BTP / artisans", "Nettoyage"],
  },
];

export function CiblesSection() {
  return (
    <section id="cibles">
      <SectionTransition className="py-24 md:py-32 relative" parallaxStrength={0.05}>
        <ParallaxBackground speed={0.1}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/3 to-transparent" />
        </ParallaxBackground>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <ScrollReveal variant="fadeInUp">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Nos cibles</p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-light mb-6">
                Conçu pour les{" "}
                <span className="font-medium text-gradient-neon">professionnels exigeants.</span>
              </h2>
            </ScrollReveal>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto" staggerDelay={0.12} delayStart={0.2}>
            {cibles.map((c) => (
              <motion.div key={c.title} variants={staggerItemVariants}>
                <div className="h-full p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-500">
                  <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mb-5`}>
                    <c.icon className={`h-5 w-5 ${c.color}`} />
                  </div>
                  <h3 className="text-lg font-medium mb-4">{c.title}</h3>
                  <ul className="space-y-2">
                    {c.metiers.map((m) => (
                      <li key={m} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${c.bg.replace("/10", "/40")}`} />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </SectionTransition>
    </section>
  );
}
