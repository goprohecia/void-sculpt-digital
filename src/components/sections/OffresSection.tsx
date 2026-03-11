import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Star, Zap, Shield, Users, Globe, FileSignature, CreditCard, Headphones, CalendarDays, RefreshCw } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants, SectionTransition, Hover3DCard } from "@/components/animations";

type Tier = "starter" | "business" | "enterprise";

interface Pack {
  name: string;
  tier: Tier;
  tagline: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  modulesLimit: string;
  engagement: string;
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
    priceAnnual: 1260,
    modulesLimit: "3 modules au choix",
    engagement: "Sans engagement",
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
    priceAnnual: 2100,
    modulesLimit: "6 modules au choix",
    engagement: "Sans engagement",
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
    priceMonthly: 500,
    priceAnnual: 4200,
    modulesLimit: "Tous les modules",
    engagement: "6 mois minimum",
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
    border: "border-gray-200 hover:border-gray-300",
    badge: "bg-gray-100 text-gray-600",
    glow: "",
    check: "text-gray-500",
  },
  business: {
    border: "border-[#22c55e]/40 hover:border-[#22c55e]/60",
    badge: "bg-[#22c55e]/10 text-[#22c55e]",
    glow: "shadow-[0_0_60px_-10px_rgba(34,197,94,0.15)]",
    check: "text-[#22c55e]",
  },
  enterprise: {
    border: "border-amber-400/30 hover:border-amber-400/50",
    badge: "bg-amber-500/10 text-amber-600",
    glow: "shadow-[0_0_60px_-10px_rgba(245,158,11,0.1)]",
    check: "text-amber-500",
  },
};

const includedForAll = [
  { icon: Globe, label: "Sous-domaine personnalisé (ex: monentreprise.mba.com)" },
  { icon: Users, label: "Multi-utilisateurs illimités" },
  { icon: FileSignature, label: "Signature électronique" },
  { icon: CreditCard, label: "Stripe Connect" },
  { icon: Shield, label: "Hébergement sécurisé" },
  { icon: Headphones, label: "Support réactif" },
  { icon: CalendarDays, label: "Prise de RDV en ligne" },
  { icon: RefreshCw, label: "Mises à jour incluses" },
];

export function OffresSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="offres" className="bg-white">
      <SectionTransition className="py-24 md:py-32 relative" parallaxStrength={0.05}>
        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
            <ScrollReveal variant="fadeInUp">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6">
                Nos offres
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-light mb-6 text-gray-900">
                Un CRM modulaire.{" "}
                <span className="font-medium text-gradient-neon">À votre image.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="text-gray-600 font-light mb-8">
                Choisissez votre plan, activez vos modules, gérez votre activité. Simple.
              </p>
            </ScrollReveal>

            {/* Annual/Monthly toggle */}
            <ScrollReveal variant="fadeInUp" delay={0.3}>
              <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-2 py-1.5">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !isAnnual ? "bg-[#22c55e] text-white shadow-lg shadow-[#22c55e]/30" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Mensuel
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isAnnual ? "bg-[#22c55e] text-white shadow-lg shadow-[#22c55e]/30" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Annuel
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 font-bold">
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
                      className={`relative h-full rounded-2xl bg-white p-8 md:p-10 transition-all duration-500 border ${styles.border} ${styles.glow} ${
                        pack.recommended ? "lg:-translate-y-4 lg:scale-[1.02]" : ""
                      }`}
                    >
                      {/* Recommended Badge */}
                      {pack.recommended && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#22c55e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-[#22c55e]/30">
                          <Star className="h-3 w-3 fill-current" />
                          Recommandé
                        </div>
                      )}

                      {/* Header */}
                      <div className="mb-8">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${styles.badge}`}>
                          {pack.name}
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">{pack.tagline}</h3>
                        <p className="text-gray-600">{pack.description}</p>
                      </div>

                      {/* Price */}
                      <div className="mb-8 pb-8 border-b border-gray-200">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl md:text-4xl font-light tracking-tight text-gray-900">{price}€</span>
                          <span className="text-gray-500 text-sm">{priceLabel} HT</span>
                        </div>
                        <p className="text-sm text-gray-600 font-light mt-1 flex items-center gap-1.5">
                          <Zap className="h-3.5 w-3.5 text-[#22c55e]" />
                          {pack.modulesLimit}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{pack.engagement}</p>
                      </div>

                      {/* Features */}
                      <div className="mb-8">
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                          Inclus
                        </p>
                        <ul className="space-y-3">
                          {pack.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${styles.check}`} />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA */}
                      <Link
                        to={`/contact?subject=Abonnement%20MBA%20-%20${encodeURIComponent(pack.name)}`}
                        className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                          pack.recommended
                            ? "btn-gradient text-white"
                            : "border border-gray-300 text-gray-900 hover:border-[#22c55e]/50"
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
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">
                Inclus dans toutes les offres
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {includedForAll.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 bg-gray-50"
                  >
                    <item.icon className="h-5 w-5 text-[#22c55e]" />
                    <span className="text-xs text-center text-gray-600">{item.label}</span>
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
