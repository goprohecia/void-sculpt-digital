import { motion } from "framer-motion";
import { UserPlus, Settings, Users, Rocket } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants } from "@/components/animations";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Inscription",
    description: "Créez votre compte en quelques clics et choisissez votre plan.",
    deliverable: "Accès immédiat",
  },
  {
    icon: Settings,
    number: "02",
    title: "Configuration",
    description: "Activez les modules dont vous avez besoin et personnalisez vos espaces.",
    deliverable: "CRM prêt à l'emploi",
  },
  {
    icon: Users,
    number: "03",
    title: "Équipe",
    description: "Invitez vos collaborateurs et attribuez les accès par rôle.",
    deliverable: "Équipe opérationnelle",
  },
  {
    icon: Rocket,
    number: "04",
    title: "C'est parti !",
    description: "Gérez vos clients, dossiers et factures depuis un seul outil.",
    deliverable: "Activité simplifiée",
  },
];

export function MethodeSection() {
  return (
    <section id="methode" className="py-24 relative bg-white">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <ScrollReveal variant="fadeInUp">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6">
              Comment ça marche
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-light mb-6 text-gray-900">
              Opérationnel en{" "}
              <span className="font-medium text-gradient-neon">4 étapes</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-gray-600 font-light">
              De l'inscription à la gestion quotidienne, tout est pensé pour aller vite.
            </p>
          </ScrollReveal>
        </div>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          staggerDelay={0.1}
        >
          {steps.map((step) => (
            <motion.div key={step.number} variants={staggerItemVariants}>
              <div className="group h-full p-6 sm:p-8 rounded-2xl border border-gray-200 bg-gray-50 hover:border-[#22c55e]/30 transition-all duration-500">
                <div className="text-3xl font-light text-gradient-neon mb-4">{step.number}</div>
                <div className="w-10 h-10 rounded-lg bg-[#22c55e]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="h-4 w-4 text-[#22c55e]" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{step.description}</p>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-400">Résultat</p>
                  <p className="text-sm font-medium text-[#22c55e]">{step.deliverable}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
