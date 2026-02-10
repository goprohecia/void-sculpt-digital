import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal, SectionTransition, ParallaxBackground } from "@/components/animations";

export function CTAFinal() {
  return (
    <section id="contact">
    <SectionTransition className="py-24 md:py-32 relative overflow-hidden" parallaxStrength={0.08} scaleOnScroll>
      {/* Background Effects */}
      <ParallaxBackground speed={0.3}>
        <div className="absolute inset-0 bg-gradient-to-r from-neon-violet/10 via-purple-600/10 to-blue-600/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] lg:w-[800px] h-[400px] md:h-[600px] lg:h-[800px] bg-violet-600/15 rounded-full blur-[200px]" />
      </ParallaxBackground>
      <div className="absolute top-0 right-0 w-[200px] md:w-[300px] lg:w-[400px] h-[200px] md:h-[300px] lg:h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[200px] md:w-[300px] lg:w-[400px] h-[200px] md:h-[300px] lg:h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Glassmorphism Card */}
          <ScrollReveal variant="scaleIn" duration={0.8}>
            <div className="glass-ultra glass-noise text-center relative overflow-hidden p-10 md:p-16 lg:p-20">
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/10 via-transparent to-purple-600/10 rounded-[inherit]" />

              <div className="relative z-10">
                <ScrollReveal variant="fadeInUp" delay={0.1}>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 tracking-tight">
                    Prêt à rendre votre produit{" "}
                    <span className="font-medium text-gradient-neon">inoubliable ?</span>
                  </h2>
                </ScrollReveal>

                <ScrollReveal variant="fadeInUp" delay={0.2}>
                  <p className="text-lg md:text-xl text-muted-foreground font-light mb-10 max-w-2xl mx-auto leading-relaxed">
                    On vous répond sous 24–48h avec une proposition claire et sans engagement.
                  </p>
                </ScrollReveal>

                <ScrollReveal variant="fadeInUp" delay={0.3}>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <motion.a
                      href="https://calendly.com/yannis-bezriche/impartial-games"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gradient inline-flex items-center justify-center gap-3 px-8 py-4 text-white font-semibold rounded-xl text-lg"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Planifier un appel
                      <ArrowRight className="h-5 w-5" />
                    </motion.a>

                    <Link
                      to="/contact"
                      className="glass-button inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold rounded-xl text-lg hover:border-neon-violet/50"
                    >
                      <Mail className="h-5 w-5" />
                      Écrire un message
                    </Link>
                  </div>
                </ScrollReveal>

                {/* Contact info */}
                <ScrollReveal variant="fadeIn" delay={0.5}>
                  <div className="mt-10 pt-8 border-t border-white/10">
                    <a
                      href="mailto:studio@impartialgames.com"
                      className="text-muted-foreground hover:text-neon-violet transition-colors text-sm"
                    >
                      studio@impartialgames.com
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
