import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal, SectionTransition } from "@/components/animations";

export function CTAFinal() {
  return (
    <section id="contact" className="bg-white">
      <SectionTransition className="py-24 md:py-32 relative overflow-hidden" parallaxStrength={0.08} scaleOnScroll>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal variant="scaleIn" duration={0.8}>
              <div className="text-center relative overflow-hidden p-10 md:p-16 lg:p-20 rounded-2xl border border-gray-200 bg-gray-50">
                <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/5 via-transparent to-emerald-600/5 rounded-[inherit]" />
                <div className="relative z-10">
                  <ScrollReveal variant="fadeInUp" delay={0.1}>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 tracking-tight text-gray-900">
                      Prêt à simplifier votre{" "}
                      <span className="font-medium text-gradient-neon">gestion ?</span>
                    </h2>
                  </ScrollReveal>

                  <ScrollReveal variant="fadeInUp" delay={0.2}>
                    <p className="text-lg md:text-xl text-gray-600 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
                      Demandez une démo personnalisée et découvrez comment MBA peut transformer votre quotidien.
                    </p>
                  </ScrollReveal>

                  <ScrollReveal variant="fadeInUp" delay={0.3}>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          to="/contact?subject=Demo%20MBA"
                          className="btn-gradient inline-flex items-center justify-center gap-3 px-8 py-4 text-white font-semibold rounded-xl text-lg"
                        >
                          Demander une démo
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </motion.div>

                      <Link
                        to="/demo"
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold rounded-xl text-lg border border-gray-300 text-gray-900 hover:border-[#22c55e]/50 transition-colors"
                      >
                        Essayer la démo
                      </Link>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal variant="fadeIn" delay={0.5}>
                    <div className="mt-10 pt-8 border-t border-gray-200">
                      <a
                        href="mailto:contact@mybusinessassistant.fr"
                        className="text-gray-500 hover:text-[#22c55e] transition-colors text-sm"
                      >
                        contact@mybusinessassistant.fr
                      </a>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </SectionTransition>
    </section>
  );
}
