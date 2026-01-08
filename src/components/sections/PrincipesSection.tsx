import { motion } from "framer-motion";
import { Eye, Wand2, Gauge, Accessibility, Sparkle } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants } from "@/components/animations";

const principes = [
  {
    icon: Eye,
    title: "Lisibilité",
    description: "Clarté absolue. Chaque élément a sa raison d'être.",
  },
  {
    icon: Wand2,
    title: "Finition",
    description: "Le diable est dans les détails. Nous les soignons.",
  },
  {
    icon: Gauge,
    title: "Performance",
    description: "Core Web Vitals optimisés. Vitesse = conversion.",
  },
  {
    icon: Sparkle,
    title: "Motion",
    description: "Animations subtiles. Jamais gratuites, toujours intentionnelles.",
  },
  {
    icon: Accessibility,
    title: "Accessibilité",
    description: "Un web inclusif. WCAG et bonnes pratiques.",
  },
];

export function PrincipesSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <ScrollReveal variant="fadeInUp">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
              Standards
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              Ce qui fait la <span className="font-medium text-gradient-neon">différence</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-muted-foreground font-light">
              Des principes non-négociables qui guident chacune de nos réalisations.
            </p>
          </ScrollReveal>
        </div>

        {/* Grid */}
        <StaggerContainer 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-5xl mx-auto" 
          staggerDelay={0.08}
        >
          {principes.map((principe) => (
            <motion.div key={principe.title} variants={staggerItemVariants}>
              <div className="group h-full p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-500 text-center">
                {/* Icon */}
                <div className="w-12 h-12 mx-auto rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <principe.icon className="h-5 w-5 text-violet-400" />
                </div>

                {/* Content */}
                <h3 className="text-base font-medium mb-2">{principe.title}</h3>
                <p className="text-sm text-muted-foreground">{principe.description}</p>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
