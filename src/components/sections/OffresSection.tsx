import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Star } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants, SectionTransition, ParallaxBackground, Hover3DCard } from "@/components/animations";
interface Pack {
  name: string;
  tagline: string;
  description: string;
  price: string;
  delay?: string;
  features: string[];
  recommended?: boolean;
  tier: "launch" | "studio" | "elite";
}
const packs: Pack[] = [{
  name: "PACK LAUNCH",
  tagline: "Landing / One-page premium",
  description: "Lancer vite, marquer fort.",
  price: "Sur devis",
  delay: "2-3 semaines",
  features: ["Direction artistique + UI premium", "Copy structurel (hero, preuve, CTA)", "Animations légères (micro-interactions)", "Optimisation performance (Core Web Vitals)", "SEO de base + OpenGraph"],
  tier: "launch"
}, {
  name: "PACK STUDIO",
  tagline: "Site multi-pages signature",
  description: "Une présence digitale complète et élégante.",
  price: "Sur devis",
  delay: "4-6 semaines",
  features: ["Design system (typo, couleurs, composants)", "4 à 6 sections/pages clés", "Motion maîtrisé (scroll + reveal)", "Intégrations (formulaire, calendrier, analytics)", "SEO renforcé + structure Hn + maillage"],
  recommended: true,
  tier: "studio"
}, {
  name: "PACK ELITE",
  tagline: "SaaS / Backoffice / Produit",
  description: "Un produit robuste, scalable, premium.",
  price: "Sur devis",
  delay: "8-12 semaines",
  features: ["Discovery + cadrage (user flows)", "UI complexe + états (empty/loading/error)", "Auth / dashboard / backoffice", "Intégrations (API, CRM, paiement)", "Suivi post-livraison (handover + itérations)"],
  tier: "elite"
}];
const tierStyles = {
  launch: {
    border: "border-white/20 hover:border-white/40",
    badge: "bg-white/10 text-white/80",
    glow: "",
    check: "text-white/60"
  },
  studio: {
    border: "border-neon-violet/40 hover:border-neon-violet/60",
    badge: "bg-neon-violet/20 text-neon-violet",
    glow: "shadow-[0_0_60px_-10px_rgba(139,92,246,0.3)]",
    check: "text-neon-violet"
  },
  elite: {
    border: "border-amber-500/30 hover:border-amber-500/50",
    badge: "bg-amber-500/15 text-amber-400",
    glow: "shadow-[0_0_60px_-10px_rgba(245,158,11,0.2)]",
    check: "text-amber-400"
  }
};
export function OffresSection() {
  return <section id="offres">
    <SectionTransition className="py-24 md:py-32 relative" parallaxStrength={0.05}>
      <ParallaxBackground speed={0.15}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-600/8 rounded-full blur-[150px]" />
      </ParallaxBackground>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <ScrollReveal variant="fadeInUp">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
              Nos offres
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">
              Des offres claires.{" "}
              <span className="font-medium text-gradient-neon">Un rendu premium.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">Choisissez un cadre simple, on l'élève au niveau studio : design, motion, performance et finitions.</p>
          </ScrollReveal>
        </div>

        {/* Cards */}
        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto" staggerDelay={0.15} delayStart={0.3}>
          {packs.map(pack => {
            const styles = tierStyles[pack.tier];
            return <motion.div key={pack.name} variants={staggerItemVariants} className="h-full">
                <Hover3DCard rotateStrength={4} className="h-full">
                  <div className={`relative h-full glass-card glass-noise rounded-2xl p-8 md:p-10 transition-all duration-500 ${styles.border} ${styles.glow} ${pack.recommended ? "lg:-translate-y-4 lg:scale-[1.02]" : ""}`}>
                    {/* Recommended Badge */}
                    {pack.recommended && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-neon-violet text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-neon-violet/30">
                        <Star className="h-3 w-3 fill-current" />
                        Recommandé
                      </div>}

                    {/* Header */}
                    <div className="mb-8">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${styles.badge}`}>
                        {pack.name}
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mb-2">{pack.tagline}</h3>
                      <p className="text-muted-foreground">{pack.description}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-8 pb-8 border-b border-white/10">
                      <div className="text-3xl md:text-4xl font-light tracking-tight mb-1">{pack.price}</div>
                      {pack.delay && <p className="text-sm text-muted-foreground font-light">Délai indicatif : {pack.delay}</p>}
                    </div>

                    {/* Features */}
                    <div className="mb-8">
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        Inclus
                      </p>
                      <ul className="space-y-3">
                        {pack.features.map((feature, i) => <li key={i} className="flex items-start gap-3">
                            <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${styles.check}`} />
                            <span className="text-sm text-foreground/90">{feature}</span>
                          </li>)}
                      </ul>
                    </div>

                    {/* CTA */}
                    <Link to={`/contact?subject=Demande%20de%20proposition%20-%20${encodeURIComponent(pack.name)}`} className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${pack.recommended ? "btn-gradient text-white" : "glass-button hover:border-neon-violet/50"}`}>
                      Recevoir une proposition
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </Hover3DCard>
              </motion.div>;
          })}
        </StaggerContainer>
      </div>
    </SectionTransition>
    </section>;
}