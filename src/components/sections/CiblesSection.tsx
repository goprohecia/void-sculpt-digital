import { motion } from "framer-motion";
import { Monitor, Briefcase, ShoppingBag } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants, SectionTransition } from "@/components/animations";

const cibles = [
  {
    icon: Monitor,
    title: "Tech & Digital",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    dotBg: "bg-blue-500/40",
    metiers: ["Développeur freelance", "Designer / Motion", "Photographe / Vidéaste", "Community Manager", "Réparateur de téléphones"],
  },
  {
    icon: Briefcase,
    title: "Services & Conseil",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    dotBg: "bg-emerald-500/40",
    metiers: ["Consultant (marketing, RH)", "Coach sportif / Personal trainer", "Agent immobilier indépendant", "Conciergerie Airbnb", "Formateur indépendant"],
  },
  {
    icon: ShoppingBag,
    title: "Commerce & Événementiel",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    dotBg: "bg-amber-500/40",
    metiers: ["Gérant de boutique", "Organisateur d'événements", "Wedding planner", "Traiteur indépendant", "DJ / Animateur"],
  },
];

export function CiblesSection() {
  return (
    <section id="cibles" className="bg-[#F6F5F2]">
      <SectionTransition className="py-24 md:py-32 relative" parallaxStrength={0.05}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <ScrollReveal variant="fadeInUp">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6">Nos cibles</p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-light mb-6 text-gray-900">
                Conçu pour les{" "}
                <span className="font-medium text-gradient-neon">professionnels exigeants.</span>
              </h2>
            </ScrollReveal>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto" staggerDelay={0.12} delayStart={0.2}>
            {cibles.map((c) => (
              <motion.div key={c.title} variants={staggerItemVariants}>
                <div className="h-full p-6 sm:p-8 rounded-2xl border border-gray-200 bg-gray-50 hover:border-[#22c55e]/30 transition-all duration-500">
                  <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mb-5`}>
                    <c.icon className={`h-5 w-5 ${c.color}`} />
                  </div>
                  <h3 className="text-lg font-medium mb-4 text-gray-900">{c.title}</h3>
                  <ul className="space-y-2">
                    {c.metiers.map((m) => (
                      <li key={m} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${c.dotBg}`} />
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
