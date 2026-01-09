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
    question: "Quels sont vos délais de réalisation ?",
    answer: "Les délais varient selon la complexité du projet. Un site vitrine prend généralement 2-4 semaines, une application mobile 2-4 mois, et un écosystème 360° de 4 à 8 mois. Nous établissons un planning détaillé dès le début du projet.",
  },
  {
    question: "Quelles technologies utilisez-vous ?",
    answer: "Nous utilisons les technologies les plus modernes et performantes : React, Next.js, React Native, Flutter pour le frontend, Node.js, Python pour le backend, et des solutions cloud comme AWS, Supabase et Firebase. Le choix dépend des besoins spécifiques de votre projet.",
  },
  {
    question: "Proposez-vous de la maintenance après la livraison ?",
    answer: "Oui, nous proposons des contrats de maintenance adaptés à chaque type de projet. Cela inclut les mises à jour de sécurité, les corrections de bugs, le monitoring des performances et le support technique prioritaire.",
  },
  {
    question: "Comment se déroule un projet avec IMPARTIAL ?",
    answer: "Notre processus se décompose en 5 phases : Discovery (compréhension de vos besoins), Design (maquettes et prototypes), Développement (réalisation technique), Tests (qualité et performance), et Déploiement (mise en production avec accompagnement).",
  },
  {
    question: "Puis-je modifier mon projet après la livraison ?",
    answer: "Absolument ! Nous vous livrons un code propre et documenté. Vous pouvez soit gérer les évolutions en interne, soit nous confier la maintenance et les évolutions via un contrat dédié.",
  },
  {
    question: "Travaillez-vous avec des clients internationaux ?",
    answer: "Oui, nous collaborons avec des clients dans toute la francophonie et à l'international. Nos équipes sont habituées au travail à distance avec des outils de collaboration modernes.",
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
      {/* Background */}
      <ParallaxBackground speed={0.15}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-red/5 to-transparent" />
      </ParallaxBackground>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal variant="fadeInUp">
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              Questions <span className="font-medium text-gradient-neon">Fréquentes</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              Retrouvez les réponses aux questions les plus courantes sur nos services et notre façon de travailler.
            </p>
          </ScrollReveal>
        </div>

        {/* Accordion */}
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

        {/* CTA */}
        <ScrollReveal variant="fadeInUp" delay={0.5}>
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Vous avez une autre question ?
            </p>
            <motion.a
              href="/contact"
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
