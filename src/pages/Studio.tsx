import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Target, Users, Award } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect } from "react";
import { ScrollReveal, StaggerContainer, staggerItemVariants, SectionTransition } from "@/components/animations";

const values = [
  {
    icon: Zap,
    title: "Innovation",
    description: "Nous repoussons constamment les limites du possible."
  },
  {
    icon: Target,
    title: "Précision",
    description: "Chaque pixel, chaque ligne de code est pensée pour la perfection."
  },
  {
    icon: Users,
    title: "Partenariat",
    description: "Votre partenaire de croissance digital, pas un simple prestataire."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Notre standard est l'excellence, notre objectif dépasser vos attentes."
  }
];

const timeline = [
  {
    year: "2024",
    title: "Naissance d'IMPARTIAL",
    description: "Création du studio avec une vision claire : révolutionner le digital."
  },
  {
    year: "2025",
    title: "Innovation 360°",
    description: "Lancement de notre offre écosystème complet pour les startups."
  },
  {
    year: "2026",
    title: "Expansion",
    description: "Ouverture vers de nouveaux marchés à l'échelle mondiale."
  }
];

const Studio = () => {
  // Mouse tracking for subtle gradient
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 30, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / innerWidth);
      mouseY.set((clientY - innerHeight / 2) / innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const gradientX = useTransform(smoothMouseX, [-0.5, 0.5], ["40%", "60%"]);
  const gradientY = useTransform(smoothMouseY, [-0.5, 0.5], ["40%", "60%"]);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[60svh] flex items-center justify-center overflow-hidden pt-24">
        <motion.div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse 80% 60% at ${gradientX} ${gradientY}, hsl(var(--neon-violet) / 0.12), transparent 70%)`,
          }}
        />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <motion.p
              className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Le Studio
            </motion.p>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-8 tracking-tight leading-[1.1]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="block">Studio</span>
              <span className="block mt-2 font-medium text-gradient-neon">IMPARTIAL.</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Un collectif de créatifs et de technologues passionnés, unis par une vision : 
              transformer vos idées en expériences digitales extraordinaires.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <SectionTransition className="py-24 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <ScrollReveal variant="fadeInLeft">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Notre vision</p>
              </ScrollReveal>

              <ScrollReveal variant="fadeInLeft" delay={0.1}>
                <h2 className="text-3xl md:text-4xl font-light mb-8">
                  Créer l'<span className="font-medium text-gradient-neon">extraordinaire</span>
                </h2>
              </ScrollReveal>

              <ScrollReveal variant="fadeInLeft" delay={0.2}>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed font-light">
                  Chez IMPARTIAL, nous croyons que le digital ne doit pas être un compromis. 
                  Nous fusionnons l'esthétique gaming et tech avec une approche premium pour 
                  créer des expériences qui marquent les esprits.
                </p>
              </ScrollReveal>

              <ScrollReveal variant="fadeInLeft" delay={0.3}>
                <p className="text-muted-foreground text-lg leading-relaxed font-light">
                  Notre nom ? <span className="text-foreground font-medium">IMPARTIAL</span>. 
                  Parce que nous abordons chaque projet sans préjugé, avec un regard neuf et 
                  une objectivité totale pour trouver LA meilleure solution pour vous.
                </p>
              </ScrollReveal>
            </div>

            <ScrollReveal variant="fadeInRight" delay={0.2}>
              <div className="aspect-square rounded-3xl border border-white/5 bg-white/[0.02] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl md:text-7xl font-light text-gradient-neon mb-4">
                    100%
                  </div>
                  <p className="text-lg text-muted-foreground">Engagement client</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </SectionTransition>

      {/* Timeline */}
      <SectionTransition className="py-24 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal variant="fadeInUp">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6 text-center">Notre parcours</p>
              <h2 className="text-3xl md:text-4xl font-light mb-16 text-center">
                Les étapes <span className="font-medium text-gradient-neon">clés</span>
              </h2>
            </ScrollReveal>

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <ScrollReveal key={item.year} variant="fadeInUp" delay={index * 0.1}>
                  <div className="flex gap-8 items-start p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-500">
                    <div className="text-3xl font-light text-gradient-neon shrink-0">
                      {item.year}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </SectionTransition>

      {/* Values Section */}
      <SectionTransition className="py-24 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <ScrollReveal variant="fadeInUp">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Nos valeurs</p>
              <h2 className="text-3xl md:text-4xl font-light">
                Ce qui nous <span className="font-medium text-gradient-neon">guide</span>
              </h2>
            </ScrollReveal>
          </div>

          <StaggerContainer 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto" 
            staggerDelay={0.1}
          >
            {values.map((value) => (
              <motion.div key={value.title} variants={staggerItemVariants}>
                <div className="group h-full p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-500 text-center">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="h-5 w-5 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </SectionTransition>

      {/* CTA Section */}
      <SectionTransition className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <ScrollReveal variant="fadeInUp">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Rejoignez-nous</p>
              
              <h2 className="text-3xl md:text-4xl font-light mb-6">
                Prêt à rejoindre l'<span className="font-medium text-gradient-neon">aventure</span> ?
              </h2>

              <p className="text-lg text-muted-foreground mb-10 font-light">
                Discutons de votre projet et voyons comment nous pouvons créer quelque chose d'exceptionnel ensemble.
              </p>

              <Link to="/contact">
                <motion.span
                  className="group relative inline-flex items-center gap-3 px-8 py-4 text-sm font-medium tracking-wide uppercase overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="absolute inset-0 bg-white rounded-full" />
                  <span className="absolute inset-0 bg-gradient-to-r from-violet-500 to-violet-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <span className="relative text-background group-hover:text-white transition-colors duration-500">
                    Nous contacter
                  </span>
                  <ArrowRight className="relative h-4 w-4 text-background group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                </motion.span>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </SectionTransition>
    </Layout>
  );
};

export default Studio;
