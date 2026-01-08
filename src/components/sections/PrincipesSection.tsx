import { motion } from "framer-motion";
import { Eye, Wand2, Gauge, Accessibility, Sparkle } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants, SectionTransition, ParallaxBackground } from "@/components/animations";

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
    title: "Motion maîtrisé",
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
    <SectionTransition className="py-24 md:py-32 relative" parallaxStrength={0.05}>
      <ParallaxBackground speed={0.1}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/3 to-transparent" />
      </ParallaxBackground>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <ScrollReveal variant="fadeInUp">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
              <span className="text-sm font-medium text-blue-400">Nos standards</span>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
              Ce qui fait la{" "}
              <span className="text-gradient-neon">différence.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Des principes non-négociables qui guident chacune de nos réalisations.
            </p>
          </ScrollReveal>
        </div>

        {/* Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto" staggerDelay={0.08} delayStart={0.3}>
          {principes.map((principe) => (
            <motion.div key={principe.title} variants={staggerItemVariants}>
              <div className="group h-full glass-card glass-noise rounded-2xl p-6 md:p-8 text-center transition-all duration-500 hover:border-blue-500/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]">
                {/* Icon */}
                <div className="w-14 h-14 mx-auto rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-blue-500/40 transition-all duration-300">
                  <principe.icon className="h-6 w-6 text-blue-400" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold mb-2">{principe.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{principe.description}</p>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </SectionTransition>
  );
}
