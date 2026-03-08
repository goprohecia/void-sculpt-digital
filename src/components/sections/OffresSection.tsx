import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Star, Zap, Shield, Users, Globe, FileSignature, CreditCard, Headphones } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants, SectionTransition, ParallaxBackground, Hover3DCard } from "@/components/animations";

type Tier = "starter" | "business" | "enterprise";

interface Pack {
  name: string;
  tier: Tier;
  tagline: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  modulesLimit: string;
  features: string[];
  recommended?: boolean;
}

const packs: Pack[] = [
  {
    name: "STARTER",
    tier: "starter",
    tagline: "L'essentiel pour démarrer",
    description: "Lancez votre gestion avec les fondamentaux.",
    priceMonthly: 150,
    priceAnnual: 1500, // 10 months = 2 free
    modulesLimit: "3 modules au choix",
    features: [
      "3 modules activables au choix",
      "Espace admin + client + salarié",
      "Sous-domaine personnalisé",
      "Multi-utilisateurs illimités",
      "Support par email",
    ],
  },
  {
    name: "BUSINESS",
    tier: "business",
    tagline: "La puissance pour scaler",
    description: "Plus de modules, plus de contrôle.",
    priceMonthly: 250,
    priceAnnual: 2500,
    modulesLimit: "6 modules au choix",
    features: [
      "6 modules activables au choix",
      "Tout le plan Starter inclus",
      "Appel d'onboarding inclus",
      "Signature électronique intégrée",
      "Stripe Connect pour les paiements",
      "Support prioritaire",
    ],
    recommended: true,
  },
  {
    name: "ENTERPRISE",
    tier: "enterprise",
    tagline: "Votre CRM, votre marque",
    description: "Personnalisation totale, accès illimité.",
    priceMonthly: 400,
    priceAnnual: 4000,
    modulesLimit: "Tous les modules",
    features: [
      "Accès illimité à tous les modules",
      "Tout le plan Business inclus",
      "White Label — votre logo & couleurs",
      "Espaces personnalisables (renommage)",
      "Modules sur mesure (sur devis)",
      "Appel d'onboarding dédié",
      "Account manager dédié",
    ],
  },
];

const tierStyles = {
  starter: {
    border: "border-white/20 hover:border-white/40",
    badge: "bg-white/10 text-white/80",
    glow: "",
    check: "text-white/60",
  },
  business: {
    border: "border-neon-violet/40 hover:border-neon-violet/60",
    badge: "bg-neon-violet/20 text-neon-violet",
    glow: "shadow-[0_0_60px_-10px_rgba(139,92,246,0.3)]",
    check: "text-neon-violet",
  },
  enterprise: {
    border: "border-amber-500/30 hover:border-amber-500/50",
    badge: "bg-amber-500/15 text-amber-400",
    glow: "shadow-[0_0_60px_-10px_rgba(245,158,11,0.2)]",
    check: "text-amber-400",
  },
};

const includedForAll = [
  { icon: Globe, label: "Sous-domaine personnalisé" },
  { icon: Users, label: "Multi-utilisateurs illimités" },
  { icon: FileSignature, label: "Signature électronique" },
  { icon: CreditCard, label: "Stripe Connect" },
  { icon: Shield, label: "Hébergement sécurisé" },
  { icon: Headphones, label: "Support réactif" },
];

export function OffresSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="offres">
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
              <h2 className="text-3xl md:text-4xl font-light mb-6">
                Un CRM modulaire.{" "}
                <span className="font-medium text-gradient-neon">À votre image.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="text-muted-foreground font-light mb-8">
                Choisissez votre plan, activez vos modules, gérez votre activité. Simple.
              </p>
            </ScrollReveal>

            {/* Annual/Monthly toggle */}
            <ScrollReveal variant="fadeInUp" delay={0.3}>
              <div className="inline-flex items-center gap-3 rounded-full glass-card glass-noise px-2 py-1.5">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !isAnnual ? "bg-neon-violet text-white shadow-lg shadow-neon-violet/30" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Mensuel
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isAnnual ? "bg-neon-violet text-white shadow-lg shadow-neon-violet/30" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Annuel
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                    -2 mois
                  </span>
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Cards */}
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto" staggerDelay={0.15} delayStart={0.3}>
            {packs.map((pack) => {
              const styles = tierStyles[pack.tier];
              const price = isAnnual ? pack.priceAnnual : pack.priceMonthly;
              const priceLabel = isAnnual ? "/an" : "/mois";

              return (
                <motion.div key={pack.name} variants={staggerItemVariants} className="h-full">
                  <Hover3DCard rotateStrength={4} className="h-full">
                    <div
                      className={`relative h-full glass-card glass-noise rounded-2xl p-8 md:p-10 transition-all duration-500 ${styles.border} ${styles.glow} ${
                        pack.recommended ? "lg:-translate-y-4 lg:scale-[1.02]" : ""
                      }`}
                    >
                      {/* Recommended Badge */}
                      {pack.recommended && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-neon-violet text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-neon-violet/30">
                          <Star className="h-3 w-3 fill-current" />
                          Recommandé
                        </div>
                      )}

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
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl md:text-4xl font-light tracking-tight">{price}€</span>
                          <span className="text-muted-foreground text-sm">{priceLabel} HT</span>
                        </div>
                        <p className="text-sm text-muted-foreground font-light mt-1 flex items-center gap-1.5">
                          <Zap className="h-3.5 w-3.5 text-neon-violet" />
                          {pack.modulesLimit}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="mb-8">
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                          Inclus
                        </p>
                        <ul className="space-y-3">
                          {pack.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${styles.check}`} />
                              <span className="text-sm text-foreground/90">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA */}
                      <Link
                        to={`/contact?subject=Abonnement%20MBA%20-%20${encodeURIComponent(pack.name)}`}
                        className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                          pack.recommended ? "btn-gradient text-white" : "glass-button hover:border-neon-violet/50"
                        }`}
                      >
                        {pack.tier === "enterprise" ? "Nous contacter" : "Commencer maintenant"}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </Hover3DCard>
                </motion.div>
              );
            })}
          </StaggerContainer>

          {/* Included in all plans */}
          <ScrollReveal variant="fadeInUp" delay={0.5}>
            <div className="mt-16 md:mt-20 text-center max-w-4xl mx-auto">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
                Inclus dans toutes les offres
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {includedForAll.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl glass-card glass-noise border border-white/10"
                  >
                    <item.icon className="h-5 w-5 text-neon-violet" />
                    <span className="text-xs text-center text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </SectionTransition>
    </section>
  );
}
