import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollReveal, StaggerContainer, SectionTransition, ParallaxBackground } from "@/components/animations";

const faqs = [
  {
    question: "Qu'est-ce que MBA ?",
    answer: "MBA (My Business Assistant) est une plateforme CRM modulaire conçue pour les métiers de services. Elle centralise la gestion de vos clients, dossiers, devis, factures, stock et bien plus dans une interface unique et intuitive, adaptée à votre secteur d'activité.",
  },
  {
    question: "Combien de modules puis-je activer ?",
    answer: "Cela dépend de votre offre. L'offre Starter inclut jusqu'à 3 modules, l'offre Business jusqu'à 6 modules, et l'offre Enterprise vous donne un accès illimité à tous les modules ainsi que la possibilité de créer des espaces personnalisés.",
  },
  {
    question: "Puis-je changer d'offre à tout moment ?",
    answer: "Oui, vous pouvez passer d'une offre à une autre (upgrade ou downgrade) à tout moment depuis votre espace client. Le changement prend effet immédiatement et votre facturation est ajustée au prorata.",
  },
  {
    question: "Comment se passe l'onboarding ?",
    answer: "L'inscription prend moins de 2 minutes. Vous créez votre compte, choisissez votre offre et sélectionnez les modules adaptés à votre activité. Vous pouvez ensuite inviter vos collaborateurs et commencer à travailler immédiatement.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Absolument. MBA utilise un hébergement cloud sécurisé avec chiffrement des données en transit et au repos. Chaque utilisateur n'accède qu'aux données qui le concernent grâce à un système de sécurité par rôle (Row Level Security). Des sauvegardes automatiques sont effectuées quotidiennement.",
  },
  {
    question: "Puis-je personnaliser les espaces de travail ?",
    answer: "Avec l'offre Enterprise, vous pouvez créer des espaces de travail entièrement personnalisés : choisissez les modules visibles, définissez les rôles et organisez l'interface selon les besoins de chaque équipe ou département.",
  },
];

const faqItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export function FAQ() {
  return (
    <SectionTransition className="py-24 relative" parallaxStrength={0.05}>
      <ParallaxBackground speed={0.15}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-red/5 to-transparent" />
      </ParallaxBackground>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <ScrollReveal variant="fadeInUp">
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              Questions <span className="font-medium text-gradient-neon">Fréquentes</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              Tout ce que vous devez savoir sur MBA et son fonctionnement.
            </p>
          </ScrollReveal>
        </div>

        <div className="max-w-3xl mx-auto">
          <StaggerContainer staggerDelay={0.08} delayStart={0.2}>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div key={index} variants={faqItemVariants}>
                  <AccordionItem
                    value={`item-${index}`}
                    className="glass-card glass-noise rounded-xl px-6 data-[state=open]:border-neon-red/30 transition-all duration-300 hover:border-neon-red/20"
                  >
                    <AccordionTrigger className="text-left text-lg font-medium py-5 hover:text-neon-red hover:no-underline transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </StaggerContainer>
        </div>

        <ScrollReveal variant="fadeInUp" delay={0.5}>
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Vous avez une autre question ?
            </p>
            <motion.a
              href="/contact?subject=Question%20MBA"
              className="inline-flex items-center gap-2 text-neon-red hover:text-neon-red/80 font-medium transition-colors"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              Contactez-nous directement
              <span className="text-xl">→</span>
            </motion.a>
          </div>
        </ScrollReveal>
      </div>
    </SectionTransition>
  );
}
