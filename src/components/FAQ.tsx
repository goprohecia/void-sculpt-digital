import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

export function FAQ() {
  return (
    <section className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-red/5 to-transparent" />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Questions <span className="text-neon-red">Fréquentes</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Retrouvez les réponses aux questions les plus courantes sur nos services et notre façon de travailler.
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-dark rounded-xl border border-border/50 px-6 data-[state=open]:border-neon-red/30 transition-all duration-300"
              >
                <AccordionTrigger className="text-left text-lg font-medium py-5 hover:text-neon-red hover:no-underline transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Vous avez une autre question ?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-neon-red hover:text-neon-red/80 font-medium transition-colors"
          >
            Contactez-nous directement
            <span className="text-xl">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
